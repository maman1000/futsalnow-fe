import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getServices } from "../../api/bookingApi";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await getServices();
        console.log("SERVICES RESPONSE:", response);
        // Asumsi response.data.data adalah array dari pagination
        setServices(response.data.data || []);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Gagal mengambil data layanan. Coba refresh halaman.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="services-page">
      <div className="services-header">
        <h1 className="services-title">🏸 Pilih Lapangan Futsal</h1>
        <p className="services-subtitle">
          Temukan lapangan favoritmu, lihat detailnya, dan booking langsung.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="services-loading">
          <div className="spinner"></div>
          <p>Memuat daftar lapangan...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="services-empty">
          <p>😕 Belum ada layanan yang tersedia saat ini.</p>
        </div>
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}

      {/* CSS khusus untuk halaman ini (bisa dipindahkan ke file terpisah) */}
      <style>{`
        .services-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .services-header {
          margin-bottom: 2.5rem;
          text-align: center;
        }

        .services-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .services-subtitle {
          color: #6b7280;
          font-size: 1.1rem;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .services-loading {
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
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .services-empty {
          text-align: center;
          padding: 4rem 0;
          color: #6b7280;
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
}

// ===== Komponen ServiceCard (bisa dipisah ke file sendiri) =====
function ServiceCard({ service }) {
  const formatRupiah = (n) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n ?? 0);

  return (
    <div className="service-card">
      <div className="service-card-image">
        {/* Placeholder icon/foto lapangan */}
        <span className="service-emoji">⚽</span>
      </div>
      <div className="service-card-body">
        <h3 className="service-card-title">{service.name}</h3>
        <p className="service-card-price">
          {formatRupiah(service.price_per_hour)} / jam
        </p>
        <p className="service-card-desc">
          {service.description ||
            "Lapangan futsal berkualitas dengan fasilitas lengkap."}
        </p>
        <Link to={`/booking/${service.id}`} className="service-card-btn">
          Booking Sekarang →
        </Link>
      </div>

      <style>{`
        .service-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          border: 1px solid #f3f0ff;
          overflow: hidden;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
        }

        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(124, 58, 237, 0.10);
          border-color: #d4c4ff;
        }

        .service-card-image {
          background: #f5f3ff;
          padding: 2rem 0;
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom: 1px solid #f0edf7;
        }

        .service-emoji {
          font-size: 3.5rem;
          line-height: 1;
        }

        .service-card-body {
          padding: 1.5rem 1.25rem 1.25rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .service-card-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.25rem 0;
        }

        .service-card-price {
          font-size: 1rem;
          font-weight: 500;
          color: #7c3aed;
          margin-bottom: 0.5rem;
        }

        .service-card-desc {
          color: #6b7280;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1.2rem;
          flex: 1;
        }

        .service-card-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.6rem 1.2rem;
          background: #7c3aed;
          color: white;
          border-radius: 30px;
          font-weight: 500;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
          align-self: flex-start;
        }

        .service-card-btn:hover {
          background: #6d28d9;
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
        }
      `}</style>
    </div>
  );
}
