/* ProxyFaMega — boot: environment detection, demo/mock mode, early theme cache */
'use strict';

(function () {
  var proto = location.protocol;
  var IS_EXT = proto === 'chrome-extension:' || proto === 'moz-extension:';
  window.PFM_ENV = { ext: IS_EXT, demo: !IS_EXT };

  /* early cached UI prefs to avoid flash-of-wrong-theme */
  try {
    var cached = JSON.parse(localStorage.getItem('pfm:ui') || '{}');
    if (cached.lang) {
      document.documentElement.lang = cached.lang;
      document.documentElement.dir = cached.lang === 'fa' ? 'rtl' : 'ltr';
    }
    if (cached.mode) document.documentElement.dataset.mode = cached.mode;
    if (cached.vars) {
      var st = document.documentElement.style;
      Object.keys(cached.vars).forEach(function (k) { st.setProperty(k, cached.vars[k]); });
    }
  } catch (e) { /* ignore */ }

  if (!IS_EXT) {
    var q = new URLSearchParams(location.search);
    window.PFM_DEMO_PARAMS = {
      lang: q.get('lang'), theme: q.get('theme'), mode: q.get('mode'), view: q.get('view'),
    };
  }

  /* ------------------------------------------------------------------ */
  /* Demo/mock chrome — lets the UI run as a normal web page (screenshots, previews) */
  function installMock() {
    var scriptUrl = document.currentScript ? document.currentScript.src : location.href;
    var ROOT = new URL('../../', scriptUrl).href;
    var mem = {};
    var changeListeners = [];

    function fire() {
      changeListeners.forEach(function (fn) {
        try { fn({ [PFM_KEY]: { newValue: mem[PFM_KEY] } }, 'local'); } catch (e) { /* noop */ }
      });
    }
    var PFM_KEY = 'pfm:state';

    function seed() {
      if (!mem[PFM_KEY]) {
        var s = (typeof defaultState === 'function') ? defaultState() : null;
        if (s) {
          var dp = window.PFM_DEMO_PARAMS || {};
          if (dp.lang) s.settings.lang = dp.lang;
          if (dp.theme) s.settings.themeId = dp.theme;
          if (dp.mode === 'dark' || dp.mode === 'light') s.settings.appearance = dp.mode;
          mem[PFM_KEY] = s;
        }
      }
      return mem[PFM_KEY];
    }

    function area() {
      return {
        get: function (keys, cb) {
          var res = {};
          var arr = Array.isArray(keys) ? keys : [keys];
          arr.forEach(function (k) {
            if (k === PFM_KEY) seed();
            if (mem[k] !== undefined) res[k] = JSON.parse(JSON.stringify(mem[k]));
          });
          var p = Promise.resolve(res);
          if (cb) p.then(cb);
          return p;
        },
        set: function (obj, cb) {
          Object.keys(obj).forEach(function (k) { mem[k] = JSON.parse(JSON.stringify(obj[k])); });
          setTimeout(fire, 0);
          var p = Promise.resolve();
          if (cb) p.then(cb);
          return p;
        },
        remove: function (keys, cb) {
          (Array.isArray(keys) ? keys : [keys]).forEach(function (k) { delete mem[k]; });
          var p = Promise.resolve();
          if (cb) p.then(cb);
          return p;
        },
        getBytesInUse: function (keys, cb) {
          var n = 0;
          Object.keys(mem).forEach(function (k) { n += (mem[k] ? JSON.stringify(mem[k]).length : 0); });
          var p = Promise.resolve(n);
          if (cb) p.then(cb);
          return p;
        },
      };
    }

    function handleMessage(msg) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          if (!msg || !msg.type) return resolve({ ok: false });
          if (msg.type === 'get-state') {
            resolve({ ok: true, state: seed() });
          } else if (msg.type === 'switch') {
            var s = seed();
            s.applied = true;
            s.mode = msg.mode;
            if (msg.profileId) s.currentProfileId = msg.profileId;
            s.rev = (s.rev || 0) + 1;
            resolve({ ok: true, state: s });
          } else if (msg.type === 'test-latency') {
            var t0 = Date.now();
            fetch('https://www.gstatic.com/generate_204?x=' + Date.now(), { cache: 'no-store' })
              .then(function () { resolve({ ok: true, ms: Date.now() - t0 }); })
              .catch(function () { resolve({ ok: false }); });
          } else {
            resolve({ ok: false });
          }
        }, 40);
      });
    }

    var noop = function () {};
    window.chrome = {
      runtime: {
        lastError: null,
        getURL: function (p) { return new URL(p, ROOT).href; },
        getManifest: function () { return { version: '1.0.0' }; },
        sendMessage: function (msg, cb) {
          var p = handleMessage(msg);
          if (cb) p.then(cb);
          return p;
        },
        onMessage: { addListener: noop, removeListener: noop },
        openOptionsPage: function () {
          if (location.pathname.indexOf('/options/') === -1) location.href = new URL('options/options.html', ROOT).href;
        },
      },
      storage: {
        local: area(),
        sync: area(),
        onChanged: { addListener: function (fn) { changeListeners.push(fn); }, removeListener: noop },
      },
      action: { setBadgeText: noop, setBadgeBackgroundColor: noop, setTitle: noop },
      browserAction: { setBadgeText: noop, setBadgeBackgroundColor: noop, setTitle: noop },
      contextMenus: { create: noop, removeAll: noop, update: noop, onClicked: { addListener: noop } },
      notifications: { create: function (_o) { /* silent in demo */ } },
      commands: { onCommand: { addListener: noop } },
      i18n: { getMessage: function (k) { return k; } },
    };
  }

  if (!IS_EXT && (typeof chrome === 'undefined' || !chrome.storage)) {
    installMock();
  }
})();
