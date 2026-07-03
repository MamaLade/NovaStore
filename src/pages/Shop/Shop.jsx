import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaShippingFast,
  FaStar,
  FaUsers,
} from "react-icons/fa";
import shops from "../../data/shops";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useCart } from "../../context/CartContext";
import "./Shop.css";

function Shop() {
  const { id } = useParams();
  const { addToCart, isWishlisted, toggleWishlist, products } = useCart();

  const shop = shops.find((s) => s.id === id);

  const shopProducts = useMemo(() => {
    if (!shop) return [];
    return (products || []).filter((p) => p.shop?.id === shop.id);
  }, [shop, products]);

  if (!shop) {
    return (
      <div className="shop-page">
        <div className="shop-empty">
          <h2>Không tìm thấy shop</h2>
          <Link to="/" className="shop-back-link">
            <FaArrowLeft /> Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <div className="shop-container">
        <Link to="/" className="shop-back-link">
          <FaArrowLeft /> Quay lại
        </Link>

        <header className="shop-header">
          <div className="shop-header-avatar">
            {shop.name.slice(0, 2).toUpperCase()}
          </div>

          <div className="shop-header-info">
            <span className="shop-header-badge">{shop.badge}</span>
            <h1>{shop.name}</h1>
            <p className="shop-tagline">{shop.tagline}</p>
            <p className="shop-location">
              <FaMapMarkerAlt /> {shop.location}
            </p>
          </div>

          <div className="shop-header-stats">
            <span><FaStar /> {shop.rating}</span>
            <span><FaUsers /> {shop.followers.toLocaleString("vi-VN")} theo dõi</span>
            <span><FaShippingFast /> {shop.shipping}</span>
          </div>
        </header>

        <section className="shop-description">
          <h2>Giới thiệu shop</h2>
          <p>{shop.description}</p>
        </section>

        <section className="shop-products">
          <h2>Sản phẩm của shop ({shopProducts.length})</h2>

          {shopProducts.length === 0 ? (
            <div className="shop-products-empty">Shop chưa có sản phẩm nào.</div>
          ) : (
            <div className="shop-products-grid">
              {shopProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  isWishlisted={isWishlisted(product.id)}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Shop;
