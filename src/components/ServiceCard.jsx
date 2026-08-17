import { Link } from "react-router-dom";

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n ?? 0);

export default function ServiceCard({ service }) {
  return (
    <div className="card service-card">
      <div className="service-card-body">
        <h3>{service.name}</h3>
        <p className="service-desc">
          {service.description || "Tidak ada deskripsi."}
        </p>
        <div className="service-meta">
          <span className="service-price">
            {formatRupiah(service.price_per_hour)}
          </span>
          {/* <span className="service-duration">{service.duration} jam</span> */}
          <span className="service-duration">Per jam</span>
        </div>
      </div>
      <Link to={`/booking/${service.id}`} className="btn btn-primary btn-block">
        Booking
      </Link>
    </div>
  );
}
