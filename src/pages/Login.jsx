import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const year = new Date().getFullYear();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password);

      showToast("Selamat datang kembali!", "success");

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
          {/* Header */}
          <div className="login-header">
            <Link to="/" className="login-brand">
              FutsalNow
            </Link>

            <h1 className="login-title">Masuk</h1>

            <p className="login-sub">Masuk ke akun Anda untuk melanjutkan.</p>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>

            <div className="input-icon-wrapper">
              <EnvelopeIcon className="input-icon" />

              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>

            <div className="input-icon-wrapper">
              <LockClosedIcon className="input-icon" />

              <input
                id="password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {/* Forgot password */}
          <div className="login-options">
            <Link to="/forgot-password" className="forgot-link">
              Lupa password?
            </Link>
          </div>

          {/* Submit */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-sm"></span>
                Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </button>

          {/* Register */}
          <p className="login-switch">
            Belum punya akun? <Link to="/register">Daftar di sini</Link>
          </p>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <span>© {year} FutsalNow</span>
        </div>
      </div>

      <style>{`
        /* =========================
           LOGIN PAGE
        ========================= */

        .login-page {
          min-height: 100vh;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 24px;

          background: var(--background);
        }

        .login-container {
          width: 100%;
          max-width: 420px;

          background: var(--white);

          border: 1px solid var(--border);
          border-radius: 12px;

          padding: 32px;

          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
        }

        /* =========================
           HEADER
        ========================= */

        .login-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .login-brand {
          display: inline-block;

          margin-bottom: 20px;

          color: var(--green);

          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: -0.02em;

          text-decoration: none;
        }

        .login-brand:hover {
          color: var(--green-dark, #15803d);
        }

        .login-title {
          margin: 0;

          color: var(--dark);

          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .login-sub {
          margin: 6px 0 0;

          color: var(--muted);

          font-size: 0.9rem;
          line-height: 1.5;
        }

        /* =========================
           FORM
        ========================= */

        .form-group {
          margin-bottom: 18px;
        }

        .form-label {
          display: block;

          margin-bottom: 7px;

          color: var(--dark);

          font-size: 0.875rem;
          font-weight: 500;
        }

        .input-icon-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;

          left: 12px;
          top: 50%;

          width: 19px;
          height: 19px;

          transform: translateY(-50%);

          color: var(--muted);

          pointer-events: none;

          stroke-width: 1.8;
        }

        .form-input {
          box-sizing: border-box;

          width: 100%;

          padding: 10px 12px 10px 40px;

          background: var(--white);

          border: 1px solid var(--border);
          border-radius: 8px;

          color: var(--dark);

          font-size: 0.9rem;

          transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease;
        }

        .form-input::placeholder {
          color: #94a3b8;
        }

        .form-input:hover {
          border-color: #CBD5E1;
        }

        .form-input:focus {
          outline: none;

          border-color: var(--green);

          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }

        /* =========================
           FORGOT PASSWORD
        ========================= */

        .login-options {
          display: flex;
          justify-content: flex-end;

          margin-top: -2px;
          margin-bottom: 20px;
        }

        .forgot-link {
          color: var(--green);

          font-size: 0.85rem;
          font-weight: 500;

          text-decoration: none;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        /* =========================
           BUTTON
        ========================= */

        .login-btn {
          box-sizing: border-box;

          width: 100%;

          min-height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          padding: 10px 16px;

          background: var(--green);
          color: var(--white);

          border: 1px solid var(--green);
          border-radius: 8px;

          font-size: 0.9rem;
          font-weight: 600;

          cursor: pointer;

          transition:
            background-color 0.15s ease,
            border-color 0.15s ease;
        }

        .login-btn:hover:not(:disabled) {
          background: #15803D;
          border-color: #15803D;
        }

        .login-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.15);
        }

        .login-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* =========================
           SPINNER
        ========================= */

        .spinner-sm {
          width: 16px;
          height: 16px;

          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: var(--white);

          border-radius: 50%;

          animation: login-spin 0.7s linear infinite;
        }

        @keyframes login-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =========================
           REGISTER
        ========================= */

        .login-switch {
          margin: 20px 0 0;

          text-align: center;

          color: var(--muted);

          font-size: 0.875rem;
        }

        .login-switch a {
          color: var(--green);

          font-weight: 600;

          text-decoration: none;
        }

        .login-switch a:hover {
          text-decoration: underline;
        }

        /* =========================
           FOOTER
        ========================= */

        .login-footer {
          margin-top: 24px;
          padding-top: 16px;

          border-top: 1px solid var(--border);

          text-align: center;

          color: var(--muted);

          font-size: 0.75rem;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 480px) {
          .login-page {
            padding: 16px;
          }

          .login-container {
            padding: 28px 20px;
          }

          .login-title {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </div>
  );
}
