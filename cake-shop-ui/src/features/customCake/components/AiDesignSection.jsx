import React from "react";

const AI_STYLES = [
    "Нежный",
    "Минималистичный",
    "Элегантный",
    "Праздничный",
    "Детский",
];

export function AiDesignSection({ state, setState }) {
    const {
        useAiDesign,
        aiDesignPrompt,
        aiDesignStyle,
        aiDesignImage,
        aiDesignStatus,
    } = state;

    const toggleAiMode = (checked) => {
        setState((prev) => ({
            ...prev,
            useAiDesign: checked,
            ...(checked
                ? {}
                : {
                    aiDesignPrompt: "",
                    aiDesignStyle: "Нежный",
                    aiDesignImage: null,
                    aiDesignStatus: "idle",
                }),
        }));
    };

    return (
        <section className="custom-section ai-design-section">
            <div className="section-heading">
                <div>
                    <h3>Уникальный дизайн с ИИ</h3>
                    <p>
                        Позже здесь можно будет сгенерировать концепцию торта по вашему
                        описанию.
                    </p>
                </div>

                <label className="ai-switch">
                    <input
                        type="checkbox"
                        checked={useAiDesign}
                        onChange={(e) => toggleAiMode(e.target.checked)}
                    />
                    <span className="ai-switch-slider" />
                </label>
            </div>

            {useAiDesign && (
                <div className="ai-design-body">
                    <div className="form-row-full">
                        <label htmlFor="aiDesignPrompt">
                            Опишите желаемый дизайн
                        </label>
                        <textarea
                            id="aiDesignPrompt"
                            value={aiDesignPrompt}
                            onChange={(e) =>
                                setState((prev) => ({
                                    ...prev,
                                    aiDesignPrompt: e.target.value,
                                }))
                            }
                            placeholder="Например: бело-розовый торт с живыми цветами, золотыми мазками и нежным минималистичным декором"
                        />
                    </div>

                    <div className="form-row-full">
                        <label>Стиль AI-дизайна</label>
                        <div className="inline-options">
                            {AI_STYLES.map((style) => (
                                <button
                                    key={style}
                                    type="button"
                                    className={
                                        "chip" + (aiDesignStyle === style ? " selected" : "")
                                    }
                                    onClick={() =>
                                        setState((prev) => ({
                                            ...prev,
                                            aiDesignStyle: style,
                                        }))
                                    }
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="ai-preview-placeholder">
                        {aiDesignImage ? (
                            <div className="ai-preview-ready">
                                <img src={aiDesignImage} alt="AI design preview" />
                            </div>
                        ) : (
                            <div className="ai-preview-empty">
                                <strong>AI Preview Coming Soon</strong>
                                <p>
                                    Здесь появится сгенерированное превью, когда подключим AI.
                                </p>
                                <span className="ai-status-chip">
                                    Статус: {aiDesignStatus}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}