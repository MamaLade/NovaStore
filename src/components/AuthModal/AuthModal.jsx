import { useMemo, useState } from "react";
import { FaEnvelope, FaLock, FaTimes, FaShoppingBag, FaUser, FaEye, FaEyeSlash, FaGoogle, FaFacebook } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import "./AuthModal.css";

function AuthModal({ mode = "login", onClose, onSwitchMode }) {
  const { login, register } = useCart();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isRegister = mode === "register";

  const title = useMemo(() => {
    return isRegister ? "Tạo tài khoản" : "Đăng nhập";
  }, [isRegister]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    if (isRegister && form.name.trim().length < 2) {
      setMessage("Vui lòng nhập họ tên hợp lệ.");
      setIsLoading(false);
      return;
    }

    if (!form.email.includes("@")) {
      setMessage("Email chưa hợp lệ.");
      setIsLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setMessage("Mật khẩu cần ít nhất 6 ký tự.");
      setIsLoading(false);
      return;
    }

    const result = isRegister ? register(form) : login(form);
    setMessage(result.message);

    if (result.ok) {
      showToast(result.message, "success");
      setTimeout(() => onClose?.(), 300);
    } else {
      showToast(result.message, "error");
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <form className="auth-modal" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose} type="button" aria-label="Đóng">
          <FaTimes />
        </button>

        <div className="auth-brand-panel">
          <div className="brand-badge">
            <FaShoppingBag />
          </div>
          <div className="brand-copy">
            <span>NovaStore</span>
            <h2>{title}</h2>
            <p>{isRegister ? "Tạo tài khoản để nhận ưu đãi và quản lý đơn hàng." : "Đăng nhập để tiếp tục mua sắm nhanh chóng."}</p>
            <ul>
              <li>Thanh toán nhanh chóng</li>
              <li>Quản lý đơn hàng dễ dàng</li>
              <li>Ưu đãi riêng cho thành viên</li>
            </ul>
          </div>
        </div>

        <div className="auth-form-panel">
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
              type={showPassword ? "text" : "password"}
              onChange={(e) => updateField("password", e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </label>

          {message && <p className="auth-message">{message}</p>}

          <button className="auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                {isRegister ? "Đang đăng ký..." : "Đang đăng nhập..."}
              </>
            ) : (
              isRegister ? "Đăng ký" : "Đăng nhập"
            )}
          </button>

          <div className="auth-divider">
            <span>hoặc tiếp tục với</span>
          </div>

          <div className="auth-social-list">
            <button className="auth-social-btn google" type="button" disabled>
              <FaGoogle /> Google
            </button>
            <button className="auth-social-btn facebook" type="button" disabled>
              <FaFacebook /> Facebook
            </button>
          </div>

          <p className="auth-note">
            Đăng nhập nhanh hơn, quản lý đơn hàng và sử dụng voucher dễ dàng.
          </p>

          <button className="auth-switch" type="button" onClick={onSwitchMode}>
            {isRegister ? "Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Đăng ký"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthModal;
