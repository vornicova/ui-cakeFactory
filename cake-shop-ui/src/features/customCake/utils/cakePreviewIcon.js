export function getCakePreviewIcon(shape, layers) {

    const l = Number(layers) || 1;

    if (shape === "Круглый") {
        if (l === 1) return "/cake-preview/round-1.svg";
        if (l === 2) return "/cake-preview/round-2.svg";
        return "/cake-preview/round-3.svg";
    }

    if (shape === "Куб") {
        if (l === 1) return "/cake-preview/square-1.svg";
        if (l === 2) return "/cake-preview/square-2.svg";
        return "/cake-preview/square-3.svg";
    }

    if (shape === "Сердце") {
        if (l === 1) return "/cake-preview/heart-1.svg";
        if (l === 2) return "/cake-preview/heart-2.svg";
        return "/cake-preview/heart-3.svg";
    }

    return "/cake-preview/round-1.svg";
}