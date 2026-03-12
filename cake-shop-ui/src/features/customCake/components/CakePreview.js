import React, { useMemo } from "react";
import { getImageSrc } from "../utils/image";
import { buildSummaryLines } from "../utils/pricing";

function getShapeClass(shape) {
    if (shape === "Сердце") return "shape-heart";
    if (shape === "Куб" || shape === "Квадратный") return "shape-square";
    return "shape-round";
}

function getDecorClass(decor) {
    const value = String(decor || "").toLowerCase();

    if (value.includes("ягод")) return "decor-berry";
    if (value.includes("празд")) return "decor-party";
    if (value.includes("миним")) return "decor-minimal";
    return "decor-classic";
}

function getDesignPreviewSrc(activeDesignSource, imageBase) {
    if (!activeDesignSource?.imageUrl) return null;

    if (activeDesignSource.type === "catalog") {
        return getImageSrc(activeDesignSource.imageUrl, imageBase);
    }

    return activeDesignSource.imageUrl;
}

export function CakePreview({
                                shape,
                                size,
                                layers,
                                servings,
                                weightKg,
                                decor,
                                flavour,
                                estimatedPrice,
                                imageBase,
                                activeDesignSource,
                            }) {
    const flavourSrc = useMemo(
        () => getImageSrc(flavour?.imageUrl, imageBase),
        [flavour?.imageUrl, imageBase]
    );

    const designPreviewSrc = useMemo(
        () => getDesignPreviewSrc(activeDesignSource, imageBase),
        [activeDesignSource, imageBase]
    );

    const summaryLines = useMemo(
        () =>
            buildSummaryLines({
                shape,
                size,
                layers,
                servings,
                weightKg,
                flavourName: flavour?.name,
            }),
        [shape, size, layers, servings, weightKg, flavour?.name]
    );

    const layerCount = Math.max(1, Number(layers) || 1);
    const shapeClass = getShapeClass(shape);
    const decorClass = getDecorClass(decor);

    const designSourceLabel =
        activeDesignSource?.type === "ai"
            ? "AI дизайн"
            : activeDesignSource?.type === "upload"
                ? "Ваш референс"
                : activeDesignSource?.type === "catalog"
                    ? "Дизайн из каталога"
                    : "Базовый preview";

    return (
        <aside className="card cake-preview-card">
            <div className="cake-preview-top">
                <div>
                    <h2>Предпросмотр торта</h2>
                    <p>Так может выглядеть ваш кастомный заказ.</p>
                </div>

                <span className="preview-source-badge">{designSourceLabel}</span>
            </div>

            <div className="cake-preview-stage">
                <div className={`cake-visual-live ${shapeClass} ${decorClass}`}>
                    <div className="cake-glow" />

                    <div className="cake-stack">
                        {Array.from({ length: layerCount }).map((_, index) => (
                            <div
                                key={index}
                                className="cake-layer-live"
                                style={{
                                    bottom: `${index * 34}px`,
                                    zIndex: index + 1,
                                    width: `${188 - index * 10}px`,
                                }}
                            />
                        ))}

                        {designPreviewSrc && (
                            <div className="cake-design-overlay-wrap">
                                <img
                                    src={designPreviewSrc}
                                    alt={activeDesignSource?.name || "Cake design"}
                                    className="cake-design-overlay"
                                />
                            </div>
                        )}

                        {!designPreviewSrc && flavourSrc && (
                            <div className="cake-flavour-overlay-wrap">
                                <img
                                    src={flavourSrc}
                                    alt={flavour?.name || "Cake flavour"}
                                    className="cake-flavour-overlay"
                                />
                            </div>
                        )}
                    </div>

                    <div className="cake-base-shadow" />
                    <div className="preview-badge-live">{shape} · CUSTOM</div>
                </div>
            </div>

            <div className="preview-info-grid">
                <div className="preview-info-card">
                    <span className="label">Форма</span>
                    <strong>{shape}</strong>
                </div>

                <div className="preview-info-card">
                    <span className="label">Размер</span>
                    <strong>{size} см</strong>
                </div>

                <div className="preview-info-card">
                    <span className="label">Слои</span>
                    <strong>{layers}</strong>
                </div>

                <div className="preview-info-card">
                    <span className="label">Вес</span>
                    <strong>~{weightKg} кг</strong>
                </div>

                <div className="preview-info-card">
                    <span className="label">Порции</span>
                    <strong>{servings}</strong>
                </div>

                <div className="preview-info-card">
                    <span className="label">Декор</span>
                    <strong>{decor}</strong>
                </div>
            </div>

            <div className="preview-feature-box">
                <div className="preview-feature-row">
                    <span className="label">Вкус</span>
                    <div>{flavour?.name || "—"}</div>
                </div>

                <div className="preview-feature-row">
                    <span className="label">Источник дизайна</span>
                    <div>{designSourceLabel}</div>
                </div>

                {activeDesignSource?.name && (
                    <div className="preview-feature-row">
                        <span className="label">Название дизайна</span>
                        <div>{activeDesignSource.name}</div>
                    </div>
                )}

                {activeDesignSource?.code && (
                    <div className="preview-feature-row">
                        <span className="label">Код дизайна</span>
                        <div>{activeDesignSource.code}</div>
                    </div>
                )}
            </div>

            <div className="price-box preview-price-box">
                <div className="preview-price-label">Примерная цена</div>
                <div className="price-main">
                    {estimatedPrice ? `${estimatedPrice} MDL` : "— MDL"}
                </div>
                <div className="note">
                    Финальная стоимость уточняется после подтверждения заказа.
                </div>
            </div>

            <ul className="summary-list preview-summary-list">
                {summaryLines.map((line, idx) => (
                    <li key={idx}>{line}</li>
                ))}
            </ul>
        </aside>
    );
}