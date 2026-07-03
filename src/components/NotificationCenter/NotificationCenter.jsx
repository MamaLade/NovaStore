import { useState } from "react";
import { FaBell, FaCheck, FaTrash, FaTimes, FaShoppingBag, FaBox, FaTruck, FaCheckCircle } from "react-icons/fa";
import { useNotifications } from "../../context/NotificationContext";
import "./NotificationCenter.css";

function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <FaShoppingBag />;
      case "product":
        return <FaBox />;
      case "shipping":
        return <FaTruck />;
      case "success":
        return <FaCheckCircle />;
      default:
        return <FaBell />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return "Vừa xong";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="notification-center">
      <button
        className="notification-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBell className="bell-icon" />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <>
          <div className="notification-overlay" onClick={() => setIsOpen(false)}></div>
          <div className="notification-dropdown">
            <div className="notification-header">
              <h3>Thông báo</h3>
              <div className="notification-actions">
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="action-link">
                    Đánh dấu đã đọc
                  </button>
                )}
                {notifications.length > 0 && (
                  <button onClick={clearAll} className="action-link">
                    Xóa tất cả
                  </button>
                )}
              </div>
            </div>

            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="notification-empty">
                  <FaBell className="empty-icon" />
                  <p>Chưa có thông báo nào</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${!notification.read ? "unread" : ""}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <p className="notification-title">{notification.title}</p>
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">{formatTime(notification.createdAt)}</span>
                    </div>
                    <button
                      className="notification-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationCenter;
