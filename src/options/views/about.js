/* ProxyFaMega — about view */
'use strict';

window.VIEWS = window.VIEWS || {};

VIEWS.about = {
  icon: 'info',

  render: function (root) {
    var T = i18n.t;
    var isFa = i18n.lang() === 'fa';

    var hero = UI.el('section', { class: 'card about-hero' }, [
      UI.el('img', { src: '../assets/icons/icon256.png', alt: 'ProxyFaMega' }),
      UI.el('div', { class: 'a-name', text: 'ProxyFaMega' }),
      UI.el('div', { class: 'a-tag', text: isFa ? 'مدیریت پروکسی مرورگر — فارسی، زیبا و حرفه‌ای' : 'Browser proxy manager — Persian-first, gorgeous & professional' }),
      UI.el('div', { class: 'a-chips' }, [
        UI.el('span', { class: 'chip chip-accent', text: 'v' + PFM.VERSION }),
        UI.el('span', { class: 'chip', text: isFa ? 'دوزبانه (فا/EN)' : 'Bilingual (FA/EN)' }),
        UI.el('span', { class: 'chip', text: isFa ? 'حالت شب' : 'Dark mode' }),
        UI.el('span', { class: 'chip', text: isFa ? '۸ تم رنگی' : '8 color themes' }),
        UI.el('span', { class: 'chip', text: 'Chrome · Edge · Firefox' }),
      ]),
    ]);

    var featCard = UI.el('section', { class: 'card' }, [
      UI.el('div', { class: 'card-title', html: UI.icon('sparkle', 18) + '<span></span>' }),
      UI.el('div', { class: 'tips-list' },
        ['about.f1', 'about.f2', 'about.f3', 'about.f4', 'about.f5', 'about.f6', 'about.f7'].map(function (k) {
          return UI.el('div', { class: 'tip' }, [
            UI.el('span', { class: 't-ico', html: UI.icon('check', 14) }),
            UI.el('span', { text: T(k) }),
          ]);
        })),
    ]);
    featCard.querySelector('.card-title span').textContent = T('about.features');

    var credits = UI.el('section', { class: 'card' }, [
      UI.el('div', { class: 'card-title', html: UI.icon('sparkle', 18) + '<span></span>' }),
      UI.el('div', { class: 'card-desc', text: T('about.creditsDesc') }),
      UI.el('div', { class: 'credits-grid' }, [
        creditCard('🛡️', 'ZeroOmega', 'https://github.com/zero-peak/ZeroOmega', isFa ? 'الهام‌بخش این پروژه — فورک مدرن SwitchyOmega' : 'The inspiration for this project'),
        creditCard('🔄', 'SwitchyOmega', 'https://github.com/FelisCatus/SwitchyOmega', isFa ? 'افزونه کلاسیک مدیریت پروکسی' : 'The classic proxy manager'),
        creditCard('✍️', 'Vazirmatn', 'https://github.com/rastikerdar/vazirmatn', isFa ? 'فونت فارسی زیبا توسط راستی‌کردار' : 'Beautiful Persian font by rastikerdar'),
      ]),
    ]);
    credits.querySelector('.card-title span').textContent = T('about.credits');

    var privacy = UI.el('section', { class: 'card' }, [
      UI.el('div', { class: 'card-title', html: UI.icon('shield', 18) + '<span></span>' }),
      UI.el('div', { class: 'card-desc', text: T('about.privacyDesc') }),
    ]);
    privacy.querySelector('.card-title span').textContent = T('about.privacy');

    var lic = UI.el('section', { class: 'card' }, [
      UI.el('div', { class: 'card-title', html: UI.icon('file', 18) + '<span></span>' }),
      UI.el('div', { class: 'card-desc', text: T('about.licenseDesc') }),
    ]);
    lic.querySelector('.card-title span').textContent = T('about.license');

    root.appendChild(hero);
    root.appendChild(featCard);
    root.appendChild(credits);
    root.appendChild(privacy);
    root.appendChild(lic);

    function creditCard(emoji, name, url, desc) {
      return UI.el('a', { class: 'card credit-card', href: url, target: '_blank', rel: 'noopener noreferrer' }, [
        UI.el('span', { class: 'c-emoji', text: emoji }),
        UI.el('div', { style: { minWidth: 0 } }, [
          UI.el('div', { style: { fontWeight: 800 }, text: name }),
          UI.el('div', { class: 'muted', style: { fontSize: '0.72rem' }, text: desc }),
        ]),
      ]);
    }
  },
};
