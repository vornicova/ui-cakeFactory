import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/api";

function ProductPage() {
    const { id } = useParams();
    const IMAGE_BASE = "http://localhost:8081";
    const [product, setProduct]   = useState(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

    useEffect(() => {
        getProductById(id)
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(e => {
                setError(e.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="center">Загрузка...</div>;
    if (error)   return <div className="center error">Ошибка: {error}</div>;
    if (!product) return <div className="center">Товар не найден</div>;

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        cart.push({ id: product.id, name: product.name, price: product.price });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Добавлено в корзину");
    };

    return (
        <div className="page product-page">
            <div className="product-left">
                {product.imageUrl && (
                    <img src={`${IMAGE_BASE}${product.imageUrl}`} alt={product.name} />
                )}
            </div>
            <div className="product-right">
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <div className="product-info">
                    <span className="price big">{product.price} MDL</span>
                </div>
                <button className="btn" onClick={addToCart}>
                    Добавить в корзину
                </button>
            </div>
        </div>
    );
}

export default ProductPage;
