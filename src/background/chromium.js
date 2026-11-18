/* ProxyFaMega — background service worker (Chromium MV3: Chrome / Edge / Brave ...) */
'use strict';

importScripts(
  'common/constants.js',
  'common/i18n.js',
  'common/defaults.js',
  'common/matcher.js',
  'common/storage.js'
);

var state = null;
var MENU_CONTEXT = 'action'; /* MV3 toolbar */
var badgeApi = chrome.action || chrome.browserAction;

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

function applyAll() {
  if (!state) return;
  applyProxy();
  applyBadge();
  rebuildMenus();
}

/* ---------------- proxy ---------------- */
function applyProxy() {
  var value;
  if (!state.applied || state.mode === 'system') {
    value = { mode: 'system' };
  } else if (state.mode === 'direct') {
    value = { mode: 'direct' };
  } else if (state.mode === 'profile') {
    var p = findProfile(state, state.currentProfileId);
    if (p) {
      var proto = protoById(p.protocol);
      value = {
        mode: 'fixed_servers',
        rules: {
          singleProxy: { scheme: proto.chrome, host: p.host, port: p.port },
          bypassList: profileBypassList(state, p),
        },
      };
    } else {
      value = { mode: 'direct' };
    }
  } else if (state.mode === 'auto') {
    value = {
      mode: 'pac_script',
      pacScript: { data: buildPac(state), mandatory: false },
    };
  } else {
    value = { mode: 'system' };
  }
  try {
    chrome.proxy.settings.set({ value: value, scope: 'regular' }, function () {
      if (chrome.runtime.lastError) log('proxy set error:', chrome.runtime.lastError.message);
    });
  } catch (e) {
    log('proxy exception:', e);
  }
}

/* ---------------- badge ---------------- */
function badgeTextFor(st) {
  if (!st.settings.badge) return '';
  if (!st.applied) return '';
  if (st.mode === 'direct') return 'OFF';
  if (st.mode === 'system') return 'SYS';
  if (st.mode === 'auto') return 'AUTO';
  var p = findProfile(st, st.currentProfileId);
  if (!p) return '';
  var latin = String(p.name).replace(/[^A-Za-z0-9]/g, '');
  if (latin) return latin.slice(0, 3).toUpperCase();
  return String(p.name).trim().slice(0, 2);
}

function badgeColorFor(st) {
  if (st.mode === 'auto') return themeById(st.settings.themeId).colors[0];
  var p = findProfile(st, st.currentProfileId);
  if (p) return gradById(p.color).colors[0];
  return '#8A8F9E';
}

function applyBadge() {
  if (!state) return;
  try {
    badgeApi.setBadgeText({ text: badgeTextFor(state) });
    if (state.settings.badge && state.applied) badgeApi.setBadgeBackgroundColor({ color: badgeColorFor(state) });
  } catch (e) { /* ignore */ }
}

/* ---------------- context menus ---------------- */
var menusBuilt = false;

function rebuildMenus() {
  if (!state || !chrome.contextMenus) return;
  try {
    chrome.contextMenus.removeAll(function () {
      chrome.runtime.lastError;
      var checkedMode = function (m) { return state.applied && state.mode === m; };
      chrome.contextMenus.create({ id: 'pfm-direct', title: i18n.t('menu.direct'), type: 'radio', checked: checkedMode('direct'), contexts: [MENU_CONTEXT] });
      chrome.contextMenus.create({ id: 'pfm-system', title: i18n.t('menu.system'), type: 'radio', checked: checkedMode('system'), contexts: [MENU_CONTEXT] });
      chrome.contextMenus.create({ id: 'pfm-auto', title: i18n.t('menu.auto'), type: 'radio', checked: checkedMode('auto'), contexts: [MENU_CONTEXT] });
      chrome.contextMenus.create({ type: 'separator', id: 'pfm-sep', contexts: [MENU_CONTEXT] });
      state.profiles.forEach(function (p) {
        chrome.contextMenus.create({
          id: 'pfm-p:' + p.id,
          title: p.icon + '  ' + p.name,
          type: 'radio',
          checked: state.applied && state.mode === 'profile' && state.currentProfileId === p.id,
          contexts: [MENU_CONTEXT],
        });
      });
      menusBuilt = true;
    });
  } catch (e) {
    log('menu error:', e);
  }
}

/* ---------------- switching ---------------- */
function doSwitch(mode, profileId, silent) {
  return Store.switchMode(state, { mode: mode, profileId: profileId }).then(function (r) {
    state = r.state;
    applyProxy();
    applyBadge();
    rebuildMenus();
    broadcast();
    if (!silent && state.settings.notifications) notifySwitch();
    return state;
  });
}

function notifySwitch() {
  var info = effectiveInfo(state, function (fa, en) { return (state.settings.lang === 'fa') ? fa : en; });
  try {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('assets/icons/icon128.png'),
      title: PFM.NAME,
      message: i18n.t('notify.switched', { name: info.label }),
    }, function () { chrome.runtime.lastError; });
  } catch (e) { /* ignore */ }
}

function broadcast() {
  try {
    chrome.runtime.sendMessage({ type: 'state-changed', state: state }, function () { chrome.runtime.lastError; });
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
chrome.runtime.onInstalled.addListener(function (details) {
  reloadState().then(function (st) {
    if (details.reason === 'install') {
      st.installedAt = Date.now();
      applyAll();
      chrome.runtime.openOptionsPage(function () { chrome.runtime.lastError; });
    } else {
      applyAll();
    }
  });
});

chrome.runtime.onStartup.addListener(function () {
  reloadState().then(applyAll);
});

Store.onChanged(function () {
  reloadState().then(applyAll);
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  Promise.resolve().then(function () {
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
  }).then(sendResponse).catch(function (e) {
    log('message error:', e);
    sendResponse({ ok: false, error: String(e) });
  });
  return true; /* async */
});

chrome.commands.onCommand.addListener(function (cmd) {
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

if (chrome.contextMenus && chrome.contextMenus.onClicked) {
  chrome.contextMenus.onClicked.addListener(function (info) {
    var ensure = state ? Promise.resolve(state) : reloadState();
    ensure.then(function () {
      var id = info.menuItemId;
      if (id === 'pfm-direct') doSwitch('direct');
      else if (id === 'pfm-system') doSwitch('system');
      else if (id === 'pfm-auto') doSwitch('auto');
      else if (id && id.indexOf('pfm-p:') === 0) doSwitch('profile', id.slice(6));
    });
  });
}

/* first run of the service worker */
reloadState().then(applyAll).catch(function (e) { log('init error:', e); });
