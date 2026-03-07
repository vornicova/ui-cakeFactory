import { useEffect, useState } from "react";

export function useLocalCartCount(storageKey = "cartItems") {
    const [count, setCount] = useState(0);

    useEffect(() => {
        try {
            const rawCart = localStorage.getItem(storageKey);
            if (!rawCart) return;

            const items = JSON.parse(rawCart);
            const total = (items || []).reduce((sum, it) => sum + (it?.quantity || 0), 0);
            setCount(total);
        } catch (e) {
            console.error("Ошибка чтения cartItems", e);
            setCount(0);
        }
    }, [storageKey]);

    return count;
}