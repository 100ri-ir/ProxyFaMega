/* ProxyFaMega — auto-switch view (rules, tester, presets) */
'use strict';

window.VIEWS = window.VIEWS || {};

VIEWS.auto = {
  icon: 'shuffle',

  render: function (root) {
    var st = App.state;
    var T = i18n.t;

    /* ---------------- URL tester ---------------- */
    var testInput = UI.el('input', { class: 'input mono', dir: 'ltr', placeholder: 'https://www.youtube.com/watch?v=...' });
    var resultBox = UI.el('div', { class: 'tester-result', style: { display: 'none' } });

    function runTest() {
      var raw = testInput.value.trim();
      if (!raw) { resultBox.style.display = 'none'; return; }
      var url = raw.indexOf('://') === -1 ? 'https://' + raw : raw;
      var host = '';
      try { host = new URL(url).hostname; } catch (e) { host = raw; }
      var d = decideForUrl(App.state, url, host);
      var prof = d.action !== 'direct' ? findProfile(App.state, d.action) : null;
      resultBox.style.display = 'flex';
      resultBox.innerHTML = '';
      var parts = [
        UI.el('span', { class: 'chip', text: host }),
        UI.el('span', { class: 'tr-arrow', text: '←' }),
        prof
          ? UI.el('span', { class: 'chip chip-accent', text: prof.icon + ' ' + prof.name })
          : UI.el('span', { class: 'chip', text: T('auto.direct') }),
      ];
      parts.forEach(function (p) { resultBox.appendChild(p); });
      if (d.rule) {
        resultBox.appendChild(UI.el('span', { class: 'chip chip-ok', text: T('auto.matchedRule') + ': ' + d.rule.pattern }));
      } else {
        resultBox.appendChild(UI.el('span', { class: 'muted', style: { fontSize: '0.72rem' }, text: T('auto.noMatch') }));
      }
    }
    testInput.addEventListener('input', UI.debounce(runTest, 200));

    var tester = UI.el('section', { class: 'card' }, [
      UI.el('div', { class: 'card-title', html: UI.icon('search', 18) + '<span></span>' }),
      UI.el('div', { class: 'card-desc', text: T('auto.testerDesc') }),
      UI.el('div', { class: 'tester-row' }, [testInput]),
      resultBox,
    ]);
    tester.querySelector('.card-title span').textContent = T('auto.testerTitle');

    /* ---------------- rules ---------------- */
    var rulesCard = UI.el('section', { class: 'card' }, [
      UI.el('div', { class: 'card-title', html: UI.icon('shuffle', 18) + '<span></span>' }),
      UI.el('div', { class: 'card-desc', text: T('auto.rulesDesc') }),
    ]);
    rulesCard.querySelector('.card-title span').textContent = T('auto.rulesTitle');

    /* default action row */
    var defSelect = UI.el('select', { class: 'select', style: { width: '230px' } });
    defSelect.appendChild(UI.el('option', { value: 'direct', text: T('auto.direct') }));
    st.profiles.forEach(function (p) {
      defSelect.appendChild(UI.el('option', { value: p.id, text: p.icon + ' ' + p.name }));
    });
    defSelect.value = st.autoSwitch.defaultAction;
    defSelect.onchange = function () {
      App.update(function (s) { s.autoSwitch.defaultAction = defSelect.value; });
    };
    rulesCard.appendChild(UI.el('div', { class: 'set-row' }, [
      UI.el('div', { class: 's-body' }, [
        UI.el('div', { class: 's-title', text: T('auto.defaultAction') }),
        UI.el('div', { class: 's-desc', text: T('auto.defaultDesc') }),
        UI.el('span', { class: 's-example', text: T('auto.defaultExample') }),
      ]),
      UI.el('div', { class: 's-ctrl' }, [defSelect]),
    ]));

    /* rules list */
    var list = UI.el('div', { class: 'col', style: { gap: '8px' } });
    renderRuleRows(list);
    rulesCard.appendChild(UI.el('hr', { class: 'divider' }));
    rulesCard.appendChild(list);

    /* add rule */
    var addType = UI.el('select', { class: 'select' });
    [['domain', T('auto.typeDomain')], ['url', T('auto.typeUrl')], ['regex', T('auto.typeRegex')]].forEach(function (x) {
      addType.appendChild(UI.el('option', { value: x[0], text: x[1] }));
    });
    var addPattern = UI.el('input', { class: 'input mono', dir: 'ltr', placeholder: '*.youtube.com' });
    var addAction = UI.el('select', { class: 'select' });
    addAction.appendChild(UI.el('option', { value: 'direct', text: T('auto.direct') }));
    st.profiles.forEach(function (p) {
      addAction.appendChild(UI.el('option', { value: p.id, text: p.icon + ' ' + p.name }));
    });
    if (st.profiles.length) addAction.value = st.profiles[0].id;
    var addBtn = UI.el('button', { class: 'btn btn-primary', html: UI.icon('plus', 15) + '<span></span>' });
    addBtn.querySelector('span').textContent = T('auto.addRule');

    function doAdd() {
      var pattern = addPattern.value.trim();
      if (!pattern) return UI.toast(T('err.pattern'), 'err');
      App.update(function (s) {
        s.autoSwitch.rules.push({ id: UI.uid('r'), type: addType.value, pattern: pattern, action: addAction.value, enabled: true });
      });
      UI.toast(T('auto.ruleAdded'), 'ok');
    }
    addBtn.onclick = doAdd;
    addPattern.addEventListener('keydown', function (e) { if (e.key === 'Enter') doAdd(); });

    rulesCard.appendChild(UI.el('hr', { class: 'divider' }));
    rulesCard.appendChild(UI.el('div', { class: 'add-rule' }, [
      UI.el('div', { class: 'f', style: { flex: '0.8' } }, [UI.el('div', { class: 'label', text: T('auto.fType') }), addType]),
      UI.el('div', { class: 'f' }, [UI.el('div', { class: 'label', text: T('auto.fPattern') }), addPattern]),
      UI.el('div', { class: 'f', style: { flex: '0.9' } }, [UI.el('div', { class: 'label', text: T('auto.fAction') }), addAction]),
      addBtn,
    ]));

    /* ---------------- presets ---------------- */
    var presetsCard = UI.el('section', { class: 'card' }, [
      UI.el('div', { class: 'card-title', html: UI.icon('sparkle', 18) + '<span></span>' }),
      UI.el('div', { class: 'card-desc', text: T('auto.presetsDesc') }),
      UI.el('div', { class: 'preset-grid' }),
    ]);
    presetsCard.querySelector('.card-title span').textContent = T('auto.presetsTitle');
    var pgrid = presetsCard.querySelector('.preset-grid');

    PRESETS.forEach(function (preset) {
      var sel = UI.el('select', { class: 'select' });
      st.profiles.forEach(function (p) {
        sel.appendChild(UI.el('option', { value: p.id, text: p.icon + ' ' + p.name }));
      });
      if (st.profiles.length) sel.value = st.profiles[0].id;

      var applyBtn = UI.el('button', { class: 'btn btn-primary btn-sm', text: T('auto.applyPreset') });
      applyBtn.onclick = function () {
        if (!st.profiles.length) return UI.toast(T('popup.noProfiles'), 'err');
        UI.confirmModal({
          title: preset.fa + ' / ' + preset.en,
          message: (i18n.lang() === 'fa' ? preset.desc.fa : preset.desc.en) + '\n\n' + T('auto.presetConfirm'),
          okLabel: T('auto.applyPreset'),
        }).then(function (yes) {
          if (!yes) return;
          App.update(function (s) { applyPreset(s, preset.id, sel.value); }, { snapshot: 'preset:' + preset.id });
          UI.toast(T('auto.presetDone'), 'ok');
        });
      };

      pgrid.appendChild(UI.el('div', { class: 'card preset-card', style: { boxShadow: 'none' } }, [
        UI.el('div', { class: 'pr-head' }, [
          UI.el('span', { text: '✨' }),
          UI.el('span', { text: i18n.lang() === 'fa' ? preset.fa : preset.en }),
        ]),
        UI.el('div', { class: 'pr-desc', text: i18n.lang() === 'fa' ? preset.desc.fa : preset.desc.en }),
        UI.el('div', { class: 'pr-apply' }, [sel, applyBtn]),
      ]));
    });

    root.appendChild(tester);
    root.appendChild(rulesCard);
    root.appendChild(presetsCard);

    /* ---------------- helpers ---------------- */
    function renderRuleRows(list) {
      list.innerHTML = '';
      if (!st.autoSwitch.rules.length) {
        list.appendChild(UI.el('div', { class: 'muted', style: { textAlign: 'center', padding: '14px', fontSize: '0.82rem' }, text: T('auto.noRules') }));
        return;
      }
      st.autoSwitch.rules.forEach(function (r, idx) {
        var row = UI.el('div', { class: 'rule-row' + (r.enabled ? '' : ' off') });

        var tog = UI.el('label', { class: 'toggle' }, [
          UI.el('input', { type: 'checkbox', checked: r.enabled }),
          UI.el('span', { class: 'track' }),
        ]);
        tog.querySelector('input').onchange = function (e) {
          App.update(function (s) { s.autoSwitch.rules[idx].enabled = e.target.checked; }, { rerender: false });
          row.classList.toggle('off', !e.target.checked);
        };

        var typeSel = UI.el('select', { class: 'select' });
        [['domain', T('auto.typeDomain')], ['url', T('auto.typeUrl')], ['regex', T('auto.typeRegex')]].forEach(function (x) {
          typeSel.appendChild(UI.el('option', { value: x[0], text: x[1] }));
        });
        typeSel.value = r.type;

        var pat = UI.el('input', { class: 'input r-pattern', value: r.pattern, dir: 'ltr' });
        pat.addEventListener('change', function () {
          var v = pat.value.trim();
          if (!v) return;
          App.update(function (s) { s.autoSwitch.rules[idx].pattern = v; }, { rerender: false });
          if (testInput.value) runTest();
        });

        var actSel = UI.el('select', { class: 'select' });
        actSel.appendChild(UI.el('option', { value: 'direct', text: T('auto.direct') }));
        st.profiles.forEach(function (p) {
          actSel.appendChild(UI.el('option', { value: p.id, text: p.icon + ' ' + p.name }));
        });
        actSel.value = r.action;
        actSel.onchange = function () {
          App.update(function (s) { s.autoSwitch.rules[idx].action = actSel.value; }, { rerender: false });
          if (testInput.value) runTest();
        };
        typeSel.onchange = function () {
          App.update(function (s) { s.autoSwitch.rules[idx].type = typeSel.value; }, { rerender: false });
        };

        var upBtn = UI.el('button', { class: 'btn-icon', html: UI.icon('arrowUp', 14), title: T('auto.moveUp') });
        upBtn.onclick = function () {
          if (idx === 0) return;
          App.update(function (s) {
            var tmp = s.autoSwitch.rules[idx - 1];
            s.autoSwitch.rules[idx - 1] = s.autoSwitch.rules[idx];
            s.autoSwitch.rules[idx] = tmp;
          });
        };
        var delBtn = UI.el('button', { class: 'btn-icon danger', html: UI.icon('trash', 14), title: T('profiles.delete') });
        delBtn.onclick = function () {
          App.update(function (s) { s.autoSwitch.rules.splice(idx, 1); });
        };

        row.appendChild(tog);
        row.appendChild(typeSel);
        row.appendChild(pat);
        row.appendChild(actSel);
        row.appendChild(upBtn);
        row.appendChild(delBtn);
        list.appendChild(row);
      });
    }
  },
};

