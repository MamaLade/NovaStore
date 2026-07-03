import "./Cart.css";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatters";

function MiniCart({ isOpen, onClose }) {
  const { cart, totalPrice, totalQuantity } = useCart();

  if (!isOpen) return null;

  return (
    <div className="mini-cart-overlay" onClick={onClose}>
      <div className="mini-cart" onClick={(e) => e.stopPropagation()}>
        <h3>Giỏ hàng ({totalQuantity})</h3>

        {cart.length === 0 ? (
          <div className="empty">
            <p>Giỏ hàng trống</p>
          </div>
        ) : (
          <>
            {cart.slice(0, 3).map((item) => (
              <div key={item.cartKey || item.id} className="mini-item">
                <img src={item.image} alt={item.name} width={45} height={45} />

                <div style={{ flex: 1, marginLeft: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                  <small>{formatCurrency(item.price)}</small>
                  {(item.selectedSize || item.selectedColor) && (
                    <small>{[item.selectedSize, item.selectedColor].filter(Boolean).join(" / ")}</small>
                  )}
                </div>

                <b>x{item.quantity}</b>
              </div>
            ))}

            {cart.length > 3 && (
              <p style={{ textAlign: "center", marginTop: 10, color: "#888" }}>
                + {cart.length - 3} sản phẩm khác
              </p>
            )}

            <div className="mini-footer">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <span>Tổng tiền</span>
                <b>{formatCurrency(totalPrice)}</b>
              </div>

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

export default MiniCart;
