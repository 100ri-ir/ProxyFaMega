/* ProxyFaMega — popup logic */
'use strict';

(function () {
  var S = null;
  var $ = function (id) { return document.getElementById(id); };

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

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function iconSvg(name, size) {
    var paths = {
      gear: '<path d="M12 15.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5zm7.4-2.6a7 7 0 0 0 0-1.8l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.6-.9L15 3.5h-4l-.4 2.6a7 7 0 0 0-1.6.9l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 1.8l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.6.9l.4 2.7h4l.4-2.7a7 7 0 0 0 1.6-.9l2.4 1 2-3.4z"/>',
      zap: '<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z"/>',
      check: '<path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
      ban: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M5.6 5.6l12.8 12.8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
      pc: '<rect x="3" y="4" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M8 21h8M12 17.5V21" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
      shuffle: '<path d="M3 7h4l4 5 4-5h4M3 17h4l2.5-3.1M14.5 13.4 17 17h4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 4l3 3-3 3M18 14l3 3-3 3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    };
    return '<svg width="' + (size || 16) + '" height="' + (size || 16) + '" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' + (paths[name] || '') + '</svg>';
  }

  function renderHero() {
    var info = effectiveInfo(S, function (fa, en) { return i18n.tLang(fa, en); });
    var el = $('heroCard');
    el.innerHTML =
      '<div class="hero-icon">' + info.icon + '</div>' +
      '<div class="hero-body">' +
        '<div class="hero-label">' + i18n.t('popup.current') + '</div>' +
        '<div class="hero-name">' + escapeHtml(info.label) + '</div>' +
        '<div class="hero-sub">' + escapeHtml(info.sub || '') + '</div>' +
      '</div>' +
      '<div class="hero-lat" id="heroLat"></div>';
  }

  function renderModes() {
    var modes = [
      { id: 'direct', icon: 'ban', key: 'mode.direct' },
      { id: 'system', icon: 'pc', key: 'mode.system' },
      { id: 'auto', icon: 'shuffle', key: 'mode.auto' },
    ];
    var seg = $('modeSeg');
    seg.innerHTML = '';
    modes.forEach(function (m) {
      var b = document.createElement('button');
      b.className = (S.applied && S.mode === m.id) ? 'on' : '';
      b.innerHTML = iconSvg(m.icon, 14) + '<span>' + i18n.t(m.key) + '</span>';
      b.onclick = function () { switchTo(m.id); };
      seg.appendChild(b);
    });
  }

  function renderList(filter) {
    var list = $('plist');
    var items = S.profiles;
    if (filter) {
      var f = filter.toLowerCase();
      items = items.filter(function (p) {
        return p.name.toLowerCase().indexOf(f) !== -1 || (p.host + ':' + p.port).indexOf(f) !== -1;
      });
    }
    list.innerHTML = '';
    if (!items.length) {
      list.innerHTML = '<div class="empty-note">' + i18n.t('popup.noProfiles') + '</div>';
      return;
    }
    items.forEach(function (p, i) {
      var on = S.applied && S.mode === 'profile' && S.currentProfileId === p.id;
      var d = document.createElement('div');
      d.className = 'pitem' + (on ? ' on' : '');
      d.style.animationDelay = Math.min(i * 35, 280) + 'ms';
      d.innerHTML =
        '<span class="avatar" style="background:' + gradCss(p.color) + '">' + (p.icon || '🌐') + '</span>' +
        '<div class="p-info">' +
          '<div class="p-name">' + escapeHtml(p.name) + ' <span class="chip">' + escapeHtml(protoById(p.protocol).id.toUpperCase()) + '</span></div>' +
          '<div class="p-addr">' + escapeHtml(p.host) + ':' + p.port + '</div>' +
        '</div>' +
        (on ? '<span class="p-check">' + iconSvg('check', 14) + '</span>' : '');
      d.onclick = function () { switchTo('profile', p.id); };
      list.appendChild(d);
    });
  }

  function renderAll() {
    document.documentElement.dir = i18n.lang() === 'fa' ? 'rtl' : 'ltr';
    renderHero();
    renderModes();
    renderList($('searchInput') ? $('searchInput').value : '');
    $('searchWrap').hidden = S.profiles.length <= 6;
    $('btnOptions').innerHTML = iconSvg('gear', 17);
    $('btnOptions').title = i18n.t('popup.settings');
    $('btnTest').innerHTML = iconSvg('zap', 14) + ' ' + i18n.t('popup.test');
    $('popVer').textContent = 'v' + PFM.VERSION;
    $('searchInput').placeholder = i18n.t('popup.search');
  }

  function switchTo(mode, profileId) {
    sendMsg({ type: 'switch', mode: mode, profileId: profileId }).then(function (res) {
      if (res && res.ok && res.state) {
        S = res.state;
        renderAll();
      }
    });
  }

  /* ---------- latency test ---------- */
  function runTest() {
    var btn = $('btnTest');
    var out = $('testResult');
    var lat = $('heroLat');
    btn.disabled = true;
    out.className = 'mono';
    out.innerHTML = '<span class="spinner"></span>';
    sendMsg({ type: 'test-latency' }).then(function (res) {
      btn.disabled = false;
      if (res && res.ok) {
        var cls = res.ms < 300 ? 'ok' : (res.ms < 900 ? 'mid' : 'bad');
        out.className = 'mono ' + cls;
        out.textContent = res.ms + ' ms';
        if (lat) { lat.textContent = res.ms + ' ms'; lat.classList.add('show'); }
      } else {
        out.className = 'mono bad';
        out.textContent = i18n.t('popup.testFail');
      }
    });
  }

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    Store.load().then(function (st) {
      S = st;
      i18n.setLang(S.settings.lang);
      applyUiTheme(S);
      renderAll();
    });

    $('btnOptions').onclick = function () {
      try { chrome.runtime.openOptionsPage(); } catch (e) {
        window.open(chrome.runtime.getURL('options/options.html'));
      }
    };
    $('btnTest').onclick = runTest;
    $('searchInput').addEventListener('input', function (e) {
      renderList(e.target.value);
    });

    /* live update while popup is open */
    try {
      chrome.runtime.onMessage.addListener(function (msg) {
        if (msg && msg.type === 'state-changed' && msg.state) {
          S = msg.state;
          renderAll();
        }
      });
    } catch (e) { /* ignore */ }

    Store.onChanged(function (newValue) {
      if (newValue) {
        S = newValue;
        i18n.setLang(S.settings.lang);
        applyUiTheme(S);
        renderAll();
      }
    });
  });
})();
