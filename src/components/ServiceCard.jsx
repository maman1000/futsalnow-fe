import { Link } from "react-router-dom";

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n ?? 0);

export default function ServiceCard({ service }) {
  return (
    <div className="service-card">
      <div className="service-card-image">
        <span className="service-emoji">⚽</span>
      </div>

      <div className="service-card-body">
        <h3 className="service-card-title">{service.name}</h3>

        <p className="service-card-desc">
          {service.description || "Tidak ada deskripsi."}
        </p>

        <div className="service-card-footer">
          <div className="service-card-price">
            <span className="service-card-price-value">
              {formatRupiah(service.price_per_hour)}
            </span>

            <span className="service-card-unit">/ jam</span>
          </div>

          <Link to={`/booking/${service.id}`} className="service-card-btn">
            Booking
          </Link>
        </div>
      </div>

      <style>{`
        /* =========================
           SERVICE CARD
           ========================= */

        .service-card {
          display: flex;
          flex-direction: column;
          height: 100%;

          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;

          overflow: hidden;

          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);

          transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease;
        }

        .service-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.06);
        }

        /* =========================
           IMAGE / PLACEHOLDER
           ========================= */

        .service-card-image {
          height: 150px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: var(--background);

          border-bottom: 1px solid var(--border);
        }

        .service-emoji {
          font-size: 3rem;
          line-height: 1;
        }

        /* =========================
           BODY
           ========================= */

        .service-card-body {
          display: flex;
          flex-direction: column;
          flex: 1;

          padding: 18px;
        }

        .service-card-title {
          margin: 0 0 6px;

          color: var(--dark);

          font-size: 1rem;
          font-weight: 600;
          line-height: 1.4;
        }

        .service-card-desc {
          margin: 0 0 18px;

          color: var(--muted);

          font-size: 0.875rem;
          line-height: 1.5;

          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* =========================
           FOOTER
           ========================= */

        .service-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 12px;

          margin-top: auto;
          padding-top: 14px;

          border-top: 1px solid var(--border);
        }

        .service-card-price {
          display: flex;
          align-items: baseline;
          gap: 3px;

          min-width: 0;
        }

        .service-card-price-value {
          color: var(--dark);

          font-size: 1rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .service-card-unit {
          color: var(--muted);

          font-size: 0.8rem;
          font-weight: 400;
          white-space: nowrap;
        }

        /* =========================
           BUTTON
           ========================= */

        .service-card-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-height: 36px;
          padding: 8px 14px;

          background: var(--green);
          color: var(--white);

          border: 1px solid var(--green);
          border-radius: 8px;

          font-size: 0.85rem;
          font-weight: 600;

          text-decoration: none;
          white-space: nowrap;

          transition:
            background-color 0.15s ease,
            border-color 0.15s ease;
        }

        .service-card-btn:hover {
          background: #15803d;
          border-color: #15803d;
          text-decoration: none;
        }

        .service-card-btn:active {
          background: #166534;
          border-color: #166534;
        }

        /* =========================
           RESPONSIVE
           ========================= */

        @media (max-width: 480px) {
          .service-card-image {
            height: 130px;
          }

          .service-card-body {
            padding: 16px;
          }

          .service-card-footer {
            align-items: flex-end;
          }

          .service-card-price-value {
            font-size: 0.95rem;
          }

          .service-card-btn {
            padding: 8px 12px;
          }
        }
      `}</style>
    </div>
  );
}
