import { useEffect, useState } from "react";

export function useCurrentCustomer(storageKey = "currentCustomer") {
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        try {
            const rawUser = localStorage.getItem(storageKey);
            if (!rawUser) return;
            setCustomer(JSON.parse(rawUser));
        } catch (e) {
            console.error("Ошибка чтения currentCustomer", e);
            setCustomer(null);
        }
    }, [storageKey]);

    return customer;
}