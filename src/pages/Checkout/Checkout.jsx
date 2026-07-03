import "./Checkout.css";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { formatCurrency, formatOrderDate } from "../../utils/formatters";
import { FaCreditCard, FaMoneyBillWave, FaUniversity, FaTruck, FaCheckCircle, FaMapMarkerAlt, FaPhone, FaUser } from "react-icons/fa";
import { useNotifications } from "../../context/NotificationContext";

function Checkout() {
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

  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
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
        items: cart,
        total: grandTotal,
        customer: form,
        paymentMethod,
        createdAt: formatOrderDate(),
        status: "Đang xử lý",
      };

      setOrders([order, ...orders]);
      clearCart();
      showToast("Đặt hàng thành công!", "success");
      
      // Add notification
      addNotification({
        type: "order",
        title: "Đặt hàng thành công",
        message: `Đơn hàng #${order.id} của bạn đã được xác nhận. Tổng giá trị: ${formatCurrency(grandTotal)}`,
      });
      
      navigate("/");
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Thanh toán</h1>
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

            <div className="form-group">
              <label>Địa chỉ giao hàng *</label>
              <div className="input-wrapper">
                <FaMapMarkerAlt className="input-icon" />
                <textarea
                  placeholder="Nhập địa chỉ giao hàng chi tiết"
                  rows={3}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Ghi chú (tùy chọn)</label>
              <textarea
                placeholder="Nhập ghi chú cho đơn hàng (nếu có)"
                rows={2}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
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

              <div className="price-row total-row">
                <span>Tổng cộng</span>
                <span className="total-amount">{formatCurrency(grandTotal)}</span>
              </div>
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
