import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminLayout from "./components/AdminLayout";
import Footer from "./components/Footer"; // <-- TAMBAHKAN
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/user/Home";
import Services from "./pages/user/Services";
import BookingPage from "./pages/user/BookingPage";
import MyBookings from "./pages/user/MyBookings";
import Dashboard from "./pages/admin/Dashboard";
import ManageBookings from "./pages/admin/ManageBookings";
import ManageServices from "./pages/admin/ManageServices";
import ManageSchedule from "./pages/admin/ManageSchedule";
import Reports from "./pages/admin/Reports";
import { ToastProvider } from "./context/ToastContext";

export default function App() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <ToastProvider>
      <div className="app-wrapper">
        {!hideNavbar && !isAdminRoute && <Navbar />}
        <main className="main-content">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer */}
            <Route
              path="/booking/:id"
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="bookings" element={<ManageBookings />} />
              <Route path="services" element={<ManageServices />} />
              <Route path="schedules" element={<ManageSchedule />} />
              <Route path="reports" element={<Reports />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {/* ===== FOOTER ===== */}
        {!isAdminRoute && <Footer />}
      </div>
    </ToastProvider>
  );
}
