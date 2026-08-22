// import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
// import Navbar from './components/Navbar'
// import ProtectedRoute from './components/ProtectedRoute'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import Home from './pages/user/Home'
// import Services from './pages/user/Services'
// import BookingPage from './pages/user/BookingPage'
// import MyBookings from './pages/user/MyBookings'
// import Dashboard from './pages/admin/Dashboard'
// import ManageBookings from './pages/admin/ManageBookings'
// import ManageServices from './pages/admin/ManageServices'
// import ManageSchedule from './pages/admin/ManageSchedule'
// import Reports from './pages/admin/Reports'

// export default function App() {
//   const location = useLocation()
//   // Navbar disembunyikan di halaman auth
//   const hideNavbar = location.pathname === '/login' || location.pathname === '/register'

//   return (
//     <>
//       {!hideNavbar && <Navbar />}
//       <main className="main-content">
//         <Routes>
//           {/* Publik */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/" element={<Home />} />
//           <Route path="/services" element={<Services />} />

//           {/* Customer (harus login) */}
//           <Route
//             path="/booking/:id"
//             element={
//               <ProtectedRoute>
//                 <BookingPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/my-bookings"
//             element={
//               <ProtectedRoute>
//                 <MyBookings />
//               </ProtectedRoute>
//             }
//           />

//           {/* Admin */}
//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute role="admin">
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/bookings"
//             element={
//               <ProtectedRoute role="admin">
//                 <ManageBookings />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/services"
//             element={
//               <ProtectedRoute role="admin">
//                 <ManageServices />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/schedules"
//             element={
//               <ProtectedRoute role="admin">
//                 <ManageSchedule />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/reports"
//             element={
//               <ProtectedRoute role="admin">
//                 <Reports />
//               </ProtectedRoute>
//             }
//           />

//           {/* Fallback */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </main>
//     </>
//   )
// }

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
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
import { ToastProvider } from "./context/ToastContext"; // <-- TAMBAHKAN INI

export default function App() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <ToastProvider>
      {" "}
      {/* <-- BUNGKUS SELURUH APLIKASI */}
      <>
        {!hideNavbar && <Navbar />}
        <main className="main-content">
          <Routes>
            {/* Publik */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />

            {/* Customer (harus login) */}
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
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute role="admin">
                  <ManageBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <ProtectedRoute role="admin">
                  <ManageServices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/schedules"
              element={
                <ProtectedRoute role="admin">
                  <ManageSchedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute role="admin">
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </>
    </ToastProvider>
  );
}
