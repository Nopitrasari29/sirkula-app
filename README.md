# 🌿 SIRKULA — Menutup Lingkaran Sampah, dari Rumah ke Pengepul

<p align="center">
  <img src="public/assets/illustrations/logo-sirkula.png" alt="SIRKULA Logo" width="140" />
</p>

<p align="center">
  <strong>Platform Pengelolaan Sampah Terintegrasi & Ekonomi Sirkular untuk Komunitas Mahasiswa Kos dan Lingkungan Kampus</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Leaflet-1.9-green?style=for-the-badge&logo=leaflet" alt="Leaflet" />
  <img src="https://img.shields.io/badge/Event-INVENTION_2026-orange?style=for-the-badge" alt="INVENTION 2026" />
</p>

---

## 📖 Tentang SIRKULA

**SIRKULA** (*Sirkular Sampah Kos*) adalah solusi web digital inovatif yang dirancang untuk mengatasi persoalan pemilahan dan penumpukan sampah di pemukiman mahasiswa kos sekitar kampus. Melalui pendekatan **Ekonomi Sirkular Berbasis Komunitas**, SIRKULA menghubungkan mahasiswa kos dengan jaringan mitra **Bank Sampah**, **Drop-Box 24 Jam**, **TPS3R**, dan **Pengepul Mandiri**.

Aplikasi ini mendemokratisasi nilai ekonomi sampah dengan memungkinkan pengguna memindai sampah menggunakan **AI Scanner**, menemukan lokasi penyetoran terdekat dengan **GPS Real-Time**, memesan layanan **Penjemputan Sampah (Booking Pickup)**, serta menukarkan setoran sampah menjadi **Poin Hijau & Rupiah**.

---

## ✨ Fitur-Fitur Unggulan

### 1. 🔍 AI Waste Scanner Pintar
- Deteksi cepat jenis sampah (Plastik PET, Kertas & Kardus, Logam, Organik, B3).
- Estimasi nilai jual per kilogram dan proyeksi penghematan emisi karbon ($CO_2$).
- Panduan pemilahan 3R langkah-demi-langkah serta rekomendasi mitra bank sampah terdekat.
- Fitur riwayat scan dan mode tangkapan langsung kamera webcam maupun upload gambar.

### 2. 🗺️ Peta Interaktif & Lokasi GPS Real-Time
- Menggunakan peta interaktif berbasis OpenStreetMap dan Leaflet.
- Otomatis mendeteksi posisi GPS pengguna dan menyesuaikan titik drop-off point serta bank sampah dalam radius terdekat (0.5 – 3 km).
- Filter canggih berdasarkan kategori sampah, jarak radius, status buka hari ini, dan jam operasional riil.
- Tampilan mode peta satelit/vektor dan daftar kartu detail drop-off lengkap dengan status kapasitas timbunan (*Tersedia / Hampir Penuh*).

### 3. 🚚 Sistem Booking Penjemputan Sampah & Live Tracking
- Formulir pemesanan penjemputan sampah terpilah langsung dari kos.
- Pemilihan rute armada truk dan jadwal halte penyetoran.
- Pelacakan langsung status perjalanan armada truk pengepul (*Live Status Tracking Wizard*).
- Riwayat booking lengkap dengan ID transaksi, status konfirmasi, dan penambahan reward poin otomatis.

### 4. 🏆 Gamifikasi & Jejak Hijau (Eco Impact Dashboard)
- Ringkasan total sampah terdaur ulang ($kg$), akumulasi emisi $CO_2$ terselamatkan, dan tabungan saldo rupiah.
- Leaderboard peringkat kos hijau untuk mendorong kompetisi positif antar-mahasiswa kos.
- Badge pencapaian (*Eco Warrior, Master Daur Ulang, Pelopor Kompos, dsb.*).

### 5. 📚 Edukasi Lingkungan & Kuis Harian Berhadiah
- Carousel tips ramah lingkungan berbasis fakta riset lingkungan (`facts.json`).
- Modul artikel edukatif seputar pengelolaan sampah zero-waste kos.
- Kuis harian interaktif (`quiz.json`) dengan sistem skor instan dan bonus poin reward harian.

### 6. 🤖 EcoBot AI Chatbot Assistant
- Asisten virtual pintar interaktif bertema maskot ramah lingkungan.
- Siap menjawab pertanyaan seputar kategori sampah, tips daur ulang, harga pasaran sampah, dan lokasi bank sampah.
- Persistensi riwayat chat pada sesi browser dengan tombol reset obrolan yang praktis.

### 7. 🌐 Preferensi Bahasa & Pengaturan Akun
- Dukungan dwibahasa penuh (**Bahasa Indonesia & English**) tersinkronisasi seketika di semua halaman.
- Pengaturan profil kos, domisili kampus, preferensi notifikasi, dan pengelolaan akun.

---

## 🛠️ Arsitektur & Teknologi

