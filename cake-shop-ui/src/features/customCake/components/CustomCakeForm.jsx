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
                               }) {
    const {
        shape,
        size,
        layers,
        servings,
        weight,
        selectedFlavourId,
        decor,
        pickup,
        sweetness,
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

    return (
        <section className="card custom-cake-form-card">
            <div className="custom-form-header">
                <div>
                    <h2>Параметры торта</h2>
                    <p>Соберите свой идеальный торт: основа, вкус, декор и детали заказа.</p>
                </div>

                <div className="custom-form-steps">
                    <span className="step-chip active">01 Основа</span>
                    <span className="step-chip">02 Дизайн</span>
                    <span className="step-chip">03 Детали</span>
                </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="custom-section">
                    <div className="section-heading">
                        <div>
                            <h3>Основа торта</h3>
                            <p>Выберите форму, размер и количество ярусов.</p>
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
                            <label htmlFor="size">Диаметр, см</label>
                            <select
                                id="size"
                                value={size}
                                onChange={(e) =>
                                    setState((prev) => ({ ...prev, size: e.target.value }))
                                }
                            >
                                <option value="16">16 см (8–10 порций)</option>
                                <option value="18">18 см (10–12 порций)</option>
                                <option value="20">20 см (14–16 порций)</option>
                            </select>
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

                        <div>
                            <label htmlFor="servings">Кол-во порций</label>
                            <input
                                id="servings"
                                type="number"
                                min="8"
                                max="40"
                                value={servings}
                                onChange={(e) =>
                                    setState((prev) => ({
                                        ...prev,
                                        servings: Number(e.target.value) || "",
                                    }))
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
                                onChange={(e) =>
                                    setState((prev) => ({ ...prev, weight: e.target.value }))
                                }
                            />
                            <div className="note">
                                Для расчёта цены. Например: 2.0 кг ≈ 12–14 порций.
                            </div>
                        </div>
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

                        <div>
                            <label htmlFor="sweetness">Сладость</label>
                            <select
                                id="sweetness"
                                value={sweetness}
                                onChange={(e) =>
                                    setState((prev) => ({
                                        ...prev,
                                        sweetness: e.target.value,
                                    }))
                                }
                            >
                                <option value="умеренная">Умеренная</option>
                                <option value="менее сладкий">Менее сладкий</option>
                                <option value="по-сладче">По-сладче</option>
                            </select>
                        </div>
                    </div>
                </div>

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
                            <label>Декор</label>

                            <div className="inline-options">
                                {DECORS.map((d) => (
                                    <button
                                        key={d}
                                        type="button"
                                        className={"chip" + (decor === d ? " selected" : "")}
                                        onClick={() =>
                                            setState((prev) => ({ ...prev, decor: d }))
                                        }
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

                <div className="custom-section">
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