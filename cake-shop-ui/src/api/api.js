// ================= BASE URLS =================
export const CATALOG_API = "http://localhost:8081/api/catalog";
export const ORDER_API = "http://localhost:8082/api/orders";
export const PAYMENT_API = "http://localhost:8083/api/payments";

// ================= ENDPOINTS =================
export const PRODUCTS_URL = `${CATALOG_API}/products`;
export const ORDERS_URL = ORDER_API;
export const PAYMENTS_URL = PAYMENT_API;

// если появится сервис клиентов:
export const CUSTOMERS_URL = "http://localhost:8082/api/customers";
export const AUTH_API = "/auth";

// если появится сервис уведомлений:
export const NOTIFICATIONS_URL = "http://localhost:8082/api/notifications";


// ================= GENERIC HELPERS =================
export const apiGet = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GET ${url} failed`);
    return await res.json();
};

export const apiSend = async (url, options) => {
    try {
        const res = await fetch(url, options);

        const text = await res.text().catch(() => "");
        if (!res.ok) {
            throw new Error(text || `${options?.method || "POST"} ${url} failed (${res.status})`);
        }

        if (!text) return null;
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    } catch (e) {
        // Это как раз "Failed to fetch"
        throw new Error(`Failed to fetch: ${options?.method || "POST"} ${url}. ${e?.message || ""}`.trim());
    }
};


// ================= CATALOG =================
export async function getProducts() {
    return apiGet(PRODUCTS_URL);
}

export async function getProductById(id) {
    return apiGet(`${PRODUCTS_URL}/${id}`);
}


// ================= ORDERS =================
export async function createOrder(order) {
    return apiSend(ORDERS_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(order)
    });
}


// ================= PAYMENTS =================
export async function createPayment(payment) {
    return apiSend(PAYMENTS_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payment)
    });
}
// ================= CUSTOMERS / AUTH (MVP) =================
export async function registerCustomer(payload) {
    return apiSend(`${AUTH_API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}
export async function getMe(accessToken) {
    return apiSend(`${AUTH_API}/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
    });
}

export async function loginCustomer(payload) {
    return apiSend(`${AUTH_API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}


