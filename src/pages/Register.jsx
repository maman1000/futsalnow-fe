import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const user = await register(form);

      showToast("Akun berhasil dibuat! Silakan login.", "success");

      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      const data = err.response?.data;

      const firstFieldError = data?.errors
        ? Object.values(data.errors)[0]?.[0]
        : null;

      const msg =
        firstFieldError || data?.message || "Registrasi gagal. Coba lagi.";

      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-header">
            <h1 className="register-title">Buat Akun</h1>

            <p className="register-sub">
              Daftar untuk mulai booking lapangan futsal.
            </p>
          </div>

          {/* Nama */}
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>

            <div className="input-wrapper">
              <UserIcon className="input-icon" />

              <input
                type="text"
                name="name"
                className="form-input"
                value={form.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                autoComplete="name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>

            <div className="input-wrapper">
              <EnvelopeIcon className="input-icon" />

              <input
                type="email"
                name="email"
                className="form-input"
                value={form.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>

            <div className="input-wrapper">
              <LockClosedIcon className="input-icon" />

              <input
                type="password"
                name="password"
                className="form-input"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimal 8 karakter"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div className="form-group">
            <label className="form-label">Konfirmasi Password</label>

            <div className="input-wrapper">
              <LockClosedIcon className="input-icon" />

              <input
                type="password"
                name="password_confirmation"
                className="form-input"
                value={form.password_confirmation}
                onChange={handleChange}
                placeholder="Ulangi password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-sm"></span>
                Memproses...
              </>
            ) : (
              "Daftar"
            )}
          </button>

          <p className="register-switch">
            Sudah punya akun? <Link to="/login">Masuk</Link>
          </p>
        </form>

        <div className="register-footer">
          <span>FutsalNow</span>
          <span>Booking Lapangan Futsal</span>
        </div>
      </div>

      <style>{`
        /* =========================
           REGISTER PAGE
           ========================= */

        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 16px;
          background: var(--background);
        }

        .register-container {
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

        .register-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .register-title {
          margin: 0 0 6px;
          color: var(--dark);
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .register-sub {
          margin: 0;
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

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          width: 18px;
          height: 18px;
          color: var(--muted);
          pointer-events: none;
        }

        .form-input {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 12px 10px 40px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--white);
          color: var(--dark);
          font-size: 0.9rem;
          line-height: 1.5;
          transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease;
        }

        .form-input::placeholder {
          color: #94a3b8;
        }

        .form-input:hover {
          border-color: #cbd5e1;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--green);
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }

        /* =========================
           BUTTON
           ========================= */

        .register-btn {
          width: 100%;
          min-height: 42px;
          margin-top: 6px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

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

        .register-btn:hover:not(:disabled) {
          background: #15803d;
          border-color: #15803d;
        }

        .register-btn:active:not(:disabled) {
          background: #166534;
          border-color: #166534;
        }

        .register-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* =========================
           SPINNER
           ========================= */

        .spinner-sm {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: var(--white);
          border-radius: 50%;
          animation: register-spin 0.7s linear infinite;
        }

        @keyframes register-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =========================
           LOGIN LINK
           ========================= */

        .register-switch {
          margin: 20px 0 0;
          text-align: center;
          color: var(--muted);
          font-size: 0.875rem;
        }

        .register-switch a {
          color: var(--green);
          font-weight: 600;
          text-decoration: none;
        }

        .register-switch a:hover {
          text-decoration: underline;
        }

        /* =========================
           FOOTER
           ========================= */

        .register-footer {
          margin-top: 24px;
          padding-top: 18px;
          border-top: 1px solid var(--border);

          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;

          color: var(--muted);
          font-size: 0.75rem;
        }

        .register-footer span:first-child {
          color: var(--dark);
          font-weight: 600;
        }

        /* =========================
           RESPONSIVE
           ========================= */

        @media (max-width: 480px) {
          .register-page {
            padding: 20px 16px;
          }

          .register-container {
            padding: 24px 20px;
          }

          .register-title {
            font-size: 1.35rem;
          }
        }
      `}</style>
    </div>
  );
}
