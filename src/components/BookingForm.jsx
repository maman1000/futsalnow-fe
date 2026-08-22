// import { useCallback, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAvailableSlots, createBooking } from "../api/bookingApi";

// const toLocalDate = (d) => {
//   const year = d.getFullYear();
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };

// const DURATION_OPTIONS = [1, 2, 3, 4]; // maksimal 4 jam (bisa disesuaikan)

// export default function BookingForm({ service }) {
//   const navigate = useNavigate();
//   const [date, setDate] = useState(() => {
//     const besok = new Date();
//     besok.setDate(besok.getDate() + 1);
//     return toLocalDate(besok);
//   });
//   const [schedules, setSchedules] = useState([]);
//   const [selectedStartIndex, setSelectedStartIndex] = useState(""); // index slot mulai
//   const [duration, setDuration] = useState(1); // durasi dalam jam
//   const [notes, setNotes] = useState("");
//   const [loadingSlots, setLoadingSlots] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   const fetchSchedules = useCallback(async () => {
//     setLoadingSlots(true);
//     setSelectedStartIndex("");
//     setError("");
//     try {
//       const res = await getAvailableSlots(service.id, date);
//       console.log("AVAILABLE SLOTS:", res.data);
//       setSchedules(res.data);
//     } catch (err) {
//       setError(err.response?.data?.message || "Gagal memuat slot.");
//       setSchedules([]);
//     } finally {
//       setLoadingSlots(false);
//     }
//   }, [service.id, date]);

//   useEffect(() => {
//     fetchSchedules();
//   }, [fetchSchedules]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (selectedStartIndex === "") {
//       setError("Silakan pilih jam mulai.");
//       return;
//     }

//     const startIdx = Number(selectedStartIndex);
//     const endIdx = startIdx + duration - 1;

//     // Cek apakah durasi melewati batas slot
//     if (endIdx >= schedules.length) {
//       setError(
//         "Durasi melewati jam operasional. Pilih durasi yang lebih pendek.",
//       );
//       return;
//     }

//     // Cek apakah semua slot dalam rentang tersedia
//     for (let i = startIdx; i <= endIdx; i++) {
//       if (!schedules[i].available) {
//         setError(
//           `Slot ${schedules[i].start}–${schedules[i].end} tidak tersedia.`,
//         );
//         return;
//       }
//     }

//     const startSlot = schedules[startIdx];
//     const endSlot = schedules[endIdx];

//     setSubmitting(true);
//     try {
//       const payload = {
//         service_id: service.id,
//         booking_date: date,
//         start_time: startSlot.start,
//         end_time: endSlot.end,
//         notes: notes || null,
//       };
//       console.log("PAYLOAD:", payload);
//       await createBooking(payload);
//       navigate("/my-bookings");
//     } catch (err) {
//       console.error("ERROR RESPONSE:", err.response?.data);
//       const errorMsg = err.response?.data?.message || "Gagal membuat booking.";
//       setError(errorMsg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="booking-form-wrapper">
//       <div className="booking-form-header">
//         <h2 className="booking-form-title">📋 Booking — {service.name}</h2>
//         <p className="booking-form-subtitle">
//           Pilih tanggal, jam mulai, dan durasi yang kamu inginkan.
//         </p>
//       </div>

//       {error && (
//         <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>
//           {error}
//         </div>
//       )}

//       <form className="booking-form" onSubmit={handleSubmit}>
//         {/* Tanggal */}
//         <div className="form-group">
//           <label className="form-label">📅 Tanggal</label>
//           <input
//             type="date"
//             className="form-input"
//             value={date}
//             min={toLocalDate(new Date())}
//             onChange={(e) => setDate(e.target.value)}
//             required
//           />
//         </div>

//         {/* Jam Mulai */}
//         <div className="form-group">
//           <label className="form-label">⏰ Jam Mulai</label>
//           {loadingSlots ? (
//             <div className="slot-loading">
//               <span className="spinner-sm"></span>
//               <span>Memuat slot...</span>
//             </div>
//           ) : schedules.length === 0 ? (
//             <p className="slot-empty">Tidak ada jadwal pada tanggal ini.</p>
//           ) : (
//             <select
//               className="form-input"
//               value={selectedStartIndex}
//               onChange={(e) => setSelectedStartIndex(e.target.value)}
//               required
//             >
//               <option value="">— Pilih jam mulai —</option>
//               {schedules.map((slot, index) => (
//                 <option key={index} value={index} disabled={!slot.available}>
//                   {slot.start} – {slot.end} {!slot.available && "(penuh)"}
//                 </option>
//               ))}
//             </select>
//           )}
//         </div>

//         {/* Durasi */}
//         <div className="form-group">
//           <label className="form-label">⏱️ Durasi</label>
//           <select
//             className="form-input"
//             value={duration}
//             onChange={(e) => setDuration(Number(e.target.value))}
//             disabled={loadingSlots || schedules.length === 0}
//           >
//             {DURATION_OPTIONS.map((d) => (
//               <option key={d} value={d}>
//                 {d} jam
//               </option>
//             ))}
//           </select>
//           <p className="form-hint">
//             Pilih durasi booking (maksimal{" "}
//             {DURATION_OPTIONS[DURATION_OPTIONS.length - 1]} jam)
//           </p>
//         </div>

//         {/* Catatan */}
//         <div className="form-group">
//           <label className="form-label">📝 Catatan (opsional)</label>
//           <textarea
//             className="form-input"
//             rows="3"
//             maxLength="255"
//             value={notes}
//             onChange={(e) => setNotes(e.target.value)}
//             placeholder="Ada permintaan khusus? tulis di sini ya..."
//           />
//         </div>

//         {/* Tombol Submit */}
//         <button
//           type="submit"
//           className="btn-submit"
//           disabled={submitting || loadingSlots}
//         >
//           {submitting ? (
//             <>
//               <span className="spinner-sm"></span>
//               Memproses...
//             </>
//           ) : (
//             "Buat Booking →"
//           )}
//         </button>
//       </form>

//       {/* CSS (sama seperti sebelumnya, sudah optimal) */}
//       <style>{`
//         .booking-form-wrapper {
//           max-width: 720px;
//           margin: 0 auto;
//           padding: 1.5rem 1rem;
//         }
//         .booking-form-header {
//           margin-bottom: 2rem;
//         }
//         .booking-form-title {
//           font-size: 1.8rem;
//           font-weight: 700;
//           color: #1f2937;
//           margin-bottom: 0.25rem;
//         }
//         .booking-form-subtitle {
//           color: #6b7280;
//           font-size: 1rem;
//         }
//         .booking-form {
//           background: white;
//           padding: 2rem 1.75rem;
//           border-radius: 24px;
//           box-shadow: 0 4px 20px rgba(0,0,0,0.04);
//           border: 1px solid #f3f0ff;
//         }
//         .form-group {
//           margin-bottom: 1.75rem;
//         }
//         .form-label {
//           display: block;
//           font-weight: 600;
//           color: #1f2937;
//           margin-bottom: 0.5rem;
//           font-size: 0.95rem;
//         }
//         .form-input {
//           width: 100%;
//           padding: 0.7rem 1rem;
//           border: 1.5px solid #e5e7eb;
//           border-radius: 14px;
//           font-size: 0.95rem;
//           transition: 0.2s;
//           background: #fafafa;
//         }
//         .form-input:focus {
//           outline: none;
//           border-color: #7c3aed;
//           background: white;
//           box-shadow: 0 0 0 4px rgba(124,58,237,0.08);
//         }
//         .form-hint {
//           font-size: 0.8rem;
//           color: #9ca3af;
//           margin-top: 0.3rem;
//         }
//         .slot-loading {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           color: #6b7280;
//           padding: 0.5rem 0;
//         }
//         .slot-empty {
//           color: #6b7280;
//           padding: 0.5rem 0;
//         }
//         .btn-submit {
//           width: 100%;
//           padding: 0.8rem 1.5rem;
//           background: #7c3aed;
//           color: white;
//           border: none;
//           border-radius: 30px;
//           font-size: 1rem;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 0.5rem;
//         }
//         .btn-submit:hover:not(:disabled) {
//           background: #6d28d9;
//           transform: scale(1.02);
//           box-shadow: 0 8px 24px rgba(124,58,237,0.25);
//         }
//         .btn-submit:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//           transform: none;
//         }
//         .spinner-sm {
//           display: inline-block;
//           width: 18px;
//           height: 18px;
//           border: 2px solid rgba(255,255,255,0.3);
//           border-top-color: white;
//           border-radius: 50%;
//           animation: spin 0.8s linear infinite;
//         }
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//         .alert {
//           padding: 0.75rem 1rem;
//           border-radius: 14px;
//           font-size: 0.9rem;
//           border-left: 4px solid;
//         }
//         .alert-error {
//           background: #fef2f2;
//           border-color: #dc2626;
//           color: #991b1b;
//         }
//       `}</style>
//     </div>
//   );
// }

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAvailableSlots, createBooking } from "../api/bookingApi";
import { useToast } from "../context/ToastContext"; // <-- TAMBAHKAN

const toLocalDate = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DURATION_OPTIONS = [1, 2, 3, 4];

export default function BookingForm({ service }) {
  const navigate = useNavigate();
  const { showToast } = useToast(); // <-- TAMBAHKAN

  const [date, setDate] = useState(() => {
    const besok = new Date();
    besok.setDate(besok.getDate() + 1);
    return toLocalDate(besok);
  });
  const [schedules, setSchedules] = useState([]);
  const [selectedStartIndex, setSelectedStartIndex] = useState("");
  const [duration, setDuration] = useState(1);
  const [notes, setNotes] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // ❌ Hapus state error: const [error, setError] = useState("");

  const fetchSchedules = useCallback(async () => {
    setLoadingSlots(true);
    setSelectedStartIndex("");
    try {
      const res = await getAvailableSlots(service.id, date);
      console.log("AVAILABLE SLOTS:", res.data);
      setSchedules(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal memuat slot.";
      showToast(msg, "error"); // <-- TAMBAHKAN
      setSchedules([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [service.id, date, showToast]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedStartIndex === "") {
      showToast("Silakan pilih jam mulai.", "warning");
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
          `Slot ${schedules[i].start}–${schedules[i].end} tidak tersedia.`,
          "error",
        );
        return;
      }
    }

    const startSlot = schedules[startIdx];
    const endSlot = schedules[endIdx];

    setSubmitting(true);
    try {
      const payload = {
        service_id: service.id,
        booking_date: date,
        start_time: startSlot.start,
        end_time: endSlot.end,
        notes: notes || null,
      };
      console.log("PAYLOAD:", payload);
      await createBooking(payload);
      showToast("Booking berhasil! 🎉", "success");
      navigate("/my-bookings");
    } catch (err) {
      console.error("ERROR RESPONSE:", err.response?.data);
      const errorMsg = err.response?.data?.message || "Gagal membuat booking.";
      showToast(errorMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-form-wrapper">
      <div className="booking-form-header">
        <h2 className="booking-form-title">📋 Booking — {service.name}</h2>
        <p className="booking-form-subtitle">
          Pilih tanggal, jam mulai, dan durasi yang kamu inginkan.
        </p>
      </div>

      {/* ❌ Hapus alert error */}

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

        {/* Jam Mulai */}
        <div className="form-group">
          <label className="form-label">⏰ Jam Mulai</label>
          {loadingSlots ? (
            <div className="slot-loading">
              <span className="spinner-sm"></span>
              <span>Memuat slot...</span>
            </div>
          ) : schedules.length === 0 ? (
            <p className="slot-empty">Tidak ada jadwal pada tanggal ini.</p>
          ) : (
            <select
              className="form-input"
              value={selectedStartIndex}
              onChange={(e) => setSelectedStartIndex(e.target.value)}
              required
            >
              <option value="">— Pilih jam mulai —</option>
              {schedules.map((slot, index) => (
                <option key={index} value={index} disabled={!slot.available}>
                  {slot.start} – {slot.end} {!slot.available && "(penuh)"}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Durasi */}
        <div className="form-group">
          <label className="form-label">⏱️ Durasi</label>
          <select
            className="form-input"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            disabled={loadingSlots || schedules.length === 0}
          >
            {DURATION_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d} jam
              </option>
            ))}
          </select>
          <p className="form-hint">
            Pilih durasi booking (maksimal{" "}
            {DURATION_OPTIONS[DURATION_OPTIONS.length - 1]} jam)
          </p>
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
        <button
          type="submit"
          className="btn-submit"
          disabled={submitting || loadingSlots}
        >
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

      {/* CSS (sama seperti sebelumnya) */}
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
        .form-hint {
          font-size: 0.8rem;
          color: #9ca3af;
          margin-top: 0.3rem;
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
      `}</style>
    </div>
  );
}
