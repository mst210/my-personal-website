/* =========================================================
   پنل ادمین - استایل مشترک
   تم روشن (پیش‌فرض) + تم تیره خودکار بر اساس تنظیم دستگاه
   نام متغیرهای قدیمی حفظ شده تا صفحه‌های موجود بدون تغییر کار کنند.
========================================================= */

:root {
    --ink: #0f2a2e;
    --paper: #edf2f1;
    --surface: #ffffff;
    --surface-2: #f6f9f8;
    --line: #d8e2e0;
    --muted: #5a726f;
    --teal: #0b7f77;
    --teal-soft: #dcf1ee;
    --sidebar: #0d2b2e;
    --sidebar-ink: #cfe3e0;

    /* سازگار با صفحه‌های قبلی */
    --primary-blue: #0a6f78;
    --accent-teal: #12a594;
    --dark-bg: var(--paper);
    --card-bg: var(--surface);
    --card-bg-strong: var(--surface-2);
    --border-color: var(--line);
    --text-main: var(--ink);
    --text-muted: var(--muted);
    --danger: #c8433a;
    --success: #2f855a;
    --warn: #b7791f;

    --danger-soft: #fbe7e5;
    --success-soft: #e0f3e8;
    --warn-soft: #fbefd5;
    --hover: rgba(15, 42, 46, .05);
    --field-bg: #ffffff;
    --shadow: 0 1px 2px rgba(15, 42, 46, .05), 0 6px 18px -10px rgba(15, 42, 46, .18);
    --modal-bg: #ffffff;
}

@media (prefers-color-scheme: dark) {
    :root {
        --ink: #e6f0ee;
        --paper: #0a1a1d;
        --surface: #10282c;
        --surface-2: #143036;
        --line: #234449;
        --muted: #8fb0ac;
        --teal: #2fc4b2;
        --teal-soft: #12403f;
        --sidebar: #071417;
        --sidebar-ink: #a9c6c2;

        --primary-blue: #1b9aa6;
        --accent-teal: #2fc4b2;
        --danger: #ef8077;
        --success: #6fcf97;
        --warn: #e5b04e;

        --danger-soft: #3d1f1e;
        --success-soft: #173a29;
        --warn-soft: #3a2f14;
        --hover: rgba(255, 255, 255, .06);
        --field-bg: #0d2226;
        --shadow: 0 1px 2px rgba(0, 0, 0, .3);
        --modal-bg: #10282c;
    }
}

* { box-sizing: border-box; }

body {
    margin: 0;
    min-height: 100vh;
    font-family: "Vazirmatn", Tahoma, sans-serif;
    font-size: 14px;
    line-height: 1.75;
    color: var(--ink);
    background: var(--paper);
}

button, input, select, textarea { font-family: inherit; color: inherit; }
a { text-decoration: none; color: inherit; }
input[type="checkbox"], input[type="radio"] { accent-color: var(--teal); }
:focus-visible { outline: 3px solid var(--accent-teal); outline-offset: 2px; }

/* ---------- چیدمان: ستون کناری + محتوا ---------- */

.page-container {
    width: min(1360px, 100%);
    margin: 0 auto;
    padding: 24px 24px 64px;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    column-gap: 28px;
    align-items: start;
}

.page-container > * { grid-column: 1; min-width: 0; }

.page-container:has(.nav-bar:not([hidden])) { grid-template-columns: 252px minmax(0, 1fr); }

.page-container:has(.nav-bar:not([hidden])) > .nav-bar {
    grid-column: 1;
    grid-row: 1 / span 40;
}

.page-container:has(.nav-bar:not([hidden])) > *:not(.nav-bar) { grid-column: 2; }

/* دکمه خروج و عنوان */
.top-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    margin: 4px 0 24px;
    padding: 0 0 18px;
    border-bottom: 1px solid var(--line);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='24' viewBox='0 0 260 24'%3E%3Cpath d='M0 23h64l7-14 9 15 7-10 5 9h168' fill='none' stroke='%2312a594' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-origin: border-box;
    background-position: left bottom;
}

