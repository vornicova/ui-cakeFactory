// src/api/config.js

export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

const api = (path) => `${API_BASE}${path}`;

export const API_ENDPOINTS = {
    products: api("/api/products"),
    categories: api("/api/categories"),
    cakeDesigns: api("/api/cake-designs"),
    orders: api("/api/orders"),
    payments: api("/api/payments"),
    users: api("/api/users"),
    login: api("/api/auth/login"),
    register: api("/api/auth/register"),
    notifications: api("/api/notifications"),
};