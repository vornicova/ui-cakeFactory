import React, { useState } from "react";

const emptyForm = {
    name: "",
    description: "",
    imageUrl: "",
    sortOrder: 0,
    active: true,
};

const CategoriesList = ({
                            categories,
                            loading,
                            error,
                            onCreate,
                            onUpdate,
                            onDelete,
                        }) => {
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            sortOrder: Number(form.sortOrder || 0),
        };

        if (editingId) {
            onUpdate(editingId, payload);
        } else {
            onCreate(payload);
        }

        resetForm();
    };

    const handleEdit = (category) => {
        setEditingId(category.id);
        setForm({
            name: category.name || "",
            description: category.description || "",
            imageUrl: category.imageUrl || "",
            sortOrder: category.sortOrder ?? 0,
            active: !!category.active,
        });
    };

    return (
        <div className="admin-section">
            <div className="admin-section-head">
                <div>
                    <h2>Categories</h2>
                    <p>Group products into a clean and manageable catalog.</p>
                </div>
            </div>

            <form className="admin-form-grid" onSubmit={handleSubmit}>
                <input
                    name="name"
                    placeholder="Category name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <input
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                />
                <input
                    name="imageUrl"
                    placeholder="Image URL"
                    value={form.imageUrl}
                    onChange={handleChange}
                />
                <input
                    name="sortOrder"
                    type="number"
                    placeholder="Sort order"
                    value={form.sortOrder}
                    onChange={handleChange}
                />

                <label className="admin-checkbox">
                    <input
                        name="active"
                        type="checkbox"
                        checked={form.active}
                        onChange={handleChange}
                    />
                    Active
                </label>

                <div className="admin-form-actions">
                    <button type="submit" className="admin-btn admin-btn-primary">
                        {editingId ? "Update category" : "Add category"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            className="admin-btn admin-btn-light"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {loading && <div className="admin-state">Loading categories...</div>}
            {error && <div className="admin-state admin-state-error">{error}</div>}

            {!loading && !error && (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Sort Order</th>
                            <th>Active</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>{category.description || "—"}</td>
                                <td>{category.sortOrder ?? 0}</td>
                                <td>
                                        <span className={`admin-badge ${category.active ? "ok" : "muted"}`}>
                                            {category.active ? "Yes" : "No"}
                                        </span>
                                </td>
                                <td>
                                    <div className="admin-actions">
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn-light"
                                            onClick={() => handleEdit(category)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn-danger"
                                            onClick={() => onDelete(category.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {categories.length === 0 && (
                            <tr>
                                <td colSpan="6" className="admin-empty-row">
                                    No categories yet.
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

export default CategoriesList;