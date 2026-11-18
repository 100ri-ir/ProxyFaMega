/* ProxyFaMega — default profiles, presets and initial state */
'use strict';

function defaultProfiles() {
  return [
    {
      id: 'hiddify', name: 'Hiddify', protocol: 'socks5', host: '127.0.0.1', port: 12334,
      color: 'g2', icon: '🛡️', builtIn: true,
      desc: { fa: 'پورت Mixed پیش‌فرض هیدی‌فای — روی یک پورت هم SOCKS5 و هم HTTP', en: 'Hiddify default mixed port — SOCKS5 & HTTP on one port' },
    },
    {
      id: 'v2rayn', name: 'v2rayN / V2Ray', protocol: 'socks5', host: '127.0.0.1', port: 10808,
      color: 'g1', icon: '🚀', builtIn: true,
      desc: { fa: 'پورت SOCKS پیش‌فرض v2rayN و هسته Xray (پورت HTTP: 10809)', en: 'v2rayN / Xray core default SOCKS port (HTTP: 10809)' },
    },
    {
      id: 'v2rayn-http', name: 'v2rayN (HTTP)', protocol: 'http', host: '127.0.0.1', port: 10809,
      color: 'g5', icon: '⚡', builtIn: true,
      desc: { fa: 'پورت HTTP پیش‌فرض v2rayN برای برنامه‌هایی که SOCKS ندارند', en: 'v2rayN default HTTP port' },
    },
    {
      id: 'nekobox', name: 'NekoBox / Nekoray', protocol: 'socks5', host: '127.0.0.1', port: 2080,
      color: 'g4', icon: '🐱', builtIn: true,
      desc: { fa: 'پورت Mixed پیش‌فرض نکوباکس و نکورِی (SOCKS5 + HTTP)', en: 'NekoBox / Nekoray default mixed port' },
    },
    {
      id: 'happ', name: 'Happ', protocol: 'socks5', host: '127.0.0.1', port: 10808,
      color: 'g6', icon: '😻', builtIn: true,
      desc: { fa: 'پورت‌های پیش‌فرض Happ (SOCKS: 10808 — HTTP: 10809)', en: 'Happ default ports (SOCKS: 10808 — HTTP: 10809)' },
    },
    {
      id: 'clash', name: 'Clash Verge / CFW', protocol: 'http', host: '127.0.0.1', port: 7890,
      color: 'g10', icon: '🌊', builtIn: true,
      desc: { fa: 'پورت Mixed پیش‌فرض خانواده Clash (HTTP و SOCKS5)', en: 'Clash family default mixed port' },
    },
    {
      id: 'firefox', name: 'Firefox Proxy', protocol: 'socks5', host: '127.0.0.1', port: 10810,
      color: 'g3', icon: '🦊', builtIn: true,
      desc: { fa: 'پورت 10810 — پروفایل سفارشی؛ در صورت نیاز ویرایشش کنید', en: 'Port 10810 — custom profile, edit as needed' },
    },
    {
      id: 'shadowsocks', name: 'Shadowsocks', protocol: 'socks5', host: '127.0.0.1', port: 1080,
      color: 'g12', icon: '👻', builtIn: true,
      desc: { fa: 'پورت SOCKS5 کلاسیک و قدیمی Shadowsocks', en: 'Classic Shadowsocks SOCKS5 port' },
    },
    {
      id: 'tor', name: 'Tor', protocol: 'socks5', host: '127.0.0.1', port: 9050,
      color: 'g11', icon: '🧅', builtIn: true,
      desc: { fa: 'پورت SOCKS5 پیش‌فرض سرویس Tor', en: 'Tor default SOCKS5 port' },
    },
    {
      id: 'psiphon', name: 'Psiphon', protocol: 'http', host: '127.0.0.1', port: 8080,
      color: 'g8', icon: '🐦', builtIn: true,
      desc: { fa: 'پورت HTTP محلی Psiphon (SOCKS: 1080) — در نسخه‌های جدید ممکن است تصادفی باشد', en: 'Psiphon local HTTP port (SOCKS: 1080)' },
    },
  ];
}

