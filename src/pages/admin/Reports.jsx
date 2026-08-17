// import { useCallback, useEffect, useState } from "react";
// import { getReportBookings } from "../../api/bookingApi";

// const formatRupiah = (n) =>
//   new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//     minimumFractionDigits: 0,
//   }).format(n ?? 0);
// // const formatTanggal = (d) =>
// const formatTanggal = (d) => {
//   if (!d) return "-";

//   const date = new Date(d);

//   if (Number.isNaN(date.getTime())) return "-";

//   return date.toLocaleDateString("id-ID", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });
// };

// const formatJam = (t) => (t || "").slice(0, 5);

// export default function Reports() {
//   const [bookings, setBookings] = useState([]);
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchReport = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const params = {};
//       if (from) params.from = from;
//       if (to) params.to = to;
//       const res = await getReportBookings(params);
//       console.log("REPORT RESPONSE:", res.data);

//       setBookings(res.data);
//     } catch (err) {
//       setError(err.response?.data?.message || "Gagal memuat laporan.");
//     } finally {
//       setLoading(false);
//     }
//   }, [from, to]);

//   useEffect(() => {
//     fetchReport();
//   }, [fetchReport]);

//   // Total pendapatan hanya dari booking yang sudah punya payment
//   // const totalPendapatan = bookings
//   //   .filter((b) => b.payment)
//   //   .reduce((sum, b) => sum + (b.total_price || 0), 0);

//   const totalPendapatan = bookings
//     .filter((b) => b.payment_status === "paid")
//     .reduce((sum, b) => sum + Number(b.total_price || 0), 0);

//   return (
//     <div className="container">
//       <div className="page-header">
//         <h2>Laporan Booking</h2>
//         <p className="muted">Filter berdasarkan rentang tanggal booking.</p>
//       </div>

//       {error && <div className="alert alert-error">{error}</div>}

//       <div className="filter-bar">
//         <label className="form-label">Dari</label>
//         <input
//           type="date"
//           className="form-input filter-select"
//           value={from}
//           onChange={(e) => setFrom(e.target.value)}
//         />
//         <label className="form-label">Sampai</label>
//         <input
//           type="date"
//           className="form-input filter-select"
//           value={to}
//           onChange={(e) => setTo(e.target.value)}
//         />
//         {(from || to) && (
//           <button
//             className="btn btn-outline btn-sm"
//             onClick={() => {
//               setFrom("");
//               setTo("");
//             }}
//           >
//             Reset
//           </button>
//         )}
//       </div>

//       <div className="grid grid-2">
//         <div className="card stat-card">
//           <span className="stat-label">Jumlah Booking (terfilter)</span>
//           <span className="stat-value">{bookings.length}</span>
//         </div>
//         <div className="card stat-card">
//           <span className="stat-label">Total Pendapatan (sudah dibayar)</span>
//           <span className="stat-value stat-revenue">
//             {formatRupiah(totalPendapatan)}
//           </span>
//         </div>
//       </div>

//       {loading ? (
//         <p className="page-loading">Memuat laporan...</p>
//       ) : bookings.length === 0 ? (
//         <p className="muted">Tidak ada data pada rentang tanggal ini.</p>
//       ) : (
//         <div className="table-wrapper">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Pelanggan</th>
//                 <th>Layanan</th>
//                 <th>Tanggal Booking</th>
//                 <th>Jam</th>
//                 <th>Status</th>
//                 <th>Total</th>
//                 <th>Pembayaran</th>
//               </tr>
//             </thead>
//             <tbody>
//               {bookings.map((b) => (
//                 <tr key={b.id}>
//                   <td>{b.id}</td>
//                   <td>{b.user?.name || "-"}</td>
//                   <td>{b.service?.name || "-"}</td>
//                   <td>{formatTanggal(b.booking_date)}</td>
//                   <td>
//                     {formatJam(b.start_time)}–{formatJam(b.end_time)}
//                   </td>
//                   <td>
//                     <span className={`badge badge-${b.status}`}>
//                       {b.status}
//                     </span>
//                   </td>
//                   <td>{formatRupiah(b.total_price)}</td>
//                   {/* <td>
//                     {b.payment
//                       ? `${b.payment.method} · ${new Date(b.payment.paid_at).toLocaleDateString("id-ID")}`
//                       : "—"}
//                   </td> */}
//                   <td>
//                     {b.payment_status === "paid" ? (
//                       <span className="badge badge-success">Lunas</span>
//                     ) : (
//                       <span className="badge badge-warning">Belum Dibayar</span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

