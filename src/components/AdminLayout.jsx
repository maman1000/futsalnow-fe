// import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function AdminLayout() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await logout();
//     navigate("/login");
//   };

//   return (
//     <div className="admin-layout">
//       {/* ===== SIDEBAR ===== */}
//       <aside className="admin-sidebar">
//         {/* <div className="sidebar-brand">
//           <span className="brand-icon">⚽</span>
//           <span className="brand-name">FutsalNow</span>
//           <span className="brand-badge">Admin</span>
//         </div> */}
//         <div className="sidebar-brand">
//           <span className="auth-brand-icon">🏟️</span>
//           <span className="brand-name">FutsalNow</span>
//           <span className="brand-badge">Admin</span>
//         </div>

//         <nav className="sidebar-nav">
//           <NavLink to="/admin" className="sidebar-link" end>
//             <span className="sidebar-icon">📊</span>
//             <span>Dashboard</span>
//           </NavLink>
//           <NavLink to="/admin/bookings" className="sidebar-link">
//             <span className="sidebar-icon">📋</span>
//             <span>Booking</span>
//           </NavLink>
//           <NavLink to="/admin/services" className="sidebar-link">
//             <span className="sidebar-icon">⚽</span>
//             <span>Layanan</span>
//           </NavLink>
//           <NavLink to="/admin/schedules" className="sidebar-link">
//             <span className="sidebar-icon">📅</span>
//             <span>Jadwal</span>
//           </NavLink>
//           <NavLink to="/admin/reports" className="sidebar-link">
//             <span className="sidebar-icon">📈</span>
//             <span>Laporan</span>
//           </NavLink>
//         </nav>

//         <div className="sidebar-footer">
//           <div className="sidebar-user">
//             <span className="user-avatar-sm">
//               {user?.name?.charAt(0)?.toUpperCase() || "A"}
//             </span>
//             <span className="user-name">{user?.name || "Admin"}</span>
//           </div>
//           <button className="sidebar-link logout" onClick={handleLogout}>
//             <span className="sidebar-icon">🚪</span>
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* ===== MAIN CONTENT ===== */}
//       <main className="admin-main">
//         <header className="admin-header">
//           <div>
//             <h1 className="admin-page-title">Panel Admin</h1>
//             <p className="admin-page-subtitle">
//               Kelola booking, layanan, dan jadwal lapangan futsal
//             </p>
//           </div>
//           <div className="admin-header-right">
//             <span className="admin-date">
//               {new Date().toLocaleDateString("id-ID", {
//                 day: "numeric",
//                 month: "long",
//                 year: "numeric",
//               })}
//             </span>
//           </div>
//         </header>
//         <div className="admin-content">
//           <Outlet />
//         </div>
//       </main>

//       {/* ===== CSS ===== */}
//       <style>{`
//         /* ===== ADMIN LAYOUT ===== */
//         .admin-layout {
//           display: flex;
//           min-height: 100vh;
//           background: #f8fafc;
//         }

//         /* ===== SIDEBAR ===== */
//         .admin-sidebar {
//           width: 260px;
//           background: #1a1a2e;
//           color: #fff;
//           display: flex;
//           flex-direction: column;
//           padding: 1.5rem 0;
//           position: sticky;
//           top: 0;
//           height: 100vh;
//           flex-shrink: 0;
//           z-index: 100;
//         }

//         .sidebar-brand {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           padding: 0 1.5rem 2rem;
//           font-size: 1.2rem;
//           font-weight: 700;
//           border-bottom: 1px solid rgba(255, 255, 255, 0.06);
//           margin-bottom: 1.5rem;
//           padding-bottom: 1.5rem;
//         }
//         .sidebar-brand .brand-icon {
//           font-size: 1.8rem;
//         }
//         .sidebar-brand .brand-name {
//           color: #fff;
//         }
//         .sidebar-brand .brand-badge {
//           font-size: 0.55rem;
//           background: #7c3aed;
//           padding: 0.15rem 0.5rem;
//           border-radius: 30px;
//           font-weight: 500;
//           margin-left: 0.3rem;
//           letter-spacing: 0.03em;
//         }

