import { useEffect, useState } from "react";
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

  const byStatus = summary.bookings_by_status || {};
  const totalBookings = summary.total_bookings ?? 0;
  const totalRevenue = summary.total_revenue ?? 0;

  const stats = [
    {
      label: "Total Booking",
      value: totalBookings,
      icon: "📊",
      bg: "bg-blue",
      text: "text-blue-700",
    },
    {
      label: "Total Pendapatan",
      value: formatRupiah(totalRevenue),
      icon: "💰",
      bg: "bg-green",
      text: "text-green-700",
    },
    {
      label: "Pending",
      value: byStatus.pending ?? 0,
      icon: "⏳",
      bg: "bg-yellow",
      text: "text-yellow-700",
    },
    {
      label: "Confirmed",
      value: byStatus.confirmed ?? 0,
      icon: "✓",
      bg: "bg-blue-light",
      text: "text-blue-700",
    },
    {
      label: "Completed",
      value: byStatus.completed ?? 0,
      icon: "✔",
      bg: "bg-green-light",
      text: "text-green-700",
    },
    {
      label: "Canceled",
      value: byStatus.canceled ?? 0,
      icon: "✕",
      bg: "bg-red",
      text: "text-red-700",
    },
  ];

  return (
    <div className="dashboard-proka">
      {/* ===== STATS GRID ===== */}
      <div className="stats-grid-proka">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card-proka ${stat.bg}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <span className="stat-label">{stat.label}</span>
              <span className={`stat-value ${stat.text}`}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ===== TOP SERVICES ===== */}
      <div className="top-services-proka">
        <h3 className="section-title">Lapangan Terlaris</h3>
        {!summary.top_services || summary.top_services.length === 0 ? (
          <p className="empty-data">Data booking masih kosong 😅</p>
        ) : (
          <div className="table-wrapper">
            <table className="table-proka">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Lapangan</th>
                  <th>Total Booking</th>
                  <th>Pendapatan</th>
                </tr>
              </thead>
              <tbody>
                {summary.top_services.map((s, i) => (
                  <tr key={s.service_id}>
                    <td>{i + 1}</td>
                    <td>{s.name}</td>
                    <td>{s.total_bookings}</td>
                    <td>{formatRupiah(s.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== CSS ===== */}
      <style>{`
        .dashboard-proka {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ===== STATS GRID ===== */
        .stats-grid-proka {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card-proka {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-radius: 14px;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          transition: all 0.25s ease;
          border: 1px solid #f0f0f0;
          min-width: 0;
          overflow: hidden;
        }
        .stat-card-proka:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
        }

        .stat-icon {
          font-size: 1.6rem;
          line-height: 1;
          width: 40px;
          text-align: center;
          flex-shrink: 0;
        }

        .stat-content {
          flex: 1;
          min-width: 0;
        }
        .stat-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .stat-value {
          display: block;
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.2;
          margin-top: 0.1rem;
          word-break: break-word;
          overflow-wrap: break-word;
        }

        /* ===== WARNA CARD ===== */
        .bg-blue { background: #dbeafe; }
        .bg-blue-light { background: #dbeafe; }
        .bg-green { background: #d1fae5; }
        .bg-green-light { background: #d1fae5; }
        .bg-yellow { background: #fef3c7; }
        .bg-red { background: #fee2e2; }

        .text-blue-700 { color: #1d4ed8; }
        .text-green-700 { color: #16a34a; }
        .text-yellow-700 { color: #b45309; }
        .text-red-700 { color: #b91c1c; }

        /* ===== TABEL PROKA ===== */
        .table-wrapper {
          overflow-x: auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          border: 1px solid #f0f0f0;
        }
        .table-proka {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .table-proka thead {
          background: #1a1a2e;
          color: #fff;
        }
        .table-proka th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }
        .table-proka td {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
          vertical-align: middle;
        }
        .table-proka tbody tr:hover {
          background: #f8f9fc;
        }

        .top-services-proka {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          border: 1px solid #f0f0f0;
        }
        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }
        .empty-data {
          color: #6b7280;
          padding: 1rem 0;
        }

        .spinner {
          width: 36px;
          height: 36px;
          border: 4px solid #f3f0ff;
          border-top: 4px solid #1e293b;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 12px;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .dashboard-loading,
        .dashboard-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 0;
          color: #6b7280;
        }
        .alert {
          padding: 0.75rem 1rem;
          border-radius: 8px;
        }
        .alert-error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #ef4444;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .stats-grid-proka {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
          .stat-card-proka {
            padding: 1rem;
            flex-direction: column;
            text-align: center;
          }
          .stat-icon {
            font-size: 1.5rem;
            width: auto;
          }
          .stat-value {
            font-size: 1.3rem;
          }
        }

        @media (max-width: 480px) {
          .stats-grid-proka {
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
          }
          .stat-card-proka {
            padding: 0.75rem;
          }
          .stat-value {
            font-size: 1.1rem;
          }
          .stat-label {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </div>
  );
}
