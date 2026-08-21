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

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">📊 Dashboard Admin</h1>
        <p className="dashboard-subtitle">
          Ringkasan performa bisnis futsal-mu.
        </p>
      </div>

      {/* Statistik Grid */}
      <div className="stats-grid">
        <StatCard
          icon="📋"
          label="Total Booking"
          value={summary.total_bookings}
          bg="bg-blue-soft"
          textColor="text-blue-700"
        />
        <StatCard
          icon="💰"
          label="Total Pendapatan"
          value={formatRupiah(summary.total_revenue)}
          bg="bg-green-soft"
          textColor="text-green-700"
        />
        <StatCard
          icon="⏳"
          label="Pending"
          value={byStatus.pending ?? 0}
          bg="bg-yellow-soft"
          textColor="text-yellow-700"
        />
        <StatCard
          icon="✅"
          label="Selesai / Batal"
          value={`${byStatus.completed ?? 0} / ${byStatus.canceled ?? 0}`}
          bg="bg-purple-soft"
          textColor="text-purple-700"
        />
      </div>

      {/* Top Services */}
      <div className="top-services-section">
        <h2 className="section-title">🏆 Lapangan Terlaris</h2>
        {!summary.top_services || summary.top_services.length === 0 ? (
          <p className="empty-data">Belum ada data booking.</p>
        ) : (
          <div className="table-wrapper">
            <table className="top-services-table">
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
                    <td className="rank">{i + 1}</td>
                    <td className="service-name">{s.name}</td>
                    <td>{s.total_bookings}</td>
                    <td className="revenue">{formatRupiah(s.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CSS inline (bisa dipindah ke file terpisah) */}
      <style>{`
        .dashboard-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .dashboard-header {
          margin-bottom: 2rem;
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .dashboard-subtitle {
          color: #6b7280;
          font-size: 1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 1.5rem 1.25rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          border: 1px solid #f3f0ff;
          transition: 0.25s;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(124,58,237,0.08);
          border-color: #d4c4ff;
        }

        .stat-icon {
          font-size: 2rem;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          flex-shrink: 0;
        }

        .bg-blue-soft { background: #dbeafe; }
        .bg-green-soft { background: #d1fae5; }
        .bg-yellow-soft { background: #fef3c7; }
        .bg-purple-soft { background: #f3e8ff; }

        .stat-content {
          flex: 1;
          min-width: 0;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #6b7280;
          font-weight: 500;
          display: block;
          margin-bottom: 0.15rem;
        }

        .stat-value {
          font-size: 1.6rem;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.2;
        }

        .text-blue-700 .stat-value { color: #1d4ed8; }
        .text-green-700 .stat-value { color: #16a34a; }
        .text-yellow-700 .stat-value { color: #b45309; }
        .text-purple-700 .stat-value { color: #7c3aed; }

        .top-services-section {
          background: white;
          border-radius: 24px;
          padding: 1.5rem 1.5rem 0.5rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          border: 1px solid #f3f0ff;
        }

        .section-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1.25rem;
        }

        .empty-data {
          color: #6b7280;
          padding: 1rem 0 1.5rem;
        }

        .table-wrapper {
          overflow-x: auto;
          margin: 0 -0.5rem;
          padding: 0 0.5rem;
        }

        .top-services-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.95rem;
        }

        .top-services-table thead {
          background: #f9fafb;
          border-radius: 12px 12px 0 0;
        }

        .top-services-table th {
          text-align: left;
          padding: 0.75rem 1rem;
          font-weight: 600;
          color: #374151;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          border-bottom: 1px solid #e5e7eb;
        }

        .top-services-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f3f4f6;
          color: #1f2937;
        }

        .top-services-table tbody tr:hover {
          background: #faf9ff;
        }

        .top-services-table .rank {
          font-weight: 600;
          color: #6b7280;
          width: 40px;
        }

        .top-services-table .service-name {
          font-weight: 500;
        }

        .top-services-table .revenue {
          font-weight: 600;
          color: #7c3aed;
        }

        .dashboard-loading,
        .dashboard-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          color: #6b7280;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f0ff;
          border-top: 4px solid #7c3aed;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .alert {
          padding: 0.75rem 1rem;
          border-radius: 14px;
          font-size: 0.9rem;
          border-left: 4px solid;
        }
        .alert-error {
          background: #fef2f2;
          border-color: #dc2626;
          color: #991b1b;
        }

        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
          }
          .stat-card {
            padding: 1rem;
            flex-direction: column;
            text-align: center;
          }
          .stat-value {
            font-size: 1.3rem;
          }
          .stat-icon {
            font-size: 1.5rem;
            width: 40px;
            height: 40px;
          }
          .dashboard-title {
            font-size: 1.5rem;
          }
          .top-services-section {
            padding: 1rem 1rem 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}

// ===== Komponen StatCard =====
function StatCard({ icon, label, value, bg }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${bg}`}>{icon}</div>
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
    </div>
  );
}
