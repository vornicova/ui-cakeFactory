// src/layout/MainLayout.jsx
import React from "react";

export function MainLayout({ children }) {
    return (
        <div className="page">
            {/* HEADER — полностью копируешь из index.html */}
            <header className="navbar">
                <div className="navbar-inner container">
                    <a href="/" className="logo">
                        <div className="logo-mark" />
                        <div>
                            <div className="logo-text-main">CakeFactory</div>
                            <div className="logo-text-sub">
                                Авторские торты и десерты
                            </div>
                        </div>
                    </a>

                    <nav className="navbar-menu">
                        <a href="/">Главная</a>
                        <a href="/cakes">Торты</a>
                        <a href="/desserts">Десерты</a>
                        <a href="/cart">Корзина</a>
                        <a href="/account">Профиль</a>
                    </nav>

                    <div className="navbar-actions">
                        <a className="phone-link" href="tel:+37360000000">
                            <span className="phone-circle">📞</span>
                            <span>+373 (60) 000-000</span>
                        </a>
                        <button className="cart-badge" type="button">
                            🧁 <span id="cartCount">0</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Содержимое страницы */}
            <main>{children}</main>

            {/* FOOTER — тоже копируешь из index.html */}
            <footer className="footer" id="contacts">
                <div className="container footer-inner">
                    <div>
                        © {new Date().getFullYear()} CakeFactory. Сделано с любовью к
                        десертам.
                    </div>
                    <div className="footer-links">
                        <a href="tel:+37360000000">Позвонить нам</a>
                        <a href="mailto:hello@cakefactory.md">hello@cakefactory.md</a>
                        <a href="#">Instagram</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
import { useCart } from "../context/CartContext";

export function MainLayout({ children }) {
    const { count } = useCart();

    return (
        <div className="page">
            {/* ... */}
            <button className="cart-badge" type="button">
                🧁 <span>{count}</span>
            </button>
            {/* ... */}
        </div>
    );
}