/* applies a preset to a state object (mutates) */
function applyPreset(st, presetId, profileId) {
  var rules = st.autoSwitch.rules;
  function hasPattern(p) {
    return rules.some(function (r) { return r.pattern === p; });
  }
  function addRules(list, action) {
    list.forEach(function (d) {
      var apex = d.indexOf('*') === 0 ? d : d;
      var sub = '*.' + d;
      if (!hasPattern(apex)) rules.push({ id: UI.uid('r'), type: 'domain', pattern: apex, action: action, enabled: true });
      if (!hasPattern(sub)) rules.push({ id: UI.uid('r'), type: 'domain', pattern: sub, action: action, enabled: true });
    });
  }
  if (presetId === 'iran-first') {
    st.autoSwitch.defaultAction = profileId;
    if (!hasPattern('*.ir')) rules.push({ id: UI.uid('r'), type: 'domain', pattern: '*.ir', action: 'direct', enabled: true });
    addRules(IRAN_DIRECT_DOMAINS, 'direct');
  } else if (presetId === 'google-only') {
    st.autoSwitch.defaultAction = 'direct';
    addRules(GOOGLE_DOMAINS, profileId);
  } else if (presetId === 'social') {
    addRules(SOCIAL_DOMAINS, profileId);
  } else if (presetId === 'all-proxy') {
    st.autoSwitch.defaultAction = profileId;
  }
}
