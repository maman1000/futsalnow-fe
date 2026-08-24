// import { Link } from "react-router-dom";

// const formatRupiah = (n) =>
//   new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//     minimumFractionDigits: 0,
//   }).format(n ?? 0);

// export default function ServiceCard({ service }) {
//   return (
//     <div className="card service-card">
//       <div className="service-card-body">
//         <h3>{service.name}</h3>
//         <p className="service-desc">
//           {service.description || "Tidak ada deskripsi."}
//         </p>
//         <div className="service-meta">
//           <span className="service-price">
//             {formatRupiah(service.price_per_hour)}
//           </span>
//           {/* <span className="service-duration">{service.duration} jam</span> */}
//           <span className="service-duration">Per jam</span>
//         </div>
//       </div>
//       <Link to={`/booking/${service.id}`} className="btn btn-primary btn-block">
//         Booking
//       </Link>
//     </div>
//   );
// }

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
          {service.description ||
            "Lapangan futsal berkualitas dengan fasilitas lengkap."}
        </p>
        <div className="service-card-footer">
          <span className="service-card-price">
            {formatRupiah(service.price_per_hour)}
            <span className="service-card-unit"> / jam</span>
          </span>
          <Link to={`/booking/${service.id}`} className="service-card-btn">
            Booking →
          </Link>
        </div>
      </div>

      <style>{`
        .service-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          border: 1px solid #f3f0ff;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(30, 41, 59, 0.06);
          border-color: #d1d5db;
        }

        .service-card-image {
          background: #f5f7fa;
          padding: 1.5rem 0;
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom: 1px solid #f0f0f0;
        }
        .service-emoji {
          font-size: 3rem;
          line-height: 1;
        }

        .service-card-body {
          padding: 1.25rem 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .service-card-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.2rem;
        }
        .service-card-desc {
          color: #6b7280;
          font-size: 0.9rem;
          line-height: 1.4;
          margin-bottom: 1rem;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .service-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          border-top: 1px solid #f3f4f6;
          padding-top: 0.75rem;
        }
        .service-card-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
        }
        .service-card-unit {
          font-size: 0.8rem;
          font-weight: 400;
          color: #6b7280;
          margin-left: 0.1rem;
        }

        .service-card-btn {
          padding: 0.3rem 1.2rem;
          background: #1e293b;
          color: white;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.85rem;
          text-decoration: none;
          transition: 0.25s;
        }
        .service-card-btn:hover {
          background: #0f172a;
          transform: translateX(3px);
        }
      `}</style>
    </div>
  );
}
