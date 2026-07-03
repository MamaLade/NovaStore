import { FaCheckCircle, FaBox, FaMapMarkerAlt, FaPhone, FaEnvelope, FaTruck, FaUser } from "react-icons/fa";
import { formatCurrency } from "../../utils/formatters";
import "./OrderConfirmationEmail.css";

function OrderConfirmationEmail({ order }) {
  if (!order) return null;

  return (
    <div className="email-template">
      <div className="email-header">
        <div className="email-logo">
          <h1>NovaStore</h1>
        </div>
        <div className="email-title">
          <FaCheckCircle className="success-icon" />
          <h2>Xác nhận đơn hàng</h2>
        </div>
        <p className="email-subtitle">
          Cảm ơn bạn đã đặt hàng tại NovaStore. Đơn hàng của bạn đã được xác nhận thành công.
        </p>
      </div>

      <div className="email-body">
        <div className="order-info-card">
          <h3>Thông tin đơn hàng</h3>
          <div className="info-row">
            <span>Mã đơn hàng:</span>
            <strong>#{order.id}</strong>
          </div>
          <div className="info-row">
            <span>Ngày đặt:</span>
            <strong>{order.createdAt}</strong>
          </div>
          <div className="info-row">
            <span>Phương thức thanh toán:</span>
            <strong>
              {order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản ngân hàng"}
            </strong>
          </div>
          <div className="info-row">
            <span>Trạng thái:</span>
            <strong className="status-processing">{order.status}</strong>
          </div>
        </div>

        <div className="customer-info-card">
          <h3>Thông tin giao hàng</h3>
          <div className="info-row">
            <span><FaUser /></span>
            <strong>{order.customer.name}</strong>
          </div>
          <div className="info-row">
            <span><FaPhone /></span>
            <strong>{order.customer.phone}</strong>
          </div>
          <div className="info-row">
            <span><FaMapMarkerAlt /></span>
            <strong>{order.customer.address}</strong>
          </div>
          {order.customer.note && (
            <div className="info-row">
              <span>Ghi chú:</span>
              <strong>{order.customer.note}</strong>
            </div>
          )}
        </div>

        <div className="order-items-card">
          <h3>Sản phẩm đã đặt</h3>
          <div className="items-list">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <p className="item-name">{item.name}</p>
                  <span className="item-variant">
                    {item.selectedSize && `Size: ${item.selectedSize}`}
                    {item.selectedSize && item.selectedColor && " | "}
                    {item.selectedColor && `Màu: ${item.selectedColor}`}
                  </span>
                  <span className="item-quantity">Số lượng: {item.quantity}</span>
                </div>
                <strong className="item-price">{formatCurrency(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="order-summary-card">
          <div className="summary-row">
            <span>Tạm tính:</span>
            <span>{formatCurrency(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}</span>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển:</span>
            <span>Miễn phí</span>
          </div>
          <div className="summary-row total">
            <span>Tổng cộng:</span>
            <strong>{formatCurrency(order.total)}</strong>
          </div>
        </div>

        <div className="shipping-info-card">
          <h3><FaTruck /> Thông tin giao hàng</h3>
          <p>Đơn hàng sẽ được giao trong vòng 2-5 ngày làm việc.</p>
          <p>Bạn sẽ nhận được thông báo khi đơn hàng được gửi đi.</p>
          <p>Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi:</p>
          <div className="contact-info">
            <div className="contact-item">
              <FaPhone />
              <span>0356 832 776</span>
            </div>
            <div className="contact-item">
              <FaEnvelope />
              <span>conganh14503@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="email-footer">
        <p>© {new Date().getFullYear()} NovaStore. Tất cả quyền được bảo lưu.</p>
        <p>Đây là email tự động, vui lòng không trả lời email này.</p>
      </div>
    </div>
  );
}

export default OrderConfirmationEmail;
