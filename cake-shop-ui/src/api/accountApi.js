const API_BASE = "/api";

async function readError(resp, fallbackMessage) {
    try {
        const text = await resp.text();
        if (!text) return `${fallbackMessage} (${resp.status})`;

        try {
            const json = JSON.parse(text);
            return json.message || json.error || `${fallbackMessage} (${resp.status})`;
        } catch {
            return text;
        }
    } catch {
        return `${fallbackMessage} (${resp.status})`;
    }
}

export const fetchOrders = async (customerId) => {
    const resp = await fetch(`${API_BASE}/orders/user/${encodeURIComponent(customerId)}`);
    if (!resp.ok) {
        throw new Error(await readError(resp, "Ошибка загрузки заказов"));
    }
    const data = await resp.json();
    return Array.isArray(data) ? data : [];
};

export const fetchNotifications = async (customerId) => {
    const resp = await fetch(`${API_BASE}/notifications?customerId=${encodeURIComponent(customerId)}`);
    if (!resp.ok) {
        throw new Error(await readError(resp, "Ошибка загрузки уведомлений"));
    }
    const data = await resp.json();
    return Array.isArray(data) ? data : [];
};