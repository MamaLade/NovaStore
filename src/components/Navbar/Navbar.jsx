import "./Navbar.css";
import {
  FaHeart,
  FaMoon,
  FaSearch,
  FaShoppingBag,
  FaShoppingCart,
  FaSignOutAlt,
  FaSun,
  FaUser,
  FaCog,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import NotificationCenter from "../NotificationCenter/NotificationCenter";

function Navbar({ openCart, search, setSearch, openAuth }) {
  const { totalQuantity, wishlistCount, user, logout } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user) {
      navigate("/profile");
      return;
    }

    openAuth?.("login");
  };

  const handleLogout = () => {
    logout();
    showToast("Đã đăng xuất.", "info");
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <button className="logo" onClick={() => navigate("/")} type="button">
          <span className="logo-mark">
            <FaShoppingBag />
          </span>
          <span>NovaStore</span>
        </button>

        <div className="search">
          <FaSearch />
          <input
            value={search}
            placeholder="Tìm sản phẩm, thương hiệu..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="actions">
          <button
            className="nav-icon-btn"
            onClick={toggleTheme}
            type="button"
            aria-label={theme === "dark" ? "Bật sáng" : "Bật tối"}
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          <button className="nav-icon-btn" onClick={() => navigate("/profile")} type="button">
            <FaHeart />
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </button>

          <NotificationCenter />

          <button className="nav-icon-btn" onClick={openCart} type="button">
            <FaShoppingCart />
            {totalQuantity > 0 && <span className="badge">{totalQuantity}</span>}
          </button>

          {user ? (
            <div className="user-menu">
              {user.role === "admin" && (
                <button className="admin-btn" onClick={() => navigate("/admin")} type="button">
                  <FaCog />
                  <span>Admin</span>
                </button>
              )}
              <button className="user-chip" onClick={handleProfileClick} type="button">
                <FaUser />
                <span>{user.name}</span>
              </button>

              <button className="logout-btn" onClick={handleLogout} type="button">
                <FaSignOutAlt />
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            <div className="auth-actions">
              <button className="login-btn" onClick={() => openAuth?.("login")} type="button">
                Đăng nhập
              </button>
              <button className="register-btn" onClick={() => openAuth?.("register")} type="button">
                Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
