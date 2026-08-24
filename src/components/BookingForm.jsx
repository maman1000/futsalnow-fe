import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAvailableSlots, createBooking } from "../api/bookingApi";
import { useToast } from "../context/ToastContext";
import {
  CalendarIcon,
  ClockIcon,
  PencilSquareIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const toLocalDate = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DURATION_OPTIONS = [1, 2, 3, 4];

export default function BookingForm({ service }) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [date, setDate] = useState(() => {
    const besok = new Date();
    besok.setDate(besok.getDate() + 1);
    return toLocalDate(besok);
  });
  const [schedules, setSchedules] = useState([]);
  const [selectedStartIndex, setSelectedStartIndex] = useState(null);
  const [duration, setDuration] = useState(1);
  const [notes, setNotes] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchSchedules = useCallback(async () => {
    setLoadingSlots(true);
    setSelectedStartIndex(null);
    try {
      const res = await getAvailableSlots(service.id, date);
      setSchedules(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal memuat slot.";
      showToast(msg, "error");
      setSchedules([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [service.id, date, showToast]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const getTotalPrice = () => {
    if (selectedStartIndex === null) return 0;
    const startIdx = Number(selectedStartIndex);
    const endIdx = startIdx + duration - 1;
    if (endIdx >= schedules.length) return 0;
    const startSlot = schedules[startIdx];
    const endSlot = schedules[endIdx];
    const start = new Date(`2000-01-01T${startSlot.start}`);
    const end = new Date(`2000-01-01T${endSlot.end}`);
    const hours = (end - start) / (1000 * 60 * 60);
    return hours * service.price_per_hour;
  };

  const getEndTime = () => {
    if (selectedStartIndex === null) return null;
    const startIdx = Number(selectedStartIndex);
    const endIdx = startIdx + duration - 1;
    if (endIdx >= schedules.length) return null;
    return schedules[endIdx].end;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedStartIndex === null) {
      showToast("Pilih jam mulai dulu, ya!", "warning");
      return;
    }
    const startIdx = Number(selectedStartIndex);
    const endIdx = startIdx + duration - 1;
    if (endIdx >= schedules.length) {
      showToast(
        "Durasi melewati jam operasional. Pilih durasi yang lebih pendek.",
        "error",
      );
      return;
    }
    for (let i = startIdx; i <= endIdx; i++) {
      if (!schedules[i].available) {
        showToast(
          `Slot ${schedules[i].start}–${schedules[i].end} sudah penuh.`,
          "error",
        );
        return;
      }
    }
    const startSlot = schedules[startIdx];
    const endSlot = schedules[endIdx];
    setSubmitting(true);
    try {
      await createBooking({
        service_id: service.id,
        booking_date: date,
        start_time: startSlot.start,
        end_time: endSlot.end,
        notes: notes || null,
      });
      showToast("Yeay! Booking berhasil 🎉", "success");
      navigate("/my-bookings");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Gagal membuat booking.";
      showToast(errorMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const totalPrice = getTotalPrice();
  const endTime = getEndTime();
  const formattedDate = date
    ? new Date(date + "T00:00:00").toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1 className="booking-title">Pesan Lapangan — {service.name}</h1>
        <p className="booking-sub">Isi data di bawah, yuk!</p>
      </div>

      <div className="booking-container">
        {/* FORM */}
        <form className="booking-form" onSubmit={handleSubmit}>
          {/* Tanggal */}
          <div className="field-group">
            <label className="field-label">
              <CalendarIcon className="field-icon" />
              Tanggal Main
            </label>
            <input
              type="date"
              className="field-input"
              value={date}
              min={toLocalDate(new Date())}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Jam Mulai */}
          <div className="field-group">
            <label className="field-label">
              <ClockIcon className="field-icon" />
              Jam Mulai
            </label>
            {loadingSlots ? (
              <div className="slot-loading">
                <span className="spinner-sm"></span> Menarik jadwal...
              </div>
            ) : schedules.length === 0 ? (
              <p className="slot-empty">Wah, tanggal ini kosong nih 😅</p>
            ) : (
              <div className="slot-grid">
                {schedules.map((slot, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`slot-btn ${
                      !slot.available ? "slot-unavailable" : ""
                    } ${selectedStartIndex === index ? "slot-selected" : ""}`}
                    disabled={!slot.available}
                    onClick={() => setSelectedStartIndex(index)}
                  >
                    {slot.start} – {slot.end}
                    {!slot.available && (
                      <span className="slot-full-tag">penuh</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Durasi */}
          <div className="field-group">
            <label className="field-label">
              <ClockIcon className="field-icon" />
              Lama Main
            </label>
            <div className="duration-chips">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`chip ${duration === d ? "chip-active" : ""}`}
                  onClick={() => setDuration(d)}
                  disabled={loadingSlots || schedules.length === 0}
                >
                  {d} jam
                </button>
              ))}
            </div>
          </div>

          {/* Catatan */}
          <div className="field-group">
            <label className="field-label">
              <PencilSquareIcon className="field-icon" />
              Catatan (opsional)
            </label>
            <textarea
              className="field-textarea"
              rows="2"
              maxLength="255"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: minta lapangan dekat kipas angin"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner-sm"></span> Memproses...
              </>
            ) : (
              <>
                <CheckCircleIcon className="btn-icon" />
                Pesan Sekarang
              </>
            )}
          </button>
        </form>

        {/* RINGKASAN */}
        <div className="summary-card">
          <h3 className="summary-title">
            <DocumentTextIcon className="summary-title-icon" />
            Ringkasan Pesanan
          </h3>
          <div className="summary-item">
            <span className="summary-label">Layanan</span>
            <span className="summary-value">{service.name}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Tanggal</span>
            <span className="summary-value">{formattedDate}</span>
          </div>
          {selectedStartIndex !== null && schedules[selectedStartIndex] && (
            <>
              <div className="summary-item">
                <span className="summary-label">Jam Mulai</span>
                <span className="summary-value">
                  {schedules[selectedStartIndex].start}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Jam Selesai</span>
                <span className="summary-value">{endTime || "-"}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Durasi</span>
                <span className="summary-value">{duration} jam</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Harga / jam</span>
                <span className="summary-value">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(service.price_per_hour)}
                </span>
              </div>
              <div className="summary-item total">
                <span className="summary-label">Total</span>
                <span className="summary-price">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(totalPrice)}
                </span>
              </div>
            </>
          )}
          {selectedStartIndex === null && (
            <div className="summary-placeholder">
              <ClockIcon className="placeholder-icon" />
              <span>Pilih jam mulai dulu, ya!</span>
            </div>
          )}
        </div>
      </div>

      {/* ===== CSS ===== */}
      <style>{`
        .booking-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 1.5rem 1rem;
        }

        .booking-header {
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .booking-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.1rem;
        }
        .booking-sub {
          color: #6b7280;
          font-size: 0.95rem;
        }

        .booking-container {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 1.5rem;
        }

        /* ===== FORM ===== */
        .booking-form {
          background: white;
          padding: 1.5rem;
          border-radius: 20px;
          border: 1px solid #eef2ff;
          box-shadow: 0 4px 16px rgba(79, 70, 229, 0.06);
        }

        .field-group {
          margin-bottom: 1.25rem;
        }
        .field-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-weight: 600;
          color: #1f2937;
          font-size: 0.9rem;
          margin-bottom: 0.3rem;
        }
        .field-icon {
          width: 1.1rem;
          height: 1.1rem;
          color: #4f46e5;
        }
        .field-input {
          width: 100%;
          padding: 0.6rem 0.8rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-size: 0.95rem;
          background: #fafafa;
          transition: 0.2s;
        }
        .field-input:focus {
          outline: none;
          border-color: #4f46e5;
          background: white;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
        }

        .slot-loading {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.9rem;
          padding: 0.3rem 0;
        }
        .spinner-sm {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid #eef2ff;
          border-top: 2px solid #4f46e5;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .slot-empty {
          color: #6b7280;
          font-size: 0.9rem;
          padding: 0.3rem 0;
        }

        .slot-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 0.5rem;
        }
        .slot-btn {
          padding: 0.4rem 0.2rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          background: white;
          font-size: 0.75rem;
          font-weight: 500;
          color: #1f2937;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          min-height: 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .slot-btn:hover:not(:disabled) {
          border-color: #a5b4fc;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(79, 70, 229, 0.1);
        }
        .slot-btn:disabled {
          cursor: not-allowed;
          background: #f9fafb;
          border-color: #e5e7eb;
          color: #9ca3af;
          text-decoration: line-through;
        }
        .slot-btn.slot-selected {
          border-color: #4f46e5;
          background: #eef2ff;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
        }
        .slot-btn.slot-unavailable {
          background: #f9fafb;
          border-color: #e5e7eb;
          color: #9ca3af;
          text-decoration: line-through;
          cursor: not-allowed;
        }
        .slot-full-tag {
          font-size: 0.5rem;
          font-weight: 600;
          color: #ef4444;
          background: #fee2e2;
          padding: 0.05rem 0.3rem;
          border-radius: 30px;
          margin-top: 0.1rem;
        }

        .duration-chips {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .chip {
          padding: 0.3rem 1rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 30px;
          background: white;
          font-size: 0.8rem;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }
        .chip:hover:not(:disabled) {
          border-color: #a5b4fc;
          background: #f8faff;
        }
        .chip-active {
          border-color: #4f46e5;
          background: #eef2ff;
          color: #4f46e5;
        }
        .chip:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .field-textarea {
          width: 100%;
          padding: 0.6rem 0.8rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-size: 0.95rem;
          background: #fafafa;
          transition: 0.2s;
          resize: vertical;
          font-family: inherit;
        }
        .field-textarea:focus {
          outline: none;
          border-color: #4f46e5;
          background: white;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
        }

        .submit-btn {
          width: 100%;
          padding: 0.7rem;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .submit-btn:hover:not(:disabled) {
          background: #4338ca;
          transform: scale(1.02);
          box-shadow: 0 8px 24px rgba(79, 70, 229, 0.3);
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .btn-icon {
          width: 1.2rem;
          height: 1.2rem;
        }

        /* ===== RINGKASAN ===== */
        .summary-card {
          background: linear-gradient(145deg, #ffffff, #f8faff);
          padding: 1.5rem;
          border-radius: 20px;
          border: 1px solid #eef2ff;
          box-shadow: 0 4px 16px rgba(79, 70, 229, 0.06);
          align-self: start;
          position: sticky;
          top: 100px;
        }
        .summary-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
          border-bottom: 1px solid #eef2ff;
          padding-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .summary-title-icon {
          width: 1.2rem;
          height: 1.2rem;
          color: #4f46e5;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 0.4rem 0;
          border-bottom: 1px solid #f9fafb;
          font-size: 0.9rem;
        }
        .summary-item.total {
          border-top: 1px solid #e5e7eb;
          margin-top: 0.3rem;
          padding-top: 0.6rem;
          border-bottom: none;
        }
        .summary-label {
          color: #6b7280;
        }
        .summary-value {
          font-weight: 500;
          color: #1f2937;
        }
        .summary-price {
          font-weight: 700;
          color: #4f46e5;
          font-size: 1.1rem;
        }
        .summary-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          color: #9ca3af;
          font-size: 0.85rem;
          padding: 1rem 0;
        }
        .placeholder-icon {
          width: 1.5rem;
          height: 1.5rem;
          color: #c7d2fe;
        }

        @media (max-width: 820px) {
          .booking-container {
            grid-template-columns: 1fr;
          }
          .summary-card {
            position: static;
          }
        }
        @media (max-width: 480px) {
          .slot-grid {
            grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
          }
          .slot-btn {
            font-size: 0.65rem;
            min-height: 40px;
            padding: 0.2rem 0.1rem;
          }
          .booking-title {
            font-size: 1.3rem;
          }
          .booking-form {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
