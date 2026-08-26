# ⚽ FutsalNow

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?style=flat&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-HTTP_Client-5A29E4?style=flat)

Frontend aplikasi booking lapangan futsal **FutsalNow**.

FutsalNow memungkinkan customer melihat lapangan yang tersedia, memilih jadwal, melakukan booking, serta mengelola booking mereka. Aplikasi juga dilengkapi dengan dashboard admin untuk mengelola layanan, jadwal, booking, dan laporan.

Dibangun menggunakan **React 18 + Vite** dengan custom CSS dan desain yang sederhana serta responsif.

🌐 **Live Demo:** https://futsalnow-fe.vercel.app

---

## 📌 Fitur

### 👤 Customer

- Registrasi dan login
- Melihat daftar lapangan futsal
- Melihat detail lapangan
- Memilih tanggal booking
- Memilih jam dan durasi booking
- Melakukan booking lapangan
- Melihat riwayat booking
- Membatalkan booking
- Melakukan pembayaran simulasi

### 🔧 Admin

- Dashboard
- Mengelola booking
- Mengonfirmasi booking
- Membatalkan booking
- Menandai booking selesai
- Mengelola layanan/lapangan
- Menambah, mengubah, dan menghapus layanan
- Mengaktifkan atau menonaktifkan layanan
- Mengelola jadwal operasional
- Mengatur jam operasional
- Mengelola laporan booking

---

## 🎨 Design System

FutsalNow menggunakan desain yang sederhana, bersih, dan berorientasi pada aplikasi.

| Elemen | Nilai |
|---|---|
| Primary Green | `#16A34A` |
| Dark | `#0F172A` |
| Muted | `#64748B` |
| Background | `#F8FAFC` |
| White | `#FFFFFF` |
| Border | `#E2E8F0` |
| Card Radius | `12px` |
| Button Radius | `8px` |
| Input Radius | `8px` |
| Font | Inter |

Prinsip desain:

- Minimal dan sederhana
- Responsive
- Minimal shadow
- Tidak menggunakan excessive gradients
- Tidak menggunakan fake statistics
- Tidak menggunakan fake badges
- Menampilkan data aplikasi yang sebenarnya

---

## 🛠️ Tech Stack

| Komponen | Teknologi |
|---|---|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Routing | React Router DOM 6 |
| HTTP Client | Axios |
| Styling | Custom CSS |
| Font | Inter |
| Deployment | Vercel |

---

## 🚀 Instalasi Lokal

### 1. Clone Repository

```bash
git clone https://github.com/maman1000/futsalnow-fe.git
cd futsalnow-fe
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Buat file `.env` di root project:

```env
VITE_API_URL=http://localhost:8000/api
```

> **Catatan:** Untuk production, gunakan URL backend production.

### 4. Jalankan Development Server
```bash
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`

---

## 📁 Struktur Folder

```
src/
├── api/
│   ├── client.js
│   └── bookingApi.js
│
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProtectedRoute.jsx
│   ├── ServiceCard.jsx
│   └── Toast.jsx
│
├── context/
│   ├── AuthContext.jsx
│   └── ToastContext.jsx
│
├── pages/
│   ├── admin/
│   │   ├── Dashboard.jsx
│   │   ├── ManageBookings.jsx
│   │   ├── ManageServices.jsx
│   │   ├── ManageSchedule.jsx
│   │   └── Reports.jsx
│   │
│   └── user/
│       ├── Home.jsx
│       ├── Services.jsx
│       ├── BookingPage.jsx
│       ├── BookingForm.jsx
│       └── MyBookings.jsx
│
├── App.jsx
├── main.jsx
└── styles.css
```

---

## 🌐 API Integration

Backend API berada di:

- **Production:** `YOUR_PRODUCTION_API_URL`
- **Local:** `http://localhost:8000/api`

Dokumentasi API lengkap: [Link Postman](https://documenter.getpostman.com/view/48765304/2sBYArVtFJ)
---

## 🚀 Deployment ke Vercel

1. Push repository ke GitHub.
2. Buka [vercel.com](https://vercel.com) → Import Project.
3. Pilih repository `futsalnow-fe`.
4. Tambahkan environment variable:
   - VITE_API_URL=YOUR_PRODUCTION_API_URL
5. Klik **Deploy**.

---

## 📄 Lisensi

MIT © 2026 Maman Darusman

---

## 🙏 Kontribusi

Pull request dipersilakan. Untuk perubahan besar, buka issue terlebih dahulu.

---

## 📬 Kontak

- **Email:** [mamandarusman.st@gmail.com]
- **LinkedIn:** [https://www.linkedin.com/in/maman-darusman-88ba2696/]
- **Demo:** [https://futsalnow-fe.vercel.app](https://futsalnow-fe.vercel.app)
