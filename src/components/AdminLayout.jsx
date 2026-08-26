import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  ClockIcon,
  DocumentChartBarIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      {/* ===== SIDEBAR ===== */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <span className="brand-name">FutsalNow</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/admin" className="sidebar-link" end>
            <ChartBarIcon className="sidebar-icon" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/bookings" className="sidebar-link">
            <ClipboardDocumentListIcon className="sidebar-icon" />
            <span>Booking</span>
          </NavLink>

          <NavLink to="/admin/services" className="sidebar-link">
            <CalendarIcon className="sidebar-icon" />
            <span>Layanan</span>
          </NavLink>

          <NavLink to="/admin/schedules" className="sidebar-link">
            <ClockIcon className="sidebar-icon" />
            <span>Jadwal</span>
          </NavLink>

          <NavLink to="/admin/reports" className="sidebar-link">
            <DocumentChartBarIcon className="sidebar-icon" />
            <span>Laporan</span>
          </NavLink>
        </nav>

        {/* ===== SIDEBAR FOOTER ===== */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <span className="user-avatar-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </span>

            <span className="user-name">{user?.name || "Admin"}</span>
          </div>

          <button
            type="button"
            className="sidebar-link logout"
            onClick={handleLogout}
          >
            <ArrowRightOnRectangleIcon className="sidebar-icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1 className="admin-page-title">Panel Admin</h1>

            <p className="admin-page-subtitle">
              Kelola booking, layanan, dan jadwal lapangan futsal
            </p>
          </div>

          <div className="admin-header-right">
            <span className="admin-date">
              {new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>

      {/* ===== CSS ===== */}
      <style>{`
        /* ========================================
           FUTSALNOW DESIGN SYSTEM
           ========================================

           Green      #16A34A
           Dark       #0F172A
           Muted      #64748B
           Background #F8FAFC
           White      #FFFFFF
           Border     #E2E8F0

           Card       12px
           Button     8px
           Input      8px

           Minimal shadow
        ======================================== */

        /* ===== ADMIN LAYOUT ===== */

        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #F8FAFC;
        }

        /* ===== SIDEBAR ===== */

        .admin-sidebar {
          width: 250px;
          background: #0F172A;
          color: #FFFFFF;

          display: flex;
          flex-direction: column;

          padding: 1.25rem 0;

          position: sticky;
          top: 0;

          height: 100vh;

          flex-shrink: 0;
          z-index: 100;
        }

        /* ===== BRAND ===== */

        .sidebar-brand {
          display: flex;
          align-items: center;

          padding: 0 1.25rem 1.25rem;

          border-bottom: 1px solid rgba(255, 255, 255, 0.08);

          margin-bottom: 1rem;
        }

        .brand-name {
          color: #FFFFFF;
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        /* ===== NAVIGATION ===== */

        .sidebar-nav {
          flex: 1;

          display: flex;
          flex-direction: column;

          gap: 0.25rem;

          padding: 0 0.75rem;
        }

        .sidebar-link {
          display: flex;
          align-items: center;

          gap: 0.75rem;

          width: 100%;
          box-sizing: border-box;

          padding: 0.65rem 0.85rem;

          color: #94A3B8;

          text-decoration: none;

          border-radius: 8px;
          border: none;

          background: transparent;

          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 500;

          cursor: pointer;

          transition:
            background-color 0.15s ease,
            color 0.15s ease;
        }

        .sidebar-link:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #FFFFFF;
        }

        .sidebar-link.active {
          background: #16A34A;
          color: #FFFFFF;
        }

        .sidebar-icon {
          width: 20px;
          height: 20px;

          stroke-width: 1.8;

          flex-shrink: 0;
        }

        /* ===== SIDEBAR FOOTER ===== */

        .sidebar-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.08);

          padding: 0.75rem 0.75rem 0;

          margin-top: 1rem;
        }

        /* ===== USER ===== */

        .sidebar-user {
          display: flex;
          align-items: center;

          gap: 0.75rem;

          padding: 0.6rem 0.75rem;

          margin-bottom: 0.5rem;

          border-radius: 8px;
        }

        .user-avatar-sm {
          width: 32px;
          height: 32px;

          border-radius: 50%;

          background: #16A34A;
          color: #FFFFFF;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 0.8rem;
          font-weight: 600;

          flex-shrink: 0;
        }

        .user-name {
          color: #E2E8F0;

          font-size: 0.85rem;
          font-weight: 500;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ===== LOGOUT ===== */

        .sidebar-link.logout {
          color: #94A3B8;
        }

        .sidebar-link.logout:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #FFFFFF;
        }

        /* ===== MAIN ===== */

        .admin-main {
          flex: 1;

          min-width: 0;

          padding: 1.5rem 2rem 2rem;

          background: #F8FAFC;
        }

        /* ===== HEADER ===== */

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;

          margin-bottom: 1.5rem;
          padding-bottom: 1rem;

          border-bottom: 1px solid #E2E8F0;
        }

        .admin-page-title {
          margin: 0;

          font-size: 1.5rem;
          line-height: 1.3;

          font-weight: 700;

          color: #0F172A;
        }

        .admin-page-subtitle {
          margin: 0.3rem 0 0;

          color: #64748B;

          font-size: 0.9rem;
          line-height: 1.5;
        }

        .admin-header-right {
          color: #64748B;

          font-size: 0.85rem;

          padding-top: 0.2rem;

          white-space: nowrap;
        }

        /* ===== CONTENT CARD ===== */

        .admin-content {
          background: #FFFFFF;

          border: 1px solid #E2E8F0;

          border-radius: 12px;

          padding: 1.5rem;

          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
        }

        /* ========================================
           RESPONSIVE
           ======================================== */

        @media (max-width: 768px) {

          .admin-sidebar {
            width: 72px;
            padding: 1rem 0;
          }

          .sidebar-brand {
            justify-content: center;

            padding: 0 0 1rem;

            margin-bottom: 1rem;
          }

          .brand-name {
            font-size: 0;
          }

          .brand-name::first-letter {
            font-size: 1.25rem;
          }

          .sidebar-link {
            justify-content: center;

            padding: 0.65rem;
          }

          .sidebar-link span {
            display: none;
          }

          .sidebar-icon {
            width: 21px;
            height: 21px;
          }

          .sidebar-user {
            justify-content: center;
            padding: 0.5rem;
          }

          .user-name {
            display: none;
          }

          .admin-main {
            padding: 1rem;
          }

          .admin-content {
            padding: 1rem;
          }

          .admin-header {
            flex-direction: column;
            gap: 0.5rem;
          }
        }

        @media (max-width: 480px) {

          .admin-sidebar {
            width: 56px;
            padding: 0.75rem 0;
          }

          .sidebar-nav {
            padding: 0 0.5rem;
          }

          .sidebar-link {
            padding: 0.55rem;
          }

          .sidebar-icon {
            width: 20px;
            height: 20px;
          }

          .sidebar-footer {
            padding: 0.6rem 0.5rem 0;
          }

          .admin-main {
            padding: 0.75rem;
          }

          .admin-content {
            padding: 0.75rem;
            border-radius: 12px;
          }

          .admin-page-title {
            font-size: 1.2rem;
          }

          .admin-page-subtitle {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}
