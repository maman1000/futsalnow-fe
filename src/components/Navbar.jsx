// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useState } from "react";

// // Ikon sederhana
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
//       <Link to="/" className="navbar-brand">
//         <span className="brand-icon">⚽</span>
//         Futsal<span className="brand-highlight">Now</span>
//       </Link>

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

//       <style>{`
//         /* ===== NAVBAR ===== */
//         .navbar {
//           background: rgba(255, 255, 255, 0.85);
//           backdrop-filter: blur(8px);
//           border-bottom: 1px solid #f3f0ff;
//           padding: 0 2rem;
//           height: 68px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           position: sticky;
//           top: 0;
//           z-index: 50;
//         }

//         .navbar-brand {
//           font-size: 1.25rem;
//           font-weight: 700;
//           color: #1f2937;
//           display: flex;
//           align-items: center;
//           text-decoration: none;
//         }
//         .brand-icon { font-size: 1.5rem; margin-right: 0.3rem; }
//         .brand-highlight { color: #7C3AED; }

//         .navbar-links {
//           display: flex;
//           align-items: center;
//           gap: 0.25rem;
//         }
//         .navbar-links a {
//           padding: 0.5rem 1rem;
//           border-radius: 10px;
//           font-size: 0.9rem;
//           font-weight: 500;
//           color: #4b5563;
//           text-decoration: none;
//           transition: all 0.2s;
//           display: flex;
//           align-items: center;
//         }
//         .navbar-links a:hover {
//           background: #f5f3ff;
//           color: #7C3AED;
//         }
//         .navbar-links a.active {
//           background: #7C3AED;
//           color: white;
//         }
//         .nav-icon { margin-right: 0.3rem; font-size: 0.9rem; }

//         .navbar-user {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//         }

//         /* Tombol */
//         .btn {
//           padding: 0.5rem 1.25rem;
//           border-radius: 10px;
//           font-weight: 500;
//           font-size: 0.85rem;
//           border: none;
//           cursor: pointer;
//           transition: all 0.2s;
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           gap: 0.3rem;
//         }
//         .btn-outline {
//           background: transparent;
//           border: 1.5px solid #d1d5db;
//           color: #374151;
//         }
//         .btn-outline:hover {
//           background: #f9fafb;
//           border-color: #9ca3af;
//         }
//         .btn-primary {
//           background: #7C3AED;
//           color: white;
//         }
//         .btn-primary:hover {
//           background: #6d28d9;
//           transform: translateY(-1px);
//           box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
//         }
//         .btn-sm {
//           padding: 0.3rem 0.9rem;
//           font-size: 0.8rem;
//         }

//         /* User dropdown */
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
//         .user-btn:hover { background: #f5f3ff; }
//         .user-avatar {
//           width: 32px;
//           height: 32px;
//           border-radius: 50%;
//           background: #7C3AED;
//           color: white;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 600;
//           font-size: 0.9rem;
//         }
//         .user-name { font-weight: 500; color: #1f2937; }
//         .dropdown-arrow { font-size: 0.7rem; color: #9ca3af; }

