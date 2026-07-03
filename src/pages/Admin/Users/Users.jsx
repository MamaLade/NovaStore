import { useState, useMemo } from "react";
import { FaEdit, FaSearch, FaTrash, FaUserShield } from "react-icons/fa";
import { useCart } from "../../../context/CartContext";
import "./Users.css";

function Users() {
  const { users, updateUserRole, deleteUser } = useCart();
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
  });

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const keyword = search.toLowerCase();
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(keyword) ||
        user.email?.toLowerCase().includes(keyword)
    );
  }, [users, search]);

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
        <h1>Quản lý người dùng</h1>
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
              <th>Vai trò</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  Không có người dùng nào
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>{user.name || "N/A"}</td>
                  <td>{user.email || "N/A"}</td>
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
            <h2>Sửa vai trò người dùng</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên</label>
                <input
                  type="text"
                  value={formData.name}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="disabled-input"
                />
              </div>

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
                  Cập nhật
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
