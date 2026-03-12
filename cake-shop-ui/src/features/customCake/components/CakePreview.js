import React, { useMemo } from "react";
import { getImageSrc } from "../utils/image";
import { buildSummaryLines } from "../utils/pricing";
import { getCakePreviewIcon } from "../utils/cakePreviewIcon";

function getDesignSourceLabel(activeDesignSource) {
    if (activeDesignSource?.type === "ai") return "AI дизайн";
    if (activeDesignSource?.type === "upload") return "Ваш референс";
    if (activeDesignSource?.type === "catalog") return "Дизайн из каталога";
    return "Базовый preview";
}

export function CakePreview({
                                shape,
                                size,
                                layers,
                                servings,
                                weightKg,
                                flavour,
                                estimatedPrice,
                                imageBase,
                                activeDesignSource,
                            }) {
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

    const designSourceLabel = getDesignSourceLabel(activeDesignSource);
    const previewIcon = getCakePreviewIcon(shape, layers);

    const flavourSrc = useMemo(
        () => getImageSrc(flavour?.imageUrl, imageBase),
        [flavour?.imageUrl, imageBase]
    );

    const designPreviewSrc = useMemo(
        () => getImageSrc(activeDesignSource?.imageUrl, imageBase),
        [activeDesignSource?.imageUrl, imageBase]
    );

    return (
        <aside className="card cake-preview-card modern-preview">
            <div className="cake-preview-top">
                <div>
                    <h2>Предпросмотр торта</h2>
                    <p>Так может выглядеть ваш кастомный заказ.</p>
                </div>

                <span className="preview-source-badge">{designSourceLabel}</span>
            </div>

            <div className="cake-preview-stage preview-stage-image">
                <div className="preview-badge-live">{shape} · CUSTOM</div>

                <div className="cake-preview-photo-wrap">
                    {flavourSrc ? (
                        <div className="cake-preview-photo-box">
                            <img
                                src={flavourSrc}
                                className="cake-preview-photo"
                                alt={flavour?.name || "Cake flavour"}
                            />

                            <img
                                src={previewIcon}
                                className="cake-preview-shape-badge"
                                alt={`Иконка формы ${shape}`}
                            />
                        </div>
                    ) : (
                        <div className="cake-preview-photo-placeholder" />
                    )}
                </div>
            </div>

            {designPreviewSrc && (
                <div className="selected-design-preview-block">
                    <div className="selected-design-preview-head">
                        <div>
                            <span className="label">Выбранный референс</span>
                            <div className="selected-design-title">
                                {activeDesignSource?.name || "Дизайн из каталога"}
                            </div>
                        </div>

                        {activeDesignSource?.code && (
                            <span className="selected-design-code">
                    #{activeDesignSource.code}
                </span>
                        )}
                    </div>

                    <div className="selected-design-preview-image-wrap">
                        <img
                            src={designPreviewSrc}
                            alt={activeDesignSource?.name || "Выбранный дизайн"}
                            className="selected-design-preview-image"
                        />
                    </div>
                </div>
            )}

            <div className="preview-info-grid compact-grid">
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
                    <span className="label">Гости</span>
                    <strong>{servings}</strong>
                </div>

                <div className="preview-info-card">
                    <span className="label">Источник</span>
                    <strong>{designSourceLabel}</strong>
                </div>
            </div>

            <div className="preview-feature-box modern-feature-box">
                <div className="preview-feature-row">
                    <span className="label">Вкус</span>
                    <div className="flavour-name">{flavour?.name || "—"}</div>
                </div>

                {activeDesignSource?.name && (
                    <div className="preview-feature-row">
                        <span className="label">Выбранный дизайн</span>
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

            <div className="price-box preview-price-box premium-price-box">
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