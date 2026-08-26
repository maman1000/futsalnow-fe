import { useEffect, useState } from "react";
import {
  BarChart3,
  Wallet,
  Clock3,
  CheckCircle2,
  CircleCheck,
  XCircle,
} from "lucide-react";

import { getReportSummary } from "../../api/bookingApi";

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n ?? 0);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getReportSummary();
        setSummary(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Gagal memuat ringkasan.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Memuat dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  const byStatus = summary?.bookings_by_status || {};

  const totalBookings = summary?.total_bookings ?? 0;
  const totalRevenue = summary?.total_revenue ?? 0;

  const stats = [
    {
      label: "Total Booking",
      value: totalBookings,
      icon: BarChart3,
      iconClass: "stat-icon-neutral",
    },
    {
      label: "Total Pendapatan",
      value: formatRupiah(totalRevenue),
      icon: Wallet,
      iconClass: "stat-icon-green",
    },
    {
      label: "Pending",
      value: byStatus.pending ?? 0,
      icon: Clock3,
      iconClass: "stat-icon-yellow",
    },
    {
      label: "Confirmed",
      value: byStatus.confirmed ?? 0,
      icon: CheckCircle2,
      iconClass: "stat-icon-blue",
    },
    {
      label: "Completed",
      value: byStatus.completed ?? 0,
      icon: CircleCheck,
      iconClass: "stat-icon-green",
    },
    {
      label: "Canceled",
      value: byStatus.canceled ?? 0,
      icon: XCircle,
      iconClass: "stat-icon-red",
    },
  ];

  return (
    <div className="dashboard-page">
      {/* ===== HEADER ===== */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Ringkasan aktivitas dan performa booking FutsalNow.
          </p>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="dashboard-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="stat-card" key={stat.label}>
              <div className={`stat-icon ${stat.iconClass}`}>
                <Icon size={20} strokeWidth={1.8} />
              </div>

              <div className="stat-content">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== TOP SERVICES ===== */}
      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Lapangan Terlaris</h2>
            <p className="section-description">
              Performa booking berdasarkan lapangan.
            </p>
          </div>
        </div>

        {!summary?.top_services || summary.top_services.length === 0 ? (
          <div className="empty-data">
            <p>Belum ada data booking.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Lapangan</th>
                  <th>Total Booking</th>
                  <th>Pendapatan</th>
                </tr>
              </thead>

              <tbody>
                {summary.top_services.map((service, index) => (
                  <tr key={service.service_id}>
                    <td className="table-number">{index + 1}</td>

                    <td className="table-service">{service.name}</td>

                    <td>{service.total_bookings}</td>

                    <td className="table-revenue">
                      {formatRupiah(service.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ===== CSS ===== */}
      <style>{`
        .dashboard-page {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ===== HEADER ===== */

        .dashboard-header {
          margin-bottom: 1.75rem;
        }

        .dashboard-title {
          margin: 0;
          font-size: 1.8rem;
          line-height: 1.2;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.02em;
        }

        .dashboard-subtitle {
          margin: 0.4rem 0 0;
          font-size: 0.9rem;
          color: #64748b;
        }

        /* ===== STATS ===== */

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          padding: 1.15rem;
          background: #ffffff;
          border: 1px solid #e8eaf0;
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          border-color: #d9dde5;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }

        .stat-icon-neutral {
          background: #f1f5f9;
          color: #334155;
        }

        .stat-icon-blue {
          background: #eff6ff;
          color: #2563eb;
        }

        .stat-icon-green {
          background: #ecfdf5;
          color: #059669;
        }

        .stat-icon-yellow {
          background: #fffbeb;
          color: #d97706;
        }

        .stat-icon-red {
          background: #fef2f2;
          color: #dc2626;
        }

        .stat-content {
          min-width: 0;
          flex: 1;
        }

        .stat-label {
          display: block;
          margin-bottom: 0.2rem;
          font-size: 0.72rem;
          line-height: 1.3;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.035em;
        }

        .stat-value {
          display: block;
          color: #1e293b;
          font-size: 1.25rem;
          line-height: 1.25;
          font-weight: 700;
          overflow-wrap: anywhere;
        }

        /* ===== SECTION ===== */

        .dashboard-section {
          background: #ffffff;
          border: 1px solid #e8eaf0;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(15, 23, 42, 0.03);
          overflow: hidden;
        }

        .section-header {
          padding: 1.35rem 1.5rem 1rem;
        }

        .section-title {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 650;
          color: #1e293b;
        }

        .section-description {
          margin: 0.3rem 0 0;
          font-size: 0.82rem;
          color: #64748b;
        }

        /* ===== TABLE ===== */

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .dashboard-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;
        }

        .dashboard-table thead {
          background: #f8fafc;
          border-top: 1px solid #eef0f4;
          border-bottom: 1px solid #e8eaf0;
        }

        .dashboard-table th {
          padding: 0.75rem 1.5rem;
          text-align: left;
          color: #64748b;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.035em;
          white-space: nowrap;
        }

        .dashboard-table td {
          padding: 0.9rem 1.5rem;
          color: #475569;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .dashboard-table tbody tr:last-child td {
          border-bottom: none;
        }

        .dashboard-table tbody tr {
          transition: background 0.15s ease;
        }

        .dashboard-table tbody tr:hover {
          background: #f8fafc;
        }

        .table-number {
          width: 50px;
          color: #94a3b8 !important;
          font-weight: 600;
        }

        .table-service {
          color: #1e293b !important;
          font-weight: 600;
        }

        .table-revenue {
          color: #1e293b !important;
          font-weight: 600;
          white-space: nowrap;
        }

        /* ===== EMPTY ===== */

        .empty-data {
          padding: 2.5rem 1.5rem;
          text-align: center;
          color: #94a3b8;
          font-size: 0.9rem;
        }

        .empty-data p {
          margin: 0;
        }

        /* ===== LOADING ===== */

        .dashboard-loading {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        .spinner {
          width: 34px;
          height: 34px;
          margin-bottom: 0.8rem;
          border: 3px solid #e2e8f0;
          border-top-color: #1e293b;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .dashboard-loading p {
          margin: 0;
          font-size: 0.88rem;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ===== ERROR ===== */

        .dashboard-error {
          width: 100%;
          padding: 2rem 0;
        }

        .alert-error {
          padding: 0.85rem 1rem;
          border-radius: 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
          font-size: 0.88rem;
        }

        /* ===== TABLET ===== */

        @media (max-width: 900px) {
          .dashboard-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* ===== MOBILE ===== */

        @media (max-width: 640px) {
          .dashboard-title {
            font-size: 1.5rem;
          }

          .dashboard-subtitle {
            font-size: 0.85rem;
          }

          .dashboard-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.7rem;
          }

          .stat-card {
            padding: 0.9rem;
            gap: 0.65rem;
            flex-direction: column;
          }

          .stat-icon {
            width: 36px;
            height: 36px;
          }

          .stat-label {
            font-size: 0.65rem;
          }

          .stat-value {
            font-size: 1.05rem;
          }

          .section-header {
            padding: 1.1rem 1rem 0.85rem;
          }

          .dashboard-table th,
          .dashboard-table td {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }

        @media (max-width: 420px) {
          .dashboard-stats {
            gap: 0.55rem;
          }

          .stat-card {
            padding: 0.8rem;
          }

          .stat-icon {
            width: 34px;
            height: 34px;
          }

          .stat-value {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
