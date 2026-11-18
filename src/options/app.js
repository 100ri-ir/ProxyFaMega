/* ProxyFaMega — options app shell (router, autosave, topbar, sidebar) */
'use strict';

window.App = {
  state: null,
  route: 'dashboard',
  _saveTimer: null,
  _lastKnownRev: 0,
  _suppressChange: false,
};

(function () {
  var NAV_ITEMS = [
    { id: 'dashboard', icon: 'home', key: 'nav.dashboard' },
    { id: 'profiles', icon: 'layers', key: 'nav.profiles' },
    { id: 'auto', icon: 'shuffle', key: 'nav.auto' },
    { id: 'settings', icon: 'gear', key: 'nav.settings' },
    { id: 'backup', icon: 'database', key: 'nav.backup' },
    { id: 'about', icon: 'info', key: 'nav.about' },
  ];

  /* ---------------- save indicator ---------------- */
  function setSaveStatus(status) {
    var dot = document.getElementById('saveDot');
    var txt = document.getElementById('saveText');
    dot.classList.toggle('saving', status === 'saving');
    txt.textContent = i18n.t(status === 'saving' ? 'app.saving' : 'app.saved');
  }

  /* ---------------- state mutation + autosave ---------------- */
  App.update = function (mutator, opts) {
    opts = opts || {};
    if (opts.snapshot) Store.addSnapshot(opts.snapshot, App.state); /* synchronous stringify = pre-change copy */
    mutator(App.state);
    scheduleSave(opts);
    if (opts.rerender !== false) App.rerender();
  };

  App.setState = function (newState) {
    App.state = newState;
    scheduleSave({});
    App.rerender();
  };

  function scheduleSave(opts) {
    setSaveStatus('saving');
    clearTimeout(App._saveTimer);
    App._saveTimer = setTimeout(function () {
      Store.save(App.state).then(function (r) {
        if (r && r.error === 'sync-quota') UI.toast(i18n.t('set.syncQuota'), 'err');
        setSaveStatus('saved');
        if (App.state.settings.saveToast && opts && opts.toast) UI.toast(i18n.t('toast.saved'), 'ok');
        App._suppressChange = true;
        setTimeout(function () { App._suppressChange = false; }, 800);
      });
    }, 350);
  }

  /* snapshot on major operations */
  App._snapshot = function (label) {
    return Store.addSnapshot(label, App.state);
  };

  /* rerender current view */
  App.rerender = function () {
    var root = document.getElementById('viewRoot');
    root.innerHTML = '';
    var view = VIEWS[App.route] || VIEWS.dashboard;
    view.render(root);
    document.getElementById('viewTitle').innerHTML =
      UI.icon(view.icon, 20) + '<span></span>';
    document.getElementById('viewTitle').querySelector('span').textContent = i18n.t('nav.' + App.route);
    renderNav();
  };

  /* switch proxy mode through the background */
  App.switchTo = function (mode, profileId) {
    UI.sendMsg({ type: 'switch', mode: mode, profileId: profileId }).then(function (res) {
      if (res && res.ok && res.state) {
        App.state = res.state;
        applyUiTheme(App.state);
        App.rerender();
        UI.toast(i18n.t('toast.switched'), 'ok');
      } else {
        UI.toast(i18n.t('toast.switchFail'), 'err');
      }
    });
  };

  /* ---------------- nav ---------------- */
  function renderNav() {
    var nav = document.getElementById('nav');
    nav.innerHTML = '';
    NAV_ITEMS.forEach(function (item) {
      var b = document.createElement('button');
      b.className = 'nav-item' + (App.route === item.id ? ' on' : '');
      b.innerHTML = UI.icon(item.icon, 19);
      var span = document.createElement('span');
      span.textContent = i18n.t(item.key);
      b.appendChild(span);
      b.onclick = function () { goto(item.id); };
      nav.appendChild(b);
    });
  }

  function goto(route) {
    if (!VIEWS[route]) route = 'dashboard';
    App.route = route;
    try { localStorage.setItem('pfm:route', route); } catch (e) { /* ignore */ }
    location.hash = '#/' + route;
    App.rerender();
  }
  App.goto = goto;

  /* ---------------- topbar ---------------- */
  function bindTopbar() {
    var btn = document.getElementById('appearanceBtn');
    function updateBtn() {
      var ap = App.state.settings.appearance;
      btn.innerHTML = UI.icon(ap === 'auto' ? 'monitor' : (ap === 'dark' ? 'moon' : 'sun'), 16) +
        '<span style="font-size:0.75rem;font-weight:700"></span>';
      btn.title = i18n.t('set.appearance');
      btn.querySelector('span').textContent = i18n.t('set.app.' + ap);
    }
    btn.onclick = function () {
      var order = ['auto', 'light', 'dark'];
      var cur = App.state.settings.appearance;
      var next = order[(order.indexOf(cur) + 1) % order.length];
      App.state.settings.appearance = next;
      applyUiTheme(App.state);
      updateBtn();
      App.update(function () {}, { rerender: false });
    };
    updateBtn();

    document.querySelectorAll('#langSeg button').forEach(function (b) {
      b.classList.toggle('on', b.getAttribute('data-lang') === App.state.settings.lang);
      b.onclick = function () {
        var lang = b.getAttribute('data-lang');
        App.update(function (st) { st.settings.lang = lang; }, { rerender: false });
        i18n.setLang(lang);
        applyLangGlobal(lang);
        applyUiTheme(App.state);
        updateBtn();
        App.rerender();
        UI.toast(i18n.t('set.langDone'), 'ok');
      };
    });
  }

  /* ---------------- boot ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
    Store.load().then(function (st) {
      App.state = st;
      App._lastKnownRev = st.rev;
      i18n.setLang(st.settings.lang);
      applyLangGlobal(st.settings.lang);
      applyUiTheme(st);

      document.getElementById('brandVer').textContent = 'v' + PFM.VERSION;

      /* route: hash > demo param > last route > dashboard */
      var hashRoute = (location.hash || '').replace('#/', '');
      var start = hashRoute;
      if (!start && window.PFM_DEMO_PARAMS && PFM_DEMO_PARAMS.view) start = PFM_DEMO_PARAMS.view;
      if (!start) {
        try { start = localStorage.getItem('pfm:route'); } catch (e) { /* ignore */ }
      }
      App.route = VIEWS[start] ? start : 'dashboard';

      bindTopbar();
      App.rerender();
      setSaveStatus('saved');
      watchSystemTheme(function () { return App.state; });

      /* live sync with popup/background changes */
      Store.onChanged(function (newValue) {
        if (!newValue || App._suppressChange) return;
        if (newValue.rev <= App._lastKnownRev) return;
        App._lastKnownRev = newValue.rev;
        App.state = newValue;
        i18n.setLang(newValue.settings.lang);
        applyLangGlobal(newValue.settings.lang);
        applyUiTheme(newValue);
        App.rerender();
      });

      try {
        chrome.runtime.onMessage.addListener(function (msg) {
          if (msg && msg.type === 'state-changed' && msg.state) {
            if (msg.state.rev <= App._lastKnownRev) return;
            App._lastKnownRev = msg.state.rev;
            App.state = msg.state;
            App.rerender();
          }
        });
      } catch (e) { /* ignore */ }
    });
  });
})();
