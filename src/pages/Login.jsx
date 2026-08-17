// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'

// export default function Login() {
//   const { login } = useAuth()
//   const navigate = useNavigate()
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
//     setLoading(true)
//     try {
//       const user = await login(email, password)
//       navigate(user.role === 'admin' ? '/admin' : '/')
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login gagal. Coba lagi.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="auth-page">
//       <form className="card auth-card" onSubmit={handleSubmit}>
//         <h2>Masuk ke BookingApp</h2>
//         <p className="muted">Gunakan akun Anda untuk melanjutkan.</p>

//         {error && <div className="alert alert-error">{error}</div>}

//         <label className="form-label">Email</label>
//         <input
//           type="email"
//           className="form-input"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="nama@email.com"
//           required
//         />

//         <label className="form-label">Password</label>
//         <input
//           type="password"
//           className="form-input"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="••••••••"
//           required
//         />

//         <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
//           {loading ? 'Memproses...' : 'Login'}
//         </button>

//         <p className="auth-switch">
//           Belum punya akun? <Link to="/register">Daftar di sini</Link>
//         </p>
//       </form>
//     </div>
//   )
// }

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       const user = await login(email, password);
//       navigate(user.role === "admin" ? "/admin" : "/");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login gagal. Coba lagi.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-card">
//         <div className="login-header">
//           <h1 className="login-title">👋 Selamat Datang Kembali</h1>
//           <p className="login-subtitle">
//             Masuk ke akun kamu untuk melanjutkan.
//           </p>
//         </div>

//         {error && (
//           <div className="alert alert-error">
//             <span className="alert-icon">⚠️</span> {error}
//           </div>
//         )}

//         <form className="login-form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label className="form-label">📧 Email</label>
//             <input
//               type="email"
//               className="form-input"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="nama@email.com"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label">🔒 Password</label>
//             <input
//               type="password"
//               className="form-input"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//               required
//             />
//           </div>

//           <button type="submit" className="btn-login" disabled={loading}>
//             {loading ? (
//               <>
//                 <span className="spinner-sm"></span>
//                 Memproses...
//               </>
//             ) : (
//               "Masuk →"
//             )}
//           </button>

//           <p className="auth-switch">
//             Belum punya akun? <Link to="/register">Daftar sekarang</Link>
//           </p>
//         </form>
//       </div>

//       {/* CSS inline */}
//       <style>{`
//         .login-page {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           min-height: 80vh;
//           padding: 2rem 1.5rem;
//           background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
//         }

//         .login-card {
//           max-width: 420px;
//           width: 100%;
//           background: white;
//           padding: 2.5rem 2rem;
//           border-radius: 32px;
//           box-shadow: 0 20px 60px rgba(124,58,237,0.08);
//           border: 1px solid #f3f0ff;
//         }

//         .login-header {
//           text-align: center;
//           margin-bottom: 2rem;
//         }

//         .login-title {
//           font-size: 1.8rem;
//           font-weight: 700;
//           color: #1f2937;
//           margin-bottom: 0.25rem;
//         }

//         .login-subtitle {
//           color: #6b7280;
//           font-size: 1rem;
//           margin: 0;
//         }

//         .alert {
//           padding: 0.75rem 1rem;
//           border-radius: 14px;
//           font-size: 0.9rem;
//           margin-bottom: 1.5rem;
//           border-left: 4px solid;
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//         }
//         .alert-error {
//           background: #fef2f2;
//           border-color: #dc2626;
//           color: #991b1b;
//         }
//         .alert-icon {
//           font-size: 1.1rem;
//         }

//         .login-form {
//           display: flex;
//           flex-direction: column;
//           gap: 1.25rem;
//         }

//         .form-group {
//           display: flex;
//           flex-direction: column;
//           gap: 0.3rem;
//         }

//         .form-label {
//           font-weight: 600;
//           color: #1f2937;
//           font-size: 0.9rem;
//         }

//         .form-input {
//           padding: 0.7rem 1rem;
//           border: 1.5px solid #e5e7eb;
//           border-radius: 14px;
//           font-size: 0.95rem;
//           transition: 0.2s;
//           background: #fafafa;
//         }
//         .form-input:focus {
//           outline: none;
//           border-color: #7c3aed;
//           background: white;
//           box-shadow: 0 0 0 4px rgba(124,58,237,0.08);
//         }

//         .btn-login {
//           width: 100%;
//           padding: 0.8rem 1.5rem;
//           background: #7c3aed;
//           color: white;
//           border: none;
//           border-radius: 30px;
//           font-size: 1rem;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 0.5rem;
//           margin-top: 0.5rem;
//         }

//         .btn-login:hover:not(:disabled) {
//           background: #6d28d9;
//           transform: scale(1.02);
//           box-shadow: 0 8px 24px rgba(124,58,237,0.25);
//         }

//         .btn-login:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//           transform: none;
//         }

//         .spinner-sm {
//           display: inline-block;
//           width: 18px;
//           height: 18px;
//           border: 2px solid rgba(255,255,255,0.3);
//           border-top-color: white;
//           border-radius: 50%;
//           animation: spin 0.8s linear infinite;
//         }

//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }

//         .auth-switch {
//           text-align: center;
//           font-size: 0.9rem;
//           color: #6b7280;
//           margin-top: 0.5rem;
//         }

//         .auth-switch a {
//           color: #7c3aed;
//           font-weight: 600;
//           text-decoration: none;
//         }
//         .auth-switch a:hover {
//           text-decoration: underline;
//         }
//       `}</style>
//     </div>
//   );
// }

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🔐</span>
          <h2 className="auth-title">Selamat Datang Kembali</h2>
          <p className="auth-desc">
            Masuk ke akunmu untuk melanjutkan booking.
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">📧 Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">🔑 Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-sm"></span> Memproses...
              </>
            ) : (
              "Masuk →"
            )}
          </button>

          <p className="auth-switch">
            Belum punya akun? <Link to="/register">Daftar sekarang</Link>
          </p>
        </form>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
          padding: 1.5rem;
        }

        .auth-card {
          max-width: 420px;
          width: 100%;
          background: white;
          border-radius: 32px;
          padding: 2.5rem 2rem;
          box-shadow: 0 20px 60px rgba(124,58,237,0.12);
          border: 1px solid #f3f0ff;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .auth-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .auth-desc {
          color: #6b7280;
          font-size: 0.95rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .form-label {
          font-weight: 500;
          color: #374151;
          font-size: 0.9rem;
        }

        .form-input {
          padding: 0.7rem 1rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 14px;
          font-size: 0.95rem;
          transition: 0.2s;
          background: #fafafa;
        }

        .form-input:focus {
          outline: none;
          border-color: #7c3aed;
          background: white;
          box-shadow: 0 0 0 4px rgba(124,58,237,0.08);
        }

        .btn-submit {
          width: 100%;
          padding: 0.8rem;
          background: #7c3aed;
          color: white;
          border: none;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .btn-submit:hover:not(:disabled) {
          background: #6d28d9;
          transform: scale(1.02);
          box-shadow: 0 8px 24px rgba(124,58,237,0.25);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .spinner-sm {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .auth-switch {
          text-align: center;
          font-size: 0.9rem;
          color: #6b7280;
          margin-top: 0.5rem;
        }

        .auth-switch a {
          color: #7c3aed;
          font-weight: 500;
          text-decoration: none;
        }

        .auth-switch a:hover {
          text-decoration: underline;
        }

        .alert {
          padding: 0.7rem 1rem;
          border-radius: 14px;
          font-size: 0.9rem;
          border-left: 4px solid;
          margin-bottom: 1rem;
        }
        .alert-error {
          background: #fef2f2;
          border-color: #dc2626;
          color: #991b1b;
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 1.5rem 1.25rem;
          }
          .auth-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
