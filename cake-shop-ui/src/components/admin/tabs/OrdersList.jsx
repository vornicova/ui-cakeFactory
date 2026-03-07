import React from "react";

const OrdersList = ({ orders, loading, error, onStatusChange }) => {
    if (loading) return <div>Loading orders...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <table className="admin-table">
            <thead>
            <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th>Change status</th>
            </tr>
            </thead>

            <tbody>
            {orders.map(order => (
                <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customerEmail}</td>
                    <td>{order.status}</td>
                    <td>{order.totalPrice}</td>

                    <td>
                        <select
                            value={order.status}
                            onChange={(e) =>
                                onStatusChange(order.id, e.target.value)
                            }
                        >
                            <option>NEW</option>
                            <option>IN_PROGRESS</option>
                            <option>READY</option>
                            <option>DELIVERED</option>
                            <option>CANCELLED</option>
                        </select>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default OrdersList;