import React from "react";

const CustomersList = ({ customers, loading, error }) => {

    if (loading) return <div>Loading customers...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <table className="admin-table">

            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
            </tr>
            </thead>

            <tbody>
            {customers.map(customer => (
                <tr key={customer.id}>

                    <td>{customer.id}</td>
                    <td>{customer.fullName}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>

                </tr>
            ))}
            </tbody>

        </table>
    );
};

export default CustomersList;