// src/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const fallbackProducts = [
    {
        id: 1,
        name: "Strawberry Dream",
        description: "Нежный ванильный бисквит с клубничным кремом.",
        basePrice: 380,
        category: "CAKE",
        imageUrl: "",
    },
    {
        id: 2,
        name: "Raspberry Velvet",
        description: "Красный бархат с малиновым конфи и крем-чизом.",
        basePrice: 420,
        category: "CAKE",
        imageUrl: "",
    },
    {
        id: 3,
        name: "Vanilla Cupcake",
        description: "Капкейк с ванильным кремом и ягодами.",
        basePrice: 90,
        category: "CUPCAKE",
        imageUrl: "",
    },
    {
        id: 4,
        name: "Chocolate Kiss",
        description: "Шоколадный муссовый мини-торт с пралине.",
        basePrice: 150,
        category: "MINI CAKE",
        imageUrl: "",
    },
];

function HomePage() {
    const [products, setProducts] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const year = new Date().getFullYear();

    // сюда ходим за картинками, если бэк отдаёт пути типа "/images/products/..."
    const IMAGE_BASE = "http://localhost:8081";

    useEffect(() => {
        loadProductsFromApi();
        loadCartCount();
    }, []);

    async function loadProductsFromApi() {
        try {
            const resp = await fetch("/api/products");
            if (!resp.ok) throw new Error("API error");
            const data = await resp.json();
            if (Array.isArray(data) && data.length > 0) {
                setProducts(data);
                return;
            }
            setProducts(fallbackProducts);
        } catch (e) {
            setProducts(fallbackProducts);
        }
    }

    function loadCartCount() {
        try {
            const raw = localStorage.getItem("cartItems");
            if (!raw) {
                setCartCount(0);
            } else {
                const items = JSON.parse(raw);
                const count = items.reduce(
                    (sum, it) => sum + (it.quantity || 0),
                    0
                );
                setCartCount(count);
            }
        } catch (e) {
            console.error("Ошибка чтения cartItems", e);
            setCartCount(0);
        }
    }

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    const handleAddToCart = (product) => {
        // пока просто увеличиваем счётчик
        setCartCount((prev) => prev + 1);
        console.log("Add to cart:", product.name);
    };

    const productsCount = (products.length || fallbackProducts.length) ?? 0;
    const listToRender = products.length > 0 ? products : fallbackProducts;

    // 👉 берём только первые 3–4 товара для витрины на главной
    const featuredProducts = listToRender.slice(0, 8);

    // 👉 аккуратно собираем src для картинки
    const getProductImageSrc = (p) => {
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

    return (
        <>
            {/* NAVBAR */}
            <nav className="navbar">
                <div className="navbar-logo">CAKEFACTORY</div>
                <div className="navbar-menu">
                    <Link to="/" className="active">
                        Home
                    </Link>
                    <Link to="/menu">Menu</Link>

                    <button
                        type="button"
                        className="navbar-link-button"
                        onClick={() => scrollToSection("cakes")}
                    >
                        Cakes
                    </button>

                    <Link to="/contacts">Contact</Link>
                    <Link to="/account">Account</Link>

                    <button
                        type="button"
                        className="navbar-link-button"
                        onClick={() => scrollToSection("custom-cake")}
                    >
                        Custom cake
                    </button>
                </div>
                <div className="navbar-cart">
                    Cart (<span>{cartCount}</span>)
                    &nbsp;·&nbsp; Admin · <Link to="/admin">open</Link>
                </div>
            </nav>

            <main>
                {/* HERO */}
                <section id="hero" className="hero">
                    <div>
                        <div className="hero-text-eyebrow">ARTISAN PASTRY STUDIO</div>
                        <h1 className="hero-title">
                            Bite into
                            <br />
                            Happiness.
                        </h1>
                        <p className="hero-subtitle">
                            Нежные торты, макароны и десерты ручной работы. Соберите свой
                            идеальный сладкий стол за пару кликов.
                        </p>
                        <div className="hero-actions">
                            <button
                                className="btn-primary"
                                type="button"
                                onClick={() => scrollToSection("menu")}
                            >
                                Order now
                            </button>
                            <button
                                className="btn-ghost"
                                type="button"
                                onClick={() => scrollToSection("menu")}
                            >
                                View menu
                            </button>
                        </div>
                        <div className="hero-meta">
                            Сегодня доступно <span>{productsCount}</span> позиций · свежая
                            выпечка каждый день
                        </div>
                    </div>

                    <div className="hero-image-wrap">
                        <div className="hero-floating-label">Handcrafted cakes</div>
                        <img
                            className="hero-image-main"
                            src="/images/products/pink-berry-mousse.jpg"
                            alt="Торт"
                        />
                        <div className="hero-macarons-row">
                            <div className="hero-macaron" />
                            <div className="hero-macaron" />
                            <div className="hero-macaron" />
                        </div>
                    </div>
                </section>

                {/* HANDCRAFTED CAKES / MENU */}
                <section id="menu" className="section">
                    <div className="section-inner">
                        <h2 className="section-title">Handcrafted Cakes</h2>
                        <p className="section-subtitle">
                            Небольшая подборка наших любимых позиций. Полное меню — на
                            странице <Link to="/menu">Menu</Link>.
                        </p>

                        <div id="cakes" className="products-grid">
                            {featuredProducts.map((p, index) => {
                                const price = p.basePrice ?? p.price ?? 0;
                                const category = p.category || "Cake";
                                const key = p.id || `fallback-${index}`;
                                const imgSrc = getProductImageSrc(p);

                                return (
                                    <article className="product-card" key={key}>
                                        <div className="product-image">
                                            {imgSrc ? (
                                                <img src={imgSrc} alt={p.name || "Product"} />
                                            ) : (
                                                <div className="product-image-placeholder">
                                                    {/* можно просто красивый фон без картинки */}
                                                </div>
                                            )}
                                        </div>
                                        <div className="product-name">{p.name}</div>
                                        <div className="product-desc">
                                            {p.description || ""}
                                        </div>
                                        <div className="product-bottom">
                                            <div>
                                                <div className="product-price">{price} MDL</div>
                                                <div className="product-badge">{category}</div>
                                            </div>
                                            {p.id ? (
                                                <button
                                                    type="button"
                                                    className="product-add-btn"
                                                    onClick={() => handleAddToCart(p)}
                                                >
                                                    В корзину
                                                </button>
                                            ) : null}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        {/* Блок промо */}
                        <div id="promo" className="promo-row">
                            <div className="promo-card">
                                <div>
                                    <div className="promo-tag">Limited time</div>
                                    <h3 className="promo-title">Seasonal berry collection</h3>
                                    <p className="promo-text">
                                        Специальное предложение на ягодные торты и капкейки до
                                        конца месяца. Идеально для летних дней и уютных вечеров.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={() => scrollToSection("cakes")}
                                >
                                    Get 15% off
                                </button>
                            </div>

                            <div className="promo-card">
                                <div>
                                    <div className="promo-tag">Custom orders</div>
                                    <h3 className="promo-title">Your story on a cake</h3>
                                    <p className="promo-text">
                                        Индивидуальный дизайн под праздник, корпоратив или
                                        свадебную вечеринку. Оставьте заявку, и мы свяжемся с вами.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="btn-outline"
                                    onClick={() => scrollToSection("custom-cake")}
                                >
                                    Request custom cake
                                </button>
                            </div>
                        </div>

                        <div id="contact" className="footer-mini">
                            © <span>{year}</span> CakeFactory
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default HomePage;
