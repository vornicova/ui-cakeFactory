import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "/api";
const PRODUCTS_URL = API_BASE + "/products";
const IMAGE_BASE = "http://localhost:8081";

const DESIGN_FILTERS = [
    { key: "ALL", label: "Все" },
    { key: "BIRTHDAY", label: "День рождения" },
    { key: "WEDDING", label: "Свадебные" },
    { key: "KIDS", label: "Детские" },
    { key: "MINIMAL", label: "Минималистичные" },
    { key: "FLORAL", label: "Цветочные" },
    { key: "HOLIDAY", label: "Праздничные" },
];

const CakesPage = () => {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");
    const [activeDesign, setActiveDesign] = useState("ALL");

    const getImageSrc = (p) => {
        if (!p?.imageUrl) return null;
        const url = String(p.imageUrl).trim();
        if (!url) return null;

        if (url.startsWith("http://") || url.startsWith("https://")) return url;
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
                const list = Array.isArray(data) ? data : [];
                setProducts(list);
            } catch (err) {
                console.error(err);
                setError(err?.message || "Не удалось загрузить продукты.");
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, []);

    const cakes = useMemo(() => {
        return (products || []).filter((p) => {
            const cat = String(p.categoryCode || p.categoryName || p.category || "").toUpperCase();
            const design = String(p.designCategory || "").trim();

            return cat.includes("CAKE") && design !== "";
        });
    }, [products]);

    const filteredCakes = useMemo(() => {
        if (activeDesign === "ALL") return cakes;

        return cakes.filter((p) => {
            const design = String(p.designCategory || "").toUpperCase();
            return design === activeDesign;
        });
    }, [cakes, activeDesign]);
    const handleAddToCart = (product) => {
        try {
            const raw = localStorage.getItem("cartItems");
            const items = raw ? JSON.parse(raw) : [];

            const idx = items.findIndex((it) => String(it.id) === String(product.id));
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

    const getDesignLabel = (designCategory) => {
        const found = DESIGN_FILTERS.find((item) => item.key === designCategory);
        return found ? found.label : "Без категории";
    };

    return (
        <section className="cakes-page">
            <div className="cakes-page-header">
                <h1>Каталог тортов</h1>
                <p>Выберите готовый дизайн или найдите вдохновение для своего торта.</p>
            </div>

            <div className="design-filters">
                {DESIGN_FILTERS.map((filter) => (
                    <button
                        key={filter.key}
                        type="button"
                        className={`design-filter-btn ${activeDesign === filter.key ? "active" : ""}`}
                        onClick={() => setActiveDesign(filter.key)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {error && (
                <div className="status-msg err" style={{ marginTop: 10 }}>
                    {error}
                </div>
            )}

            <div className="products-grid" style={{ marginTop: 16 }}>
                {loadingProducts && (
                    <div style={{ fontSize: "0.9rem", color: "#9b7c90" }}>
                        Загружаем торты...
                    </div>
                )}

                {!loadingProducts && !filteredCakes.length && !error && (
                    <div style={{ fontSize: "0.9rem", color: "#9b7c90" }}>
                        В этой категории пока нет доступных тортов.
                    </div>
                )}

                {!loadingProducts &&
                    filteredCakes.map((p) => {
                        const price = p.price ?? p.basePrice ?? 0;
                        const imgSrc = getImageSrc(p);

                        return (
                            <div className="product-card" key={p.id}>
                                <div className="product-card-image">
                                    {imgSrc ? <img src={imgSrc} alt={p.name} /> : null}
                                </div>

                                <div className="product-card-body">
                                    {p.designCategory ? (
                                        <div className="product-design-badge">
                                            {getDesignLabel(p.designCategory)}
                                        </div>
                                    ) : null}

                                    <h3>{p.name}</h3>

                                    {p.description ? (
                                        <p className="product-card-desc">{p.description}</p>
                                    ) : null}

                                    <div className="product-card-footer">
                                        <span className="product-price">
                                            {typeof price === "number" && price.toFixed
                                                ? price.toFixed(2)
                                                : price} MDL
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

export default CakesPage;