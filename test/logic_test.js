/* ProxyFaMega — logic tests (node) */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = path.join(__dirname, '..', 'src');
const ctx = { console, Date, Math, JSON, RegExp, Promise, setTimeout };
vm.createContext(ctx);

for (const f of ['common/constants.js', 'common/i18n.js', 'common/defaults.js', 'common/matcher.js']) {
  vm.runInContext(fs.readFileSync(path.join(SRC, f), 'utf8'), ctx, { filename: f });
}

let failures = 0;
function ok(cond, name) {
  if (cond) { console.log('  ✓', name); }
  else { console.error('  ✗ FAIL:', name); failures++; }
}

const G = ctx;

console.log('— defaults —');
const defs = G.defaultState();
ok(defs.settings.lang === 'fa', 'default language is fa');
ok(defs.profiles.length === 9, '9 default app profiles');
ok(!defs.profiles.some(p => p.id === 'arman-vpn'), 'the 100riVPN profile is gone with the module');
const hiddify = defs.profiles.find(p => p.id === 'hiddify');
ok(hiddify && hiddify.port === 12334, 'Hiddify port 12334');
const v2 = defs.profiles.find(p => p.id === 'v2rayn');
ok(v2 && v2.port === 10808 && v2.protocol === 'socks5', 'v2rayN socks5 10808');
const nb = defs.profiles.find(p => p.id === 'nekobox');
ok(nb && nb.port === 2080, 'NekoBox port 2080');
const happ = defs.profiles.find(p => p.id === 'happ');
ok(happ && happ.port === 10808, 'Happ port 10808');
ok(!defs.profiles.some(p => p.id === 'firefox'), 'the redundant legacy Firefox-port profile is gone');

console.log('— matching —');
ok(G.matchWildcard('www.youtube.com', '*.youtube.com') === true, 'wildcard *.youtube.com matches www');
ok(G.matchWildcard('youtube.com', '*.youtube.com') === false, 'wildcard does not match apex');
ok(G.matchWildcard('api.example.com', 'api.*.com') === true, 'middle wildcard');
ok(G.matchRegex('https://x.com/jack', 'x\\.com') === true, 'regex match');
ok(G.isLocalHost('localhost') && G.isLocalHost('192.168.1.4') && G.isLocalHost('172.20.3.9'), 'local detection');
ok(!G.isLocalHost('google.com') && !G.isLocalHost('8.8.8.8'), 'non-local detection');

console.log('— decideForUrl —');
const st = G.defaultState();
st.mode = 'auto';
st.autoSwitch.rules.push({ id: 'r1', type: 'domain', pattern: '*.youtube.com', action: 'hiddify', enabled: true });
st.autoSwitch.rules.push({ id: 'r2', type: 'domain', pattern: '*.ir', action: 'direct', enabled: true });
let d = G.decideForUrl(st, 'https://www.youtube.com/x', 'www.youtube.com');
ok(d.action === 'hiddify' && d.reason === 'rule', 'youtube -> hiddify');
d = G.decideForUrl(st, 'https://www.gsm.ir/x', 'www.gsm.ir');
ok(d.action === 'direct' && d.reason === 'rule', '*.ir -> direct');
d = G.decideForUrl(st, 'https://random.org', 'random.org');
ok(d.action === 'direct' && d.reason === 'default', 'no match -> default');
d = G.decideForUrl(st, 'http://192.168.1.1/admin', '192.168.1.1');
ok(d.reason === 'local', 'LAN bypass');
st.mode = 'profile';
d = G.decideForUrl(st, 'https://example.com', 'example.com');
ok(d.action === 'hiddify' && d.reason === 'fixed', 'fixed profile mode');

console.log('— PAC generation —');
const pac = G.buildPac(st.mode === 'profile' ? Object.assign({}, st, { mode: 'auto' }) : st);
ok(pac.includes('function FindProxyForURL'), 'PAC has FindProxyForURL');
ok(pac.includes('shExpMatch(h, "*.youtube.com")'), 'PAC embeds youtube rule');
ok(pac.includes('SOCKS5 127.0.0.1:12334'), 'PAC maps to Hiddify SOCKS5');
ok(pac.includes('192[.]168'), 'PAC bypasses LAN');
// fallback variant
st.settings.fallbackDirect = true;
const pac2 = G.buildPac(st);
ok(pac2.includes('SOCKS5 127.0.0.1:12334; DIRECT'), 'fallbackDirect appends ; DIRECT');

console.log('— PAC script syntax check —');
try {
  /* stub PAC-engine built-ins that Chrome provides natively */
  vm.runInContext('function isPlainHostName(h){ return String(h).indexOf(".") === -1; } function shExpMatch(s,p){ var e=p.replace(/[.+^${}()|[\\]\\\\]/g,"\\\\$&").replace(/\\*/g,".*").replace(/\\?/g,"."); return new RegExp("^"+e+"$","i").test(s); }', ctx);
  vm.runInContext(pac, ctx, { filename: 'pac.js' });
  const r = vm.runInContext('FindProxyForURL("https://www.youtube.com/watch", "www.youtube.com")', ctx);
  ok(r === 'SOCKS5 127.0.0.1:12334', 'PAC runtime: youtube -> SOCKS5 12334');
  const r2 = vm.runInContext('FindProxyForURL("http://www.gsm.ir/", "www.gsm.ir")', ctx);
  ok(r2 === 'DIRECT', 'PAC runtime: .ir site -> DIRECT');
  const r3 = vm.runInContext('FindProxyForURL("https://unknown.org/", "unknown.org")', ctx);
  ok(r3 === 'DIRECT', 'PAC runtime: default -> DIRECT');
  const r4 = vm.runInContext('FindProxyForURL("http://10.0.0.5/", "10.0.0.5")', ctx);
  ok(r4 === 'DIRECT', 'PAC runtime: LAN -> DIRECT');
} catch (e) {
  ok(false, 'PAC script threw: ' + e.message);
}

console.log('— i18n —');
ok(G.i18n.t('menu.direct') === 'اتصال مستقیم', 'fa default string');
G.i18n.setLang('en');
ok(G.i18n.t('menu.direct') === 'Direct connection', 'en string');
G.i18n.setLang('fa');
ok(G.i18n.t('notify.switched', { name: 'X' }).includes('X'), 'interpolation');

console.log('');
if (failures) { console.error(failures + ' FAILURES'); process.exit(1); }
console.log('ALL LOGIC TESTS PASSED ✓');
