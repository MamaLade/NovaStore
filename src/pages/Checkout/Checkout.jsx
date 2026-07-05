import "./Checkout.css";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { formatCurrency, formatOrderDate } from "../../utils/formatters";
import { FaCreditCard, FaMoneyBillWave, FaUniversity, FaTruck, FaCheckCircle, FaMapMarkerAlt, FaPhone, FaUser } from "react-icons/fa";
import { useNotifications } from "../../context/NotificationContext";

const fallbackAddressData = {
  provinces: [
    { id: "01", label: "Hà Nội" },
    { id: "79", label: "Thành phố Hồ Chí Minh" },
    { id: "48", label: "Thành phố Đà Nẵng" },
  ],
  districts: {
    "01": [
      { id: "001", label: "Quận Ba Đình" },
      { id: "004", label: "Quận Hoàn Kiếm" },
      { id: "017", label: "Quận Cầu Giấy" },
      { id: "013", label: "Quận Thanh Xuân" },
      { id: "007", label: "Quận Đống Đa" },
    ],
    "79": [
      { id: "760", label: "Quận 1" },
      { id: "765", label: "Quận Bình Thạnh" },
      { id: "766", label: "Quận Tân Bình" },
      { id: "773", label: "Quận 12" },
      { id: "783", label: "Huyện Củ Chi" },
    ],
    "48": [
      { id: "490", label: "Quận Liên Chiểu" },
      { id: "493", label: "Quận Thanh Khê" },
      { id: "495", label: "Quận Cẩm Lệ" },
      { id: "497", label: "Huyện Hòa Vang" },
    ],
  },
  wards: {
    "001": [
      { id: "00001", label: "Phường Phúc Xá" },
      { id: "00004", label: "Phường Trúc Bạch" },
      { id: "00006", label: "Phường Vĩnh Phúc" },
    ],
    "760": [
      { id: "26734", label: "Phường Tân Định" },
      { id: "26737", label: "Phường Đa Kao" },
      { id: "26740", label: "Phường Bến Nghé" },
    ],
    "490": [
      { id: "20264", label: "Phường Hòa Hiệp Bắc" },
      { id: "20267", label: "Phường Hòa Hiệp Nam" },
      { id: "20270", label: "Phường Hòa Khánh Bắc" },
    ],
  },
};

const remoteAddressUrl = "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json";

function parseVietnamAddress(rawProvinces) {
  const provinces = rawProvinces.map((province) => ({
    id: province.Id,
    label: province.Name,
  }));

  const districts = {};
  const wards = {};

  rawProvinces.forEach((province) => {
    districts[province.Id] = (province.Districts || []).map((district) => {
      wards[district.Id] = (district.Wards || []).map((ward) => ({
        id: ward.Id,
        label: ward.Name,
      }));

      return {
        id: district.Id,
        label: district.Name,
      };
    });
  });

  return { provinces, districts, wards };
}

