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

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleLogout = async () => {
    closeMenu();
    closeDropdown();

    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* ===== BRAND ===== */}
      <Link to="/" className="navbar-brand" onClick={closeMenu}>
        FutsalNow
      </Link>

      {/* ===== HAMBURGER ===== */}
      <button
        className={`hamburger ${isMenuOpen ? "open" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* ===== CUSTOMER NAVIGATION ===== */}
      <div className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
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

        {/* ===== MOBILE AUTH ===== */}
        {user ? (
          <>
            <hr className="mobile-divider" />

            <button className="mobile-logout-btn" onClick={handleLogout}>
              <ArrowRightOnRectangleIcon className="mobile-icon" />
              <span>Keluar</span>
            </button>
          </>
        ) : (
          <div className="navbar-mobile-auth">
            <Link to="/login" className="mobile-login-btn" onClick={closeMenu}>
              Masuk
            </Link>

            <Link
              to="/register"
              className="mobile-register-btn"
              onClick={closeMenu}
            >
              Daftar
            </Link>
          </div>
        )}
      </div>

      {/* ===== DESKTOP USER AREA ===== */}
      <div className="navbar-user">
        {user ? (
          <div
            className="user-dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="user-btn"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <span className="user-avatar">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </span>

              <span className="user-name">{user.name}</span>

              <span className={`dropdown-arrow ${dropdownOpen ? "open" : ""}`}>
                ▾
              </span>
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={closeDropdown}
                >
                  <UserCircleIcon className="dropdown-icon" />
                  <span>Profil</span>
                </Link>

                <Link
                  to="/my-bookings"
                  className="dropdown-item"
                  onClick={closeDropdown}
                >
                  <CalendarIcon className="dropdown-icon" />
                  <span>Booking Saya</span>
                </Link>

                <div className="dropdown-divider"></div>

                <button onClick={handleLogout} className="dropdown-item logout">
                  <ArrowRightOnRectangleIcon className="dropdown-icon" />
                  <span>Keluar</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="btn-login">
              Masuk
            </Link>

            <Link to="/register" className="btn-register">
              Daftar
            </Link>
          </>
        )}
      </div>

      {/* ===== STYLE ===== */}
      <style>{`
        /* =========================
           NAVBAR
           ========================= */

        .navbar {
          height: 64px;
          padding: 0 24px;

          display: flex;
          align-items: center;

          background: #FFFFFF;
          border-bottom: 1px solid #E2E8F0;

          position: sticky;
          top: 0;
          z-index: 100;
        }

        /* =========================
           BRAND
           ========================= */

        .navbar-brand {
          color: #16A34A;
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.02em;

          text-decoration: none;
          white-space: nowrap;
        }

        .navbar-brand:hover {
          color: #15803D;
          text-decoration: none;
        }

        /* =========================
           NAV LINKS
           ========================= */

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 2px;

          margin-left: 28px;
          flex: 1;
        }

        .navbar-links > a {
          padding: 8px 12px;

          color: #64748B;
          font-size: 0.9rem;
          font-weight: 500;

          text-decoration: none;
          border-radius: 8px;

          transition:
            color 0.15s ease,
            background-color 0.15s ease;
        }

        .navbar-links > a:hover {
          color: #0F172A;
          background: #F8FAFC;
          text-decoration: none;
        }

        .navbar-links > a.active {
          color: #16A34A;
          background: #F0FDF4;
        }

        /* =========================
           DESKTOP USER
           ========================= */

        .navbar-user {
          display: flex;
          align-items: center;
        }

        .user-dropdown {
          position: relative;
        }

        .user-btn {
          display: flex;
          align-items: center;
          gap: 8px;

          padding: 4px 8px;

          background: transparent;
          border: none;
          border-radius: 8px;

          cursor: pointer;

          transition: background-color 0.15s ease;
        }

        .user-btn:hover {
          background: #F8FAFC;
        }

        .user-avatar {
          width: 32px;
          height: 32px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #16A34A;
          color: #FFFFFF;

          font-size: 0.8rem;
          font-weight: 600;
        }

        .user-name {
          color: #0F172A;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .dropdown-arrow {
          color: #64748B;
          font-size: 0.7rem;

          transition: transform 0.15s ease;
        }

        .dropdown-arrow.open {
          transform: rotate(180deg);
        }

        /* =========================
           DROPDOWN
           ========================= */

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;

          min-width: 190px;

          padding: 6px 0;

          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;

          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);

          z-index: 110;

          animation: dropdownFade 0.15s ease;
        }

        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;

          width: 100%;
          padding: 9px 14px;

          background: transparent;
          border: none;

          color: #0F172A;

          font-size: 0.9rem;
          font-weight: 500;

          text-align: left;
          text-decoration: none;

          cursor: pointer;

          transition: background-color 0.15s ease;
        }

        .dropdown-item:hover {
          background: #F8FAFC;
          text-decoration: none;
        }

        .dropdown-icon {
          width: 18px;
          height: 18px;

          color: #64748B;
          stroke-width: 1.8;

          flex-shrink: 0;
        }

        .dropdown-divider {
          height: 1px;
          margin: 4px 0;

          border: none;
          background: #E2E8F0;
        }

        .dropdown-item.logout {
          color: #DC2626;
        }

        .dropdown-item.logout .dropdown-icon {
          color: #DC2626;
        }

        .dropdown-item.logout:hover {
          background: #FEF2F2;
        }

        /* =========================
           DESKTOP AUTH
           ========================= */

        .btn-login,
        .btn-register {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          height: 36px;
          padding: 0 14px;

          border-radius: 8px;

          font-size: 0.875rem;
          font-weight: 600;

          text-decoration: none;

          transition:
            background-color 0.15s ease,
            border-color 0.15s ease,
            color 0.15s ease;
        }

        .btn-login {
          color: #0F172A;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
        }

        .btn-login:hover {
          background: #F8FAFC;
          border-color: #CBD5E1;
          text-decoration: none;
        }

        .btn-register {
          margin-left: 8px;

          color: #FFFFFF;
          background: #16A34A;
          border: 1px solid #16A34A;
        }

        .btn-register:hover {
          background: #15803D;
          border-color: #15803D;
          text-decoration: none;
        }

        /* =========================
           HAMBURGER
           ========================= */

        .hamburger {
          display: none;

          flex-direction: column;
          justify-content: center;
          gap: 5px;

          width: 40px;
          height: 40px;

          margin-left: auto;
          padding: 8px;

          background: transparent;
          border: none;
          border-radius: 8px;

          cursor: pointer;
        }

        .hamburger:hover {
          background: #F8FAFC;
        }

        .hamburger-line {
          display: block;

          width: 22px;
          height: 2px;

          background: #0F172A;
          border-radius: 2px;

          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .hamburger.open .hamburger-line:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .hamburger.open .hamburger-line:nth-child(2) {
          opacity: 0;
        }

        .hamburger.open .hamburger-line:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* =========================
           MOBILE
           ========================= */

        .navbar-mobile-auth,
        .mobile-divider,
        .mobile-logout-btn {
          display: none;
        }

        @media (max-width: 768px) {
          .navbar {
            height: 60px;
            padding: 0 16px;
          }

          .hamburger {
            display: flex;
          }

          .navbar-links {
            position: fixed;

            top: 60px;
            left: 0;
            right: 0;

            margin: 0;

            padding: 10px 16px 16px;

            flex-direction: column;
            align-items: stretch;

            background: #FFFFFF;

            border-bottom: 1px solid #E2E8F0;

            box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);

            transform: translateY(-110%);
            opacity: 0;
            pointer-events: none;

            transition:
              transform 0.2s ease,
              opacity 0.2s ease;

            z-index: 90;
          }

          .navbar-links.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
          }

          .navbar-links > a {
            width: 100%;
            padding: 10px 12px;

            color: #0F172A;
            border-radius: 8px;
          }

          .navbar-links > a.active {
            color: #16A34A;
            background: #F0FDF4;
          }

          .navbar-user {
            display: none;
          }

          /* Mobile authentication */

          .navbar-mobile-auth {
            display: flex;
            flex-direction: column;
            gap: 8px;

            width: 100%;

            margin-top: 8px;
            padding-top: 12px;

            border-top: 1px solid #E2E8F0;
          }

          .mobile-login-btn,
          .mobile-register-btn {
            display: flex;
            align-items: center;
            justify-content: center;

            width: 100%;
            min-height: 40px;

            border-radius: 8px;

            font-size: 0.9rem;
            font-weight: 600;

            text-decoration: none;
          }

          .mobile-login-btn {
            color: #0F172A;
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
          }

          .mobile-register-btn {
            color: #FFFFFF;
            background: #16A34A;
            border: 1px solid #16A34A;
          }

          /* Mobile logout */

          .mobile-divider {
            display: block;

            width: 100%;
            height: 1px;

            margin: 8px 0;

            border: none;
            background: #E2E8F0;
          }

          .mobile-logout-btn {
            display: flex;
            align-items: center;
            gap: 8px;

            width: 100%;
            padding: 10px 12px;

            color: #DC2626;

            background: transparent;
            border: none;
            border-radius: 8px;

            font-size: 0.9rem;
            font-weight: 500;

            cursor: pointer;
            text-align: left;
          }

          .mobile-logout-btn:hover {
            background: #FEF2F2;
          }

          .mobile-icon {
            width: 20px;
            height: 20px;

            color: #DC2626;
          }
        }

        @media (max-width: 480px) {
          .navbar {
            padding: 0 12px;
          }

          .navbar-brand {
            font-size: 1.15rem;
          }
        }
      `}</style>
    </nav>
  );
}
