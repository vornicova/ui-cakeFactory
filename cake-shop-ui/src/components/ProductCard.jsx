// src/components/ProductCard.jsx
import React from "react";

const IMAGE_BASE = "http://localhost:8081";

const ProductCard = ({ product, onAddToCart }) => {
    const imgSrc =
        product?.imageUrl
            ? (product.imageUrl.startsWith("http") ? product.imageUrl : `${IMAGE_BASE}${product.imageUrl}`)
            : null;

    const price = product?.basePrice ?? product?.price ?? 0;
    const category = product?.categoryName ?? product?.category ?? "";

    return (
        <article className="product-card">
            <div className="product-card-image">
                {imgSrc ? (
                    <img src={imgSrc} alt={product?.name || "Product"} />
                ) : (
                    <div className="product-image-placeholder" />
                )}
            </div>

            <div className="product-card-body">
                <h3>{product?.name}</h3>

                {category ? (
                    <div className="small" style={{ color: "#9b7c90", marginBottom: 4 }}>
                        {category}
                    </div>
                ) : null}

                {product?.description ? (
                    <p className="product-card-desc">{product.description}</p>
                ) : null}

                <div className="product-card-footer">
                    <span className="product-price">{price} MDL</span>

                    {onAddToCart ? (
                        <button
                            type="button"
                            className="btn-primary product-add-btn"
                            onClick={() => onAddToCart(product)}
                        >
                            В корзину
                        </button>
                    ) : null}
                </div>
            </div>
        </article>
    );
};

export default ProductCard;