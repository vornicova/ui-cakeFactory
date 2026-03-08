import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCustomer, loginCustomer, getMe } from "../api/api";

const TOKENS_KEY = "authTokens";
const PROFILE_KEY = "currentUserProfile";

function safeReadJson(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        console.warn(`Cannot parse ${key}`, e);
        return null;
    }
}

function safeWriteJson(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error(`Cannot write ${key}`, e);
    }
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function AuthPage() {
    const [mode, setMode] = useState("login"); // "login" | "register"
    const isLogin = useMemo(() => mode === "login", [mode]);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const navigate = useNavigate();

    // если уже авторизован → сразу в личный кабинет
    useEffect(() => {
        const tokens = safeReadJson(TOKENS_KEY);
        if (tokens?.accessToken) {
            navigate("/account", { replace: true });
        }
    }, [navigate]);

    const switchToLogin = () => {
        setMode("login");
        setError("");
        setPassword("");
    };

    const switchToRegister = () => {
        setMode("register");
        setError("");
        setPassword("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const emailValue = email.trim();
        const passwordValue = password.trim();
        const fullNameValue = fullName.trim();

        if (!emailValue || !passwordValue) {
            setError("Заполните e-mail и пароль.");
            return;
        }
        if (!isValidEmail(emailValue)) {
            setError("Введите корректный e-mail.");
            return;
        }
        if (!isLogin && !fullNameValue) {
            setError("Заполните имя.");
            return;
        }

        try {
            // 1) получаем токены
            const tokens = isLogin
                ? await loginCustomer({ email: emailValue, password: passwordValue })
                : await registerCustomer({
                    email: emailValue,
                    password: passwordValue,
                    fullName: fullNameValue,
                });

            safeWriteJson(TOKENS_KEY, tokens);

            // 2) получаем профиль
            const me = await getMe(tokens.accessToken);
            safeWriteJson(PROFILE_KEY, me);

            // 3) обновляем UI
            window.dispatchEvent(new Event("user:updated"));
            navigate("/account", { replace: true });
        } catch (err) {
            setError(err?.message || "Ошибка регистрации/входа.");
        }
    };

    return (
        <div className="auth-wrapper">
            <section className="auth-card">
                <h1 className="auth-title">{isLogin ? "Войти" : "Регистрация"}</h1>

                <p className="auth-subtitle">
                    {isLogin
                        ? "Введите e-mail и пароль, чтобы войти."
                        : "Создайте аккаунт, чтобы оформлять заказы и отслеживать их статус."}
                </p>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <label className="auth-field-label" htmlFor="fullName">
                                Имя
                            </label>
                            <input
                                id="fullName"
                                className="auth-input"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Ваше имя"
                                autoComplete="name"
                            />
                        </>
                    )}

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
                        autoComplete="email"
                    />

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
                        autoComplete={isLogin ? "current-password" : "new-password"}
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
                            <span className="auth-link" onClick={switchToRegister}>
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
                        После регистрации вы автоматически попадёте в личный кабинет.
                    </div>
                )}
            </section>
        </div>
    );
}

export default AuthPage;