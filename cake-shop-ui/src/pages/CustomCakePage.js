// src/pages/CustomCakePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = "/api";
const IMAGE_BASE = "http://localhost:8081";

// Вкусы — оставляем относительные пути, а реальный src считаем в helper'е
const FLAVOURS = [
    {
        id: "pink-berry",
        name: "Pink Berry Mousse",
        label: "Шоколадный бисквит, ягодное конфи и розовый мусс.",
        imageUrl: "/images/products/pink-berry-mousse.jpg",
    },
    {
        id: "lavender-forest",
        name: "Lavender Forest",
        label: "Ванильный бисквит, сливочный крем и ягоды чёрной смородины.",
        imageUrl: "/images/products/lavender-berry-mousse.jpg",
    },
    {
        id: "caramel-crunch",
        name: "Caramel Crunch Cube",
        label: "Ванильный бисквит с шоколадной крошкой, солёная карамель и орехи.",
        imageUrl: "/images/products/caramel-crunch.jpg",
    },
    {
        id: "lemon-blueberry",
        name: "Lemon Blueberry Glow",
        label: "Лимонный курд, черничный мусс и ванильный бисквит.",
        imageUrl: "/images/products/lemon-blueberry.jpg",
    },
    {
        id: "strawberry-banana",
        name: "Strawberry Banana Dream",
        label: "Ванильный бисквит, банан и клубничное конфи.",
        imageUrl: "/images/products/strawberry-banana.jpg",
    },
    {
        id: "pistachio-noir",
        name: "Pistachio Noir",
        label: "Шоколадный бисквит и фисташковый мусс.",
        imageUrl: "/images/products/pistachio-choco.jpg",
    },
];

// helper для картинок вкусов (как на других страницах)
const getFlavourImageSrc = (imageUrl) => {
    if (!imageUrl) return null;
    const url = imageUrl.toString().trim();
    if (!url) return null;

    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }
    // относительный путь → считаем, что отдаёт catalog-service на 8081
    return IMAGE_BASE + url;
};

