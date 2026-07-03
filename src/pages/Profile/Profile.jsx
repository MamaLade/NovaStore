import { useEffect, useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaRegCalendarAlt, FaUser } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatters";
import "./Profile.css";

function Profile() {
  const {
    user,
    updateProfile,
    orders,
    wishlist,
    addToCart,
    removeFromWishlist,
  } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthday: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      birthday: user.birthday || "",
    });
  }, [user]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage("");
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();
    const result = updateProfile(form);
    setMessage(result.message);
  };

  return (
    <div className="container profile">
      <section className="profile-section profile-overview">
        <div className="profile-card-main">
          <div className="profile-avatar">
            {user?.name ? user.name.slice(0, 1).toUpperCase() : <FaUser />}
          </div>
          <div>
            <span>Tài khoản của bạn</span>
            <h2>{user?.name || "Khách mua hàng"}</h2>
            <p>{user?.email || "Đăng nhập để lưu hồ sơ, yêu thích và đơn hàng."}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div><b>{wishlist.length}</b><span>Yêu thích</span></div>
          <div><b>{orders.length}</b><span>Đơn hàng</span></div>
          <div><b>{user ? "Member" : "Guest"}</b><span>Hạng</span></div>
        </div>
      </section>

      <section className="profile-section">
        <div className="section-title">
          <h2>Hồ sơ người dùng</h2>
          <span>{user ? "Có thể chỉnh sửa" : "Chưa đăng nhập"}</span>
        </div>

        {user ? (
          <form className="profile-form" onSubmit={handleSaveProfile}>
            <label>
              <span><FaUser /> Họ tên</span>
              <input value={form.name} onChange={(e) => updateField("name", e.target.value)} />
            </label>

            <label>
              <span><FaEnvelope /> Email</span>
              <input value={form.email} onChange={(e) => updateField("email", e.target.value)} />
            </label>

            <label>
              <span><FaPhone /> Số điện thoại</span>
              <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
            </label>

            <label>
              <span><FaRegCalendarAlt /> Ngày sinh</span>
              <input type="date" value={form.birthday} onChange={(e) => updateField("birthday", e.target.value)} />
            </label>

            <label className="full-field">
              <span><FaMapMarkerAlt /> Địa chỉ</span>
              <input value={form.address} onChange={(e) => updateField("address", e.target.value)} />
            </label>

            {message && <p className="profile-message">{message}</p>}

            <button type="submit">Lưu hồ sơ</button>
          </form>
        ) : (
          <div className="empty">Bạn cần đăng nhập để cập nhật hồ sơ cá nhân.</div>
        )}
      </section>

      <section className="profile-section">
        <div className="section-title">
          <h2>Sản phẩm yêu thích</h2>
          <span>{wishlist.length} sản phẩm</span>
        </div>

        {wishlist.length === 0 ? (
          <div className="empty">Bạn chưa có sản phẩm yêu thích nào.</div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((product) => (
              <div key={product.id} className="wishlist-card">
                <img src={product.image} alt={product.name} />

                <div className="wishlist-info">
                  <h3>{product.name}</h3>
                  <p>{product.shop?.name || product.brand}</p>
                  <b>{formatCurrency(product.price)}</b>
                </div>

                <div className="wishlist-actions">
                  <button onClick={() => addToCart(product)}>Thêm vào giỏ</button>
                  <button
                    className="ghost-btn"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    Bỏ yêu thích
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="profile-section">
        <div className="section-title">
          <h2>Lịch sử mua hàng</h2>
          <span>{orders.length} đơn hàng</span>
        </div>

        {orders.length === 0 ? (
          <div className="empty">Chưa có đơn hàng nào</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span>{order.createdAt}</span>
                <span className="status">{order.status || "Đã đặt hàng"}</span>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id} className="item">
                    <img src={item.image} alt={item.name} />
                    <div className="info">
                      <h4>{item.name}</h4>
                      <p>
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                    </div>

                    <b>{formatCurrency(item.price * item.quantity)}</b>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <b>Tổng: {formatCurrency(order.total)}</b>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default Profile;
