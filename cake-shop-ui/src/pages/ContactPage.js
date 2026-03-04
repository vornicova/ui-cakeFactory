import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ContactsPage = () => {
    const [cartItemsCount, setCartItemsCount] = useState(0);

    // считаем товары в корзине из localStorage, как на других страницах
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

    return (
        <div className="cart-page">
            {/* NAVBAR – почти как в монолите, но через Link и с путями без .html */}
            <nav className="navbar">
                <div className="navbar-logo">CAKEFACTORY</div>
                <div className="navbar-menu">
                    <Link to="/">Home</Link>
                    <Link to="/menu">Menu</Link>
                    <Link to="/cakes">Cakes</Link>
                    <Link to="/desserts">Pastries</Link>
                    <Link to="/contacts" className="active">
                        Contact
                    </Link>
                    <Link to="/account">Account</Link>
                    <Link to="/custom-cake">Custom cake</Link>
                </div>
                <div className="navbar-cart">
                    {/* Колокольчик пока без логики notification-service */}
                    <span
                        className="navbar-bell"
                        onClick={() => (window.location.href = "/account")}
                        style={{ display: "none" }}
                    >
            🔔 <span className="navbar-bell-count">0</span>
          </span>

                    <Link to="/cart">
                        Cart ({cartItemsCount})
                    </Link>
                    &nbsp;·&nbsp;
                    Admin · <Link to="/admin">open</Link>
                </div>
            </nav>

            <div className="page">
                <section className="card">
                    <h1>Contact us</h1>
                    <p>
                        Добро пожаловать в мир сладких приключений...
                    </p>

                    <div className="info-grid">
                        <div className="info-box">
                            <div className="info-box-title">Адрес</div>
                            <div className="info-box-text">
                                г. Кишинёв, ул. Сладкая, 15
                                <br />
                                Ежедневно с 09:00 до 20:00
                            </div>
                        </div>
                        <div className="info-box">
                            <div className="info-box-title">Телефон</div>
                            <div className="info-box-text">
                                +373 (60) 000 000
                                <br />
                                hello@cakefactory.test
                            </div>
                        </div>
                        <div className="info-box">
                            <div className="info-box-title">Соцсети</div>
                            <div className="info-box-text">
                                Instagram: @cakefactory
                                <br />
                                Facebook: /cakefactory
                            </div>
                        </div>
                    </div>
                </section>

                <div className="footer-mini">
                    © {new Date().getFullYear()} CakeFactory · Contact page
                </div>
            </div>
        </div>
    );
};

export default ContactsPage;