const CustomCakePage = () => {
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [customer, setCustomer] = useState(null);
    const [customProduct, setCustomProduct] = useState(null);

    // форма
    const [shape, setShape] = useState("Круглый");
    const [size, setSize] = useState("18");
    const [layers, setLayers] = useState("1");
    const [servings, setServings] = useState(12);
    const [weight, setWeight] = useState(2);
    const [selectedFlavourId, setSelectedFlavourId] = useState(
        FLAVOURS[0].id
    );
    const [decor, setDecor] = useState("Минималистичный");
    const [pickup, setPickup] = useState("");
    const [sweetness, setSweetness] = useState("умеренная");
    const [inscription, setInscription] = useState("");
    const [extraComment, setExtraComment] = useState("");

    // файл декора (только превью)
    const [decorPreview, setDecorPreview] = useState(null);
    const [decorFileName, setDecorFileName] = useState(null);

    // статус
    const [status, setStatus] = useState("");
    const [statusType, setStatusType] = useState(""); // ok | err | ""
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();

    // читаем корзину и пользователя
    useEffect(() => {
        try {
            const rawCart = localStorage.getItem("cartItems");
            if (rawCart) {
                const items = JSON.parse(rawCart);
                const count = items.reduce(
                    (sum, it) => sum + (it.quantity || 0),
                    0
                );
                setCartItemsCount(count);
            }
        } catch (e) {
            console.error("Ошибка чтения cartItems", e);
            setCartItemsCount(0);
        }

        try {
            const rawUser = localStorage.getItem("currentCustomer");
            if (rawUser) {
                setCustomer(JSON.parse(rawUser));
            }
        } catch (e) {
            console.error("Ошибка чтения currentCustomer", e);
            setCustomer(null);
        }
    }, []);

    // ищем продукт CUSTOM в /api/products
    useEffect(() => {
        const fetchCustomProduct = async () => {
            try {
                const resp = await fetch(`${API_BASE}/products`);
                if (!resp.ok) {
                    throw new Error("API error " + resp.status);
                }
                const data = await resp.json();
                const found =
                    (data || []).find(
                        (p) =>
                            (p.category &&
                                p.category.toUpperCase() === "CUSTOM") ||
                            (p.name &&
                                p.name.toLowerCase().includes("custom"))
                    ) || null;

                if (!found) {
                    setStatus(
                        'В каталоге не найден продукт категории CUSTOM. Создайте товар "Custom cake" через админку.'
                    );
                    setStatusType("err");
                }
                setCustomProduct(found);
            } catch (e) {
                console.error(e);
                setStatus("Ошибка загрузки продуктов для кастомного торта.");
                setStatusType("err");
            }
        };

        fetchCustomProduct();
    }, []);

    const currentFlavour = useMemo(
        () => FLAVOURS.find((f) => f.id === selectedFlavourId),
        [selectedFlavourId]
    );

    const parsedWeight = useMemo(() => {
        const w = Number(weight);
        return Number.isFinite(w) && w > 0 ? w : 2;
    }, [weight]);

    // расчёт примерной цены (1 кг = basePrice)
    const estimatedPrice = useMemo(() => {
        if (!customProduct) return null;
        const basePerKg = Number(
            (customProduct && (customProduct.basePrice ?? customProduct.price)) || 0
        );
        if (!basePerKg) return null;

        let price = basePerKg * parsedWeight;
        const layersNum = Number(layers) || 1;

        if (layersNum === 2) {
            price *= 1.25;
        } else if (layersNum === 3) {
            price *= 1.45;
        }

        if (decor === "Ягоды" || decor === "Цветы") {
            price += 120;
        } else if (decor === "Детский") {
            price += 160;
        }

        if (
            currentFlavour &&
            (currentFlavour.id === "pistachio-noir" ||
                currentFlavour.id === "caramel-crunch")
        ) {
            price *= 1.1;
        }

        return Math.round(price);
    }, [customProduct, parsedWeight, layers, decor, currentFlavour]);

    const summaryLines = useMemo(() => {
        const s = Number(servings) || 12;
        const l = Number(layers) || 1;

        return [
            `Форма: ${shape}`,
            `${size} см · ${l} ярус(а) · ${s} порций · ~${parsedWeight} кг`,
            `Вкус: ${currentFlavour ? currentFlavour.name : "—"}`,
        ];
    }, [shape, size, servings, layers, parsedWeight, currentFlavour]);

    const handleDecorFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setDecorFileName(null);
            setDecorPreview(null);
            return;
        }
        setDecorFileName(file.name);

        const reader = new FileReader();
        reader.onload = (ev) => {
            setDecorPreview({
                src: ev.target?.result,
                name: file.name,
            });
        };
        reader.readAsDataURL(file);
    };

    const buildComment = () => {
        const flavourText = currentFlavour
            ? `${currentFlavour.name}: ${currentFlavour.label}`
            : "—";

        const parts = [];

        parts.push(
            `Персональный торт: форма ${shape}, ${size} см, ${layers} ярус(а), ${servings} порций, ~${parsedWeight} кг.`
        );
        parts.push(`Вкус: ${flavourText}. Сладость: ${sweetness}.`);
        parts.push(`Декор: ${decor}.`);

        if (inscription && inscription.trim().length > 0) {
            parts.push(`Надпись: "${inscription.trim()}".`);
        }
        if (decorFileName) {
            parts.push(
                `Клиент загрузил файл-референс декора: ${decorFileName} (файл пока не сохраняется на сервере).`
            );
        }
        if (extraComment && extraComment.trim().length > 0) {
            parts.push(`Доп. пожелания: ${extraComment.trim()}.`);
        }

        return parts.join(" ");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("");
        setStatusType("");

        if (!customer) {
            setStatus(
                "Чтобы оформить персональный заказ, войдите в личный кабинет."
            );
            setStatusType("err");
            setTimeout(() => navigate("/account"), 1200);
            return;
        }

        if (!customProduct) {
            setStatus("Ошибка: в системе нет продукта категории CUSTOM.");
            setStatusType("err");
            return;
        }

        if (!pickup) {
            setStatus("Пожалуйста, выберите дату и время получения торта.");
            setStatusType("err");
            return;
        }

        const payload = {
            customerId: customer.id,
            pickupTime: pickup,
            comment: buildComment(),
            items: [
                {
                    productId: customProduct.id,
                    quantity: parsedWeight, // вес = quantity
                },
            ],
        };

        setSubmitting(true);
        try {
            const resp = await fetch(`${API_BASE}/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!resp.ok) {
                throw new Error("Order API error " + resp.status);
            }
            const data = await resp.json();
            setStatus(
                "Заявка на персональный торт создана! Номер заказа: #" + data.id
            );
            setStatusType("ok");
        } catch (err) {
            console.error(err);
            setStatus(
                "Не удалось создать заказ. Попробуйте ещё раз или обратитесь администратору."
            );
            setStatusType("err");
        } finally {
            setSubmitting(false);
        }
    };

    const year = new Date().getFullYear();

    // сегодняшняя дата для ограничения выбора времени (чтобы не выбрать прошлое)
    const minPickup = new Date().toISOString().slice(0, 16);

    return (
        <div className="cart-page">
            {/* NAVBAR */}
            <nav className="navbar">
                <div className="navbar-logo">CAKEFACTORY</div>
                <div className="navbar-menu">
                    <Link to="/">Home</Link>
                    <Link to="/menu">Menu</Link>
                    <Link to="/cakes">Cakes</Link>
                    <Link to="/desserts">Pastries</Link>
                    <Link to="/contacts">Contact</Link>
                    <Link to="/account">Account</Link>
                    <Link to="/custom-cake" className="active">
                        Custom cake
                    </Link>
                </div>
                <div className="navbar-cart">
                    <span
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/cart")}
                    >
                        Cart ({cartItemsCount})
                    </span>
                    &nbsp;·&nbsp; Admin · <Link to="/admin">open</Link>
                </div>
            </nav>

            <div className="page">
                <div className="page-title">
                    <h1>Создать персональный торт</h1>
                    <p>Выберите форму, вкус и декор. Создайте торт своей мечты!</p>
                </div>

                <div className="layout custom-layout">
                    {/* левая колонка: форма */}
                    <section className="card">
                        <h2>Параметры торта</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div>
                                    <label>Форма</label>
                                    <div className="inline-options">
                                        {["Круглый", "Куб", "Сердце"].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                className={
                                                    "chip" +
                                                    (shape === s ? " selected" : "")
                                                }
                                                onClick={() => setShape(s)}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="size">Диаметр, см</label>
                                    <select
                                        id="size"
                                        value={size}
                                        onChange={(e) => setSize(e.target.value)}
                                    >
                                        <option value="16">
                                            16 см (8–10 порций)
                                        </option>
                                        <option value="18">
                                            18 см (10–12 порций)
                                        </option>
                                        <option value="20">
                                            20 см (14–16 порций)
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="layers">Количество ярусов</label>
                                    <select
                                        id="layers"
                                        value={layers}
                                        onChange={(e) => setLayers(e.target.value)}
                                    >
                                        <option value="1">1 ярус</option>
                                        <option value="2">2 яруса</option>
                                        <option value="3">3 яруса</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="servings">Кол-во порций</label>
                                    <input
                                        id="servings"
                                        type="number"
                                        min="8"
                                        max="40"
                                        value={servings}
                                        onChange={(e) =>
                                            setServings(Number(e.target.value) || "")
                                        }
                                    />
                                </div>

                                <div className="form-row-full">
                                    <label htmlFor="weight">Вес торта, кг</label>
                                    <input
                                        id="weight"
                                        type="number"
                                        min="1"
                                        max="10"
                                        step="0.5"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                    />
                                    <div className="note">
                                        Для расчёта цены. Например: 2.0 кг ≈ 12–14 порций.
                                    </div>
                                </div>

                                {/* вкусы */}
                                <div className="form-row-full">
                                    <label>Вкус торта</label>
                                    <div className="flavour-grid">
                                        {FLAVOURS.map((f) => {
                                            const src = getFlavourImageSrc(f.imageUrl);
                                            return (
                                                <button
                                                    key={f.id}
                                                    type="button"
                                                    className={
                                                        "flavour-card" +
                                                        (selectedFlavourId === f.id
                                                            ? " selected"
                                                            : "")
                                                    }
                                                    onClick={() =>
                                                        setSelectedFlavourId(f.id)
                                                    }
                                                >
                                                    <div className="flavour-thumb">
                                                        {src ? (
                                                            <img src={src} alt={f.name} />
                                                        ) : (
                                                            <div className="product-image-placeholder" />
                                                        )}
                                                    </div>
                                                    <div className="flavour-title">
                                                        {f.name}
                                                    </div>
                                                    <div className="flavour-desc">
                                                        {f.label}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* декор */}
                                <div className="form-row-full">
                                    <label>Декор</label>
                                    <div className="inline-options">
                                        {[
                                            "Минималистичный",
                                            "Ягоды",
                                            "Цветы",
                                            "Детский",
                                        ].map((d) => (
                                            <button
                                                key={d}
                                                type="button"
                                                className={
                                                    "chip" +
                                                    (decor === d ? " selected" : "")
                                                }
                                                onClick={() => setDecor(d)}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-row-full">
                                    <label htmlFor="inscription">
                                        Надпись на торте (по желанию)
                                    </label>
                                    <input
                                        id="inscription"
                                        type="text"
                                        value={inscription}
                                        onChange={(e) =>
                                            setInscription(e.target.value)
                                        }
                                        placeholder="Например: С днём рождения, Лера!"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="pickup">
                                        Дата и время получения
                                    </label>
                                    <input
                                        id="pickup"
                                        type="datetime-local"
                                        min={minPickup}
                                        value={pickup}
                                        onChange={(e) => setPickup(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="sweetness">Сладость</label>
                                    <select
                                        id="sweetness"
                                        value={sweetness}
                                        onChange={(e) => setSweetness(e.target.value)}
                                    >
                                        <option value="умеренная">Умеренная</option>
                                        <option value="менее сладкий">
                                            Менее сладкий
                                        </option>
                                        <option value="по-сладче">
                                            По-сладче
                                        </option>
                                    </select>
                                </div>

                                <div className="form-row-full">
                                    <label htmlFor="comment">
                                        Дополнительные пожелания
                                    </label>
                                    <textarea
                                        id="comment"
                                        value={extraComment}
                                        onChange={(e) =>
                                            setExtraComment(e.target.value)
                                        }
                                        placeholder="Аллергии, ограничения, ссылки на референсы и другие детали."
                                    />
                                </div>

                                <div className="form-row-full">
                                    <label htmlFor="decorFile">
                                        Загрузить желаемый декор (референс)
                                    </label>
                                    <input
                                        id="decorFile"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleDecorFileChange}
                                    />
                                    {decorPreview && (
                                        <div className="decor-preview">
                                            <img
                                                src={decorPreview.src}
                                                alt="decor"
                                            />
                                            <span>{decorPreview.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div
                                style={{
                                    marginTop: 18,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 12,
                                    flexWrap: "wrap",
                                }}
                            >
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={submitting}
                                >
                                    {submitting
                                        ? "Отправляем..."
                                        : "Отправить запрос на торт"}
                                </button>
                                <div className="note">
                                    Заказ создаётся только для авторизованного
                                    пользователя. Если вы не вошли, будет предложено
                                    перейти на страницу аккаунта.
                                </div>
                            </div>

                            {status && (
                                <div
                                    className={
                                        "status " +
                                        (statusType === "ok"
                                            ? "ok"
                                            : statusType === "err"
                                                ? "err"
                                                : "")
                                    }
                                    style={{ marginTop: 8 }}
                                >
                                    {status}
                                </div>
                            )}
                        </form>
                    </section>

                    {/* правая колонка: превью */}
                    <aside className="card">
                        <div className="preview-header">
                            <h2>Предпросмотр торта</h2>
                        </div>

                        <div className="preview-main">
                            <div
                                className={
                                    "cake-visual " +
                                    (shape === "Куб"
                                        ? "shape-cube"
                                        : shape === "Сердце"
                                            ? "shape-heart"
                                            : "")
                                }
                            >
                                <div className="preview-badge">
                                    {shape} · CUSTOM
                                </div>
                                {currentFlavour && (
                                    (() => {
                                        const src = getFlavourImageSrc(
                                            currentFlavour.imageUrl
                                        );
                                        return src ? (
                                            <img
                                                src={src}
                                                alt={currentFlavour.name}
                                            />
                                        ) : (
                                            <div className="product-image-placeholder" />
                                        );
                                    })()
                                )}
                            </div>

                            <div className="preview-meta">
                                <div>
                                    <span className="label">Форма</span>
                                    <div>{shape}</div>
                                </div>
                                <div>
                                    <span className="label">Размер</span>
                                    <div>
                                        {size} см · {layers} ярус(а) · ~{parsedWeight} кг
                                    </div>
                                </div>
                                <div>
                                    <span className="label">Вкус</span>
                                    <div>
                                        {currentFlavour
                                            ? currentFlavour.name
                                            : "—"}
                                    </div>
                                </div>
                                <div>
                                    <span className="label">Декор</span>
                                    <div>{decor}</div>
                                </div>
                            </div>

                            <div className="price-box">
                                <div
                                    style={{
                                        fontSize: "0.8rem",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    Примерная цена
                                </div>
                                <div className="price-main">
                                    {estimatedPrice
                                        ? `${estimatedPrice} MDL`
                                        : "— MDL"}
                                </div>
                                <div className="note">
                                    Финальная стоимость уточняется после
                                    подтверждения заказа.
                                </div>
                            </div>

                            <ul className="summary-list">
                                {summaryLines.map((line, idx) => (
                                    <li key={idx}>{line}</li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>

                <div className="footer-mini">
                    © {year} CakeFactory · Custom cake
                </div>
            </div>
        </div>
    );
};

export default CustomCakePage;
