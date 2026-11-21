/* ProxyFaMega — profiles view (grid, editor, drag-order) */
'use strict';

window.VIEWS = window.VIEWS || {};

VIEWS.profiles = {
  icon: 'layers',

  render: function (root) {
    var st = App.state;
    var T = i18n.t;

    var head = UI.el('div', { class: 'view-head' }, [
      UI.el('div', { class: 'chip chip-accent', text: i18n.tLang('پروفایل‌ها', 'Profiles') + ' · ' + i18n.fmtNum(st.profiles.length) }),
      UI.el('span', { class: 'muted', style: { fontSize: '0.78rem' }, text: T('profiles.hint') }),
      UI.el('span', { class: 'spacer' }),
      UI.el('button', { class: 'btn', html: UI.icon('refresh', 15) + '<span></span>', onclick: function () { resetDefaultsModal(); } }),
    ]);
    head.lastChild.querySelector('span').textContent = T('profiles.restoreDefaults');

    var grid = UI.el('div', { class: 'prof-grid stagger' });

    st.profiles.forEach(function (p, idx) {
      var on = st.applied && st.mode === 'profile' && st.currentProfileId === p.id;
      var card = UI.el('div', {
        class: 'card pcard' + (on ? ' on' : ''),
        draggable: 'true',
        'data-id': p.id,
      }, [
        UI.el('div', { class: 'pcard-top' }, [
          UI.el('span', { class: 'avatar', style: { background: gradCss(p.color) }, text: p.icon || '🌐' }),
          UI.el('div', { style: { minWidth: 0, flex: 1 } }, [
            UI.el('div', { class: 'pcard-name' }, [
              UI.el('span', { text: p.name }),
              p.builtIn ? UI.el('span', { class: 'chip', text: T('profiles.builtIn') }) : null,
              on ? UI.el('span', { class: 'chip chip-accent', text: T('profiles.active') }) : null,
            ]),
            UI.el('div', { class: 'pcard-addr', text: p.protocol + '://' + p.host + ':' + p.port }),
          ]),
        ]),
        UI.el('div', { class: 'pcard-desc', text: p.desc ? (i18n.lang() === 'fa' ? p.desc.fa : p.desc.en) : '' }),
        UI.el('div', { class: 'pcard-actions' }, [
          UI.el('button', { class: 'btn btn-sm ' + (on ? '' : 'btn-primary'), html: UI.icon('play', 13) + '<span></span>', onclick: function () { App.switchTo('profile', p.id); } }),
          UI.el('button', { class: 'btn-icon', title: T('profiles.edit'), html: UI.icon('edit', 15), onclick: function () { openProfileEditor(p); } }),
          UI.el('button', { class: 'btn-icon', title: T('profiles.duplicate'), html: UI.icon('copy', 15), onclick: function () { duplicateProfile(p); } }),
          UI.el('button', { class: 'btn-icon danger', title: T('profiles.delete'), html: UI.icon('trash', 15), onclick: function () { deleteProfile(p); } }),
          UI.el('span', { class: 'spacer' }),
        ]),
      ]);
      card.querySelector('.pcard-actions .btn span').textContent = on ? T('profiles.current') : T('profiles.activate');
      grid.appendChild(card);
    });

    var add = UI.el('button', { class: 'add-card', html: UI.icon('plus', 22) + '<span></span>', onclick: function () { openProfileEditor(null); } });
    add.querySelector('span').textContent = T('profiles.addNew');
    grid.appendChild(add);

    root.appendChild(head);
    root.appendChild(grid);
    bindDrag(grid);
  },
};

/* ---------------- drag to reorder ---------------- */
function bindDrag(grid) {
  var dragId = null;
  grid.querySelectorAll('.pcard').forEach(function (card) {
    card.addEventListener('dragstart', function (e) {
      dragId = card.getAttribute('data-id');
      card.style.opacity = '0.4';
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', dragId); } catch (err) { /* IE */ }
    });
    card.addEventListener('dragend', function () {
      card.style.opacity = '1';
      grid.querySelectorAll('.pcard').forEach(function (c) { c.style.borderTop = ''; c.style.borderBottom = ''; });
    });
    card.addEventListener('dragover', function (e) {
      e.preventDefault();
      if (!dragId || card.getAttribute('data-id') === dragId) return;
      var rect = card.getBoundingClientRect();
      var after = (e.clientY - rect.top) > rect.height / 2;
      card.style.borderTop = after ? '' : '2.5px solid var(--a1)';
      card.style.borderBottom = after ? '2.5px solid var(--a1)' : '';
    });
    card.addEventListener('dragleave', function () {
      card.style.borderTop = '';
      card.style.borderBottom = '';
    });
    card.addEventListener('drop', function (e) {
      e.preventDefault();
      var targetId = card.getAttribute('data-id');
      if (!dragId || !targetId || dragId === targetId) return;
      var rect = card.getBoundingClientRect();
      var after = (e.clientY - rect.top) > rect.height / 2;
      App.update(function (st) {
        var from = st.profiles.findIndex(function (p) { return p.id === dragId; });
        var moved = st.profiles.splice(from, 1)[0];
        var to = st.profiles.findIndex(function (p) { return p.id === targetId; });
        st.profiles.splice(to + (after ? 1 : 0), 0, moved);
      });
      dragId = null;
    });
  });
}

