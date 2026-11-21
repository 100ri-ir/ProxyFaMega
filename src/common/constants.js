/* ProxyFaMega — shared constants (loaded by pages AND service worker) */
'use strict';

var PFM = {
  NAME: 'ProxyFaMega',
  VERSION: '2.2.0',
  KEY_STATE: 'pfm:state',
  KEY_SNAPSHOTS: 'pfm:snapshots',
  SITE: 'https://github.com/100ri-ir/ProxyFaMega',
  MAX_SNAPSHOTS: 10,
};

/* Supported proxy protocols */
var PROTOCOLS = [
  { id: 'socks5', pac: 'SOCKS5', chrome: 'socks5', ff: 'socks' },
  { id: 'http',   pac: 'PROXY',  chrome: 'http',   ff: 'http' },
  { id: 'https',  pac: 'HTTPS',  chrome: 'https',  ff: 'https' },
  { id: 'socks4', pac: 'SOCKS4', chrome: 'socks4', ff: 'socks4' },
];

function protoById(id) {
  for (var i = 0; i < PROTOCOLS.length; i++) if (PROTOCOLS[i].id === id) return PROTOCOLS[i];
  return PROTOCOLS[0];
}

/* Avatar gradients (profile identity colors) */
var GRADIENTS = [
  { id: 'g1',  colors: ['#6366F1', '#8B5CF6'] },
  { id: 'g2',  colors: ['#14B8A6', '#06B6D4'] },
  { id: 'g3',  colors: ['#F97316', '#F43F5E'] },
  { id: 'g4',  colors: ['#8B5CF6', '#EC4899'] },
  { id: 'g5',  colors: ['#3B82F6', '#06B6D4'] },
  { id: 'g6',  colors: ['#EC4899', '#F472B6'] },
  { id: 'g7',  colors: ['#22C55E', '#84CC16'] },
  { id: 'g8',  colors: ['#F59E0B', '#EF4444'] },
  { id: 'g9',  colors: ['#F43F5E', '#FB7185'] },
  { id: 'g10', colors: ['#06B6D4', '#3B82F6'] },
  { id: 'g11', colors: ['#7C3AED', '#4F46E5'] },
  { id: 'g12', colors: ['#64748B', '#94A3B8'] },
];

function gradById(id) {
  for (var i = 0; i < GRADIENTS.length; i++) if (GRADIENTS[i].id === id) return GRADIENTS[i];
  return GRADIENTS[0];
}

function gradCss(id) {
  var g = gradById(id);
  return 'linear-gradient(135deg, ' + g.colors[0] + ', ' + g.colors[1] + ')';
}

/* Curated emoji set for profile icons */
var PROFILE_EMOJIS = [
  '🛡️', '🚀', '⚡', '🐱', '🦊', '🌊', '👻', '🧅', '🐦', '😻',
  '🥷', '🛰️', '🔥', '❄️', '🌈', '💜', '🎯', '🐉', '🍕', '🎧',
  '🧲', '💎', '🦅', '🎭', '🐢', '🌸', '🌞', '🌙', '⭐', '🍀',
  '🧿', '🎲', '🎺', '🪐', '🍀', '🎈',
];

