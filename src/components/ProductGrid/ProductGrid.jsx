import "./ProductGrid.css";
import ProductCard from "../ProductCard/ProductCard";
import { useCart } from "../../context/CartContext";
import { useMemo } from "react";

function ProductGrid({ category, setCategory, search, sort, setSort }) {
  const { addToCart, isWishlisted, toggleWishlist, products } = useCart();

  const filtered = useMemo(() => {
    let result = [...(products || [])];

    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    if (search) {
      const keyword = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(keyword) ||
          p.brand.toLowerCase().includes(keyword)
      );
    }

    switch (sort) {
      case "price_low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "best_seller":
        result.sort((a, b) => b.sold - a.sold);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [category, search, sort]);

  return (
    <section className="product-section" id="products">
      <div className="product-header">
        <div>
          <p className="product-label">Thời trang</p>
          <h2>Khám phá sản phẩm mới</h2>
          <span>{filtered.length} sản phẩm phù hợp với lựa chọn của bạn</span>
        </div>
      </div>

      <div className="filter-bar">
        <button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>Tất cả</button>
        <button className={category === "ao" ? "active" : ""} onClick={() => setCategory("ao")}>Áo</button>
        <button className={category === "quan" ? "active" : ""} onClick={() => setCategory("quan")}>Quần</button>
        <button className={category === "giay" ? "active" : ""} onClick={() => setCategory("giay")}>Giày</button>
        <button className={category === "tui" ? "active" : ""} onClick={() => setCategory("tui")}>Túi xách</button>
        <button className={category === "mu" ? "active" : ""} onClick={() => setCategory("mu")}>Mũ lưỡi trai</button>
        <button className={category === "vong" ? "active" : ""} onClick={() => setCategory("vong")}>Vòng tay</button>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="default">Mặc định</option>
          <option value="price_low">Giá thấp đến cao</option>
          <option value="price_high">Giá cao đến thấp</option>
          <option value="best_seller">Bán chạy</option>
          <option value="rating">Đánh giá cao</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">Không tìm thấy sản phẩm phù hợp.</div>
      ) : (
        <div className="grid">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={addToCart}
              isWishlisted={isWishlisted(p.id)}
              onToggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductGrid;