/* ---------------- profile editor ---------------- */
function openProfileEditor(profile) {
  var T = i18n.t;
  var isNew = !profile;
  var draft = profile ? JSON.parse(JSON.stringify(profile)) : {
    id: UI.uid('p'), name: '', protocol: 'socks5', host: '127.0.0.1', port: 1080,
    color: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)].id,
    icon: '🚀', builtIn: false, desc: { fa: '', en: '' }, bypass: [],
  };

  var preview = UI.el('span', { class: 'avatar lg' });

  function syncPreview() {
    preview.style.background = gradCss(draft.color);
    preview.textContent = draft.icon || '🌐';
  }
  syncPreview();

  var nameInput = UI.el('input', { class: 'input', value: draft.name, placeholder: T('profiles.phName') });
  var hostInput = UI.el('input', { class: 'input mono', value: draft.host, placeholder: '127.0.0.1', dir: 'ltr' });
  var portInput = UI.el('input', { class: 'input mono', type: 'number', min: 1, max: 65535, value: draft.port, placeholder: '1080', dir: 'ltr' });
  var protoSeg = UI.el('div', { class: 'seg' });
  PROTOCOLS.forEach(function (pr) {
    var b = UI.el('button', { text: pr.id.toUpperCase(), class: draft.protocol === pr.id ? 'on' : '', onclick: function () {
      draft.protocol = pr.id;
      protoSeg.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
    } });
    protoSeg.appendChild(b);
  });

  var colorRow = UI.el('div', { class: 'color-swatches' });
  GRADIENTS.forEach(function (g) {
    var sw = UI.el('button', { class: 'swatch' + (draft.color === g.id ? ' on' : ''), style: { background: 'linear-gradient(135deg,' + g.colors[0] + ',' + g.colors[1] + ')' }, title: g.id });
    sw.onclick = function () {
      draft.color = g.id;
      colorRow.querySelectorAll('.swatch').forEach(function (x) { x.classList.remove('on'); });
      sw.classList.add('on');
      syncPreview();
    };
    colorRow.appendChild(sw);
  });

  var emojiGrid = UI.el('div', { class: 'emoji-grid' });
  PROFILE_EMOJIS.forEach(function (e) {
    var b = UI.el('button', { text: e, class: draft.icon === e ? 'on' : '' });
    b.onclick = function () {
      draft.icon = e;
      emojiGrid.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      syncPreview();
    };
    emojiGrid.appendChild(b);
  });

  var bypassInput = UI.el('textarea', {
    class: 'textarea mono', dir: 'ltr',
    placeholder: '*.example.com',
  });
  bypassInput.value = (draft.bypass || []).join('\n');
  var descInput = UI.el('input', { class: 'input', value: i18n.lang() === 'fa' ? (draft.desc && draft.desc.fa || '') : (draft.desc && draft.desc.en || ''), placeholder: T('profiles.phNote') });

  var err = UI.el('div', { class: 'chip chip-danger', style: { display: 'none' } });

  var body = UI.el('div', { class: 'col', style: { gap: '16px' } }, [
    UI.el('div', { class: 'row', style: { justifyContent: 'center', padding: '6px 0' } }, [preview]),
    UI.el('div', { class: 'form-grid' }, [
      UI.el('div', { class: 'full' }, [UI.el('div', { class: 'label', text: T('profiles.fName') }), nameInput]),
      UI.el('div', { class: 'full' }, [UI.el('div', { class: 'label', text: T('profiles.fProtocol') }), protoSeg, UI.el('div', { class: 'hint', html: T('profiles.hProto') })]),
      UI.el('div', [UI.el('div', { class: 'label', text: T('profiles.fHost') }), hostInput, UI.el('div', { class: 'hint', html: T('profiles.hHost') })]),
      UI.el('div', [UI.el('div', { class: 'label', text: T('profiles.fPort') }), portInput, UI.el('div', { class: 'hint', html: T('profiles.hPort') })]),
      UI.el('div', { class: 'full' }, [UI.el('div', { class: 'label', text: T('profiles.fColor') }), colorRow]),
      UI.el('div', { class: 'full' }, [UI.el('div', { class: 'label', text: T('profiles.fIcon') }), emojiGrid]),
      UI.el('div', { class: 'full' }, [UI.el('div', { class: 'label', text: T('profiles.fNote') }), descInput]),
      UI.el('div', { class: 'full' }, [UI.el('div', { class: 'label', text: T('profiles.fBypass') }), bypassInput, UI.el('div', { class: 'hint', html: T('profiles.hBypass') })]),
    ]),
    err,
    UI.el('div', { class: 'row modal-actions', style: { justifyContent: 'flex-end', gap: '10px' } }, [
      draft.builtIn ? UI.el('button', { class: 'btn', html: UI.icon('refresh', 14) + '<span></span>', onclick: function () {
        var def = defaultProfiles().filter(function (p) { return p.id === draft.id; })[0];
        if (def) {
          draft = JSON.parse(JSON.stringify(def));
          nameInput.value = draft.name; hostInput.value = draft.host; portInput.value = draft.port;
          bypassInput.value = (draft.bypass || []).join('\n');
          descInput.value = draft.desc ? (i18n.lang() === 'fa' ? draft.desc.fa : draft.desc.en) : '';
          syncPreview();
          UI.toast(i18n.t('profiles.resetDone'), 'ok');
        }
      } }) : null,
      UI.el('button', { class: 'btn btn-ghost', text: T('common.cancel'), onclick: function () { m.close(); } }),
      UI.el('button', { class: 'btn btn-primary', text: isNew ? T('profiles.create') : T('common.save'), onclick: save }),
    ]),
  ]);
  var resetSpan = body.querySelector('.row:last-child .btn:not(.btn-ghost):not(.btn-primary) span');
  if (resetSpan) resetSpan.textContent = T('profiles.resetThis');

  var m = UI.openModal(isNew ? T('profiles.newTitle') : T('profiles.editTitle'), body, { icon: 'layers', width: '600px' });

  function save() {
    draft.name = nameInput.value.trim();
    draft.host = hostInput.value.trim();
    draft.port = parseInt(portInput.value, 10);
    var note = descInput.value.trim();
    draft.desc = { fa: i18n.lang() === 'fa' ? note : (draft.desc && draft.desc.fa) || '', en: i18n.lang() === 'fa' ? (draft.desc && draft.desc.en) || '' : note };
    draft.bypass = bypassInput.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);

    if (!draft.name) return showError(T('err.name'));
    if (!draft.host) return showError(T('err.host'));
    if (!draft.port || draft.port < 1 || draft.port > 65535) return showError(T('err.port'));
    var dup = App.state.profiles.some(function (p) { return p.id !== draft.id && p.name === draft.name; });
    if (dup) return showError(T('err.duplicate'));

    App.update(function (st) {
      var idx = st.profiles.findIndex(function (p) { return p.id === draft.id; });
      if (idx === -1) st.profiles.push(draft);
      else st.profiles[idx] = draft;
    }, { snapshot: isNew ? null : 'edit:' + draft.name });
    m.close();
    UI.toast(T('toast.saved'), 'ok');
  }

  function showError(msg) {
    err.textContent = msg;
    err.style.display = 'inline-flex';
  }
}

