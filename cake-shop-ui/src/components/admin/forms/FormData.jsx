import React, { useState } from "react";

const AddProductForm = () => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        composition: "",
        price: "",
        categoryCode: "",
    });

    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files?.[0] || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            data.append("name", form.name);
            data.append("description", form.description);
            data.append("composition", form.composition);
            data.append("price", form.price);
            data.append("categoryCode", form.categoryCode);

            if (imageFile) {
                data.append("image", imageFile);
            }

            const response = await fetch("/api/admin/products", {
                method: "POST",
                body: data,
            });

            if (!response.ok) {
                throw new Error("Failed to create product");
            }

            const result = await response.json();
            console.log("Created:", result);

            setForm({
                name: "",
                description: "",
                composition: "",
                price: "",
                categoryCode: "",
            });
            setImageFile(null);
        } catch (error) {
            console.error(error);
            alert("Не удалось создать продукт");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="name"
                placeholder="Название"
                value={form.name}
                onChange={handleChange}
            />

            <textarea
                name="description"
                placeholder="Описание"
                value={form.description}
                onChange={handleChange}
                rows={3}
            />

            <textarea
                name="composition"
                placeholder="Состав"
                value={form.composition}
                onChange={handleChange}
                rows={3}
            />

            <input
                name="price"
                type="number"
                step="0.01"
                placeholder="Цена"
                value={form.price}
                onChange={handleChange}
            />

            <input
                name="categoryCode"
                placeholder="Код категории"
                value={form.categoryCode}
                onChange={handleChange}
            />

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />

            <button type="submit">Добавить товар</button>
        </form>
    );
};

export default AddProductForm;