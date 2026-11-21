/* ProxyFaMega — rule matcher + PAC generator (shared by backgrounds, options tester, demo) */
'use strict';

function wildcardToRegex(pattern) {
  var esc = String(pattern)
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  try { return new RegExp('^' + esc + '$', 'i'); } catch (e) { return null; }
}

function matchWildcard(str, pattern) {
  if (!pattern) return false;
  var re = wildcardToRegex(pattern);
  return re ? re.test(str) : false;
}

function matchRegex(str, pattern) {
  if (!pattern) return false;
  try { return new RegExp(pattern, 'i').test(str); } catch (e) { return false; }
}

function matchRule(rule, url, host) {
  if (!rule || !rule.enabled || !rule.pattern) return false;
  if (rule.type === 'domain') return matchWildcard(host, rule.pattern);
  if (rule.type === 'url') return matchWildcard(url, rule.pattern);
  if (rule.type === 'regex') return matchRegex(url, rule.pattern);
  return false;
}

function isLocalHost(host) {
  if (!host) return true;
  var h = String(host).replace(/^\[|\]$/g, '');
  if (h === 'localhost' || h === '::1' || h === '0.0.0.0' || h.endsWith('.localhost') || h.endsWith('.local')) return true;
  if (h.indexOf(':') !== -1) return /^f[cd][0-9a-f:]*$/i.test(h); /* IPv6 unique-local roughly */
  var m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    var a = +m[1], b = +m[2];
    return a === 127 || a === 10 || a === 0 ||
      (a === 192 && b === 168) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 169 && b === 254);
  }
  return h.indexOf('.') === -1; /* plain hostname = LAN */
}

function bypassedByList(list, host) {
  if (!list) return false;
  for (var i = 0; i < list.length; i++) if (matchWildcard(host, list[i])) return true;
  return false;
}

function profileBypassList(state, profile) {
  var out = [];
  if (state.settings && state.settings.bypassLocal) out = out.concat(DEFAULT_BYPASS);
  if (profile && profile.bypass) out = out.concat(profile.bypass);
  return out;
}

/* Decide which action handles a URL. Returns {action, rule?, reason} */
function decideForUrl(state, url, host) {
  if (state.settings && state.settings.bypassLocal && isLocalHost(host)) {
    return { action: 'direct', reason: 'local' };
  }
  if (state.mode === 'profile') {
    if (state.currentProfileId && bypassedByList((findProfile(state, state.currentProfileId) || {}).bypass, host)) {
      return { action: 'direct', reason: 'bypass' };
    }
    return { action: state.currentProfileId, reason: 'fixed' };
  }
  /* auto switch mode */
  var rules = (state.autoSwitch && state.autoSwitch.rules) || [];
  for (var i = 0; i < rules.length; i++) {
    if (matchRule(rules[i], url, host)) return { action: rules[i].action, rule: rules[i], reason: 'rule' };
  }
  return { action: (state.autoSwitch && state.autoSwitch.defaultAction) || 'direct', reason: 'default' };
}

function findProfile(state, id) {
  if (!state || !state.profiles) return null;
  for (var i = 0; i < state.profiles.length; i++) if (state.profiles[i].id === id) return state.profiles[i];
  return null;
}

/* PAC "PROXY h:p" string for an action id */
function pacResultFor(state, actionId, fallbackSuffix) {
  if (!actionId || actionId === 'direct') return '"DIRECT"';
  var p = findProfile(state, actionId);
  if (!p) return null;
  var proto = protoById(p.protocol);
  return JSON.stringify(proto.pac + ' ' + p.host + ':' + p.port + (fallbackSuffix || ''));
}

/* Build a PAC script implementing auto-switch mode (Chromium) */
function buildPac(state) {
  var rules = ((state.autoSwitch && state.autoSwitch.rules) || []).filter(function (r) { return r.enabled; });
  var fb = state.settings && state.settings.fallbackDirect ? '; DIRECT' : '';
  var out = [];
  out.push('function FindProxyForURL(url, host) {');
  out.push('  var h = String(host || "").toLowerCase();');
  out.push('  var u = String(url || "").toLowerCase();');
  if (state.settings && state.settings.bypassLocal) {
    out.push('  if (isPlainHostName(h) || h === "localhost" || h === "::1" || /[.]local$/.test(h)) return "DIRECT";');
    out.push('  if (/^(127|10|0)[.]/.test(h) || /^192[.]168[.]/.test(h) || /^169[.]254[.]/.test(h) || /^172[.](1[6-9]|2[0-9]|3[01])[.]/.test(h)) return "DIRECT";');
  }
  for (var i = 0; i < rules.length; i++) {
    var r = rules[i];
    var res = pacResultFor(state, r.action, fb);
    if (res == null) continue;
    if (r.type === 'domain') {
      out.push('  if (shExpMatch(h, ' + JSON.stringify(String(r.pattern).toLowerCase()) + ')) return ' + res + ';');
    } else if (r.type === 'url') {
      out.push('  if (shExpMatch(u, ' + JSON.stringify(String(r.pattern).toLowerCase()) + ')) return ' + res + ';');
    } else if (r.type === 'regex') {
      out.push('  try { if (new RegExp(' + JSON.stringify(r.pattern) + ').test(url)) return ' + res + '; } catch (e) {}');
    }
  }
  var def = pacResultFor(state, state.autoSwitch && state.autoSwitch.defaultAction, fb);
  out.push('  return ' + (def == null ? '"DIRECT"' : def) + ';');
  out.push('}');
  return out.join('\n');
}

/* Friendly description of the effective connection (for UIs) */
function effectiveInfo(state, L) {
  if (!state.applied || state.mode === 'system') {
    return { icon: '🖥️', label: L('پروکسی سیستم', 'System proxy'), sub: L('مرورگر از تنظیمات خود سیستم پیروی می‌کند', 'Browser follows OS settings'), grad: 'g12' };
  }
  if (state.mode === 'direct') {
    return { icon: '🚫', label: L('اتصال مستقیم', 'Direct connection'), sub: L('بدون هیچ پروکسی', 'No proxy at all'), grad: 'g12' };
  }
  if (state.mode === 'auto') {
    var d = state.autoSwitch.defaultAction;
    var dp = findProfile(state, d);
    return {
      icon: '🔀', label: L('سوییچ خودکار', 'Auto switch'),
      sub: L('بر اساس قوانین — پیش‌فرض: ', 'Rule-based — default: ') + (dp ? dp.name : L('مستقیم', 'Direct')),
      grad: 'g4',
    };
  }
  var p = findProfile(state, state.currentProfileId);
  if (p) {
    return { icon: p.icon, label: p.name, sub: p.protocol + '://' + p.host + ':' + p.port, grad: p.color, profile: p };
  }
  return { icon: '❓', label: L('پروفایل حذف‌شده', 'Missing profile'), sub: '', grad: 'g12' };
}
