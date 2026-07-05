import { FaShieldAlt, FaShippingFast, FaStar, FaArrowRight } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import "./Hero.css";

function Hero() {
  const { products } = useCart();
  const featuredProducts = (products || []).slice(0, 3);

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-copy">
          <span className="hero-kicker">Bộ sưu tập mới 2024</span>
          <h1>Phong cách Thời trang Hiện đại</h1>
          <p>
            Khám phá bộ sưu tập thời trang mới nhất với thiết kế đẳng cấp, chất lượng cao và phong cách đa dạng. Nâng tầm diện mạo của bạn ngay hôm nay.
          </p>

          <div className="hero-actions">
            <button onClick={scrollToProducts} className="hero-primary" type="button">
              Khám phá ngay <FaArrowRight />
            </button>
            <button onClick={scrollToProducts} className="hero-secondary" type="button">Xem bộ sưu tập</button>
          </div>

          <div className="hero-metrics">
            <div className="metric-card">
              <strong>10K+</strong>
              <span>Sản phẩm thời trang</span>
            </div>
            <div className="metric-card">
              <strong>4.9/5</strong>
              <span>Đánh giá từ khách</span>
            </div>
            <div className="metric-card">
              <strong>Giao nhanh</strong>
              <span>Trong 24h tại HN/HCM</span>
            </div>
          </div>

          <div className="hero-benefits">
            <span><FaShippingFast /> Giao nhanh toàn quốc</span>
            <span><FaShieldAlt /> Đổi trả 30 ngày</span>
            <span><FaStar /> Hàng chính hãng 100%</span>
          </div>
        </div>

        <div className="hero-media">
          <div className="hero-products">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className={`hero-product-card hero-product-${index + 1}`}>
                <img src={product.image} alt={product.name} />
                <div className="hero-product-info">
                  <span className="hero-product-brand">{product.brand}</span>
                  <h3>{product.name}</h3>
                  <p className="hero-product-price">{product.price.toLocaleString()}đ</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
