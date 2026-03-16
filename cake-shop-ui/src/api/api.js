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

// ================= AUTH HELPERS =================
const getStoredToken = () => {
    return (
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("jwt") ||
        ""
    );
};

const buildHeaders = (customHeaders = {}, body = null) => {
    const token = getStoredToken();
    const isFormData = body instanceof FormData;

    const headers = {
        ...customHeaders,
    };

    if (token && !headers.Authorization) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (!isFormData && body != null && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    if (isFormData && headers["Content-Type"]) {
        delete headers["Content-Type"];
    }

    return headers;
};

const parseResponse = async (res) => {
    if (res.status === 204) {
        return null;
    }

    const contentType = res.headers.get("content-type") || "";
    const text = await res.text().catch(() => "");

    if (!text) {
        return null;
    }

    if (contentType.includes("application/json")) {
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    }

    return text;
};

// ================= GENERIC HELPERS =================
export const apiGet = async (url, options = {}) => {
    const headers = buildHeaders(options.headers);

    const res = await fetch(url, {
        method: "GET",
        ...options,
        headers,
    });

    const data = await parseResponse(res);

    if (!res.ok) {
        throw new Error(
            typeof data === "string"
                ? data
                : `GET ${url} failed (${res.status})`
        );
    }

    return data;
};

export const apiSend = async (url, options = {}) => {
    try {
        const headers = buildHeaders(options.headers, options.body);

        const res = await fetch(url, {
            ...options,
            headers,
        });

        const data = await parseResponse(res);

        if (!res.ok) {
            throw new Error(
                typeof data === "string"
                    ? data
                    : `${options?.method || "POST"} ${url} failed (${res.status})`
            );
        }

        return data;
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
    return apiGet(`${PRODUCTS_URL}/${encodeURIComponent(id)}`);
}

export async function getCategories() {
    return apiGet(CATEGORIES_URL);
}

export async function getCakeDesigns() {
    return apiGet(CAKE_DESIGNS_URL);
}

// ================= PRODUCTS ADMIN =================
export async function createProduct(payload) {
    const isFormData = payload instanceof FormData;

    return apiSend(PRODUCTS_URL, {
        method: "POST",
        body: isFormData ? payload : JSON.stringify(payload),
    });
}

export async function updateProduct(id, payload) {
    const isFormData = payload instanceof FormData;

    return apiSend(`${PRODUCTS_URL}/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: isFormData ? payload : JSON.stringify(payload),
    });
}

export async function deleteProduct(id) {
    return apiSend(`${PRODUCTS_URL}/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });
}

// ================= CAKE DESIGNS ADMIN =================
export async function createCakeDesign(payload) {
    const isFormData = payload instanceof FormData;

    return apiSend(CAKE_DESIGNS_URL, {
        method: "POST",
        body: isFormData ? payload : JSON.stringify(payload),
    });
}

export async function updateCakeDesign(id, payload) {
    const isFormData = payload instanceof FormData;

    return apiSend(`${CAKE_DESIGNS_URL}/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: isFormData ? payload : JSON.stringify(payload),
    });
}

export async function deleteCakeDesign(id) {
    return apiSend(`${CAKE_DESIGNS_URL}/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });
}

// ================= CATEGORIES ADMIN =================
export async function createCategory(payload) {
    return apiSend(CATEGORIES_URL, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function updateCategory(id, payload) {
    return apiSend(`${CATEGORIES_URL}/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function deleteCategory(id) {
    return apiSend(`${CATEGORIES_URL}/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });
}

// ================= ORDERS =================
export async function createOrder(order) {
    return apiSend(ORDERS_URL, {
        method: "POST",
        body: JSON.stringify(order),
    });
}

// ================= PAYMENTS =================
export async function createPayment(payment) {
    return apiSend(PAYMENTS_URL, {
        method: "POST",
        body: JSON.stringify(payment),
    });
}

// ================= AUTH =================
export async function registerCustomer(payload) {
    return apiSend(`${AUTH_API}/register`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function loginCustomer(payload) {
    return apiSend(`${AUTH_API}/login`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

// ================= USERS =================
export async function getMe(token) {
    return apiGet(`${AUTH_API}/me`, {
        headers: token
            ? {
                Authorization: `Bearer ${token}`,
            }
            : {},
    });
}