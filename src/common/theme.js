/* ProxyFaMega — theme engine + language application (used by popup & options) */
'use strict';

function hexToRgba(hex, alpha) {
  var h = String(hex).replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  var n = parseInt(h, 16);
  var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

function resolvedMode(state) {
  var pref = state.settings.appearance;
  if (pref === 'light' || pref === 'dark') return pref;
  try { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
  catch (e) { return 'light'; }
}

/* Apply theme + appearance + font size to <html>; caches to localStorage for next boot */
function applyUiTheme(state) {
  if (typeof document === 'undefined') return;
  var theme = themeById(state.settings.themeId);
  var mode = resolvedMode(state);
  var pal = theme[mode];
  var s = document.documentElement.style;

  s.setProperty('--a1', theme.colors[0]);
  s.setProperty('--a2', theme.colors[1]);
  s.setProperty('--a3', theme.colors[2]);
  s.setProperty('--a1-soft', hexToRgba(theme.colors[0], 0.12));
  s.setProperty('--a1-mid', hexToRgba(theme.colors[0], 0.28));
  s.setProperty('--a2-soft', hexToRgba(theme.colors[1], 0.14));
  s.setProperty('--grad', 'linear-gradient(135deg, ' + theme.colors[0] + ' 0%, ' + theme.colors[1] + ' 52%, ' + theme.colors[2] + ' 100%)');
  s.setProperty('--grad-soft', 'linear-gradient(135deg, ' + hexToRgba(theme.colors[0], 0.14) + ', ' + hexToRgba(theme.colors[2], 0.14) + ')');
  s.setProperty('--bg', pal.bg);
  s.setProperty('--surface', pal.surface);
  s.setProperty('--surface2', pal.surface2);
  s.setProperty('--text', pal.text);
  s.setProperty('--muted', pal.muted);
  s.setProperty('--border', pal.border);
  s.setProperty('--shadow', mode === 'dark' ? 'rgba(0,0,0,0.45)' : 'rgba(60,60,110,0.14)');

  document.documentElement.dataset.mode = mode;
  document.documentElement.style.fontSize = { sm: '14px', md: '16px', lg: '18px' }[state.settings.fontSize] || '16px';

  try {
    localStorage.setItem('pfm:ui', JSON.stringify({
      lang: state.settings.lang,
      mode: mode,
      vars: {
        '--a1': theme.colors[0], '--a2': theme.colors[1], '--a3': theme.colors[2],
        '--bg': pal.bg, '--surface': pal.surface, '--surface2': pal.surface2,
        '--text': pal.text, '--muted': pal.muted, '--border': pal.border,
      },
    }));
  } catch (e) { /* ignore */ }
}

function applyLangGlobal(lang) {
  if (typeof i18n !== 'undefined' && i18n.setLang) i18n.setLang(lang);
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }
}

/* watch system color scheme when appearance = auto */
function watchSystemTheme(stateGetter, onChange) {
  try {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var handler = function () {
      var st = stateGetter();
      if (st && st.settings.appearance === 'auto') {
        applyUiTheme(st);
        if (onChange) onChange();
      }
    };
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else if (mq.addListener) mq.addListener(handler);
  } catch (e) { /* ignore */ }
}
