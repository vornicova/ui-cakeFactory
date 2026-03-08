export function normalizePositiveNumber(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function calculateEstimatedPrice({
                                            customProduct,
                                            weightKg,
                                            layers,
                                            decor,
                                            flavourId,
                                        }) {
    if (!customProduct) return null;

    const basePerKg = Number(customProduct.basePrice ?? customProduct.price ?? 0);
    if (!basePerKg) return null;

    let price = basePerKg * weightKg;

    const layersNum = Number(layers) || 1;
    if (layersNum === 2) price *= 1.25;
    if (layersNum === 3) price *= 1.45;

    if (decor === "Ягоды" || decor === "Цветы") price += 120;
    if (decor === "Детский") price += 160;

    if (flavourId === "pistachio-noir" || flavourId === "caramel-crunch") {
        price *= 1.1;
    }

    return Math.round(price);
}

export function buildSummaryLines({
                                      shape,
                                      size,
                                      layers,
                                      servings,
                                      weightKg,
                                      flavourName,
                                  }) {
    const s = Number(servings) || 12;
    const l = Number(layers) || 1;

    return [
        `Форма: ${shape}`,
        `${size} см · ${l} ярус(а) · ${s} порций · ~${weightKg} кг`,
        `Вкус: ${flavourName || "—"}`,
    ];
}