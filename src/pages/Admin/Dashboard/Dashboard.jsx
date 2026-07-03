import { useMemo } from "react";
import { FaBox, FaChartBar, FaShoppingCart, FaUsers } from "react-icons/fa";
import { useCart } from "../../../context/CartContext";
import { formatCurrency } from "../../../utils/formatters";
import "./Dashboard.css";

function Dashboard() {
  const { orders, users, products } = useCart();

  const stats = useMemo(() => {
    const totalRevenue = (orders || []).reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = (orders || []).length;
    const totalUsers = (users || []).length;
    const totalProducts = (products || []).length;

    return {
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
    };
  }, [orders, users, products]);

  const recentOrders = useMemo(() => {
    return (orders || []).slice(0, 5);
  }, [orders]);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="dashboard-subtitle">Tổng quan hoạt động cửa hàng</p>

      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-icon">
            <FaChartBar />
          </div>
          <div className="stat-content">
            <h3>Doanh thu</h3>
            <p className="stat-value">{formatCurrency(stats.totalRevenue)}</p>
            <span className="stat-label">Tổng doanh thu</span>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-icon">
            <FaShoppingCart />
          </div>
          <div className="stat-content">
            <h3>Đơn hàng</h3>
            <p className="stat-value">{stats.totalOrders}</p>
            <span className="stat-label">Tổng đơn hàng</span>
          </div>
        </div>

        <div className="stat-card products">
          <div className="stat-icon">
            <FaBox />
          </div>
          <div className="stat-content">
            <h3>Sản phẩm</h3>
            <p className="stat-value">{stats.totalProducts}</p>
            <span className="stat-label">Tổng sản phẩm</span>
          </div>
        </div>

        <div className="stat-card users">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Người dùng</h3>
            <p className="stat-value">{stats.totalUsers}</p>
            <span className="stat-label">Tổng người dùng</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Đơn hàng gần đây</h2>
        {recentOrders.length === 0 ? (
          <div className="empty-state">Chưa có đơn hàng nào</div>
        ) : (
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.createdAt}</td>
                    <td>{order.customer?.name || "Khách"}</td>
                    <td>{formatCurrency(order.total)}</td>
                    <td>
                      <span className={`status ${order.status?.toLowerCase() || "pending"}`}>
                        {order.status || "Đang xử lý"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
