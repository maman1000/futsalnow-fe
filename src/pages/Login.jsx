import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      showToast("Selamat datang kembali! 🎉", "success");
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      const msg = err.response?.data?.message || "Login gagal. Coba lagi.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1 className="login-title">Masuk</h1>
          <p className="login-sub">Masuk ke akun Anda untuk melanjutkan.</p>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="login-options">
            <Link to="/forgot-password" className="forgot-link">
              Lupa password?
            </Link>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-sm"></span> Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </button>

          <p className="login-switch">
            Belum punya akun? <Link to="/register">Daftar di sini</Link>
          </p>
        </form>

        <div className="login-footer">
          <span>- FutsalNow -</span>
          <span>Booking Lapangan Futsal</span>
          <span>© 2026 FutsalNow</span>
        </div>
      </div>

      {/* ===== CSS ===== */}
      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: #f5f7fa;
        }

        .login-container {
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          padding: 2.5rem 2rem 1.5rem;
          border: 1px solid #e8ecf1;
        }

        /* ===== FORM ===== */
        .login-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          text-align: center;
          margin-bottom: 0.2rem;
        }
        .login-sub {
          text-align: center;
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }
        .form-label {
          display: block;
          font-weight: 500;
          color: #374151;
          font-size: 0.85rem;
          margin-bottom: 0.3rem;
        }

        .input-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 0.7rem;
          font-size: 1rem;
          color: #9ca3af;
          pointer-events: none;
        }
        .form-input {
          width: 100%;
          padding: 0.65rem 0.9rem 0.65rem 2.2rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: 0.2s;
          background: #fafafa;
        }
        .form-input:focus {
          outline: none;
          border-color: #1e293b;
          background: white;
          box-shadow: 0 0 0 4px rgba(30, 41, 59, 0.06);
        }

        .login-options {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1.5rem;
        }
        .forgot-link {
          font-size: 0.85rem;
          color: #1e293b;
          text-decoration: none;
          font-weight: 500;
        }
        .forgot-link:hover {
          text-decoration: underline;
        }

        .login-btn {
          width: 100%;
          padding: 0.75rem;
          background: #1e293b;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .login-btn:hover:not(:disabled) {
          background: #0f172a;
        }
        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner-sm {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #1e293b;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .login-switch {
          text-align: center;
          font-size: 0.9rem;
          color: #6b7280;
          margin-top: 1.25rem;
        }
        .login-switch a {
          color: #1e293b;
          font-weight: 500;
          text-decoration: none;
        }
        .login-switch a:hover {
          text-decoration: underline;
        }

        /* ===== FOOTER ===== */
        .login-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #e8ecf1;
          font-size: 0.75rem;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
