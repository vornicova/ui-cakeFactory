import React from "react";

const STATUSES = [
    "",
    "NEW",
    "IN_PROGRESS",
    "READY",
    "DELIVERED",
    "CANCELLED"
];

const OrdersList = ({
                        orders,
                        loading,
                        error,
                        filterStatus,
                        onFilterChange,
                        onStatusChange,
                    }) => {
    return (
        <div className="admin-section">
            <div className="admin-section-head">
                <div>
                    <h2>Orders</h2>
                    <p>Review orders and update production status.</p>
                </div>

                <select
                    className="admin-select"
                    value={filterStatus}
                    onChange={(e) => onFilterChange(e.target.value)}
                >
                    <option value="">All statuses</option>
                    {STATUSES.filter(Boolean).map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            {loading && <div className="admin-state">Loading orders...</div>}
            {error && <div className="admin-state admin-state-error">{error}</div>}

            {!loading && !error && (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>User ID</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Pickup</th>
                            <th>Comment</th>
                            <th>Items</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.userId}</td>
                                <td>
                                    <select
                                        className="admin-select"
                                        value={order.status}
                                        onChange={(e) =>
                                            onStatusChange(order.id, e.target.value)
                                        }
                                    >
                                        {STATUSES.filter(Boolean).map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>{order.totalPrice}</td>
                                <td>{order.pickupTime || "—"}</td>
                                <td>{order.comment || "—"}</td>
                                <td>
                                    <div className="admin-items-list">
                                        {order.items?.length ? (
                                            order.items.map((item, idx) => (
                                                <div key={idx}>
                                                    {item.productName} × {item.quantity}
                                                </div>
                                            ))
                                        ) : (
                                            <span>—</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="7" className="admin-empty-row">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrdersList;