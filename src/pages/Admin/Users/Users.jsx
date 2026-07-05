import { useState, useMemo } from "react";
import { FaCommentDots, FaEdit, FaSearch, FaTrash, FaUserShield, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import "./Users.css";

function Users() {
  const navigate = useNavigate();
  const { users, updateUserRole, deleteUser, createUser } = useCart();
  const [search, setSearch] = useState("");
  const [originFilter, setOriginFilter] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const websiteUsers = useMemo(() => {
    return (users || []).filter((user) => user.origin === "website");
  }, [users]);

  const adminCreatedUsers = useMemo(() => {
    return (users || []).filter((user) => user.origin === "admin");
  }, [users]);

  const filteredUsers = useMemo(() => {
    const list = users || [];
    const cleanedSearch = search.toLowerCase().trim();
    let result = list;

    if (originFilter !== "all") {
      result = result.filter((user) => user.origin === originFilter);
    }

    if (!cleanedSearch) return result;

    return result.filter(
      (user) =>
        user.name?.toLowerCase().includes(cleanedSearch) ||
        user.email?.toLowerCase().includes(cleanedSearch)
    );
  }, [users, search, originFilter]);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      updateUserRole(editingUser.id, formData.role);
    } else {
      createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password || "123456",
        role: formData.role,
      });
    }
    handleCloseModal();
  };

  const handleDelete = (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      deleteUser(userId);
    }
  };

  const getRoleBadge = (role) => {
    if (role === "admin") {
      return <span className="role-badge admin">Admin</span>;
    }
    return <span className="role-badge user">User</span>;
  };

  return (
    <div className="admin-users-page">
      <div className="admin-users-header">
        <div>
          <h1>Quản lý người dùng</h1>
          <p>Quản lý vai trò và xem danh sách người dùng đã đăng ký thực tế trên web.</p>
        </div>
        <button className="btn-create-user" onClick={() => handleOpenModal()}>
          <FaPlus /> Thêm người dùng
        </button>
      </div>

      <div className="admin-users-summary">
        <div className="summary-card">
          <span>Đã đăng ký trên web</span>
          <strong>{websiteUsers.length}</strong>
        </div>
        <div className="summary-card">
          <span>Được tạo bởi admin</span>
          <strong>{adminCreatedUsers.length}</strong>
        </div>
      </div>

      <div className="admin-users-filters">
        <button
          className={originFilter === "all" ? "active" : ""}
          onClick={() => setOriginFilter("all")}
          type="button"
        >
          Tất cả
        </button>
        <button
          className={originFilter === "website" ? "active" : ""}
          onClick={() => setOriginFilter("website")}
          type="button"
        >
          Website
        </button>
        <button
          className={originFilter === "admin" ? "active" : ""}
          onClick={() => setOriginFilter("admin")}
          type="button"
        >
          Admin
        </button>
      </div>

      <div className="admin-users-search">
        <FaSearch />
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="admin-users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Nguồn</th>
              <th>Vai trò</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  Không có người dùng nào
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>{user.name || "N/A"}</td>
                  <td>{user.email || "N/A"}</td>
                  <td>{user.origin === "website" ? "Website" : "Admin"}</td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>
                                    <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleOpenModal(user)}
                          title="Sửa vai trò"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-view-chat"
                          onClick={() => navigate(`/admin/chat?thread=user-${user.id}`)}
                          title="Xem chat"
                        >
                          <FaCommentDots />
                        </button>
                        {user.role !== "admin" && (
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(user.id)}
                            title="Xóa"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingUser ? "Sửa vai trò người dùng" : "Thêm người dùng mới"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên</label>
                <input
                  type="text"
                  value={formData.name}
                  disabled={Boolean(editingUser)}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled={Boolean(editingUser)}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {!editingUser && (
                <div className="form-group">
                  <label>Mật khẩu</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Mật khẩu mặc định 123456"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Vai trò</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  {editingUser ? "Cập nhật" : "Tạo người dùng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
