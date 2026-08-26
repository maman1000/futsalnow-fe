import { useCallback, useEffect, useState } from "react";

import { getReportBookings } from "../../api/bookingApi";

const formatRupiah = (n) => {
  const value = Number(n ?? 0);

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

const getStatusLabel = (status) => {
  const labels = {
    pending: "Menunggu",
    confirmed: "Dikonfirmasi",
    completed: "Selesai",
    canceled: "Dibatalkan",
  };

  return labels[status] || status || "-";
};

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

  return (
    <div className="reports-page">
      {/* HEADER */}
      <div className="page-header">
        <h1 className="page-title">Laporan Booking</h1>

        <p className="page-subtitle">
          Pantau data booking dan pembayaran berdasarkan periode.
        </p>
      </div>

      {/* FILTER */}
      <div className="filter-card">
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
            type="button"
            className="btn-reset"
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

      {/* SUMMARY */}
      {!loading && !error && (
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-label">Total Booking</div>

            <div className="summary-value">{pagination.total}</div>

            <div className="summary-description">
              Booking pada periode yang dipilih
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Pendapatan di Halaman Ini</div>

            <div className="summary-value summary-income">
              {formatRupiah(totalPendapatan)}
            </div>

            <div className="summary-description">
              Hanya dari booking yang sudah lunas
            </div>
          </div>
        </div>
      )}

      {/* ERROR */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* TABLE */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Memuat laporan...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <p>Belum ada data booking pada periode ini.</p>
        </div>
      ) : (
        <>
          <div className="table-card">
            <div className="table-header">
              <div>
                <h2>Data Booking</h2>

                <p>
                  Menampilkan {bookings.length} dari {pagination.total} booking.
                </p>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Pelanggan</th>
                    <th>Lapangan</th>
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

                      <td className="customer-name">{b.user?.name || "-"}</td>

                      <td>{b.service?.name || "-"}</td>

                      <td>{formatTanggal(b.booking_date)}</td>

                      <td className="time-cell">
                        {formatJam(b.start_time)}–{formatJam(b.end_time)}
                      </td>

                      <td>
                        <span className={`status-text status-${b.status}`}>
                          {getStatusLabel(b.status)}
                        </span>
                      </td>

                      <td className="price-cell">
                        {formatRupiah(b.total_price)}
                      </td>

                      <td>
                        <span
                          className={
                            b.payment_status === "paid"
                              ? "payment-paid"
                              : "payment-unpaid"
                          }
                        >
                          {b.payment_status === "paid"
                            ? "Lunas"
                            : "Belum Dibayar"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINATION */}
          {pagination.last_page > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="page-btn"
                onClick={() => goToPage(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
              >
                ← Sebelumnya
              </button>

              <span className="page-info">
                Halaman {pagination.current_page} dari {pagination.last_page}
              </span>

              <button
                type="button"
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

      <style>{`
        /* =========================================
           FUTSALNOW DESIGN SYSTEM
           ========================================= */

        .reports-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          background: #F8FAFC;
        }

        /* ================= HEADER ================= */

        .page-header {
          margin-bottom: 1.75rem;
        }

        .page-title {
          margin: 0 0 0.4rem;
          color: #0F172A;
          font-size: 1.9rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .page-subtitle {
          margin: 0;
          color: #64748B;
          font-size: 0.95rem;
        }

        /* ================= FILTER ================= */

        .filter-card {
          display: flex;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 1rem;

          padding: 1rem 1.25rem;

          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;

          margin-bottom: 1.25rem;

          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .filter-label {
          color: #0F172A;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .filter-input {
          min-width: 170px;
          height: 38px;

          padding: 0 0.75rem;

          border: 1px solid #E2E8F0;
          border-radius: 8px;

          background: #FFFFFF;
          color: #0F172A;

          font-size: 0.875rem;
          font-family: inherit;

          transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease;
        }

        .filter-input:focus {
          outline: none;
          border-color: #16A34A;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }

        .btn-reset {
          height: 38px;

          padding: 0 1rem;

          border: 1px solid #E2E8F0;
          border-radius: 8px;

          background: #FFFFFF;
          color: #64748B;

          font-size: 0.85rem;
          font-weight: 600;

          cursor: pointer;
          transition: 0.15s ease;
        }

        .btn-reset:hover {
          border-color: #CBD5E1;
          color: #0F172A;
          background: #F8FAFC;
        }

        /* ================= SUMMARY ================= */

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;

          margin-bottom: 1.25rem;
        }

        .summary-card {
          padding: 1.25rem;

          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;

          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .summary-label {
          color: #64748B;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
        }

        .summary-value {
          color: #0F172A;
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1.3;
        }

        .summary-income {
          color: #16A34A;
        }

        .summary-description {
          margin-top: 0.3rem;
          color: #64748B;
          font-size: 0.75rem;
        }

        /* ================= TABLE CARD ================= */

        .table-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;

          overflow: hidden;

          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .table-header {
          padding: 1.1rem 1.25rem;

          border-bottom: 1px solid #E2E8F0;
        }

        .table-header h2 {
          margin: 0 0 0.25rem;

          color: #0F172A;
          font-size: 1rem;
          font-weight: 700;
        }

        .table-header p {
          margin: 0;

          color: #64748B;
          font-size: 0.8rem;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .report-table {
          width: 100%;
          min-width: 900px;

          border-collapse: collapse;

          font-size: 0.85rem;
        }

        .report-table thead {
          background: #0F172A;
        }

        .report-table th {
          padding: 0.75rem 1rem;

          color: #FFFFFF;

          text-align: left;

          font-size: 0.72rem;
          font-weight: 600;

          letter-spacing: 0.03em;
          text-transform: uppercase;

          white-space: nowrap;
        }

        .report-table td {
          padding: 0.8rem 1rem;

          color: #0F172A;

          border-bottom: 1px solid #E2E8F0;

          vertical-align: middle;
          white-space: nowrap;
        }

        .report-table tbody tr:last-child td {
          border-bottom: none;
        }

        .report-table tbody tr:hover {
          background: #F8FAFC;
        }

        .customer-name {
          font-weight: 600;
        }

        .time-cell {
          font-variant-numeric: tabular-nums;
        }

        .price-cell {
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }

        /* ================= STATUS ================= */

        /*
         * Status tidak dibuat sebagai badge besar.
         * Hanya teks berwarna agar sesuai dengan prinsip
         * "No fake badges".
         */

        .status-text {
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-pending {
          color: #64748B;
        }

        .status-confirmed {
          color: #0F172A;
        }

        .status-completed {
          color: #16A34A;
        }

        .status-canceled {
          color: #DC2626;
        }

        /* ================= PAYMENT ================= */

        .payment-paid,
        .payment-unpaid {
          font-size: 0.8rem;
          font-weight: 600;
        }

        .payment-paid {
          color: #16A34A;
        }

        .payment-unpaid {
          color: #DC2626;
        }

        /* ================= PAGINATION ================= */

        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;

          margin-top: 1.25rem;
        }

        .page-btn {
          height: 36px;

          padding: 0 0.9rem;

          border: 1px solid #E2E8F0;
          border-radius: 8px;

          background: #FFFFFF;
          color: #0F172A;

          font-size: 0.8rem;
          font-weight: 600;

          cursor: pointer;
          transition: 0.15s ease;
        }

        .page-btn:hover:not(:disabled) {
          border-color: #16A34A;
          color: #16A34A;
        }

        .page-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .page-info {
          color: #64748B;
          font-size: 0.8rem;
          font-weight: 500;
        }

        /* ================= LOADING ================= */

        .loading-state,
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          min-height: 220px;

          color: #64748B;
          font-size: 0.9rem;
        }

        .spinner {
          width: 30px;
          height: 30px;

          margin-bottom: 0.75rem;

          border: 3px solid #E2E8F0;
          border-top-color: #16A34A;
          border-radius: 50%;

          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ================= ALERT ================= */

        .alert {
          padding: 0.75rem 1rem;

          margin-bottom: 1rem;

          border-radius: 8px;

          font-size: 0.85rem;
        }

        .alert-error {
          color: #B91C1C;
          background: #FEF2F2;
          border: 1px solid #FECACA;
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 768px) {
          .reports-page {
            padding: 1.25rem 1rem;
          }

          .page-title {
            font-size: 1.6rem;
          }

          .filter-card {
            align-items: stretch;
            flex-direction: column;
          }

          .filter-input {
            width: 100%;
            min-width: 0;
          }

          .btn-reset {
            width: fit-content;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .table-card {
            border-radius: 10px;
          }
        }

        @media (max-width: 480px) {
          .reports-page {
            padding: 1rem 0.75rem;
          }

          .summary-card {
            padding: 1rem;
          }

          .summary-value {
            font-size: 1.3rem;
          }

          .pagination {
            gap: 0.5rem;
          }

          .page-btn {
            padding: 0 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}
