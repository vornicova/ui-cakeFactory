import { useEffect, useState } from "react";

export function useCustomProduct(apiBase = "/api") {
    const [customProduct, setCustomProduct] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCustomProduct = async () => {
            try {
                setError("");
                const resp = await fetch(`${apiBase}/products`);
                if (!resp.ok) throw new Error("API error " + resp.status);

                const data = await resp.json();
                const found =
                    (data || []).find(
                        (p) =>
                            (p.category && p.category.toUpperCase() === "CUSTOM") ||
                            (p.name && p.name.toLowerCase().includes("custom"))
                    ) || null;

                if (!found) {
                    setError('В каталоге не найден продукт категории CUSTOM. Создайте товар "Custom cake" через админку.');
                }
                setCustomProduct(found);
            } catch (e) {
                console.error(e);
                setError("Ошибка загрузки продуктов для кастомного торта.");
                setCustomProduct(null);
            }
        };

        fetchCustomProduct();
    }, [apiBase]);

    return { customProduct, error };
}