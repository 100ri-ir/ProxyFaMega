/* ProxyFaMega — settings view (every option documented with example) */
'use strict';

window.VIEWS = window.VIEWS || {};

VIEWS.settings = {
  icon: 'gear',

  render: function (root) {
    var T = i18n.t;
    var st = App.state;
    var s = st.settings;

    function setRow(opts) {
      /* opts: {title, desc, example, ctrl} */
      return UI.el('div', { class: 'set-row' }, [
        UI.el('div', { class: 's-body' }, [
          UI.el('div', { class: 's-title', text: opts.title }),
          UI.el('div', { class: 's-desc', text: opts.desc }),
          opts.example ? UI.el('span', { class: 's-example', text: opts.example }) : null,
        ]),
        UI.el('div', { class: 's-ctrl' }, [opts.ctrl]),
      ]);
    }

    function toggle(getVal, setKey) {
      return UI.el('label', { class: 'toggle' }, [
        UI.el('input', { type: 'checkbox', checked: !!getVal() }),
        UI.el('span', { class: 'track' }),
      ]);
    }

    /* ============ appearance ============ */
    var appCard = UI.el('section', { class: 'card' }, [
      UI.el('div', { class: 'card-title', html: UI.icon('sparkle', 18) + '<span></span>' }),
      UI.el('div', { class: 'card-desc', text: T('set.appearanceDesc') }),
    ]);
    appCard.querySelector('.card-title span').textContent = T('set.appearanceTitle');

    /* language */
    var langSeg = UI.el('div', { class: 'seg', style: { minWidth: '190px' } });
    [['fa', 'فارسی'], ['en', 'English']].forEach(function (x) {
      var b = UI.el('button', { text: x[1], class: s.lang === x[0] ? 'on' : '' });
      b.onclick = function () {
        App.update(function (stx) { stx.settings.lang = x[0]; }, { rerender: false });
        i18n.setLang(x[0]);
        applyLangGlobal(x[0]);
        applyUiTheme(App.state);
        App.rerender();
        UI.toast(T('set.langDone'), 'ok');
      };
      langSeg.appendChild(b);
    });
    appCard.appendChild(setRow({
      title: T('set.lang'),
      desc: T('set.langDesc'),
      example: T('set.langExample'),
      ctrl: langSeg,
    }));

    /* appearance mode */
    var appSeg = UI.el('div', { class: 'seg', style: { minWidth: '190px' } });
    [['auto', 'monitor'], ['light', 'sun'], ['dark', 'moon']].forEach(function (x) {
      var b = UI.el('button', { class: s.appearance === x[0] ? 'on' : '', html: UI.icon(x[1], 13) + '<span></span>' });
      b.querySelector('span').textContent = T('set.app.' + x[0]);
      b.onclick = function () {
        App.update(function (stx) { stx.settings.appearance = x[0]; }, { rerender: false });
        applyUiTheme(App.state);
        App.rerender();
      };
      appSeg.appendChild(b);
    });
    appCard.appendChild(setRow({
      title: T('set.appearance'),
      desc: T('set.appearanceDesc2'),
      example: T('set.appearanceExample'),
      ctrl: appSeg,
    }));

    /* font size */
    var fsSeg = UI.el('div', { class: 'seg', style: { minWidth: '190px' } });
    [['sm', 'set.fs.sm'], ['md', 'set.fs.md'], ['lg', 'set.fs.lg']].forEach(function (x) {
      var b = UI.el('button', { text: T(x[1]), class: s.fontSize === x[0] ? 'on' : '' });
      b.onclick = function () {
        App.update(function (stx) { stx.settings.fontSize = x[0]; }, { rerender: false });
        applyUiTheme(App.state);
        App.rerender();
      };
      fsSeg.appendChild(b);
    });
    appCard.appendChild(setRow({
      title: T('set.fontSize'),
      desc: T('set.fontSizeDesc'),
      example: T('set.fontSizeExample'),
      ctrl: fsSeg,
    }));

    /* theme gallery */
    var themeCard = UI.el('section', { class: 'card' }, [
      UI.el('div', { class: 'card-title', html: UI.icon('sparkle', 18) + '<span></span>' }),
      UI.el('div', { class: 'card-desc', text: T('set.themeDesc') }),
      UI.el('div', { class: 'theme-gallery' }),
    ]);
    themeCard.querySelector('.card-title span').textContent = T('set.themeTitle');
    var gallery = themeCard.querySelector('.theme-gallery');
    THEMES.forEach(function (th) {
      var c = UI.el('button', { class: 'theme-card' + (s.themeId === th.id ? ' on' : '') }, [
        UI.el('div', { class: 't-grad', style: { background: 'linear-gradient(135deg,' + th.colors[0] + ',' + th.colors[1] + ',' + th.colors[2] + ')' } }),
        UI.el('div', { class: 't-name', text: i18n.lang() === 'fa' ? th.fa : th.en }),
        UI.el('span', { class: 't-check', html: UI.icon('check', 13) }),
      ]);
      c.onclick = function () {
        App.update(function (stx) { stx.settings.themeId = th.id; }, { rerender: false });
        applyUiTheme(App.state);
        App.rerender();
        UI.toast(T('set.themeDone'), 'ok');
      };
      gallery.appendChild(c);
    });

    /* ============ behavior ============ */
    var behCard = UI.el('section', { class: 'card' }, [
      UI.el('div', { class: 'card-title', html: UI.icon('gear', 18) + '<span></span>' }),
      UI.el('div', { class: 'card-desc', text: T('set.behaviorDesc') }),
    ]);
    behCard.querySelector('.card-title span').textContent = T('set.behaviorTitle');

    function toggleRow(key, titleK, descK, exK, onChange) {
      var tog = UI.el('label', { class: 'toggle' }, [
        UI.el('input', { type: 'checkbox', checked: !!s[key] }),
        UI.el('span', { class: 'track' }),
      ]);
      tog.querySelector('input').onchange = function (e) {
        App.update(function (stx) { stx.settings[key] = e.target.checked; }, { rerender: false });
        if (onChange) onChange(e.target.checked);
      };
      behCard.appendChild(setRow({ title: T(titleK), desc: T(descK), example: T(exK), ctrl: tog }));
    }

    toggleRow('badge', 'set.badge', 'set.badgeDesc', 'set.badgeExample', function () {
      UI.sendMsg({ type: 'apply' }).then(function () {});
    });
    toggleRow('notifications', 'set.notif', 'set.notifDesc', 'set.notifExample');
    toggleRow('saveToast', 'set.saveToast', 'set.saveToastDesc', 'set.saveToastExample');
    toggleRow('bypassLocal', 'set.bypassLocal', 'set.bypassLocalDesc', 'set.bypassLocalExample', function () { App.rerender(); });
    toggleRow('remoteDns', 'set.remoteDns', 'set.remoteDnsDesc', 'set.remoteDnsExample');
    toggleRow('fallbackDirect', 'set.fallback', 'set.fallbackDesc', 'set.fallbackExample');

    /* sync */
    var syncTog = UI.el('label', { class: 'toggle' }, [
      UI.el('input', { type: 'checkbox', checked: !!s.sync }),
      UI.el('span', { class: 'track' }),
    ]);
    syncTog.querySelector('input').onchange = function (e) {
      var turnOn = e.target.checked;
      App.update(function (stx) { stx.settings.sync = turnOn; }, { rerender: false });
      if (turnOn) {
        Store.save(App.state).then(function (r) {
          if (r && r.error === 'sync-quota') {
            UI.toast(T('set.syncQuota'), 'err');
            App.rerender();
          } else {
            UI.toast(T('set.syncOn'), 'ok');
          }
        });
      } else {
        UI.toast(T('set.syncOff'), 'ok');
      }
    };
    behCard.appendChild(setRow({
      title: T('set.sync'),
      desc: T('set.syncDesc'),
      example: T('set.syncExample'),
      ctrl: syncTog,
    }));

    /* ============ shortcuts ============ */
    var isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;
    var kbdCard = UI.el('section', { class: 'card' }, [
      UI.el('div', { class: 'card-title', html: UI.icon('keyboard', 18) + '<span></span>' }),
      UI.el('div', { class: 'card-desc', text: T('set.kbdDesc') }),
      UI.el('table', { class: 'kbd-table' }, [
        UI.el('tr', {}, [
          UI.el('td', { text: T('set.kbdNext') }),
          UI.el('td', { html: '<kbd>Alt + Shift + P</kbd>' }),
        ]),
        UI.el('tr', {}, [
          UI.el('td', { text: T('set.kbdPrev') }),
          UI.el('td', { html: '<kbd>Alt + Shift + O</kbd>' }),
        ]),
      ]),
      UI.el('div', { class: 'row', style: { marginTop: '12px' } }, [
        UI.el('span', { class: 'chip', text: isFirefox ? 'about:addons' : 'chrome://extensions/shortcuts' }),
        UI.el('button', { class: 'btn btn-sm', html: UI.icon('copy', 13) + '<span></span>', onclick: function (e) {
          UI.copyText(isFirefox ? 'about:addons' : 'chrome://extensions/shortcuts').then(function () {
            UI.toast(T('set.copied'), 'ok');
          });
        } }),
        UI.el('span', { class: 'muted', style: { fontSize: '0.72rem' }, text: T('set.kbdWhere') }),
      ]),
    ]);
    kbdCard.querySelector('.card-title span').textContent = T('set.kbdTitle');
    kbdCard.querySelector('.btn span').textContent = T('common.copy');

    /* ============ danger zone ============ */
    var danger = UI.el('section', { class: 'card danger-zone' }, [
      UI.el('div', { class: 'card-title', html: UI.icon('alert', 18) + '<span></span>' }),
      UI.el('div', { class: 'card-desc', text: T('set.dangerDesc') }),
      UI.el('div', { class: 'row' }, [
        UI.el('button', { class: 'btn btn-danger', html: UI.icon('refresh', 14) + '<span></span>', onclick: function () {
          UI.confirmModal({
            title: T('set.resetAll'),
            message: T('set.resetConfirm'),
            danger: true,
            confirmInput: i18n.lang() === 'fa' ? 'بازنشانی' : 'RESET',
            okLabel: T('set.resetAll'),
          }).then(function (yes) {
            if (!yes) return;
            var fresh = defaultState();
            fresh.settings.lang = App.state.settings.lang;
            fresh.settings.themeId = App.state.settings.themeId;
            fresh.settings.appearance = App.state.settings.appearance;
            Store.addSnapshot('reset-all', App.state).then(function () {
              App.setState(fresh);
              UI.toast(T('set.resetDone'), 'ok');
            });
          });
        } }),
      ]),
    ]);
    danger.querySelector('.card-title span').textContent = T('set.dangerTitle');
    danger.querySelector('.btn span').textContent = T('set.resetAll');

    root.appendChild(appCard);
    root.appendChild(themeCard);
    root.appendChild(behCard);
    root.appendChild(kbdCard);
    root.appendChild(danger);
  },
};
