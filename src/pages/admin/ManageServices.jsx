// import { useCallback, useEffect, useState } from "react";
// import {
//   getServices,
//   createService,
//   updateService,
//   deleteService,
// } from "../../api/bookingApi";

// const formatRupiah = (n) =>
//   new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//     minimumFractionDigits: 0,
//   }).format(n ?? 0);

// const emptyForm = {
//   name: "",
//   description: "",
//   price_per_hour: "",
//   status: "available",
// };

// export default function ManageServices() {
//   const [services, setServices] = useState([]);
//   const [form, setForm] = useState(emptyForm);
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [info, setInfo] = useState("");

//   const fetchServices = useCallback(async () => {
//     try {
//       setLoading(true);

//       const res = await getServices();

//       // Laravel paginate() mengembalikan object dengan array di .data
//       setServices(res.data.data || []);
//     } catch (err) {
//       setError(err.response?.data?.message || "Gagal memuat lapangan.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchServices();
//   }, [fetchServices]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const startEdit = (s) => {
//     setEditId(s.id);

//     setForm({
//       name: s.name || "",
//       description: s.description || "",
//       price_per_hour: s.price_per_hour ?? "",
//       status: s.status || "available",
//     });

//     setError("");
//     setInfo("");

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   const resetForm = () => {
//     setEditId(null);
//     setForm(emptyForm);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setInfo("");
//     setSubmitting(true);

//     const payload = {
//       name: form.name,
//       description: form.description || null,
//       price_per_hour: Number(form.price_per_hour),
//       status: form.status,
//     };

//     try {
//       if (editId) {
//         await updateService(editId, payload);
//         setInfo("Lapangan berhasil diperbarui.");
//       } else {
//         await createService(payload);
//         setInfo("Lapangan baru berhasil ditambahkan.");
//       }

//       resetForm();
//       await fetchServices();
//     } catch (err) {
//       const data = err.response?.data;

//       const firstFieldError = data?.errors
//         ? Object.values(data.errors)[0]?.[0]
//         : null;

//       setError(firstFieldError || data?.message || "Gagal menyimpan lapangan.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleToggleStatus = async (s) => {
//     setError("");
//     setInfo("");

//     const newStatus = s.status === "available" ? "maintenance" : "available";

//     try {
//       await updateService(s.id, {
//         status: newStatus,
//       });

//       setInfo(
//         newStatus === "available"
//           ? "Lapangan berhasil diaktifkan."
//           : "Lapangan berhasil dinonaktifkan.",
//       );

//       await fetchServices();
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Gagal mengubah status lapangan.",
//       );
//     }
//   };

//   const handleDelete = async (s) => {
//     if (!window.confirm(`Hapus lapangan "${s.name}"?`)) {
//       return;
//     }

//     setError("");
//     setInfo("");

//     try {
//       const res = await deleteService(s.id);

//       setInfo(res.data?.message || "Lapangan berhasil dihapus.");

//       if (editId === s.id) {
//         resetForm();
//       }

//       await fetchServices();
//     } catch (err) {
//       setError(err.response?.data?.message || "Gagal menghapus lapangan.");
//     }
//   };

//   return (
//     <div className="container">
//       <div className="page-header">
//         <h2>Kelola Lapangan Futsal</h2>
//         <p className="muted">Tambah, ubah, nonaktifkan, atau hapus lapangan.</p>
//       </div>

//       {error && <div className="alert alert-error">{error}</div>}

//       {info && <div className="alert alert-success">{info}</div>}

//       <form className="card form-card" onSubmit={handleSubmit}>
//         <h3>{editId ? `Edit Lapangan #${editId}` : "Tambah Lapangan Baru"}</h3>

//         <div className="form-grid">
//           <div>
//             <label className="form-label">Nama Lapangan</label>

//             <input
//               type="text"
//               name="name"
//               className="form-input"
//               value={form.name}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div>
//             <label className="form-label">Harga per Jam (Rp)</label>

//             <input
//               type="number"
//               name="price_per_hour"
//               className="form-input"
//               value={form.price_per_hour}
//               onChange={handleChange}
//               min="0"
//               required
//             />
//           </div>

//           <div>
//             <label className="form-label">Status</label>

//             <select
//               name="status"
//               className="form-input"
//               value={form.status}
//               onChange={handleChange}
//             >
//               <option value="available">Tersedia</option>

//               <option value="maintenance">Maintenance</option>
//             </select>
//           </div>
//         </div>

//         <label className="form-label">Deskripsi</label>

//         <textarea
//           name="description"
//           className="form-input"
//           rows="2"
//           value={form.description}
//           onChange={handleChange}
//         />

//         <div className="form-actions">
//           <button
//             type="submit"
//             className="btn btn-primary"
//             disabled={submitting}
//           >
//             {submitting
//               ? "Menyimpan..."
//               : editId
//                 ? "Simpan Perubahan"
//                 : "Tambah Lapangan"}
//           </button>

//           {editId && (
//             <button
//               type="button"
//               className="btn btn-outline"
//               onClick={resetForm}
//             >
//               Batal Edit
//             </button>
//           )}
//         </div>
//       </form>

//       {loading ? (
//         <p className="page-loading">Memuat lapangan...</p>
//       ) : services.length === 0 ? (
//         <p className="muted">Belum ada lapangan.</p>
//       ) : (
//         <div className="table-wrapper">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Nama Lapangan</th>
//                 <th>Harga / Jam</th>
//                 <th>Status</th>
//                 <th>Aksi</th>
//               </tr>
//             </thead>

//             <tbody>
//               {services.map((s) => (
//                 <tr key={s.id}>
//                   <td>{s.id}</td>

//                   <td>{s.name}</td>

//                   <td>{formatRupiah(s.price_per_hour)}</td>

//                   <td>
//                     <span
//                       className={`badge ${
//                         s.status === "available" ? "badge-done" : "badge-batal"
//                       }`}
//                     >
//                       {s.status === "available" ? "Tersedia" : "Maintenance"}
//                     </span>
//                   </td>

//                   <td className="table-actions">
//                     <button
//                       className="btn btn-outline btn-sm"
//                       onClick={() => startEdit(s)}
//                     >
//                       Edit
//                     </button>

//                     <button
//                       className="btn btn-accent btn-sm"
//                       onClick={() => handleToggleStatus(s)}
//                     >
//                       {s.status === "available"
//                         ? "Set Maintenance"
//                         : "Aktifkan"}
//                     </button>

//                     <button
//                       className="btn btn-danger btn-sm"
//                       onClick={() => handleDelete(s)}
//                     >
//                       Hapus
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

import { useCallback, useEffect, useState } from "react";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../../api/bookingApi";

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n ?? 0);

