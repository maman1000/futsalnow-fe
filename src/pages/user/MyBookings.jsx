import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBookings, cancelBooking, payBooking } from "../../api/bookingApi";
import { useToast } from "../../context/ToastContext";

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

const METHODS = ["transfer", "cash", "e-wallet"];

const STATUS_FILTERS = [
  { key: "all", label: "Semua" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "canceled", label: "Canceled" },
];

export default function MyBookings() {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [bookingToPay, setBookingToPay] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

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
      const params = { page: currentPage };
      const res = await getMyBookings(params);
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
      setError(err.response?.data?.message || "Gagal memuat booking.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const goToPage = (page) => {
    if (page < 1 || page > pagination.last_page) return;
    setCurrentPage(page);
  };

  const handleFilterChange = (key) => {
    setActiveStatus(key);
    setCurrentPage(1);
  };

  const handlePay = (booking) => {
    setBookingToPay(booking);
    setPaymentMethod("transfer");
    setShowPaymentModal(true);
  };

  const submitPayment = async () => {
    if (!bookingToPay) return;
    setShowPaymentModal(false);
    try {
      await payBooking(bookingToPay.id, paymentMethod);
      showToast("Pembayaran berhasil dicatat.", "success");
      await fetchBookings();
    } catch (err) {
      showToast(err.response?.data?.message || "Pembayaran gagal.", "error");
    }
    setBookingToPay(null);
  };

  const handleCancel = (booking) => {
    setBookingToCancel(booking);
    setShowConfirmModal(true);
  };

  const submitCancel = async () => {
    if (!bookingToCancel) return;
    setShowConfirmModal(false);
    try {
      await cancelBooking(bookingToCancel.id);
      showToast("Booking berhasil dibatalkan.", "success");
      await fetchBookings();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Gagal membatalkan booking.",
        "error",
      );
    }
    setBookingToCancel(null);
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: { label: "Pending", className: "status-pending" },
      confirmed: { label: "Confirmed", className: "status-confirmed" },
      completed: { label: "Completed", className: "status-completed" },
      canceled: { label: "Canceled", className: "status-canceled" },
    };
    return map[status] || { label: status, className: "" };
  };

  const isActive = (status) => status === "pending" || status === "confirmed";

  const filteredBookings =
    activeStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status === activeStatus);

  const counts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="my-bookings-page page-content">
      <div className="my-bookings-header">
        <h1 className="my-bookings-title">Booking Saya</h1>
        <p className="my-bookings-subtitle">Pantau booking-mu di sini!</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Memuat booking...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">📭</p>
          <p className="empty-title">Belum ada booking</p>
          <p className="empty-desc">Yuk, booking lapangan sekarang!</p>
          <Link to="/services" className="btn-primary">
            Cari Lapangan
          </Link>
        </div>
      ) : (
        <>
          <div className="filter-bar">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.key}
                className={`filter-chip ${activeStatus === filter.key ? "active" : ""}`}
                onClick={() => handleFilterChange(filter.key)}
              >
                {filter.label}
                {counts[filter.key] !== undefined && filter.key !== "all" && (
                  <span className="filter-count">{counts[filter.key]}</span>
                )}
              </button>
            ))}
          </div>

          <div className="bookings-list">
            {filteredBookings.map((b, index) => {
              const status = getStatusBadge(b.status);
              const isPending = b.status === "pending";
              const isPaid = b.payment_status === "paid";
              return (
                <div
                  key={b.id}
                  className={`booking-card ${isActive(b.status) ? "booking-active" : ""}`}
                  style={{ animationDelay: `${index * 0.04}s` }}
                >
                  <div className="booking-card-header">
                    <div className="booking-service-info">
                      <span className="booking-id">#{b.id}</span>
                      <span className="booking-service-name">
                        {b.service?.name || "Lapangan"}
                      </span>
                    </div>
                    <span className={`status-badge ${status.className}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="booking-card-body">
                    <div className="booking-datetime">
                      <span className="booking-date">
                        {formatTanggal(b.booking_date)}
                      </span>
                      <span className="booking-time">
                        {formatJam(b.start_time)} – {formatJam(b.end_time)}
                      </span>
                    </div>
                    <div className="booking-meta">
                      <span className="booking-total">
                        {formatRupiah(b.total_price)}
                      </span>
                      <span className="booking-payment-status">
                        {isPaid ? (
                          <span className="badge-paid">Lunas</span>
                        ) : (
                          <span className="badge-unpaid">Belum Dibayar</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="booking-card-actions">
                    {isPending && !isPaid && (
                      <button className="btn-pay" onClick={() => handlePay(b)}>
                        Bayar
                      </button>
                    )}
                    {isPending && (
                      <button
                        className="btn-cancel"
                        onClick={() => handleCancel(b)}
                      >
                        Batal
                      </button>
                    )}
                    {!isPending && !isPaid && (
                      <span className="inactive-action">
                        Tidak ada yang bisa dilakukan
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {showPaymentModal && (
            <div
              className="modal-overlay"
              onClick={() => setShowPaymentModal(false)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>Pilih Metode Pembayaran</h3>
                  <button
                    className="modal-close"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="modal-body">
                  <p className="modal-sub">
                    Booking #{bookingToPay?.id} · {bookingToPay?.service?.name}
                  </p>
                  <div className="form-group">
                    <label className="form-label">Metode</label>
                    <select
                      className="form-input"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      {METHODS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="modal-actions">
                    <button
                      className="btn-cancel-modal"
                      onClick={() => setShowPaymentModal(false)}
                    >
                      Batal
                    </button>
                    <button
                      className="btn-confirm-modal"
                      onClick={submitPayment}
                    >
                      Bayar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showConfirmModal && (
            <div
              className="modal-overlay"
              onClick={() => setShowConfirmModal(false)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>Konfirmasi Pembatalan</h3>
                  <button
                    className="modal-close"
                    onClick={() => setShowConfirmModal(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="modal-body">
                  <p className="modal-sub">
                    Batalkan booking #{bookingToCancel?.id}?
                  </p>
                  <p className="modal-desc">
                    Slot jadwal akan dibuka kembali untuk pengguna lain.
                  </p>
                  <div className="modal-actions">
                    <button
                      className="btn-cancel-modal"
                      onClick={() => setShowConfirmModal(false)}
                    >
                      Kembali
                    </button>
                    <button className="btn-danger-modal" onClick={submitCancel}>
                      Ya, Batalkan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
        .my-bookings-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          position: relative;
        }

        .my-bookings-header {
          margin-bottom: 1.5rem;
        }
        .my-bookings-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.1rem;
        }
        .my-bookings-subtitle {
          color: #6b7280;
          font-size: 0.95rem;
        }

        .alert {
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          border-left: 4px solid;
        }
        .alert-error {
          background: #fee2e2;
          border-color: #dc2626;
          color: #991b1b;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
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

        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          background: white;
          border-radius: 24px;
          border: 1px solid #f3f0ff;
        }
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }
        .empty-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }
        .empty-desc {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }
        .btn-primary {
          display: inline-block;
          padding: 0.6rem 1.5rem;
          background: #1e293b;
          color: white;
          border-radius: 30px;
          font-weight: 600;
          text-decoration: none;
          transition: 0.25s;
        }
        .btn-primary:hover {
          background: #0f172a;
          transform: translateY(-2px);
        }

        .filter-bar {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1.2rem;
        }
        .filter-chip {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.3rem 1rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 30px;
          background: white;
          font-size: 0.8rem;
          font-weight: 500;
          color: #4b5563;
          cursor: pointer;
          transition: 0.2s;
        }
        .filter-chip:hover {
          border-color: #1e293b;
        }
        .filter-chip.active {
          background: #1e293b;
          color: white;
          border-color: #1e293b;
        }
        .filter-count {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.05rem 0.4rem;
          border-radius: 30px;
          font-size: 0.65rem;
          font-weight: 600;
        }

        .bookings-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .booking-card {
          background: white;
          border-radius: 16px;
          padding: 1.1rem 1.25rem;
          box-shadow: 0 4px 16px rgba(30, 41, 59, 0.04);
          border: 1px solid #f3f0ff;
          transition: all 0.25s ease;
          opacity: 0;
          animation: fadeInUp 0.4s ease forwards;
        }
        .booking-card:hover {
          box-shadow: 0 8px 30px rgba(30, 41, 59, 0.06);
          border-color: #d4c4ff;
        }
        .booking-active {
          border-color: #1e293b;
          box-shadow: 0 4px 20px rgba(30, 41, 59, 0.06);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .booking-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.4rem;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .booking-service-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .booking-id {
          font-weight: 600;
          color: #6b7280;
          font-size: 0.8rem;
        }
        .booking-service-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.95rem;
        }

        .status-badge {
          padding: 0.15rem 0.7rem;
          border-radius: 30px;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }
        .status-confirmed {
          background: #dbeafe;
          color: #1e40af;
        }
        .status-completed {
          background: #d1fae5;
          color: #065f46;
        }
        .status-canceled {
          background: #fee2e2;
          color: #991b1b;
        }

        .booking-card-body {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 0.4rem 0.8rem;
          margin-bottom: 0.6rem;
        }
        .booking-datetime {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem 0.8rem;
          font-size: 0.85rem;
          color: #6b7280;
        }
        .booking-time {
          font-weight: 500;
          color: #4b5563;
        }
        .booking-meta {
          display: flex;
          align-items: center;
          gap: 0.6rem 1rem;
          flex-wrap: wrap;
        }
        .booking-total {
          font-weight: 700;
          color: #1f2937;
          font-size: 0.95rem;
        }
        .booking-payment-status {
          font-size: 0.8rem;
        }
        .badge-paid {
          padding: 0.1rem 0.5rem;
          border-radius: 30px;
          background: #d1fae5;
          color: #065f46;
          font-weight: 600;
        }
        .badge-unpaid {
          padding: 0.1rem 0.5rem;
          border-radius: 30px;
          background: #fef3c7;
          color: #92400e;
          font-weight: 600;
        }

        .booking-card-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          border-top: 1px solid #f3f4f6;
          padding-top: 0.6rem;
        }
        .btn-pay {
          padding: 0.25rem 1rem;
          background: #1e293b;
          color: white;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.8rem;
          border: none;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-pay:hover {
          background: #0f172a;
          transform: scale(1.03);
        }
        .btn-cancel {
          padding: 0.25rem 1rem;
          background: #fee2e2;
          color: #991b1b;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.8rem;
          border: none;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-cancel:hover {
          background: #fecaca;
          transform: scale(1.03);
        }
        .inactive-action {
          font-size: 0.8rem;
          color: #9ca3af;
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
        .btn-danger-modal {
          background: #ef4444;
          color: white;
        }
        .btn-danger-modal:hover {
          background: #dc2626;
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
          .booking-card {
            padding: 0.9rem 1rem;
          }
          .booking-card-header {
            flex-direction: column;
            align-items: stretch;
          }
          .booking-card-body {
            flex-direction: column;
            align-items: stretch;
          }
          .booking-datetime {
            flex-direction: column;
            gap: 0.2rem;
          }
          .filter-bar {
            gap: 0.3rem;
          }
          .filter-chip {
            padding: 0.2rem 0.7rem;
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}
