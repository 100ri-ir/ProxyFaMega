/* ProxyFaMega — backup view (export/encrypt, import incl. ZeroOmega, snapshots) */
'use strict';

window.VIEWS = window.VIEWS || {};

VIEWS.backup = {
  icon: 'database',

  render: function (root) {
    var T = i18n.t;
    var st = App.state;

    /* ================= EXPORT ================= */
    var scopeSel = UI.el('select', { class: 'select', style: { width: '240px' } });
    [['full', T('bk.scopeFull')], ['profiles', T('bk.scopeProfiles')], ['settings', T('bk.scopeSettings')]].forEach(function (x) {
      scopeSel.appendChild(UI.el('option', { value: x[0], text: x[1] }));
    });

    var passInput = UI.el('input', { class: 'input', type: 'password', placeholder: T('bk.passPh'), dir: 'ltr' });
    var passHint = UI.el('div', { class: 'hint', html: T('bk.passHint') });

    var exportCard = UI.el('section', { class: 'card' }, [
      UI.el('div', { class: 'card-title', html: UI.icon('download', 18) + '<span></span>' }),
      UI.el('div', { class: 'card-desc', text: T('bk.exportDesc') }),
      UI.el('div', { class: 'col', style: { gap: '12px' } }, [
        UI.el('div', { class: 'row' }, [
          UI.el('span', { class: 'label', style: { margin: 0 }, text: T('bk.scope') }),
          scopeSel,
        ]),
        UI.el('div', { class: 'row' }, [
          UI.el('span', { class: 'label', style: { margin: 0 }, html: UI.icon('lock', 14) + ' ' }),
          passInput,
        ]),
        passHint,
      ]),
      UI.el('div', { class: 'row', style: { marginTop: '16px' } }, [
        UI.el('button', { class: 'btn btn-primary', html: UI.icon('download', 15) + '<span></span>' }),
        UI.el('button', { class: 'btn', html: UI.icon('copy', 15) + '<span></span>' }),
      ]),
    ]);
    exportCard.querySelector('.card-title span').textContent = T('bk.exportTitle');
    var btns = exportCard.querySelectorAll('.row:last-child .btn');
    var dlBtn = btns[0], cpBtn = btns[1];
    dlBtn.querySelector('span').textContent = T('bk.download');
    cpBtn.querySelector('span').textContent = T('bk.copyJson');

    function buildBackupObject() {
      var scope = scopeSel.value;
      var data;
      if (scope === 'profiles') data = { profiles: JSON.parse(JSON.stringify(st.profiles)) };
      else if (scope === 'settings') data = { settings: JSON.parse(JSON.stringify(st.settings)) };
      else data = JSON.parse(JSON.stringify(st));
      return { app: PFM.NAME, format: 'pfm-backup', version: 1, exportedAt: new Date().toISOString(), scope: scope, data: data };
    }

    dlBtn.onclick = function () {
      var obj = buildBackupObject();
      var finish = function (text) {
        var d = new Date();
        var pad = function (n) { return (n < 10 ? '0' : '') + n; };
        var fname = 'ProxyFaMega-backup-' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '-' + pad(d.getHours()) + pad(d.getMinutes()) + '.json';
        UI.download(fname, JSON.stringify(text, null, 2));
        App.update(function (s) { s.lastBackupAt = Date.now(); }, { rerender: false });
        UI.toast(T('bk.exported'), 'ok');
      };
      var pass = passInput.value;
      if (pass) {
        encryptBackup(obj, pass).then(finish).catch(function () { UI.toast(T('bk.cryptErr'), 'err'); });
      } else finish(obj);
    };

    cpBtn.onclick = function () {
      var obj = buildBackupObject();
      var pass = passInput.value;
      var done = function (text) {
        UI.copyText(JSON.stringify(text)).then(function () {
          UI.toast(T('bk.copied'), 'ok');
          App.update(function (s) { s.lastBackupAt = Date.now(); }, { rerender: false });
        });
      };
      if (pass) {
        encryptBackup(obj, pass).then(done).catch(function () { UI.toast(T('bk.cryptErr'), 'err'); });
      } else done(obj);
    };

    /* ================= IMPORT ================= */
    var pasteArea = UI.el('textarea', { class: 'textarea mono', dir: 'ltr', placeholder: '{ "app": "ProxyFaMega", ... }' });
    var fileInput = UI.el('input', { type: 'file', accept: '.json,application/json', style: { display: 'none' } });

    var dz = UI.el('div', { class: 'dropzone' }, [
      UI.el('div', { class: 'dz-icon', text: '📥' }),
      UI.el('div', { text: T('bk.dropHere'), style: { fontWeight: 700 } }),
      UI.el('div', { class: 'muted', style: { fontSize: '0.74rem', marginTop: '4px' }, text: T('bk.dropHint') }),
    ]);
    dz.onclick = function () { fileInput.click(); };
    dz.addEventListener('dragover', function (e) { e.preventDefault(); dz.classList.add('drag'); });
    dz.addEventListener('dragleave', function () { dz.classList.remove('drag'); });
    dz.addEventListener('drop', function (e) {
      e.preventDefault();
      dz.classList.remove('drag');
      var f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) readFile(f);
    });
    fileInput.onchange = function () {
      if (fileInput.files && fileInput.files[0]) readFile(fileInput.files[0]);
    };

    function readFile(f) {
      var r = new FileReader();
      r.onload = function () { pasteArea.value = String(r.result || ''); parseAndPreview(String(r.result || '')); };
      r.readAsText(f);
    }

    var importBtn = UI.el('button', { class: 'btn btn-primary', html: UI.icon('upload', 15) + '<span></span>' });
    importBtn.querySelector('span').textContent = T('bk.importBtn');
    importBtn.onclick = function () {
      var txt = pasteArea.value.trim();
      if (!txt) return UI.toast(T('bk.emptyImport'), 'err');
      parseAndPreview(txt);
    };

    var importCard = UI.el('section', { class: 'card' }, [
      UI.el('div', { class: 'card-title', html: UI.icon('upload', 18) + '<span></span>' }),
      UI.el('div', { class: 'card-desc', text: T('bk.importDesc') }),
      dz,
      UI.el('div', { class: 'col', style: { gap: '10px', marginTop: '14px' } }, [
        UI.el('div', { class: 'label', text: T('bk.paste') }),
        pasteArea,
        UI.el('div', { class: 'row' }, [importBtn, UI.el('span', { class: 'muted', style: { fontSize: '0.72rem' }, text: T('bk.soNote') })]),
      ]),
    ]);
    importCard.querySelector('.card-title span').textContent = T('bk.importTitle');
    importCard.appendChild(fileInput);

    function parseAndPreview(txt) {
      var json = null;
      try { json = JSON.parse(txt); } catch (e) { return UI.toast(T('bk.badJson'), 'err'); }

      var proceed = function (obj) {
        var parsed = classifyBackup(obj);
        if (!parsed) return UI.toast(T('bk.unknownFormat'), 'err');
        showImportPreview(parsed);
      };

      if (json && json.format === 'pfm-encrypted') {
        askPasswordDecrypt(json).then(function (obj) {
          if (obj) proceed(obj);
        });
      } else proceed(json);
    }

    /* ================= SNAPSHOTS ================= */
    var snapCard = UI.el('section', { class: 'card' }, [
      UI.el('div', { class: 'card-title', html: UI.icon('history', 18) + '<span></span>' }),
      UI.el('div', { class: 'card-desc', text: T('bk.snapDesc') }),
      UI.el('div', { class: 'snap-list' }),
    ]);
    snapCard.querySelector('.card-title span').textContent = T('bk.snapTitle');
    var snapList = snapCard.querySelector('.snap-list');
    renderSnapshots(snapList);

    /* ================= assemble ================= */
    root.appendChild(exportCard);
    root.appendChild(importCard);
    root.appendChild(snapCard);

    /* ---------------------------------------------------------------- */
    function classifyBackup(obj) {
      if (!obj || typeof obj !== 'object') return null;
      /* ProxyFaMega backup */
      if (obj.app === PFM.NAME && (obj.format === 'pfm-backup') && obj.data) {
        var d = obj.data;
        var profiles = Array.isArray(d.profiles) ? d.profiles : null;
        var hasSettings = !!d.settings;
        return { kind: 'pfm', label: 'ProxyFaMega', profiles: profiles, settings: hasSettings ? d.settings : null, full: !!(d.profiles && d.settings) && obj.scope === 'full', state: (d.profiles && d.settings && d.autoSwitch) ? d : null };
      }
      /* SwitchyOmega / ZeroOmega options export */
      var soProfiles = [];
      var soRules = null;
      var looksSO = false;
      Object.keys(obj).forEach(function (k) {
        if (k.charAt(0) !== '+') return;
        var v = obj[k];
        if (!v || typeof v !== 'object') return;
        looksSO = true;
        if (v.profileType === 'FixedProfile') {
          var fp = v.fallbackProxy;
          if (!fp && Array.isArray(v.proxyServers) && v.proxyServers.length) fp = v.proxyServers[0];
          if (fp && fp.host && fp.port) {
            soProfiles.push({
              id: UI.uid('imp'), name: k.slice(1), protocol: normalizeSOProto(fp.protocol || 'socks5'),
              host: fp.host, port: fp.port, color: GRADIENTS[soProfiles.length % GRADIENTS.length].id,
              icon: '🌐', builtIn: false, desc: { fa: i18n.t('bk.importedFrom') + ' ZeroOmega', en: 'Imported from ZeroOmega' }, bypass: [],
            });
          }
        } else if (v.profileType === 'SwitchProfile' && Array.isArray(v.rules)) {
          soRules = v;
        }
      });
      if (looksSO && (soProfiles.length || soRules)) {
        return { kind: 'so', label: 'ZeroOmega / SwitchyOmega', profiles: soProfiles, soRules: soRules };
      }
      return null;
    }

    function normalizeSOProto(p) {
      p = String(p || '').toLowerCase();
      if (p === 'socks' || p === 'socks5') return 'socks5';
      if (p === 'socks4') return 'socks4';
      if (p === 'https' || p === 'ssl') return 'https';
      return 'http';
    }

    function askPasswordDecrypt(json) {
      return new Promise(function (resolve) {
        var inp = UI.el('input', { class: 'input', type: 'password', placeholder: T('bk.passPh'), dir: 'ltr' });
        var err = UI.el('div', { class: 'chip chip-danger', style: { display: 'none' } });
        var body = UI.el('div', { class: 'col', style: { gap: '14px' } }, [
          UI.el('div', { class: 'muted', text: T('bk.encryptedNote') }),
          inp, err,
          UI.el('div', { class: 'row', style: { justifyContent: 'flex-end' } }, [
            UI.el('button', { class: 'btn btn-ghost', text: T('common.cancel'), onclick: function () { m.close(); resolve(null); } }),
            UI.el('button', { class: 'btn btn-primary', text: T('bk.decrypt'), onclick: function () {
              decryptBackup(json, inp.value).then(function (obj) {
                m.close();
                resolve(obj);
              }).catch(function () {
                err.textContent = T('bk.wrongPass');
                err.style.display = 'inline-flex';
              });
            } }),
          ]),
        ]);
        var m = UI.openModal(T('bk.enterPass'), body, { icon: 'key', width: '400px' });
      });
    }

    function showImportPreview(parsed) {
      var st2 = App.state;
      var mode = 'merge';
      var body = UI.el('div', { class: 'col', style: { gap: '14px' } });

      body.appendChild(UI.el('div', { class: 'row' }, [
        UI.el('span', { class: 'chip chip-accent', text: parsed.label }),
        parsed.profiles ? UI.el('span', { class: 'chip', text: T('bk.nProfiles', { n: i18n.fmtNum(parsed.profiles.length) }) }) : null,
        parsed.full || parsed.state ? UI.el('span', { class: 'chip', text: T('bk.fullBackup') }) : null,
      ]));

      if (parsed.profiles && parsed.profiles.length) {
        var list = UI.el('div', { class: 'import-preview-list' });
        parsed.profiles.forEach(function (p) {
          var conflict = st2.profiles.some(function (x) { return x.name === p.name; });
          list.appendChild(UI.el('div', { class: 'ip-item' }, [
            UI.el('span', { class: 'avatar sm', style: { background: gradCss(p.color) }, text: p.icon || '🌐' }),
            UI.el('span', { style: { flex: 1, fontWeight: 600 }, text: p.name }),
            UI.el('span', { class: 'mono muted', style: { fontSize: '0.72rem' }, text: p.host + ':' + p.port }),
            conflict ? UI.el('span', { class: 'chip chip-warn', text: T('bk.conflict') }) : null,
          ]));
        });
        body.appendChild(list);
      }

      if (parsed.kind === 'so' && parsed.soRules) {
        body.appendChild(UI.el('div', { class: 'hint', text: T('bk.soRulesNote') }));
      }

      var seg = UI.el('div', { class: 'seg', style: { alignSelf: 'flex-start' } });
      [['merge', T('bk.merge')], ['replace', T('bk.replace')]].forEach(function (x) {
        var b = UI.el('button', { text: x[1], class: x[0] === 'merge' ? 'on' : '' });
        b.onclick = function () {
          mode = x[0];
          seg.querySelectorAll('button').forEach(function (y) { y.classList.remove('on'); });
          b.classList.add('on');
        };
        seg.appendChild(b);
      });
      body.appendChild(UI.el('div', {}, [
        UI.el('div', { class: 'label', text: T('bk.importMode') }),
        seg,
        UI.el('div', { class: 'hint', text: T('bk.modeDesc') }),
      ]));

      body.appendChild(UI.el('div', { class: 'row', style: { justifyContent: 'flex-end' } }, [
        UI.el('button', { class: 'btn btn-ghost', text: T('common.cancel'), onclick: function () { m.close(); } }),
        UI.el('button', { class: 'btn btn-primary', html: UI.icon('upload', 14) + '<span></span>', onclick: function () {
          doImport(parsed, mode);
          m.close();
        } }),
      ]));
      body.lastChild.lastChild.querySelector('span').textContent = T('bk.importBtn');
      var m = UI.openModal(T('bk.previewTitle'), body, { icon: 'database', width: '540px' });
    }

    function doImport(parsed, mode) {
      Store.addSnapshot('import', App.state).then(function () {
        if (mode === 'replace' && parsed.kind === 'pfm' && parsed.state) {
          var fresh = defaultState();
          fresh.profiles = parsed.profiles || fresh.profiles;
          fresh.settings = Object.assign(fresh.settings, parsed.settings || {});
          fresh.autoSwitch = parsed.state.autoSwitch || fresh.autoSwitch;
          fresh.currentProfileId = parsed.state.currentProfileId || (fresh.profiles[0] && fresh.profiles[0].id);
          App.setState(fresh);
        } else {
          App.update(function (s) {
            if (parsed.profiles) {
              parsed.profiles.forEach(function (p) {
                var idx = s.profiles.findIndex(function (x) { return x.name === p.name; });
                if (idx !== -1) s.profiles[idx] = p;
                else s.profiles.push(p);
              });
            }
            if (parsed.kind === 'so' && parsed.soRules) {
              var nameToId = {};
              s.profiles.forEach(function (p) { nameToId[p.name] = p.id; });
              (parsed.soRules.rules || []).forEach(function (r) {
                if (!r || !r.condition) return;
                var ct = r.condition.conditionType || '';
                var type = (ct === 'UrlWildcardCondition') ? 'url' : (ct === 'UrlRegexCondition') ? 'regex' : 'domain';
                var action = (r.profileName === 'direct') ? 'direct' : nameToId[r.profileName];
                if (!action) return;
                s.autoSwitch.rules.push({ id: UI.uid('r'), type: type, pattern: r.condition.pattern || '', action: action, enabled: true });
              });
            }
            if (parsed.full && parsed.settings) {
              s.autoSwitch = parsed.state.autoSwitch || s.autoSwitch;
            }
          }, { rerender: false });
          App.rerender();
        }
        UI.toast(T('bk.imported'), 'ok');
      });
    }

    function renderSnapshots(listEl) {
      listEl.innerHTML = '';
      Store.listSnapshots().then(function (snaps) {
        if (!snaps.length) {
          listEl.appendChild(UI.el('div', { class: 'muted', style: { textAlign: 'center', padding: '14px', fontSize: '0.8rem' }, text: T('bk.noSnap') }));
          return;
        }
        snaps.forEach(function (sn) {
          var sizeKb = Math.max(1, Math.round((sn.json || '').length / 1024));
          listEl.appendChild(UI.el('div', { class: 'snap-row' }, [
            UI.el('span', { html: UI.icon('history', 16), style: { color: 'var(--a1)', display: 'inline-flex' } }),
            UI.el('div', { style: { flex: 1 } }, [
              UI.el('div', { class: 'sn-label', text: sn.label || T('bk.autoSnap') }),
              UI.el('div', { class: 'sn-meta', text: i18n.fmtDate(sn.at) + ' · ' + i18n.fmtNum(sizeKb) + ' KB' }),
            ]),
            UI.el('button', { class: 'btn btn-sm', text: T('bk.restore'), onclick: function () {
              UI.confirmModal({ title: T('bk.restore'), message: T('bk.restoreConfirm'), okLabel: T('bk.restore') }).then(function (yes) {
                if (!yes) return;
                Store.restoreSnapshot(sn.id).then(function (newSt) {
                  if (newSt) { App.setState(newSt); UI.toast(T('bk.restored'), 'ok'); }
                });
              });
            } }),
            UI.el('button', { class: 'btn-icon', title: T('bk.dlSnap'), html: UI.icon('download', 14), onclick: function () {
              UI.download('ProxyFaMega-snapshot-' + sn.id + '.json', sn.json);
            } }),
            UI.el('button', { class: 'btn-icon danger', title: T('profiles.delete'), html: UI.icon('trash', 14), onclick: function () {
              Store.deleteSnapshot(sn.id).then(function () { renderSnapshots(listEl); });
            } }),
          ]));
        });
      });
    }
  },
};

