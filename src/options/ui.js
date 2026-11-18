/* ProxyFaMega — options UI helpers (icons, modal, toast, misc) */
'use strict';

var UI = (function () {

  /* ---------------- tiny DOM builder ---------------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (k === 'class') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else if (k.slice(0, 2) === 'on') node.addEventListener(k.slice(2), v);
        else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
        else if (k === 'checked' || k === 'disabled' || k === 'selected') { if (v) node[k] = true; }
        else if (k === 'hidden') node.hidden = !!v;
        else if (typeof v === 'boolean') { if (v) node.setAttribute(k, ''); }
        else node.setAttribute(k, v);
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------------- icon set (stroke style, 24px grid) ---------------- */
  var ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/>',
    layers: '<path d="m12 2 9 4.7-9 4.7-9-4.7L12 2z"/><path d="m3 11.8 9 4.7 9-4.7"/><path d="m3 16.8 9 4.7 9-4.7"/>',
    shuffle: '<path d="M3 7h4l4 5 4-5h4M3 17h4l2.5-3.1M14.5 13.4 17 17h4"/><path d="M18 4l3 3-3 3M18 14l3 3-3 3"/>',
    gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8 13.5 5a7.2 7.2 0 0 1 2.6 1.1l2.6-.6 1.4 2.5-1.8 2a7.2 7.2 0 0 1 0 3l1.8 2-1.4 2.5-2.6-.6a7.2 7.2 0 0 1-2.6 1.1L12 21.2 10.5 19a7.2 7.2 0 0 1-2.6-1.1l-2.6.6-1.4-2.5 1.8-2a7.2 7.2 0 0 1 0-3l-1.8-2 1.4-2.5 2.6.6A7.2 7.2 0 0 1 10.5 5z"/>',
    database: '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5V12c0 1.7 3.6 3 8 3s8-1.3 8-3V5.5"/><path d="M4 12v6.5c0 1.7 3.6 3 8 3s8-1.3 8-3V12"/>',
    info: '<circle cx="12" cy="12" r="9.2"/><path d="M12 10.8V17"/><path d="M12 7.4v.4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M4 20h4.5L20 8.5a2.1 2.1 0 0 0-3-3L5.5 17 4 20z"/><path d="M14.5 7.5l3 3"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6.5 7l1 13h9l1-13"/><path d="M10 11v6M14 11v6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    download: '<path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 20h16"/>',
    upload: '<path d="M12 15V3"/><path d="m7 7 5-4 5 4"/><path d="M4 20h16"/>',
    clock: '<circle cx="12" cy="12" r="9.2"/><path d="M12 6.5V12l3.5 2.5"/>',
    zap: '<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z"/>',
    sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5 5l1.8 1.8M17.2 17.2 19 19M19 5l-1.8 1.8M6.8 17.2 5 19"/>',
    moon: '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/>',
    monitor: '<rect x="3" y="4" width="18" height="13" rx="2.5"/><path d="M8 21h8M12 17.5V21"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    chevronUp: '<path d="m6 14 6-6 6 6"/>',
    chevronDown: '<path d="m6 10 6 6 6-6"/>',
    refresh: '<path d="M20 5v5h-5"/><path d="M4 19v-5h5"/><path d="M19.5 10A8 8 0 0 0 6 6.5L4 8.5M4.5 14a8 8 0 0 0 13.5 3.5l2-2"/>',
    shield: '<path d="M12 2.5 20 6v5.5c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6z"/>',
    alert: '<path d="M12 3 2.5 20h19z"/><path d="M12 9.5v5M12 17.6v.4"/>',
    keyboard: '<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><path d="M6.5 10h.4M10.2 10h.4M13.9 10h.4M17.6 10h.4M7.5 14h9"/>',
    cloud: '<path d="M17.5 18a4.5 4.5 0 0 0 .4-9A6 6 0 0 0 6.3 10.5 4 4 0 0 0 7 18z"/>',
    link: '<path d="M10 14a4.2 4.2 0 0 0 6 0l3.5-3.5a4.24 4.24 0 0 0-6-6L11.8 6.2"/><path d="M14 10a4.2 4.2 0 0 0-6 0L4.5 13.5a4.24 4.24 0 0 0 6 6L12.2 17.8"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    history: '<path d="M4 12a8 8 0 1 1 2.3 5.7"/><path d="M4 20v-5h5"/><path d="M12 8v4.3l3 1.8"/>',
    globe: '<circle cx="12" cy="12" r="9.2"/><path d="M2.8 12h18.4M12 2.8c2.7 2.5 4 5.9 4 9.2s-1.3 6.7-4 9.2c-2.7-2.5-4-5.9-4-9.2s1.3-6.7 4-9.2z"/>',
    play: '<path d="M7 4.5 19 12 7 19.5z"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2.5"/>',
    key: '<circle cx="7.5" cy="15.5" r="4"/><path d="m10.5 12.5 8-8M15 4.5l3 3M12.5 7l3 3"/>',
    file: '<path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z"/><path d="M13 3v6h6"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M18.5 15.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/>',
    arrowUp: '<path d="M12 19V5"/><path d="m6 11 6-6 6 6"/>',
    arrowDown: '<path d="M12 5v14"/><path d="m6 13 6 6 6-6"/>',
  };

  function icon(name, size) {
    var s = size || 18;
    var body = ICONS[name] || ICONS.info;
    var stroke = ['zap', 'play', 'stop'].indexOf(name) !== -1 ? ' fill="currentColor" stroke="none"' :
      ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"' + stroke + '>' + body + '</svg>';
  }

  /* ---------------- toast ---------------- */
  function toast(msg, kind) {
    var root = document.getElementById('toastRoot');
    var t = el('div', { class: 'toast ' + (kind || ''), html: icon(kind === 'err' ? 'alert' : (kind === 'ok' ? 'check' : 'sparkle'), 15) + '<span></span>' });
    t.lastChild.textContent = msg;
    root.appendChild(t);
    setTimeout(function () {
      t.classList.add('hide');
      setTimeout(function () { t.remove(); }, 350);
    }, 2600);
  }

  /* ---------------- modal ---------------- */
  function openModal(titleText, bodyNode, opts) {
    opts = opts || {};
    var root = document.getElementById('modalRoot');
    var overlay = el('div', { class: 'modal-overlay' });
    var box = el('div', { class: 'modal', style: opts.width ? { maxWidth: opts.width } : null });
    var head = el('div', { class: 'modal-head' }, [
      el('div', { class: 'modal-title', html: (opts.icon ? icon(opts.icon, 19) : '') + '<span></span>' }),
      el('button', { class: 'btn-icon', html: icon('x', 15), onclick: close }),
    ]);
    head.querySelector('span').textContent = titleText;
    var body = el('div', { class: 'modal-body' }, [bodyNode]);
    box.appendChild(head);
    box.appendChild(body);
    overlay.appendChild(box);
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close(); });
    root.appendChild(overlay);

    var closed = false;
    function close() {
      if (closed) return;
      closed = true;
      overlay.remove();
      if (opts.onClose) opts.onClose();
    }
    return { close: close, box: box };
  }

  function confirmModal(opts) {
    return new Promise(function (resolve) {
      var body = el('div', { class: 'col', style: { gap: '16px' } }, [
        el('div', { class: 'muted', text: opts.message || '' }),
        opts.confirmInput ? el('div', {}, [
          el('input', { class: 'input', placeholder: opts.confirmInput, on: { input: function (e) {
            var btn = body.querySelector('.btn-danger');
            if (btn) btn.disabled = e.target.value.trim() !== opts.confirmInput;
          } } }),
        ]) : null,
        el('div', { class: 'row', style: { justifyContent: 'flex-end' } }, [
          el('button', { class: 'btn btn-ghost', text: opts.cancelLabel || i18n.t('common.cancel'), onclick: function () { m.close(); resolve(false); } }),
          el('button', { class: 'btn ' + (opts.danger ? 'btn-danger' : 'btn-primary'), text: opts.okLabel || i18n.t('common.ok'), disabled: !!opts.confirmInput, onclick: function () { m.close(); resolve(true); } }),
        ]),
      ]);
      var m = openModal(opts.title || i18n.t('common.confirm'), body, { icon: opts.danger ? 'alert' : 'info', width: '420px' });
      m.onClose = null;
    });
  }

  /* ---------------- messaging ---------------- */
  function sendMsg(msg) {
    return new Promise(function (resolve) {
      try {
        chrome.runtime.sendMessage(msg, function (res) {
          if (chrome.runtime.lastError) return resolve({ ok: false });
          resolve(res || { ok: false });
        });
      } catch (e) { resolve({ ok: false }); }
    });
  }

  function debounce(fn, ms) {
    var t = null;
    return function () {
      var args = arguments;
      var self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms);
    };
  }

  function download(filename, text, mime) {
    var blob = new Blob([text], { type: mime || 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 400);
  }

  function uid(prefix) {
    return (prefix || 'x') + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    var ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    return Promise.resolve();
  }

  return {
    el: el, escapeHtml: escapeHtml, icon: icon, toast: toast,
    openModal: openModal, confirmModal: confirmModal,
    sendMsg: sendMsg, debounce: debounce, download: download, uid: uid, copyText: copyText,
  };
})();