/* Iranian domains routed DIRECT by the "Iran first" preset (non-.ir only; all .ir covered by wildcard) */
var IRAN_DIRECT_DOMAINS = [
  'digikala.com', 'aparat.com', 'torob.com', 'basalam.com', 'sheypoor.com',
  'varzesh3.com', 'tasnimnews.com', 'mehrnews.com', 'farsnews.com', 'p30download.com',
  'downloadha.com', 'arvancloud.com', 'emalls.ir', 'gsm.ir', 'takhfifan.com',
];

var GOOGLE_DOMAINS = [
  'google.com', 'youtube.com', 'ytimg.com', 'googlevideo.com', 'gstatic.com',
  'ggpht.com', 'googleapis.com', 'googleusercontent.com', 'gmail.com', 'blogger.com',
];

var SOCIAL_DOMAINS = [
  'telegram.org', 't.me', 'telegram.me', 'whatsapp.com', 'whatsapp.net',
  'discord.com', 'discordapp.com', 'discordapp.net', 'x.com', 'twimg.com',
  'instagram.com', 'cdninstagram.com', 'fbcdn.net', 'facebook.com', 'signal.org',
];

function domainRules(domains, action) {
  return domains.map(function (d) {
    return { type: 'domain', pattern: '*.' + d, action: action, enabled: true };
  });
}

/* One-click rule presets */
var PRESETS = [
  {
    id: 'iran-first',
    fa: 'ایران مستقیم، بقیه با پروکسی', en: 'Iran direct, rest proxied',
    desc: {
      fa: 'همه سایت‌های ایرانی (پایان *.ir و سایت‌های معروف ایرانی) مستقیم و بقیه اینترنت از پروفایل انتخابی. مناسب حالت همیشه‌روشن!',
      en: 'All Iranian sites go direct, everything else goes through the selected profile. Great for always-on setups.',
    },
    needsProfile: true,
  },
  {
    id: 'google-only',
    fa: 'فقط گوگل و یوتیوب با پروکسی', en: 'Only Google & YouTube proxied',
    desc: {
      fa: 'سرویس‌های گوگل (جست‌وجو، یوتیوب، جیمیل و...) از پروفایل انتخابی و بقیه سایت‌ها مستقیم.',
      en: 'Google services (Search, YouTube, Gmail...) use the selected profile; everything else stays direct.',
    },
    needsProfile: true,
  },
  {
    id: 'social',
    fa: 'پیام‌رسان‌ها و شبکه‌های اجتماعی', en: 'Messengers & social media',
    desc: {
      fa: 'تلگرام، واتساپ، اینستاگرام، توییتر/X، دیسکورد و سیگنال از پروفایل انتخابی.',
      en: 'Telegram, WhatsApp, Instagram, X, Discord and Signal via the selected profile.',
    },
    needsProfile: true,
  },
  {
    id: 'all-proxy',
    fa: 'همه‌چیز با پروکسی', en: 'Route everything through proxy',
    desc: {
      fa: 'پیش‌فرض سوییچ خودکار را روی پروفایل انتخابی می‌گذارد؛ همه سایت‌ها (به‌جز شبکه داخلی) از پروکسی می‌روند.',
      en: 'Sets the auto-switch default to the selected profile; all sites (except LAN) use the proxy.',
    },
    needsProfile: true,
  },
];

function defaultSettings() {
  return {
    lang: 'fa',
    themeId: 'aurora',
    appearance: 'auto',          /* auto | light | dark */
    fontSize: 'md',              /* sm | md | lg */
    badge: true,
    notifications: true,
    saveToast: true,
    remoteDns: true,             /* SOCKS5 proxyDNS (Firefox) */
    fallbackDirect: false,       /* append "; DIRECT" in PAC */
    bypassLocal: true,           /* never proxy LAN/localhost */
    sync: false,
  };
}

function defaultState() {
  return {
    rev: 1,
    schema: 1,
    applied: false,
    mode: 'system',              /* system | direct | profile | auto */
    currentProfileId: 'hiddify',
    profiles: defaultProfiles(),
    autoSwitch: {
      defaultAction: 'direct',
      rules: [
        { id: 'example-rule', type: 'domain', pattern: '*.example.com', action: 'direct', enabled: false },
      ],
    },
    settings: defaultSettings(),
    lastBackupAt: null,
    installedAt: Date.now(),
    updatedAt: Date.now(),
  };
}
