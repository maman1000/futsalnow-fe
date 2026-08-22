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
  }, [currentPage, filterService]); // ← tambahkan filterService sebagai dependency

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
    setCurrentPage(1); // reset ke halaman 1
  };

  return (
    <div className="page-content manage-schedule-page">
      <div className="page-header">
        <h1 className="page-title">📅 Kelola Jadwal</h1>
        <p className="page-subtitle">
          Tambah slot jadwal dan atur ketersediaannya.
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {info && <div className="alert alert-success">{info}</div>}

      {/* Form Tambah Jadwal */}
      <div className="form-card">
        <h2 className="form-title">
          {submitting ? "⏳ Menyimpan..." : "➕ Tambah Jadwal Baru"}
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
            // onChange={(e) => setFilterService(e.target.value)}
            onChange={handleFilterChange} // ← pakai fungsi baru
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
        <div className="schedule-list">
          {schedules.map((s) => (
            <div key={s.id} className="schedule-card">
              <div className="schedule-info">
                <div className="schedule-main">
                  <span className="schedule-id">#{s.id}</span>
                  <span className="schedule-service">
                    {s.service?.name ||
                      services.find((v) => v.id === s.service_id)?.name ||
                      `#${s.service_id}`}
                  </span>
                </div>
                <div className="schedule-details">
                  <span className="schedule-day">
                    {namaHari(s.day_of_week)}
                  </span>
                  <span className="schedule-time">
                    {formatJam(s.start_time)} – {formatJam(s.end_time)}
                  </span>
                </div>
              </div>
              <div className="schedule-meta">
                <span
                  className={`badge ${s.is_active ? "badge-active" : "badge-inactive"}`}
                >
                  {s.is_active ? "Tersedia" : "Penuh"}
                </span>
                <button className="btn-edit" onClick={() => openEditModal(s)}>
                  ✏️ Edit
                </button>
                <button
                  className={`btn-toggle ${s.is_active ? "btn-close" : "btn-open"}`}
                  onClick={() => handleToggle(s)}
                >
                  {s.is_active ? "Tutup Slot" : "Buka Slot"}
                </button>
              </div>
            </div>
          ))}
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
            <h3>✏️ Edit Jadwal</h3>
            <p className="modal-sub">
              #{editingSchedule.id} ·{" "}
              {editingSchedule.service?.name || "Layanan"}
            </p>
            <form onSubmit={handleEditSubmit}>
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
                  className="btn-cancel-modal"
                  onClick={closeEditModal}
                >
                  Batal
                </button>
                <button type="submit" className="btn-save-modal">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          border-color: #7c3aed;
          background: white;
          box-shadow: 0 0 0 4px rgba(124,58,237,0.08);
        }

        .form-actions {
          margin-top: 1.5rem;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-submit {
          padding: 0.6rem 2rem;
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
          box-shadow: 0 4px 12px rgba(124,58,237,0.25);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-edit {
          padding: 0.3rem 1rem;
          border-radius: 30px;
          font-weight: 500;
          font-size: 0.8rem;
          border: none;
          cursor: pointer;
          transition: 0.2s;
          background: #e0e7ff;
          color: #3730a3;
        }
        .btn-edit:hover {
          background: #c7d2fe;
          transform: scale(1.04);
        }

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
          border-color: #7c3aed;
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

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }
        .modal-content {
          background: white;
          border-radius: 24px;
          padding: 2rem 2.5rem;
          max-width: 420px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        .modal-content h3 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }
        .modal-sub {
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
        .modal-content .form-group {
          margin-bottom: 1rem;
        }
        .modal-content .form-group label {
          display: block;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.3rem;
          font-size: 0.9rem;
        }
        .modal-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        .modal-actions button {
          flex: 1;
          padding: 0.6rem;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.9rem;
          border: none;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-cancel-modal {
          background: #f3f4f6;
          color: #374151;
        }
        .btn-cancel-modal:hover {
          background: #e5e7eb;
        }
        .btn-save-modal {
          background: #7c3aed;
          color: white;
        }
        .btn-save-modal:hover {
          background: #6d28d9;
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(124,58,237,0.3);
        }

        /* Filter Bar */
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
          border-color: #7c3aed;
          background: white;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.08);
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
          border-top: 4px solid #7c3aed;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Schedule List Cards */
        .schedule-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .schedule-card {
          background: white;
          border-radius: 20px;
          padding: 1rem 1.5rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          border: 1px solid #f3f0ff;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          transition: 0.2s;
        }

        .schedule-card:hover {
          box-shadow: 0 8px 24px rgba(124,58,237,0.08);
          border-color: #d4c4ff;
        }

        .schedule-info {
          flex: 1 1 60%;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .schedule-main {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .schedule-id {
          font-weight: 600;
          color: #6b7280;
          font-size: 0.85rem;
        }

        .schedule-service {
          font-weight: 600;
          color: #1f2937;
          font-size: 1rem;
        }

        .schedule-details {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1.5rem;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .schedule-day {
          font-weight: 500;
          color: #374151;
        }

        .schedule-time {
          color: #4b5563;
        }

        .schedule-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem 1.5rem;
          flex-wrap: wrap;
        }

        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
          display: inline-block;
        }
        .badge-active {
          background: #d1fae5;
          color: #065f46;
        }
        .badge-inactive {
          background: #fee2e2;
          color: #991b1b;
        }

        .btn-toggle {
          padding: 0.3rem 1rem;
          border-radius: 30px;
          font-weight: 500;
          font-size: 0.8rem;
          border: none;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-close {
          background: #fef3c7;
          color: #92400e;
        }
        .btn-close:hover {
          background: #fde68a;
          transform: scale(1.04);
        }

        .btn-open {
          background: #dbeafe;
          color: #1e40af;
        }
        .btn-open:hover {
          background: #bfdbfe;
          transform: scale(1.04);
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
          .schedule-card {
            flex-direction: column;
            align-items: stretch;
            padding: 1rem;
          }
          .schedule-meta {
            justify-content: flex-start;
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
