const DEFAULT_IMAGE_BASE = "http://localhost:8081";

export function getImageSrc(imageUrl, imageBase = DEFAULT_IMAGE_BASE) {
    if (!imageUrl) return null;
    const url = String(imageUrl).trim();
    if (!url) return null;

    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return imageBase + url;
}