# RKAS Jakarta - Sistem Rencana Kegiatan dan Anggaran Sekolah

## 📋 Deskripsi Sistem

RKAS Jakarta adalah sistem informasi manajemen untuk Rencana Kegiatan dan Anggaran Sekolah (RKAS) yang dikembangkan khusus untuk sekolah-sekolah di DKI Jakarta. Sistem ini membantu sekolah dalam merencanakan, mengelola, dan memantau kegiatan serta anggaran sekolah sesuai dengan 8 Standar Nasional Pendidikan.

## 🎯 Fitur Utama

### 📊 Dashboard & Monitoring
- **Dashboard Interaktif**: Ringkasan statistik dan progress anggaran
- **Real-time Charts**: Visualisasi data dengan Chart.js
- **Progress Tracking**: Monitoring progress kegiatan dan anggaran
- **Alert System**: Notifikasi untuk deadline dan approval

### 🗃️ Master Data Management
- **Data Bidang**: Kelola 8 bidang kegiatan RKAS
- **Data Standar**: Kelola 8 standar nasional pendidikan
- **Data Sumber Dana**: Kelola berbagai sumber pendanaan
- **Data Rekening**: Kelola kode rekening anggaran
- **Data Komponen**: Kelola komponen belanja

### 📝 Perencanaan RKAS
- **Input Kegiatan**: Form lengkap untuk input kegiatan RKAS
- **Input Rincian**: Detail rincian anggaran per kegiatan
- **Anggaran Kas**: Perencanaan kas belanja bulanan
- **Realisasi**: Input dan tracking realisasi anggaran

### 📈 Monitoring & Laporan
- **Status Kegiatan**: Monitor status approval kegiatan
- **Progress Anggaran**: Tracking penggunaan anggaran
- **Laporan Bulanan**: Generate laporan berkala
- **Export Data**: Export ke Excel dan PDF

### 👥 Administrasi
- **User Management**: Kelola pengguna dan role
- **Approval Workflow**: Sistem persetujuan bertingkat
- **Audit Trail**: Log aktivitas sistem
- **System Settings**: Konfigurasi sistem

## 🛠️ Teknologi yang Digunakan

### Frontend
- **Next.js 14**: React framework dengan App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern UI components
- **Lucide React**: Beautiful icons

### Backend & Database
- **Supabase**: Backend-as-a-Service
- **PostgreSQL**: Relational database
- **Row Level Security**: Database security
- **Real-time subscriptions**: Live data updates

### Tools & Libraries
- **Chart.js**: Data visualization
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **date-fns**: Date manipulation
- **jsPDF**: PDF generation
- **xlsx**: Excel file handling

## 🚀 Instalasi dan Setup

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Akun Supabase

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/your-repo/rkas-jakarta.git
cd rkas-jakarta
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
# atau
yarn install
\`\`\`

### 3. Setup Environment Variables
Buat file `.env.local` dan tambahkan:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 4. Setup Database
1. Buat project baru di Supabase
2. Jalankan script SQL di `scripts/database-schema.sql`
3. Jalankan script seed data di `scripts/seed-data.sql`

### 5. Run Development Server
\`\`\`bash
npm run dev
# atau
yarn dev
\`\`\`

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📱 Responsive Design

Sistem ini didesain dengan pendekatan **mobile-first** dan sepenuhnya responsif:

- **Mobile (< 640px)**: Card layout, touch-friendly interface
- **Tablet (640px - 1024px)**: Adaptive grid, collapsible sidebar
- **Desktop (> 1024px)**: Full table view, expanded sidebar

## 🔐 Authentication & Authorization

### User Roles
- **Super Admin**: Full access ke semua fitur
- **Operator**: Input dan edit data RKAS
- **Viewer**: Read-only access

### Default Login
\`\`\`
Email: admin@rkas.com
Password: 123456
\`\`\`

## 📊 Database Schema

### Core Tables
- `profiles`: User profiles dan roles
- `rkas_activities`: Data kegiatan RKAS
- `rkas_rincian`: Rincian anggaran kegiatan
- `rkas_bidang`: Master data bidang
- `rkas_standar`: Master data standar
- `rkas_dana`: Master data sumber dana

## 🎨 UI/UX Features

### Design System
- **Consistent Colors**: Green untuk primary, blue untuk secondary
- **Typography Scale**: Hierarchical text sizing
- **Spacing System**: Consistent margins dan padding
- **Shadow System**: Layered depth dengan shadows

### Interactive Elements
- **Loading States**: Skeleton loading dan spinners
- **Error States**: User-friendly error messages
- **Success States**: Toast notifications
- **Empty States**: Helpful empty state illustrations

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels dan descriptions
- **Color Contrast**: WCAG compliant colors
- **Focus Management**: Clear focus indicators

## 📈 Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Caching**: Supabase query caching
- **Lazy Loading**: Components loaded on demand
- **Bundle Analysis**: Optimized bundle size

## 🔧 Development Guidelines

### Code Structure
\`\`\`
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable components
│   ├── ui/             # Base UI components
│   ├── layout/         # Layout components
│   ├── rkas/           # RKAS specific components
│   └── dashboard/      # Dashboard components
├── lib/                # Utilities dan configurations
├── hooks/              # Custom React hooks
└── types/              # TypeScript type definitions
\`\`\`

### Naming Conventions
- **Components**: PascalCase (e.g., `RKASTable`)
- **Files**: kebab-case (e.g., `rkas-table.tsx`)
- **Variables**: camelCase (e.g., `userData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

## 🚀 Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Connect repository di Vercel
3. Add environment variables
4. Deploy automatically

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## 📝 Changelog

### Version 1.0.0 (2025)
- ✅ Initial release
- ✅ Complete CRUD operations
- ✅ Responsive design
- ✅ User authentication
- ✅ Dashboard dengan charts
- ✅ Export functionality
- ✅ Mobile-first design

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Team

- **Developer**: RKAS Development Team
- **Designer**: UI/UX Team
- **Project Manager**: Education Technology Team

## 📞 Support

Untuk bantuan dan support:
- Email: support@rkas-jakarta.com
- Documentation: [docs.rkas-jakarta.com](https://docs.rkas-jakarta.com)
- Issues: [GitHub Issues](https://github.com/your-repo/rkas-jakarta/issues)

---

**© 2025 Pemprov DKI Jakarta - Dinas Pendidikan DKI Jakarta**

*Sistem RKAS Jakarta dikembangkan untuk mendukung digitalisasi pendidikan di DKI Jakarta*
