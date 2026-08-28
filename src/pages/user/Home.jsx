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

const fieldImages = [
  "/images/progresif-futsal.jpg",
  "/images/groove-futsal.jpg",
  "/images/green-futsal.jpg",
];

const getBadge = (service) => {
  if (service.price_per_hour >= 250000) {
    return { label: "Premium", className: "badge-premium" };
  }
  if (service.price_per_hour >= 200000) {
    return { label: "Harga Spesial", className: "badge-special" };
  }
  return null;
};

export default function Home() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
    .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 3);

  const features = [
    {
      icon: <BoltIcon />,
      title: "Booking Instan",
      desc: "Lihat jadwal real-time dan pesan langsung.",
    },
    {
      icon: <ShieldCheckIcon />,
      title: "Aman Terjaga",
      desc: "Pembayaran aman, riwayat tersimpan rapi.",
    },
    {
      icon: <BuildingLibraryIcon />,
      title: "Banyak Pilihan",
      desc: "Temukan lapangan dengan harga terbaik.",
    },
  ];

  return (
    <div className="home-page page-content">
      {/* ===== HERO ===== */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-eyebrow">FUTSALNOW</p>

          <h1 className="hero-title">
            Cari lapangan futsal.
            <br />
            <span>Booking sekarang.</span>
          </h1>

          <p className="hero-desc">
            Pilih lapangan dan jadwal bermainmu dengan mudah.
          </p>

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

          {!user && (
            <div className="hero-auth">
              <span>Belum punya akun?</span>{" "}
              <Link to="/register" className="hero-register-link">
                Daftar sekarang
              </Link>
            </div>
          )}
        </div>

        <div className="hero-image-wrapper">
          <img
            src={fieldImages[0]}
            alt="Lapangan futsal"
            className="hero-image"
          />
        </div>
      </section>

      {/* ===== LAPANGAN TERSEDIA ===== */}
      <section className="recommend-section">
        <div className="section-header">
          <h2 className="section-title">Lapangan Tersedia</h2>
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
              const imgIndex = index % fieldImages.length;
              const badge = getBadge(service);
              return (
                <div key={service.id} className="rec-card">
                  <div className="rec-image-wrapper">
                    <img
                      src={fieldImages[imgIndex]}
                      alt={service.name}
                      className="rec-image"
                      loading="lazy"
                    />
                    {badge && (
                      <span className={`service-badge ${badge.className}`}>
                        {badge.label}
                      </span>
                    )}
                  </div>

                  <div className="rec-body">
                    <h3 className="rec-name">{service.name}</h3>

                    <p className="rec-price">
                      {formatRupiah(service.price_per_hour)}
                      <span>/ jam</span>
                    </p>

                    <Link to={`/booking/${service.id}`} className="rec-btn">
                      Booking Sekarang
                    </Link>
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
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          align-items: center;
          gap: 48px;

          padding: 48px 0 32px;
        }

        .hero-content {
          max-width: 580px;
        }

        .hero-eyebrow {
          margin: 0 0 12px;

          color: #16a34a;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .hero-title {
          margin: 0;

          color: #0f172a;
          font-size: 44px;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.03em;
        }

        .hero-title span {
          color: #16a34a;
        }

        .hero-desc {
          margin: 24px 0 32px;
          color: #64748b;
          font-size: 17px;
          line-height: 1.6;
        }

        .search-bar {
          display: flex;
          align-items: center;

          max-width: 520px;
          padding: 4px;

          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;

          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
        }

        .search-bar:focus-within {
          border-color: #16a34a;
        }

        .search-icon {
          width: 20px;
          height: 20px;
          margin-left: 12px;

          color: #64748b;
        }

        .search-input {
          flex: 1;

          border: none;
          outline: none;
          background: transparent;

          padding: 12px;

          color: #0f172a;
          font-size: 15px;
        }

        .search-btn {
          padding: 11px 20px;

          background: #16a34a;
          color: #ffffff;

          border-radius: 6px;

          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
        }

        .search-btn:hover {
          background: #15803d;
        }

        .hero-auth {
          margin-top: 16px;

          color: #64748b;
          font-size: 14px;
        }

        .hero-register-link {
          color: #16a34a;
          font-weight: 600;
          text-decoration: none;
        }

        .hero-register-link:hover {
          text-decoration: underline;
        }

        .hero-image-wrapper {
          display: flex;
          justify-content: flex-end;
        }

        .hero-image {
          width: 100%;
          max-width: 460px;
          height: 300px;

          object-fit: cover;

          border-radius: 12px;
        }

        .rec-card {
          overflow: hidden;

          background: #ffffff;

          border: 1px solid #e2e8f0;
          border-radius: 12px;

          transition: transform 0.2s ease,
                      box-shadow 0.2s ease;
        }

        .rec-card:hover {
          transform: translateY(-3px);

          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
        }

        .rec-image-wrapper {
          position: relative;
          height: 180px;

          overflow: hidden;
          background: #f1f5f9;
        }

        .service-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 4px 9px;
          border-radius: 6px;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 600;
        }

        .badge-special {
          background: #2563eb;
        }

        .badge-premium {
          background: #0d9488;
        }

        .rec-image {
          width: 100%;
          height: 100%;

          object-fit: cover;

          transition: transform 0.3s ease;
        }

        .rec-card:hover .rec-image {
          transform: scale(1.03);
        }

        .rec-body {
          padding: 16px;
        }

        .rec-name {
          margin: 0 0 8px;

          color: #0f172a;

          font-size: 18px;
          font-weight: 600;
        }

        .rec-price {
          margin: 0 0 16px;

          color: #16a34a;

          font-size: 16px;
          font-weight: 700;
        }

        .rec-price span {
          margin-left: 3px;

          color: #64748b;

          font-size: 14px;
          font-weight: 400;
        }

        .rec-btn {
          display: block;

          width: 100%;
          padding: 10px 16px;

          background: #16a34a;
          color: #ffffff;

          border-radius: 7px;

          text-align: center;

          font-size: 14px;
          font-weight: 600;
          text-decoration: none;

          transition: background 0.2s ease;
        }

        .rec-btn:hover {
          background: #15803d;
        }

        .recommend-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .section-title {
          margin: 0;

          color: #0f172a;
          font-family: Inter, sans-serif;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
        }

        .view-all-link {
          color: #16a34a;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
        }

        .recommend-section {
          padding: 32px 0 48px;
        }

        .features-section {
          padding: 48px 0 64px;
        }

        .features-title {
          margin: 0 0 24px;
          color: #0f172a;
          font-family: Inter, sans-serif;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
        }

        .text-primary {
          color: #16a34a;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .feature-card {
          padding: 24px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .feature-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          color: #16a34a;
          background: #f0fdf4;
          border-radius: 8px;
        }

        .feature-icon svg {
          width: 20px;
          height: 20px;
        }

        .feature-name {
          margin: 0 0 8px;
          color: #0f172a;
          font-family: Inter, sans-serif;
          font-size: 16px;
          font-weight: 600;
        }

        .feature-desc {
          margin: 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
        }

        .cta-section {
          padding: 40px 0;
        }
        .cta-box {
          background: #0f172a;
          padding: 40px 32px;
          border-radius: 16px;
          text-align: center;
        }
        .cta-title {
          color: #ffffff;
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px;
        }
        .cta-desc {
          color: #94a3b8;
          font-size: 16px;
          margin: 0 0 24px;
        }
        .cta-btn {
          display: inline-block;
          background: #16a34a;
          color: #ffffff;
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
        }

        @media (max-width: 900px) {
          .recommend-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
        .hero-section {
          grid-template-columns: 1fr;
          gap: 32px;
          padding: 40px 0;
        }

        .hero-content {
          max-width: none;
        }

        .hero-title {
          font-size: 36px;
        }

        .hero-image-wrapper {
          justify-content: center;
        }

        .hero-image {
          max-width: 100%;
          height: 240px;
        }

        .features-grid {
          grid-template-columns: repeat(2, 1fr); /* Tablet: jadi 2 kolom */
        }
      }

      @media (max-width: 480px) {
          /* Pastikan container utama tidak overflow */
          .home-page {
            overflow-x: hidden;
            padding: 0 1.5rem !important;
          }

          /* Beri padding internal yang sama pada hero-content */
          .hero-content {
            padding: 0 1.5rem !important;
            margin: 0 auto;
            width: 100%;
            max-width: 100%;
            text-align: center;
            box-sizing: border-box;
          }

          /* Hilangkan semua margin/padding asimetris pada search bar */
          .search-bar {
            margin: 0 auto;
            padding: 4px 8px;
            box-sizing: border-box;
          }

          /* Pastikan ikon tidak punya margin kiri */
          .search-icon {
            margin-left: 0;
          }

          /* Cegah gambar meluber */          
          .hero-image-wrapper {
            display: flex;
            justify-content: center !important; /* timpa flex-end dari desktop */
            overflow: hidden;
            width: 100%;
          }    

          .hero-image {
            max-width: 100%;
            height: auto;
            aspect-ratio: 16/10;
            object-fit: cover;
            border-radius: 12px;
            margin: 0 auto; /* pengaman tambahan */
          }

          .hero-title {
            font-size: 30px;
          }

          .search-input {
            flex: 1;
            min-width: 0;
            padding: 10px 8px;
            font-size: 14px;
          }

          .search-btn {
            padding: 10px 14px;
            font-size: 14px;
            white-space: nowrap;
            flex-shrink: 0;
          }

          .hero-desc {
            margin: 12px auto 24px;
            max-width: 90%;
          }

          .hero-section {
            grid-template-columns: 1fr;
            gap: 32px;
            padding: 40px 0;
          }

          /* HAPUS aturan ini karena sudah diatur di atas:
          .hero-content {
            max-width: none;
          }
          */

          .recommend-grid {
            grid-template-columns: 1fr;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 400px) {
        .search-input {
          padding: 8px 4px;   /* sebelumnya 10px 8px */
          font-size: 13px;    /* sebelumnya 14px */
        }
        .search-btn {
          padding: 8px 10px;  /* sebelumnya 10px 14px */
          font-size: 13px;    /* sebelumnya 14px */
        }
      }

      /* Untuk semua layar dengan lebar <= 360px */
      @media (max-width: 360px) {
        .hero-image-wrapper {
          display: flex;
          justify-content: center !important; /* paksa tengah */
          width: 100%;
          overflow: hidden;
        }

        .hero-image {
          max-width: 100%;
          height: auto;
          aspect-ratio: 16/10;
          object-fit: cover;
          border-radius: 12px;
          margin: 0 auto; /* tambahan pengaman */
        }

        /* Opsional: kecilkan padding hero-content agar tidak terlalu sempit */
        .hero-content {
          padding: 0 0.75rem !important;
        }
      }

      `}</style>
    </div>
  );
}
