/* =========================================================
   پنل ادمین - توابع مشترک
   استفاده: import { ... } from "./shared.js";
========================================================= */

export const API_BASE = "/api";
export const AUTH_STORAGE_KEY = "taj_medical_proxy_auth_v1";

/* ---------- session ---------- */

export function readSession() {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function saveSession(session) {
    if (!session) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return;
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

/* ---------- API client (auto refresh on 401) ---------- */

export async function apiFetch(path, options = {}, retry = true) {
    const session = readSession();
    const headers = new Headers(options.headers || {});

    if (options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    if (session?.idToken) {
        headers.set("Authorization", `Bearer ${session.idToken}`);
    }

    const response = await fetch(API_BASE + path, { ...options, headers });

    if (response.status === 401 && retry && session?.refreshToken) {
        try {
            const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken: session.refreshToken })
            });

            if (refreshResponse.ok) {
                const refreshed = await refreshResponse.json();

                saveSession({
                    ...session,
                    idToken: refreshed.idToken,
                    refreshToken: refreshed.refreshToken || session.refreshToken,
                    expiresIn: refreshed.expiresIn
                });

                return apiFetch(path, options, false);
            }
        } catch (e) {
            console.error("refresh failed", e);
        }
    }

    let payload = null;
    try { payload = await response.json(); } catch { payload = null; }

    if (!response.ok) {
        const error = new Error(payload?.message || payload?.error || `HTTP ${response.status}`);
        error.code = payload?.error || payload?.code || `http/${response.status}`;
        error.status = response.status;
        throw error;
    }

    return payload;
}

/* ---------- errors ---------- */

export const ERROR_MESSAGES = {
    INVALID_LOGIN_CREDENTIALS: "ایمیل یا رمز عبور اشتباه است.",
    NOT_ADMIN: "شما دسترسی مدیریت ندارید.",
    ACCOUNT_DISABLED: "حساب مدیریتی شما غیرفعال شده است.",
    FORBIDDEN: "مجوز لازم برای این عملیات را ندارید.",
    MISSING_FIELDS: "لطفاً فیلدهای الزامی را پر کنید.",
    INVALID_IMAGE_URL: "آدرس تصویر باید با https:// شروع شود.",
    UNAUTHENTICATED: "لطفاً دوباره وارد شوید.",
    NOT_FOUND: "مورد موردنظر یافت نشد.",
    USER_NOT_FOUND: "کاربری با این ایمیل ثبت‌نام نکرده است. ابتدا باید در سایت حساب بسازد.",
    ADMIN_EXISTS: "این کاربر از قبل ادمین است.",
    INVALID_EMAIL: "ایمیل معتبر نیست.",
    INVALID_ROLE: "نقش انتخابی معتبر نیست.",
    SUPER_ADMIN_PROTECTED: "مدیر ارشد فقط از طریق Firebase Console قابل تغییر است.",
    NO_CHANGES: "تغییری برای ذخیره وجود ندارد.",
    INVALID_PRICE: "قیمت باید یک عدد معتبر و غیرمنفی باشد.",
    INVALID_ORDER: "ترتیب نمایش باید یک عدد باشد.",
    INVALID_TITLE: "عنوان نمی‌تواند خالی باشد.",
    INVALID_PAGE: "این بخش از سایت شناخته‌شده نیست.",
};

export function friendlyError(error) {
    return ERROR_MESSAGES[error.code] || error.message || "خطایی رخ داد.";
}

/* ---------- UI helpers ---------- */

export function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.className = "toast show " + type;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 3200);
}

export function formatDate(value) {
    if (!value) return "—";
    try {
        return new Date(value).toLocaleDateString("fa-IR", {
            year: "numeric", month: "long", day: "numeric"
        });
    } catch {
        return "—";
    }
}

export function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = String(value ?? "");
    return div.innerHTML;
}

export function initials(text) {
    const clean = String(text || "").trim();
    if (!clean) return "?";
    return clean[0].toUpperCase();
}

/* ---------- permission labels ---------- */

export const SECTION_LABELS = {
    dashboard: "داشبورد",
    news: "اخبار",
    articles: "مطالب پزشکی",
    products: "محصولات",
    orders: "سفارش‌ها",
    users: "کاربران",
    media: "رسانه",
    pages: "صفحات",
    appearance: "ظاهر سایت",
    stats: "آمار",
    settings: "تنظیمات",
};

export const ACTION_LABELS = {
    view: "مشاهده",
    add: "افزودن",
    edit: "ویرایش",
    publish: "انتشار",
    delete: "حذف",
};

export const ROLE_LABELS = {
    super_admin: "مدیر ارشد",
    admin: "مدیر کل",
    content_manager: "مدیر محتوا",
    editor: "ویرایشگر",
};

/* ---------- shared nav ---------- */

const NAV_ITEMS = [
    { href: "index.html", icon: "fa-gauge", label: "داشبورد", key: "dashboard" },
    { href: "content.html", icon: "fa-newspaper", label: "مدیریت محتوا", key: "content" },
    { href: "products.html", icon: "fa-boxes-stacked", label: "محصولات", key: "products" },
    { href: "pages.html", icon: "fa-file-pen", label: "متن‌های سایت", key: "pages" },
    { href: "admins.html", icon: "fa-user-shield", label: "مدیریت ادمین‌ها", key: "admins", superOnly: true },
];

export function renderNav(activeKey, isSuper) {
    const wrap = document.getElementById("navBar");
    if (!wrap) return;

    wrap.innerHTML = NAV_ITEMS
        .filter((item) => !item.superOnly || isSuper)
        .map((item) => `
            <a class="nav-link ${item.key === activeKey ? "active" : ""}" href="${item.href}">
                <i class="fa-solid ${item.icon}"></i> ${item.label}
            </a>
        `).join("");
}