//         .sidebar-nav {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//           gap: 0.2rem;
//           padding: 0 0.75rem;
//         }

//         .sidebar-link {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           padding: 0.6rem 1rem;
//           color: rgba(255, 255, 255, 0.6);
//           text-decoration: none;
//           border-radius: 10px;
//           transition: all 0.2s;
//           font-size: 0.9rem;
//           font-weight: 500;
//         }
//         .sidebar-link:hover {
//           background: rgba(255, 255, 255, 0.08);
//           color: #fff;
//         }
//         .sidebar-link.active {
//           // background: #7c3aed;
//           background: #1e3a5f; /* biru tua Proka */
//           color: #fff;
//         }
//         .sidebar-link .sidebar-icon {
//           font-size: 1.2rem;
//           width: 24px;
//           text-align: center;
//         }
//         .sidebar-link.logout {
//           color: rgba(255, 100, 100, 0.6);
//           margin-top: 0.5rem;
//         }
//         .sidebar-link.logout:hover {
//           background: rgba(255, 0, 0, 0.1);
//           color: #ff6b6b;
//         }

//         .sidebar-footer {
//           border-top: 1px solid rgba(255, 255, 255, 0.06);
//           padding: 0.75rem 0.75rem 0;
//         }

//         .sidebar-user {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           padding: 0.5rem 0.75rem;
//           margin-bottom: 0.5rem;
//           background: rgba(255, 255, 255, 0.05);
//           border-radius: 10px;
//         }
//         .user-avatar-sm {
//           width: 32px;
//           height: 32px;
//           border-radius: 50%;
//           background: #7c3aed;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 600;
//           font-size: 0.8rem;
//           color: #fff;
//         }
//         .sidebar-user .user-name {
//           font-size: 0.85rem;
//           color: rgba(255, 255, 255, 0.85);
//         }

//         /* ===== MAIN CONTENT ===== */
//         .admin-main {
//           flex: 1;
//           padding: 1.5rem 2rem 2rem;
//           min-width: 0;
//         }

//         .admin-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           margin-bottom: 2rem;
//           padding-bottom: 1rem;
//           border-bottom: 1px solid #e5e7eb;
//         }
//         .admin-page-title {
//           font-size: 1.5rem;
//           font-weight: 700;
//           color: #1a1a2e;
//           margin: 0;
//         }
//         .admin-page-subtitle {
//           color: #6b7280;
//           font-size: 0.9rem;
//           margin: 0.2rem 0 0;
//         }
//         .admin-header-right {
//           color: #6b7280;
//           font-size: 0.9rem;
//           padding-top: 0.2rem;
//         }

//         .admin-content {
//           background: white;
//           border-radius: 16px;
//           padding: 1.5rem;
//           box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
//         }

//         /* ===== RESPONSIVE ===== */
//         @media (max-width: 768px) {
//           .admin-sidebar {
//             width: 72px;
//             padding: 1rem 0;
//           }
//           .sidebar-brand .brand-name,
//           .sidebar-brand .brand-badge {
//             display: none;
//           }
//           .sidebar-brand {
//             justify-content: center;
//             padding: 0 0 1rem 0;
//             margin-bottom: 1rem;
//           }
//           .sidebar-link span:not(.sidebar-icon) {
//             display: none;
//           }
//           .sidebar-link {
//             justify-content: center;
//             padding: 0.6rem;
//           }
//           .sidebar-link .sidebar-icon {
//             font-size: 1.3rem;
//           }
//           .sidebar-user .user-name {
//             display: none;
//           }
//           .sidebar-user {
//             justify-content: center;
//           }
//           .admin-main {
//             padding: 1rem;
//           }
//           .admin-content {
//             padding: 1rem;
//           }
//           .admin-header {
//             flex-direction: column;
//             gap: 0.5rem;
//           }
//         }

