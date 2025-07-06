<p align="center">
  <a href="#" target="_blank">
    <img src="https://github.com/miftahadzdzaudanislam/remindme/blob/main/public/logo-remindMe.png?raw=true" alt="Logo RemindMe" width="150" style="border-radius: 50%;">
  </a>
</p>

---

# RemindMe

**RemindMe** adalah aplikasi web yang membantu mahasiswa mengelola jadwal kuliah dan tugas melalui satu tampilan terintegrasi, serta menyediakan pengingat otomatis melalui WhatsApp dan Google Calendar.

---

## ✨ Fitur Utama

- 📩 **Notifikasi deadline tugas via WhatsApp**
- 📋 **Buat & kelola tugas dengan tenggat waktu**
- 📅 **Sinkronisasi jadwal ke Google Calendar**
- 📝 **Pendaftaran & login mahasiswa**
- 🧾 **Input jadwal perkuliahan**

---

## 🛠️ Teknologi

- **Laravel 12**
- **Laravel Breeze**
- **MySQL**
- **React TS**
- **Tailwind CSS**

---

## 🚀 Instalasi

```bash
git clone https://github.com/miftahadzdzaudanislam/remindme
cd remindme

composer install
echo .env
php artisan key:generate

# Sesuaikan koneksi database di file .env
php artisan migrate --seed

composer run dev