const emptyForm = {
  name: "",
  description: "",
  price_per_hour: "",
  status: "available",
};

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getServices();
      setServices(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat lapangan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const startEdit = (s) => {
    setEditId(s.id);
    setForm({
      name: s.name || "",
      description: s.description || "",
      price_per_hour: s.price_per_hour ?? "",
      status: s.status || "available",
    });
    setError("");
    setInfo("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);

    const payload = {
      name: form.name,
      description: form.description || null,
      price_per_hour: Number(form.price_per_hour),
      status: form.status,
    };

    try {
      if (editId) {
        await updateService(editId, payload);
        setInfo("Lapangan berhasil diperbarui.");
      } else {
        await createService(payload);
        setInfo("Lapangan baru berhasil ditambahkan.");
      }
      resetForm();
      await fetchServices();
    } catch (err) {
      const data = err.response?.data;
      const firstFieldError = data?.errors
        ? Object.values(data.errors)[0]?.[0]
        : null;
      setError(firstFieldError || data?.message || "Gagal menyimpan lapangan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (s) => {
    setError("");
    setInfo("");
    const newStatus = s.status === "available" ? "maintenance" : "available";
    try {
      await updateService(s.id, { status: newStatus });
      setInfo(
        newStatus === "available"
          ? "Lapangan berhasil diaktifkan."
          : "Lapangan berhasil dinonaktifkan.",
      );
      await fetchServices();
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengubah status lapangan.",
      );
    }
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`Hapus lapangan "${s.name}"?`)) return;
    setError("");
    setInfo("");
    try {
      const res = await deleteService(s.id);
      setInfo(res.data?.message || "Lapangan berhasil dihapus.");
      if (editId === s.id) resetForm();
      await fetchServices();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menghapus lapangan.");
    }
  };

  return (
    <div className="manage-services-page">
      <div className="page-header">
        <h1 className="page-title">⚽ Kelola Lapangan Futsal</h1>
        <p className="page-subtitle">
          Tambah, ubah, nonaktifkan, atau hapus lapangan.
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {info && <div className="alert alert-success">{info}</div>}

      {/* Form */}
      <div className="form-card">
        <div className="form-header">
          <span className="form-icon">{editId ? "✏️" : "➕"}</span>
          <h3 className="form-title">
            {editId ? `Edit Lapangan #${editId}` : "Tambah Lapangan Baru"}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="form-label">Nama Lapangan</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Lapangan Futsal A"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Harga per Jam (Rp)</label>
            <input
              type="number"
              name="price_per_hour"
              className="form-input"
              value={form.price_per_hour}
              onChange={handleChange}
              placeholder="50000"
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-input"
              value={form.status}
              onChange={handleChange}
            >
              <option value="available">Tersedia</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="form-group full-width">
            <label className="form-label">Deskripsi</label>
            <textarea
              name="description"
              className="form-input"
              rows="2"
              value={form.description}
              onChange={handleChange}
              placeholder="Deskripsi singkat tentang lapangan (opsional)"
            />
          </div>
          <div className="form-actions full-width">
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting
                ? "Menyimpan..."
                : editId
                  ? "Simpan Perubahan"
                  : "Tambah Lapangan"}
            </button>
            {editId && (
              <button
                type="button"
                className="btn-cancel-edit"
                onClick={resetForm}
              >
                Batal Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Daftar Lapangan */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Memuat lapangan...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="empty-state">
          <p>😕 Belum ada lapangan. Yuk tambahkan!</p>
        </div>
      ) : (
        <div className="services-grid">
          {services.map((s) => (
            <div key={s.id} className="service-card">
              <div className="service-card-header">
                <span className="service-emoji">⚽</span>
                <span className="service-name">{s.name}</span>
                <span
                  className={`badge ${s.status === "available" ? "badge-active" : "badge-inactive"}`}
                >
                  {s.status === "available" ? "Tersedia" : "Maintenance"}
                </span>
              </div>
              <div className="service-card-body">
                <div className="service-price">
                  {formatRupiah(s.price_per_hour)} / jam
                </div>
                <div className="service-desc">{s.description || "—"}</div>
              </div>
              <div className="service-card-actions">
                <button className="btn-edit" onClick={() => startEdit(s)}>
                  ✏️ Edit
                </button>
                <button
                  className="btn-toggle"
                  onClick={() => handleToggleStatus(s)}
                >
                  {s.status === "available"
                    ? "🔧 Set Maintenance"
                    : "✅ Aktifkan"}
                </button>
                <button className="btn-delete" onClick={() => handleDelete(s)}>
                  🗑️ Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CSS Inline */}
      <style>{`
        .manage-services-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .page-header {
          margin-bottom: 2rem;
        }
        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }
        .page-subtitle {
          color: #6b7280;
          font-size: 1rem;
        }

        .alert {
          padding: 0.75rem 1rem;
          border-radius: 14px;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          border-left: 4px solid;
        }
        .alert-error {
          background: #fef2f2;
          border-color: #dc2626;
          color: #991b1b;
        }
        .alert-success {
          background: #f0fdf4;
          border-color: #22c55e;
          color: #166534;
        }

        /* Form Card */
        .form-card {
          background: white;
          border-radius: 24px;
          padding: 2rem 2rem 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid #f3f0ff;
          margin-bottom: 2.5rem;
        }
        .form-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .form-icon {
          font-size: 1.8rem;
        }
        .form-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .full-width {
          grid-column: 1 / -1;
        }
        .form-label {
          font-weight: 500;
          color: #374151;
          font-size: 0.9rem;
        }
        .form-input {
          padding: 0.6rem 0.8rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-size: 0.95rem;
          background: #fafafa;
          transition: 0.2s;
          width: 100%;
        }
        .form-input:focus {
          outline: none;
          border-color: #7c3aed;
          background: white;
          box-shadow: 0 0 0 4px rgba(124,58,237,0.08);
        }
        .form-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          margin-top: 0.5rem;
        }
        .btn-submit {
          padding: 0.6rem 1.5rem;
          background: #7c3aed;
          color: white;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-submit:hover:not(:disabled) {
          background: #6d28d9;
          transform: scale(1.02);
          box-shadow: 0 8px 24px rgba(124,58,237,0.25);
        }
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-cancel-edit {
          padding: 0.6rem 1.5rem;
          background: #f3f4f6;
          border: none;
          border-radius: 30px;
          font-weight: 500;
          color: #4b5563;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-cancel-edit:hover {
          background: #e5e7eb;
        }

        /* Loading & Empty */
        .loading-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 4rem 0;
          color: #6b7280;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f0ff;
          border-top: 4px solid #7c3aed;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 1rem;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Service Cards Grid */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }
        .service-card {
          background: white;
          border-radius: 20px;
          padding: 1.25rem 1.5rem 1.25rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          border: 1px solid #f3f0ff;
          transition: 0.25s;
          display: flex;
          flex-direction: column;
        }
        .service-card:hover {
          box-shadow: 0 8px 28px rgba(124,58,237,0.08);
          border-color: #d4c4ff;
          transform: translateY(-3px);
        }
        .service-card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.75rem;
        }
        .service-emoji {
          font-size: 1.8rem;
        }
        .service-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 1.1rem;
          flex: 1;
        }
        .badge {
          padding: 0.2rem 0.7rem;
          border-radius: 30px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        .badge-active {
          background: #d1fae5;
          color: #065f46;
        }
        .badge-inactive {
          background: #fee2e2;
          color: #991b1b;
        }
        .service-card-body {
          flex: 1;
          margin-bottom: 1rem;
        }
        .service-price {
          font-weight: 600;
          color: #7c3aed;
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }
        .service-desc {
          font-size: 0.85rem;
          color: #6b7280;
          line-height: 1.4;
        }
        .service-card-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
          border-top: 1px solid #f3f4f6;
          padding-top: 0.75rem;
        }
        .service-card-actions button {
          padding: 0.3rem 0.8rem;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: 0.15s;
          background: #f3f4f6;
          color: #374151;
        }
        .btn-edit:hover {
          background: #e0e7ff;
          color: #1e40af;
        }
        .btn-toggle:hover {
          background: #fef3c7;
          color: #92400e;
        }
        .btn-delete:hover {
          background: #fee2e2;
          color: #991b1b;
        }

        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .form-card {
            padding: 1.5rem 1rem;
          }
          .service-card {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