/* ================= crypto helpers (AES-GCM + PBKDF2) ================= */
function b64encode(buf) {
  var bytes = new Uint8Array(buf);
  var bin = '';
  for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
function b64decode(str) {
  var bin = atob(str);
  var bytes = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function deriveKey(password, salt) {
  var enc = new TextEncoder();
  return crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']).then(function (km) {
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: salt, iterations: 120000, hash: 'SHA-256' },
      km, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
    );
  });
}

function encryptBackup(obj, password) {
  var salt = crypto.getRandomValues(new Uint8Array(16));
  var iv = crypto.getRandomValues(new Uint8Array(12));
  var enc = new TextEncoder();
  return deriveKey(password, salt).then(function (key) {
    return crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, enc.encode(JSON.stringify(obj)));
  }).then(function (data) {
    return {
      app: PFM.NAME, format: 'pfm-encrypted', version: 1,
      kdf: 'PBKDF2-SHA256-120k', salt: b64encode(salt), iv: b64encode(iv), data: b64encode(data),
    };
  });
}

function decryptBackup(json, password) {
  var salt = b64decode(json.salt);
  var iv = b64decode(json.iv);
  var data = b64decode(json.data);
  return deriveKey(password, salt).then(function (key) {
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, data);
  }).then(function (plain) {
    return JSON.parse(new TextDecoder().decode(plain));
  });
}
