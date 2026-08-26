import { Link } from "react-router-dom";

import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="footer-brand-name">
            FutsalNow
          </Link>

          <p className="footer-brand-desc">
            Booking lapangan futsal jadi lebih mudah dan cepat.
          </p>
        </div>

        {/* Navigation */}
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

            <div className="footer-contact">
              <EnvelopeIcon />
              <span>Hubungi kami</span>
            </div>

            <div className="footer-contact">
              <MapPinIcon />
              <span>Lapangan futsal terdekat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© {year} FutsalNow. Semua hak dilindungi.</p>

        <div className="footer-bottom-links">
          <Link to="/">Beranda</Link>
          <span>•</span>
          <Link to="/services">Layanan</Link>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--dark);
          color: var(--white);
          margin-top: 48px;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px 40px;

          display: grid;
          grid-template-columns: 1.2fr 2fr;
          gap: 64px;

          border-bottom: 1px solid rgba(226, 232, 240, 0.12);
        }

        /* =========================
           BRAND
        ========================= */

        .footer-brand-name {
          display: inline-block;

          color: var(--white);
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.02em;

          text-decoration: none;
        }

        .footer-brand-name:hover {
          color: #86efac;
        }

        .footer-brand-desc {
          max-width: 320px;
          margin: 10px 0 0;

          color: #94a3b8;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        /* =========================
           LINKS
        ========================= */

        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .footer-links-group h4 {
          margin: 0 0 14px;

          color: var(--white);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .footer-links-group a {
          display: block;

          width: fit-content;
          margin-bottom: 9px;

          color: #94a3b8;
          font-size: 0.85rem;
          text-decoration: none;

          transition: color 0.15s ease;
        }

        .footer-links-group a:hover {
          color: var(--white);
        }

        /* =========================
           CONTACT
        ========================= */

        .footer-contact {
          display: flex;
          align-items: center;
          gap: 8px;

          margin-bottom: 10px;

          color: #94a3b8;
          font-size: 0.85rem;
        }

        .footer-contact svg {
          width: 17px;
          height: 17px;
          flex-shrink: 0;

          color: #94a3b8;
          stroke-width: 1.8;
        }

        /* =========================
           BOTTOM
        ========================= */

        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;

          padding: 18px 24px;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;

          color: #64748b;
          font-size: 0.8rem;
        }

        .footer-bottom p {
          margin: 0;
        }

        .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer-bottom-links a {
          color: #64748b;
          text-decoration: none;
        }

        .footer-bottom-links a:hover {
          color: var(--white);
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr;
            gap: 32px;

            padding: 40px 20px 32px;
          }

          .footer-links {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }

          .footer-bottom {
            padding: 16px 20px;

            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .footer-container {
            padding: 32px 16px 28px;
          }

          .footer-links {
            grid-template-columns: 1fr 1fr;
            gap: 28px 20px;
          }

          .footer-links-group:last-child {
            grid-column: 1 / -1;
          }

          .footer-bottom {
            padding: 16px;
          }
        }
      `}</style>
    </footer>
  );
}
