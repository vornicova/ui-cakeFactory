// src/api/api.js

const API_BASE = "/api";

// ================= ENDPOINTS =================
export const PRODUCTS_URL = `${API_BASE}/products`;
export const CATEGORIES_URL = `${API_BASE}/categories`;
export const CAKE_DESIGNS_URL = `${API_BASE}/cake-designs`;

export const ORDERS_URL = `${API_BASE}/orders`;
export const PAYMENTS_URL = `${API_BASE}/payments`;
export const USERS_URL = `${API_BASE}/users`;
export const AUTH_API = `${API_BASE}/auth`;
export const NOTIFICATIONS_URL = `${API_BASE}/notifications`;

// ================= GENERIC HELPERS =================
export const apiGet = async (url, options = {}) => {
    const res = await fetch(url, {
        method: "GET",
        ...options,
    });

    const text = await res.text().catch(() => "");

    if (!res.ok) {
        throw new Error(text || `GET ${url} failed (${res.status})`);
    }

    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
};

export const apiSend = async (url, options = {}) => {
    try {
        const res = await fetch(url, options);

        const text = await res.text().catch(() => "");

        if (!res.ok) {
            throw new Error(
                text || `${options?.method || "POST"} ${url} failed (${res.status})`
            );
        }

        if (!text) return null;

        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    } catch (e) {
        throw new Error(
            `Failed to fetch: ${options?.method || "POST"} ${url}. ${e?.message || ""}`.trim()
        );
    }
};

// ================= CATALOG =================
export async function getProducts() {
    return apiGet(PRODUCTS_URL);
}

export async function getProductById(id) {
    return apiGet(`${PRODUCTS_URL}/${id}`);
}

export async function getCategories() {
    return apiGet(CATEGORIES_URL);
}

export async function getCakeDesigns() {
    return apiGet(CAKE_DESIGNS_URL);
}

// ================= ORDERS =================
export async function createOrder(order) {
    return apiSend(ORDERS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
    });
}

// ================= PAYMENTS =================
export async function createPayment(payment) {
    return apiSend(PAYMENTS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payment),
    });
}

// ================= AUTH =================
export async function registerCustomer(payload) {
    return apiSend(`${AUTH_API}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
}

export async function loginCustomer(payload) {
    return apiSend(`${AUTH_API}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
}

// ================= USERS =================
export async function getMe(token) {
    const response = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Не удалось получить профиль пользователя.");
    }

    return response.json();
}