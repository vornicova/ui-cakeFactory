export function roundUpToHalf(value) {
    return Math.ceil(value * 2) / 2;
}
export function calculateRecommendedWeightByGuests(guests) {
    const count = Number(guests) || 0;
    if (count <= 0) return 2;

    const rawWeight = count * 0.16;
    const rounded = roundUpToHalf(rawWeight);
    return Math.max(2, rounded);
}

export function calculateRecommendedSizeByGuests(guests) {
    const count = Number(guests) || 0;

    if (count <= 10) return "16";
    if (count <= 16) return "18";
    if (count <= 24) return "20";
    if (count <= 32) return "22";

    return "24";
}
