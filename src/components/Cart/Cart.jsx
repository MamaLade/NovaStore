import "./Cart.css";
import { useCart } from "../../context/CartContext";

function Cart({ isOpen, onClose }) {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    totalPrice,
  } = useCart();

  return (
    <div
      className={`cart-overlay ${isOpen ? "show" : ""}`}
      onClick={onClose}
    >
      <div
        className="cart-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-header">
          <h2>🛒 Giỏ hàng</h2>

          <button onClick={onClose}>✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <h3>Giỏ hàng đang trống</h3>
            <p>Hãy thêm sản phẩm để bắt đầu mua sắm.</p>
          </div>
        ) : (
          <>
            <div className="cart-body">
              {cart.map((item) => (
                <div
                  className="cart-item"
                  key={item.id}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="cart-info">
                    <h4>{item.name}</h4>

                    <p className="price">
                      {item.price.toLocaleString()}₫
                    </p>

                    <div className="quantity">
                      <button
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() =>
                        removeItem(item.id)
                      }
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <h3>
                Tổng tiền:{" "}
                {totalPrice.toLocaleString()}₫
              </h3>

              <button
                className="checkout-btn"
                onClick={() => {
                  alert("Thanh toán thành công!");
                  clearCart();
                  onClose();
                }}
              >
                Thanh toán
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;