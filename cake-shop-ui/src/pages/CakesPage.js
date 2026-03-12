import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "/api";
const CAKE_DESIGNS_URL = API_BASE + "/cake-designs";
const IMAGE_BASE = "http://localhost:8081";

const DESIGN_FILTERS = [
    { key: "ALL", label: "Все" },
    { key: "BIRTHDAY", label: "День рождения" },
    { key: "WEDDING", label: "Свадебные" },
    { key: "KIDS", label: "Детские" },
    { key: "MINIMAL", label: "Минималистичные" },
    { key: "FLORAL", label: "Цветочные" },
    { key: "HOLIDAY", label: "Праздничные" },
];

const CakesPage = () => {
    const navigate = useNavigate();

    const [designs, setDesigns] = useState([]);
    const [loadingDesigns, setLoadingDesigns] = useState(false);
    const [error, setError] = useState("");
    const [activeDesign, setActiveDesign] = useState("ALL");

    const getImageSrc = (item) => {
        if (!item?.imageUrl) return null;
        const url = String(item.imageUrl).trim();
        if (!url) return null;

        if (url.startsWith("http://") || url.startsWith("https://")) return url;
        return IMAGE_BASE + url;
    };

    useEffect(() => {
        const fetchCakeDesigns = async () => {
            setLoadingDesigns(true);
            setError("");

            try {
                const resp = await fetch(CAKE_DESIGNS_URL);
                if (!resp.ok) {
                    throw new Error(`Ошибка загрузки дизайнов (${resp.status})`);
                }

                const data = await resp.json();
                const list = Array.isArray(data) ? data : [];
                setDesigns(list);
            } catch (err) {
                console.error(err);
                setError(err?.message || "Не удалось загрузить каталог дизайнов.");
            } finally {
                setLoadingDesigns(false);
            }
        };

        fetchCakeDesigns();
    }, []);

    const filteredDesigns = useMemo(() => {
        if (activeDesign === "ALL") return designs;

        return designs.filter((item) => {
            const design = String(item.designCategory || "").toUpperCase();
            return design === activeDesign;
        });
    }, [designs, activeDesign]);

    const handleSelectDesign = (design) => {
        navigate("/custom-cake", {
            state: {
                selectedDesign: {
                    id: design.id,
                    code: design.code,
                    name: design.name,
                    description: design.description,
                    imageUrl: design.imageUrl,
                    designCategory: design.designCategory,
                    decorPrice: design.decorPrice,
                },
            },
        });
    };

    const getDesignLabel = (designCategory) => {
        const found = DESIGN_FILTERS.find(
            (item) => item.key === String(designCategory || "").toUpperCase()
        );
        return found ? found.label : "Без категории";
    };

    return (
        <section className="cakes-page">
            <div className="cakes-page-header">
                <h1>Каталог дизайнов тортов</h1>
                <p>Выберите дизайн и продолжите сборку торта в конструкторе.</p>
            </div>

            <div className="design-filters">
                {DESIGN_FILTERS.map((filter) => (
                    <button
                        key={filter.key}
                        type="button"
                        className={`design-filter-btn ${activeDesign === filter.key ? "active" : ""}`}
                        onClick={() => setActiveDesign(filter.key)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {error && (
                <div className="status-msg err" style={{ marginTop: 10 }}>
                    {error}
                </div>
            )}

            <div className="products-grid" style={{ marginTop: 16 }}>
                {loadingDesigns && (
                    <div style={{ fontSize: "0.9rem", color: "#9b7c90" }}>
                        Загружаем дизайны тортов...
                    </div>
                )}

                {!loadingDesigns && !filteredDesigns.length && !error && (
                    <div style={{ fontSize: "0.9rem", color: "#9b7c90" }}>
                        В этой категории пока нет доступных дизайнов.
                    </div>
                )}

                {!loadingDesigns &&
                    filteredDesigns.map((item) => {
                        const price = item.decorPrice ?? 0;
                        const imgSrc = getImageSrc(item);

                        return (
                            <div className="product-card" key={item.id}>
                                <div className="product-card-image">
                                    {imgSrc ? <img src={imgSrc} alt={item.name} /> : null}
                                </div>

                                <div className="product-card-body">
                                    {item.designCategory ? (
                                        <div className="product-design-badge">
                                            {getDesignLabel(item.designCategory)}
                                        </div>
                                    ) : null}

                                    <h3>{item.name}</h3>

                                    {item.description ? (
                                        <p className="product-card-desc">{item.description}</p>
                                    ) : null}

                                    <div className="product-card-footer">
                                        <span className="product-price">
                                            +{" "}
                                            {typeof price === "number" && price.toFixed
                                                ? price.toFixed(2)
                                                : price}{" "}
                                            MDL
                                        </span>

                                        <button
                                            type="button"
                                            className="btn-primary product-add-btn"
                                            onClick={() => handleSelectDesign(item)}
                                        >
                                            Выбрать
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </section>
    );
};

export default CakesPage;