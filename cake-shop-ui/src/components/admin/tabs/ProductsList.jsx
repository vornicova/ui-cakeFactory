import React, {useEffect, useState} from "react";

const emptyForm = {
    name: "",
    description: "",
    composition: "",
    price: "",
    isActive: true,
    categoryCode: "",
    imageFile: null,
};

const ProductsList = ({
                          products,
                          categories,
                          loading,
                          error,
                          onCreate,
                          onUpdate,
                          onDelete,
                      }) => {
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [currentImageUrl, setCurrentImageUrl] = useState("");

    useEffect(() => {
        if (!form.imageFile) {
            setPreviewUrl("");
            return;
        }

        const objectUrl = URL.createObjectURL(form.imageFile);
        setPreviewUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [form.imageFile]);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setCurrentImageUrl("");
    };

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;

        setForm((prev) => ({
            ...prev,
            imageFile: file,
        }));
    };

    const handleEdit = (product) => {
        setEditingId(product.id);
        setCurrentImageUrl(product.imageUrl || "");

        setForm({
            name: product.name || "",
            description: product.description || "",
            composition: product.composition || "",
            price: product.price ?? "",
            isActive: Boolean(product.isActive),
            categoryCode: product.categoryCode || "",
            imageFile: null,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            alert("Введите название товара");
            return;
        }

        if (form.price === "" || form.price === null) {
            alert("Введите цену");
            return;
        }

        if (!form.categoryCode) {
            alert("Выберите категорию");
            return;
        }

        try {
            setSubmitting(true);

            if (editingId) {
                await onUpdate(editingId, form);
            } else {
                await onCreate(form);
            }

            resetForm();
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    const imageToShow = previewUrl || currentImageUrl;

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h2>Products management</h2>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
                <div className="admin-form-grid">
                    <input
                        type="text"
                        name="name"
                        placeholder="Название товара"
                        value={form.name}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="price"
                        step="0.01"
                        placeholder="Цена"
                        value={form.price}
                        onChange={handleChange}
                    />

                    <select
                        name="categoryCode"
                        value={form.categoryCode}
                        onChange={handleChange}
                    >
                        <option value="">Выберите категорию</option>
                        {categories.map((category) => (
                            <option
                                key={category.id || category.code}
                                value={category.code}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <label className="admin-checkbox">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={form.isActive}
                            onChange={handleChange}
                        />
                        <span>Активный товар</span>
                    </label>
                </div>

                <textarea
                    name="description"
                    placeholder="Описание товара"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                />
                <textarea
                    name="composition"
                    placeholder="Состав товара"
                    value={form.composition}
                    onChange={handleChange}
                    rows={4}
                />

                <div className="admin-file-row">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>

                {imageToShow && (
                    <div className="admin-image-preview">
                        <img src={imageToShow} alt="Preview"/>
                    </div>
                )}

                <div className="admin-form-actions">
                    <button type="submit" className="admin-btn" disabled={submitting}>
                        {editingId ? "Обновить товар" : "Добавить товар"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            className="admin-btn admin-btn-light"
                            onClick={resetForm}
                        >
                            Отмена
                        </button>
                    )}
                </div>
            </form>

            {loading && <div className="admin-state">Загрузка товаров...</div>}
            {error && <div className="admin-state admin-state-error">{error}</div>}

            {!loading && !error && (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Фото</th>
                            <th>Название</th>
                            <th>Категория</th>
                            <th>Цена</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="admin-product-thumb"
                                        />
                                    ) : (
                                        <span>—</span>
                                    )}
                                </td>
                                <td>{product.name}</td>
                                <td>{product.categoryName || product.categoryCode}</td>
                                <td>{product.price}</td>
                                <td>{product.isActive ? "Активен" : "Скрыт"}</td>
                                <td>
                                    <div className="admin-row-actions">
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn-light"
                                            onClick={() => handleEdit(product)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="admin-btn admin-btn-danger"
                                            onClick={() => onDelete(product.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {products.length === 0 && (
                            <tr>
                                <td colSpan="7">Товары пока отсутствуют</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductsList;