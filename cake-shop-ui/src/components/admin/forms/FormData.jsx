import React, { useState } from "react";

const AddProductForm = () => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        categoryCode: ""
    });
    const [imageUrl, setImageUrl] = useState(null);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setImageUrl(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", form.name);
        data.append("description", form.description);
        data.append("price", form.price);
        data.append("categoryCode", form.categoryCode);

        if (imageUrl) {
            data.append("imageUrl", imageUrl);
        }

        const response = await fetch("/api/admin/products", {
            method: "POST",
            body: data
        });

        if (!response.ok) {
            throw new Error("Failed to create product");
        }

        const result = await response.json();
        console.log("Created:", result);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="name"
                placeholder="Название"
                value={form.name}
                onChange={handleChange}
            />

            <input
                name="description"
                placeholder="Описание"
                value={form.description}
                onChange={handleChange}
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
                type="number"
                placeholder="ID категории"
                value={form.categoryCode}
                onChange={handleChange}
            />

            <input
                type="file"
                accept="imageUrl/*"
                onChange={handleFileChange}
            />

            <button type="submit">Добавить товар</button>
        </form>
    );
};

export default AddProductForm;