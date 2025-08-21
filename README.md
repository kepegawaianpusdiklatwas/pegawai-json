# Pegawai Excel Updater

Aplikasi untuk update data pegawai dengan download file JSON hasil.

## Fitur

- ✅ Upload file Excel
- ✅ Preview data sebelum update
- ✅ Auto download file JSON hasil
- ✅ Backup ke localStorage
- ✅ Responsive design

## Cara Penggunaan

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Jalankan Aplikasi:**
   ```bash
   npm run dev
   ```

3. **Upload dan Proses:**
   - Upload file Excel dengan kolom: Nama, NIP, Golongan, Jabatan
   - Review preview data yang akan diupdate
   - Klik "Konfirmasi & Download"
   - File JSON akan otomatis terdownload
   - Upload manual file JSON ke GitHub repository Anda

## Format Excel

File Excel harus memiliki kolom dengan urutan:
1. **Nama** - Nama lengkap pegawai
2. **NIP** - Nomor Induk Pegawai
3. **Golongan** - Golongan kepangkatan
4. **Jabatan** - Jabatan pegawai

## Output

Aplikasi akan menghasilkan file `pegawai.json` yang berisi:
- Data pegawai yang sudah ada (diperbarui jika ada perubahan)
- Data pegawai baru dari file Excel
- Data diurutkan berdasarkan nama

File JSON ini siap untuk diupload ke GitHub repository Anda.