// src/components/NotificationsList.jsx
import React from "react";

const NotificationsList = ({ notifs, loading, error }) => {
    if (loading) return <div className="status-msg">Загружаем уведомления...</div>;
    if (error) return <div className="status-msg err">{error}</div>;
    if (!notifs.length) return <div className="small">Новых уведомлений пока нет.</div>;

    return (
        <div className="notif-list">
            {notifs.map((n) => (
                <div key={n.id} className="notif-item">
                    <div className="notif-header">
                        <span className="badge">{n.type || "INFO"}</span>
                        {n.orderId && <span className="small">Заказ #{n.orderId}</span>}
                    </div>
                    <div className="notif-body">
                        <div className="notif-subject">{n.subject || "Уведомление"}</div>
                        <div className="notif-text small">{n.body}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationsList;