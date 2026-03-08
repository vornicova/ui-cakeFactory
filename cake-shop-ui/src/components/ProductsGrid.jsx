import ProductCard from "./ProductCard";

const ProductsGrid = ({ products, onAddToCart }) => {
    return (
        <div className="products-grid">
            {products.map((p) => (
                <ProductCard
                    key={p.id}
                    product={p}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
};

export default ProductsGrid;