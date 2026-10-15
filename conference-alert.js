/* =========================================================
   پنجرهٔ چشمک‌زن دعوت به کنفرانس
   - وقتی کاربر واردشده به یک کنفرانس «باز» دعوت شده باشد، یا اعلان همگانی (notifyAll) فعال باشد نمایش داده می‌شود.
   - با ظاهر شدن کنفرانس جدید، صدای بوق پخش می‌شود (و تا ۳ بار هر ۱۲ ثانیه تکرار، مگر کاربر «بعداً» بزند).
   - اگر کنفرانسی نباشد هیچ چیزی در صفحه اضافه نمی‌شود.
   استفاده: <script src="conference-alert.js" defer></script>
========================================================= */
(function () {
  if (window.__confAlertLoaded) return;
  window.__confAlertLoaded = true;

  var KEY = "taj_medical_proxy_auth_v1";
  var base = (document.currentScript && document.currentScript.src) || location.href;
  var ROOM_PAGE = new URL("conference.html", base).href;
  var POLL_MS = 8000;
  var MIN_KEY = "conf_alert_min";

  var rooms = [];
  var host = null;
  var busy = false;
  var audioCtx = null;
  var repeatLeft = 0;
  var unlockArmed = false;

  function tone(ctx, t0, freq, dur) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine"; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.3, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(t0); o.stop(t0 + dur + 0.03);
  }

  /* مرورگرها تا قبل از اولین کلیک/لمس کاربر اجازهٔ پخش صدا نمی‌دهند؛ در آن حالت با اولین تعامل پخش می‌شود */
  function armUnlock() {
    if (unlockArmed) return;
    unlockArmed = true;
    var go = function () {
      unlockArmed = false;
      ["pointerdown", "keydown", "touchstart"].forEach(function (ev) { document.removeEventListener(ev, go, true); });
      if (hasVisibleAlert()) playBeep();
    };
    ["pointerdown", "keydown", "touchstart"].forEach(function (ev) { document.addEventListener(ev, go, true); });
  }

  function hasVisibleAlert() {
    var min = minimized();
    return rooms.some(function (r) { return !min[r.id]; });
  }

  function playBeep() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtx.resume().then(function () {
        if (audioCtx.state !== "running") { armUnlock(); return; }
        var t = audioCtx.currentTime;
        tone(audioCtx, t, 880, 0.18);
        tone(audioCtx, t + 0.26, 1175, 0.18);
        tone(audioCtx, t + 0.52, 880, 0.18);
        tone(audioCtx, t + 0.78, 1175, 0.28);
      }).catch(armUnlock);
    } catch (e) {}
  }

  function repeatBeep() {
    if (repeatLeft > 0 && !document.hidden && hasVisibleAlert()) { repeatLeft--; playBeep(); }
  }

  function readSession() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
  }

  function minimized() {
    try { return JSON.parse(sessionStorage.getItem(MIN_KEY) || "{}"); } catch (e) { return {}; }
  }

  function setMinimized(id, v) {
    var m = minimized();
    if (v) m[id] = 1; else delete m[id];
    try { sessionStorage.setItem(MIN_KEY, JSON.stringify(m)); } catch (e) {}
  }

  function refresh(session) {
    return fetch(new URL("/api/auth/refresh", location.origin).href, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: session.refreshToken })
    }).then(function (r) { return r.ok ? r.json() : null; }).then(function (n) {
      if (!n || !n.idToken) return null;
      session.idToken = n.idToken;
      session.refreshToken = n.refreshToken || session.refreshToken;
      try { localStorage.setItem(KEY, JSON.stringify(session)); } catch (e) {}
      return session;
    }).catch(function () { return null; });
  }

  function fetchActive(session, retry) {
    return fetch(new URL("/api/conference/active", location.origin).href, {
      headers: { Authorization: "Bearer " + session.idToken }
    }).then(function (r) {
      if (r.status === 401 && retry && session.refreshToken) {
        return refresh(session).then(function (s) { return s ? fetchActive(s, false) : []; });
      }
      if (!r.ok) return [];
      return r.json().then(function (j) { return j.rooms || []; });
    });
  }

  function tick() {
    if (busy || document.hidden) return;
    var session = readSession();
    if (!session || !session.idToken) { if (rooms.length) { rooms = []; render(); } return; }

    busy = true;
    fetchActive(session, true).then(function (list) {
      var changed = JSON.stringify(list.map(function (r) { return r.id; })) !==
                    JSON.stringify(rooms.map(function (r) { return r.id; }));
      var known = rooms.map(function (r) { return r.id; });
      var min = minimized();
      var fresh = list.some(function (r) { return known.indexOf(r.id) < 0 && !min[r.id]; });
      rooms = list;
      if (fresh) { repeatLeft = 3; playBeep(); }
      if (changed || (!list.length && host)) render();
    }).catch(function () {}).then(function () { busy = false; });
  }

  function injectStyle() {
    if (document.getElementById("confAlertStyle")) return;
    var st = document.createElement("style");
    st.id = "confAlertStyle";
    st.textContent =
      "@keyframes confGlow{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.75),0 10px 30px rgba(0,0,0,.35);border-color:#22c55e}50%{box-shadow:0 0 0 16px rgba(34,197,94,0),0 10px 30px rgba(0,0,0,.35);border-color:#bbf7d0}}" +
      "@keyframes confDot{50%{opacity:.25}}" +
      "#confAlertHost{position:fixed;left:16px;bottom:16px;z-index:2147483000;display:flex;flex-direction:column;gap:10px;font-family:Vazirmatn,Tahoma,system-ui,sans-serif;direction:rtl;max-width:calc(100vw - 32px)}" +
      ".ca-card{width:320px;max-width:100%;background:#0f1f2e;color:#e2e8f0;border:2px solid #22c55e;border-radius:16px;padding:14px 16px;animation:confGlow 1.4s ease-in-out infinite}" +
      ".ca-top{display:flex;align-items:center;gap:8px;font-weight:700;font-size:.95rem}" +
      ".ca-dot{width:10px;height:10px;border-radius:50%;background:#22c55e;animation:confDot 1s linear infinite;flex:none}" +
      ".ca-title{margin:8px 0 2px;font-size:1rem;font-weight:700;word-break:break-word}" +
      ".ca-sub{font-size:.8rem;color:#94a3b8;margin-bottom:12px}" +
      ".ca-act{display:flex;gap:8px}" +
      ".ca-btn{flex:1;text-align:center;text-decoration:none;border:0;border-radius:10px;padding:9px 12px;font:inherit;font-size:.88rem;font-weight:700;cursor:pointer}" +
      ".ca-join{background:linear-gradient(135deg,#0284c7,#14b8a6);color:#fff}" +
      ".ca-later{background:rgba(255,255,255,.08);color:#e2e8f0;flex:0 0 auto}" +
      ".ca-pill{align-self:flex-start;display:flex;align-items:center;gap:8px;background:#0f1f2e;color:#e2e8f0;border:2px solid #22c55e;border-radius:99px;padding:8px 16px;font:inherit;font-size:.88rem;font-weight:700;cursor:pointer;animation:confGlow 1.4s ease-in-out infinite}";
    document.head.appendChild(st);
  }

  function esc(t) { var d = document.createElement("div"); d.textContent = String(t == null ? "" : t); return d.innerHTML; }

  function render() {
    if (!rooms.length) {
      if (host) { host.remove(); host = null; }
      return;
    }

    injectStyle();
    if (!host) {
      host = document.createElement("div");
      host.id = "confAlertHost";
      host.setAttribute("role", "alert");
      document.body.appendChild(host);
    }

    var min = minimized();
    host.innerHTML = rooms.map(function (r) {
      if (min[r.id]) {
        return '<button class="ca-pill" data-open="' + esc(r.id) + '">📹 کنفرانس باز است: ' + esc(r.title) + "</button>";
      }
      return '<div class="ca-card">' +
        '<div class="ca-top"><i class="ca-dot"></i>دعوت به کنفرانس زنده</div>' +
        '<div class="ca-title">' + esc(r.title) + "</div>" +
        '<div class="ca-sub">' + (r.hostName ? "برگزارکننده: " + esc(r.hostName) : "کنفرانس در حال برگزاری است") + "</div>" +
        '<div class="ca-act"><a class="ca-btn ca-join" href="' + ROOM_PAGE + "?room=" + encodeURIComponent(r.id) + '">ورود به اتاق کنفرانس</a>' +
        '<button class="ca-btn ca-later" data-min="' + esc(r.id) + '">بعداً</button></div></div>';
    }).join("");

    host.querySelectorAll("[data-min]").forEach(function (b) {
      b.onclick = function () { setMinimized(b.dataset.min, true); repeatLeft = 0; render(); };
    });
    host.querySelectorAll("[data-open]").forEach(function (b) {
      b.onclick = function () { setMinimized(b.dataset.open, false); render(); };
    });
  }

  document.addEventListener("visibilitychange", function () { if (!document.hidden) tick(); });
  setTimeout(tick, 1200);
  setInterval(tick, POLL_MS);
  setInterval(repeatBeep, 12000);
})();
