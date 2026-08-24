import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getServices } from "../../api/bookingApi";
import {
  MagnifyingGlassIcon,
  BoltIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n ?? 0);

const getPromoBadge = (index) => {
  const badges = [
    { label: "Populer", className: "badge-popular" },
    { label: "Promo 10%", className: "badge-promo" },
    { label: "Premium", className: "badge-premium" },
  ];
  return badges[index % badges.length];
};

const fieldImages = [
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&h=300&fit=crop",
];

export default function Home() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getServices();
        setServices(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services
    .filter((s) => {
      if (activeFilter === "Populer") return s.price_per_hour >= 200000;
      if (activeFilter === "Premium") return s.price_per_hour >= 250000;
      return true;
    })
    .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 4);

  const features = [
    {
      icon: <BoltIcon className="w-5 h-5" />,
      title: "Booking Instan",
      desc: "Lihat jadwal real-time dan pesan langsung.",
    },
    {
      icon: <ShieldCheckIcon className="w-5 h-5" />,
      title: "Aman Terjaga",
      desc: "Pembayaran aman, riwayat tersimpan rapi.",
    },
    {
      icon: <BuildingLibraryIcon className="w-5 h-5" />,
      title: "Banyak Pilihan",
      desc: "Temukan lapangan dengan harga terbaik.",
    },
  ];

  return (
    <div className="home-page page-content">
      {/* ===== HERO ===== */}
      <section className="hero-section">
        <div className="hero-blur-1"></div>
        <div className="hero-blur-2"></div>

        <div className="hero-content">
          <h1 className="hero-title">
            Cari Lapangan Futsal <br />
            <span className="hero-highlight">Langsung Booking</span>
          </h1>
          <p className="hero-desc">Yuk, cari lapangan futsal favoritmu!</p>

          <div className="search-bar">
            <MagnifyingGlassIcon className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Cari lapangan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Link to="/services" className="search-btn">
              Cari
            </Link>
          </div>

          <div className="quick-filter">
            {["Semua", "Populer", "Premium"].map((filter) => (
              <button
                key={filter}
                className={`filter-chip ${activeFilter === filter ? "active" : ""}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {!user && (
            <div className="hero-auth">
              <span>Baru di sini? </span>
              <Link to="/register" className="hero-register-link">
                Daftar sekarang →
              </Link>
            </div>
          )}
        </div>

        <div className="hero-image-wrapper">
          <div className="hero-image">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 200"
              className="hero-illustration"
              width="240"
              height="240"
            >
              <rect
                x="10"
                y="20"
                width="180"
                height="160"
                rx="8"
                fill="#2d3748"
              />
              <rect
                x="20"
                y="30"
                width="160"
                height="140"
                rx="4"
                fill="#38a169"
              />
              <line
                x1="20"
                y1="100"
                x2="180"
                y2="100"
                stroke="white"
                strokeWidth="2"
              />
              <circle
                cx="100"
                cy="100"
                r="16"
                fill="none"
                stroke="white"
                strokeWidth="2"
              />
              <rect
                x="14"
                y="60"
                width="8"
                height="40"
                rx="2"
                fill="white"
                opacity="0.7"
              />
              <rect
                x="178"
                y="60"
                width="8"
                height="40"
                rx="2"
                fill="white"
                opacity="0.7"
              />
              <circle cx="100" cy="100" r="12" fill="white" />
              <circle cx="100" cy="100" r="6" fill="#2d3748" />
              <circle cx="100" cy="100" r="2" fill="white" />
              <path
                d="M20 50 L180 50"
                stroke="white"
                strokeWidth="1"
                opacity="0.3"
              />
              <path
                d="M20 150 L180 150"
                stroke="white"
                strokeWidth="1"
                opacity="0.3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ===== REKOMENDASI LAPANGAN ===== */}
      <section className="recommend-section">
        <div className="section-header">
          <h2 className="section-title">Lapangan Rekomendasi</h2>
          <Link to="/services" className="view-all-link">
            Lihat semua →
          </Link>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Memuat lapangan...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <p className="empty-text">Tidak ada lapangan yang cocok.</p>
        ) : (
          <div className="recommend-grid">
            {filteredServices.map((service, index) => {
              const promo = getPromoBadge(index);
              const imgIndex = index % fieldImages.length;
              return (
                <div key={service.id} className="rec-card">
                  <div className="rec-image-wrapper">
                    <img
                      src={fieldImages[imgIndex]}
                      alt={service.name}
                      className="rec-image"
                      loading="lazy"
                    />
                    <span className={`rec-badge ${promo.className}`}>
                      {promo.label}
                    </span>
                  </div>
                  <div className="rec-body">
                    <h3 className="rec-name">{service.name}</h3>
                    <div className="rec-meta">
                      <span className="rec-price">
                        {formatRupiah(service.price_per_hour)}
                        <span className="rec-price-unit">/ jam</span>
                      </span>
                      <Link to={`/booking/${service.id}`} className="rec-btn">
                        Booking →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ===== FITUR ===== */}
      <section className="features-section">
        <h2 className="features-title">
          Kenapa harus <span className="text-primary">FutsalNow</span>?
        </h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-name">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <div className="cta-box">
          <div className="cta-content">
            <h2 className="cta-title">Siap bermain?</h2>
            <p className="cta-desc">
              Booking lapangan sekarang dan nikmati permainanmu!
            </p>
            <Link to="/services" className="cta-btn">
              Mulai Booking →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CSS ===== */}
      <style>{`
        .home-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .hero-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2.5rem 0;
          gap: 2rem;
          flex-wrap: wrap;
          background: white;
          border-radius: 0 0 30px 30px;
          min-height: 300px;
          position: relative;
          overflow: hidden;
        }

        .hero-blur-1 {
          position: absolute;
          top: -50px;
          right: -30px;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(30,41,59,0.04) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(60px);
          z-index: 0;
          pointer-events: none;
        }
        .hero-blur-2 {
          position: absolute;
          bottom: -60px;
          left: -40px;
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(30,41,59,0.03) 0%, transparent 70%);
          border-radius: 60% 40% 50% 50%;
          filter: blur(70px);
          z-index: 0;
          pointer-events: none;
        }

        .hero-content {
          flex: 1 1 400px;
          z-index: 1;
        }
        .hero-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.2;
          margin-bottom: 0.5rem;
        }
        .hero-highlight {
          color: #1e293b;
        }
        .hero-desc {
          color: #6b7280;
          font-size: 1rem;
          margin-bottom: 1.2rem;
        }

        .search-bar {
          display: flex;
          align-items: center;
          background: #f5f7fa;
          border-radius: 30px;
          padding: 0.3rem 0.3rem 0.3rem 1rem;
          border: 1px solid #e5e7eb;
          max-width: 480px;
          transition: 0.2s;
        }
        .search-bar:focus-within {
          border-color: #1e293b;
          box-shadow: 0 0 0 4px rgba(30,41,59,0.08);
        }
        .search-icon {
          width: 1.2rem;
          height: 1.2rem;
          color: #6b7280;
          flex-shrink: 0;
        }
        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 0.6rem 0.8rem;
          font-size: 0.95rem;
          outline: none;
        }
        .search-btn {
          padding: 0.5rem 1.2rem;
          background: #1e293b;
          color: white;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.85rem;
          text-decoration: none;
          transition: 0.2s;
        }
        .search-btn:hover {
          background: #0f172a;
          transform: scale(1.02);
        }

        .quick-filter {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.8rem;
          flex-wrap: wrap;
        }
        .filter-chip {
          padding: 0.2rem 0.8rem;
          border: 1px solid #e5e7eb;
          border-radius: 30px;
          background: white;
          font-size: 0.8rem;
          color: #4b5563;
          cursor: pointer;
          transition: 0.2s;
        }
        .filter-chip:hover {
          border-color: #1e293b;
        }
        .filter-chip.active {
          background: #1e293b;
          color: white;
          border-color: #1e293b;
        }

        .hero-auth {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #6b7280;
        }
        .hero-register-link {
          color: #1e293b;
          font-weight: 600;
          text-decoration: none;
        }
        .hero-register-link:hover {
          text-decoration: underline;
        }

        .hero-image-wrapper {
          flex: 1 1 200px;
          display: flex;
          justify-content: center;
        }
        .hero-image {
          background: #f5f7fa;
          border-radius: 50%;
          padding: 1rem;
        }
        .hero-illustration {
          max-width: 100%;
          height: auto;
        }

        .recommend-section {
          padding: 2rem 0 1.5rem;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .section-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }
        .view-all-link {
          color: #1e293b;
          font-weight: 500;
          font-size: 0.9rem;
          text-decoration: none;
        }
        .view-all-link:hover {
          text-decoration: underline;
        }

        .recommend-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .rec-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #f3f0ff;
          transition: 0.25s;
        }
        .rec-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.06);
        }
        .rec-image-wrapper {
          position: relative;
          overflow: hidden;
          background: #f5f7fa;
          height: 140px;
        }
        .rec-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: 0.3s;
        }
        .rec-card:hover .rec-image {
          transform: scale(1.04);
        }
        .rec-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          padding: 0.15rem 0.6rem;
          border-radius: 30px;
          font-size: 0.6rem;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .badge-popular { background: #c97b5c; }
        .badge-promo { background: #2563eb; }
        .badge-premium { background: #0d9488; }

        .rec-body {
          padding: 0.8rem 1rem 1rem;
        }
        .rec-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.3rem;
        }
        .rec-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .rec-price {
          font-weight: 700;
          color: #1e293b;
          font-size: 1rem;
        }
        .rec-price-unit {
          font-weight: 400;
          font-size: 0.7rem;
          color: #6b7280;
          margin-left: 0.1rem;
        }
        .rec-btn {
          padding: 0.25rem 0.9rem;
          background: #1e293b;
          color: white;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.75rem;
          text-decoration: none;
          transition: 0.2s;
        }
        .rec-btn:hover {
          background: #0f172a;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 0;
          color: #6b7280;
        }
        .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid #f3f0ff;
          border-top: 3px solid #1e293b;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 0.5rem;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .empty-text {
          color: #6b7280;
          text-align: center;
          padding: 1rem 0;
        }

        .features-section {
          padding: 2rem 0 2.5rem;
          text-align: center;
        }
        .features-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }
        .text-primary {
          color: #1e293b;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .feature-card {
          background: white;
          padding: 1.5rem 1rem;
          border-radius: 16px;
          border: 1px solid #f3f0ff;
          text-align: center;
        }
        .feature-icon {
          width: 40px;
          height: 40px;
          background: #f1f5f9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.5rem;
          color: #1e293b;
        }
        .feature-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 1rem;
          margin-bottom: 0.2rem;
        }
        .feature-desc {
          color: #6b7280;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .cta-section {
          padding: 0.5rem 0 2rem;
        }
        .cta-box {
          background: #f1f5f9;
          border-radius: 24px;
          padding: 2rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .cta-content {
          flex: 1;
        }
        .cta-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.2rem;
        }
        .cta-desc {
          color: #6b7280;
          margin-bottom: 0.5rem;
        }
        .cta-btn {
          padding: 0.5rem 1.5rem;
          background: #1e293b;
          color: white;
          border-radius: 30px;
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          transition: 0.2s;
        }
        .cta-btn:hover {
          background: #0f172a;
          transform: scale(1.02);
        }

        @media (max-width: 768px) {
          .hero-section {
            flex-direction: column;
            text-align: center;
            padding: 1.5rem 0;
          }
          .search-bar {
            max-width: 100%;
            margin: 0 auto;
          }
          .hero-image-wrapper {
            display: none;
          }
          .features-grid {
            grid-template-columns: 1fr;
            max-width: 320px;
            margin: 0 auto;
          }
          .recommend-grid {
            grid-template-columns: 1fr 1fr;
          }
          .cta-box {
            flex-direction: column;
            text-align: center;
          }
          .hero-blur-1, .hero-blur-2 {
            display: none;
          }
        }
        @media (max-width: 480px) {
          .recommend-grid {
            grid-template-columns: 1fr;
          }
          .hero-title {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
}
