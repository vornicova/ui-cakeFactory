// src/pages/MenuPage.jsx
import React, { useEffect, useState } from "react";

const API_BASE = "/api";
const PRODUCTS_URL = API_BASE + "/products";
const IMAGE_BASE = "http://localhost:8081";

const MenuPage = () => {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");

    const getImageSrc = (p) => {
        if (!p?.imageUrl) return null;

        const url = String(p.imageUrl).trim();

        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }

        return IMAGE_BASE + url;
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoadingProducts(true);
            setError("");

            try {
                const resp = await fetch(PRODUCTS_URL);

                if (!resp.ok) {
                    throw new Error(`Ошибка загрузки продуктов (${resp.status})`);
                }

                const data = await resp.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setError(err?.message || "Не удалось загрузить продукты.");
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        try {
            const raw = localStorage.getItem("cartItems");
            const items = raw ? JSON.parse(raw) : [];

            const idx = items.findIndex(
                (it) => String(it.id) === String(product.id)
            );

            const price = product.price ?? product.basePrice ?? 0;

            if (idx === -1) {
                items.push({
                    id: product.id,
                    name: product.name,
                    price,
                    quantity: 1,
                    imageUrl: product.imageUrl || "",
                    category: product.categoryName || product.category || "",
                });
            } else {
                items[idx].quantity = (items[idx].quantity || 0) + 1;
            }
            localStorage.setItem("cartItems", JSON.stringify(items));
            window.dispatchEvent(new Event("cart:updated"));

            setToast("Добавлено в корзину");
            setTimeout(() => setToast(""), 1200);
        } catch (e) {
            console.error(e);
            setToast("Не удалось добавить в корзину");
            setTimeout(() => setToast(""), 1200);
        }
    };

    return (
        <section className="card">
            <h1>Меню</h1>
            <p>Все десерты CakeFactory, доступные для заказа.</p>

            {error && (
                <div className="status-msg err" style={{ marginTop: 10 }}>
                    {error}
                </div>
            )}

            <div className="products-grid" style={{ marginTop: 16 }}>
                {loadingProducts && (
                    <div style={{ fontSize: "0.9rem", color: "#9b7c90" }}>
                        Загружаем продукты...
                    </div>
                )}

                {!loadingProducts && !products.length && !error && (
                    <div style={{ fontSize: "0.9rem", color: "#9b7c90" }}>
                        Пока нет доступных позиций.
                    </div>
                )}

                {!loadingProducts &&
                    products.map((p) => {
                        const price = p.price ?? p.basePrice ?? 0;
                        const imgSrc = getImageSrc(p);

                        return (
                            <div className="product-card" key={p.id}>
                                <div className="product-card-image">
                                    {imgSrc ? (
                                        <img src={imgSrc} alt={p.name} />
                                    ) : null}
                                </div>

                                <div className="product-card-body">
                                    <h3>{p.name}</h3>

                                    {p.categoryName || p.category ? (
                                        <div
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "#9b7c90",
                                                marginBottom: 4,
                                            }}
                                        >
                                            {p.categoryName || p.category}
                                        </div>
                                    ) : null}

                                    {p.description ? (
                                        <p className="product-card-desc">
                                            {p.description}
                                        </p>
                                    ) : null}

                                    <div className="product-card-footer">
                                        <span className="product-price">
                                            {typeof price === "number" &&
                                            price.toFixed
                                                ? price.toFixed(2)
                                                : price}{" "}
                                            MDL
                                        </span>

                                        <button
                                            type="button"
                                            className="btn-primary product-add-btn"
                                            onClick={() => handleAddToCart(p)}
                                        >
                                            В корзину
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {toast && <div className="toast">{toast}</div>}
        </section>
    );
};

export default MenuPage;