import { FaMapMarkerAlt, FaShippingFast, FaStar, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import shops from "../../data/shops";
import "./ShopHighlights.css";

function ShopHighlights() {
  const navigate = useNavigate();

  return (
    <section className="shop-section">
      <div className="shop-heading">
        <div>
          <span>Đối tác bán hàng</span>
          <h2>Shop nổi bật hôm nay</h2>
        </div>
        <p>Mỗi shop có nhóm sản phẩm riêng, đánh giá và chính sách giao hàng rõ ràng.</p>
      </div>

      <div className="shop-grid">
        {shops.map((shop) => (
          <button
            className="shop-card"
            key={shop.id}
            type="button"
            onClick={() => navigate(`/shop/${shop.id}`)}
          >
            <div className="shop-avatar">{shop.name.slice(0, 2).toUpperCase()}</div>
            <div className="shop-main">
              <span className="shop-badge">{shop.badge}</span>
              <h3>{shop.name}</h3>
              <p><FaMapMarkerAlt /> {shop.location}</p>
            </div>
            <div className="shop-stats">
              <span><FaStar /> {shop.rating}</span>
              <span><FaUsers /> {shop.followers.toLocaleString("vi-VN")}</span>
              <span><FaShippingFast /> {shop.shipping}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default ShopHighlights;
