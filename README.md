<div align="center">

<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/Material_UI-007FFF?style=for-the-badge&logo=mui&logoColor=white"/>
<img src="https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white"/>
<img src="https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white"/>

# 🖥️ Absensi App — QR Code Frontend

**Aplikasi web absensi digital** berbasis QR Code dengan antarmuka modern dan animasi smooth.  
Dibangun dengan **Next.js 15**, **TypeScript**, **Material UI**, dan **Framer Motion** — mendukung **PWA**.

[![Backend Repo](https://img.shields.io/badge/📡_Backend_API-absensi--api--qrcode-ec4899?style=for-the-badge)](https://github.com/kzherdinnn/absensi-api-qrcode)
[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-absensiku.onesite.my.id-10b981?style=for-the-badge)](https://absensiku.onesite.my.id)

</div>

---

## 📌 Tentang Project

Aplikasi ini adalah **frontend** dari sistem absensi digital berbasis QR Code. Siswa dapat melakukan absensi secara mandiri dengan **memindai QR Code** menggunakan kamera perangkat. Admin dapat memantau seluruh data kehadiran, mengelola siswa, dan melihat statistik secara real-time.

> 🔗 **Backend API**: [absensi-api-qrcode](https://github.com/kzherdinnn/absensi-api-qrcode) — REST API + WebSocket yang melayani data aplikasi ini.

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|-------|-----------|
| 📷 **QR Code Scanner** | Scan QR Code menggunakan kamera perangkat secara langsung |
| 🔐 **Login Aman** | Autentikasi JWT dengan redirect otomatis |
| 👤 **Profil Pengguna** | Lihat & edit profil akun (Siswa / Admin) |
| 📊 **Dashboard Statistik** | Grafik kehadiran dengan Recharts |
| 📋 **Daftar Kehadiran** | Riwayat kehadiran harian lengkap |
| 👥 **Manajemen Siswa** | CRUD data siswa (khusus admin) |
| ✍️ **Registrasi Siswa** | Form pendaftaran siswa baru |
| 🌐 **Real-time Update** | Update data kehadiran via WebSocket |
| 📱 **PWA Support** | Bisa diinstall seperti aplikasi native |
| 🎨 **Animasi Premium** | Transisi & animasi smooth dengan Framer Motion |
| 📲 **Responsive UI** | Tampilan optimal di semua ukuran layar |

---

## 🛠️ Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Next.js** | ^15.0 | React framework dengan SSR/SSG |
| **TypeScript** | 4.9.5 | Type safety |
| **Material UI (MUI)** | ^5.11 | Komponen UI |
| **Redux Toolkit** | ^1.9 | State management global |
| **Framer Motion** | ^12.33 | Animasi & transisi halaman |
| **qr-scanner** | ^1.4 | Scanner QR Code via kamera |
| **qrcode.react** | ^3.1 | Generate tampilan QR Code |
| **Recharts** | ^3.7 | Grafik & visualisasi data |
| **jwt-decode** | ^3.1 | Decode JWT di sisi client |
| **next-pwa** | ^5.6 | Progressive Web App support |

---

## 📁 Struktur Project

```
absensi-nextjs-qrcode/
│
├── public/                   # Asset statis & PWA manifest
│
├── src/
│   ├── components/           # Komponen reusable
│   │   ├── Layout.tsx        # Layout utama (Sidebar + Header)
│   │   ├── Header.tsx        # Navbar atas
│   │   ├── Sidebar.tsx       # Menu navigasi samping
│   │   ├── Content.tsx       # Wrapper konten halaman
│   │   └── Footer.tsx        # Footer
│   │
│   ├── pages/                # Halaman Next.js (file-based routing)
│   │   ├── _app.tsx          # Provider global (Redux, MUI Theme)
│   │   ├── _document.tsx     # HTML Document wrapper
│   │   ├── index.tsx         # Halaman utama (redirect)
│   │   ├── login.tsx         # Halaman login
│   │   ├── profil.tsx        # Halaman profil pengguna
│   │   ├── absen.tsx         # Halaman scanner QR Code
│   │   ├── daftar-kehadiran.tsx   # Riwayat kehadiran
│   │   ├── daftar-siswa.tsx       # Manajemen siswa (admin)
│   │   ├── registrasi-siswa.tsx   # Form registrasi siswa
│   │   └── kode/             # Halaman QR Code admin
│   │
│   ├── services/             # API calls & utilities
│   │   ├── siswaApi.ts       # API service untuk siswa
│   │   ├── kehadiranApi.ts   # API service untuk kehadiran
│   │   ├── configService.ts  # Axios config & token handler
│   │   ├── store.ts          # Redux store & slices
│   │   └── utils.ts          # Helper/utility functions
│   │
│   └── styles/               # Global styles
│
├── types/                    # TypeScript type definitions
├── next.config.js            # Konfigurasi Next.js + PWA
├── tsconfig.json             # Konfigurasi TypeScript
└── package.json
```

---

## 📱 Halaman Aplikasi

| Route | Halaman | Akses |
|-------|---------|-------|
| `/login` | Halaman login | Public |
| `/profil` | Dashboard & profil pengguna | Auth |
| `/absen` | Scanner QR Code kehadiran | Auth (Siswa & Admin) |
| `/daftar-kehadiran` | Riwayat semua kehadiran | Admin |
| `/daftar-siswa` | Manajemen data siswa | Admin |
| `/registrasi-siswa` | Form tambah siswa | Admin |
| `/kode` | Tampilkan QR Code aktif | Admin |

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js ≥ 18
- npm / yarn
- Backend API sudah berjalan ([absensi-api-qrcode](https://github.com/kzherdinnn/absensi-api-qrcode))

### 1. Clone Repository
```bash
git clone https://github.com/kzherdinnn/absensi-nextjs-qrcode.git
cd absensi-nextjs-qrcode
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment
Buat file `.env.local` di root project:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000
```

> Ganti `localhost:5000` dengan URL backend API yang sudah di-deploy jika menggunakan produksi.

### 4. Jalankan Development Server
```bash
npm run dev
```
> Aplikasi akan berjalan di `http://localhost:3003`

### 5. Build untuk Production
```bash
npm run build
npm start
```

---

## 📷 Cara Menggunakan Fitur Scan QR

1. Login sebagai **Siswa** atau **Admin**
2. Navigasi ke halaman **Absen** (`/absen`)
3. Klik tombol **"Mulai Pindai QR"**
4. Izinkan akses **kamera** di browser
5. Arahkan kamera ke **QR Code** yang ditampilkan admin
6. Sistem otomatis mencatat kehadiran dan menampilkan konfirmasi ✅

> ⚠️ **Catatan**: Akses kamera memerlukan koneksi **HTTPS** (kecuali di `localhost`).

---

## 🔗 Hubungan dengan Backend

Aplikasi ini mengonsumsi REST API dan WebSocket dari repo backend:

| Layanan | URL |
|---------|-----|
| **🌐 Live Demo** | [absensiku.onesite.my.id](https://absensiku.onesite.my.id) |
| **Frontend App** | [github.com/kzherdinnn/absensi-nextjs-qrcode](https://github.com/kzherdinnn/absensi-nextjs-qrcode) *(repo ini)* |
| **Backend API** | [github.com/kzherdinnn/absensi-api-qrcode](https://github.com/kzherdinnn/absensi-api-qrcode) |

**Flow komunikasi:**
```
Browser (Next.js)  →  HTTPS/REST  →  Express API  →  MongoDB
Browser (Next.js)  ←→  WebSocket  ←→  Express API
```

---

## 📱 PWA — Install sebagai Aplikasi

Aplikasi ini mendukung **Progressive Web App (PWA)**. Pengguna dapat menginstall aplikasi langsung dari browser:

1. Buka aplikasi di browser (Chrome / Edge)
2. Klik ikon **"Install"** di address bar
3. Aplikasi akan tersedia di homescreen / taskbar

> PWA hanya aktif di **production** (dinonaktifkan saat development).

---

## 📅 Riwayat Update Terakhir

| Tanggal | Perubahan |
|---------|-----------|
| **27 Feb 2026** | Menambahkan animasi scan QR dengan overlay & corner markers |
| **27 Feb 2026** | Integrasi Framer Motion untuk transisi halaman |
| **27 Feb 2026** | Implementasi WebSocket untuk update real-time kehadiran |
| **27 Feb 2026** | Menambahkan halaman statistik dengan Recharts |
| **27 Feb 2026** | PWA support dengan next-pwa |
| **27 Feb 2026** | Halaman login dengan desain split-panel glassmorphism |
| **27 Feb 2026** | Initial commit — setup Next.js, MUI, Redux |

---

## 👤 Developer

**kzherdinnn**  
[![GitHub](https://img.shields.io/badge/GitHub-kzherdinnn-181717?style=flat-square&logo=github)](https://github.com/kzherdinnn)

---

<div align="center">
  <sub>🔗 Frontend dari <a href="https://github.com/kzherdinnn/absensi-api-qrcode">Sistem Absensi Digital QR Code</a></sub>
</div>
