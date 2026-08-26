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
      {/* ===== CSS ===== */}
      <style>{`
  .my-bookings-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    position: relative;
  }

  /* ===== HEADER ===== */

  .my-bookings-header {
    margin-bottom: 1.5rem;
  }

  .my-bookings-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 0.25rem;
  }

  .my-bookings-subtitle {
    color: #64748B;
    font-size: 0.95rem;
    margin: 0;
  }

  /* ===== ALERT ===== */

  .alert {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    border: 1px solid;
  }

  .alert-error {
    background: #FEF2F2;
    border-color: #FECACA;
    color: #991B1B;
  }

  /* ===== LOADING ===== */

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
    color: #64748B;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #E2E8F0;
    border-top-color: #16A34A;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* ===== EMPTY STATE ===== */

  .empty-state {
    text-align: center;
    padding: 3rem 2rem;
    background: #FFFFFF;
    border-radius: 12px;
    border: 1px solid #E2E8F0;
  }

  .empty-icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .empty-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #0F172A;
    margin-bottom: 0.25rem;
  }

  .empty-desc {
    color: #64748B;
    margin-bottom: 1.5rem;
  }

  .btn-primary {
    display: inline-block;
    padding: 0.65rem 1.2rem;
    background: #16A34A;
    color: #FFFFFF;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.2s ease;
  }

  .btn-primary:hover {
    background: #15803D;
  }

  /* ===== FILTER ===== */

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
    padding: 0.4rem 0.85rem;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    background: #FFFFFF;
    font-size: 0.8rem;
    font-weight: 500;
    color: #64748B;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .filter-chip:hover {
    border-color: #16A34A;
    color: #16A34A;
  }

  .filter-chip.active {
    background: #16A34A;
    color: #FFFFFF;
    border-color: #16A34A;
  }

  .filter-count {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.05rem 0.4rem;
    border-radius: 999px;
    font-size: 0.65rem;
    font-weight: 600;
  }

  /* ===== BOOKING LIST ===== */

  .bookings-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  /* ===== BOOKING CARD ===== */

  .booking-card {
    background: #FFFFFF;
    border-radius: 12px;
    padding: 1.1rem 1.25rem;
    border: 1px solid #E2E8F0;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    opacity: 0;
    animation: fadeInUp 0.35s ease forwards;
  }

  .booking-card:hover {
    border-color: #CBD5E1;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
  }

  .booking-active {
    border-color: #86EFAC;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ===== CARD HEADER ===== */

  .booking-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.6rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .booking-service-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .booking-id {
    font-weight: 500;
    color: #64748B;
    font-size: 0.8rem;
  }

  .booking-service-name {
    font-weight: 600;
    color: #0F172A;
    font-size: 0.95rem;
  }

  /* ===== STATUS ===== */

  /*
    Status badge tetap digunakan karena merepresentasikan
    status booking yang nyata dari database.
  */

  .status-badge {
    padding: 0.2rem 0.6rem;
    border-radius: 8px;
    font-size: 0.7rem;
    font-weight: 600;
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
    background: #DCFCE7;
    color: #166534;
  }

  .status-canceled {
    background: #F1F5F9;
    color: #64748B;
  }

  /* ===== CARD BODY ===== */

  .booking-card-body {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem 1rem;
    margin-bottom: 0.7rem;
  }

  .booking-datetime {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    font-size: 0.85rem;
    color: #64748B;
  }

  .booking-time {
    font-weight: 500;
    color: #0F172A;
  }

  .booking-meta {
    display: flex;
    align-items: center;
    gap: 0.6rem 1rem;
    flex-wrap: wrap;
  }

  .booking-total {
    font-weight: 700;
    color: #0F172A;
    font-size: 0.95rem;
  }

  .booking-payment-status {
    font-size: 0.8rem;
  }

  /* ===== PAYMENT STATUS ===== */

  .badge-paid {
    padding: 0.2rem 0.55rem;
    border-radius: 8px;
    background: #DCFCE7;
    color: #166534;
    font-weight: 600;
  }

  .badge-unpaid {
    padding: 0.2rem 0.55rem;
    border-radius: 8px;
    background: #FEF3C7;
    color: #92400E;
    font-weight: 600;
  }

  /* ===== ACTIONS ===== */

  .booking-card-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    border-top: 1px solid #E2E8F0;
    padding-top: 0.7rem;
  }

  .btn-pay {
    padding: 0.45rem 1rem;
    background: #16A34A;
    color: #FFFFFF;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.8rem;
    border: 1px solid #16A34A;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .btn-pay:hover {
    background: #15803D;
  }

  .btn-cancel {
    padding: 0.45rem 1rem;
    background: #FFFFFF;
    color: #64748B;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-cancel:hover {
    border-color: #CBD5E1;
    color: #0F172A;
    background: #F8FAFC;
  }

  .inactive-action {
    font-size: 0.8rem;
    color: #94A3B8;
  }

  /* ===== MODAL ===== */

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    padding: 1rem;
  }

  .modal-content {
    background: #FFFFFF;
    border-radius: 12px;
    max-width: 420px;
    width: 100%;
    border: 1px solid #E2E8F0;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
    overflow: hidden;
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
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #E2E8F0;
  }

  .modal-header h3 {
    font-size: 1.05rem;
    font-weight: 600;
    color: #0F172A;
    margin: 0;
  }

  .modal-close {
    background: transparent;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #64748B;
    padding: 0.2rem 0.4rem;
    border-radius: 8px;
    transition: background 0.2s ease;
  }

  .modal-close:hover {
    background: #F8FAFC;
    color: #0F172A;
  }

  .modal-body {
    padding: 1.25rem;
  }

  .modal-sub {
    color: #64748B;
    font-size: 0.9rem;
    margin-bottom: 1.2rem;
  }

  .modal-desc {
    color: #64748B;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  /* ===== FORM INPUT MODAL ===== */

  .form-group {
    margin-bottom: 1rem;
  }

  .form-label {
    display: block;
    margin-bottom: 0.4rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: #0F172A;
  }

  .form-input {
    width: 100%;
    padding: 0.6rem 0.75rem;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    background: #FFFFFF;
    color: #0F172A;
    font-size: 0.9rem;
  }

  .form-input:focus {
    outline: none;
    border-color: #16A34A;
    box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
  }

  /* ===== MODAL ACTIONS ===== */

  .modal-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .modal-actions button {
    flex: 1;
    padding: 0.6rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .btn-cancel-modal {
    background: #FFFFFF;
    color: #64748B;
    border: 1px solid #E2E8F0;
  }

  .btn-cancel-modal:hover {
    background: #F8FAFC;
    color: #0F172A;
  }

  .btn-confirm-modal {
    background: #16A34A;
    color: #FFFFFF;
    border: 1px solid #16A34A;
  }

  .btn-confirm-modal:hover {
    background: #15803D;
  }

  .btn-danger-modal {
    background: #DC2626;
    color: #FFFFFF;
    border: 1px solid #DC2626;
  }

  .btn-danger-modal:hover {
    background: #B91C1C;
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
    padding: 0.45rem 1rem;
    border-radius: 8px;
    border: 1px solid #E2E8F0;
    background: #FFFFFF;
    color: #64748B;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .page-btn:hover:not(:disabled) {
    border-color: #16A34A;
    color: #16A34A;
    background: #F8FAFC;
  }

  .page-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .page-info {
    font-weight: 500;
    color: #64748B;
    font-size: 0.9rem;
  }

  /* ===== RESPONSIVE ===== */

  @media (max-width: 640px) {
    .my-bookings-page {
      padding: 1.5rem 1rem;
    }

    .my-bookings-title {
      font-size: 1.5rem;
    }

    .booking-card {
      padding: 1rem;
    }

    .booking-card-header {
      align-items: flex-start;
    }

    .booking-card-body {
      flex-direction: column;
      align-items: flex-start;
    }

    .booking-datetime {
      flex-direction: column;
      gap: 0.2rem;
    }

    .booking-meta {
      width: 100%;
      justify-content: space-between;
    }

    .filter-bar {
      gap: 0.35rem;
    }

    .filter-chip {
      padding: 0.35rem 0.7rem;
      font-size: 0.75rem;
    }

    .modal-actions {
      flex-direction: column-reverse;
    }
  }
`}</style>
    </div>
  );
}
