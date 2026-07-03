import "./Cart.css";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatters";

function Cart({ isOpen, onClose }) {
  const {
    cart,
    increase,
    decrease,
    removeItem,
    clearCart,
    totalPrice,
    shippingFee,
    grandTotal,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-box" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Giỏ hàng ({cart.length})</h2>
          <button onClick={onClose} aria-label="Đóng giỏ hàng">
            ×
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="empty">
            <h3>Giỏ hàng trống</h3>
            <p>Hãy thêm sản phẩm để tiếp tục mua sắm.</p>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {cart.map((item) => (
                <div className="cart-item" key={item.cartKey || item.id}>
                  <img src={item.image} alt={item.name} />

                  <div className="info">
                    <h4>{item.name}</h4>
                    <p>{formatCurrency(item.price)}</p>
                    <small>
                      {item.selectedSize && `Size: ${item.selectedSize}`}
                      {item.selectedSize && item.selectedColor && " - "}
                      {item.selectedColor && `Màu: ${item.selectedColor}`}
                    </small>
                    <small>
                      Thành tiền: {formatCurrency(item.price * item.quantity)}
                    </small>
                  </div>

                  <div className="qty">
                    <button onClick={() => decrease(item.cartKey || item.id)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increase(item.cartKey || item.id)}>+</button>
                  </div>

                  <button className="remove" onClick={() => removeItem(item.cartKey || item.id)}>
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="price-row">
                <span>Tạm tính</span>
                <b>{formatCurrency(totalPrice)}</b>
              </div>

              <div className="price-row">
                <span>Phí vận chuyển</span>
                <b>{formatCurrency(shippingFee)}</b>
              </div>

              <div className="price-row total">
                <span>Tổng cộng</span>
                <b>{formatCurrency(grandTotal)}</b>
              </div>

              <button className="clear-btn" onClick={clearCart}>
                Xóa toàn bộ
              </button>

              <Link to="/checkout" className="checkout-btn" onClick={onClose}>
                Thanh toán
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