//         .user-dropdown { position: relative; display: inline-block; }
//         .dropdown-menu {
//           position: absolute;
//           right: 0;
//           top: 100%;
//           margin-top: 0.5rem;
//           background: white;
//           border-radius: 12px;
//           box-shadow: 0 10px 30px rgba(0,0,0,0.1);
//           border: 1px solid #f3f0ff;
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
//         .dropdown-divider { border: none; border-top: 1px solid #f3f0ff; margin: 0.3rem 0; }
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
  const [isMenuOpen, setIsMenuOpen] = useState(false); // <-- TAMBAHKAN

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" onClick={closeMenu}>
        <span className="brand-icon">⚽</span>
        Futsal<span className="brand-highlight">Now</span>
      </Link>

      {/* ===== HAMBURGER BUTTON ===== */}
      <button
        className="hamburger"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
        <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
        <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
      </button>

      {/* ===== NAV LINKS ===== */}
      <div className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
        {user?.role === "admin" ? (
          <>
            <NavLink to="/admin" onClick={closeMenu}>
              <DashboardIcon /> Dashboard
            </NavLink>
            <NavLink to="/admin/bookings" onClick={closeMenu}>
              <BookingsIcon /> Booking
            </NavLink>
            <NavLink to="/admin/services" onClick={closeMenu}>
              <ServicesIcon /> Layanan
            </NavLink>
            <NavLink to="/admin/schedules" onClick={closeMenu}>
              <ScheduleIcon /> Jadwal
            </NavLink>
            <NavLink to="/admin/reports" onClick={closeMenu}>
              <ReportIcon /> Laporan
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/" end onClick={closeMenu}>
              <HomeIcon /> Beranda
            </NavLink>
            <NavLink to="/services" onClick={closeMenu}>
              <ServicesIcon /> Layanan
            </NavLink>
            {user && (
              <NavLink to="/my-bookings" onClick={closeMenu}>
                <BookingsIcon /> Booking Saya
              </NavLink>
            )}
          </>
        )}
        {/* Tampilkan tombol login/register di menu mobile jika belum login */}
        {!user && (
          <div className="navbar-mobile-auth">
            <Link
              to="/login"
              className="btn btn-outline btn-sm"
              onClick={closeMenu}
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="btn btn-primary btn-sm"
              onClick={closeMenu}
            >
              Daftar
            </Link>
          </div>
        )}
      </div>

      {/* ===== USER AREA (DESKTOP) ===== */}
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
                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={closeMenu}
                >
                  👤 Profil
                </Link>
                <Link
                  to="/my-bookings"
                  className="dropdown-item"
                  onClick={closeMenu}
                >
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
          // Login/Register desktop
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

      {/* ===== STYLE ===== */}
      <style>{`
        /* ===== NAVBAR ===== */
        .navbar {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid #f3f0ff;
          padding: 0 1.5rem;
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

        /* ===== HAMBURGER ===== */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.3rem;
          z-index: 60;
        }
        .hamburger-line {
          width: 28px;
          height: 3px;
          background: #1f2937;
          border-radius: 4px;
          transition: all 0.3s ease;
          transform-origin: center;
        }
        .hamburger-line.open:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .hamburger-line.open:nth-child(2) {
          opacity: 0;
        }
        .hamburger-line.open:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
        }

        /* ===== NAV LINKS ===== */
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          transition: all 0.3s ease;
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

        /* Mobile auth buttons (hidden on desktop) */
        .navbar-mobile-auth {
          display: none;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid #e5e7eb;
          width: 100%;
        }
        .navbar-mobile-auth .btn {
          width: 100%;
          justify-content: center;
        }

        /* ===== USER AREA (DESKTOP) ===== */
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

       /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .hamburger {
            display: flex;
          }

          .navbar-links {
            position: fixed;
            top: 68px;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            align-items: stretch;
            padding: 1rem 1.5rem;
            gap: 0.5rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            border-bottom: 1px solid #f3f0ff;
            transform: translateY(-120%);
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
            z-index: 40;
            max-height: calc(100vh - 68px);
            overflow-y: auto;
          }
          .navbar-links.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
          }

          .navbar-links a {
            padding: 0.7rem 1rem;
            width: 100%;
            color: #1f2937; /* gelap, kontras dengan background putih */
            font-weight: 500;
            border-radius: 8px;
          }
          .navbar-links a:hover {
            background: #f5f3ff;
            color: #7C3AED;
          }
          .navbar-links a.active {
            background: #7C3AED;
            color: white;
          }

          .navbar-user {
            display: none;
          }

          .navbar-mobile-auth {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-top: 0.5rem;
            padding-top: 0.75rem;
            border-top: 1px solid #e5e7eb;
            width: 100%;
          }
          .navbar-mobile-auth .btn {
            width: 100%;
            justify-content: center;
            padding: 0.6rem;
            font-size: 0.9rem;
          }
          .navbar-mobile-auth .btn-outline {
            color: #374151;
            border-color: #d1d5db;
          }
          .navbar-mobile-auth .btn-primary {
            background: #7C3AED;
            color: white;
          }
        }

        @media (min-width: 769px) {
          .navbar-mobile-auth {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
