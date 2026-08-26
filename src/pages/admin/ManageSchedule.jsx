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
        <div>
          <h1 className="page-title">Kelola Jadwal</h1>
          <p className="page-subtitle">
            Tambah slot jadwal dan atur ketersediaannya.
          </p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {info && <div className="alert alert-success">{info}</div>}

      {/* FORM TAMBAH JADWAL */}
      <div className="form-card">
        <div className="form-card-header">
          <div>
            <h2 className="form-title">Tambah Jadwal Baru</h2>
            <p className="form-description">
              Tentukan layanan, hari, dan jam operasional.
            </p>
          </div>
        </div>

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
                <option value="">Pilih layanan</option>

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
                <option value="">Pilih hari</option>
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
              {submitting ? "Menyimpan..." : "+ Tambah Jadwal"}
            </button>
          </div>
        </form>
      </div>

      {/* FILTER */}
      <div className="filter-bar">
        <div className="filter-group">
          <label className="filter-label">Layanan</label>

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
            Reset
          </button>
        )}
      </div>

      {/* DAFTAR JADWAL */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Memuat jadwal...</p>
        </div>
      ) : schedules.length === 0 ? (
        <div className="empty-state">
          <p>Belum ada jadwal.</p>
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

                  <td className="service-name">{s.service?.name || "-"}</td>

                  <td>{namaHari(s.day_of_week)}</td>

                  <td className="schedule-time">
                    {formatJam(s.start_time)}–{formatJam(s.end_time)}
                  </td>

                  <td>
                    <span
                      className={`status-badge ${
                        s.is_active ? "status-active" : "status-inactive"
                      }`}
                    >
                      {s.is_active ? "Aktif" : "Nonaktif"}
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
                      className={
                        s.is_active
                          ? "btn-toggle-sm btn-close"
                          : "btn-toggle-sm btn-open"
                      }
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

      {/* PAGINATION */}
      {pagination.last_page > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => goToPage(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
          >
            Sebelumnya
          </button>

          <span className="page-info">
            Halaman {pagination.current_page} dari {pagination.last_page}
          </span>

          <button
            className="page-btn"
            onClick={() => goToPage(pagination.current_page + 1)}
            disabled={pagination.current_page === pagination.last_page}
          >
            Selanjutnya
          </button>
        </div>
      )}

      {/* MODAL EDIT */}
      {editingSchedule && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Edit Jadwal</h3>

                <p className="modal-sub">
                  {editingSchedule.service?.name || "Layanan"} ·{" "}
                  {namaHari(editingSchedule.day_of_week)}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeEditModal}
                aria-label="Tutup"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
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
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
      .manage-schedule-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 32px 24px;
        color: #0F172A;
      }

      .page-header {
        margin-bottom: 24px;
      }

      .page-title {
        margin: 0 0 6px;
        font-size: 28px;
        line-height: 1.2;
        font-weight: 700;
        color: #0F172A;
      }

      .page-subtitle {
        margin: 0;
        color: #64748B;
        font-size: 15px;
      }

      /* ALERT */

      .alert {
        padding: 12px 16px;
        border: 1px solid;
        border-radius: 8px;
        margin-bottom: 20px;
        font-size: 14px;
      }

      .alert-error {
        background: #FEF2F2;
        border-color: #FECACA;
        color: #991B1B;
      }

      .alert-success {
        background: #F0FDF4;
        border-color: #BBF7D0;
        color: #166534;
      }

      /* FORM CARD */

      .form-card {
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 20px;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
      }

      .form-card-header {
        margin-bottom: 20px;
      }

      .form-title {
        margin: 0 0 4px;
        font-size: 18px;
        font-weight: 600;
        color: #0F172A;
      }

      .form-description {
        margin: 0;
        color: #64748B;
        font-size: 14px;
      }

      .schedule-form {
        width: 100%;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .form-label {
        font-size: 13px;
        font-weight: 600;
        color: #0F172A;
      }

      .form-input,
      .filter-select {
        width: 100%;
        min-height: 40px;
        box-sizing: border-box;
        padding: 8px 12px;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        background: #FFFFFF;
        color: #0F172A;
        font-size: 14px;
        transition: border-color 0.15s ease,
          box-shadow 0.15s ease;
      }

      .form-input:focus,
      .filter-select:focus {
        outline: none;
        border-color: #16A34A;
        box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.10);
      }

      .form-actions {
        margin-top: 20px;
      }

      .btn-submit {
        min-height: 40px;
        padding: 8px 16px;
        background: #16A34A;
        color: #FFFFFF;
        border: 1px solid #16A34A;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.15s ease;
      }

      .btn-submit:hover:not(:disabled) {
        background: #15803D;
      }

      .btn-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      /* FILTER */

      .filter-bar {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0;
        margin-bottom: 16px;
      }

      .filter-group {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .filter-label {
        color: #64748B;
        font-size: 14px;
      }

      .filter-select {
        width: auto;
        min-width: 190px;
      }

      .btn-reset {
        min-height: 38px;
        padding: 7px 12px;
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        color: #64748B;
        font-size: 13px;
        cursor: pointer;
      }

      .btn-reset:hover {
        background: #F8FAFC;
        color: #0F172A;
      }

      /* TABLE */

      .table-wrapper {
        overflow-x: auto;
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
      }

      .table-proka {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
      }

      .table-proka thead {
        background: #0F172A;
        color: #FFFFFF;
      }

      .table-proka th {
        padding: 12px 16px;
        text-align: left;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
      }

      .table-proka td {
        padding: 14px 16px;
        border-bottom: 1px solid #E2E8F0;
        color: #0F172A;
        vertical-align: middle;
      }

      .table-proka tbody tr:last-child td {
        border-bottom: none;
      }

      .table-proka tbody tr:hover {
        background: #F8FAFC;
      }

      .service-name {
        font-weight: 600;
      }

      .schedule-time {
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }

      /* STATUS */

      .status-badge {
        display: inline-flex;
        align-items: center;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
      }

      .status-active {
        background: #DCFCE7;
        color: #166534;
      }

      .status-inactive {
        background: #F1F5F9;
        color: #64748B;
      }

      /* ACTION */

      .table-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .btn-edit-sm,
      .btn-toggle-sm {
        min-height: 32px;
        padding: 6px 10px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.15s ease;
      }

      .btn-edit-sm {
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        color: #0F172A;
      }

      .btn-edit-sm:hover {
        background: #F8FAFC;
      }

      .btn-toggle-sm {
        border: 1px solid;
      }

      .btn-close {
        background: #FFFFFF;
        border-color: #E2E8F0;
        color: #64748B;
      }

      .btn-close:hover {
        background: #F8FAFC;
        color: #0F172A;
      }

      .btn-open {
        background: #F0FDF4;
        border-color: #BBF7D0;
        color: #15803D;
      }

      .btn-open:hover {
        background: #DCFCE7;
      }

      /* PAGINATION */

      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
        margin-top: 20px;
      }

      .page-btn {
        min-height: 36px;
        padding: 7px 12px;
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        color: #0F172A;
        font-size: 13px;
        cursor: pointer;
      }

      .page-btn:hover:not(:disabled) {
        background: #F8FAFC;
        border-color: #CBD5E1;
      }

      .page-btn:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .page-info {
        color: #64748B;
        font-size: 13px;
      }

      /* LOADING */

      .loading-state,
      .empty-state {
        min-height: 220px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #64748B;
      }

      .spinner {
        width: 28px;
        height: 28px;
        margin-bottom: 12px;
        border: 3px solid #E2E8F0;
        border-top-color: #16A34A;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* MODAL */

      .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        padding: 20px;
      }

      .modal-content {
        width: 100%;
        max-width: 480px;
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
        overflow: hidden;
      }

      .modal-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding: 20px 24px;
        border-bottom: 1px solid #E2E8F0;
      }

      .modal-header h3 {
        margin: 0 0 4px;
        color: #0F172A;
        font-size: 18px;
        font-weight: 600;
      }

      .modal-sub {
        margin: 0;
        color: #64748B;
        font-size: 13px;
      }

      .modal-close {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: 8px;
        color: #64748B;
        font-size: 22px;
        line-height: 1;
        cursor: pointer;
      }

      .modal-close:hover {
        background: #F8FAFC;
        color: #0F172A;
      }

      .modal-body {
        padding: 24px;
      }

      .modal-form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .modal-actions {
        grid-column: 1 / -1;
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 8px;
      }

      .btn-modal-cancel,
      .btn-modal-save {
        min-height: 40px;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
      }

      .btn-modal-cancel {
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        color: #0F172A;
      }

      .btn-modal-cancel:hover {
        background: #F8FAFC;
      }

      .btn-modal-save {
        background: #16A34A;
        border: 1px solid #16A34A;
        color: #FFFFFF;
      }

      .btn-modal-save:hover {
        background: #15803D;
      }

      /* RESPONSIVE */

      @media (max-width: 800px) {
        .form-grid {
          grid-template-columns: 1fr 1fr;
        }
      }

      @media (max-width: 640px) {
        .manage-schedule-page {
          padding: 24px 16px;
        }

        .form-card {
          padding: 20px;
        }

        .form-grid {
          grid-template-columns: 1fr;
        }

        .filter-bar {
          align-items: stretch;
          flex-direction: column;
        }

        .filter-group {
          align-items: stretch;
          flex-direction: column;
        }

        .filter-select {
          width: 100%;
        }

        .modal-form {
          grid-template-columns: 1fr;
        }

        .modal-actions {
          grid-column: auto;
        }

        .table-proka th,
        .table-proka td {
          padding: 10px 12px;
        }
      }
    `}</style>
    </div>
  );
}
