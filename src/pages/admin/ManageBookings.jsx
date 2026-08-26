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
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
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
            onChange={(e) => {
              setDate(e.target.value);
              setCurrentPage(1);
            }}
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
          <p>Tidak ada booking yang cocok dengan filter.</p>
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
                  <h3>Konfirmasi Ubah Status</h3>
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
          padding: 32px 24px 48px;
          color: #0F172A;
        }

        /* =========================
          HEADER
        ========================= */

        .page-header {
          margin-bottom: 28px;
        }

        .page-title {
          margin: 0 0 6px;
          font-size: 28px;
          line-height: 1.2;
          font-weight: 700;
          color: #0F172A;
        }

        .page-subtitle {
          margin: 0;
          color: #64748B;
          font-size: 15px;
        }

        /* =========================
          ALERT
        ========================= */

        .alert {
          padding: 12px 16px;
          margin-bottom: 20px;
          border-radius: 8px;
          font-size: 14px;
          border: 1px solid transparent;
        }

        .alert-error {
          background: #FEF2F2;
          color: #991B1B;
          border-color: #FECACA;
        }

        .alert-success {
          background: #F0FDF4;
          color: #166534;
          border-color: #BBF7D0;
        }

        /* =========================
          FILTER
        ========================= */

        .filter-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: end;
          gap: 16px;
          background: #FFFFFF;
          padding: 20px;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 180px;
        }

        .filter-label {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
        }

        .filter-select,
        .filter-input {
          height: 40px;
          padding: 0 12px;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          background: #FFFFFF;
          color: #0F172A;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .filter-select:focus,
        .filter-input:focus {
          outline: none;
          border-color: #16A34A;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.10);
        }

        .btn-reset {
          height: 40px;
          padding: 0 16px;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          background: #FFFFFF;
          color: #475569;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-reset:hover {
          background: #F8FAFC;
          border-color: #94A3B8;
        }

        /* =========================
          LOADING / EMPTY
        ========================= */

        .loading-state,
        .empty-state {
          min-height: 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #64748B;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
        }

        .empty-state p {
          margin: 0;
          font-size: 14px;
        }

        .spinner {
          width: 34px;
          height: 34px;
          border: 3px solid #DCFCE7;
          border-top-color: #16A34A;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 12px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =========================
          TABLE
        ========================= */

        .table-wrapper {
          overflow-x: auto;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
        }

        .table-proka {
          width: 100%;
          min-width: 950px;
          border-collapse: collapse;
          font-size: 14px;
        }

        .table-proka thead {
          background: #F8FAFC;
        }

        .table-proka th {
          padding: 13px 16px;
          text-align: left;
          color: #475569;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
          border-bottom: 1px solid #E2E8F0;
          white-space: nowrap;
        }

        .table-proka td {
          padding: 14px 16px;
          color: #334155;
          border-bottom: 1px solid #F1F5F9;
          vertical-align: middle;
          white-space: nowrap;
        }

        .table-proka tbody tr:last-child td {
          border-bottom: none;
        }

        .table-proka tbody tr:hover {
          background: #F8FAFC;
        }

        /* =========================
          STATUS
        ========================= */

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 9px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          line-height: 1;
        }

        .status-pending {
          background: #FEF3C7;
          color: #92400E;
        }

        .status-confirmed {
          background: #DCFCE7;
          color: #166534;
        }

        .status-completed {
          background: #F0FDF4;
          color: #15803D;
        }

        .status-canceled {
          background: #FEE2E2;
          color: #991B1B;
        }

        /* =========================
          ACTIONS
        ========================= */

        .table-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-confirm,
        .btn-cancel,
        .btn-complete {
          height: 34px;
          padding: 0 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn-confirm {
          background: #16A34A;
          color: #FFFFFF;
          border: 1px solid #16A34A;
        }

        .btn-confirm:hover {
          background: #15803D;
          border-color: #15803D;
        }

        .btn-cancel {
          background: #FFFFFF;
          color: #B91C1C;
          border: 1px solid #FCA5A5;
        }

        .btn-cancel:hover {
          background: #FEF2F2;
        }

        .btn-complete {
          background: #15803D;
          color: #FFFFFF;
          border: 1px solid #15803D;
        }

        .btn-complete:hover {
          background: #166534;
          border-color: #166534;
        }

        /* =========================
          MODAL
        ========================= */

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(15, 23, 42, 0.45);
        }

        .modal-content {
          width: 100%;
          max-width: 420px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
          animation: modalIn 0.2s ease;
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #E2E8F0;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 17px;
          font-weight: 600;
          color: #0F172A;
        }

        .modal-close {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: #64748B;
          font-size: 18px;
          cursor: pointer;
        }

        .modal-close:hover {
          background: #F1F5F9;
          color: #0F172A;
        }

        .modal-body {
          padding: 20px;
        }

        .modal-sub {
          margin: 0;
          color: #475569;
          font-size: 14px;
          line-height: 1.6;
        }

        .modal-sub strong {
          color: #16A34A;
          font-weight: 600;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 24px;
        }

        .modal-actions button {
          flex: 1;
          height: 40px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-cancel-modal {
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          color: #475569;
        }

        .btn-cancel-modal:hover {
          background: #F8FAFC;
        }

        .btn-confirm-modal {
          border: 1px solid #16A34A;
          background: #16A34A;
          color: #FFFFFF;
        }

        .btn-confirm-modal:hover {
          background: #15803D;
        }

        /* =========================
          PAGINATION
        ========================= */

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-top: 24px;
        }

        .page-btn {
          height: 36px;
          padding: 0 14px;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          background: #FFFFFF;
          color: #475569;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
        }

        .page-btn:hover:not(:disabled) {
          border-color: #16A34A;
          color: #15803D;
          background: #F0FDF4;
        }

        .page-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .page-info {
          color: #64748B;
          font-size: 13px;
          font-weight: 500;
        }

        /* =========================
          RESPONSIVE
        ========================= */

        @media (max-width: 768px) {
          .manage-bookings-page {
            padding: 24px 16px 40px;
          }

          .page-title {
            font-size: 24px;
          }

          .filter-bar {
            align-items: stretch;
            flex-direction: column;
            gap: 14px;
            padding: 16px;
          }

          .filter-group {
            min-width: 0;
          }

          .filter-select,
          .filter-input,
          .btn-reset {
            width: 100%;
          }

          .table-wrapper {
            border-radius: 10px;
          }

          .table-proka {
            min-width: 900px;
          }
        }

        @media (max-width: 480px) {
          .manage-bookings-page {
            padding: 20px 12px 32px;
          }

          .page-title {
            font-size: 22px;
          }

          .page-subtitle {
            font-size: 14px;
          }

          .pagination {
            gap: 8px;
          }

          .page-btn {
            padding: 0 10px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
