/* ProxyFaMega — dashboard view */
'use strict';

window.VIEWS = window.VIEWS || {};

VIEWS.dashboard = {
  icon: 'home',

  render: function (root) {
    var st = App.state;
    var info = effectiveInfo(st, function (fa, en) { return i18n.tLang(fa, en); });
    var T = i18n.t;

    /* ---- hero ---- */
    var heroToggle = UI.el('label', { class: 'toggle big' }, [
      UI.el('input', {
        type: 'checkbox',
        checked: st.applied && (st.mode === 'profile' || st.mode === 'auto'),
        on: { change: function (e) {
          if (e.target.checked) App.switchTo(st.mode === 'auto' ? 'auto' : 'profile', st.currentProfileId);
          else App.switchTo('direct');
        } },
      }),
      UI.el('span', { class: 'track' }),
    ]);

    var hero = UI.el('section', { class: 'card hero-card' }, [
      UI.el('div', { class: 'hero-emoji', text: info.icon }),
      UI.el('div', {}, [
        UI.el('div', { class: 'h-label', text: T('dash.currentMode') }),
        UI.el('div', { class: 'h-name', text: info.label }),
        UI.el('div', { class: 'h-sub', text: info.sub || '' }),
      ]),
      UI.el('div', { class: 'h-toggle' }, [
        UI.el('span', { class: 't-label', text: T('dash.proxyOn') }),
        heroToggle,
      ]),
    ]);

    /* ---- stats ---- */
    function statChip(val, key) {
      return UI.el('div', { class: 'stat-chip' }, [
        UI.el('div', {}, [
          UI.el('div', { class: 's-val', text: val }),
          UI.el('div', { class: 's-key', text: key }),
        ]),
      ]);
    }

    var lastBackup = st.lastBackupAt ? i18n.fmtDate(st.lastBackupAt) : T('common.never');
    var stats = UI.el('section', { class: 'card stats-card' }, [
      UI.el('div', { class: 'card-title', html: UI.icon('sparkle', 16) + '<span></span>' }),
      UI.el('div', { class: 'stat-chips' }, [
        statChip(String(st.profiles.length), T('dash.profilesCount')),
        statChip(String((st.autoSwitch.rules || []).filter(function (r) { return r.enabled; }).length), T('dash.rulesCount')),
        statChip(lastBackup, T('dash.lastBackup')),
      ]),
    ]);
    stats.querySelector('.card-title span').textContent = T('dash.statsTitle');

    /* ---- quick profiles ---- */
    var quick = UI.el('section', { class: 'card' }, [
      UI.el('div', { class: 'card-title', html: UI.icon('zap', 16) + '<span></span>' }),
      UI.el('div', { class: 'card-desc', text: T('dash.quickDesc') }),
      UI.el('div', { class: 'quick-grid' }),
    ]);
    quick.querySelector('.card-title span').textContent = T('dash.quickTitle');
    var qgrid = quick.querySelector('.quick-grid');
    if (!st.profiles.length) {
      qgrid.appendChild(UI.el('div', { class: 'muted', text: T('popup.noProfiles') }));
    }
    st.profiles.slice(0, 9).forEach(function (p) {
      var on = st.applied && st.mode === 'profile' && st.currentProfileId === p.id;
      var b = UI.el('button', { class: 'qp' + (on ? ' on' : '') }, [
        UI.el('span', { class: 'avatar sm', style: { background: gradCss(p.color) }, text: p.icon || '🌐' }),
        UI.el('div', { style: { minWidth: 0 } }, [
          UI.el('div', { class: 'q-name', text: p.name }),
          UI.el('div', { class: 'q-port', text: p.host + ':' + p.port }),
        ]),
      ]);
      b.onclick = function () { App.switchTo('profile', p.id); };
      qgrid.appendChild(b);
    });

    /* ---- latency ---- */
    var latValue = UI.el('div', { class: 'lat-badge', text: '—' });
    var latBtn = UI.el('button', { class: 'btn btn-primary', html: UI.icon('zap', 15) + '<span></span>' });
    latBtn.querySelector('span').textContent = T('dash.testNow');
    var lat = UI.el('section', { class: 'card' }, [
      UI.el('div', { class: 'card-title', html: UI.icon('globe', 16) + '<span></span>' }),
      UI.el('div', { class: 'card-desc', text: T('dash.testDesc') }),
      UI.el('div', { class: 'lat-row' }, [latBtn, latValue, UI.el('span', { class: 'muted', style: { fontSize: '0.72rem' }, text: T('dash.testNote') })]),
    ]);
    lat.querySelector('.card-title span').textContent = T('dash.testTitle');
    latBtn.onclick = function () {
      latBtn.disabled = true;
      latValue.className = 'lat-badge';
      latValue.innerHTML = '<span class="spinner"></span>';
      UI.sendMsg({ type: 'test-latency' }).then(function (res) {
        latBtn.disabled = false;
        if (res && res.ok) {
          latValue.className = 'lat-badge ' + (res.ms < 300 ? 'ok' : (res.ms < 900 ? 'mid' : 'bad'));
          latValue.textContent = res.ms + ' ms';
        } else {
          latValue.className = 'lat-badge bad';
          latValue.textContent = T('popup.testFail');
        }
      });
    };

    /* ---- tips ---- */
    var tips = UI.el('section', { class: 'card' }, [
      UI.el('div', { class: 'card-title', html: UI.icon('sparkle', 16) + '<span></span>' }),
      UI.el('div', { class: 'tips-list' },
        ['dash.tip1', 'dash.tip2', 'dash.tip3'].map(function (k) {
          return UI.el('div', { class: 'tip' }, [
            UI.el('span', { class: 't-ico', html: UI.icon('check', 14) }),
            UI.el('span', { text: T(k) }),
          ]);
        })),
    ]);
    tips.querySelector('.card-title span').textContent = T('dash.tipsTitle');

    var grid = UI.el('div', { class: 'dash-grid stagger' }, [hero, stats]);
    var wrap = UI.el('div', { class: 'col', style: { gap: '12px' } });
    wrap.appendChild(grid);
    wrap.appendChild(quick);
    var row2 = UI.el('div', { class: 'dash-grid' });
    row2.appendChild(lat);
    row2.appendChild(tips);
    wrap.appendChild(row2);
    root.appendChild(wrap);
  },
};
