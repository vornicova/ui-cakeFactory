import React, { useMemo } from "react";
import { getImageSrc } from "../utils/image";
import { buildSummaryLines } from "../utils/pricing";

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
                            }) {
    const flavourSrc = useMemo(
        () => getImageSrc(flavour?.imageUrl, imageBase),
        [flavour?.imageUrl, imageBase]
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

    return (
        <aside className="card">
            <div className="preview-header">
                <h2>Предпросмотр торта</h2>
            </div>

            <div className="preview-main">
                <div
                    className={
                        "cake-visual " +
                        (shape === "Куб" ? "shape-cube" : shape === "Сердце" ? "shape-heart" : "")
                    }
                >
                    <div className="preview-badge">{shape} · CUSTOM</div>

                    {flavourSrc ? (
                        <img src={flavourSrc} alt={flavour?.name || "flavour"} />
                    ) : (
                        <div className="product-image-placeholder" />
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
                            {size} см · {layers} ярус(а) · ~{weightKg} кг
                        </div>
                    </div>
                    <div>
                        <span className="label">Вкус</span>
                        <div>{flavour?.name || "—"}</div>
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
                    <div className="price-main">{estimatedPrice ? `${estimatedPrice} MDL` : "— MDL"}</div>
                    <div className="note">
                        Финальная стоимость уточняется после подтверждения заказа.
                    </div>
                </div>

                <ul className="summary-list">
                    {summaryLines.map((line, idx) => (
                        <li key={idx}>{line}</li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}