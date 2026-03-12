export function buildCustomCakeComment({
                                           shape,
                                           size,
                                           layers,
                                           servings,
                                           weightKg,
                                           decor,
                                           flavour,
                                           inscription,
                                           decorFileName,
                                           extraComment,
                                       }) {
    const flavourText = flavour ? `${flavour.name}: ${flavour.label}` : "—";

    const parts = [];
    parts.push(
        `Персональный торт: форма ${shape}, ${size} см, ${layers} ярус(а), ${servings} порций, ~${weightKg} кг.`
    );
    parts.push(`Вкус: ${flavourText}`);
    parts.push(`Декор: ${decor}.`);

    if (inscription?.trim()) {
        parts.push(`Надпись: "${inscription.trim()}".`);
    }
    if (decorFileName) {
        parts.push(
            `Клиент загрузил файл-референс декора: ${decorFileName} (файл пока не сохраняется на сервере).`
        );
    }
    if (extraComment?.trim()) {
        parts.push(`Доп. пожелания: ${extraComment.trim()}.`);
    }

    return parts.join(" ");
}