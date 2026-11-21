/* ProxyFaMega — background wiring smoke test (node).
   Loads the real Chromium MV3 service worker (src/background/chromium.js) in a
   VM with an importScripts shim and a full chrome mock, then drives it the
   way the browser would: startup, storage changes, and the message router.
   v2.1.0: the 100riVPN module is gone — this also verifies that it is REALLY
   gone (no alarms, no arman routes) and that legacy VPN data is purged. */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const nodeCrypto = require('crypto');

const SRC = path.join(__dirname, '..', 'src');

let failures = 0, passes = 0;
function ok(cond, name) {
  if (cond) { console.log('  ✓', name); passes++; }
  else { console.error('  ✗ FAIL:', name); failures++; }
}

function makeWorker(opts) {
  opts = opts || {};
  const captured = { alarms: [], notifications: [], tabs: [], messages: [], requests: [] };
  const storage = Object.assign({}, opts.storage || {});

  const listeners = {
    onInstalled: [], onStartup: [], onMessage: [], onCommand: [], onClicked: [],
    storageOnChanged: [], menusOnClicked: [],
  };

  const storageArea = {
    get(keys, cb) {
      const ks = Array.isArray(keys) ? keys : [keys];
      const out = {};
      ks.forEach(k => { if (storage[k] !== undefined) out[k] = JSON.parse(JSON.stringify(storage[k])); });
      if (cb) Promise.resolve().then(() => cb(out));
      return Promise.resolve(out);
    },
    set(obj, cb) { Object.assign(storage, JSON.parse(JSON.stringify(obj))); if (cb) Promise.resolve().then(() => cb()); return Promise.resolve(); },
    remove(keys, cb) {
      (Array.isArray(keys) ? keys : [keys]).forEach(k => { delete storage[k]; });
      if (cb) Promise.resolve().then(() => cb());
      return Promise.resolve();
    },
  };

  const chromeApi = {
    runtime: {
      lastError: null,
      sendMessage(msg, cb) { captured.messages.push(msg); if (cb) Promise.resolve().then(() => cb(undefined)); },
      onMessage: { addListener: fn => listeners.onMessage.push(fn) },
      onInstalled: { addListener: fn => listeners.onInstalled.push(fn) },
      onStartup: { addListener: fn => listeners.onStartup.push(fn) },
      openOptionsPage(cb) { if (cb) Promise.resolve().then(() => cb()); },
      getURL: p => 'chrome-extension://pfm/' + p,
    },
    storage: {
      local: storageArea,
      sync: storageArea,
      onChanged: { addListener: fn => listeners.storageOnChanged.push(fn) },
    },
    proxy: { settings: { set(value, cb) { captured.lastProxy = value; if (cb) Promise.resolve().then(() => cb()); } } },
    alarms: { create(name, spec) { captured.alarms.push({ name, spec }); }, onAlarm: { addListener: fn => listeners.onAlarm = (listeners.onAlarm || []).concat(fn) } },
    notifications: { create(o, cb) { captured.notifications.push(o); if (cb) Promise.resolve().then(() => cb()); } },
    contextMenus: {
      removeAll(cb) { if (cb) Promise.resolve().then(() => cb()); },
      create(spec) { },
      onClicked: { addListener: fn => listeners.menusOnClicked.push(fn) },
    },
    commands: { onCommand: { addListener: fn => listeners.onCommand.push(fn) } },
    tabs: { create(spec, cb) { captured.tabs.push(spec); if (cb) Promise.resolve().then(() => cb({ id: 55 })); return { id: 55 }; } },
    action: { setBadgeText() {}, setBadgeBackgroundColor() {}, setTitle() {} },
    i18n: { getMessage: k => k },
  };

  const routes = opts.routes || {};
  async function fetchMock(url, init) {
    init = init || {};
    captured.requests.push({ url, method: init.method || 'GET', body: init.body || '', headers: init.headers || {} });
    const key = (init.method || 'GET') + ' ' + url;
    for (const k of Object.keys(routes)) {
      if (key.indexOf(k) === 0) {
        const r = routes[k];
        const o = typeof r === 'function' ? r(url, init) : r;
        return Promise.resolve({
          status: o.status || 200,
          text: () => Promise.resolve(o.body || ''),
          headers: { get: n => (o.headers || {})[n] != null ? String(o.headers[n]) : null },
        });
      }
    }
    return Promise.resolve({ status: 404, text: () => Promise.resolve(''), headers: { get: () => null } });
  }

  const sandbox = {
    console, Promise, Date, Math, JSON, RegExp, Object, Array, String, Number, Boolean, Error,
    setTimeout: (fn, ms) => setTimeout(fn, ms >= 900 ? 8 : ms), clearTimeout, setInterval, clearInterval,
    performance: { now: () => Date.now() },
    URL, URLSearchParams, TextEncoder, TextDecoder, AbortController,
    crypto: nodeCrypto.webcrypto,
    btoa: s => Buffer.from(s, 'binary').toString('base64'),
    atob: s => Buffer.from(s, 'base64').toString('binary'),
    fetch: fetchMock,
    chrome: chromeApi,
    importScripts: function () {
      for (const f of arguments) {
        vm.runInContext(fs.readFileSync(path.join(SRC, f), 'utf8'), sandbox, { filename: f });
      }
    },
  };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(SRC, 'background/chromium.js'), 'utf8'), sandbox, { filename: 'background/chromium.js' });

  return {
    sandbox, captured, storage, listeners,
    message(msg) {
      return new Promise(resolve => {
        let replied = false;
        for (const fn of listeners.onMessage) {
          const ret = fn(msg, { tab: msg._tab || undefined }, res => { replied = true; resolve(res); });
          if (ret === true) { /* async */ }
        }
        setTimeout(() => { if (!replied) resolve(undefined); }, 400);
      });
    },
  };
}

