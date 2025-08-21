# pegawai-json

Aplikasi untuk update data pegawai dengan auto upload ke GitHub.

## Setup GitHub Integration

1. **Buat GitHub Personal Access Token:**
   - Buka https://github.com/settings/tokens
   - Klik "Generate new token" → "Generate new token (classic)"
   - Beri nama token (misal: "Pegawai Data Updater")
   - Pilih scope: `repo` (full control of private repositories)
   - Set expiration sesuai kebutuhan (recommended: 90 days atau No expiration)
   - Klik "Generate token"
   - Copy token yang dihasilkan

2. **Setup Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit file `.env` dan isi dengan data yang benar:
   ```env
   GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   GITHUB_OWNER=username_github_anda
   GITHUB_REPO=nama_repository_anda
   GITHUB_BRANCH=main
   PORT=3001
   ```
   
   **PENTING:** 
   - `GITHUB_TOKEN`: Token yang baru saja dibuat (dimulai dengan `ghp_`)
   - `GITHUB_OWNER`: Username GitHub Anda (bukan email)
   - `GITHUB_REPO`: Nama repository yang sudah ada di GitHub
   - Pastikan repository sudah dibuat di GitHub sebelum menjalankan aplikasi

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Jalankan Aplikasi:**
   ```bash
   # Jalankan frontend dan backend sekaligus
   npm run dev:full
   
   # Atau jalankan terpisah:
   # Terminal 1: Backend
   npm run server
   
   # Terminal 2: Frontend  
   npm run dev
   ```

## Cara Penggunaan

1. Pastikan server backend berjalan (indikator hijau di aplikasi)
2. Upload file Excel dengan kolom: Nama, NIP, Golongan, Jabatan
3. Review preview data yang akan diupdate
4. Klik "Konfirmasi & Simpan" 
5. Data akan otomatis terupload ke GitHub repository

## Fitur

- ✅ Upload file Excel
- ✅ Preview data sebelum update
- ✅ Auto upload ke GitHub
- ✅ Backup ke localStorage
- ✅ Responsive design
- ✅ Real-time server status