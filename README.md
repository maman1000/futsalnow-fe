# ⚽ FutsalNow - Frontend

![Vercel](https://img.shields.io/badge/Deployed-Vercel-000?style=flat&logo=vercel)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)

Frontend aplikasi booking lapangan futsal **FutsalNow**. Dibangun dengan React 18 + Vite.

🌐 **Live Demo:** [https://futsalnow-fe.vercel.app](https://futsalnow-fe.vercel.app)

---

## 📌 Fitur

### 👤 Customer
- Registrasi & Login
- Lihat daftar lapangan futsal
- Booking dengan pilih tanggal, jam mulai, dan durasi (1-4 jam)
- Lihat riwayat booking (My Bookings)
- Batalkan booking
- Bayar booking (dummy)

### 🔧 Admin
- Dashboard statistik
- Kelola semua booking (konfirmasi, batalkan, tandai selesai)
- Kelola layanan (tambah, edit, hapus, toggle status)
- Kelola jadwal operasional (tambah, edit jam, buka/tutup slot)
- Laporan booking

---

## 🛠️ Tech Stack

| **Komponen** | **Teknologi** |
|--------------|---------------|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Routing | React Router DOM 6 |
| HTTP Client | Axios |
| Styling | CSS Custom (dengan tema ungu) |
| Deployment | Vercel |

---

## 🚀 Instalasi Lokal

### 1. Clone Repository
```bash
git clone https://github.com/maman1000/futsalnow-fe.git
cd futsalnow-fe

2. Install Dependencies
bash
npm install

3. Setup Environment Variables
Buat file .env di root project:

env
VITE_API_URL=http://localhost:8000/api
Untuk production, ganti dengan URL backend di Railway.

4. Jalankan Development Server
bash
npm run dev

Aplikasi berjalan di http://localhost:5173

📁 Struktur Folder
text
src/
├── api/
│   ├── client.js          # Axios instance
│   └── bookingApi.js      # API functions
├── components/
│   ├── Navbar.jsx         # Navigasi (responsif dengan hamburger)
│   ├── ProtectedRoute.jsx # Proteksi route
│   ├── ServiceCard.jsx    # Card lapangan
│   └── Toast.jsx          # Notifikasi toast
├── context/
│   ├── AuthContext.jsx    # Autentikasi state
│   └── ToastContext.jsx   # Toast notification state
├── pages/
│   ├── admin/             # Halaman admin
│   │   ├── Dashboard.jsx
│   │   ├── ManageBookings.jsx
│   │   ├── ManageServices.jsx
│   │   ├── ManageSchedule.jsx
│   │   └── Reports.jsx
│   └── user/              # Halaman user
│       ├── Home.jsx
│       ├── Services.jsx
│       ├── BookingPage.jsx
│       ├── BookingForm.jsx
│       └── MyBookings.jsx
├── App.jsx
├── main.jsx
└── styles.css             # Global styles (tema ungu)
🌐 API Integration
Backend API berada di:

Production: https://booking-production-8fcc.up.railway.app/api

Local: http://localhost:8000/api

Dokumentasi API lengkap: Link Postman

🚀 Deployment ke Vercel
Push repository ke GitHub.

Buka vercel.com → Import Project.

Pilih repository futsalnow-fe.

Tambahkan environment variable:

VITE_API_URL = https://booking-production-8fcc.up.railway.app/api

Klik Deploy.

📄 Lisensi
MIT © 2026 Maman Darusman

🙏 Kontribusi
Pull request dipersilakan. Untuk perubahan besar, buka issue terlebih dahulu.

📬 Kontak
Email: [email Anda]

LinkedIn: [linkedin.com/in/username]

Demo: https://futsalnow-fe.vercel.app


