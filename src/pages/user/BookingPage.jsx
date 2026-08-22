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
      <div className="page-content container">
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
      <div className="page-content container">
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
      <div className="page-content container">
        <div className="alert alert-warning">Layanan tidak tersedia.</div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="page-content container">
      <div className="page-header">
        <h2>Booking: {service.name}</h2>
        <p className="muted">{formatRupiah(service.price_per_hour)} / jam</p>
      </div>
      <BookingForm service={service} />
    </div>
  );
}
