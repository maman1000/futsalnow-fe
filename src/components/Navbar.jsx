// import { Link, NavLink, useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'

// export default function Navbar() {
//   const { user, logout } = useAuth()
//   const navigate = useNavigate()

//   const handleLogout = async () => {
//     await logout()
//     navigate('/login')
//   }

//   return (
//     <nav className="navbar">
//       <Link to="/" className="navbar-brand">BookingApp</Link>

//       <div className="navbar-links">
//         {user?.role === 'admin' ? (
//           <>
//             <NavLink to="/admin">Dashboard</NavLink>
//             <NavLink to="/admin/bookings">Booking</NavLink>
//             <NavLink to="/admin/services">Layanan</NavLink>
//             <NavLink to="/admin/schedules">Jadwal</NavLink>
//             <NavLink to="/admin/reports">Laporan</NavLink>
//           </>
//         ) : (
//           <>
//             <NavLink to="/" end>Home</NavLink>
//             <NavLink to="/services">Layanan</NavLink>
//             {user && <NavLink to="/my-bookings">Booking Saya</NavLink>}
//           </>
//         )}
//       </div>

//       <div className="navbar-user">
//         {user ? (
//           <>
//             <span className="navbar-username">
//               {user.name} <span className="navbar-role">({user.role})</span>
//             </span>
//             <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
//           </>
//         ) : (
//           <>
//             <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
//             <Link to="/register" className="btn btn-primary btn-sm">Daftar</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   )
// }

// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useState } from "react";

