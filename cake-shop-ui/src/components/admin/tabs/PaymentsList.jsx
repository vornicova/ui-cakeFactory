import React from "react";

const PaymentsList = ({ payments, loading, error, onConfirm, onRefund }) => {

    if (loading) return <div>Loading payments...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <table className="admin-table">

            <thead>
            <tr>
                <th>ID</th>
                <th>Order</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
            </thead>

            <tbody>
            {payments.map(payment => (
                <tr key={payment.id}>

                    <td>{payment.id}</td>
                    <td>{payment.orderId}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.currency}</td>
                    <td>{payment.status}</td>

                    <td>

                        <button
                            onClick={() => onConfirm(payment.id)}
                            className="btn-success"
                        >
                            Confirm
                        </button>

                        <button
                            onClick={() => onRefund(payment.id)}
                            className="btn-danger"
                        >
                            Refund
                        </button>

                    </td>

                </tr>
            ))}
            </tbody>

        </table>
    );
};

export default PaymentsList;