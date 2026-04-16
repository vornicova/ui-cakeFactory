// src/pages/MenuPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles/menuFiltres.css";
import { PRODUCTS_URL, CATEGORIES_URL } from "../api/api";

const IMAGE_BASE = "http://localhost:8081";
const ALL_CATEGORY = "ALL";

const HIDDEN_CATEGORY_KEYS = ["CUSTOM"];
const HIDDEN_CATEGORY_LABELS = ["CUSTOM"];

const CATEGORY_LABELS = {
    CAKES: "ТОРТЫ",
    DESSERTS: "ДЕСЕРТЫ",
    MACARONS: "МАКАРОНС",
    CUPCAKES: "КАПКЕЙКИ",
};

const CATEGORY_KEY_BY_LABEL = {
    "CAKES": "CAKES",
    "DESSERTS": "DESSERTS",
    "MACARONS": "MACARONS",
    "CUPCAKES": "CUPCAKES",
    "ТОРТЫ": "CAKES",
    "ДЕСЕРТЫ": "DESSERTS",
    "МАКАРОНС": "MACARONS",
    "КАПКЕЙКИ": "CUPCAKES",
};

const normalizeString = (value) =>
    String(value || "")
        .trim()
        .replace(/\s+/g, " ")
        .toUpperCase();

const getCategoryKey = (item) => {
    const rawKey = normalizeString(
        item?.categoryCode || item?.category || item?.code
    );

    if (rawKey) return rawKey;

    const normalizedLabel = normalizeString(
        item?.categoryName || item?.categoryLabel || item?.name
    );

    return CATEGORY_KEY_BY_LABEL[normalizedLabel] || normalizedLabel;
};

const getCategoryDisplayValue = (item) =>
    String(
        item?.categoryName || item?.categoryLabel || item?.category || item?.name || ""
    ).trim();

const getCategoryDisplayNormalized = (item) =>
    normalizeString(
        item?.categoryName || item?.categoryLabel || item?.category || item?.name
    );

const shouldHideCategory = (item) => {
    const categoryKey = getCategoryKey(item);
    const categoryLabel = getCategoryDisplayNormalized(item);

    return (
        HIDDEN_CATEGORY_KEYS.includes(categoryKey) ||
        HIDDEN_CATEGORY_LABELS.includes(categoryLabel)
    );
};

const getCategoryLabel = (categoryKey, fallbackLabel = "") => {
    if (CATEGORY_LABELS[categoryKey]) return CATEGORY_LABELS[categoryKey];
    if (fallbackLabel) return fallbackLabel;
    return "Другое";
};

