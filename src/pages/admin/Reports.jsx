import { useCallback, useEffect, useState } from "react";
import { getReportBookings } from "../../api/bookingApi";

const formatRupiah = (n) => {
  let value = Number(n ?? 0);
  if (value < 10000) value = value * 1000;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatTanggal = (d) => {
  if (!d) return "-";
  const date = new Date(d);
  return isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
};

const formatJam = (t) => (t || "").slice(0, 5);

export default function Reports() {
  const [bookings, setBookings] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;
      if (currentPage) params.page = currentPage;

      const res = await getReportBookings(params);
      console.log("REPORT RESPONSE:", res.data);

      const bookingsData = res.data?.data ?? res.data;
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);

      if (res.data?.current_page) {
        setPagination({
          current_page: res.data.current_page,
          last_page: res.data.last_page,
          per_page: res.data.per_page,
          total: res.data.total,
        });
      } else {
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: bookingsData.length,
          total: bookingsData.length,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat laporan.");
    } finally {
      setLoading(false);
    }
  }, [from, to, currentPage]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const goToPage = (page) => {
    if (page < 1 || page > pagination.last_page) return;
    setCurrentPage(page);
  };

  const totalPendapatan = bookings
    .filter((b) => b.payment_status === "paid")
    .reduce((sum, b) => sum + Number(b.total_price || 0), 0);

  const stats = [
    {
      label: "Total Booking",
      value: pagination.total,
      icon: "📊",
      bg: "bg-blue",
      text: "text-blue-700",
    },
    {
      label: "Total Pendapatan (halaman ini)",
      value: formatRupiah(totalPendapatan),
      icon: "💰",
      bg: "bg-green",
      text: "text-green-700",
    },
  ];

  return (
    <div className="reports-proka">
      {/* ===== FILTER ===== */}
      <div className="filter-bar-proka">
        <div className="filter-group">
          <label className="filter-label">Dari</label>
          <input
            type="date"
            className="filter-input"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="filter-group">
          <label className="filter-label">Sampai</label>
          <input
            type="date"
            className="filter-input"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        {(from || to) && (
          <button
            className="btn-reset-proka"
            onClick={() => {
              setFrom("");
              setTo("");
              setCurrentPage(1);
            }}
          >
            Reset
          </button>
        )}
      </div>

      {/* ===== STATS ===== */}
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

      {/* ===== TABLE ===== */}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Memuat laporan...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <p>😕 Belum ada data di rentang tanggal ini.</p>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table-proka">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Pelanggan</th>
                  <th>Layanan</th>
                  <th>Tanggal</th>
                  <th>Jam</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Pembayaran</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, index) => (
                  <tr key={b.id}>
                    <td>
                      {(pagination.current_page - 1) * pagination.per_page +
                        index +
                        1}
                    </td>
                    <td>{b.user?.name || "-"}</td>
                    <td>{b.service?.name || "-"}</td>
                    <td>{formatTanggal(b.booking_date)}</td>
                    <td>
                      {formatJam(b.start_time)}–{formatJam(b.end_time)}
                    </td>
                    <td>
                      <span className={`status-badge status-${b.status}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>{formatRupiah(b.total_price)}</td>
                    <td>
                      {b.payment_status === "paid" ? (
                        <span className="badge-success">Lunas</span>
                      ) : (
                        <span className="badge-warning">Belum Dibayar</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== PAGINATION ===== */}
          {pagination.last_page > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => goToPage(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
              >
                ← Sebelumnya
              </button>
              <span className="page-info">
                {pagination.current_page} / {pagination.last_page}
              </span>
              <button
                className="page-btn"
                onClick={() => goToPage(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
              >
                Selanjutnya →
              </button>
            </div>
          )}
        </>
      )}

      {/* ===== CSS ===== */}
      <style>{`
        .reports-proka {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ===== FILTER ===== */
        .filter-bar-proka {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem 1.5rem;
          background: white;
          padding: 1rem 1.5rem;
          border-radius: 14px;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
          border: 1px solid #f0f0f0;
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .filter-label {
          font-weight: 500;
          color: #374151;
          font-size: 0.85rem;
        }
        .filter-input {
          padding: 0.4rem 0.8rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.9rem;
          background: #fafafa;
          transition: 0.2s;
        }
        .filter-input:focus {
          outline: none;
          border-color: #1e293b;
          background: white;
          box-shadow: 0 0 0 3px rgba(30,41,59,0.08);
        }
        .btn-reset-proka {
          padding: 0.3rem 1rem;
          background: #f3f4f6;
          border: none;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 500;
          color: #4b5563;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-reset-proka:hover {
          background: #e5e7eb;
        }

        /* ===== STATS ===== */
        .stats-grid-proka {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .stat-card-proka {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-radius: 14px;
          background: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
          transition: all 0.25s ease;
          border: 1px solid #f0f0f0;
          min-width: 0;
          overflow: hidden;
        }
        .stat-card-proka:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
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
        .bg-blue { background: #dbeafe; }
        .bg-green { background: #d1fae5; }
        .text-blue-700 { color: #1d4ed8; }
        .text-green-700 { color: #16a34a; }

        /* ===== TABLE PROKA ===== */
        .table-wrapper {
          overflow-x: auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
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

        /* ===== STATUS BADGE ===== */
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-confirmed { background: #cce5ff; color: #004085; }
        .status-completed { background: #d4edda; color: #155724; }
        .status-canceled { background: #f8d7da; color: #721c24; }

        .badge-success {
          background: #d4edda;
          color: #155724;
          padding: 4px 12px;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .badge-warning {
          background: #fff3cd;
          color: #856404;
          padding: 4px 12px;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* ===== PAGINATION ===== */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
          margin-top: 2rem;
        }
        .page-btn {
          padding: 0.4rem 1rem;
          border-radius: 30px;
          border: 1.5px solid #e5e7eb;
          background: white;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          transition: 0.2s;
        }
        .page-btn:hover:not(:disabled) {
          background: #f5f3ff;
          border-color: #1e293b;
        }
        .page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .page-info {
          font-weight: 500;
          color: #6b7280;
          font-size: 0.9rem;
        }

        /* ===== LOADING & EMPTY ===== */
        .loading-state,
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 0;
          color: #6b7280;
        }
        .spinner {
          width: 36px;
          height: 36px;
          border: 4px solid #f3f0ff;
          border-top: 4px solid #1e293b;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 1rem;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .alert {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }
        .alert-error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #ef4444;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .filter-bar-proka {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
            padding: 1rem;
          }
          .filter-group {
            flex-wrap: wrap;
          }
          .stats-grid-proka {
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
          }
          .stat-card-proka {
            flex-direction: column;
            text-align: center;
          }
          .stat-icon {
            font-size: 1.3rem;
            width: auto;
          }
          .stat-value {
            font-size: 1.1rem;
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
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