function Checkout() {
  const [addressData, setAddressData] = useState(fallbackAddressData);
  const [addressLoading, setAddressLoading] = useState(true);

  useEffect(() => {
    const loadAddressData = async () => {
      try {
        const response = await fetch(remoteAddressUrl);
        if (!response.ok) {
          throw new Error("Failed to load address data");
        }

        const rawData = await response.json();
        const parsed = parseVietnamAddress(rawData);
        setAddressData(parsed);
      } catch (error) {
        console.warn("Could not fetch full Vietnam address data:", error);
      } finally {
        setAddressLoading(false);
      }
    };

    loadAddressData();
  }, []);

  const {
    cart,
    totalPrice,
    shippingFee,
    grandTotal,
    clearCart,
    orders,
    setOrders,
    user,
  } = useCart();

  const userOrders = useMemo(() => {
    return user ? orders.filter((order) => order.userId === user.id) : [];
  }, [orders, user?.id]);

  const userTotalSpent = useMemo(() => {
    return userOrders.reduce(
      (sum, order) => sum + (order.originalTotal ?? order.total ?? 0),
      0
    );
  }, [userOrders]);

  const isFirstOrder = Boolean(user && userOrders.length === 0);
  const vipRate = user && !isFirstOrder
    ? userTotalSpent >= 45000000
      ? 0.15
      : userTotalSpent >= 25000000
      ? 0.10
      : 0
    : 0;

  const discountRate = isFirstOrder ? 0.05 : vipRate;
  const discountAmount = Math.round(grandTotal * discountRate);
  const finalTotal = grandTotal - discountAmount;

  const voucherMessage = user
    ? isFirstOrder
      ? "Bạn được giảm 5% cho lần mua đầu tiên."
      : vipRate >= 0.15
      ? "Khách VIP bạch kim: giảm 15% cho tổng bill."
      : vipRate >= 0.10
      ? "Khách VIP: giảm 10% cho tổng bill."
      : "Bạn đã không còn voucher lần đầu. Mua thêm để đạt VIP và được giảm giá tự động."
    : "Đăng nhập để nhận voucher 5% cho đơn hàng đầu tiên.";

  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    note: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!cart.length) return;

    if (!form.name || !form.phone || !form.address) {
      showToast("Vui lòng nhập đầy đủ thông tin giao hàng", "error");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      showToast("Số điện thoại không hợp lệ", "error");
      return;
    }

    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      const order = {
        id: Date.now(),
        userId: user?.id || null,
        items: cart,
        originalTotal: grandTotal,
        discountRate,
        discountAmount,
        total: finalTotal,
        customer: form,
        paymentMethod,
        createdAt: formatOrderDate(),
        status: "Đang xử lý",
      };

      setOrders([order, ...orders]);
      clearCart();
      showToast("Đặt hàng thành công!", "success");

      addNotification({
        type: "order",
        title: "Đặt hàng thành công",
        message: `Đơn hàng #${order.id} của bạn đã được xác nhận. Tổng giá trị: ${formatCurrency(finalTotal)}`,
      });
      
      navigate("/");
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Thanh toán</h1>
        <p>Hoàn tất đơn hàng một cách nhanh chóng và an toàn. Kiểm tra lại thông tin giao hàng, chọn phương thức thanh toán và xác nhận.</p>
        <div className="checkout-steps">
          <div className="step active">
            <span className="step-number">1</span>
            <span className="step-label">Thông tin</span>
          </div>
          <div className="step-line"></div>
          <div className="step active">
            <span className="step-number">2</span>
            <span className="step-label">Thanh toán</span>
          </div>
          <div className="step-line"></div>
          <div className="step">
            <span className="step-number">3</span>
            <span className="step-label">Hoàn tất</span>
          </div>
        </div>
      </div>

      <div className="checkout-container">
        <div className="checkout-left">
          <div className="checkout-section">
            <h2>
              <FaUser /> Thông tin giao hàng
            </h2>
            <p className="section-description">Nhập thông tin chính xác để NovaStore giao hàng đúng hẹn và tránh phát sinh lỗi.</p>

            <div className="shipping-form-grid">
              <div className="form-group">
                <label>Họ và tên *</label>
                <div className="input-wrapper">
                  <FaUser className="input-icon" />
                  <input
                    placeholder="Nhập họ và tên của bạn"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Số điện thoại *</label>
                <div className="input-wrapper">
                  <FaPhone className="input-icon" />
                  <input
                    placeholder="Nhập số điện thoại (10 số)"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

            <div className="shipping-selector-grid">
              <div className="form-group">
                <label>Tỉnh / Thành *</label>
                <select
                  value={form.province}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      province: e.target.value,
                      district: "",
                      ward: "",
                    })
                  }
                >
                  <option value="">Chọn tỉnh / thành</option>
                  {addressData.provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quận / Huyện *</label>
                <select
                  value={form.district}
                  disabled={!form.province}
                  onChange={(e) =>
                    setForm({ ...form, district: e.target.value, ward: "" })
                  }
                >
                  <option value="">Chọn quận / huyện</option>
                  {(addressData.districts[form.province] || []).map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Phường / Xã *</label>
                <select
                  value={form.ward}
                  disabled={!form.district}
                  onChange={(e) => setForm({ ...form, ward: e.target.value })}
                >
                  <option value="">Chọn phường / xã</option>
                  {(addressData.wards[form.district] || []).map((ward) => (
                    <option key={ward.id} value={ward.id}>
                      {ward.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

              <div className="form-group full-width">
                <label>Địa chỉ cụ thể *</label>
                <textarea
                  placeholder="Số nhà, tên đường, tòa nhà, tầng..."
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>

              <div className="form-group full-width">
                <label>Ghi chú (tùy chọn)</label>
                <textarea
                  placeholder="Ghi chú thêm cho shipper, cổng vào, lối lên..."
                  rows={2}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>
            </div>

            <div className="shipping-overview-card">
              <div className="shipping-overview-header">
                <span className="shipping-badge">Giao hàng nhanh</span>
                <strong>{shippingFee === 0 ? "Miễn phí vận chuyển" : formatCurrency(shippingFee)}</strong>
              </div>
              <p>NovaStore giao hàng trong 2-5 ngày làm việc. Kiểm tra kỹ địa chỉ để tránh hoãn giao.</p>

              <div className="shipping-meta-grid">
                <div className="shipping-meta-item">
                  <FaMapMarkerAlt />
                  <div>
                    <span>Giao đến</span>
                    <strong>{form.address || "Chưa có địa chỉ"}</strong>
                  </div>
                </div>
                <div className="shipping-meta-item">
                  <FaMapMarkerAlt />
                  <div>
                    <span>Tỉnh / Thành</span>
                    <strong>{
                      addressData.provinces.find((item) => item.id === form.province)
                        ?.label || "Chưa chọn"
                    }</strong>
                  </div>
                </div>
                <div className="shipping-meta-item">
                  <FaMapMarkerAlt />
                  <div>
                    <span>Quận / Huyện</span>
                    <strong>{
                      (addressData.districts[form.province] || []).find(
                        (item) => item.id === form.district
                      )?.label || "Chưa chọn"
                    }</strong>
                  </div>
                </div>
                <div className="shipping-meta-item">
                  <FaMapMarkerAlt />
                  <div>
                    <span>Phường / Xã</span>
                    <strong>{
                      (addressData.wards[form.district] || []).find(
                        (item) => item.id === form.ward
                      )?.label || "Chưa chọn"
                    }</strong>
                  </div>
                </div>
                <div className="shipping-meta-item">
                  <FaPhone />
                  <div>
                    <span>Số liên hệ</span>
                    <strong>{form.phone || "Chưa có điện thoại"}</strong>
                  </div>
                </div>
                <div className="shipping-meta-item">
                  <FaUser />
                  <div>
                    <span>Người nhận</span>
                    <strong>{form.name || "Chưa có tên"}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <h2>
              <FaCreditCard /> Phương thức thanh toán
            </h2>
            
            <div className="payment-methods">
              <label className={`payment-option ${paymentMethod === "cod" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-content">
                  <FaMoneyBillWave className="payment-icon" />
                  <div className="payment-info">
                    <span className="payment-title">Thanh toán khi nhận hàng (COD)</span>
                    <span className="payment-desc">Thanh toán tiền mặt khi nhận sản phẩm</span>
                  </div>
                </div>
                <div className="payment-check">
                  <FaCheckCircle />
                </div>
              </label>

              <label className={`payment-option ${paymentMethod === "bank" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-content">
                  <FaUniversity className="payment-icon" />
                  <div className="payment-info">
                    <span className="payment-title">Chuyển khoản ngân hàng</span>
                    <span className="payment-desc">Chuyển khoản qua ngân hàng</span>
                  </div>
                </div>
                <div className="payment-check">
                  <FaCheckCircle />
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="checkout-right">
          <div className="order-summary-card">
            <h2>
              <FaTruck /> Đơn hàng ({cart.length} sản phẩm)
            </h2>

            <div className="order-items">
              {cart.map((item) => (
                <div key={item.cartKey || item.id} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    <span className="item-variant">
                      {item.selectedSize && `Size: ${item.selectedSize}`}
                      {item.selectedSize && item.selectedColor && " | "}
                      {item.selectedColor && `Màu: ${item.selectedColor}`}
                    </span>
                    <span className="item-quantity">x{item.quantity}</span>
                  </div>
                  <b className="item-price">{formatCurrency(item.price * item.quantity)}</b>
                </div>
              ))}
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Tạm tính</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>

              <div className="price-row">
                <span>Phí vận chuyển</span>
                <span>{shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}</span>
              </div>

              {totalPrice >= 500000 && (
                <div className="discount-row">
                  <span>🎉 Miễn phí vận chuyển</span>
                  <span>-{formatCurrency(shippingFee)}</span>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="discount-row voucher-discount">
                  <span>{isFirstOrder ? "Voucher lần đầu mua" : `Ưu đãi VIP (${discountRate * 100}%)`}</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="price-row total-row">
                <span>Tổng cộng</span>
                <span className="total-amount">{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            <div className="voucher-note">
              <p>{voucherMessage}</p>
              {user && !isFirstOrder && vipRate === 0 && (
                <p>Hiện tại bạn cần đạt {formatCurrency(25000000 - userTotalSpent)} nữa để trở thành VIP 10%.</p>
              )}
              {user && !isFirstOrder && vipRate > 0 && (
                <p>Bạn đã chi {formatCurrency(userTotalSpent)} cho đơn hàng trước. Tiếp tục mua để giữ ưu đãi VIP.</p>
              )}
            </div>

            <button 
              className={`checkout-btn ${isProcessing ? "processing" : ""}`}
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="spinner"></span>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  Xác nhận đặt hàng
                </>
              )}
            </button>

            <div className="checkout-note">
              <p>🔒 Thông tin thanh toán của bạn được bảo mật</p>
              <p>📦 Đơn hàng sẽ được giao trong 2-5 ngày làm việc</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
