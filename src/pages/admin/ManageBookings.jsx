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

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusAction, setStatusAction] = useState(null);

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

  const handleUpdateStatus = (booking, newStatus) => {
    setStatusAction({ booking, newStatus });
    setShowStatusModal(true);
  };

  const submitStatusChange = async () => {
    if (!statusAction) return;
    const { booking, newStatus } = statusAction;
    setShowStatusModal(false);
    try {
      await updateBookingStatus(booking.id, newStatus);
      setInfo(`Booking #${booking.id} berhasil diubah menjadi "${newStatus}".`);
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengubah status booking.");
    }
    setStatusAction(null);
  };

  return (
    <div className="page-content manage-bookings-page">
      <div className="page-header">
        <h1 className="page-title">Kelola Booking</h1>
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
              setCurrentPage(1);
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
          <div className="table-wrapper">
            <table className="table-proka">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Layanan</th>
                  <th>Tanggal</th>
                  <th>Jam</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Pembayaran</th>
                  <th>Aksi</th>
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
                    <td>{b.payment ? b.payment.method : "Belum dibayar"}</td>
                    <td className="table-actions">
                      {b.status === "pending" && (
                        <>
                          <button
                            className="btn-confirm"
                            onClick={() => handleUpdateStatus(b, "confirmed")}
                          >
                            Konfirmasi
                          </button>
                          <button
                            className="btn-cancel"
                            onClick={() => handleUpdateStatus(b, "canceled")}
                          >
                            Batalkan
                          </button>
                        </>
                      )}
                      {b.status === "confirmed" && (
                        <button
                          className="btn-complete"
                          onClick={() => handleUpdateStatus(b, "completed")}
                        >
                          Tandai Selesai
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MODAL KONFIRMASI */}
          {showStatusModal && statusAction && (
            <div
              className="modal-overlay"
              onClick={() => setShowStatusModal(false)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>⚠️ Konfirmasi Ubah Status</h3>
                  <button
                    className="modal-close"
                    onClick={() => setShowStatusModal(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="modal-body">
                  <p className="modal-sub">
                    Yakin ingin mengubah status booking #
                    {statusAction.booking.id} menjadi{" "}
                    <strong>{statusAction.newStatus}</strong>?
                  </p>
                  <div className="modal-actions">
                    <button
                      className="btn-cancel-modal"
                      onClick={() => setShowStatusModal(false)}
                    >
                      Batal
                    </button>
                    <button
                      className="btn-confirm-modal"
                      onClick={submitStatusChange}
                    >
                      Ya, Ubah
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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

      {/* ===== CSS ===== */}
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
          background: #fee2e2;
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
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
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
          border-color: #1e293b;
          box-shadow: 0 0 0 3px rgba(30, 41, 59, 0.08);
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
          border-top: 4px solid #1e293b;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 1rem;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

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

        .table-actions {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
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
        .status-pending {
          background: #fef3c7;
          color: #856404;
        }
        .status-confirmed {
          background: #cce5ff;
          color: #004085;
        }
        .status-completed {
          background: #d4edda;
          color: #155724;
        }
        .status-canceled {
          background: #f8d7da;
          color: #721c24;
        }

        /* ===== TOMBOL AKSI ===== */
        .btn-confirm {
          padding: 0.3rem 1.2rem;
          background: #1e293b;
          color: white;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-confirm:hover {
          background: #0f172a;
          transform: scale(1.04);
        }

        .btn-cancel {
          padding: 0.3rem 1.2rem;
          background: #fee2e2;
          color: #991b1b;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-cancel:hover {
          background: #fecaca;
          transform: scale(1.04);
        }

        .btn-complete {
          padding: 0.3rem 1.2rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-complete:hover {
          background: #1d4ed8;
          transform: scale(1.04);
        }

        /* ===== MODAL ===== */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          padding: 1rem;
        }
        .modal-content {
          background: white;
          border-radius: 24px;
          max-width: 420px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          animation: modalIn 0.25s ease;
        }
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem 1.5rem;
          border-bottom: 1px solid #f0f0f0;
          background: #fafafa;
        }
        .modal-header h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
        .modal-close {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #6b7280;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          transition: 0.2s;
        }
        .modal-close:hover {
          background: #f3f4f6;
        }
        .modal-body {
          padding: 1.5rem;
        }
        .modal-sub {
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 1.2rem;
        }
        .modal-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        .modal-actions button {
          flex: 1;
          padding: 0.6rem;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.9rem;
          border: none;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-cancel-modal {
          background: #f3f4f6;
          color: #374151;
        }
        .btn-cancel-modal:hover {
          background: #e5e7eb;
        }
        .btn-confirm-modal {
          background: #1e293b;
          color: white;
        }
        .btn-confirm-modal:hover {
          background: #0f172a;
          transform: scale(1.02);
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
          .table-proka {
            font-size: 0.8rem;
          }
          .table-proka th,
          .table-proka td {
            padding: 8px 10px;
          }
        }
      `}</style>
    </div>
  );
}