import { useCallback, useEffect, useState } from "react";
import { getReportBookings } from "../../api/bookingApi";

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

export default function Reports() {
  const [bookings, setBookings] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;
      const res = await getReportBookings(params);
      console.log("REPORT RESPONSE:", res.data);
      setBookings(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat laporan.");
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const totalPendapatan = bookings
    .filter((b) => b.payment_status === "paid")
    .reduce((sum, b) => sum + Number(b.total_price || 0), 0);

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1 className="page-title">📊 Laporan Booking</h1>
        <p className="page-subtitle">
          Filter berdasarkan rentang tanggal untuk melihat ringkasan.
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Filter */}
      <div className="filter-bar">
        <div className="filter-group">
          <label className="filter-label">📅 Dari</label>
          <input
            type="date"
            className="filter-input"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label className="filter-label">📅 Sampai</label>
          <input
            type="date"
            className="filter-input"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        {(from || to) && (
          <button
            className="btn-reset"
            onClick={() => {
              setFrom("");
              setTo("");
            }}
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Statistik */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue-soft">📋</div>
          <div className="stat-content">
            <span className="stat-label">Jumlah Booking</span>
            <span className="stat-value">{bookings.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-green-soft">💰</div>
          <div className="stat-content">
            <span className="stat-label">Total Pendapatan</span>
            <span className="stat-value stat-revenue">
              {formatRupiah(totalPendapatan)}
            </span>
          </div>
        </div>
      </div>

      {/* Daftar Booking */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Memuat laporan...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <p>😕 Tidak ada data pada rentang tanggal ini.</p>
        </div>
      ) : (
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
                  <span className={`badge badge-${b.status}`}>{b.status}</span>
                  <span className="booking-total">
                    {formatRupiah(b.total_price)}
                  </span>
                  <span className="booking-payment">
                    {b.payment_status === "paid" ? (
                      <span className="badge badge-success">✅ Lunas</span>
                    ) : (
                      <span className="badge badge-warning">
                        ⏳ Belum Dibayar
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CSS Inline (bisa dipindah ke file terpisah) */}
      <style>{`
        .reports-page {
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

        .filter-input {
          padding: 0.4rem 0.8rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.9rem;
          background: #fafafa;
          transition: 0.2s;
        }

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

        /* Statistik */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 1.5rem 1.25rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          border: 1px solid #f3f0ff;
          transition: 0.25s;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(124,58,237,0.08);
          border-color: #d4c4ff;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          font-size: 1.8rem;
          flex-shrink: 0;
        }

        .bg-blue-soft { background: #dbeafe; }
        .bg-green-soft { background: #d1fae5; }

        .stat-content {
          flex: 1;
          min-width: 0;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #6b7280;
          font-weight: 500;
          display: block;
          margin-bottom: 0.15rem;
        }

        .stat-value {
          font-size: 1.6rem;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.2;
        }

        .stat-revenue {
          color: #7c3aed;
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
        .badge-success {
          background: #d1fae5;
          color: #065f46;
        }
        .badge-warning {
          background: #fef3c7;
          color: #92400e;
        }

        .booking-total {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.95rem;
        }

        .booking-payment {
          font-size: 0.85rem;
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
          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
          }
          .stat-card {
            padding: 1rem;
            flex-direction: column;
            text-align: center;
          }
          .stat-value {
            font-size: 1.3rem;
          }
          .stat-icon {
            font-size: 1.5rem;
            width: 40px;
            height: 40px;
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
        }
      `}</style>
    </div>
  );
}
