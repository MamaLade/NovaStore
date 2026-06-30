import "./ProductGrid.css";
import ProductCard from "../ProductCard/ProductCard";
import products from "../../data/products";

function ProductGrid() {
  return (
    <section className="product-grid">
      <h2>Sản phẩm nổi bật</h2>

      <div className="products">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductGrid;