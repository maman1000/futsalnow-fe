import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAvailableSlots, createBooking } from "../api/bookingApi";

const toLocalDate = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function BookingForm({ service }) {
  const navigate = useNavigate();
  const [date, setDate] = useState(() => {
    const besok = new Date();
    besok.setDate(besok.getDate() + 1);
    return toLocalDate(besok);
  });
  const [schedules, setSchedules] = useState([]);
  const [selected, setSelected] = useState("");
  const [notes, setNotes] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchSchedules = useCallback(async () => {
    setLoadingSlots(true);
    setSelected("");
    setError("");
    try {
      const res = await getAvailableSlots(service.id, date);
      console.log("AVAILABLE SLOTS:", res.data);
      setSchedules(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat slot.");
      setSchedules([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [service.id, date]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selected) {
      setError("Silakan pilih slot jadwal terlebih dahulu.");
      return;
    }

    const index = Number(selected);
    const selectedSlot = schedules[index];
    if (!selectedSlot) {
      setError("Slot jadwal tidak valid.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        service_id: service.id,
        booking_date: date,
        start_time: selectedSlot.start,
        end_time: selectedSlot.end,
        notes: notes || null,
      };
      console.log("PAYLOAD:", payload);
      await createBooking(payload);
      navigate("/my-bookings");
    } catch (err) {
      console.error("ERROR RESPONSE:", err.response?.data);
      const errorMsg = err.response?.data?.message || "Gagal membuat booking.";
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-form-wrapper">
      <div className="booking-form-header">
        <h2 className="booking-form-title">📋 Booking — {service.name}</h2>
        <p className="booking-form-subtitle">
          Pilih tanggal dan jam yang kamu inginkan.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      <form className="booking-form" onSubmit={handleSubmit}>
        {/* Tanggal */}
        <div className="form-group">
          <label className="form-label">📅 Tanggal</label>
          <input
            type="date"
            className="form-input"
            value={date}
            min={toLocalDate(new Date())}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Slot Jadwal */}
        <div className="form-group">
          <label className="form-label">⏰ Pilih Slot Jadwal</label>
          {loadingSlots ? (
            <div className="slot-loading">
              <span className="spinner-sm"></span>
              <span>Memuat slot...</span>
            </div>
          ) : schedules.length === 0 ? (
            <p className="slot-empty">Tidak ada jadwal pada tanggal ini.</p>
          ) : (
            <div className="slot-grid">
              {schedules.map((slot, index) => (
                <label
                  key={index}
                  className={`slot-item ${!slot.available ? "slot-disabled" : ""} ${
                    String(index) === selected ? "slot-active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="schedule"
                    value={index}
                    disabled={!slot.available}
                    checked={String(index) === selected}
                    onChange={() => setSelected(String(index))}
                  />
                  <span className="slot-time">
                    {slot.start} – {slot.end}
                  </span>
                  {!slot.available && <span className="slot-badge">Penuh</span>}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Catatan */}
        <div className="form-group">
          <label className="form-label">📝 Catatan (opsional)</label>
          <textarea
            className="form-input"
            rows="3"
            maxLength="255"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ada permintaan khusus? tulis di sini ya..."
          />
        </div>

        {/* Tombol Submit */}
        <button type="submit" className="btn-submit" disabled={submitting}>
          {submitting ? (
            <>
              <span className="spinner-sm"></span>
              Memproses...
            </>
          ) : (
            "Buat Booking →"
          )}
        </button>
      </form>

      {/* CSS inline (bisa dipindahkan ke file terpisah) */}
      <style>{`
        .booking-form-wrapper {
          max-width: 720px;
          margin: 0 auto;
          padding: 1.5rem 1rem;
        }

        .booking-form-header {
          margin-bottom: 2rem;
        }

        .booking-form-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .booking-form-subtitle {
          color: #6b7280;
          font-size: 1rem;
        }

        .booking-form {
          background: white;
          padding: 2rem 1.75rem;
          border-radius: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid #f3f0ff;
        }

        .form-group {
          margin-bottom: 1.75rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .form-input {
          width: 100%;
          padding: 0.7rem 1rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 14px;
          font-size: 0.95rem;
          transition: 0.2s;
          background: #fafafa;
        }

        .form-input:focus {
          outline: none;
          border-color: #7c3aed;
          background: white;
          box-shadow: 0 0 0 4px rgba(124,58,237,0.08);
        }

        .slot-loading {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #6b7280;
          padding: 0.5rem 0;
        }

        .slot-empty {
          color: #6b7280;
          padding: 0.5rem 0;
        }

        .slot-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 0.75rem;
        }

        .slot-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.6rem 0.4rem;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          min-height: 64px;
          position: relative;
        }

        .slot-item:hover:not(.slot-disabled) {
          border-color: #c4b5fd;
          transform: translateY(-2px);
        }

        .slot-active {
          border-color: #7c3aed !important;
          background: #f5f3ff;
          box-shadow: 0 4px 12px rgba(124,58,237,0.12);
        }

        .slot-disabled {
          background: #f9fafb;
          border-color: #e5e7eb;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .slot-item input[type="radio"] {
          display: none;
        }

        .slot-time {
          font-weight: 500;
          color: #1f2937;
          font-size: 0.9rem;
        }

        .slot-disabled .slot-time {
          color: #9ca3af;
        }

        .slot-badge {
          font-size: 0.65rem;
          font-weight: 600;
          color: #9ca3af;
          background: #f3f4f6;
          padding: 0.15rem 0.6rem;
          border-radius: 20px;
          margin-top: 0.2rem;
        }

        .btn-submit {
          width: 100%;
          padding: 0.8rem 1.5rem;
          background: #7c3aed;
          color: white;
          border: none;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-submit:hover:not(:disabled) {
          background: #6d28d9;
          transform: scale(1.02);
          box-shadow: 0 8px 24px rgba(124,58,237,0.25);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .spinner-sm {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
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
      `}</style>
    </div>
  );
}
