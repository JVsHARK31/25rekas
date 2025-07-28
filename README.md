# RKAS Management System

Sistem Manajemen RKAS (Rencana Kegiatan dan Anggaran Sekolah) - Aplikasi web untuk mengelola perencanaan kegiatan dan anggaran sekolah.

## Fitur Utama

- Dashboard dengan statistik anggaran
- Manajemen kegiatan RKAS
- Sistem autentikasi pengguna
- Manajemen file dan dokumen
- Laporan dan monitoring
- Master data (bidang, standar, sumber dana, dll)

## Teknologi

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: SQLite dengan Drizzle ORM
- **UI**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query

## Instalasi

1. Clone repository
```bash
git clone https://github.com/JVsHARK31/reksopss25.git
cd reksopss25
```

2. Install dependencies
```bash
npm install
```

3. Jalankan aplikasi
```bash
npm run dev
```

4. Buka browser di `http://localhost:3001`

## Struktur Project

```
├── client/          # Frontend React app
├── server/          # Backend Express server
├── shared/          # Shared types dan schema
└── migrations/      # Database migrations
```

## Kontribusi

Silakan buat pull request untuk kontribusi pada project ini.

## Lisensi

MIT License