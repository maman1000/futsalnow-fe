import client from "./client";

// ===== Auth =====
export const register = (payload) => client.post("/register", payload);
export const login = (payload) => client.post("/login", payload);
export const logout = () => client.post("/logout");

// ===== Services (publik GET) =====
export const getServices = (params) => client.get("/services", { params });
export const getService = (id) => client.get(`/services/${id}`);

// ===== Schedules (publik per service) =====
export const getSchedules = (serviceId, date) =>
  client.get(`/services/${serviceId}/schedules`, { params: { date } });

export const getAvailableSlots = (serviceId, date, interval = 60) =>
  client.get(`/services/${serviceId}/available-slots`, {
    params: { date, interval },
  });

// ===== Bookings (customer) =====
export const createBooking = (payload) => client.post("/bookings", payload);
// export const getMyBookings = () => client.get("/bookings/my");
export const getMyBookings = (params) => client.get("/bookings/my", { params });
export const cancelBooking = (id) => client.patch(`/bookings/${id}/cancel`);

// ===== Payments (customer) =====
export const payBooking = (bookingId, method) =>
  client.post("/payments", { booking_id: bookingId, method });

// ===== Admin: Bookings =====
export const getBookings = (params) => client.get("/bookings", { params });
export const updateBookingStatus = (id, status) =>
  client.patch(`/bookings/${id}/status`, { status });

// ===== Admin: Services =====
export const createService = (payload) => client.post("/services", payload);
export const updateService = (id, payload) =>
  client.put(`/services/${id}`, payload);
export const deleteService = (id) => client.delete(`/services/${id}`);

// ===== Admin: Schedules =====
// export const getAllSchedules = () => client.get("/schedules");
export const getAllSchedules = (params) => client.get("/schedules", { params });
export const createSchedule = (payload) => client.post("/schedules", payload);
export const setScheduleAvailability = (id, isAvailable) =>
  client.patch(`/schedules/${id}/availability`, { is_active: isAvailable });
export const updateSchedule = (id, payload) =>
  client.put(`/schedules/${id}`, payload); // <-- tambahkan ini

// ===== Admin: Reports =====
export const getReportSummary = () => client.get("/reports/summary");
export const getReportBookings = (params) =>
  client.get("/reports/bookings", { params });
