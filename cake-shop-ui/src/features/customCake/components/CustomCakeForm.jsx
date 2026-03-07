import React from "react";

import { FLAVOURS } from "../constants/flavours";
import { getImageSrc } from "../utils/image";
import { SHAPES, DECORS } from "../constants/options";

export function CustomCakeForm({
                                   imageBase,
                                   state,
                                   setState,
                                   minPickup,
                                   onDecorFileChange,
                                   onAddToCart,
                                   status,
                                   statusType,
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
    } = state;

    return (
        <section className="card">
            <h2>Параметры торта</h2>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-grid">

                    {/* ФОРМА */}
                    <div>
                        <label>Форма</label>
                        <div className="inline-options">
                            {SHAPES.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    className={"chip" + (shape === s ? " selected" : "")}
                                    onClick={() => setState((p) => ({ ...p, shape: s }))}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* РАЗМЕР */}
                    <div>
                        <label htmlFor="size">Диаметр, см</label>
                        <select
                            id="size"
                            value={size}
                            onChange={(e) =>
                                setState((p) => ({ ...p, size: e.target.value }))
                            }
                        >
                            <option value="16">16 см (8–10 порций)</option>
                            <option value="18">18 см (10–12 порций)</option>
                            <option value="20">20 см (14–16 порций)</option>
                        </select>
                    </div>

                    {/* ЯРУСЫ */}
                    <div>
                        <label htmlFor="layers">Количество ярусов</label>
                        <select
                            id="layers"
                            value={layers}
                            onChange={(e) =>
                                setState((p) => ({ ...p, layers: e.target.value }))
                            }
                        >
                            <option value="1">1 ярус</option>
                            <option value="2">2 яруса</option>
                            <option value="3">3 яруса</option>
                        </select>
                    </div>

                    {/* ПОРЦИИ */}
                    <div>
                        <label htmlFor="servings">Кол-во порций</label>
                        <input
                            id="servings"
                            type="number"
                            min="8"
                            max="40"
                            value={servings}
                            onChange={(e) =>
                                setState((p) => ({
                                    ...p,
                                    servings: Number(e.target.value) || "",
                                }))
                            }
                        />
                    </div>

                    {/* ВЕС */}
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
                                setState((p) => ({ ...p, weight: e.target.value }))
                            }
                        />
                        <div className="note">
                            Для расчёта цены. Например: 2.0 кг ≈ 12–14 порций.
                        </div>
                    </div>

                    {/* ВКУС */}
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
                                            setState((p) => ({ ...p, selectedFlavourId: f.id }))
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

                    {/* ДЕКОР */}
                    <div className="form-row-full">
                        <label>Декор</label>

                        <div className="inline-options">
                            {DECORS.map((d) => (
                                <button
                                    key={d}
                                    type="button"
                                    className={"chip" + (decor === d ? " selected" : "")}
                                    onClick={() => setState((p) => ({ ...p, decor: d }))}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* НАДПИСЬ */}
                    <div className="form-row-full">
                        <label htmlFor="inscription">
                            Надпись на торте (по желанию)
                        </label>

                        <input
                            id="inscription"
                            type="text"
                            value={inscription}
                            onChange={(e) =>
                                setState((p) => ({
                                    ...p,
                                    inscription: e.target.value,
                                }))
                            }
                            placeholder="Например: С днём рождения!"
                        />
                    </div>

                    {/* ДАТА */}
                    <div>
                        <label htmlFor="pickup">Дата и время получения</label>

                        <input
                            id="pickup"
                            type="datetime-local"
                            min={minPickup}
                            value={pickup}
                            onChange={(e) =>
                                setState((p) => ({ ...p, pickup: e.target.value }))
                            }
                        />
                    </div>

                    {/* СЛАДОСТЬ */}
                    <div>
                        <label htmlFor="sweetness">Сладость</label>

                        <select
                            id="sweetness"
                            value={sweetness}
                            onChange={(e) =>
                                setState((p) => ({ ...p, sweetness: e.target.value }))
                            }
                        >
                            <option value="умеренная">Умеренная</option>
                            <option value="менее сладкий">Менее сладкий</option>
                            <option value="по-сладче">По-сладче</option>
                        </select>
                    </div>

                    {/* КОММЕНТАРИЙ */}
                    <div className="form-row-full">
                        <label htmlFor="comment">
                            Дополнительные пожелания
                        </label>

                        <textarea
                            id="comment"
                            value={extraComment}
                            onChange={(e) =>
                                setState((p) => ({
                                    ...p,
                                    extraComment: e.target.value,
                                }))
                            }
                            placeholder="Аллергии, ограничения и т.д."
                        />
                    </div>

                    {/* ФАЙЛ ДЕКОРА */}
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
                                <span>{decorPreview.name}</span>
                            </div>
                        )}
                    </div>

                </div>

                {/* КНОПКА */}
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
                        style={{ marginTop: 8 }}
                    >
                        {status}
                    </div>
                )}
            </form>
        </section>
    );
}