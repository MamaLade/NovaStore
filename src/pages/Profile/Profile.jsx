import { useEffect, useMemo, useState } from "react";
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

  const userOrders = useMemo(() => {
    return user ? orders.filter((order) => order.userId === user.id) : [];
  }, [orders, user?.id]);

  const totalSpent = useMemo(() => {
    return userOrders.reduce(
      (sum, order) => sum + (order.originalTotal ?? order.total ?? 0),
      0
    );
  }, [userOrders]);

  const vipLabel = user
    ? totalSpent >= 45000000
      ? "VIP 15%"
      : totalSpent >= 25000000
      ? "VIP 10%"
      : "Thành viên"
    : "Guest";

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

  const vipProgress = user
    ? Math.min(100, Math.round((Math.min(totalSpent, 45000000) / 45000000) * 100))
    : 0;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
      })
    : null;

  const recentActivities = useMemo(() => {
    return userOrders
      .slice(0, 3)
      .map((order) => ({
        id: order.id,
        label: `Đơn #${order.id}`,
        date: order.createdAt,
        detail: `${order.items.length} sản phẩm — ${formatCurrency(order.total)}`,
        status: order.status || "Đã đặt hàng",
      }));
  }, [userOrders]);

  const vipNote = user
    ? totalSpent >= 45000000
      ? "Bạn đang ở đỉnh VIP 15%, tận hưởng ưu đãi giảm giá tốt nhất."
      : totalSpent >= 25000000
      ? `Bạn đã là VIP 10%. Chỉ còn ${formatCurrency(45000000 - totalSpent)} để lên VIP 15%.`
      : `Còn ${formatCurrency(25000000 - totalSpent)} để đạt VIP 10%.`
    : "Đăng nhập để bắt đầu tích lũy đơn hàng và nhận ưu đãi.";

  return (
    <div className="container profile">
      <section className="profile-section profile-overview">
        <div className="profile-summary">
          <div className="profile-card-main">
            <div className="profile-avatar">
              {user?.name ? user.name.slice(0, 1).toUpperCase() : <FaUser />}
            </div>
            <div>
              <span>Tài khoản của bạn</span>
              <h2>{user?.name || "Khách mua hàng"}</h2>
              <p>{user?.email || "Đăng nhập để lưu hồ sơ, yêu thích và đơn hàng."}</p>
              {memberSince && <small>Thành viên từ {memberSince}</small>}
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <span>Điện thoại</span>
              <strong>{user?.phone || "Chưa cập nhật"}</strong>
            </div>
            <div className="detail-item">
              <span>Địa chỉ</span>
              <strong>{user?.address || "Chưa cập nhật"}</strong>
            </div>
          </div>

          <div className="profile-actions">
            <a href="#profile-form" className="button-secondary">Chỉnh sửa hồ sơ</a>
            <a href="#order-history" className="button-primary">Xem đơn hàng</a>
          </div>

          <div className="vip-pill">
            <span>Hạng hiện tại</span>
            <strong>{vipLabel}</strong>
            <p>{vipNote}</p>
          </div>
        </div>

        <div className="profile-stats-grid">
          <div className="stat-card">
            <span>Đơn hàng</span>
            <strong>{userOrders.length}</strong>
          </div>
          <div className="stat-card">
            <span>Tổng đã chi</span>
            <strong>{formatCurrency(totalSpent)}</strong>
          </div>
          <div className="stat-card">
            <span>Yêu thích</span>
            <strong>{wishlist.length}</strong>
          </div>
          <div className="stat-card">
            <span>Ưu đãi</span>
            <strong>{user ? vipLabel : "Guest"}</strong>
          </div>
        </div>
      </section>

      <section className="profile-section profile-main">
        <div className="profile-grid">
          <div className="profile-card profile-card-form">
            <div className="section-title">
              <h2>Hồ sơ người dùng</h2>
              <span>{user ? "Có thể chỉnh sửa" : "Chưa đăng nhập"}</span>
            </div>

            {user ? (
          <form id="profile-form" className="profile-form" onSubmit={handleSaveProfile}>
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
      </div>

      <div className="profile-card profile-card-aside">
        <div className="aside-title">
          <h3>Quản lý tài khoản</h3>
          <span>Thông tin nhanh</span>
        </div>

        <div className="vip-status-card">
          <p>Tiến trình VIP</p>
          <div className="vip-badge-large">{vipLabel}</div>
          <div className="vip-progress">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${vipProgress}%` }}></div>
            </div>
            <span>{vipProgress}% đã hoàn thành</span>
          </div>
          <p className="vip-summary">{vipNote}</p>
        </div>

        <div className="profile-guidance">
          <h4>Nhanh</h4>
          <ul>
            <li>Đơn hàng đầu tiên được giảm 5%</li>
            <li>VIP 10% khi chi tiêu 25 triệu</li>
            <li>VIP 15% khi chi tiêu 45 triệu</li>
          </ul>
        </div>

        <div className="profile-activity">
          <h4>Hoạt động gần đây</h4>
          {recentActivities.length ? (
            <ul>
              {recentActivities.map((activity) => (
                <li key={activity.id}>
                  <div>
                    <strong>{activity.label}</strong>
                    <span>{activity.detail}</span>
                  </div>
                  <small>{activity.date} • {activity.status}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>Chưa có hoạt động gần đây. Bắt đầu mua sắm để xem lịch sử ở đây.</p>
          )}
        </div>
      </div>
    </div>
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
                  <p>{product.brand}</p>
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

      <section className="profile-section" id="order-history">
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