/* iOS-inspired themes — each with light & dark palettes */
var THEMES = [
  {
    id: 'aurora', fa: 'آورورا', en: 'Aurora', colors: ['#6366F1', '#A855F7', '#EC4899'],
    light: { bg: '#F5F5FC', surface: '#FFFFFF', surface2: '#EEEFF9', text: '#191B2E', muted: '#6A6F88', border: '#E3E5F1' },
    dark: { bg: '#0B0D16', surface: '#151928', surface2: '#1D2235', text: '#EFF0F7', muted: '#979DB6', border: '#262C42' },
  },
  {
    id: 'sunset', fa: 'غروب', en: 'Sunset', colors: ['#F97316', '#EF4444', '#EC4899'],
    light: { bg: '#FDF6F3', surface: '#FFFFFF', surface2: '#FAEFEA', text: '#2A1A14', muted: '#8A7268', border: '#F2E2DB' },
    dark: { bg: '#140D0B', surface: '#221613', surface2: '#2D1E19', text: '#F7EFEA', muted: '#B39A8F', border: '#3A2820' },
  },
  {
    id: 'ocean', fa: 'اقیانوس', en: 'Ocean', colors: ['#06B6D4', '#3B82F6', '#6366F1'],
    light: { bg: '#F2F7FC', surface: '#FFFFFF', surface2: '#E9F1F9', text: '#12212E', muted: '#64778A', border: '#DCE7F1' },
    dark: { bg: '#0A0F16', surface: '#131C27', surface2: '#1B2735', text: '#ECF2F8', muted: '#8FA3B8', border: '#233244' },
  },
  {
    id: 'mint', fa: 'نعنایی', en: 'Mint', colors: ['#10B981', '#14B8A6', '#06B6D4'],
    light: { bg: '#F1FAF6', surface: '#FFFFFF', surface2: '#E6F4EE', text: '#0F2A20', muted: '#5F7E72', border: '#D8EEE4' },
    dark: { bg: '#081310', surface: '#10201B', surface2: '#162B24', text: '#EBF7F2', muted: '#8BADA0', border: '#1D3830' },
  },
  {
    id: 'candy', fa: 'آب‌نباتی', en: 'Candy', colors: ['#EC4899', '#F472B6', '#A78BFA'],
    light: { bg: '#FDF5FA', surface: '#FFFFFF', surface2: '#F9ECF6', text: '#2B152B', muted: '#86687F', border: '#F3E0EF' },
    dark: { bg: '#140A12', surface: '#221328', surface2: '#2E1B33', text: '#F8EDF6', muted: '#B18FA8', border: '#3B2440' },
  },
  {
    id: 'gold', fa: 'طلایی', en: 'Gold', colors: ['#F59E0B', '#F97316', '#EAB308'],
    light: { bg: '#FCF7EF', surface: '#FFFFFF', surface2: '#F7EEDD', text: '#2A2110', muted: '#857557', border: '#F0E4CC' },
    dark: { bg: '#131009', surface: '#211B10', surface2: '#2D2414', text: '#F8F1E4', muted: '#B0A07C', border: '#3A3018' },
  },
  {
    id: 'midnight', fa: 'نیمه‌شب', en: 'Midnight', colors: ['#818CF8', '#6366F1', '#38BDF8'],
    light: { bg: '#F3F5FC', surface: '#FFFFFF', surface2: '#EAEFF9', text: '#141A2E', muted: '#66708D', border: '#DEE5F2' },
    dark: { bg: '#070B18', surface: '#101730', surface2: '#17203E', text: '#EDF0FA', muted: '#8B96B8', border: '#1F2A4D' },
  },
  {
    id: 'neon', fa: 'نئون', en: 'Neon', colors: ['#22D3EE', '#A855F7', '#F472B6'],
    light: { bg: '#F4F8FB', surface: '#FFFFFF', surface2: '#EAF3F8', text: '#10202B', muted: '#63788A', border: '#DCEAF2' },
    dark: { bg: '#060A12', surface: '#0F1724', surface2: '#16202F', text: '#EAF4FA', muted: '#86A0B5', border: '#1D2A3D' },
  },
];

function themeById(id) {
  for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) return THEMES[i];
  return THEMES[0];
}

/* Default local/private bypass list (wildcards, Chromium style) */
var DEFAULT_BYPASS = ['localhost', '127.0.0.1', '[::1]', '0.0.0.0', '10.*', '192.168.*', '169.254.*']
  .concat(Array.from({ length: 16 }, function (_, i) { return '172.' + (i + 16) + '.*'; }))
  .concat(['<local>']);

/* Endpoints used by the connection test (host_permissions cover these) */
var TEST_ENDPOINTS = [
  'https://www.gstatic.com/generate_204',
  'https://cp.cloudflare.com/generate_204',
];