/* ---------------- actions ---------------- */
function duplicateProfile(p) {
  var copy = JSON.parse(JSON.stringify(p));
  copy.id = UI.uid('p');
  var base = p.name;
  var n = 2;
  while (App.state.profiles.some(function (x) { return x.name === copy.name; })) {
    copy.name = base + ' (' + i18n.fmtNum(n) + ')';
    n++;
  }
  copy.builtIn = false;
  App.update(function (st) { st.profiles.push(copy); });
  UI.toast(i18n.t('profiles.dupDone'), 'ok');
}

function deleteProfile(p) {
  UI.confirmModal({
    title: i18n.t('profiles.deleteTitle'),
    message: i18n.t('profiles.deleteConfirm', { name: p.name }),
    danger: true,
    okLabel: i18n.t('profiles.delete'),
  }).then(function (yes) {
    if (!yes) return;
    App.update(function (st) {
      st.profiles = st.profiles.filter(function (x) { return x.id !== p.id; });
      if (st.currentProfileId === p.id && st.profiles.length) st.currentProfileId = st.profiles[0].id;
    }, { snapshot: 'del:' + p.name });
    UI.toast(i18n.t('toast.deleted'), 'ok');
  });
}

function resetDefaultsModal() {
  UI.confirmModal({
    title: i18n.t('profiles.restoreDefaults'),
    message: i18n.t('profiles.restoreConfirm'),
    okLabel: i18n.t('common.ok'),
  }).then(function (yes) {
    if (!yes) return;
    App.update(function (st) {
      var defs = defaultProfiles();
      defs.forEach(function (d) {
        var idx = st.profiles.findIndex(function (p) { return p.id === d.id; });
        if (idx === -1) st.profiles.push(d);
        else st.profiles[idx] = d;
      });
    }, { snapshot: 'restore-defaults' });
    UI.toast(i18n.t('profiles.resetDone'), 'ok');
  });
}