const getImageSrc = (product) => {
    if (!product?.imageUrl) return null;

    const url = String(product.imageUrl).trim();
    if (!url) return null;

    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    return `${IMAGE_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};

const normalizeProduct = (product) => {
    const categoryKey = getCategoryKey(product);
    const categoryLabelRaw = getCategoryDisplayValue(product);
    const rawPrice = product?.price ?? product?.basePrice ?? 0;
    const parsedPrice = Number(rawPrice);

    return {
        id: product?.id,
        name: String(product?.name || "Без названия").trim(),
        description: String(product?.description || "").trim(),
        composition: String(product?.composition || "").trim(),
        price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
        imageUrl: product?.imageUrl || "",
        categoryKey,
        categoryLabel: getCategoryLabel(categoryKey, categoryLabelRaw),
    };
};

const normalizeCategory = (category) => {
    const categoryKey = getCategoryKey(category);
    const categoryLabelRaw = getCategoryDisplayValue(category);

    return {
        value: categoryKey,
        label: getCategoryLabel(categoryKey, categoryLabelRaw),
    };
};

const getStoredCartItems = () => {
    try {
        const raw = localStorage.getItem("cartItems");
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Failed to read cartItems from localStorage:", error);
        return [];
    }
};

const saveCartItems = (items) => {
    localStorage.setItem("cartItems", JSON.stringify(items));
    window.dispatchEvent(new Event("cart:updated"));
};

const MenuPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([{ value: ALL_CATEGORY, label: "Все" }]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
    const [sortBy, setSortBy] = useState("default");
    const [activeProduct, setActiveProduct] = useState(null);

    const toastTimeoutRef = useRef(null);

    useEffect(() => {
        const fetchMenuData = async () => {
            setLoadingProducts(true);
            setError("");

            try {
                const [productsResponse, categoriesResponse] = await Promise.all([
                    fetch(PRODUCTS_URL),
                    fetch(CATEGORIES_URL),
                ]);

                if (!productsResponse.ok) {
                    throw new Error(`Ошибка загрузки продуктов (${productsResponse.status})`);
                }

                if (!categoriesResponse.ok) {
                    throw new Error(`Ошибка загрузки категорий (${categoriesResponse.status})`);
                }

                const productsData = await productsResponse.json();
                const categoriesData = await categoriesResponse.json();

                const safeProducts = Array.isArray(productsData) ? productsData : [];
                const safeCategories = Array.isArray(categoriesData) ? categoriesData : [];

                const normalizedProducts = safeProducts
                    .filter((product) => !shouldHideCategory(product))
                    .map(normalizeProduct)
                    .filter((product) => product.id != null);

                const normalizedCategories = safeCategories
                    .filter((category) => !shouldHideCategory(category))
                    .map(normalizeCategory)
                    .filter((category) => category.value);

                const uniqueCategories = Array.from(
                    new Map(
                        normalizedCategories.map((category) => [category.value, category])
                    ).values()
                );

                setProducts(normalizedProducts);
                setCategories([{ value: ALL_CATEGORY, label: "Все" }, ...uniqueCategories]);
            } catch (err) {
                console.error(err);
                setError(err?.message || "Не удалось загрузить меню.");
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchMenuData();

        return () => {
            if (toastTimeoutRef.current) {
                clearTimeout(toastTimeoutRef.current);
            }
        };
    }, []);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (selectedCategory !== ALL_CATEGORY) {
            result = result.filter((product) => product.categoryKey === selectedCategory);
        }

        switch (sortBy) {
            case "price-asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "name-asc":
                result.sort((a, b) => a.name.localeCompare(b.name, "ru"));
                break;
            default:
                break;
        }

        return result;
    }, [products, selectedCategory, sortBy]);

    const showToast = (message) => {
        setToast(message);

        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }

        toastTimeoutRef.current = setTimeout(() => {
            setToast("");
        }, 1400);
    };

    const handleAddToCart = (product) => {
        try {
            const items = getStoredCartItems();
            const existingIndex = items.findIndex(
                (item) => String(item.id) === String(product.id)
            );

            if (existingIndex === -1) {
                items.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    imageUrl: product.imageUrl,
                    category: product.categoryLabel,
                });
            } else {
                items[existingIndex].quantity =
                    Number(items[existingIndex].quantity || 0) + 1;
            }

            saveCartItems(items);
            showToast("Добавлено в корзину");
        } catch (error) {
            console.error(error);
            showToast("Не удалось добавить в корзину");
        }
    };

    return (
        <section className="card menu-page">
            <div className="menu-page-header">
                <h1 className="menu-page-title">Меню</h1>
                <p className="menu-page-subtitle">
                    Все десерты CakeFactory, доступные для заказа.
                </p>
            </div>

            {error && (
                <div className="status-msg err" style={{ marginTop: 12 }}>
                    {error}
                </div>
            )}

            {!loadingProducts && products.length > 0 && (
                <div className="menu-controls">
                    <div className="menu-categories">
                        {categories.map((category) => (
                            <button
                                key={category.value}
                                type="button"
                                className={`menu-category-btn ${
                                    selectedCategory === category.value ? "active" : ""
                                }`}
                                onClick={() => setSelectedCategory(category.value)}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>

                    <div className="menu-sort-box">
                        <label htmlFor="menu-sort-select" className="menu-sort-label">
                            Сортировка
                        </label>

                        <div className="menu-sort-select-wrap">
                            <select
                                id="menu-sort-select"
                                className="menu-sort-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="default">По умолчанию</option>
                                <option value="price-asc">Сначала дешевле</option>
                                <option value="price-desc">Сначала дороже</option>
                                <option value="name-asc">По названию</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div className="products-grid menu-products-grid">
                {loadingProducts && (
                    <div className="menu-empty-state">Загружаем продукты...</div>
                )}

                {!loadingProducts && !products.length && !error && (
                    <div className="menu-empty-state">Пока нет доступных позиций.</div>
                )}

                {!loadingProducts && products.length > 0 && filteredProducts.length === 0 && (
                    <div className="menu-empty-state">
                        В этой категории пока нет доступных позиций.
                    </div>
                )}

                {!loadingProducts &&
                    filteredProducts.map((product) => {
                        const imgSrc = getImageSrc(product);

                        return (
                            <article className="product-card" key={product.id}>
                                <div className="product-card-image">
                                    {imgSrc ? (
                                        <img src={imgSrc} alt={product.name} />
                                    ) : (
                                        <div className="product-card-image-placeholder">
                                            Нет изображения
                                        </div>
                                    )}
                                </div>

                                <div className="product-card-body">
                                    <h3>{product.name}</h3>

                                    <div className="product-card-category">
                                        {product.categoryLabel}
                                    </div>

                                    {product.description && (
                                        <div className="product-card-desc-wrap">
                                            <p className="product-card-desc">
                                                {product.description}
                                            </p>

                                            <button
                                                type="button"
                                                className="product-more-btn"
                                                onClick={() => setActiveProduct(product)}
                                            >
                                                Подробнее
                                            </button>
                                        </div>
                                    )}

                                    <div className="product-card-footer">
                                        <span className="product-price">
                                            {product.price.toFixed(2)} MDL
                                        </span>

                                        <button
                                            type="button"
                                            className="btn-primary product-add-btn"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            В корзину
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
            </div>

            {activeProduct && (
                <div
                    className="product-modal-overlay"
                    onClick={() => setActiveProduct(null)}
                >
                    <div
                        className="product-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="product-modal-close"
                            onClick={() => setActiveProduct(null)}
                        >

                            ×
                        </button>
                        {getImageSrc(activeProduct) && (
                            <div className="product-modal-image-wrap">
                                <img
                                    src={getImageSrc(activeProduct)}
                                    alt={activeProduct.name}
                                    className="product-modal-image"
                                />
                            </div>
                        )}

                        <h2>{activeProduct.name}</h2>

                        <div>
                            <b>Категория:</b> {activeProduct.categoryLabel}
                        </div>

                        <div style={{ marginTop: 10 }}>
                            <b>Описание:</b> {activeProduct.description}
                        </div>

                        {activeProduct.composition && (
                            <div style={{ marginTop: 10 }}>
                                <b>Состав:</b> {activeProduct.composition}
                            </div>
                        )}

                        <div className="product-modal-price">
                            {activeProduct.price.toFixed(2)} MDL
                        </div>
                    </div>
                </div>
            )}

            {toast && <div className="toast">{toast}</div>}
        </section>
    );
};

export default MenuPage;