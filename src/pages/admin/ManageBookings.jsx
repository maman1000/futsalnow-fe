import { useCallback, useEffect, useState } from "react";
import { getBookings, updateBookingStatus } from "../../api/bookingApi";

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n ?? 0);

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

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // State pagination
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (status) params.status = status;
      if (date) params.date = date;
      if (currentPage) params.page = currentPage;

      const res = await getBookings(params);
      setBookings(res.data.data || []);
      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
        per_page: res.data.per_page,
        total: res.data.total,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data booking.");
    } finally {
      setLoading(false);
    }
  }, [status, date, currentPage]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const goToPage = (page) => {
    if (page < 1 || page > pagination.last_page) return;
    setCurrentPage(page);
  };

  const handleUpdateStatus = async (booking, newStatus) => {
    const label =
      newStatus === "completed"
        ? "menandai selesai (completed)"
        : newStatus === "canceled"
          ? "membatalkan"
          : "mengubah status";
    if (!window.confirm(`Yakin ingin ${label} booking #${booking.id}?`)) return;
    setError("");
    setInfo("");
    try {
      await updateBookingStatus(booking.id, newStatus);
      setInfo(`Booking #${booking.id} berhasil diubah menjadi "${newStatus}".`);
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengubah status booking.");
    }
  };

  return (
    <div className="manage-bookings-page">
      <div className="page-header">
        <h1 className="page-title">📋 Kelola Booking</h1>
        <p className="page-subtitle">
          Pantau semua booking dan ubah statusnya.
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {info && <div className="alert alert-success">{info}</div>}

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <label className="filter-label">Status:</label>
          <select
            className="filter-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Semua</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="canceled">Canceled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">Tanggal:</label>
          <input
            type="date"
            className="filter-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        {(status || date) && (
          <button
            className="btn-reset"
            onClick={() => {
              setStatus("");
              setDate("");
              setCurrentPage(1); // reset ke halaman 1
            }}
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Daftar Booking */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Memuat booking...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <p>😕 Tidak ada booking yang cocok dengan filter.</p>
        </div>
      ) : (
        <>
          <div className="bookings-list">
            {bookings.map((b) => (
              <div key={b.id} className="booking-card">
                <div className="booking-card-main">
                  <div className="booking-info">
                    <div className="booking-header">
                      <span className="booking-id">#{b.id}</span>
                      <span className="booking-customer">
                        {b.user?.name || "Tanpa Nama"}
                      </span>
                    </div>
                    <div className="booking-details">
                      <span className="booking-service">
                        {b.service?.name || "Lapangan"}
                      </span>
                      <span className="booking-datetime">
                        {formatTanggal(b.booking_date)} •{" "}
                        {formatJam(b.start_time)}–{formatJam(b.end_time)}
                      </span>
                    </div>
                  </div>
                  <div className="booking-meta">
                    <span className={`badge badge-${b.status}`}>
                      {b.status}
                    </span>
                    <span className="booking-total">
                      {formatRupiah(b.total_price)}
                    </span>
                    <span className="booking-payment">
                      {b.payment ? b.payment.method : "Belum dibayar"}
                    </span>
                  </div>
                </div>
                <div className="booking-actions">
                  {b.status === "pending" && (
                    <>
                      <button
                        className="btn btn-complete"
                        onClick={() => handleUpdateStatus(b, "completed")}
                      >
                        Tandai Selesai
                      </button>
                      <button
                        className="btn btn-cancel"
                        onClick={() => handleUpdateStatus(b, "canceled")}
                      >
                        Batalkan
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
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

      <style>{`
        .manage-bookings-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .page-subtitle {
          color: #6b7280;
          font-size: 1rem;
        }

        .alert {
          padding: 0.75rem 1rem;
          border-radius: 14px;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          border-left: 4px solid;
        }
        .alert-error {
          background: #fef2f2;
          border-color: #dc2626;
          color: #991b1b;
        }
        .alert-success {
          background: #f0fdf4;
          border-color: #22c55e;
          color: #166534;
        }

        /* Filter */
        .filter-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem 1.5rem;
          background: white;
          padding: 1rem 1.5rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          border: 1px solid #f3f0ff;
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

        .filter-select,
        .filter-input {
          padding: 0.4rem 0.8rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.9rem;
          background: #fafafa;
          transition: 0.2s;
        }

        .filter-select:focus,
        .filter-input:focus {
          outline: none;
          border-color: #7c3aed;
          background: white;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.08);
        }

        .btn-reset {
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

        .btn-reset:hover {
          background: #e5e7eb;
        }

        /* Loading & Empty */
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

        /* Booking Cards */
        .bookings-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .booking-card {
          background: white;
          border-radius: 20px;
          padding: 1.25rem 1.5rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          border: 1px solid #f3f0ff;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          transition: 0.2s;
        }

        .booking-card:hover {
          box-shadow: 0 8px 24px rgba(124,58,237,0.08);
          border-color: #d4c4ff;
        }

        .booking-card-main {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem 2rem;
          flex: 1 1 60%;
        }

        .booking-info {
          flex: 1 1 200px;
        }

        .booking-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.2rem;
        }

        .booking-id {
          font-weight: 600;
          color: #6b7280;
          font-size: 0.85rem;
        }

        .booking-customer {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.95rem;
        }

        .booking-details {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1rem;
          font-size: 0.85rem;
          color: #6b7280;
        }

        .booking-service {
          font-weight: 500;
          color: #374151;
        }

        .booking-datetime {
          color: #6b7280;
        }

        .booking-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.75rem 1.5rem;
        }

        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
          display: inline-block;
        }
        .badge-pending {
          background: #fef3c7;
          color: #92400e;
        }
        .badge-confirmed {
          background: #dbeafe;
          color: #1e40af;
        }
        .badge-completed {
          background: #d1fae5;
          color: #065f46;
        }
        .badge-canceled {
          background: #fee2e2;
          color: #991b1b;
        }

        .booking-total {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.95rem;
        }

        .booking-payment {
          font-size: 0.85rem;
          color: #6b7280;
        }

        .booking-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-left: auto;
        }

        .btn {
          padding: 0.4rem 1rem;
          border-radius: 30px;
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

        .btn-complete {
          background: #7c3aed;
          color: white;
        }
        .btn-complete:hover {
          background: #6d28d9;
          transform: scale(1.04);
          box-shadow: 0 4px 12px rgba(124,58,237,0.3);
        }

        .btn-cancel {
          background: #fee2e2;
          color: #991b1b;
        }
        .btn-cancel:hover {
          background: #fecaca;
          transform: scale(1.04);
        }

        /* Pagination */
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
          border-color: #7c3aed;
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

        @media (max-width: 640px) {
          .filter-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
            padding: 1rem;
          }
          .filter-group {
            flex-wrap: wrap;
          }
          .booking-card {
            flex-direction: column;
            align-items: stretch;
            padding: 1rem;
          }
          .booking-card-main {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }
          .booking-meta {
            justify-content: flex-start;
            gap: 0.5rem;
          }
          .booking-actions {
            margin-left: 0;
            margin-top: 0.5rem;
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
