import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "/api";
const ORDERS_URL = API_BASE + "/orders";
const PAYMENTS_URL = API_BASE + "/payments";
const IMAGE_BASE = "http://localhost:8081";

const CartPage = () => {
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [pickupTime, setPickupTime] = useState("");
    const [comment, setComment] = useState("");
    const [status, setStatus] = useState("");
    const [statusType, setStatusType] = useState(""); // ok | err | ""
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("cartItems");
            setItems(raw ? JSON.parse(raw) : []);
        } catch (e) {
            console.error("Ошибка чтения cartItems из localStorage", e);
            setItems([]);
        }
    }, []);

    const total = useMemo(() => {
        return items.reduce(
            (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
            0
        );
    }, [items]);

    const itemsCount = useMemo(() => {
        return items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
    }, [items]);

    const persistItems = (newItems) => {
        setItems(newItems);
        localStorage.setItem("cartItems", JSON.stringify(newItems));
        window.dispatchEvent(new Event("cart:updated")); // ✅ синхронизация Navbar
    };

    const handleInc = (id) => {
        const updated = items.map((it) =>
            String(it.id) === String(id)
                ? { ...it, quantity: (Number(it.quantity) || 0) + 1 }
                : it
        );
        persistItems(updated);
    };

    const handleDec = (id) => {
        const updated = items
            .map((it) =>
                String(it.id) === String(id)
                    ? { ...it, quantity: (Number(it.quantity) || 0) - 1 }
                    : it
            )
            .filter((it) => (Number(it.quantity) || 0) > 0);

        persistItems(updated);
    };

    const handleRemove = (id) => {
        const updated = items.filter((it) => String(it.id) !== String(id));
        persistItems(updated);
    };

    const resetStatus = () => {
        setStatus("");
        setStatusType("");
    };

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
            setTimeout(() => navigate("/account"), 600);
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

        setLoading(true);

        try {
            // 1) create order
            const orderResp = await fetch(ORDERS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!orderResp.ok) {
                throw new Error(`Ошибка оформления заказа (${orderResp.status})`);
            }

            const order = await orderResp.json();

            // 2) create payment (best-effort)
            const paymentPayload = {
                orderId: order.id,
                amount: total,
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
                    throw new Error(`Ошибка при создании платежа (${payResp.status})`);
                }

                const payment = await payResp.json();
                paymentStatusText = ` Платёж #${payment.id} · статус: ${payment.status || "создан"}.`;
            } catch (payErr) {
                console.error(payErr);
                paymentStatusText =
                    " Платёж пока не создан — попробуйте оплатить позже в личном кабинете.";
            }

            // clear cart
            persistItems([]);
            setPickupTime("");
            setComment("");

            setStatus(`Заказ #${order.id} успешно создан!` + paymentStatusText);
            setStatusType("ok");

            setTimeout(() => navigate("/account"), 1200);
        } catch (err) {
            console.error(err);
            setStatus(err?.message || "Не удалось оформить заказ.");
            setStatusType("err");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="layout">
            {/* Left: cart items */}
            <section className="card">
                <div className="card-title">
                    <h1>Корзина</h1>
                    <span className="small">{itemsCount ? `${itemsCount} шт.` : "пуста"}</span>
                </div>

                <p className="small" style={{ marginTop: 6 }}>
                    Проверьте состав заказа перед оформлением.
                </p>

                <div className="cart-items" style={{ marginTop: 12 }}>
                    {!items.length && (
                        <p style={{ color: "#9b7c90", fontSize: "0.9rem" }}>
                            Ваша корзина пуста.
                        </p>
                    )}

                    {items.map((item) => {
                        const lineTotal =
                            (Number(item.price) || 0) * (Number(item.quantity) || 0);

                        const imgUrl =
                            item.imageUrl && String(item.imageUrl).trim()
                                ? (String(item.imageUrl).startsWith("http")
                                    ? item.imageUrl
                                    : `${IMAGE_BASE}${item.imageUrl}`)
                                : null;

                        return (
                            <div className="cart-item" key={item.id}>
                                <div className="cart-item-image">
                                    {imgUrl ? <img src={imgUrl} alt={item.name} /> : null}
                                </div>

                                <div>
                                    <div className="cart-item-name">{item.name}</div>
                                    <div className="cart-item-meta">{item.category || ""}</div>

                                    <button
                                        type="button"
                                        className="cart-remove"
                                        onClick={() => handleRemove(item.id)}
                                    >
                                        Удалить
                                    </button>
                                </div>

                                <div className="cart-item-qty">
                                    <div>{lineTotal.toFixed(2)} MDL</div>

                                    <div className="cart-qty-controls">
                                        <button type="button" onClick={() => handleDec(item.id)}>
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button type="button" onClick={() => handleInc(item.id)}>
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="cart-summary" style={{ marginTop: 12 }}>
                    <span className="label">Итого:</span>{" "}
                    <span className="value">{total.toFixed(2)} MDL</span>
                </div>
            </section>

            {/* Right: checkout */}
            <section className="card">
                <h2>Оформление заказа</h2>
                <p className="small">
                    Выберите время самовывоза и добавьте комментарий для кондитера.
                </p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="pickupTime">Время самовывоза</label>
                    <input
                        type="datetime-local"
                        id="pickupTime"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        required
                    />

                    <label htmlFor="comment">Комментарий</label>
                    <textarea
                        id="comment"
                        placeholder="Например: без орехов, надпись на торте, цвет свечей..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Оформляем..." : "Оформить заказ"}
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
                            style={{ marginTop: 10 }}
                        >
                            {status}
                        </div>
                    )}
                </form>
            </section>
        </div>
    );
};

export default CartPage;