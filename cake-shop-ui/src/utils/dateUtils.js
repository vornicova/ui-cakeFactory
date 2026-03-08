export const shortDateTime = (iso) => {
    if (!iso) return "";
    const date = new Date(iso);
    return date.toLocaleDateString("ru-RU") + " " + date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
};