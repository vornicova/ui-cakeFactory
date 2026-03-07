// src/hooks/useCart.js
import { useEffect, useState } from "react";

export const useCart = () => {
    const [cartCount, setCartCount] = useState(0);

    const loadCartCount = () => {
        try {
            const raw = localStorage.getItem("cartItems");
            const items = raw ? JSON.parse(raw) : [];

            const count = items.reduce(
                (sum, it) => sum + (it.quantity || 0),
                0
            );

            setCartCount(count);
        } catch (e) {
            console.error("Ошибка cartItems", e);
            setCartCount(0);
        }
    };

    useEffect(() => {
        loadCartCount();

        const handler = () => loadCartCount();
        window.addEventListener("cart:updated", handler);

        return () => {
            window.removeEventListener("cart:updated", handler);
        };
    }, []);

    return {
        cartCount,
        loadCartCount
    };
};