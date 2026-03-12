import React from "react";

import { FLAVOURS } from "../constants/flavours";
import { getImageSrc } from "../utils/image";
import { SHAPES, DECORS } from "../constants/options";
import { SelectedDesignCard } from "./SelectedDesignCard";
import { AiDesignSection } from "./AiDesignSection";

export function CustomCakeForm({
                                   imageBase,
                                   state,
                                   setState,
                                   minPickup,
                                   onDecorFileChange,
                                   onAddToCart,
                                   status,
                                   statusType,
                                   activeDesignSource,
                                   recommendedWeight,
                                   recommendedSize,
                               }) {
    const {
        shape,
        layers,
        servings,
        weight,
        manualWeight,
        selectedFlavourId,
        decor,
        pickup,
        inscription,
        extraComment,
        decorPreview,
        selectedDesign,
        useAiDesign,
    } = state;

    const clearSelectedDesign = () => {
        setState((prev) => ({
            ...prev,
            selectedDesign: null,
        }));

        try {
            localStorage.removeItem("selectedCakeDesign");
        } catch (e) {
            console.error("Cannot remove selectedCakeDesign", e);
        }
    };

    const clearUploadedReference = () => {
        setState((prev) => ({
            ...prev,
            decorPreview: null,
            decorFileName: null,
        }));
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (!element) return;

        element.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <section className="card custom-cake-form-card">
            <div className="custom-form-header">
                <div>
                    <h2>Параметры торта</h2>
                    <p>Соберите свой идеальный торт: основа, вкус, декор и детали заказа.</p>
                </div>

                <div className="custom-form-steps">
                    <button
                        type="button"
                        className="step-chip active"
                        onClick={() => scrollToSection("cake-base-section")}
                    >
                        01 Основа
                    </button>

                    <button
                        type="button"
                        className="step-chip"
                        onClick={() => scrollToSection("cake-design-section")}
                    >
                        02 Дизайн
                    </button>

                    <button
                        type="button"
                        className="step-chip"
                        onClick={() => scrollToSection("cake-details-section")}
                    >
                        03 Детали
                    </button>
                </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="custom-section" id="cake-base-section">
                    <div className="section-heading">
                        <div>
                            <h3>Основа торта</h3>
                            <p>Выберите форму, количество гостей и количество ярусов.</p>
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-row-full">
                            <label>Форма</label>
                            <div className="inline-options">
                                {SHAPES.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        className={"chip" + (shape === s ? " selected" : "")}
                                        onClick={() => setState((prev) => ({ ...prev, shape: s }))}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="layers">Количество ярусов</label>
                            <select
                                id="layers"
                                value={layers}
                                onChange={(e) =>
                                    setState((prev) => ({ ...prev, layers: e.target.value }))
                                }
                            >
                                <option value="1">1 ярус</option>
                                <option value="2">2 яруса</option>
                                <option value="3">3 яруса</option>
                            </select>
                        </div>

                        <div className="form-row-full">
                            <label htmlFor="servings">Количество гостей</label>

                            <div className="guest-slider-card">
                                <div className="guest-slider-top">
                                    <div className="guest-count-badge">{servings}</div>

                                    <div className="guest-slider-meta">
                                        <strong>гостей</strong>
                                        <span>
                                            Рекомендуемый вес: {recommendedWeight} кг · размер: {recommendedSize} см
                                        </span>
                                    </div>
                                </div>

                                <input
                                    id="servings"
                                    className="guest-slider"
                                    type="range"
                                    min="2"
                                    max="200"
                                    step="1"
                                    value={servings}
                                    onChange={(e) =>
                                        setState((prev) => ({
                                            ...prev,
                                            servings: Number(e.target.value),
                                        }))
                                    }
                                />

                                <div className="guest-slider-scale">
                                    <span>2</span>
                                    <span>24</span>
                                    <span>46</span>
                                    <span>68</span>
                                    <span>90</span>
                                    <span>112</span>
                                    <span>134</span>
                                    <span>156</span>
                                    <span>178</span>
                                    <span>200</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-row-full">
                            <label className="manual-weight-toggle">
                                <input
                                    type="checkbox"
                                    checked={manualWeight}
                                    onChange={(e) =>
                                        setState((prev) => ({
                                            ...prev,
                                            manualWeight: e.target.checked,
                                            weight: e.target.checked
                                                ? prev.weight
                                                : recommendedWeight,
                                        }))
                                    }
                                />
                                <span>Указать вес вручную</span>
                            </label>
                        </div>

                        {manualWeight ? (
                            <div className="form-row-full">
                                <label htmlFor="weight">Вес торта, кг</label>
                                <input
                                    id="weight"
                                    type="number"
                                    min="1"
                                    max="20"
                                    step="0.5"
                                    value={weight}
                                    onChange={(e) =>
                                        setState((prev) => ({
                                            ...prev,
                                            weight: e.target.value,
                                        }))
                                    }
                                />
                                <div className="note">
                                    Автоматически мы рекомендуем {recommendedWeight} кг для {servings} гостей.
                                </div>
                            </div>
                        ) : (
                            <div className="form-row-full auto-weight-box">
                                <div className="auto-weight-item">
                                    <span className="auto-weight-label">Рекомендуемый вес</span>
                                    <strong>{recommendedWeight} кг</strong>
                                </div>

                                <div className="auto-weight-item">
                                    <span className="auto-weight-label">Рекомендуемый размер</span>
                                    <strong>{recommendedSize} см</strong>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="custom-section">
                    <div className="section-heading">
                        <div>
                            <h3>Вкус и начинка</h3>
                            <p>Выберите вкус, который лучше всего подойдёт к вашему празднику.</p>
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-row-full">
                            <label>Вкус торта</label>

                            <div className="flavour-grid">
                                {FLAVOURS.map((f) => {
                                    const src = getImageSrc(f.imageUrl, imageBase);

                                    return (
                                        <button
                                            key={f.id}
                                            type="button"
                                            className={
                                                "flavour-card" +
                                                (selectedFlavourId === f.id ? " selected" : "")
                                            }
                                            onClick={() =>
                                                setState((prev) => ({
                                                    ...prev,
                                                    selectedFlavourId: f.id,
                                                }))
                                            }
                                        >
                                            <div className="flavour-thumb">
                                                {src ? (
                                                    <img src={src} alt={f.name} />
                                                ) : (
                                                    <div className="product-image-placeholder" />
                                                )}
                                            </div>

                                            <div className="flavour-title">{f.name}</div>
                                            <div className="flavour-desc">{f.label}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div id="cake-design-section">
                    {(selectedDesign || activeDesignSource?.type === "catalog") && (
                        <SelectedDesignCard
                            imageBase={imageBase}
                            selectedDesign={selectedDesign}
                            activeDesignSource={activeDesignSource}
                            onClearDesign={clearSelectedDesign}
                        />
                    )}

                    <div className="custom-section">
                        <div className="section-heading">
                            <div>
                                <h3>Декор и стиль</h3>
                                <p>Можно выбрать стиль из каталога, загрузить референс или позже использовать AI.</p>
                            </div>
                        </div>

                        <div className="form-grid">


                            <div className="form-row-full">
                                <label htmlFor="inscription">
                                    Надпись на торте (по желанию)
                                </label>

                                <input
                                    id="inscription"
                                    type="text"
                                    value={inscription}
                                    onChange={(e) =>
                                        setState((prev) => ({
                                            ...prev,
                                            inscription: e.target.value,
                                        }))
                                    }
                                    placeholder="Например: С днём рождения!"
                                />
                            </div>

                            <div className="form-row-full">
                                <label htmlFor="decorFile">
                                    Загрузить референс декора
                                </label>

                                <input
                                    id="decorFile"
                                    type="file"
                                    accept="image/*"
                                    onChange={onDecorFileChange}
                                />

                                {decorPreview && (
                                    <div className="decor-preview">
                                        <img src={decorPreview.src} alt="decor" />
                                        <div className="decor-preview-info">
                                            <span>{decorPreview.name}</span>
                                            <button
                                                type="button"
                                                className="btn-outline btn-xs"
                                                onClick={clearUploadedReference}
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {!decorPreview && !selectedDesign && !useAiDesign && (
                                    <div className="empty-design-hint">
                                        Пока дизайн не выбран. Можно выбрать его на странице дизайнов,
                                        загрузить свой референс или позже использовать AI.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <AiDesignSection state={state} setState={setState} />
                </div>

                <div className="custom-section" id="cake-details-section">
                    <div className="section-heading">
                        <div>
                            <h3>Детали заказа</h3>
                            <p>Укажите удобное время получения и дополнительные пожелания.</p>
                        </div>
                    </div>

                    <div className="form-grid">
                        <div>
                            <label htmlFor="pickup">Дата и время получения</label>

                            <input
                                id="pickup"
                                type="datetime-local"
                                min={minPickup}
                                value={pickup}
                                onChange={(e) =>
                                    setState((prev) => ({ ...prev, pickup: e.target.value }))
                                }
                            />
                        </div>

                        <div className="form-row-full">
                            <label htmlFor="comment">
                                Дополнительные пожелания
                            </label>

                            <textarea
                                id="comment"
                                value={extraComment}
                                onChange={(e) =>
                                    setState((prev) => ({
                                        ...prev,
                                        extraComment: e.target.value,
                                    }))
                                }
                                placeholder="Аллергии, ограничения, цветовая гамма, тематика праздника и т.д."
                            />
                        </div>
                    </div>
                </div>

                <div className="custom-form-footer">
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={onAddToCart}
                    >
                        Добавить в корзину
                    </button>

                    <div className="note">
                        Чтобы оформить заказ, нужно быть авторизованным пользователем.
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
                        style={{ marginTop: 10 }}
                    >
                        {status}
                    </div>
                )}
            </form>
        </section>
    );
}