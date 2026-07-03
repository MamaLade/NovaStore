import { useMemo, useState } from "react";
import { FaEnvelope, FaLock, FaTimes, FaUser } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import "./AuthModal.css";

function AuthModal({ mode = "login", onClose, onSwitchMode }) {
  const { login, register } = useCart();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const isRegister = mode === "register";

  const title = useMemo(() => {
    return isRegister ? "Tạo tài khoản" : "Đăng nhập";
  }, [isRegister]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isRegister && form.name.trim().length < 2) {
      setMessage("Vui lòng nhập họ tên hợp lệ.");
      return;
    }

    if (!form.email.includes("@")) {
      setMessage("Email chưa hợp lệ.");
      return;
    }

    if (form.password.length < 6) {
      setMessage("Mật khẩu cần ít nhất 6 ký tự.");
      return;
    }

    const result = isRegister ? register(form) : login(form);
    setMessage(result.message);

    if (result.ok) {
      showToast(result.message, "success");
      onClose?.();
    } else {
      showToast(result.message, "error");
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <form className="auth-modal" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose} type="button" aria-label="Đóng">
          <FaTimes />
        </button>

        <div className="auth-heading">
          <span>Tài khoản NovaStore</span>
          <h2>{title}</h2>
          <p>{isRegister ? "Nhận ưu đãi và theo dõi đơn hàng dễ dàng hơn." : "Tiếp tục mua sắm và quản lý đơn hàng của bạn."}</p>
        </div>

        {isRegister && (
          <label className="auth-field">
            <FaUser />
            <input
              value={form.name}
              placeholder="Họ và tên"
              onChange={(e) => updateField("name", e.target.value)}
            />
          </label>
        )}

        <label className="auth-field">
          <FaEnvelope />
          <input
            value={form.email}
            placeholder="Email"
            type="email"
            onChange={(e) => updateField("email", e.target.value)}
          />
        </label>

        <label className="auth-field">
          <FaLock />
          <input
            value={form.password}
            placeholder="Mật khẩu"
            type="password"
            onChange={(e) => updateField("password", e.target.value)}
          />
        </label>

        {message && <p className="auth-message">{message}</p>}

        <button className="auth-submit" type="submit">
          {isRegister ? "Đăng ký" : "Đăng nhập"}
        </button>

        <button className="auth-switch" type="button" onClick={onSwitchMode}>
          {isRegister ? "Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Đăng ký"}
        </button>
      </form>
    </div>
  );
}

export default AuthModal;
