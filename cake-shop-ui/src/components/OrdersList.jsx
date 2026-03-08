// src/components/OrdersList.jsx
import React from "react";
import { shortDateTime } from "../utils/dateUtils";
import { statusClass } from "../utils/statusUtils";

const OrdersList = ({ orders, loading, error }) => {
    if (loading) return <div className="status-msg">Загружаем заказы...</div>;
    if (error) return <div className="status-msg err">{error}</div>;
    if (!orders.length) return <div className="small">У вас пока нет заказов.</div>;

    return (
        <div className="orders-list">
            {orders.map((o) => (
                <div key={o.id} className="order-card">
                    <div className="order-header">
                        <div className="order-title">Заказ #{o.id}</div>
                        <span className={statusClass(o.status)}>{o.status}</span>
                    </div>
                    <div className="order-meta small">
                        <div>Создан: {shortDateTime(o.createdAt)}</div>
                        <div>Самовывоз: {shortDateTime(o.pickupTime) || "—"}</div>
                        <div>Сумма: {o.totalPrice ?? o.totalAmount ?? 0} MDL</div>
                    </div>
                    {o.comment && <div className="order-comment small">Комментарий: {o.comment}</div>}
                </div>
            ))}
        </div>
    );
};

export default OrdersList;