import React from "react";

const ProductsList = ({ products, loading, error, onDelete }) => {

    if (loading) return <div>Loading products...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <table className="admin-table">

            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Active</th>
                <th>Actions</th>
            </tr>
            </thead>

            <tbody>
            {products.map(product => (
                <tr key={product.id}>

                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.price}</td>
                    <td>{product.active ? "Yes" : "No"}</td>

                    <td>
                        <button
                            onClick={() => onDelete(product.id)}
                            className="btn-danger"
                        >
                            Delete
                        </button>
                    </td>

                </tr>
            ))}
            </tbody>

        </table>
    );
};

export default ProductsList;