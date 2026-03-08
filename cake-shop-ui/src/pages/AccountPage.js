import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountHeader from "../components/AccountHeader";
import OrdersList from "../components/OrdersList";
import NotificationsList from "../components/NotificationsList";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useCart } from "../hooks/useCart";
import { fetchOrders, fetchNotifications } from "../api/accountApi";

const AccountPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useCurrentUser();
    const { loadCartCount } = useCart();

    const isAuthed = !!user?.accessToken || !!user?.token;

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState("");

    const [notifs, setNotifs] = useState([]);
    const [notifsLoading, setNotifsLoading] = useState(false);
    const [notifsError, setNotifsError] = useState("");

    useEffect(() => {
        loadCartCount();
    }, [loadCartCount]);

    useEffect(() => {
        if (!user?.id) return;

        const load = async () => {
            setOrdersLoading(true);
            setOrdersError("");
            try {
                const data = await fetchOrders(user.id);
                setOrders(data);
            } catch (e) {
                setOrdersError(e?.message || "Не удалось загрузить заказы.");
            } finally {
                setOrdersLoading(false);
            }

            setNotifsLoading(true);
            setNotifsError("");
            try {
                const data = await fetchNotifications(user.id);
                setNotifs(data);
            } catch (e) {
                setNotifsError(e?.message || "Не удалось загрузить уведомления.");
            } finally {
                setNotifsLoading(false);
            }
        };

        load();
    }, [user?.id]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (!isAuthed) {
        return (
            <div className="page">
                <h1>Личный кабинет</h1>
                <p>Вы ещё не вошли в аккаунт.</p>
                <button onClick={() => navigate("/auth")}>Авторизация</button>
            </div>
        );
    }

    return (
        <div className="account-page">
            <AccountHeader user={user} onLogout={handleLogout} />

            {!user?.id && (
                <div className="page" style={{ marginTop: 12 }}>
                    <p>
                        Вы вошли (токен получен), но профиль пользователя (id) ещё не загружен —
                        поэтому заказы и уведомления пока недоступны.
                    </p>
                </div>
            )}

            <div className="account-grid">
                <OrdersList orders={orders} loading={ordersLoading} error={ordersError} />
                <NotificationsList notifs={notifs} loading={notifsLoading} error={notifsError} />
            </div>
        </div>
    );
};

export default AccountPage;