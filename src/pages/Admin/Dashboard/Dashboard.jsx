import { useMemo } from "react";
import { FaBox, FaChartBar, FaShoppingCart, FaUsers } from "react-icons/fa";
import { useCart } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../../utils/formatters";
import "./Dashboard.css";

function Dashboard() {
  const { orders, users, products } = useCart();
  const navigate = useNavigate();

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

  const revenueTrend = useMemo(() => {
    const months = [...Array(6)].map((_, idx) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - idx));
      return {
        label: date.toLocaleString("vi-VN", { month: "short", year: "2-digit" }),
        total: 0,
      };
    });

    (orders || []).forEach((order) => {
      const orderDate = new Date(order.id);
      if (Number.isNaN(orderDate.getTime())) return;
      const label = orderDate.toLocaleString("vi-VN", { month: "short", year: "2-digit" });
      const month = months.find((item) => item.label === label);
      if (month) {
        month.total += order.total || 0;
      }
    });

    return months;
  }, [orders]);

  const bestSellingProducts = useMemo(() => {
    const salesCount = {};
    (orders || []).forEach((order) => {
      (order.items || []).forEach((item) => {
        const productId = item.id || item.productId;
        if (!productId) return;
        salesCount[productId] = (salesCount[productId] || 0) + (item.quantity || 1);
      });
    });

    return [...(products || [])]
      .map((product) => ({
        ...product,
        salesCount: salesCount[product.id] || 0,
      }))
      .filter((product) => product.salesCount > 0)
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 5);
  }, [products, orders]);

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

        <div className="stat-card users" onClick={() => navigate('/admin/users')}>
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

      <div className="dashboard-charts">
        <div className="chart-card">
          <div className="chart-header">
            <h2>Biểu đồ doanh thu</h2>
            <span>6 tháng gần nhất</span>
          </div>
          <div className="chart-body">
            <div className="chart-grid">
              {revenueTrend.map((item) => {
                const maxValue = Math.max(...revenueTrend.map((row) => row.total));
                const barHeight = maxValue > 0 ? (item.total / maxValue) * 100 : 5;
                return (
                  <div key={item.label} className="chart-bar">
                    <div className="bar-fill" style={{ height: `${barHeight}%` }} />
                    <span className="chart-label">{item.label}</span>
                    <span className="chart-value">{formatCurrency(item.total)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="top-products-card">
          <div className="chart-header">
            <h2>Sản phẩm bán chạy</h2>
            <span>Top 5 theo doanh số</span>
          </div>
          <div className="products-list">
            {bestSellingProducts.length === 0 ? (
              <div className="empty-state">Chưa có dữ liệu sản phẩm bán chạy.</div>
            ) : (
              bestSellingProducts.map((product, index) => (
                <div key={product.id} className="product-row">
                  <div>
                    <span className="product-rank">#{index + 1}</span>
                    <div className="product-name">{product.name}</div>
                    <div className="product-brand">{product.brand}</div>
                  </div>
                  <div className="product-sales">{product.salesCount} bán</div>
                </div>
              ))
            )}
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
