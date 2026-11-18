/* ProxyFaMega — background event page (Firefox MV2) */
'use strict';

var api = (typeof browser !== 'undefined' && browser.storage) ? browser : chrome;
var MENU_CONTEXT = 'browser_action'; /* MV2 toolbar */
var badgeApi = api.browserAction || api.action;

var state = null;
var listenerOn = false;

function log() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('[ProxyFaMega]');
  console.log.apply(console, args);
}

function reloadState() {
  return Store.load().then(function (st) {
    state = st;
    i18n.setLang(st.settings.lang || 'fa');
    return st;
  });
}

/* ---------------- proxy (browser.proxy.onRequest) ---------------- */
function handleRequest(details) {
  var url = details.url || '';
  var host = '';
  try { host = new URL(url).hostname; } catch (e) { return [{ type: 'direct' }]; }

  if (!state || !state.applied || state.mode === 'system') return [{ type: 'direct' }];

  var decision = decideForUrl(state, url, host);
  if (!decision.action || decision.action === 'direct') return [{ type: 'direct' }];

  var p = findProfile(state, decision.action);
  if (!p) return [{ type: 'direct' }];

  var proto = protoById(p.protocol);
  var res = { type: proto.ff, host: p.host, port: p.port };
  /* SOCKS5: resolve DNS through the proxy (prevents DNS leak) */
  if (proto.ff === 'socks' && state.settings.remoteDns) res.proxyDNS = true;
  return [res];
}

function ensureListener() {
  var need = state && state.applied && state.mode !== 'system';
  try {
    if (need && !listenerOn) {
      api.proxy.onRequest.addListener(handleRequest, { urls: ['<all_urls>'] });
      listenerOn = true;
    } else if (!need && listenerOn) {
      api.proxy.onRequest.removeListener(handleRequest);
      listenerOn = false;
    }
  } catch (e) {
    log('listener error:', e);
  }
}

function applyProxy() { ensureListener(); }

/* ---------------- badge ---------------- */
function badgeTextFor(st) {
  if (!st.settings.badge || !st.applied) return '';
  if (st.mode === 'direct') return 'OFF';
  if (st.mode === 'system') return 'SYS';
  if (st.mode === 'auto') return 'AUTO';
  var p = findProfile(st, st.currentProfileId);
  if (!p) return '';
  var latin = String(p.name).replace(/[^A-Za-z0-9]/g, '');
  return latin ? latin.slice(0, 3).toUpperCase() : String(p.name).trim().slice(0, 2);
}

function badgeColorFor(st) {
  if (st.mode === 'auto') return themeById(st.settings.themeId).colors[0];
  var p = findProfile(st, st.currentProfileId);
  return p ? gradById(p.color).colors[0] : '#8A8F9E';
}

function applyBadge() {
  if (!state) return;
  try {
    badgeApi.setBadgeText({ text: badgeTextFor(state) });
    if (state.settings.badge && state.applied) badgeApi.setBadgeBackgroundColor({ color: badgeColorFor(state) });
  } catch (e) { /* ignore */ }
}

/* ---------------- context menus ---------------- */
function rebuildMenus() {
  if (!state || !api.contextMenus) return;
  try {
    api.contextMenus.removeAll(function () {
      var checkedMode = function (m) { return state.applied && state.mode === m; };
      api.contextMenus.create({ id: 'pfm-direct', title: i18n.t('menu.direct'), type: 'radio', checked: checkedMode('direct'), contexts: [MENU_CONTEXT] });
      api.contextMenus.create({ id: 'pfm-system', title: i18n.t('menu.system'), type: 'radio', checked: checkedMode('system'), contexts: [MENU_CONTEXT] });
      api.contextMenus.create({ id: 'pfm-auto', title: i18n.t('menu.auto'), type: 'radio', checked: checkedMode('auto'), contexts: [MENU_CONTEXT] });
      api.contextMenus.create({ type: 'separator', id: 'pfm-sep', contexts: [MENU_CONTEXT] });
      state.profiles.forEach(function (p) {
        api.contextMenus.create({
          id: 'pfm-p:' + p.id,
          title: p.icon + '  ' + p.name,
          type: 'radio',
          checked: state.applied && state.mode === 'profile' && state.currentProfileId === p.id,
          contexts: [MENU_CONTEXT],
        });
      });
    });
  } catch (e) {
    log('menu error:', e);
  }
}