| Lapisan | Teknologi / Pustaka |
|---|---|
| **Frontend Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Bahasa Pemrograman** | [TypeScript 5.7](https://www.typescriptlang.org/) |
| **Styling & Desain** | [Tailwind CSS 3.4](https://tailwindcss.com/) & Vanilla CSS Tokens |
| **Peta & Geospasial** | [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/) |
| **Ikonografi** | [Lucide React](https://lucide.dev/) |
| **Visualisasi Data** | [Recharts](https://recharts.org/) |
| **Micro-Animations** | [Framer Motion](https://www.framer.com/motion/) & Tailwind Keyframes |
| **Package Manager / Runtime** | [Bun](https://bun.sh/) / [Node.js](https://nodejs.org/) |

---

## 📂 Struktur Direktori Proyek

```text
Sirkula/
├── app/                          # Next.js App Router Pages
│   ├── bank-sampah/              # Halaman Daftar & Peta Bank Sampah
│   ├── booking/                  # Halaman Pemesanan Penjemputan Truk
│   ├── edukasi/                  # Halaman Edukasi & Kuis Harian
│   ├── jejak-hijau/              # Halaman Gamifikasi & Statistik Dampak
│   ├── lokasi/                   # Halaman Peta Drop Point 24 Jam & TPS3R
│   ├── notifikasi/               # Halaman Pusat Notifikasi Pengguna
│   ├── scanner/                  # Halaman AI Scanner Sampah
│   ├── settings/                 # Halaman Pengaturan Akun & Preferensi
│   ├── layout.tsx                # Root Layout Aplikasi
│   └── page.tsx                  # Landing Page Publik SIRKULA
├── components/                   # Komponen Reusable UI
│   ├── bank-sampah/              # Komponen List, Filter, Map, & Detail Modal
│   ├── booking/                  # Komponen Wizard Rute, Form, Tracking, & Success
│   ├── chatbot/                  # EcoBot Chat Widget & Floating Launcher
│   ├── dashboard/                # HeaderBar, Sidebar, Carousel, Statistik Cards
│   ├── edukasi/                  # Card Artikel & Modul Kuis Interaktif
│   ├── layout/                   # Client Layout & Global Provider
│   ├── map/                      # Leaflet Map View, GPS Bar, & Modal Izin Lokasi
│   ├── scanner/                  # Kamera Scanner, Hasil Klasifikasi, & Modal Riwayat
│   ├── settings/                 # Kartu Pengaturan Profil & Preferensi
│   └── ui/                       # Navbar, Footer, Popover Notifikasi & Profil
├── hooks/                        # Custom React Hooks
│   ├── useGeolocation.ts         # Hook GPS Geolocation & Reverse Geocoding
│   └── useAuthGuard.ts           # Hook Proteksi Rute Pengguna
├── lib/                          # Modul Utilitas, Tipe Data, & Logic
│   ├── data/                     # Data JSON (facts, quiz, mockData)
│   ├── logic/                    # Algoritma Klasifikasi Sampah
│   ├── types/                    # Definisi Interface TypeScript
│   └── utils/                    # Storage Engine (localStorage), i18n, Formatters
├── public/                       # Aset Statis (Gambar, Ikon, Ilustrasi)
├── ATTRIBUTIONS.md               # Atribusi Lisensi Pustaka Pihak Ketiga
├── tailwind.config.ts            # Konfigurasi Tema & Warna Tailwind
└── package.json                  # Konfigurasi Proyek & Dependensi
```

---

## 🚀 Panduan Menjalankan Proyek Secara Lokal

### 1. Prasyarat Sistem
Pastikan Anda telah menginstal salah satu dari:
- **Node.js**: Versi 18.18.0 atau lebih baru ([Unduh Node.js](https://nodejs.org/))
- **Bun**: Versi 1.1 atau lebih baru (Rekomendasi untuk performa kilat, [Unduh Bun](https://bun.sh/))

### 2. Kloning Repositori
```bash
git clone https://github.com/<username-kamu>/sirkula.git
cd sirkula
```

### 3. Instalasi Dependensi
Gunakan Bun (disarankan):
```bash
bun install
```
Atau gunakan NPM:
```bash
npm install
```

### 4. Menjalankan Server Pengembangan
```bash
bun run dev
# atau: npm run dev
```

Buka peramban Anda dan akses URL:
```text
http://localhost:3524
```

### 5. Pengecekan Kualitas Kode & Build
Untuk memvalidasi tidak adanya kesalahan tipe TypeScript:
```bash
bun x tsc --noEmit
```

Untuk membuat bundel produksi:
```bash
bun run build
# atau: npm run build
```

---

## 📄 Lisensi & Hak Cipta

Proyek ini dikembangkan oleh **Tim Pengembang SIRKULA** untuk kompetisi **INVENTION 2026 (Universitas Udayana)**.

Hak Cipta © 2026 SIRKULA. Seluruh hak cipta dilindungi undang-undang.  
Daftar lisensi dan atribusi aset terbuka pihak ketiga dapat dilihat pada [ATTRIBUTIONS.md](ATTRIBUTIONS.md).