async function main() {
  console.log('— background service worker (chromium.js, full load) —');

  /* a fresh install: no alarms, the module is gone */
  const w = makeWorker({
    routes: {
      'GET https://www.gstatic.com/generate_204': { status: 204, body: '' },
    },
  });
  for (const fn of w.listeners.onStartup) fn();
  await new Promise(r => setTimeout(r, 250));

  ok(w.captured.alarms.length === 0, 'no alarm is created (the VPN renewal alarm is gone with the module)');
  ok(!(w.listeners.onAlarm && w.listeners.onAlarm.length), 'no alarm listener is registered');

  /* message routing: the classic messages still work */
  const res1 = await w.message({ type: 'get-state' });
  ok(res1 && res1.ok === true && res1.state && res1.state.settings, 'the classic get-state message still works');

  const resV = await w.message({ type: 'arman-get' });
  ok(resV && resV.ok === false, 'an arman-* message now answers ok:false (the module is truly removed)');

  const resL = await w.message({ type: 'test-latency' });
  ok(resL && resL.ok === true && typeof resL.ms === 'number', 'the latency test works through the router');

  /* the proxy switch still drives chrome.proxy */
  const res5 = await w.message({ type: 'switch', mode: 'profile', profileId: 'hiddify' });
  ok(res5 && res5.ok === true, 'switching to a profile works');
  const pv = w.captured.lastProxy && w.captured.lastProxy.value;
  ok(pv && pv.mode === 'fixed_servers' &&
    pv.rules.singleProxy.host === '127.0.0.1' && pv.rules.singleProxy.port === 12334 && pv.rules.singleProxy.scheme === 'socks5',
    'the browser proxy is pointed at the Hiddify SOCKS port 12334');

  /* legacy v2.0.0 VPN data: tokens must not linger in storage */
  const w2 = makeWorker({
    storage: {
      'pfm:arman': { accounts: [{ id: 'a1', email: 'x@y.z', tokens: { access_token: 'at-x', refresh_token: 'rt-x' } }] },
    },
    routes: {},
  });
  for (const fn of w2.listeners.onStartup) fn();
  await new Promise(r => setTimeout(r, 400));
  ok(w2.storage['pfm:arman'] === undefined, 'legacy VPN data (pfm:arman) is purged on browser startup');

  const w3 = makeWorker({
    storage: {
      'pfm:arman': { accounts: [{ id: 'a1', email: 'x@y.z', tokens: { access_token: 'at-x' } }] },
    },
    routes: {},
  });
  for (const fn of w3.listeners.onInstalled) fn({ reason: 'update' });
  await new Promise(r => setTimeout(r, 400));
  ok(w3.storage['pfm:arman'] === undefined, 'legacy VPN data (pfm:arman) is purged on extension update');

  console.log('— summary —');
  console.log(`  ${passes} passed, ${failures} failed`);
  process.exit(failures ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
