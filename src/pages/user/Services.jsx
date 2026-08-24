import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getServices } from "../../api/bookingApi";

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n ?? 0);

const fieldImages = [
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&h=300&fit=crop",
];

const getBadge = (index) => {
  const badges = [
    { label: "Populer", className: "badge-popular" },
    { label: "Harga Spesial", className: "badge-special" },
    { label: "Premium", className: "badge-premium" },
  ];
  return badges[index % badges.length];
};

const categories = ["Semua", "Premium", "Standar"];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await getServices();
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

  if (loading) {
    return (
      <div className="services-page page-content">
        <div className="services-loading">
          <div className="spinner"></div>
          <p>Memuat lapangan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-page page-content">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  const filteredServices =
    activeFilter === "Semua"
      ? services
      : services.filter((s) =>
          activeFilter === "Premium"
            ? s.price_per_hour >= 200000
            : s.price_per_hour < 200000,
        );

  return (
    <div className="services-page page-content">
      {/* ELEMEN DEKORATIF */}
      <div className="services-deco"></div>

      {/* HEADER */}
      <div className="services-header">
        <h1 className="services-title">Yuk, Pilih Lapangan Futsal!</h1>
        <p className="services-subtitle">
          Cari lapangan futsal favoritmu, langsung booking!
        </p>
      </div>

      {/* FILTER */}
      <div className="services-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${activeFilter === cat ? "active" : ""}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID */}
      {filteredServices.length === 0 ? (
        <div className="services-empty">
          <p>😕 Tidak ada lapangan untuk filter ini.</p>
        </div>
      ) : (
        <div className="services-grid">
          {filteredServices.map((service, index) => {
            const badge = getBadge(index);
            const imageIndex = index % fieldImages.length;
            const isFeatured = index === 0;

            return (
              <div
                key={service.id}
                className={`service-card ${isFeatured ? "service-featured" : ""}`}
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                {/* GAMBAR */}
                <div className="service-image-wrapper">
                  <img
                    src={fieldImages[imageIndex]}
                    alt={service.name}
                    className="service-image"
                    loading="lazy"
                  />
                  <span className={`service-badge ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>

                {/* KONTEN */}
                <div className="service-body">
                  <h3 className="service-name">{service.name}</h3>
                  <p className="service-location">📍 Bandung Selatan</p>
                  <p className="service-desc">
                    {service.description ||
                      "Lapangan futsal berkualitas dengan fasilitas lengkap."}
                  </p>
                  <div className="service-footer">
                    <span className="service-price">
                      {formatRupiah(service.price_per_hour)}
                      <span className="service-price-unit">/ jam</span>
                    </span>
                    <Link to={`/booking/${service.id}`} className="service-btn">
                      Booking →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== CSS ===== */}
      <style>{`
        .services-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          position: relative;
        }

        .services-deco {
          position: absolute;
          top: 5%;
          right: -5%;
          width: 250px;
          height: 250px;
          background: rgba(30, 41, 59, 0.03);
          border-radius: 60% 40% 50% 50%;
          filter: blur(100px);
          z-index: -1;
          pointer-events: none;
        }

        .services-header {
          margin-bottom: 2rem;
          text-align: center;
        }
        .services-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }
        .services-subtitle {
          color: #6b7280;
          font-size: 1rem;
        }

        /* ===== FILTER ===== */
        .services-filter {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .filter-btn {
          padding: 0.4rem 1.2rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 30px;
          background: white;
          font-size: 0.85rem;
          font-weight: 500;
          color: #4b5563;
          cursor: pointer;
          transition: 0.2s;
        }
        .filter-btn:hover {
          border-color: #1e293b;
          color: #1e293b;
        }
        .filter-btn.active {
          background: #1e293b;
          color: white;
          border-color: #1e293b;
        }

        /* ===== GRID ===== */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 2rem;
        }

        /* ===== SERVICE CARD ===== */
        .service-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
          opacity: 0;
          animation: fadeInUp 0.4s ease forwards;
          display: flex;
          flex-direction: column;
        }
        .service-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 40px rgba(30, 41, 59, 0.06);
          border-color: #d1d5db;
        }

        .service-featured {
          grid-column: span 2;
        }
        .service-featured .service-image {
          height: 240px;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .service-image-wrapper {
          position: relative;
          overflow: hidden;
          background: #f5f7fa;
        }
        .service-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .service-card:hover .service-image {
          transform: scale(1.04);
        }

        .service-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 0.2rem 0.8rem;
          border-radius: 30px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: white;
        }
        .badge-popular {
          background: #c97b5c;
        }
        .badge-special {
          background: #2563eb;
        }
        .badge-premium {
          background: #0d9488;
        }

        .service-body {
          padding: 1.25rem 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .service-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.1rem;
        }
        .service-location {
          font-size: 0.8rem;
          color: #6b7280;
          margin-bottom: 0.4rem;
        }
        .service-desc {
          color: #6b7280;
          font-size: 0.9rem;
          line-height: 1.4;
          margin-bottom: 1.2rem;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .service-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          border-top: 1px solid #f3f4f6;
          padding-top: 0.75rem;
        }
        .service-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1e293b;
        }
        .service-price-unit {
          font-size: 0.8rem;
          font-weight: 400;
          color: #6b7280;
          margin-left: 0.2rem;
        }
        .service-btn {
          padding: 0.4rem 1.2rem;
          background: #1e293b;
          color: white;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.85rem;
          text-decoration: none;
          transition: 0.25s;
        }
        .service-btn:hover {
          background: #0f172a;
          transform: translateX(3px);
          box-shadow: 0 4px 12px rgba(30, 41, 59, 0.25);
        }

        /* ===== LOADING & EMPTY ===== */
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
          border: 4px solid #f1f5f9;
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

        .services-empty {
          text-align: center;
          padding: 4rem 0;
          color: #6b7280;
          font-size: 1.1rem;
        }

        .alert {
          padding: 0.75rem 1rem;
          border-radius: 14px;
          font-size: 0.9rem;
          border-left: 4px solid;
        }
        .alert-error {
          background: #fee2e2;
          border-color: #dc2626;
          color: #991b1b;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .service-featured {
            grid-column: span 1;
          }
          .service-featured .service-image {
            height: 180px;
          }
          .services-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin: 0 auto;
          }
        }
        @media (max-width: 480px) {
          .services-title {
            font-size: 1.5rem;
          }
          .services-filter {
            gap: 0.3rem;
          }
          .filter-btn {
            padding: 0.3rem 0.8rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
