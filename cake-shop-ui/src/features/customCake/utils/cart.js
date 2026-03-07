export function addToCart(item, storageKey = "cartItems") {
    const raw = localStorage.getItem(storageKey);
    const items = raw ? JSON.parse(raw) : [];
    items.push(item);
    localStorage.setItem(storageKey, JSON.stringify(items));
    return items;
}