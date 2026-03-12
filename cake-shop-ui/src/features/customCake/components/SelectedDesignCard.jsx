import React from "react";
import { getImageSrc } from "../utils/image";

export function SelectedDesignCard({
                                       imageBase,
                                       selectedDesign,
                                       activeDesignSource,
                                       onClearDesign,
                                   }) {
    if (!selectedDesign && activeDesignSource?.type !== "catalog") {
        return null;
    }

    const designImage =
        activeDesignSource?.type === "catalog"
            ? activeDesignSource?.imageUrl
            : selectedDesign?.imageUrl;

    const designName =
        activeDesignSource?.type === "catalog"
            ? activeDesignSource?.name
            : selectedDesign?.name;

    const designCode = selectedDesign?.code;

    const imageSrc = getImageSrc(designImage, imageBase);

    return (
        <section className="custom-section selected-design-section">
            <div className="section-heading">
                <div>
                    <h3>Выбранный дизайн</h3>
                    <p>Этот дизайн будет использован как основа для оформления торта.</p>
                </div>

                {activeDesignSource?.type === "catalog" && (
                    <span className="source-badge">Из каталога</span>
                )}
            </div>

            <div className="selected-design-card">
                <div className="selected-design-media">
                    {imageSrc ? (
                        <img src={imageSrc} alt={designName || "Selected design"} />
                    ) : (
                        <div className="selected-design-placeholder">Design</div>
                    )}
                </div>

                <div className="selected-design-content">
                    <div className="selected-design-meta">
                        <h4>{designName || "Выбранный дизайн"}</h4>
                        {designCode && (
                            <p>
                                Код дизайна: <strong>{designCode}</strong>
                            </p>
                        )}
                        {selectedDesign?.shape && <p>Форма: {selectedDesign.shape}</p>}
                        {selectedDesign?.decor && <p>Стиль декора: {selectedDesign.decor}</p>}
                    </div>

                    <button
                        type="button"
                        className="btn-outline"
                        onClick={onClearDesign}
                    >
                        Убрать дизайн
                    </button>
                </div>
            </div>
        </section>
    );
}