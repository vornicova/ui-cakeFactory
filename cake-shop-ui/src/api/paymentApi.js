// src/api/paymentApi.js
import { PAYMENT_API } from "./config";

export async function createPayment(paymentPayload) {
    const resp = await fetch(`${PAYMENT_API}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
    });

    if (!resp.ok) {
        throw new Error("Failed to init payment");
    }
    return resp.json();
}
