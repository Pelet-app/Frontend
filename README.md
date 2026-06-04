# PELET (Pencari Lowongan Efektif & Tepat)
**Tim Pengembang: CC26-PSU060**

Selamat datang di repositori Frontend **PELET** (Pencari Lowongan Efektif & Tepat). Repositori ini memuat kode sumber antarmuka pengguna (UI) dari sistem rekrutmen cerdas berbasis kecerdasan buatan (*Artificial Intelligence*) yang kami kembangkan.

---

## 📖 1. Deskripsi Singkat Proyek
**PELET** adalah platform ekosistem rekrutmen modern yang menjembatani para pencari kerja (*Job Seeker*) dengan perusahaan atau perekrut (*HRD*) melalui teknologi **Pencocokan Semantik (Semantic Matching)**. 

Alih-alih sekadar mencocokkan kata kunci (*keyword matching*), AI kami menganalisis makna, konteks, dan relevansi pengalaman di dalam CV (*Curriculum Vitae*) kandidat secara mendalam dengan deskripsi lowongan pekerjaan yang tersedia. Proses rekrutmen pun menjadi jauh lebih cepat, akurat, efektif, dan tepat sasaran. Aplikasi ini dirancang dengan antarmuka pengguna yang sangat modern, ramah (*user-friendly*), dan dilengkapi dengan *feedback* visual yang responsif.

## 🛠 2. Arsitektur & Tech Stack
Sistem *frontend* ini dibangun dengan teknologi mutakhir untuk memastikan performa yang cepat dan pengalaman pengguna yang halus:
- **Core Framework**: [React v19](https://react.dev/) (menggunakan ekosistem terbaru)
- **Build Tool**: [Vite v8](https://vitejs.dev/) (untuk *Hot Module Replacement* dan waktu kompilasi yang super cepat)
- **Routing**: [React Router DOM v7](https://reactrouter.com/) (dengan navigasi *state-based history*)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (menggunakan utilitas desain berbasis Atomic CSS)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Deployment & Hosting**: [Vercel](https://vercel.com/) (mendukung *serverless function* dan proksi API)

## ✨ 3. Fitur Unggulan

### 🎓 Dasbor Job Seeker
- **Smart CV Upload & Parsing**: Modul unggah CV (mendukung PDF) yang terhubung langsung ke mesin analisis AI. Terdapat sistem *Duplicate Upload Protection* (pencegah duplikasi data jika pengguna mencoba unggah ulang tanpa menghapus CV lama).
- **Match Score & AI Insights**: Memberikan metrik kecocokan (persentase kecocokan pekerjaan) serta deskripsi analitik mengapa profil kandidat direkomendasikan (menampilkan *Top Matching Skills* dan *Missing Skills*).
- **Stateful Search & Navigation**: Kemampuan pencarian posisi/pekerjaan secara *real-time* di seluruh platform yang *state*-nya terjaga dengan baik antar-halaman.

### 🏢 Dasbor HRD
- **Real-Time Applications Hub**: Manajemen pelamar kerja yang interaktif dan *real-time*.
- **Embedded Review System**: Sistem *Review* Kandidat Revolusioner. HRD tidak perlu lagi mengunduh CV secara manual. CV kandidat langsung terbuka melalui **Embedded PDF Iframe** yang terintegrasi di dalam modal peninjauan.
- **One-Click Decision**: Mengatur status pelamar (`Accepted` / `Rejected`) hanya dengan satu klik praktis.

---

## ⚙️ 4. Prasyarat Sistem
Sebelum memulai instalasi, pastikan sistem Anda telah memenuhi prasyarat berikut:
- **Node.js**: Versi `18.x` atau yang lebih baru (Disarankan menggunakan versi *LTS* terbaru).
- **NPM / Yarn / PNPM**: Pengelola paket bawaan NodeJS (Dalam panduan ini kami menggunakan `npm`).
- **Git**: Terinstal di sistem operasi Anda.

## 📦 5. Petunjuk Setup Environment
Ikuti langkah-langkah detail di bawah ini untuk menyiapkan lingkungan kerja (*environment setup*) di komputer lokal Anda:

1. **Clone Repositori**
   Buka terminal/CMD/PowerShell, lalu jalankan perintah berikut untuk mengunduh kode sumber proyek:
   ```bash
   git clone https://github.com/Pelet-app/Frontend.git
   ```
2. **Masuk ke Direktori Proyek**
   ```bash
   cd Frontend
   ```
3. **Instal Dependensi (Package Installation)**
   Unduh semua *library* dan *tools* yang dibutuhkan oleh proyek:
   ```bash
   npm install
   ```
4. **Konfigurasi Environment Variable (Opsional)**
   Secara *default*, *frontend* telah diatur untuk menggunakan Vite Proxy yang diarahkan ke Backend Production (OpenJob REST API). Namun, jika Anda memiliki *endpoint* API tersendiri atau menjalankan backend di lokal (seperti `http://localhost:3000`), Anda bisa menyesuaikan berkas konfigurasi di `vite.config.js` pada bagian `proxy`.

## 🚀 6. Cara Menjalankan Aplikasi
Berikut adalah instruksi untuk menjalankan, menguji, dan mem-build aplikasi PELET:

### A. Menjalankan Server Pengembangan (Development Mode)
Untuk menjalankan aplikasi di tahap pengembangan agar Anda bisa melakukan *live preview*:
```bash
npm run dev
```
Setelah perintah dijalankan, Vite akan menampilkan tautan *localhost* (umumnya di `http://localhost:5173`). Buka tautan tersebut di peramban (browser) Anda. Setiap kali Anda menyimpan (*save*) perubahan kode, halaman akan dimuat ulang secara otomatis.

### B. Proses Build (Production Mode)
Jika Anda ingin menyiapkan berkas statis (*static bundles*) untuk tujuan rilis ke *server*:
```bash
npm run build
```
Perintah ini akan melakukan kompilasi, optimalisasi, dan *minifikasi* seluruh kode ke dalam folder `dist/`.

### C. Meninjau Hasil Build Lokal
Untuk menguji hasil kompilasi folder `dist` secara lokal:
```bash
npm run preview
```

---

## 🌐 7. Deployment & Konfigurasi API Proxy
Aplikasi *Frontend* ini sangat bergantung pada REST API dari *Backend*. Untuk menghindari kendala **CORS (Cross-Origin Resource Sharing)**, kami menggunakan teknik proksi (*proxying*):
- **Di Lingkungan Lokal**: Koneksi proksi diatur sepenuhnya oleh `vite.config.js`. Permintaan (API Calls) dari `http://localhost:5173/api/...` akan disembunyikan lalu diteruskan ke alamat *Backend*.
- **Di Lingkungan Produksi**: Saat di-deploy ke **Vercel**, *routing* tersebut dikendalikan melalui fail konfigurasi `vercel.json` (memanfaatkan sistem *rewrites*), yang sekaligus memodifikasi respon *header* dan alur pengambilan arsip CV (*resume URL masking*).

## 📁 8. Struktur Direktori Utama
Berikut adalah ikhtisar struktur folder yang ada di `src/` untuk memudahkan Anda bermanuver di dalam proyek:
```text
src/
 ├── pages/           # Kumpulan halaman utama (LandingPage, JobSeekerDashboard, LoginPage, dll)
 ├── index.css        # Berkas styling utama (terintegrasi dengan Tailwind v4)
 ├── main.jsx         # Titik masuk utama aplikasi (Root Entry & App Router)
```

---
*Dikembangkan dengan ❤️ oleh TIM CC26-PSU060 untuk Capstone Project Coding Camp by DBS Foundation 2026.*