// // Ikon sederhana (pakai emoji atau FontAwesome)
// const HomeIcon = () => <span className="nav-icon">🏠</span>;
// const ServicesIcon = () => <span className="nav-icon">📋</span>;
// const BookingsIcon = () => <span className="nav-icon">📅</span>;
// const DashboardIcon = () => <span className="nav-icon">📊</span>;
// const ScheduleIcon = () => <span className="nav-icon">⏰</span>;
// const ReportIcon = () => <span className="nav-icon">📈</span>;

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const handleLogout = async () => {
//     await logout();
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar">
//       {/* Brand */}
//       <Link to="/" className="navbar-brand">
//         <span className="brand-icon">⚽</span>
//         Futsal<span className="brand-highlight">Now</span>
//       </Link>

//       {/* Navigasi */}
//       <div className="navbar-links">
//         {user?.role === "admin" ? (
//           <>
//             <NavLink to="/admin">
//               <DashboardIcon /> Dashboard
//             </NavLink>
//             <NavLink to="/admin/bookings">
//               <BookingsIcon /> Booking
//             </NavLink>
//             <NavLink to="/admin/services">
//               <ServicesIcon /> Layanan
//             </NavLink>
//             <NavLink to="/admin/schedules">
//               <ScheduleIcon /> Jadwal
//             </NavLink>
//             <NavLink to="/admin/reports">
//               <ReportIcon /> Laporan
//             </NavLink>
//           </>
//         ) : (
//           <>
//             <NavLink to="/" end>
//               <HomeIcon /> Beranda
//             </NavLink>
//             <NavLink to="/services">
//               <ServicesIcon /> Layanan
//             </NavLink>
//             {user && (
//               <NavLink to="/my-bookings">
//                 <BookingsIcon /> Booking Saya
//               </NavLink>
//             )}
//           </>
//         )}
//       </div>

//       {/* User Area */}
//       <div className="navbar-user">
//         {user ? (
//           <div
//             className="user-dropdown"
//             onMouseEnter={() => setDropdownOpen(true)}
//             onMouseLeave={() => setDropdownOpen(false)}
//           >
//             <button className="user-btn">
//               <span className="user-avatar">
//                 {user.name?.charAt(0).toUpperCase() || "U"}
//               </span>
//               <span className="user-name">{user.name}</span>
//               <span className="dropdown-arrow">▾</span>
//             </button>
//             {dropdownOpen && (
//               <div className="dropdown-menu">
//                 <Link to="/profile" className="dropdown-item">
//                   👤 Profil
//                 </Link>
//                 <Link to="/my-bookings" className="dropdown-item">
//                   📅 Booking Saya
//                 </Link>
//                 <hr className="dropdown-divider" />
//                 <button onClick={handleLogout} className="dropdown-item logout">
//                   🚪 Keluar
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <>
//             <Link to="/login" className="btn btn-outline btn-sm">
//               Masuk
//             </Link>
//             <Link to="/register" className="btn btn-primary btn-sm">
//               Daftar
//             </Link>
//           </>
//         )}
//       </div>

//       {/* Tambahan CSS untuk dropdown & ikon */}
//       <style>{`
//         .brand-icon { font-size: 1.5rem; margin-right: 0.3rem; }
//         .brand-highlight { color: #7c3aed; }
//         .nav-icon { margin-right: 0.3rem; font-size: 0.9rem; }

//         .user-btn {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           background: none;
//           border: none;
//           cursor: pointer;
//           padding: 0.3rem 0.8rem;
//           border-radius: 30px;
//           transition: background 0.2s;
//         }
//         .user-btn:hover { background: #f3f0ff; }

//         .user-avatar {
//           width: 32px;
//           height: 32px;
//           border-radius: 50%;
//           background: #7c3aed;
//           color: white;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 600;
//           font-size: 0.9rem;
//         }
//         .user-name { font-weight: 500; color: #1f2937; }
//         .dropdown-arrow { font-size: 0.7rem; color: #9ca3af; }

//         .dropdown-menu {
//           position: absolute;
//           right: 0;
//           top: 100%;
//           margin-top: 0.5rem;
//           background: white;
//           border-radius: 12px;
//           box-shadow: 0 10px 30px rgba(0,0,0,0.1);
//           border: 1px solid #f0f0f0;
//           padding: 0.4rem 0;
//           min-width: 180px;
//           z-index: 60;
//         }
//         .dropdown-item {
//           display: block;
//           padding: 0.5rem 1.2rem;
//           color: #374151;
//           text-decoration: none;
//           font-size: 0.9rem;
//           transition: background 0.15s;
//         }
//         .dropdown-item:hover { background: #f9fafb; }
//         .dropdown-item.logout { color: #dc2626; }
//         .dropdown-item.logout:hover { background: #fef2f2; }
//         .dropdown-divider { border: none; border-top: 1px solid #f0f0f0; margin: 0.3rem 0; }

//         .user-dropdown { position: relative; display: inline-block; }
//       `}</style>
//     </nav>
//   );
// }

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

// Ikon sederhana
const HomeIcon = () => <span className="nav-icon">🏠</span>;
const ServicesIcon = () => <span className="nav-icon">📋</span>;
const BookingsIcon = () => <span className="nav-icon">📅</span>;
const DashboardIcon = () => <span className="nav-icon">📊</span>;
const ScheduleIcon = () => <span className="nav-icon">⏰</span>;
const ReportIcon = () => <span className="nav-icon">📈</span>;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">⚽</span>
        Futsal<span className="brand-highlight">Now</span>
      </Link>

      <div className="navbar-links">
        {user?.role === "admin" ? (
          <>
            <NavLink to="/admin">
              <DashboardIcon /> Dashboard
            </NavLink>
            <NavLink to="/admin/bookings">
              <BookingsIcon /> Booking
            </NavLink>
            <NavLink to="/admin/services">
              <ServicesIcon /> Layanan
            </NavLink>
            <NavLink to="/admin/schedules">
              <ScheduleIcon /> Jadwal
            </NavLink>
            <NavLink to="/admin/reports">
              <ReportIcon /> Laporan
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/" end>
              <HomeIcon /> Beranda
            </NavLink>
            <NavLink to="/services">
              <ServicesIcon /> Layanan
            </NavLink>
            {user && (
              <NavLink to="/my-bookings">
                <BookingsIcon /> Booking Saya
              </NavLink>
            )}
          </>
        )}
      </div>

      <div className="navbar-user">
        {user ? (
          <div
            className="user-dropdown"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className="user-btn">
              <span className="user-avatar">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </span>
              <span className="user-name">{user.name}</span>
              <span className="dropdown-arrow">▾</span>
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  👤 Profil
                </Link>
                <Link to="/my-bookings" className="dropdown-item">
                  📅 Booking Saya
                </Link>
                <hr className="dropdown-divider" />
                <button onClick={handleLogout} className="dropdown-item logout">
                  🚪 Keluar
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline btn-sm">
              Masuk
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Daftar
            </Link>
          </>
        )}
      </div>

      <style>{`
        /* ===== NAVBAR ===== */
        .navbar {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid #f3f0ff;
          padding: 0 2rem;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .navbar-brand {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        .brand-icon { font-size: 1.5rem; margin-right: 0.3rem; }
        .brand-highlight { color: #7C3AED; }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .navbar-links a {
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #4b5563;
          text-decoration: none;
          transition: all 0.2s;
          display: flex;
          align-items: center;
        }
        .navbar-links a:hover {
          background: #f5f3ff;
          color: #7C3AED;
        }
        .navbar-links a.active {
          background: #7C3AED;
          color: white;
        }
        .nav-icon { margin-right: 0.3rem; font-size: 0.9rem; }

        .navbar-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        /* Tombol */
        .btn {
          padding: 0.5rem 1.25rem;
          border-radius: 10px;
          font-weight: 500;
          font-size: 0.85rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }
        .btn-outline {
          background: transparent;
          border: 1.5px solid #d1d5db;
          color: #374151;
        }
        .btn-outline:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }
        .btn-primary {
          background: #7C3AED;
          color: white;
        }
        .btn-primary:hover {
          background: #6d28d9;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
        }
        .btn-sm {
          padding: 0.3rem 0.9rem;
          font-size: 0.8rem;
        }

        /* User dropdown */
        .user-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.3rem 0.8rem;
          border-radius: 30px;
          transition: background 0.2s;
        }
        .user-btn:hover { background: #f5f3ff; }
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #7C3AED;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .user-name { font-weight: 500; color: #1f2937; }
        .dropdown-arrow { font-size: 0.7rem; color: #9ca3af; }

        .user-dropdown { position: relative; display: inline-block; }
        .dropdown-menu {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 0.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border: 1px solid #f3f0ff;
          padding: 0.4rem 0;
          min-width: 180px;
          z-index: 60;
        }
        .dropdown-item {
          display: block;
          padding: 0.5rem 1.2rem;
          color: #374151;
          text-decoration: none;
          font-size: 0.9rem;
          transition: background 0.15s;
        }
        .dropdown-item:hover { background: #f9fafb; }
        .dropdown-item.logout { color: #dc2626; }
        .dropdown-item.logout:hover { background: #fef2f2; }
        .dropdown-divider { border: none; border-top: 1px solid #f3f0ff; margin: 0.3rem 0; }
      `}</style>
    </nav>
  );
}
