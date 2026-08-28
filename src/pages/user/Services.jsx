import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getServices } from "../../api/bookingApi";

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n ?? 0);

// const fieldImages = [
//   "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
//   "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=300&fit=crop",
//   "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&h=300&fit=crop",
// ];

const fieldImages = [
  "/images/futsal-A.jpg",
  "/images/futsal-B.jpg",
  "/images/futsal-C.jpg",
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
          max-width: 1080px;
          margin: 0 auto;
          padding: 32px 16px 48px;
          position: relative;
        }

        /* =========================
          HEADER
          ========================= */

        .services-header {
          margin-bottom: 24px;
          text-align: center;
        }

        .services-title {
          margin: 0 0 6px;
          color: var(--dark);
          font-size: 2rem;
          line-height: 1.2;
          font-weight: 700;
        }

        .services-subtitle {
          margin: 0;
          color: var(--muted);
          font-size: 1rem;
        }

        /* =========================
          FILTER
          ========================= */

        .services-filter {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 7px 14px;
          border: 1px solid var(--border);
          border-radius: var(--radius-button);
          background: var(--white);
          color: var(--muted);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition:
            background-color 0.15s ease,
            border-color 0.15s ease,
            color 0.15s ease;
        }

        .filter-btn:hover {
          background: var(--background);
          border-color: #cbd5e1;
          color: var(--dark);
        }

        .filter-btn.active {
          background: #f0fdf4;
          border-color: #bbf7d0;
          color: var(--green-dark);
        }

        /* =========================
          GRID
          ========================= */

        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        /* =========================
          SERVICE CARD
          ========================= */

        .service-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius-card);
          box-shadow: var(--shadow);
          opacity: 0;
          animation: serviceFadeIn 0.35s ease forwards;
          transition:
            box-shadow 0.15s ease,
            border-color 0.15s ease,
            transform 0.15s ease;
        }

        .service-card:hover {
          transform: translateY(-3px);
          border-color: #cbd5e1;
          box-shadow: var(--shadow-hover);
        }

        @keyframes serviceFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* =========================
          FEATURED
          ========================= */

        .service-featured {
          grid-column: span 2;
        }

        .service-featured .service-image {
          height: 220px;
        }

        /* =========================
          IMAGE
          ========================= */

        .service-image-wrapper {
          position: relative;
          overflow: hidden;
          background: #f1f5f9;
        }

        .service-image {
          display: block;
          width: 100%;
          height: 180px;
          object-fit: cover;
          transition: transform 0.25s ease;
        }

        .service-card:hover .service-image {
          transform: scale(1.025);
        }

        /* =========================
          BADGE
          ========================= */

        .service-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 4px 9px;
          border-radius: 6px;
          color: var(--white);
          font-size: 0.72rem;
          font-weight: 600;
        }

        .badge-popular {
          background: var(--green);
        }

        .badge-special {
          background: var(--blue);
        }

        .badge-premium {
          background: #0d9488;
        }

        /* =========================
          BODY
          ========================= */

        .service-body {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 16px 18px 18px;
        }

        .service-name {
          margin: 0 0 4px;
          color: var(--dark);
          font-size: 1.1rem;
          font-weight: 600;
          line-height: 1.4;
        }

        .service-location {
          margin: 0 0 8px;
          color: var(--muted);
          font-size: 0.8rem;
        }

        .service-desc {
          display: -webkit-box;
          overflow: hidden;
          flex: 1;
          margin: 0 0 16px;
          color: var(--muted);
          font-size: 0.9rem;
          line-height: 1.5;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        /* =========================
          FOOTER
          ========================= */

        .service-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--border);
        }

        .service-price {
          color: var(--green);
          font-size: 1.05rem;
          font-weight: 700;
        }

        .service-price-unit {
          margin-left: 3px;
          color: var(--muted);
          font-size: 0.8rem;
          font-weight: 400;
        }

        .service-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 13px;
          border: 1px solid var(--green);
          border-radius: var(--radius-button);
          background: var(--green);
          color: var(--white);
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition:
            background-color 0.15s ease,
            border-color 0.15s ease;
        }

        .service-btn:hover {
          background: var(--green-dark);
          border-color: var(--green-dark);
          color: var(--white);
          text-decoration: none;
        }

        /* =========================
          LOADING
          ========================= */

        .services-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 0;
          color: var(--muted);
        }

        .services-loading p {
          margin-top: 4px;
        }

        /* =========================
          EMPTY
          ========================= */

        .services-empty {
          padding: 48px 16px;
          text-align: center;
          color: var(--muted);
        }

        /* =========================
          ERROR
          ========================= */

        .services-page .alert {
          margin-top: 16px;
        }

        /* =========================
          RESPONSIVE
          ========================= */

        @media (max-width: 800px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .service-featured {
            grid-column: span 2;
          }

          .service-featured .service-image {
            height: 200px;
          }
        }

        @media (max-width: 520px) {
          .services-page {
            padding: 24px 12px 40px;
          }

          .services-title {
            font-size: 1.6rem;
          }

          .services-subtitle {
            font-size: 0.9rem;
          }

          .services-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .service-featured {
            grid-column: span 1;
          }

          .service-featured .service-image {
            height: 180px;
          }

          .service-footer {
            align-items: center;
          }

          .service-price {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
