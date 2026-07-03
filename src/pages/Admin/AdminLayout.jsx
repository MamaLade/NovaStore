import { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { FaBox, FaChartBar, FaHome, FaSignOutAlt, FaUsers, FaTimes, FaBars } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import "./AdminLayout.css";

function AdminLayout() {
  const { user, logout } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (user?.role !== "admin") {
    return (
      <div className="admin-access-denied">
        <h2>Không có quyền truy cập</h2>
        <p>Bạn cần tài khoản admin để truy cập trang này.</p>
        <button onClick={() => navigate("/")}>Về trang chủ</button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { path: "/admin", icon: FaChartBar, label: "Dashboard" },
    { path: "/admin/products", icon: FaBox, label: "Sản phẩm" },
    { path: "/admin/orders", icon: FaHome, label: "Đơn hàng" },
    { path: "/admin/users", icon: FaUsers, label: "Người dùng" },
  ];

  return (
    <div className="admin-layout">
      <button 
        className="admin-mobile-toggle" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FaBars />
      </button>

      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <button 
          className="admin-sidebar-close" 
          onClick={() => setSidebarOpen(false)}
        >
          <FaTimes />
        </button>

        <div className="admin-sidebar-header">
          <h2>NovaStore Admin</h2>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      <div className="admin-overlay" 
           onClick={() => setSidebarOpen(false)}
           style={{ display: sidebarOpen ? 'block' : 'none' }}
      ></div>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
