// src/api/orderApi.js
import { ORDER_API } from "./config";

export async function createOrder(orderPayload) {
    const resp = await fetch(`${ORDER_API}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
    });

    if (!resp.ok) {
        throw new Error("Failed to create order");
    }
    return resp.json();
}
