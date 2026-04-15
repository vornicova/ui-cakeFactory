import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../api/config";

const ORDERS_URL = API_ENDPOINTS.orders;
const PAYMENTS_URL = API_ENDPOINTS.payments;
const IMAGE_BASE = "http://localhost:8081";

function readJsonFromLocalStorage(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
        console.error(`Ошибка чтения ${key} из localStorage`, error);
        return fallback;
    }
}

function normalizeCartItem(item) {
    return {
        id: item.id ?? item.productId,
        productId: item.productId ?? item.id,
        productName: item.productName ?? item.name ?? "",
        unitPrice: Number(item.unitPrice ?? item.price ?? 0),
        quantity: Number(item.quantity ?? 0),
        imageUrl: item.imageUrl ?? null,
        category: item.category ?? "",
        type: item.type ?? "",
        customData: item.customData ?? null,
    };
}

const CartPage = () => {
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [deliveryMethod, setDeliveryMethod] = useState("PICKUP");
    const [pickupTime, setPickupTime] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [comment, setComment] = useState("");
    const [status, setStatus] = useState("");
    const [statusType, setStatusType] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const rawItems = readJsonFromLocalStorage("cartItems", []);
        setItems(Array.isArray(rawItems) ? rawItems.map(normalizeCartItem) : []);
    }, []);

    const total = useMemo(() => {
        return items.reduce((sum, item) => {
            return sum + item.unitPrice * item.quantity;
        }, 0);
    }, [items]);

    const itemsCount = useMemo(() => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    }, [items]);

    const persistItems = (newItems) => {
        const normalized = newItems.map(normalizeCartItem);
        setItems(normalized);
        localStorage.setItem("cartItems", JSON.stringify(normalized));
        window.dispatchEvent(new Event("cart:updated"));
        window.dispatchEvent(new Event("cart-updated"));
    };

    const handleInc = (productId) => {
        const updated = items.map((item) =>
            String(item.productId) === String(productId)
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );
        persistItems(updated);
    };

    const handleDec = (productId) => {
        const updated = items
            .map((item) =>
                String(item.productId) === String(productId)
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
            .filter((item) => item.quantity > 0);

        persistItems(updated);
    };

    const handleRemove = (productId) => {
        const updated = items.filter(
            (item) => String(item.productId) !== String(productId)
        );
        persistItems(updated);
    };

    const resetStatus = () => {
        setStatus("");
        setStatusType("");
    };

    const buildOrderPayload = (customer) => ({
        userId: customer.id,
        deliveryMethod,
        deliveryAddress:
            deliveryMethod === "DELIVERY" ? deliveryAddress.trim() : null,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        pickupTime:
            deliveryMethod === "PICKUP" && pickupTime
                ? `${pickupTime}:00`
                : null,
        comment: comment.trim(),
        items: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            imageUrl: item.imageUrl,
        })),
    });

    const validateCheckout = () => {
        if (!items.length) {
            setStatus("Корзина пуста.");
            setStatusType("err");
            return false;
        }

        if (!customerName.trim()) {
            setStatus("Введите имя получателя.");
            setStatusType("err");
            return false;
        }

        if (!customerPhone.trim()) {
            setStatus("Введите номер телефона.");
            setStatusType("err");
            return false;
        }

        if (deliveryMethod === "PICKUP" && !pickupTime) {
            setStatus("Выберите время самовывоза.");
            setStatusType("err");
            return false;
        }

        if (deliveryMethod === "DELIVERY" && !deliveryAddress.trim()) {
            setStatus("Введите адрес доставки.");
            setStatusType("err");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        resetStatus();

        const customer = readJsonFromLocalStorage("currentUserProfile", null);

        if (!customer?.id) {
            setStatus("Сначала войдите в аккаунт.");
            setStatusType("err");
            setTimeout(() => navigate("/account"), 600);
            return;
        }

        if (!validateCheckout()) {
            return;
        }

        const payload = buildOrderPayload(customer);
        console.log("order payload", JSON.stringify(payload, null, 2));

        setLoading(true);

        try {
            const orderResp = await fetch(ORDERS_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!orderResp.ok) {
                const errorText = await orderResp.text();
                throw new Error(
                    errorText || `Ошибка оформления заказа (${orderResp.status})`
                );
            }

            const order = await orderResp.json();

            const paymentPayload = {
                orderId: order.id,
                amount: total,
                paymentMethod: "CARD",
            };

            let paymentStatusText = "";

            try {
                const payResp = await fetch(PAYMENTS_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(paymentPayload),
                });

                if (!payResp.ok) {
                    throw new Error(`Ошибка при создании платежа (${payResp.status})`);
                }

                const payment = await payResp.json();
                paymentStatusText = ` Платёж #${payment.id} · статус: ${payment.status || "создан"}.`;
            } catch (paymentError) {
                console.error("Ошибка payment-service:", paymentError);
                paymentStatusText =
                    " Платёж пока не создан — попробуйте оплатить позже в личном кабинете.";
            }

            persistItems([]);
            setPickupTime("");
            setDeliveryAddress("");
            setCustomerName("");
            setCustomerPhone("");
            setComment("");

            setStatus(`Заказ #${order.id} успешно создан!${paymentStatusText}`);
            setStatusType("ok");
            window.dispatchEvent(new Event("orders-updated"));

            setTimeout(() => navigate("/account"), 1200);
        } catch (error) {
            console.error("Ошибка создания заказа:", error);
            setStatus(error.message || "Не удалось оформить заказ.");
            setStatusType("err");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="layout">
            <section className="card">
                <div className="card-title">
                    <h1>Корзина</h1>
                    <span className="small">
                        {itemsCount ? `${itemsCount} шт.` : "пуста"}
                    </span>
                </div>

                <p className="small" style={{ marginTop: 6 }}>
                    Проверьте товары перед оформлением заказа.
                </p>

                <div className="cart-items" style={{ marginTop: 12 }}>
                    {!items.length && (
                        <p style={{ color: "#9b7c90", fontSize: "0.9rem" }}>
                            Ваша корзина пуста.
                        </p>
                    )}

                    {items.map((item) => {
                        const lineTotal = item.unitPrice * item.quantity;

                        const imgUrl =
                            item.imageUrl && String(item.imageUrl).trim()
                                ? String(item.imageUrl).startsWith("http")
                                    ? item.imageUrl
                                    : `${IMAGE_BASE}${item.imageUrl}`
                                : null;

                        return (
                            <div className="cart-item" key={`${item.productId}-${item.id}`}>
                                <div className="cart-item-image">
                                    {imgUrl ? (
                                        <img src={imgUrl} alt={item.productName} />
                                    ) : null}
                                </div>

                                <div>
                                    <div className="cart-item-name">{item.productName}</div>
                                    <div className="cart-item-meta">
                                        {item.category || item.type || ""}
                                    </div>

                                    {item.customData && (
                                        <div
                                            className="cart-item-meta"
                                            style={{ marginTop: 6 }}
                                        >
                                            {item.customData.shape && (
                                                <div>Форма: {item.customData.shape}</div>
                                            )}
                                            {item.customData.flavourName && (
                                                <div>Вкус: {item.customData.flavourName}</div>
                                            )}
                                            {item.customData.weight && (
                                                <div>Вес: {item.customData.weight} кг</div>
                                            )}
                                            {item.customData.decor && (
                                                <div>Декор: {item.customData.decor}</div>
                                            )}
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        className="cart-remove"
                                        onClick={() => handleRemove(item.productId)}
                                    >
                                        Удалить
                                    </button>
                                </div>

                                <div className="cart-item-qty">
                                    <div>{lineTotal.toFixed(2)} MDL</div>

                                    <div className="cart-qty-controls">
                                        <button
                                            type="button"
                                            onClick={() => handleDec(item.productId)}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleInc(item.productId)}
                                        >
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

            <section className="card">
                <h2>Оформление заказа</h2>
                <p className="small">
                    Выберите способ получения и заполните данные покупателя.
                </p>

                <form onSubmit={handleSubmit}>
                    <label>Способ получения</label>
                    <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                        <label
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                marginBottom: 0,
                            }}
                        >
                            <input
                                type="radio"
                                name="deliveryMethod"
                                value="PICKUP"
                                checked={deliveryMethod === "PICKUP"}
                                onChange={(e) => setDeliveryMethod(e.target.value)}
                            />
                            Самовывоз
                        </label>

                        <label
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                marginBottom: 0,
                            }}
                        >
                            <input
                                type="radio"
                                name="deliveryMethod"
                                value="DELIVERY"
                                checked={deliveryMethod === "DELIVERY"}
                                onChange={(e) => setDeliveryMethod(e.target.value)}
                            />
                            Доставка
                        </label>
                    </div>

                    <label htmlFor="customerName">Имя получателя</label>
                    <input
                        type="text"
                        id="customerName"
                        placeholder="Введите имя"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />

                    <label htmlFor="customerPhone">Телефон</label>
                    <input
                        type="text"
                        id="customerPhone"
                        placeholder="Введите номер телефона"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                    />

                    {deliveryMethod === "PICKUP" && (
                        <>
                            <label htmlFor="pickupTime">Время самовывоза</label>
                            <input
                                type="datetime-local"
                                id="pickupTime"
                                value={pickupTime}
                                onChange={(e) => setPickupTime(e.target.value)}
                            />
                        </>
                    )}

                    {deliveryMethod === "DELIVERY" && (
                        <>
                            <label htmlFor="deliveryAddress">Адрес доставки</label>
                            <textarea
                                id="deliveryAddress"
                                placeholder="Например: Кишинёв, ул. Пушкина 10, подъезд 2, этаж 3"
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                            />
                        </>
                    )}

                    <label htmlFor="comment">Комментарий</label>
                    <textarea
                        id="comment"
                        placeholder="Например: без орехов, надпись на торте, позвонить перед доставкой..."
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