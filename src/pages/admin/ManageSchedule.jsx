import { useCallback, useEffect, useState } from "react";
import {
  getServices,
  getAllSchedules,
  createSchedule,
  setScheduleAvailability,
  updateSchedule,
} from "../../api/bookingApi";

const namaHari = (day) => {
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  return days[Number(day)] ?? "-";
};
const formatJam = (t) => (t || "").slice(0, 5);

export default function ManageSchedule() {
  const [services, setServices] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [filterService, setFilterService] = useState("");
  const [form, setForm] = useState({
    service_id: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editForm, setEditForm] = useState({ start_time: "", end_time: "" });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: currentPage };
      if (filterService) params.service_id = filterService;

      const [resServices, resSchedules] = await Promise.all([
        getServices(),
        getAllSchedules(params),
      ]);
      setServices(resServices.data?.data || []);
      setSchedules(resSchedules.data?.data || []);
      setPagination({
        current_page: resSchedules.data.current_page,
        last_page: resSchedules.data.last_page,
        per_page: resSchedules.data.per_page,
        total: resSchedules.data.total,
      });
    } catch (err) {
      console.error("FETCH SCHEDULE ERROR:", err);
      setError(err.response?.data?.message || "Gagal memuat data jadwal.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterService]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const goToPage = (page) => {
    if (page < 1 || page > pagination.last_page) return;
    setCurrentPage(page);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);
    try {
      await createSchedule({
        service_id: Number(form.service_id),
        day_of_week: Number(form.day_of_week),
        start_time: form.start_time,
        end_time: form.end_time,
        is_active: true,
      });
      setInfo("Jadwal baru berhasil ditambahkan.");
      setForm({ ...form, start_time: "", end_time: "" });
      await fetchData();
    } catch (err) {
      const data = err.response?.data;
      const firstFieldError = data?.errors
        ? Object.values(data.errors)[0]?.[0]
        : null;
      setError(firstFieldError || data?.message || "Gagal menambah jadwal.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (s) => {
    setError("");
    try {
      await setScheduleAvailability(s.id, !s.is_active);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengubah ketersediaan.");
    }
  };

  const openEditModal = (schedule) => {
    setEditingSchedule(schedule);
    setEditForm({
      start_time: schedule.start_time.slice(0, 5),
      end_time: schedule.end_time.slice(0, 5),
    });
  };

  const closeEditModal = () => {
    setEditingSchedule(null);
    setEditForm({ start_time: "", end_time: "" });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    try {
      await updateSchedule(editingSchedule.id, editForm);
      setInfo("Jadwal berhasil diperbarui.");
      closeEditModal();
      await fetchData();
    } catch (err) {
      const data = err.response?.data;
      const firstFieldError = data?.errors
        ? Object.values(data.errors)[0]?.[0]
        : null;
      setError(firstFieldError || data?.message || "Gagal memperbarui jadwal.");
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterService(value);
    setCurrentPage(1);
  };

  return (
    <div className="page-content manage-schedule-page">
      <div className="page-header">
        <h1 className="page-title">Kelola Jadwal</h1>
        <p className="page-subtitle">
          Tambah slot jadwal dan atur ketersediaannya.
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {info && <div className="alert alert-success">{info}</div>}

      {/* Form Tambah Jadwal */}
      <div className="form-card">
        <h2 className="form-title">
          {submitting ? "Menyimpan..." : "Tambah Jadwal Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="schedule-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Layanan</label>
              <select
                name="service_id"
                className="form-input"
                value={form.service_id}
                onChange={handleChange}
                required
              >
                <option value="">— Pilih layanan —</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Hari</label>
              <select
                name="day_of_week"
                className="form-input"
                value={form.day_of_week}
                onChange={handleChange}
                required
              >
                <option value="">— Pilih hari —</option>
                <option value="0">Senin</option>
                <option value="1">Selasa</option>
                <option value="2">Rabu</option>
                <option value="3">Kamis</option>
                <option value="4">Jumat</option>
                <option value="5">Sabtu</option>
                <option value="6">Minggu</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Jam Mulai</label>
              <input
                type="time"
                name="start_time"
                className="form-input"
                value={form.start_time}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Jam Selesai</label>
              <input
                type="time"
                name="end_time"
                className="form-input"
                value={form.end_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? "Menyimpan..." : "Tambah Jadwal →"}
            </button>
          </div>
        </form>
      </div>

      {/* Filter */}
      <div className="filter-bar">
        <div className="filter-group">
          <label className="filter-label">Filter layanan:</label>
          <select
            className="filter-select"
            value={filterService}
            onChange={handleFilterChange}
          >
            <option value="">Semua layanan</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        {filterService && (
          <button className="btn-reset" onClick={() => setFilterService("")}>
            Reset Filter
          </button>
        )}
      </div>

      {/* Daftar Jadwal */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Memuat jadwal...</p>
        </div>
      ) : schedules.length === 0 ? (
        <div className="empty-state">
          <p>😕 Belum ada jadwal.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table-proka">
            <thead>
              <tr>
                <th>#</th>
                <th>Layanan</th>
                <th>Hari</th>
                <th>Jam</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s, index) => (
                <tr key={s.id}>
                  <td>
                    {(pagination.current_page - 1) * pagination.per_page +
                      index +
                      1}
                  </td>
                  <td>{s.service?.name || "-"}</td>
                  <td>{namaHari(s.day_of_week)}</td>
                  <td>
                    {formatJam(s.start_time)}–{formatJam(s.end_time)}
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${s.is_active ? "active" : "inactive"}`}
                    >
                      {s.is_active ? "Tersedia" : "Penuh"}
                    </span>
                  </td>
                  <td className="table-actions">
                    <button
                      className="btn-edit-sm"
                      onClick={() => openEditModal(s)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-toggle-sm"
                      onClick={() => handleToggle(s)}
                    >
                      {s.is_active ? "Tutup" : "Buka"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.last_page > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => goToPage(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
          >
            ← Sebelumnya
          </button>
          <span className="page-info">
            {pagination.current_page} / {pagination.last_page}
          </span>
          <button
            className="page-btn"
            onClick={() => goToPage(pagination.current_page + 1)}
            disabled={pagination.current_page === pagination.last_page}
          >
            Selanjutnya →
          </button>
        </div>
      )}

      {/* MODAL EDIT */}
      {editingSchedule && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Jadwal</h3>
              <button className="modal-close" onClick={closeEditModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-sub">
                #{editingSchedule.id} ·{" "}
                {editingSchedule.service?.name || "Layanan"}
              </p>
              <form onSubmit={handleEditSubmit} className="modal-form">
                <div className="form-group">
                  <label className="form-label">Jam Mulai</label>
                  <input
                    type="time"
                    name="start_time"
                    className="form-input"
                    value={editForm.start_time}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Jam Selesai</label>
                  <input
                    type="time"
                    name="end_time"
                    className="form-input"
                    value={editForm.end_time}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={closeEditModal}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn-modal-save">
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===== CSS ===== */}
      <style>{`
        .manage-schedule-page {
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
          padding: 1.75rem 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid #f3f0ff;
          margin-bottom: 2rem;
        }
        .form-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .form-label {
          font-weight: 500;
          color: #374151;
          font-size: 0.9rem;
        }
        .form-input {
          padding: 0.6rem 0.9rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 14px;
          font-size: 0.95rem;
          transition: 0.2s;
          background: #fafafa;
          width: 100%;
        }
        .form-input:focus {
          outline: none;
          border-color: #1e293b;
          background: white;
          box-shadow: 0 0 0 4px rgba(30,41,59,0.08);
        }
        .form-actions {
          margin-top: 1.5rem;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-submit {
          padding: 0.6rem 2rem;
          background: #1e293b;
          color: white;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-submit:hover:not(:disabled) {
          background: #0f172a;
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(30,41,59,0.25);
        }
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Filter */
        .filter-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem 1.5rem;
          background: white;
          padding: 0.75rem 1.5rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          border: 1px solid #f3f0ff;
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .filter-label {
          font-weight: 500;
          color: #374151;
          font-size: 0.85rem;
        }
        .filter-select {
          padding: 0.4rem 0.8rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.9rem;
          background: #fafafa;
          transition: 0.2s;
        }
        .filter-select:focus {
          outline: none;
          border-color: #1e293b;
          box-shadow: 0 0 0 3px rgba(30,41,59,0.08);
        }
        .btn-reset {
          padding: 0.3rem 1rem;
          background: #f3f4f6;
          border: none;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 500;
          color: #4b5563;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-reset:hover {
          background: #e5e7eb;
        }

        /* Loading & Empty */
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
          width: 40px;
          height: 40px;
          border: 4px solid #f3f0ff;
          border-top: 4px solid #1e293b;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 1rem;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
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

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        .status-active {
          background: #d4edda;
          color: #155724;
        }
        .status-inactive {
          background: #f8d7da;
          color: #721c24;
        }

        /* ===== PAGINATION ===== */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
          margin-top: 2rem;
        }
        .page-btn {
          padding: 0.4rem 1rem;
          border-radius: 30px;
          border: 1.5px solid #e5e7eb;
          background: white;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          transition: 0.2s;
        }
        .page-btn:hover:not(:disabled) {
          background: #f5f3ff;
          border-color: #1e293b;
        }
        .page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .page-info {
          font-weight: 500;
          color: #6b7280;
          font-size: 0.9rem;
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
        .modal-form .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .modal-form .form-group .form-label {
          font-weight: 500;
          color: #374151;
          font-size: 0.85rem;
        }
        .modal-form .form-group .form-input {
          padding: 0.5rem 0.8rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.95rem;
          background: #fafafa;
          transition: 0.2s;
        }
        .modal-form .form-group .form-input:focus {
          outline: none;
          border-color: #1e293b;
          background: white;
          box-shadow: 0 0 0 3px rgba(30,41,59,0.08);
        }
        .modal-actions {
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

        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .filter-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
            padding: 1rem;
          }
          .filter-group {
            flex-wrap: wrap;
          }
          .modal-form {
            grid-template-columns: 1fr;
          }
          .modal-actions {
            justify-content: center;
          }
          .table-proka {
            font-size: 0.8rem;
          }
          .table-proka th,
          .table-proka td {
            padding: 8px 10px;
          }
        }
      `}</style>
    </div>
  );
}
