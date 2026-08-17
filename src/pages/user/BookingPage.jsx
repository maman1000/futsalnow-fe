// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getService } from "../../api/bookingApi";
// import BookingForm from "../../components/BookingForm";

// const formatRupiah = (n) =>
//   new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//     minimumFractionDigits: 0,
//   }).format(n ?? 0);

// export default function BookingPage() {
//   const { id } = useParams();
//   const [service, setService] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchService = async () => {
//       try {
//         const res = await getService(id);
//         console.log("SERVICE DETAIL:", res.data);

//         setService(res.data);
//       } catch (err) {
//         setError(err.response?.data?.message || "Layanan tidak ditemukan.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchService();
//   }, [id]);

//   if (loading)
//     return (
//       <div className="container">
//         <p className="page-loading">Memuat...</p>
//       </div>
//     );
//   if (error)
//     return (
//       <div className="container">
//         <div className="alert alert-error">{error}</div>
//       </div>
//     );

//   return (
//     <div className="container">
//       <div className="page-header">
//         <h2>Booking: {service.name}</h2>
//         <p className="muted">{formatRupiah(service.price_per_hour)} / jam</p>
//       </div>
//       <BookingForm service={service} />
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getService } from "../../api/bookingApi";
import BookingForm from "../../components/BookingForm";

const formatRupiah = (n) => {
  if (n == null || n === 0) return "Gratis / Hubungi"; // atau "Rp0"
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
};

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getService(id);
        console.log("SERVICE DETAIL:", res.data);
        setService(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Layanan tidak ditemukan.");
        setService(null);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  // Tampilkan loading
  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">
          <span className="spinner"></span>
          <p>Memuat data layanan...</p>
        </div>
      </div>
    );
  }

  // Tampilkan error
  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
          style={{ marginTop: "1rem" }}
        >
          ← Kembali
        </button>
      </div>
    );
  }

  // Jika service null (misal data kosong) tapi tidak ada error
  if (!service) {
    return (
      <div className="container">
        <div className="alert alert-warning">Layanan tidak tersedia.</div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>Booking: {service.name}</h2>
        <p className="muted">{formatRupiah(service.price_per_hour)} / jam</p>
      </div>
      <BookingForm service={service} />
    </div>
  );
}
