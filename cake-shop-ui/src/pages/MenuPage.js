import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = "/api";
const PRODUCTS_URL = API_BASE + "/products";
const IMAGE_BASE = "http://localhost:8081";

const MenuPage = () => {
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

    // грузим ВСЕ продукты из catalog-service
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
                setProducts(data || []);
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

            if (idx === -1) {
                items.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
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
                    <Link to="/desserts">Pastries</Link>
                    <Link to="/account">Account</Link>
                    <Link to="/custom-cake">Custom cake</Link>
                    <Link to="/contacts">Contacts</Link>
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

                        {!loadingProducts && !products.length && (
                            <div style={{ fontSize: "0.9rem", color: "#9b7c90" }}>
                                Пока нет доступных позиций.
                            </div>
                        )}

                        {!loadingProducts &&
                            products.map((p) => (
                                <div className="product-card" key={p.id}>
                                    <div className="product-card-image">
                                        {p.imageUrl && (
                                            <img src={`${IMAGE_BASE}${p.imageUrl}`} alt={p.name} />
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
                        {p.price?.toFixed
                            ? p.price.toFixed(2)
                            : p.price}{" "}
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
                            ))}
                    </div>
                </section>

                <div className="footer-mini">
                    © {new Date().getFullYear()} CakeFactory · Menu
                </div>
            </div>

            {toast && <div className="toast">{toast}</div>}
        </div>
    );
};

export default MenuPage;
