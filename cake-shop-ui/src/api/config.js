// src/api/config.js
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export const CATALOG_API = `${API_BASE}/api/catalog`;
export const ORDER_API = `${API_BASE}/api/orders`;
export const PAYMENT_API = `${API_BASE}/api/payments`;
export const AUTH_API = `${API_BASE}/api/auth`;
