import { useCallback, useEffect, useState } from "react";
import { getMyBookings, cancelBooking, payBooking } from "../../api/bookingApi";

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

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
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
    setInfo("");
    try {
      const res = await getMyBookings({ page: currentPage });
      // res.data bisa langsung array atau pagination object
      const bookingsData = res.data?.data ?? res.data;
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);

      // Jika response berbentuk pagination, ambil info pagination
      if (res.data?.current_page) {
        setPagination({
          current_page: res.data.current_page,
          last_page: res.data.last_page,
          per_page: res.data.per_page,
          total: res.data.total,
        });
      } else {
        // Jika response langsung array, set pagination default (semua di satu halaman)
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

  const handlePay = async (booking) => {
    const method = window.prompt(
      `Pilih metode pembayaran (${METHODS.join("/")}) untuk booking #${booking.id}:`,
      "transfer",
    );
    if (method === null) return;
    const normalized = method.trim().toLowerCase();
    if (!METHODS.includes(normalized)) {
      setError("Metode tidak valid. Pilih: transfer, cash, atau e-wallet.");
      return;
    }
    setError("");
    setInfo("");
    try {
      await payBooking(booking.id, normalized);
      setInfo("Pembayaran berhasil dicatat.");
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Pembayaran gagal.");
    }
  };

  const handleCancel = async (booking) => {
    if (
      !window.confirm(
        `Batalkan booking #${booking.id}? Slot jadwal akan dibuka kembali.`,
      )
    )
      return;
    setError("");
    setInfo("");
    try {
      await cancelBooking(booking.id);
      setInfo("Booking berhasil dibatalkan.");
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membatalkan booking.");
    }
  };

  return (
    <div className="my-bookings-page">
      <div className="my-bookings-header">
        <h1 className="my-bookings-title">📋 Booking Saya</h1>
        <p className="my-bookings-subtitle">
          Lihat riwayat dan status semua booking yang kamu buat.
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {info && <div className="alert alert-success">{info}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Memuat booking...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <p>😕 Kamu belum punya booking.</p>
          <p className="empty-hint">Yuk, booking lapangan sekarang!</p>
        </div>
      ) : (
        <>
          <div className="bookings-list">
            {bookings.map((b) => (
              <div key={b.id} className="booking-card">
                <div className="booking-card-main">
                  <div className="booking-info">
                    <h3 className="booking-service">
                      {b.service?.name || "Lapangan"}
                    </h3>
                    <p className="booking-datetime">
                      <span className="booking-date">
                        {formatTanggal(b.booking_date)}
                      </span>
                      <span className="booking-time">
                        {formatJam(b.start_time)} – {formatJam(b.end_time)}
                      </span>
                    </p>
                  </div>
                  <div className="booking-meta">
                    <span className={`badge badge-${b.status}`}>
                      {b.status}
                    </span>
                    <span className="booking-total">
                      {formatRupiah(b.total_price)}
                    </span>
                    <span className="booking-payment">
                      {b.payment ? (
                        <span className="payment-info">
                          <span className="payment-method">
                            {b.payment.method}
                          </span>
                          <span className="payment-date">
                            ·{" "}
                            {new Date(b.payment.paid_at).toLocaleDateString(
                              "id-ID",
                            )}
                          </span>
                        </span>
                      ) : (
                        <span className="payment-unpaid">Belum dibayar</span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="booking-actions">
                  {b.status === "pending" && !b.payment && (
                    <button
                      className="btn btn-pay"
                      onClick={() => handlePay(b)}
                    >
                      Bayar
                    </button>
                  )}
                  {b.status === "pending" && (
                    <button
                      className="btn btn-cancel"
                      onClick={() => handleCancel(b)}
                    >
                      Batal
                    </button>
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

      {/* CSS inline */}
      <style>{`
        .my-bookings-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .my-bookings-header {
          margin-bottom: 2rem;
        }

        .my-bookings-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .my-bookings-subtitle {
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
          border-top: 4px solid #7c3aed;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 1rem;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 4rem 0;
          color: #6b7280;
        }
        .empty-hint {
          font-size: 0.9rem;
          margin-top: 0.5rem;
          color: #9ca3af;
        }

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
          flex: 1 1 180px;
        }

        .booking-service {
          font-weight: 600;
          color: #1f2937;
          font-size: 1.1rem;
          margin: 0;
        }

        .booking-datetime {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1rem;
          font-size: 0.85rem;
          color: #6b7280;
          margin-top: 0.2rem;
        }

        .booking-time {
          font-weight: 500;
          color: #4b5563;
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
          background: #e5e7eb;
          color: #374151;
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
        .payment-unpaid {
          color: #9ca3af;
          font-weight: 500;
        }
        .payment-method {
          font-weight: 500;
          color: #374151;
        }
        .payment-date {
          color: #9ca3af;
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

        .btn-pay {
          background: #7c3aed;
          color: white;
        }
        .btn-pay:hover {
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
