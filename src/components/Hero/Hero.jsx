import { FaShieldAlt, FaShippingFast, FaStar } from "react-icons/fa";
import heroImage from "../../assets/hero.png";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-copy">
          <span className="hero-kicker">Bộ sưu tập mới</span>
          <h1>NovaStore Summer Sale</h1>
          <p>
            Nâng cấp tủ đồ với áo, quần và sneaker đang giảm giá mạnh trong tuần này.
          </p>

          <div className="hero-actions">
            <a href="#products" className="hero-primary">Mua ngay</a>
            <a href="#products" className="hero-secondary">Xem sản phẩm</a>
          </div>

          <div className="hero-benefits">
            <span><FaShippingFast /> Giao nhanh</span>
            <span><FaShieldAlt /> Đổi trả dễ dàng</span>
            <span><FaStar /> Hàng chọn lọc</span>
          </div>
        </div>

        <div className="hero-media">
          <img src={heroImage} alt="NovaStore fashion sale" />
          <div className="sale-card">
            <span>Ưu đãi</span>
            <b>Giảm đến 50%</b>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
