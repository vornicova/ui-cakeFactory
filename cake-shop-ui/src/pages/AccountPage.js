// src/pages/AccountPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = "/api";

const ORDERS_URL = (customerId) =>
    `${API_BASE}/orders/user/${encodeURIComponent(customerId)}`;
const NOTIFICATIONS_URL = (customerId) =>
    `${API_BASE}/notifications?customerId=${encodeURIComponent(customerId)}`;

const AccountPage = () => {
    const [cartItemsCount, setCartItemsCount] = useState(0);

    const [user, setUser] = useState(null);

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState("");

    const [notifs, setNotifs] = useState([]);
    const [notifsLoading, setNotifsLoading] = useState(false);
    const [notifsError, setNotifsError] = useState("");

    const navigate = useNavigate();
    const year = new Date().getFullYear();

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

    const shortDateTime = (iso) => {
        if (!iso) return "";
        return iso.toString().replace("T", " ").substring(0, 16);
    };

    const statusClass = (status) => {
        if (!status) return "status-pill";
        const key = status.toString().toLowerCase();
        if (key === "new") return "status-pill status-new";
        if (key === "confirmed") return "status-pill status-confirmed";
        if (key === "in_progress") return "status-pill status-in_progress";
        if (key === "ready") return "status-pill status-ready";
        if (key === "cancelled") return "status-pill status-cancelled";
        return "status-pill";
    };

    useEffect(() => {
        loadCartCount();

        // читаем текущего пользователя (как и для корзины / кастомного торта)
        try {
            const raw = localStorage.getItem("currentCustomer");
            if (!raw) {
                setUser(null);
                return;
            }
            const u = JSON.parse(raw);
            setUser(u);
        } catch (e) {
            console.error("Ошибка парсинга currentCustomer", e);
            setUser(null);
        }
    }, []);

    // когда появился user — грузим его заказы и уведомления
    useEffect(() => {
        if (!user || !user.id) return;

        const loadOrders = async () => {
            setOrdersLoading(true);
            setOrdersError("");
            try {
                const resp = await fetch(ORDERS_URL(user.id));
                if (!resp.ok) {
                    throw new Error(
                        "Ошибка загрузки заказов (" + resp.status + ")"
                    );
                }
                const data = await resp.json();
                setOrders(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
                setOrdersError(e.message || "Не удалось загрузить заказы.");
            } finally {
                setOrdersLoading(false);
            }
        };

        const loadNotifs = async () => {
            setNotifsLoading(true);
            setNotifsError("");
            try {
                const resp = await fetch(NOTIFICATIONS_URL(user.id));
                if (!resp.ok) {
                    throw new Error(
                        "Ошибка загрузки уведомлений (" + resp.status + ")"
                    );
                }
                const data = await resp.json();
                setNotifs(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
                setNotifsError(
                    e.message || "Не удалось загрузить уведомления."
                );
            } finally {
                setNotifsLoading(false);
            }
        };

        loadOrders();
        loadNotifs();
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem("currentCustomer");
        // по желанию можно чистить корзину
        // localStorage.removeItem("cartItems");
        setUser(null);
        setOrders([]);
        setNotifs([]);
        navigate("/");
    };

    return (
        <div className="cart-page">
            {/* NAVBAR */}
            <nav className="navbar">
                <div className="navbar-logo">CAKEFACTORY</div>
                <div className="navbar-menu">
                    <Link to="/">Home</Link>
                    <Link to="/menu">Menu</Link>
                    <Link to="/cakes">Cakes</Link>
                    <Link to="/desserts">Pastries</Link>
                    <Link to="/contacts">Contacts</Link>
                    <Link to="/account" className="active">
                        Account
                    </Link>
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
                {!user ? (
                    <section className="card">
                        <h1>Личный кабинет</h1>
                        <p>
                            Вы ещё не вошли в аккаунт. Войдите, чтобы видеть историю
                            заказов и уведомления.
                        </p>
                        <button
                            type="button"
                            className="btn-primary"
                            onClick={() => navigate("/account")}
                        >
                            Перейти к авторизации
                        </button>
                        {/* когда сделаем отдельную страницу логина, можно будет
                навигировать, например, на /login */}
                    </section>
                ) : (
                    <>
                        <section className="card account-header">
                            <div>
                                <h1>Привет, {user.name || "гость"} ✨</h1>
                                <p>
                                    Email: {user.email || "—"}
                                    {user.phone ? (
                                        <>
                                            {" · Телефон: "}
                                            {user.phone}
                                        </>
                                    ) : null}
                                </p>
                            </div>
                            <div className="account-header-actions">
                                <button
                                    type="button"
                                    className="btn-outline"
                                    onClick={handleLogout}
                                >
                                    Выйти
                                </button>
                            </div>
                        </section>

                        <div className="account-grid">
                            {/* Заказы */}
                            <section className="card">
                                <div className="card-title">
                                    <h2>Мои заказы</h2>
                                    <span className="small">
                    {orders.length
                        ? `${orders.length} шт.`
                        : "нет заказов"}
                  </span>
                                </div>

                                {ordersError && (
                                    <div className="status-msg err">
                                        {ordersError}
                                    </div>
                                )}
                                {ordersLoading && (
                                    <div className="status-msg">
                                        Загружаем заказы...
                                    </div>
                                )}

                                {!ordersLoading && !ordersError && (
                                    <div className="orders-list">
                                        {!orders.length && (
                                            <div className="small">
                                                У вас пока нет заказов. Попробуйте
                                                добавить что-то из{" "}
                                                <Link to="/menu">меню</Link>.
                                            </div>
                                        )}

                                        {orders.map((o) => (
                                            <div
                                                key={o.id}
                                                className="order-card"
                                            >
                                                <div className="order-header">
                                                    <div className="order-title">
                                                        Заказ #{o.id}
                                                    </div>
                                                    <span
                                                        className={statusClass(
                                                            o.status
                                                        )}
                                                    >
                            {o.status}
                          </span>
                                                </div>
                                                <div className="order-meta small">
                                                    <div>
                                                        Создан:{" "}
                                                        {shortDateTime(
                                                            o.createdAt ||
                                                            o.createdDate
                                                        )}
                                                    </div>
                                                    <div>
                                                        Самовывоз:{" "}
                                                        {shortDateTime(
                                                            o.pickupTime
                                                        ) || "—"}
                                                    </div>
                                                    <div>
                                                        Сумма:{" "}
                                                        {o.totalPrice ??
                                                            o.totalAmount ??
                                                            0}{" "}
                                                        MDL
                                                    </div>
                                                </div>
                                                {o.comment && (
                                                    <div className="order-comment small">
                                                        Комментарий: {o.comment}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Уведомления */}
                            <section className="card">
                                <div className="card-title">
                                    <h2>Уведомления</h2>
                                    <span className="small">
                    {notifs.length
                        ? `${notifs.length} шт.`
                        : "нет уведомлений"}
                  </span>
                                </div>

                                {notifsError && (
                                    <div className="status-msg err">
                                        {notifsError}
                                    </div>
                                )}
                                {notifsLoading && (
                                    <div className="status-msg">
                                        Загружаем уведомления...
                                    </div>
                                )}

                                {!notifsLoading && !notifsError && (
                                    <div className="notif-list">
                                        {!notifs.length && (
                                            <div className="small">
                                                Новых уведомлений пока нет.
                                            </div>
                                        )}

                                        {notifs.map((n) => (
                                            <div
                                                key={n.id}
                                                className="notif-item"
                                            >
                                                <div className="notif-header">
                          <span className="badge">
                            {n.type || "INFO"}
                          </span>
                                                    {n.orderId && (
                                                        <span className="small">
                              Заказ #{n.orderId}
                            </span>
                                                    )}
                                                </div>
                                                <div className="notif-body">
                                                    <div className="notif-subject">
                                                        {n.subject ||
                                                            "Уведомление"}
                                                    </div>
                                                    <div className="notif-text small">
                                                        {n.body}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>
                    </>
                )}

                <div className="footer-mini">
                    © {year} CakeFactory · Account
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
