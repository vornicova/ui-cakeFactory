// src/pages/AuthPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "currentCustomer";

function AuthPage() {
    const [mode, setMode] = useState("login"); // "login" | "register"
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("+373");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const isLogin = mode === "login";

    // если уже авторизован → сразу в личный кабинет
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (parsed && parsed.id) {
                navigate("/account/profile", { replace: true });
            }
        } catch (e) {
            console.warn("Cannot parse currentCustomer", e);
        }
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!phone.trim() || !password.trim()) {
            setError("Заполните телефон и пароль.");
            return;
        }
        if (!isLogin && (!name.trim() || !email.trim())) {
            setError("Заполните все поля регистрации.");
            return;
        }

        // TODO: сюда позже добавим вызов auth-service (login / register)
        // пока просто сохраняем пользователя в localStorage
        const customer = {
            id: Date.now(), // временный id
            name: isLogin ? "Гость" : name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            role: "USER",
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));

        // после входа → в личный кабинет
        navigate("/account/profile");
    };

    const switchToLogin = () => {
        setMode("login");
        setError("");
    };

    const switchToRegister = () => {
        setMode("register");
        setError("");
    };

    return (
        <>
            {/* NAVBAR */}
            <nav className="navbar">
                <div className="navbar-logo">CAKEFACTORY</div>
                <div className="navbar-menu">
                    <a href="/">Home</a>
                    <a href="/menu.html">Menu</a>
                    <a href="/cakes.html">Cakes</a>
                    <a href="/desserts.html">Pastries</a>
                    <a href="/account" className="active">
                        Account
                    </a>
                    <a href="/custom-cake.html">Custom cake</a>
                </div>
                <div className="navbar-cart">
                    Cart (0) · Admin · <a href="/admin.html">open</a>
                </div>
            </nav>

            <div className="auth-wrapper">
                <section className="auth-card">
                    <h1 className="auth-title">
                        {isLogin ? "Войти" : "Регистрация"}
                    </h1>
                    <p className="auth-subtitle">
                        {isLogin
                            ? "Используйте телефон и пароль, чтобы открыть личный кабинет и заказы."
                            : "Создайте аккаунт, чтобы оформлять заказы и отслеживать их статус."}
                    </p>

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <>
                                <label className="auth-field-label" htmlFor="name">
                                    Имя
                                </label>
                                <input
                                    id="name"
                                    className="auth-input"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ваше имя"
                                />
                            </>
                        )}

                        <label className="auth-field-label" htmlFor="phone">
                            Телефон
                        </label>
                        <input
                            id="phone"
                            className="auth-input"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+373..."
                        />

                        {!isLogin && (
                            <>
                                <label className="auth-field-label" htmlFor="email">
                                    E-mail
                                </label>
                                <input
                                    id="email"
                                    className="auth-input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                />
                            </>
                        )}

                        <label className="auth-field-label" htmlFor="password">
                            Пароль
                        </label>
                        <input
                            id="password"
                            className="auth-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Пароль"
                        />

                        <div className="auth-actions-row">
                            <button className="btn-primary" type="submit">
                                {isLogin ? "Войти" : "Создать аккаунт"}
                            </button>
                        </div>

                        {error && <div className="auth-error">{error}</div>}
                    </form>

                    <div className="auth-secondary-text">
                        {isLogin ? (
                            <>
                                Нет аккаунта?{" "}
                                <span
                                    className="auth-link"
                                    onClick={switchToRegister}
                                >
                  Зарегистрироваться
                </span>
                            </>
                        ) : (
                            <>
                                Уже есть аккаунт?{" "}
                                <span className="auth-link" onClick={switchToLogin}>
                  Войти
                </span>
                            </>
                        )}
                    </div>

                    {!isLogin && (
                        <div className="auth-hint-box">
                            После регистрации вы автоматически попадёте в личный
                            кабинет. Данные профиля сохраняются в локальном
                            хранилище браузера.
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}

export default AuthPage;
