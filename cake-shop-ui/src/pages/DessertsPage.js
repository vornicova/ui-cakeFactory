// src/pages/DessertsPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = "/api";
// Было: /catalog/products — из-за этого не находились товары
const PRODUCTS_URL = API_BASE + "/products";

// Бэк, который отдает картинки, если imageUrl типа "/images/..."
const IMAGE_BASE = "http://localhost:8081";

const DessertsPage = () => {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");
    const [cartItemsCount, setCartItemsCount] = useState(0);

    const navigate = useNavigate();

    const loadCartCount = () => {
        try {
            const raw = localStorage.getItem("cartItems");
            if (!raw) {
                setCartItemsCount(0);
            } else {
                const items = JSON.parse(raw);
                const count = items.reduce(
                    (sum, it) => sum + (it.quantity || 0),
                    0
                );
                setCartItemsCount(count);
            }
        } catch (e) {
            console.error("Ошибка чтения cartItems", e);
            setCartItemsCount(0);
        }
    };

    useEffect(() => {
        loadCartCount();
    }, []);

    const getImageSrc = (p) => {
        if (!p.imageUrl) return null;
        const url = p.imageUrl.toString().trim();
        if (!url) return null;

        // если бэк уже отдал полный URL — используем как есть
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }

        // иначе считаем, что это путь типа "/images/..." с бэка на 8081
        return IMAGE_BASE + url;
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoadingProducts(true);
            setError("");
            try {
                const resp = await fetch(PRODUCTS_URL);
                if (!resp.ok) {
                    throw new Error(
                        "Ошибка загрузки продуктов (" + resp.status + ")"
                    );
                }
                const data = await resp.json();
                const list = Array.isArray(data) ? data : [];

                // сюда отправляем десерты, макароны, капкейки и т.д.
                const desserts = list.filter((p) => {
                    const cat = (
                        p.categoryName ||
                        p.category ||
                        ""
                    )
                        .toString()
                        .toUpperCase();

                    const isCupcake = cat.includes("CUPCAKE");

                    const isCake =
                        !isCupcake && (
                            cat.includes("CAKE") ||
                            cat.includes("CAKES") ||
                            cat.includes("TORTE")
                        );

                    // десерты = всё, что не торт (включая CUPCAKE)
                    return !isCake;
                });


                setProducts(desserts);
            } catch (err) {
                console.error(err);
                setError(err.message || "Не удалось загрузить продукты.");
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
                    imageUrl: product.imageUrl,
                    category: product.categoryName || product.category || "",
                });
            } else {
                items[idx].quantity = (items[idx].quantity || 0) + 1;
            }

            localStorage.setItem("cartItems", JSON.stringify(items));
            setToast("Добавлено в корзину");
            loadCartCount();
            setTimeout(() => setToast(""), 1200);
        } catch (e) {
            console.error(e);
            setToast("Не удалось добавить в корзину");
            setTimeout(() => setToast(""), 1200);
        }
    };

    return (
        <div className="cart-page">
            <nav className="navbar">
                <div className="navbar-logo">CAKEFACTORY</div>
                <div className="navbar-menu">
                    <Link to="/">Home</Link>
                    <Link to="/menu">Menu</Link>
                    <Link to="/cakes">Cakes</Link>
                    <Link to="/desserts" className="active">
                        Pastries
                    </Link>
                    <Link to="/contacts">Contacts</Link>
                    <Link to="/account">Account</Link>
                    <Link to="/custom-cake">Custom cake</Link>
                </div>
                <div className="navbar-cart">
                    <span
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/cart")}
                    >
                        Cart ({cartItemsCount})
                    </span>
                    &nbsp;·&nbsp; Admin · <Link to="/admin">open</Link>
                </div>
            </nav>

            <div className="page">
                <section className="card">
                    <h1>Десерты</h1>
                    <p>Макарони, капкейки, мини-торты и другие десерты.</p>

                    {error && (
                        <div className="status-msg err" style={{ marginTop: 10 }}>
                            {error}
                        </div>
                    )}

                    <div className="products-grid" style={{ marginTop: 16 }}>
                        {loadingProducts && (
                            <div style={{ fontSize: "0.9rem", color: "#9b7c90" }}>
                                Загружаем десерты...
                            </div>
                        )}

                        {!loadingProducts && !products.length && !error && (
                            <div style={{ fontSize: "0.9rem", color: "#9b7c90" }}>
                                Пока нет доступных десертов.
                            </div>
                        )}

                        {!loadingProducts &&
                            products.map((p) => {
                                const price = p.price ?? p.basePrice ?? 0;
                                const imgSrc = getImageSrc(p);

                                return (
                                    <div className="product-card" key={p.id}>
                                        <div className="product-card-image">
                                            {imgSrc && (
                                                <img src={imgSrc} alt={p.name} />
                                            )}
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
                                            {p.description && (
                                                <p className="product-card-desc">
                                                    {p.description}
                                                </p>
                                            )}
                                            <div className="product-card-footer">
                                                <span className="product-price">
                                                    {price?.toFixed
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
                </section>

                <div className="footer-mini">
                    © {new Date().getFullYear()} CakeFactory · Desserts
                </div>
            </div>

            {toast && <div className="toast">{toast}</div>}
        </div>
    );
};

export default DessertsPage;
