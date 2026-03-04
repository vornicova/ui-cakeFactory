import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// базовые URL микросервисов через API-gateway
const API_BASE = "/api"; // если фронт и gateway на одном домене
const ORDERS_URL = API_BASE + "/orders";
const PAYMENTS_URL = API_BASE + "/payments";

// 👇 база для картинок из catalog-service
const IMAGE_BASE = "http://localhost:8081";

const CartPage = () => {
    const [items, setItems] = useState([]);
    const [pickupTime, setPickupTime] = useState("");
    const [comment, setComment] = useState("");
    const [status, setStatus] = useState("");
    const [statusType, setStatusType] = useState(""); // "ok" | "err" | ""
    const [loading, setLoading] = useState(false);

    // 1) читаем корзину из localStorage (как в монолите)
    useEffect(() => {
        try {
            const raw = localStorage.getItem("cartItems");
            if (raw) {
                setItems(JSON.parse(raw));
            }
        } catch (e) {
            console.error("Ошибка чтения cartItems из localStorage", e);
        }
    }, []);

    const total = useMemo(
        () =>
            items.reduce(
                (sum, it) => sum + (it.price || 0) * (it.quantity || 0),
                0
            ),
        [items]
    );

    const saveItems = (newItems) => {
        setItems(newItems);
        localStorage.setItem("cartItems", JSON.stringify(newItems));
    };

    const handleInc = (id) => {
        const updated = items.map((it) =>
            String(it.id) === String(id)
                ? { ...it, quantity: (it.quantity || 0) + 1 }
                : it
        );
        saveItems(updated);
    };

    const handleDec = (id) => {
        let updated = items
            .map((it) =>
                String(it.id) === String(id)
                    ? { ...it, quantity: (it.quantity || 0) - 1 }
                    : it
            )
            .filter((it) => (it.quantity || 0) > 0);
        saveItems(updated);
    };

    const handleRemove = (id) => {
        const updated = items.filter((it) => String(it.id) !== String(id));
        saveItems(updated);
    };

    const resetStatus = () => {
        setStatus("");
        setStatusType("");
    };

    // 2) оформление заказа с вызовом order-service + payment-service
    const handleSubmit = async (e) => {
        e.preventDefault();
        resetStatus();

        if (!items.length) {
            setStatus("Корзина пуста.");
            setStatusType("err");
            return;
        }

        const rawUser = localStorage.getItem("currentCustomer");
        if (!rawUser) {
            setStatus("Сначала войдите в аккаунт.");
            setStatusType("err");
            setTimeout(() => {
                window.location.href = "/auth";
            }, 800);
            return;
        }

        let customer;
        try {
            customer = JSON.parse(rawUser);
        } catch (err) {
            console.error(err);
            setStatus("Ошибка чтения профиля. Войдите ещё раз.");
            setStatusType("err");
            localStorage.removeItem("currentCustomer");
            return;
        }

        const payload = {
            userId: customer.id,
            pickupTime: pickupTime || null,
            comment: comment || "",
            items: items.map((it) => ({
                productId: it.id,
                productName: it.name,
                unitPrice: it.price,
                quantity: it.quantity,
            })),
        };
        const totalAmount = total;

        setLoading(true);
        try {
            // 1) создаём заказ
            const orderResp = await fetch(ORDERS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!orderResp.ok) {
                throw new Error("Ошибка оформления заказа (" + orderResp.status + ")");
            }

            const order = await orderResp.json();

            // 2) создаём платёж
            const paymentPayload = {
                orderId: order.id,
                amount: totalAmount,
                paymentMethod: "CARD",
            };

            let paymentStatusText = "";

            try {
                const payResp = await fetch(PAYMENTS_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(paymentPayload),
                });

                if (!payResp.ok) {
                    throw new Error(
                        "Ошибка при создании платежа (" + payResp.status + ")"
                    );
                }

                const payment = await payResp.json();
                paymentStatusText = ` Платёж #${payment.id} · статус: ${
                    payment.status || "создан"
                }.`;
            } catch (payErr) {
                console.error(payErr);
                paymentStatusText =
                    " Платёж пока не создан, попробуйте позже оплатить заново в личном кабинете.";
            }

            saveItems([]);
            setPickupTime("");
            setComment("");

            setStatus(`Заказ #${order.id} успешно создан!` + paymentStatusText);
            setStatusType("ok");

            setTimeout(() => {
                window.location.href = "/account";
            }, 1500);
        } catch (err) {
            console.error(err);
            setStatus(err.message || "Не удалось оформить заказ.");
            setStatusType("err");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cart-page">
            <nav className="navbar">
                <div className="navbar-logo">CAKEFACTORY</div>
                <div className="navbar-menu">
                    <a href="/">Home</a>
                    <a href="/menu">Menu</a>
                    <a href="/cakes">Cakes</a>
                    <a href="/desserts">Pastries</a>
                    <a href="/account">Account</a>
                    <a href="/custom-cake">Custom cake</a>
                </div>
                <div className="navbar-cart">
                    <span>Cart ({items.length})</span>
                    &nbsp;·&nbsp; Admin · <a href="/admin">open</a>
                </div>
            </nav>

            <div className="page">
                <div className="layout">
                    {/* Левая карточка: список товаров */}
                    <section className="card">
                        <h1>Корзина</h1>
                        <p>Проверьте состав заказа перед оформлением.</p>

                        <div className="cart-items">
                            {!items.length && (
                                <p
                                    style={{
                                        color: "#9b7c90",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    Ваша корзина пуста.
                                </p>
                            )}

                            {items.map((item) => {
                                const lineTotal =
                                    (item.price || 0) * (item.quantity || 0);
                                const hasImage =
                                    item.imageUrl &&
                                    item.imageUrl.toString().trim().length > 0;

                                return (
                                    <div className="cart-item" key={item.id}>
                                        <div className="cart-item-image">
                                            {hasImage && (
                                                <img
                                                    src={`${IMAGE_BASE}${item.imageUrl}`}
                                                    alt={item.name}
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <div className="cart-item-name">
                                                {item.name}
                                            </div>
                                            <div className="cart-item-meta">
                                                {item.category || ""}
                                            </div>
                                            <button
                                                className="cart-remove"
                                                onClick={() => handleRemove(item.id)}
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                        <div className="cart-item-qty">
                                            <div>{lineTotal.toFixed(2)} MDL</div>
                                            <div className="cart-qty-controls">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDec(item.id)}
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleInc(item.id)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="cart-summary">
                            <span className="label">Итого:</span>{" "}
                            <span className="value">
                                {total.toFixed(2)} MDL
                            </span>
                        </div>
                    </section>

                    {/* Правая карточка: оформление заказа */}
                    <section className="card">
                        <h2>Оформление заказа</h2>
                        <p>
                            Выберите время самовывоза и добавьте комментарий
                            для кондитера.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <label htmlFor="pickupTime">
                                Время самовывоза
                            </label>
                            <input
                                type="datetime-local"
                                id="pickupTime"
                                value={pickupTime}
                                onChange={(e) =>
                                    setPickupTime(e.target.value)
                                }
                                required
                            />

                            <label htmlFor="comment">Комментарий</label>
                            <textarea
                                id="comment"
                                placeholder="Например: без орехов, надпись на торте, цвет свечей..."
                                value={comment}
                                onChange={(e) =>
                                    setComment(e.target.value)
                                }
                            />

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading
                                    ? "Оформляем..."
                                    : "Оформить заказ"}
                            </button>

                            {status && (
                                <div
                                    className={
                                        "status-msg " +
                                        (statusType === "ok"
                                            ? "ok"
                                            : statusType === "err"
                                                ? "err"
                                                : "")
                                    }
                                >
                                    {status}
                                </div>
                            )}
                        </form>
                    </section>
                </div>

                <div className="footer-mini">
                    © {new Date().getFullYear()} CakeFactory · Cart &
                    Checkout
                </div>
            </div>
        </div>
    );
};

export default CartPage;
