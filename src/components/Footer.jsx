import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-brand">
          <span className="footer-brand-icon">🏟️</span>
          <span className="footer-brand-name">FutsalNow</span>
          <p className="footer-brand-desc">
            Booking lapangan futsal jadi lebih mudah dan cepat.
          </p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <div className="footer-links-group">
            <h4>Menu</h4>
            <Link to="/">Beranda</Link>
            <Link to="/services">Layanan</Link>
            <Link to="/my-bookings">Booking Saya</Link>
          </div>
          <div className="footer-links-group">
            <h4>Akun</h4>
            <Link to="/login">Masuk</Link>
            <Link to="/register">Daftar</Link>
          </div>
          <div className="footer-links-group">
            <h4>Kontak</h4>
            <a href="mailto:info@futsalnow.com">info@futsalnow.com</a>
            <a href="tel:+62123456789">+62 123 456 789</a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p>&copy; {year} FutsalNow. All rights reserved.</p>
        <div className="footer-socials">
          <a href="#" aria-label="Instagram">
            📸
          </a>
          <a href="#" aria-label="Twitter">
            🐦
          </a>
          <a href="#" aria-label="YouTube">
            ▶️
          </a>
        </div>
      </div>

      {/* ===== CSS ===== */}
      <style>{`
        .footer {
          background: #1a1a2e;
          color: rgba(255, 255, 255, 0.8);
          padding: 3rem 1.5rem 1rem;
          margin-top: 3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.5fr 2fr;
          gap: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .footer-brand-icon {
          font-size: 1.8rem;
          margin-right: 0.5rem;
        }
        .footer-brand-name {
          font-size: 1.4rem;
          font-weight: 700;
          color: white;
        }
        .footer-brand-desc {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 0.5rem;
          max-width: 300px;
          line-height: 1.5;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .footer-links-group h4 {
          color: white;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          letter-spacing: 0.03em;
        }

        .footer-links-group a {
          display: block;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 0.85rem;
          padding: 0.2rem 0;
          transition: color 0.2s;
        }
        .footer-links-group a:hover {
          color: white;
          text-decoration: underline;
        }

        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .footer-socials {
          display: flex;
          gap: 0.75rem;
        }
        .footer-socials a {
          color: rgba(255, 255, 255, 0.4);
          text-decoration: none;
          font-size: 1.2rem;
          transition: color 0.2s;
        }
        .footer-socials a:hover {
          color: white;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .footer-links {
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
          .footer-brand-desc {
            max-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .footer-links {
            grid-template-columns: 1fr;
          }
          .footer {
            padding: 2rem 1rem 0.5rem;
          }
        }
      `}</style>
    </footer>
  );
}
