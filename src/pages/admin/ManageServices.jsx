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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (service = null) => {
    if (service) {
      setEditId(service.id);
      setForm({
        name: service.name || "",
        description: service.description || "",
        price_per_hour: service.price_per_hour ?? "",
        status: service.status || "available",
      });
    } else {
      setEditId(null);
      setForm(emptyForm);
    }
    setError("");
    setInfo("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setForm(emptyForm);
    setError("");
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
      closeModal();
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
      if (editId === s.id) closeModal();
      await fetchServices();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menghapus lapangan.");
    }
  };

  return (
    <div className="page-content manage-services-page">
      <div className="page-header">
        <h1 className="page-title">Kelola Lapangan Futsal</h1>
        <p className="page-subtitle">
          Tambah, ubah, nonaktifkan, atau hapus lapangan.
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {info && <div className="alert alert-success">{info}</div>}

      {/* ===== TOMBOL TAMBAH ===== */}
      <div className="action-bar">
        <button className="btn-add" onClick={() => openModal()}>
          Tambah Lapangan
        </button>
      </div>

      {/* ===== TABEL PROKA ===== */}
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
        <div className="table-wrapper">
          <table className="table-proka">
            <thead>
              <tr>
                <th>#</th>
                <th>Nama Lapangan</th>
                <th>Harga / Jam</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s, index) => (
                <tr key={s.id}>
                  <td>{index + 1}</td>
                  <td>{s.name}</td>
                  <td>{formatRupiah(s.price_per_hour)}</td>
                  <td>
                    <span
                      className={`status-badge status-${s.status === "available" ? "available" : "maintenance"}`}
                    >
                      {s.status === "available" ? "Tersedia" : "Maintenance"}
                    </span>
                  </td>
                  <td className="table-actions">
                    <button
                      className="btn-edit-sm"
                      onClick={() => openModal(s)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-toggle-sm"
                      onClick={() => handleToggleStatus(s)}
                    >
                      {s.status === "available"
                        ? "Set Maintenance"
                        : "Aktifkan"}
                    </button>
                    <button
                      className="btn-delete-sm"
                      onClick={() => handleDelete(s)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== MODAL ===== */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId ? `Edit Lapangan` : "Tambah Lapangan Baru"}</h3>
              <button className="modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              {editId && <p className="modal-sub">Lapangan #{editId}</p>}
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group full-width">
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
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={closeModal}
                    disabled={submitting}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn-modal-save"
                    disabled={submitting}
                  >
                    {submitting ? "Menyimpan..." : editId ? "Simpan" : "Tambah"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===== CSS ===== */}
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

        .action-bar {
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: flex-end;
        }
        .btn-add {
          padding: 0.6rem 1.5rem;
          background: #1e293b;
          color: white;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-add:hover {
          background: #0f172a;
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(30,41,59,0.25);
        }

        /* ===== TABEL PROKA ===== */
        .table-wrapper {
          overflow-x: auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
          border: 1px solid #f0f0f0;
        }
        .table-proka {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .table-proka thead {
          background: #1a1a2e;
          color: #fff;
        }
        .table-proka th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .table-proka td {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
          vertical-align: middle;
        }
        .table-proka tbody tr:hover {
          background: #f8f9fc;
        }

        .table-actions {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .btn-edit-sm {
          padding: 4px 12px;
          border: none;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 500;
          background: #dbeafe;
          color: #1e40af;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-edit-sm:hover {
          background: #bfdbfe;
        }

        .btn-toggle-sm {
          padding: 4px 12px;
          border: none;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 500;
          background: #fef3c7;
          color: #92400e;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-toggle-sm:hover {
          background: #fde68a;
        }

        .btn-delete-sm {
          padding: 4px 12px;
          border: none;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 500;
          background: #fee2e2;
          color: #991b1b;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-delete-sm:hover {
          background: #fecaca;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        .status-available {
          background: #d4edda;
          color: #155724;
        }
        .status-maintenance {
          background: #f8d7da;
          color: #721c24;
        }

        /* ===== LOADING & EMPTY ===== */
        .loading-state,
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 0;
          color: #6b7280;
        }
        .spinner {
          width: 36px;
          height: 36px;
          border: 4px solid #f3f0ff;
          border-top: 4px solid #1e293b;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 1rem;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ===== MODAL ===== */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          padding: 1rem;
        }
        .modal-content {
          background: white;
          border-radius: 16px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          overflow: hidden;
          animation: modalIn 0.25s ease;
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem 1.5rem;
          border-bottom: 1px solid #f0f0f0;
          background: #fafafa;
        }
        .modal-header h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
        .modal-close {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #6b7280;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          transition: 0.2s;
        }
        .modal-close:hover {
          background: #f3f4f6;
        }
        .modal-body {
          padding: 1.5rem;
        }
        .modal-sub {
          color: #6b7280;
          font-size: 0.85rem;
          margin-bottom: 1.2rem;
        }
        .modal-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem 1.5rem;
        }
        .modal-form .full-width {
          grid-column: 1 / -1;
        }
        .modal-form .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .modal-form .form-label {
          font-weight: 500;
          color: #374151;
          font-size: 0.85rem;
        }
        .modal-form .form-input {
          padding: 0.5rem 0.8rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.95rem;
          background: #fafafa;
          transition: 0.2s;
          width: 100%;
        }
        .modal-form .form-input:focus {
          outline: none;
          border-color: #1e293b;
          background: white;
          box-shadow: 0 0 0 3px rgba(30,41,59,0.08);
        }
        .modal-actions {
          grid-column: 1 / -1;
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
          justify-content: flex-end;
        }
        .btn-modal-cancel {
          padding: 0.5rem 1.5rem;
          background: #f3f4f6;
          border: none;
          border-radius: 30px;
          font-weight: 500;
          color: #4b5563;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-modal-cancel:hover {
          background: #e5e7eb;
        }
        .btn-modal-save {
          padding: 0.5rem 1.5rem;
          background: #1e293b;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-modal-save:hover {
          background: #0f172a;
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(30,41,59,0.25);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 640px) {
          .modal-form {
            grid-template-columns: 1fr;
          }
          .modal-actions {
            justify-content: center;
          }
          .action-bar {
            justify-content: stretch;
          }
          .btn-add {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