.header-title h1 { margin: 0 0 4px; font-size: 26px; font-weight: 800; letter-spacing: -.2px; }
.header-title p { margin: 0; color: var(--muted); font-size: 13.5px; }
.header-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

/* ---------- ستون کناری ---------- */

.nav-bar {
    position: sticky;
    top: 24px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 18px 12px 14px;
    background: var(--sidebar);
    color: var(--sidebar-ink);
    border-radius: 22px;
    max-height: calc(100vh - 48px);
    overflow-y: auto;
}

.nav-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 8px 18px;
    margin-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, .09);
}

.nav-mark {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 13px;
    background: #12403f;
    color: #5fe0cf;
}

.nav-mark svg { width: 24px; height: 24px; }
.nav-brand b { display: block; color: #fff; font-size: 14.5px; font-weight: 700; line-height: 1.4; }
.nav-brand small { color: #7fa5a0; font-size: 12px; }

.nav-link {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 14px;
    border-radius: 12px;
    color: var(--sidebar-ink);
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    transition: background .15s, color .15s;
}

.nav-link i { width: 18px; text-align: center; font-size: 14.5px; opacity: .85; }
.nav-link:hover { background: rgba(255, 255, 255, .07); color: #fff; }

.nav-link.active {
    background: rgba(95, 224, 207, .13);
    color: #fff;
    font-weight: 700;
}

.nav-link.active::before {
    content: "";
    position: absolute;
    inset-block: 10px;
    inset-inline-start: 0;
    width: 3px;
    border-radius: 3px;
    background: #5fe0cf;
}

.nav-link.active i { color: #5fe0cf; opacity: 1; }

.nav-sep { flex: 1; min-height: 14px; }
.nav-out { font-size: 12.5px; color: #7fa5a0; border-top: 1px solid rgba(255, 255, 255, .09); border-radius: 0 0 12px 12px; margin-top: 6px; padding-top: 14px; }

@media (max-width: 960px) {
    .page-container { padding: 14px 14px 48px; }
    .page-container:has(.nav-bar:not([hidden])) { grid-template-columns: minmax(0, 1fr); }
    .page-container:has(.nav-bar:not([hidden])) > .nav-bar { grid-column: 1; grid-row: auto; }
    .page-container:has(.nav-bar:not([hidden])) > *:not(.nav-bar) { grid-column: 1; }
    .nav-bar { position: static; flex-direction: row; overflow-x: auto; max-height: none; border-radius: 16px; padding: 8px; gap: 6px; margin-bottom: 18px; }
    .nav-brand, .nav-sep { display: none; }
    .nav-link { white-space: nowrap; padding: 9px 13px; }
    .nav-link.active::before { display: none; }
    .nav-out { border-top: 0; margin: 0; padding: 9px 13px; }
    .top-header { background-image: none; }
    .header-title h1 { font-size: 22px; }
}

/* ---------- دکمه‌ها ---------- */

.icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--ink);
    padding: 9px 16px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: background .15s, border-color .15s, transform .1s;
}

.icon-btn:hover { background: var(--surface-2); border-color: var(--teal); }
.icon-btn:active { transform: translateY(1px); }

.btn-primary {
    background: var(--teal);
    border-color: var(--teal);
    color: #fff;
    font-weight: 700;
}

.btn-primary:hover { background: var(--teal); border-color: var(--teal); filter: brightness(1.1); }

@media (prefers-color-scheme: dark) { .btn-primary { color: #05211f; } }

.btn-danger { border-color: color-mix(in srgb, var(--danger) 45%, transparent); color: var(--danger); }
.btn-danger:hover { background: var(--danger-soft); border-color: var(--danger); }

.btn-warn { border-color: color-mix(in srgb, var(--warn) 45%, transparent); color: var(--warn); }
.btn-warn:hover { background: var(--warn-soft); border-color: var(--warn); }

.icon-btn:disabled { opacity: .45; cursor: not-allowed; }

/* ---------- وضعیت‌ها ---------- */

.status-box { text-align: center; padding: 56px 20px; color: var(--muted); }
.status-box i { font-size: 30px; margin-bottom: 12px; display: block; color: var(--teal); }
.status-box.error i { color: var(--danger); }

/* ---------- فرم‌ها ---------- */

.login-card {
    max-width: 400px;
    margin: 48px auto;
    padding: 30px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 20px;
    box-shadow: var(--shadow);
}

.login-card h2 { margin: 0 0 22px; font-size: 19px; text-align: center; }

.field { margin-bottom: 14px; }
.field label { display: block; font-size: 13px; font-weight: 500; color: var(--muted); margin-bottom: 6px; }

.field input, .field textarea, .field select,
input.field, select.field, textarea.field, .search-input {
    width: 100%;
    padding: 10px 13px;
    border-radius: 10px;
    border: 1px solid var(--line);
    background: var(--field-bg);
    color: var(--ink);
    font-size: 14px;
    outline: none;
    transition: border-color .15s, box-shadow .15s;
}

.field input:focus, .field textarea:focus, .field select:focus,
input.field:focus, select.field:focus, textarea.field:focus, .search-input:focus {
    border-color: var(--teal);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--teal) 18%, transparent);
}

.field textarea { resize: vertical; min-height: 90px; line-height: 1.9; }
.field .hint, .hint { font-size: 12px; color: var(--muted); margin-top: 5px; }

.form-error {
    background: var(--danger-soft);
    border: 1px solid color-mix(in srgb, var(--danger) 40%, transparent);
    color: var(--danger);
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 13px;
    margin-bottom: 14px;
    display: none;
}

.form-error.show { display: block; }

/* ---------- تب‌ها و نوار ابزار ---------- */

.tabs { display: flex; gap: 6px; margin-bottom: 18px; flex-wrap: wrap; padding: 5px; background: var(--surface); border: 1px solid var(--line); border-radius: 14px; width: fit-content; max-width: 100%; }

.tab-btn {
    padding: 8px 16px;
    border-radius: 10px;
    border: 0;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    font-size: 13.5px;
    font-weight: 600;
}

.tab-btn:hover { color: var(--ink); background: var(--hover); }
.tab-btn.active { background: var(--teal); color: #fff; }
@media (prefers-color-scheme: dark) { .tab-btn.active { color: #05211f; } }

.toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.search-input { max-width: 300px; }

/* ---------- کارت‌های آمار ---------- */

.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin-bottom: 24px; }

.stat-card {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 16px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    box-shadow: var(--shadow);
}

.stat-card .icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    font-size: 17px;
    flex-shrink: 0;
    background: var(--teal-soft);
    color: var(--teal);
}

.stat-card .num { font-size: 24px; font-weight: 800; line-height: 1.2; }
.stat-card .label { font-size: 12.5px; color: var(--muted); }

/* ---------- کارت بخش ---------- */

.section-card {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 20px 22px;
    box-shadow: var(--shadow);
    margin-bottom: 20px;
}

.section-card h2 { margin: 0 0 16px; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
.section-card h2 i { color: var(--teal); font-size: 14px; background: var(--teal-soft); width: 28px; height: 28px; display: grid; place-items: center; border-radius: 8px; }

/* ---------- جدول ---------- */

.table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 12px; }
table.data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }

table.data-table th {
    text-align: right;
    color: var(--muted);
    font-weight: 600;
    padding: 11px 14px;
    background: var(--surface-2);
    border-bottom: 1px solid var(--line);
    white-space: nowrap;
    font-size: 12.5px;
}

table.data-table td { padding: 12px 14px; border-bottom: 1px solid var(--line); vertical-align: middle; }
table.data-table tr:last-child td { border-bottom: none; }
table.data-table tbody tr:hover td { background: var(--hover); }

/* ---------- نشان‌ها ---------- */

.badge {
    font-size: 11.5px;
    font-weight: 600;
    padding: 3px 11px;
    border-radius: 999px;
    border: 1px solid var(--line);
    color: var(--muted);
    background: var(--surface-2);
    white-space: nowrap;
    display: inline-block;
}

.badge.published, .badge.success, .badge.active { color: var(--success); border-color: color-mix(in srgb, var(--success) 35%, transparent); background: var(--success-soft); }
.badge.draft, .badge.warn { color: var(--warn); border-color: color-mix(in srgb, var(--warn) 35%, transparent); background: var(--warn-soft); }
.badge.danger, .badge.inactive { color: var(--danger); border-color: color-mix(in srgb, var(--danger) 35%, transparent); background: var(--danger-soft); }
.badge.role { color: var(--teal); border-color: color-mix(in srgb, var(--teal) 35%, transparent); background: var(--teal-soft); }
.badge.role.super { color: var(--warn); border-color: color-mix(in srgb, var(--warn) 40%, transparent); background: var(--warn-soft); }

/* ---------- سوییچ ---------- */

.switch { position: relative; display: inline-block; width: 42px; height: 24px; flex-shrink: 0; }
.switch input { opacity: 0; width: 0; height: 0; }

.switch .slider { position: absolute; inset: 0; background: var(--line); border-radius: 999px; cursor: pointer; transition: .2s; }

.switch .slider::before {
    content: "";
    position: absolute;
    width: 18px;
    height: 18px;
    right: 3px;
    top: 3px;
    background: #fff;
    border-radius: 50%;
    transition: .2s;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .25);
}

.switch input:checked + .slider { background: var(--teal); }
.switch input:checked + .slider::before { transform: translateX(-18px); }
.switch input:focus-visible + .slider { outline: 3px solid var(--accent-teal); outline-offset: 2px; }

/* ---------- جدول دسترسی‌ها ---------- */

.perm-groups { display: flex; flex-direction: column; gap: 10px; max-height: 320px; overflow-y: auto; padding-left: 4px; }
.perm-group { border: 1px solid var(--line); border-radius: 12px; padding: 10px 14px; background: var(--surface-2); }
.perm-group-title { font-size: 13px; font-weight: 700; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.perm-actions { display: flex; flex-wrap: wrap; gap: 6px 16px; }
.perm-check { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--muted); cursor: pointer; }
.perm-check input { accent-color: var(--teal); width: 15px; height: 15px; cursor: pointer; }

/* ---------- آواتار ---------- */

.user-cell { display: flex; align-items: center; gap: 12px; }

.avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--teal-soft);
    color: var(--teal);
    display: grid;
    place-items: center;
    font-weight: 800;
    font-size: 14px;
    flex-shrink: 0;
}

