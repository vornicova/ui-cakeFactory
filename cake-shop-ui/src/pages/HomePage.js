import React, { useEffect, useState } from "react";
import HomeHero from "../components/home/HomeHero";
import HomeCategories from "../components/home/HomeCategories";
import ProductsGrid from "../components/ProductsGrid";
import HomePageExtras from "../components/home/HomePageExtras";
import { fallbackProducts } from "../data/fallbackProducts";
import "../styles/homePage.css";

function HomePage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        loadProductsFromApi();
    }, []);

    async function loadProductsFromApi() {
        try {
            const resp = await fetch("/api/products");
            if (!resp.ok) throw new Error("API error");
            const data = await resp.json();
            setProducts(Array.isArray(data) && data.length ? data : fallbackProducts);
        } catch {
            setProducts(fallbackProducts);
        }
    }

    const handleAddToCart = (product) => {
        try {
            const raw = localStorage.getItem("cartItems");
            const items = raw ? JSON.parse(raw) : [];

            const index = items.findIndex(
                (it) => String(it.id) === String(product.id)
            );

            if (index === -1) {
                items.push({
                    id: product.id,
                    name: product.name,
                    price: product.price ?? product.basePrice ?? 0,
                    quantity: 1,
                    imageUrl: product.imageUrl || "",
                    category: product.categoryName || product.category || "",
                });
            } else {
                items[index].quantity = (items[index].quantity || 0) + 1;
            }

            localStorage.setItem("cartItems", JSON.stringify(items));
            window.dispatchEvent(new Event("cart:updated"));
        } catch (e) {
            console.error("Ошибка добавления в корзину", e);
        }
    };

    return (
        <div className="home-page">
            <HomeHero />
            <HomeCategories />

            <section className="home-products-section">
                <div className="home-section-title">
                    <p>POPULAR DESSERTS</p>
                </div>

                <ProductsGrid
                    products={products.slice(0, 4)}
                    onAddToCart={handleAddToCart}
                />
            </section>

            <HomePageExtras />
        </div>
    );
}

export default HomePage;