//         @media (max-width: 480px) {
//           .admin-sidebar {
//             width: 56px;
//             padding: 0.5rem 0;
//           }
//           .sidebar-link {
//             padding: 0.5rem;
//           }
//           .sidebar-link .sidebar-icon {
//             font-size: 1.1rem;
//             width: 20px;
//           }
//           .admin-main {
//             padding: 0.5rem;
//           }
//           .admin-content {
//             padding: 0.75rem;
//             border-radius: 12px;
//           }
//           .admin-page-title {
//             font-size: 1.2rem;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
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
          <span className="brand-badge">Admin</span>
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

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <span className="user-avatar-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </span>
            <span className="user-name">{user?.name || "Admin"}</span>
          </div>
          <button className="sidebar-link logout" onClick={handleLogout}>
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
        /* ===== ADMIN LAYOUT ===== */
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        /* ===== SIDEBAR ===== */
        .admin-sidebar {
          width: 260px;
          background: #1a1a2e;
          color: #fff;
          display: flex;
          flex-direction: column;
          padding: 1.5rem 0;
          position: sticky;
          top: 0;
          height: 100vh;
          flex-shrink: 0;
          z-index: 100;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0 1.5rem 2rem;
          font-size: 1.2rem;
          font-weight: 700;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
        }
        .sidebar-brand .brand-name {
          color: #fff;
        }
        .sidebar-brand .brand-badge {
          font-size: 0.55rem;
          background: #1e293b;
          padding: 0.15rem 0.5rem;
          border-radius: 30px;
          font-weight: 500;
          margin-left: 0.3rem;
          letter-spacing: 0.03em;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding: 0 0.75rem;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 1rem;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          border-radius: 10px;
          transition: all 0.2s;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .sidebar-link:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
        }
        .sidebar-link.active {
          background: #1e3a5f;
          color: #fff;
        }
        .sidebar-link .sidebar-icon {
          width: 20px;
          height: 20px;
          stroke-width: 1.8;
          flex-shrink: 0;
        }
        .sidebar-link.logout {
          color: rgba(255, 100, 100, 0.6);
          margin-top: 0.5rem;
        }
        .sidebar-link.logout:hover {
          background: rgba(255, 0, 0, 0.1);
          color: #ff6b6b;
        }

        .sidebar-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding: 0.75rem 0.75rem 0;
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          margin-bottom: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .user-avatar-sm {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.8rem;
          color: #fff;
        }
        .sidebar-user .user-name {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.85);
        }

        /* ===== MAIN CONTENT ===== */
        .admin-main {
          flex: 1;
          padding: 1.5rem 2rem 2rem;
          min-width: 0;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }
        .admin-page-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
        }
        .admin-page-subtitle {
          color: #6b7280;
          font-size: 0.9rem;
          margin: 0.2rem 0 0;
        }
        .admin-header-right {
          color: #6b7280;
          font-size: 0.9rem;
          padding-top: 0.2rem;
        }

        .admin-content {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .admin-sidebar {
            width: 72px;
            padding: 1rem 0;
          }
          .sidebar-brand .brand-name,
          .sidebar-brand .brand-badge {
            display: none;
          }
          .sidebar-brand {
            justify-content: center;
            padding: 0 0 1rem 0;
            margin-bottom: 1rem;
          }
          .sidebar-link span:not(.sidebar-icon) {
            display: none;
          }
          .sidebar-link {
            justify-content: center;
            padding: 0.6rem;
          }
          .sidebar-link .sidebar-icon {
            width: 24px;
            height: 24px;
          }
          .sidebar-user .user-name {
            display: none;
          }
          .sidebar-user {
            justify-content: center;
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
            padding: 0.5rem 0;
          }
          .sidebar-link {
            padding: 0.5rem;
          }
          .sidebar-link .sidebar-icon {
            width: 20px;
            height: 20px;
          }
          .admin-main {
            padding: 0.5rem;
          }
          .admin-content {
            padding: 0.75rem;
            border-radius: 12px;
          }
          .admin-page-title {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}