.user-cell .name { font-weight: 600; font-size: 13.5px; }
.user-cell .sub { font-size: 12px; color: var(--muted); }

/* ---------- مودال ---------- */

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(8, 24, 27, .55);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 36px 16px;
    overflow-y: auto;
    z-index: 50;
}

.modal-box {
    width: min(640px, 100%);
    background: var(--modal-bg);
    color: var(--ink);
    border: 1px solid var(--line);
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 24px 60px -20px rgba(8, 24, 27, .45);
}

.modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.modal-head h3 { margin: 0; font-size: 17px; font-weight: 700; }
.modal-close { background: none; border: none; color: var(--muted); font-size: 18px; cursor: pointer; width: 34px; height: 34px; border-radius: 10px; }
.modal-close:hover { background: var(--hover); color: var(--ink); }

.row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (max-width: 560px) { .row-2 { grid-template-columns: 1fr; } }

.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 6px; }

.img-preview { margin-top: 8px; max-width: 100%; max-height: 140px; border-radius: 10px; border: 1px solid var(--line); display: none; }

/* ---------- پیام کوتاه ---------- */

.toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--ink);
    color: var(--paper);
    border-radius: 12px;
    padding: 12px 20px;
    font-size: 13.5px;
    font-weight: 500;
    opacity: 0;
    pointer-events: none;
    transition: opacity .2s, transform .2s;
    z-index: 100;
    max-width: 90%;
    box-shadow: 0 12px 30px -10px rgba(0, 0, 0, .4);
}

.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
.toast.success { border-inline-start: 4px solid #3fbf8a; }
.toast.error { border-inline-start: 4px solid #e8685d; }

[hidden] { display: none !important; }

@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
