/* ProxyFaMega — storage layer (promisified, sync-aware, snapshot support) */
'use strict';

var Store = (function () {
  var apiNS = (typeof browser !== 'undefined' && browser && browser.storage) ? browser : (typeof chrome !== 'undefined' ? chrome : null);

  function areaObj(name) {
    return apiNS.storage[name === 'sync' ? 'sync' : 'local'];
  }

  function call(areaName, method, arg) {
    var obj = areaObj(areaName);
    var maybePromise = obj[method](arg);
    if (maybePromise && typeof maybePromise.then === 'function') return maybePromise;
    return new Promise(function (resolve, reject) {
      obj[method](arg, function (res) {
        var err = (apiNS.runtime && apiNS.runtime.lastError) || null;
        if (err) reject(new Error(err.message));
        else resolve(res);
      });
    });
  }

  function get(area, key) { return call(area, 'get', key).then(function (r) { return r && r[key]; }); }
  function set(area, obj) { return call(area, 'set', obj); }

  function uid() {
    return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  /* Fill any missing fields (keeps forward/backward compat + imported data safe) */
  function migrate(st) {
    var d = defaultState();
    if (!st || typeof st !== 'object') return d;
    st.settings = Object.assign({}, d.settings, st.settings || {});
    st.profiles = Array.isArray(st.profiles) ? st.profiles : [];
    st.profiles.forEach(function (p) {
      p.bypass = Array.isArray(p.bypass) ? p.bypass : (p.bypass ? String(p.bypass).split('\n') : []);
    });
    if (!st.autoSwitch || typeof st.autoSwitch !== 'object') st.autoSwitch = d.autoSwitch;
    st.autoSwitch.defaultAction = st.autoSwitch.defaultAction || 'direct';
    st.autoSwitch.rules = Array.isArray(st.autoSwitch.rules) ? st.autoSwitch.rules : [];
    st.autoSwitch.rules = st.autoSwitch.rules.filter(function (r) { return r && r.pattern; }).map(function (r) {
      return {
        id: r.id || uid(),
        type: ['domain', 'url', 'regex'].indexOf(r.type) !== -1 ? r.type : 'domain',
        pattern: String(r.pattern),
        action: r.action || 'direct',
        enabled: r.enabled !== false,
      };
    });
    if (!st.mode) st.mode = 'system';
    if (['system', 'direct', 'profile', 'auto'].indexOf(st.mode) === -1) st.mode = 'system';
    if (!st.currentProfileId && st.profiles.length) st.currentProfileId = st.profiles[0].id;
    st.rev = st.rev || 1;
    return st;
  }

  var Store = {
    KEY: PFM.KEY_STATE,
    SNAP: PFM.KEY_SNAPSHOTS,

    load: function () {
      var self = this;
      return get('local', this.KEY).then(function (st) {
        if (st) return migrate(st);
        return get('sync', self.KEY).then(function (synced) {
          var s = migrate(synced || defaultState());
          return set('local', { [self.KEY]: s }).then(function () { return s; });
        });
      });
    },

    save: function (st) {
      var self = this;
      st.rev = (st.rev || 0) + 1;
      st.updatedAt = Date.now();
      var payload = JSON.parse(JSON.stringify(st)); /* strip live refs */
      return set('local', { [self.KEY]: payload }).then(function () {
        if (!st.settings.sync) return { ok: true };
        return set('sync', { [self.KEY]: payload }).then(
          function () { return { ok: true }; },
          function () {
            /* sync quota exceeded — disable sync, keep local as source of truth */
            st.settings.sync = false;
            payload.settings.sync = false;
            return set('local', { [self.KEY]: payload }).then(function () {
              return { ok: true, error: 'sync-quota' };
            });
          }
        );
      });
    },

    switchMode: function (st, opts) {
      st.applied = true;
      st.mode = opts.mode;
      if (opts.profileId) st.currentProfileId = opts.profileId;
      if (st.mode === 'profile' && !findProfile(st, st.currentProfileId)) {
        st.currentProfileId = st.profiles.length ? st.profiles[0].id : null;
      }
      return this.save(st).then(function (r) {
        return { state: st, result: r };
      });
    },

    /* ---------- snapshots (local only) ---------- */
    listSnapshots: function () {
      return get('local', this.SNAP).then(function (list) {
        return Array.isArray(list) ? list : [];
      });
    },

    addSnapshot: function (label, st) {
      var self = this;
      var json = JSON.stringify(st);
      return this.listSnapshots().then(function (list) {
        list.unshift({ id: uid(), at: Date.now(), label: label || '', json: json });
        if (list.length > PFM.MAX_SNAPSHOTS) list = list.slice(0, PFM.MAX_SNAPSHOTS);
        return set('local', { [self.SNAP]: list }).then(function () { return list; });
      });
    },

    deleteSnapshot: function (id) {
      var self = this;
      return this.listSnapshots().then(function (list) {
        return set('local', { [self.SNAP]: list.filter(function (s) { return s.id !== id; }) });
      });
    },

    restoreSnapshot: function (id) {
      var self = this;
      return this.listSnapshots().then(function (list) {
        var snap = list.filter(function (s) { return s.id === id; })[0];
        if (!snap) return null;
        var st = migrate(JSON.parse(snap.json));
        return self.save(st).then(function () { return st; });
      });
    },

    onChanged: function (cb) {
      if (apiNS && apiNS.storage && apiNS.storage.onChanged) {
        apiNS.storage.onChanged.addListener(function (changes, area) {
          if (changes && (PFM.KEY_STATE in changes)) cb(changes[PFM.KEY_STATE].newValue, area);
        });
      }
    },
  };

  return Store;
})();
