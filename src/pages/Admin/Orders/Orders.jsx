import { useState, useMemo } from "react";
import { FaEye, FaSearch } from "react-icons/fa";
import { useCart } from "../../../context/CartContext";
import { formatCurrency } from "../../../utils/formatters";
import "./Orders.css";

function Orders() {
  const { orders, updateOrderStatus } = useCart();
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = useMemo(() => {
    if (!search) return orders;
    const keyword = search.toLowerCase();
    return orders.filter(
      (order) =>
        order.id.toString().includes(keyword) ||
        (order.customer?.name || "").toLowerCase().includes(keyword) ||
        (order.status || "").toLowerCase().includes(keyword)
    );
  }, [orders, search]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null);
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusColor = (status) => {
    const statusLower = (status || "").toLowerCase();
    if (statusLower.includes("hoàn thành") || statusLower.includes("completed")) {
      return "completed";
    }
    if (statusLower.includes("hủy") || statusLower.includes("cancel")) {
      return "cancelled";
    }
    return "pending";
  };

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-header">
        <h1>Quản lý đơn hàng</h1>
      </div>

      <div className="admin-orders-search">
        <FaSearch />
        <input
          type="text"
          placeholder="Tìm kiếm đơn hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="admin-orders-table">
        <table>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày đặt</th>
              <th>Khách hàng</th>
              <th>Số lượng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  Không có đơn hàng nào
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.createdAt}</td>
                  <td>{order.customer?.name || "Khách"}</td>
                  <td>{order.items?.length || 0} sản phẩm</td>
                  <td>{formatCurrency(order.total)}</td>
                  <td>
                    <span className={`status ${getStatusColor(order.status)}`}>
                      {order.status || "Đang xử lý"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => handleViewOrder(order)}
                      title="Xem chi tiết"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={handleCloseDetail}>
          <div className="modal-content order-detail" onClick={(e) => e.stopPropagation()}>
            <div className="order-detail-header">
              <h2>Chi tiết đơn hàng #{selectedOrder.id}</h2>
              <button className="btn-close" onClick={handleCloseDetail}>
                ×
              </button>
            </div>

            <div className="order-detail-info">
              <div className="info-group">
                <label>Ngày đặt:</label>
                <span>{selectedOrder.createdAt}</span>
              </div>
              <div className="info-group">
                <label>Khách hàng:</label>
                <span>{selectedOrder.customer?.name || "Khách"}</span>
              </div>
              <div className="info-group">
                <label>Số điện thoại:</label>
                <span>{selectedOrder.customer?.phone || "N/A"}</span>
              </div>
              <div className="info-group">
                <label>Địa chỉ:</label>
                <span>{selectedOrder.customer?.address || "N/A"}</span>
              </div>
              <div className="info-group">
                <label>Ghi chú:</label>
                <span>{selectedOrder.customer?.note || "Không có"}</span>
              </div>
            </div>

            <div className="order-detail-items">
              <h3>Sản phẩm</h3>
              {selectedOrder.items?.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                    {item.selectedSize && <small>Size: {item.selectedSize}</small>}
                    {item.selectedColor && <small>Màu: {item.selectedColor}</small>}
                  </div>
                  <b>{formatCurrency(item.price * item.quantity)}</b>
                </div>
              ))}
            </div>

            <div className="order-detail-total">
              <div className="total-row">
                <span>Tổng tiền:</span>
                <b>{formatCurrency(selectedOrder.total)}</b>
              </div>
            </div>

            <div className="order-detail-status">
              <label>Trạng thái:</label>
              <select
                value={selectedOrder.status || "Đang xử lý"}
                onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
              >
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Đang giao">Đang giao</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
