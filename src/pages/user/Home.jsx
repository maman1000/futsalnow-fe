// import { Link } from 'react-router-dom'

// export default function Home() {
//   return (
//     <div className="container">
//       <section className="hero">
//         <h1>Booking Layanan Jadi Mudah</h1>
//         <p>
//           Pilih layanan barbershop &amp; salon favorit Anda, tentukan jadwal,
//           dan booking dalam hitungan detik. Tanpa antre, tanpa ribet.
//         </p>
//         <Link to="/services" className="btn btn-primary btn-lg">Lihat Layanan</Link>
//       </section>

//       <section className="features">
//         <div className="card feature-card">
//           <h3>Pilih Layanan</h3>
//           <p>Beragam layanan dari potong rambut hingga perawatan lengkap.</p>
//         </div>
//         <div className="card feature-card">
//           <h3>Atur Jadwal</h3>
//           <p>Lihat slot tersedia secara real-time dan pilih jam yang pas.</p>
//         </div>
//         <div className="card feature-card">
//           <h3>Bayar Fleksibel</h3>
//           <p>Transfer, cash, atau e-wallet — semua bisa.</p>
//         </div>
//       </section>
//     </div>
//   )
// }

import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            ⚡ Booking lapangan futsal jadi lebih mudah
          </div>
          <h1 className="hero-title">
            Cari & Pesan Lapangan <br />
            <span className="hero-highlight">Tanpa Ribet</span>
          </h1>
          <p className="hero-desc">
            Temukan lapangan futsal terdekat, lihat jadwal kosong, dan booking
            langsung — semua dalam satu tempat.
          </p>
          <div className="hero-actions">
            <Link to="/services" className="btn btn-primary btn-lg">
              Cari Lapangan →
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-outline btn-lg">
                Daftar Sekarang
              </Link>
            )}
          </div>
        </div>
        <div className="hero-image">
          <span className="hero-emoji">⚽</span>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <h2 className="features-title">
          Kenapa pilih <span className="text-purple">FutsalNow</span>?
        </h2>
        <div className="features-grid">
          <FeatureCard
            icon="⏱️"
            title="Booking Instan"
            desc="Lihat jadwal real-time dan pesan langsung dalam hitungan detik."
          />
          <FeatureCard
            icon="🔒"
            title="Aman & Terpercaya"
            desc="Pembayaran aman dan riwayat booking tersimpan rapi."
          />
          <FeatureCard
            icon="🏟️"
            title="Banyak Pilihan"
            desc="Temukan berbagai lapangan dengan harga dan fasilitas terbaik."
          />
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta-section">
        <div className="cta-box">
          <h2 className="cta-title">Siap bermain?</h2>
          <p className="cta-desc">
            Booking lapangan sekarang dan nikmati permainanmu!
          </p>
          <Link to="/services" className="btn btn-white btn-lg">
            Mulai Booking
          </Link>
        </div>
      </section>

      {/* CSS INLINE (bisa dipindahkan ke file CSS terpisah) */}
      <style>{`
        .home-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* ===== HERO ===== */
        .hero-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 3rem 0 4rem;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .hero-content {
          flex: 1 1 500px;
        }
        .hero-badge {
          display: inline-block;
          background: #f5f3ff;
          color: #7c3aed;
          padding: 0.3rem 1rem;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }
        .hero-title {
          font-size: 2.8rem;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.2;
          margin-bottom: 0.75rem;
        }
        .hero-highlight {
          color: #7c3aed;
        }
        .hero-desc {
          font-size: 1.1rem;
          color: #6b7280;
          max-width: 450px;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .hero-image {
          flex: 1 1 300px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .hero-emoji {
          font-size: 8rem;
          line-height: 1;
          opacity: 0.9;
        }

        /* ===== TOMBOL ===== */
        .btn {
          display: inline-flex;
          align-items: center;
          padding: 0.6rem 1.5rem;
          border-radius: 30px;
          font-weight: 500;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
        }
        .btn-primary {
          background: #7c3aed;
          color: white;
        }
        .btn-primary:hover {
          background: #6d28d9;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(124,58,237,0.3);
        }
        .btn-outline {
          background: transparent;
          border: 2px solid #d1d5db;
          color: #374151;
        }
        .btn-outline:hover {
          border-color: #7c3aed;
          color: #7c3aed;
          background: #f5f3ff;
        }
        .btn-white {
          background: white;
          color: #7c3aed;
        }
        .btn-white:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 24px rgba(255,255,255,0.3);
        }
        .btn-lg {
          padding: 0.8rem 2rem;
          font-size: 1rem;
        }

        /* ===== FITUR ===== */
        .features-section {
          padding: 3rem 0;
          text-align: center;
        }
        .features-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 2.5rem;
        }
        .text-purple { color: #7c3aed; }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2rem;
        }
        .feature-card {
          background: white;
          padding: 2rem 1.5rem;
          border-radius: 20px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          border: 1px solid #f3f0ff;
          transition: 0.25s;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(124,58,237,0.08);
        }
        .feature-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 0.75rem;
        }
        .feature-title {
          font-weight: 600;
          font-size: 1.1rem;
          color: #1f2937;
          margin-bottom: 0.3rem;
        }
        .feature-desc {
          color: #6b7280;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        /* ===== CTA ===== */
        .cta-section {
          padding: 3rem 0 4rem;
        }
        .cta-box {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          padding: 3rem 2rem;
          border-radius: 30px;
          text-align: center;
          color: white;
        }
        .cta-title {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .cta-desc {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
}

// ===== Komponen FeatureCard =====
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="feature-card">
      <span className="feature-icon">{icon}</span>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{desc}</p>
    </div>
  );
}
