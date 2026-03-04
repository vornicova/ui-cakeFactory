// Базовый URL для всех запросов
// Потом можно будет вынести в .env
const CATALOG_API = "http://localhost:8081/api/catalog";
const ORDER_API   = "http://localhost:8082/api/orders";
const PAYMENT_API = "http://localhost:8083/api/payments";

// ----- CATALOG -----
export async function getProducts() {
    const res = await fetch(`${CATALOG_API}/products`);
    if (!res.ok) throw new Error("Failed to load products");
    return res.json();
}

export async function getProductById(id) {
    const res = await fetch(`${CATALOG_API}/products/${id}`);
    if (!res.ok) throw new Error("Failed to load product");
    return res.json();
}

// ----- ORDERS -----
export async function createOrder(order) {
    const res = await fetch(ORDER_API, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(order)
    });
    if (!res.ok) throw new Error("Failed to create order");
    return res.json();
}

// ----- PAYMENTS -----
export async function createPayment(payment) {
    const res = await fetch(PAYMENT_API, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payment)
    });
    if (!res.ok) throw new Error("Failed to create payment");
    return res.json();
}
