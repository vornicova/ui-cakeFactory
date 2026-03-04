// src/api/catalogApi.js
import { CATALOG_API } from "./config";

export async function fetchProducts() {
    const resp = await fetch(`${CATALOG_API}/products`);
    if (!resp.ok) {
        throw new Error("Failed to load products");
    }
    return resp.json();
}
