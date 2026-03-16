import React, {useEffect, useMemo, useState} from "react";

const DESIGN_CATEGORIES = [
    "WEDDING",
    "BIRTHDAY",
    "KIDS",
    "MINIMAL",
    "FLORAL",
    "HOLIDAY",
];

const emptyForm = {
    name: "",
    description: "",
    designCategory: "",
    isActive: true,
    imageFile: null,
};

const CakeDesignsList = ({
                             cakeDesigns,
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

    useEffect(() => {
        if (!form.imageFile) {
            setPreviewUrl("");
            return;
        }

        const objectUrl = URL.createObjectURL(form.imageFile);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [form.imageFile]);

    const sortedDesigns = useMemo(() => {
        return [...cakeDesigns].sort((a, b) => (b.id || 0) - (a.id || 0));
    }, [cakeDesigns]);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
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

    const handleEdit = (design) => {
        setEditingId(design.id);
        setForm({
            name: design.name || "",
            description: design.description || "",
            designCategory: design.designCategory || "",
            isActive: Boolean(design.isActive),
            imageFile: null,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            alert("Введите название дизайна");
            return;
        }

        if (!form.designCategory) {
            alert("Выберите категорию дизайна");
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
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h2>Cake designs management</h2>
                <p className="admin-section-subtitle">
                    Управление готовыми дизайнами тортов
                </p>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
                <div className="admin-form-grid">
                    <input
                        type="text"
                        name="name"
                        placeholder="Название дизайна"
                        value={form.name}
                        onChange={handleChange}
                    />

                    <select
                        name="designCategory"
                        value={form.designCategory}
                        onChange={handleChange}
                    >
                        <option value="">Выберите категорию дизайна</option>
                        {DESIGN_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
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
                        <span>Активный дизайн</span>
                    </label>
                </div>

                <textarea
                    name="description"
                    placeholder="Описание дизайна"
                    value={form.description}
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

                {previewUrl && (
                    <div className="admin-image-preview">
                        <img src={previewUrl} alt="Preview"/>
                    </div>
                )}

                <div className="admin-form-actions">
                    <button
                        type="submit"
                        className="admin-btn"
                        disabled={submitting}
                    >
                        {editingId ? "Обновить дизайн" : "Добавить дизайн"}
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

            {loading && <div className="admin-state">Загрузка дизайнов...</div>}
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
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedDesigns.map((design) => (
                            <tr key={design.id}>
                                <td>{design.id}</td>
                                <td>
                                    {design.imageUrl ? (
                                        <img
                                            src={design.imageUrl}
                                            alt={design.name}
                                            className="admin-product-thumb"
                                        />
                                    ) : (
                                        <span>—</span>
                                    )}
                                </td>
                                <td>{design.name}</td>
                                <td>{design.designCategory}</td>
                                <td>{design.isActive ? "Активен" : "Скрыт"}</td>
                                <td>
                                    <div className="admin-row-actions">
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn-light"
                                            onClick={() => handleEdit(design)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="admin-btn admin-btn-danger"
                                            onClick={() => onDelete(design.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {sortedDesigns.length === 0 && (
                            <tr>
                                <td colSpan="6">Дизайны пока отсутствуют</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CakeDesignsList;