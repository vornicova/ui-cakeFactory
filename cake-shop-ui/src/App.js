// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// страницы лежат в src/pages
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import AuthPage from "./pages/AuthPage";
import CartPage from "./pages/CartPage";
import CakesPage from "./pages/CakesPage";
import DessertsPage from "./pages/DessertsPage";
import PaymentPage from "./pages/PaymentPage";
import ProductPage from "./pages/ProductPage";
import MenuPage from "./pages/MenuPage";
import ContactsPage from "./pages/ContactPage";
import ScrollToTop from "./components/ScrollToTop";
import CustomCakePage from "./pages/CustomCakePage";
import AdminPage from "./pages/AdminPage";

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                {/* Главная */}
                <Route path="/" element={<HomePage />} />

                {/* Каталог / меню */}
                <Route path="/menu" element={<MenuPage />} />

                {/* Разделы */}
                <Route path="/cakes" element={<CakesPage />} />
                <Route path="/desserts" element={<DessertsPage />} />
                <Route path="/contacts" element={<ContactsPage />} />

                {/* Корзина и оплата */}
                <Route path="/cart" element={<CartPage />} />
                <Route path="/payment" element={<PaymentPage />} />

                {/* ACCOUNT = логин/регистрация */}
                <Route path="/account" element={<AuthPage />} />
                <Route path="/account.html" element={<AuthPage />} />

                {/* Личный кабинет */}
                <Route path="/account/profile" element={<AccountPage />} />

                <Route path="/custom-cake" element={<CustomCakePage />} />

                <Route path="/admin" element={<AdminPage />} />

                {/* TODO: сюда потом добавим /admin */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
