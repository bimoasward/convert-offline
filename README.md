# Universal Converter (Convert Offline Bumbim)

Aplikasi konverter media berbasis web yang berjalan 100% di sisi klien (*client-side*) menggunakan **WebAssembly (FFmpeg.wasm)**, **React.js**, **Tailwind CSS**, dan **React Router**.

Semua proses konversi dieksekusi langsung di memori browser pengguna tanpa pernah mengunggah file ke server (aman, privat, dan tanpa batasan kuota).

---

## ✨ Fitur Utama

- 🎬 **Video to MP3 Converter (Active)**: Ekstrak audio dari berbagai format video (MP4, MOV, MKV, WebM, AVI) menjadi MP3 berkualitas tinggi (128 kbps, 192 kbps, 320 kbps).
- 🔍 **Image Upscaler (AI)**: Naikkan resolusi gambar pecah/blur 2x–4x dengan ESRGAN (TensorFlow.js), lalu download sebagai PNG, JPG, atau WebP.
- ✂️ **Remove Background (AI)**: Hapus latar belakang gambar otomatis (`@imgly/background-removal`), hasil PNG transparan atau JPG dengan warna latar pilihan.
- 🔒 **100% Privat & Aman**: File tidak pernah meninggalkan perangkat / diunggah ke cloud.
- ⚡ **FFmpeg WebAssembly**: Ditenagai oleh engine FFmpeg asli yang dikompilasi ke WebAssembly.
- 🎧 **Audio Preview**: Dengarkan hasil konversi secara langsung di browser sebelum mengunduh.
- 📱 **Desain Modern & Responsif**: Tampilan antarmuka futuristik dengan sidebar navigasi responsif dan dark mode.
- 🖼️ **Image to WebP & PDF to Word**: Placeholder modular siap untuk rilis berikutnya.

> Model AI disimpan lokal di `public/models/` (~120 MB, sebagian besar model remove-bg) sehingga fitur gambar berjalan tanpa internet.

---

## 🛠️ Tech Stack

- **React 19** + **Vite**
- **Tailwind CSS v4**
- **React Router DOM**
- **React Dropzone**
- **Lucide React** (Ikon UI)
- **@ffmpeg/ffmpeg** & **@ffmpeg/util** (Wasm Core)

---

## 🚀 Memulai (Local Development)

### 1. Kloning Repositori
```bash
git clone https://github.com/bimoasward/convert-offline-bumbim.git
cd convert-offline-bumbim
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Jalankan Server Development
```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) pada browser Anda.

### 4. Build untuk Produksi
```bash
npm run build
```

---

## 📄 Lisensi
MIT License
