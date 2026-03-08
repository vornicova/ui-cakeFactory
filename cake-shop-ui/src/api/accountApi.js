// src/api/accountApi.js
const API_BASE = "/api";

export const fetchOrders = async (customerId) => {
    const resp = await fetch(`${API_BASE}/orders/user/${encodeURIComponent(customerId)}`);
    if (!resp.ok) throw new Error(`Ошибка загрузки заказов (${resp.status})`);
    const data = await resp.json();
    return Array.isArray(data) ? data : [];
};

export const fetchNotifications = async (customerId) => {
    const resp = await fetch(`${API_BASE}/notifications?customerId=${encodeURIComponent(customerId)}`);
    if (!resp.ok) throw new Error(`Ошибка загрузки уведомлений (${resp.status})`);
    const data = await resp.json();
    return Array.isArray(data) ? data : [];
};