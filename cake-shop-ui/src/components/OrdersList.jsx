import React, { useState } from "react";
import { shortDateTime } from "../utils/dateUtils";
import { statusClass } from "../utils/statusUtils";
import "../styles/orderList.css";

const IMAGE_BASE = "http://localhost:8081";

const OrdersList = ({ orders, loading, error }) => {
    const [openedOrderId, setOpenedOrderId] = useState(null);

    const toggleOrder = (orderId) => {
        setOpenedOrderId((prev) => (prev === orderId ? null : orderId));
    };

    if (loading) return <div className="status-msg">Загружаем заказы...</div>;
    if (error) return <div className="status-msg err">{error}</div>;
    if (!orders.length) return <div className="small">У вас пока нет заказов.</div>;

    return (
        <div className="orders-list">
            {orders.map((o) => {
                const isOpened = openedOrderId === o.id;
                const items = o.items || o.orderItems || [];
                const deliveryMethod = o.deliveryMethod || "PICKUP";

                return (
                    <div key={o.id} className="order-card">
                        <div className="order-header">
                            <div className="order-title-wrap">
                                <div className="order-title">Заказ #{o.id}</div>
                                <div className="order-date small">
                                    Создан: {shortDateTime(o.createdAt)}
                                </div>
                            </div>

                            <span className={statusClass(o.status)}>{o.status}</span>
                        </div>

                        <div className="order-info-grid">
                            <div className="order-info-item">
                                <span className="order-info-label">Способ получения</span>
                                <span className="order-info-value">
                                    {deliveryMethod === "DELIVERY" ? "Доставка" : "Самовывоз"}
                                </span>
                            </div>

                            {deliveryMethod === "DELIVERY" && (
                                <div className="order-info-item">
                                    <span className="order-info-label">Адрес доставки</span>
                                    <span className="order-info-value">
                                        {o.deliveryAddress || "—"}
                                    </span>
                                </div>
                            )}

                            {deliveryMethod === "PICKUP" && (
                                <div className="order-info-item">
                                    <span className="order-info-label">Время самовывоза</span>
                                    <span className="order-info-value">
                                        {o.pickupTime ? shortDateTime(o.pickupTime) : "—"}
                                    </span>
                                </div>
                            )}

                            <div className="order-info-item">
                                <span className="order-info-label">Получатель</span>
                                <span className="order-info-value">{o.customerName || "—"}</span>
                            </div>

                            <div className="order-info-item">
                                <span className="order-info-label">Телефон</span>
                                <span className="order-info-value">{o.customerPhone || "—"}</span>
                            </div>

                            <div className="order-info-item">
                                <span className="order-info-label">Сумма</span>
                                <span className="order-info-value order-price">
                                    {o.totalPrice ?? o.totalAmount ?? 0} MDL
                                </span>
                            </div>
                        </div>

                        {o.comment && (
                            <div className="order-comment-box">
                                <span className="order-info-label">Комментарий</span>
                                <div className="order-comment-text">{o.comment}</div>
                            </div>
                        )}

                        <button
                            type="button"
                            className="order-toggle-btn"
                            onClick={() => toggleOrder(o.id)}
                        >
                            {isOpened ? "Скрыть товары" : "Что входит в заказ"}
                        </button>

                        {isOpened && (
                            <div className="order-items">
                                <div className="order-items-title">Что входит в заказ</div>

                                {!items.length ? (
                                    <div className="small">
                                        Информация о товарах в заказе недоступна.
                                    </div>
                                ) : (
                                    items.map((item, index) => {
                                        const name =
                                            item.productName ||
                                            item.name ||
                                            item.cakeName ||
                                            item.title ||
                                            "Товар";

                                        const quantity = item.quantity ?? 1;
                                        const price = item.unitPrice ?? item.price ?? 0;
                                        const total = item.linePrice ?? quantity * price;

                                        const rawImage =
                                            item.imageUrl ||
                                            item.productImage ||
                                            item.image ||
                                            item.photoUrl ||
                                            null;

                                        const imageUrl =
                                            rawImage && String(rawImage).trim()
                                                ? String(rawImage).startsWith("http")
                                                    ? rawImage
                                                    : `${IMAGE_BASE}${rawImage}`
                                                : null;

                                        return (
                                            <div
                                                key={item.id ?? `${o.id}-${index}`}
                                                className="order-item"
                                            >
                                                <div className="order-item-left">
                                                    <div className="order-item-image">
                                                        {imageUrl ? (
                                                            <img src={imageUrl} alt={name} />
                                                        ) : (
                                                            <div className="order-item-placeholder">
                                                                Нет фото
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="order-item-info">
                                                        <div className="order-item-name">{name}</div>
                                                        <div className="order-item-meta">
                                                            Количество: {quantity}
                                                        </div>
                                                        <div className="order-item-meta">
                                                            Цена за единицу: {price} MDL
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="order-item-total">
                                                    {total} MDL
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default OrdersList;