function applyAll() {
  if (!state) return;
  applyProxy();
  applyBadge();
  rebuildMenus();
}

/* ---------------- switching ---------------- */
function doSwitch(mode, profileId, silent) {
  return Store.switchMode(state, { mode: mode, profileId: profileId }).then(function (r) {
    state = r.state;
    applyAll();
    broadcast();
    if (!silent && state.settings.notifications) notifySwitch();
    return state;
  });
}

function notifySwitch() {
  var info = effectiveInfo(state, function (fa, en) { return (state.settings.lang === 'fa') ? fa : en; });
  try {
    api.notifications.create({
      type: 'basic',
      iconUrl: api.runtime.getURL('assets/icons/icon128.png'),
      title: PFM.NAME,
      message: i18n.t('notify.switched', { name: info.label }),
    });
  } catch (e) { /* ignore */ }
}

function broadcast() {
  try {
    var p = api.runtime.sendMessage({ type: 'state-changed', state: state });
    if (p && typeof p.catch === 'function') p.catch(function () { /* no listener */ });
  } catch (e) { /* no listener */ }
}

/* ---------------- latency test ---------------- */
function testLatency() {
  var tryOne = function (url) {
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 5000);
    var t0 = Date.now();
    return fetch(url + (url.indexOf('?') === -1 ? '?' : '&') + 'pfm=' + Date.now(), {
      cache: 'no-store',
      signal: ctrl.signal,
    }).then(function () {
      clearTimeout(timer);
      return { ok: true, ms: Math.round(performance.now() - t0) };
    }).catch(function () {
      clearTimeout(timer);
      return { ok: false };
    });
  };
  return tryOne(TEST_ENDPOINTS[0]).then(function (r) {
    if (r.ok) return r;
    return tryOne(TEST_ENDPOINTS[1]);
  });
}

/* ---------------- events ---------------- */
api.runtime.onInstalled.addListener(function (details) {
  reloadState().then(function (st) {
    if (details.reason === 'install') {
      st.installedAt = Date.now();
      applyAll();
      api.runtime.openOptionsPage();
    } else {
      applyAll();
    }
  });
});

api.runtime.onStartup.addListener(function () {
  reloadState().then(applyAll);
});

Store.onChanged(function () {
  reloadState().then(applyAll);
});

api.runtime.onMessage.addListener(function (msg, sender) {
  return Promise.resolve().then(function () {
    if (!msg || !msg.type) return { ok: false };
    var ensure = state ? Promise.resolve(state) : reloadState();
    switch (msg.type) {
      case 'get-state':
        return ensure.then(function () { return { ok: true, state: state }; });
      case 'switch':
        return ensure.then(function () { return doSwitch(msg.mode, msg.profileId, !!msg.silent).then(function () { return { ok: true, state: state }; }); });
      case 'apply':
        return ensure.then(function () { applyAll(); return { ok: true }; });
      case 'test-latency':
        return testLatency();
      default:
        return { ok: false };
    }
  }).catch(function (e) {
    log('message error:', e);
    return { ok: false, error: String(e) };
  });
});

if (api.commands && api.commands.onCommand) {
  api.commands.onCommand.addListener(function (cmd) {
    var ensure = state ? Promise.resolve(state) : reloadState();
    ensure.then(function () {
      if (!state.profiles.length) return;
      var idx = state.mode === 'profile'
        ? state.profiles.findIndex(function (p) { return p.id === state.currentProfileId; })
        : -1;
      var dir = cmd === 'cycle-next-profile' ? 1 : -1;
      var next = idx < 0 ? (dir > 0 ? 0 : state.profiles.length - 1) : (idx + dir + state.profiles.length) % state.profiles.length;
      doSwitch('profile', state.profiles[next].id);
    });
  });
}

if (api.contextMenus && api.contextMenus.onClicked) {
  api.contextMenus.onClicked.addListener(function (info) {
    var ensure = state ? Promise.resolve(state) : reloadState();
    ensure.then(function () {
      var id = info.menuItemId;
      if (id === 'pfm-direct') doSwitch('direct');
      else if (id === 'pfm-system') doSwitch('system');
      else if (id === 'pfm-auto') doSwitch('auto');
      else if (id && String(id).indexOf('pfm-p:') === 0) doSwitch('profile', String(id).slice(6));
    });
  });
}

/* event-page startup */
reloadState().then(applyAll).catch(function (e) { log('init error:', e); });
