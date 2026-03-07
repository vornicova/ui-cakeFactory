import React from "react";

const NotificationsList = ({ notifications, loading, error }) => {
    if (loading) return <div>Loading notifications...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <table className="admin-table">
            <thead>
            <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Recipient</th>
                <th>Status</th>
                <th>Date</th>
            </tr>
            </thead>

            <tbody>
            {notifications.map(n => (
                <tr key={n.id}>
                    <td>{n.id}</td>
                    <td>{n.type}</td>
                    <td>{n.recipient}</td>
                    <td>{n.status}</td>
                    <td>{n.createdAt}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default NotificationsList;