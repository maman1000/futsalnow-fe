import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState(null);

  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
    setCloseTimeout(timeout);
  };

  const handleLogout = async () => {
    closeMenu();
    await logout();
    navigate("/login");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      {/* ===== BRAND ===== */}
      <Link to="/" className="navbar-brand" onClick={closeMenu}>
        FutsalNow
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
              Dashboard
            </NavLink>
            <NavLink to="/admin/bookings" onClick={closeMenu}>
              Booking
            </NavLink>
            <NavLink to="/admin/services" onClick={closeMenu}>
              Layanan
            </NavLink>
            <NavLink to="/admin/schedules" onClick={closeMenu}>
              Jadwal
            </NavLink>
            <NavLink to="/admin/reports" onClick={closeMenu}>
              Laporan
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/" end onClick={closeMenu}>
              Beranda
            </NavLink>
            <NavLink to="/services" onClick={closeMenu}>
              Layanan
            </NavLink>
            {user && (
              <NavLink to="/my-bookings" onClick={closeMenu}>
                Booking Saya
              </NavLink>
            )}
          </>
        )}

        {/* Logout di mobile */}
        {user && (
          <>
            <hr className="mobile-divider" />
            <button className="mobile-logout-btn" onClick={handleLogout}>
              <ArrowRightOnRectangleIcon className="mobile-icon" /> Keluar
            </button>
          </>
        )}

        {/* Auth buttons di mobile */}
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
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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
                  <UserCircleIcon className="dropdown-icon" /> Profil
                </Link>
                <Link
                  to="/my-bookings"
                  className="dropdown-item"
                  onClick={closeMenu}
                >
                  <CalendarIcon className="dropdown-icon" /> Booking Saya
                </Link>
                <hr className="dropdown-divider" />
                <button onClick={handleLogout} className="dropdown-item logout">
                  <ArrowRightOnRectangleIcon className="dropdown-icon" /> Keluar
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

      {/* ===== STYLE ===== */}
      <style>{`
        .navbar {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e8ecf1;
          padding: 0 1.5rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
          transition: box-shadow 0.3s ease;
        }

        .navbar-brand {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          text-decoration: none;
          letter-spacing: -0.02em;
        }

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
          width: 26px;
          height: 2.5px;
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

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          transition: all 0.3s ease;
        }
        .navbar-links a {
          padding: 0.4rem 0.9rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #4b5563;
          text-decoration: none;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .navbar-links a:hover {
          background: #f1f5f9;
          color: #1f2937;
        }
        .navbar-links a.active {
          background: #1e293b;
          color: white;
        }

        .navbar-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .btn {
          padding: 0.4rem 1.2rem;
          border-radius: 30px;
          font-weight: 500;
          font-size: 0.85rem;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
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
          background: #1e293b;
          color: white;
        }
        .btn-primary:hover {
          background: #0f172a;
        }
        .btn-sm {
          padding: 0.2rem 0.8rem;
          font-size: 0.8rem;
        }

        .user-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.2rem 0.6rem;
          border-radius: 30px;
          transition: background 0.2s;
        }
        .user-btn:hover {
          background: #f1f5f9;
        }
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #1e293b;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.8rem;
        }
        .user-name {
          font-weight: 500;
          color: #1f2937;
        }
        .dropdown-arrow {
          font-size: 0.7rem;
          color: #9ca3af;
        }

        .user-dropdown {
          position: relative;
          display: inline-block;
        }
        .dropdown-menu {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 0.5rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid #f1f5f9;
          padding: 0.4rem 0;
          min-width: 200px;
          z-index: 60;
          animation: dropdownFade 0.2s ease;
        }
        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1.2rem;
          color: #374151;
          text-decoration: none;
          font-size: 0.9rem;
          transition: background 0.15s;
        }
        .dropdown-item:hover {
          background: #f9fafb;
        }
        .dropdown-item .dropdown-icon {
          width: 18px;
          height: 18px;
          stroke-width: 1.8;
          color: #6b7280;
        }
        .dropdown-item.logout {
          color: #dc2626;
        }
        .dropdown-item.logout .dropdown-icon {
          color: #dc2626;
        }
        .dropdown-item.logout:hover {
          background: #fef2f2;
        }
        .dropdown-divider {
          border: none;
          border-top: 1px solid #f1f5f9;
          margin: 0.3rem 0;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .hamburger {
            display: flex;
          }

          .navbar-links {
            position: fixed;
            top: 64px;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            align-items: stretch;
            padding: 1rem 1.5rem;
            gap: 0.5rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
            border-bottom: 1px solid #f1f5f9;
            transform: translateY(-120%);
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
            z-index: 40;
            max-height: calc(100vh - 64px);
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
            color: #1f2937;
            font-weight: 500;
            border-radius: 8px;
          }
          .navbar-links a:hover {
            background: #f1f5f9;
            color: #1f2937;
          }
          .navbar-links a.active {
            background: #1e293b;
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
            padding-top: 0.5rem;
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
            background: #1e293b;
            color: white;
          }

          .mobile-divider {
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 0.5rem 0;
          }
          .mobile-logout-btn {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.7rem 1rem;
            width: 100%;
            background: none;
            border: none;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 500;
            color: #dc2626;
            cursor: pointer;
            transition: background 0.2s;
            text-align: left;
          }
          .mobile-logout-btn .mobile-icon {
            width: 20px;
            height: 20px;
            stroke: #dc2626;
          }
          .mobile-logout-btn:hover {
            background: #fee2e2;
          }
        }

        @media (min-width: 769px) {
          .navbar-mobile-auth {
            display: none !important;
          }
          .mobile-divider,
          .mobile-logout-btn {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
