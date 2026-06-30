import "./Navbar.css";
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
} from "react-icons/fa";

import { useCart } from "../../context/CartContext";

function Navbar({ openCart }) {
  const { totalQuantity } = useCart();

  return (
    <nav className="navbar">
      <div className="logo">
        <h2>NovaStore</h2>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
        />

        <button>
          <FaSearch />
        </button>
      </div>

      <div className="menu">
        <a href="#">Trang chủ</a>
        <a href="#">Sản phẩm</a>
        <a href="#">Liên hệ</a>
      </div>

      <div className="actions">
        <FaUser className="icon" />

        <div className="cart" onClick={openCart}>
          <FaShoppingCart className="icon" />

          <span className="cart-count">
            {totalQuantity}
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;