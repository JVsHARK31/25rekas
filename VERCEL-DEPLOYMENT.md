# RKAS Management System - Deployment Guide

## Deployment ke Vercel

### Prerequisites
1. Akun Vercel (https://vercel.com)
2. Database Supabase yang sudah dikonfigurasi
3. Repository Git (GitHub, GitLab, atau Bitbucket)

### Langkah-langkah Deployment

#### 1. Persiapan Repository
```bash
# Push kode ke repository Git
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

#### 2. Setup di Vercel
1. Login ke Vercel Dashboard
2. Klik "New Project"
3. Import repository dari Git provider
4. Pilih repository RKAS Management System

#### 3. Konfigurasi Environment Variables
Di Vercel Dashboard, tambahkan environment variable berikut:

```
DATABASE_URL=postgresql://postgres:Javier_310706@db.wchsoxntsnzurfpucplg.supabase.co:5432/postgres
```

#### 4. Build Settings
Vercel akan otomatis mendeteksi konfigurasi dari `vercel.json`:
- **Build Command**: `npm run build`
- **Output Directory**: `client/dist`
- **Install Command**: `npm install`

#### 5. Deploy
1. Klik "Deploy"
2. Tunggu proses build selesai
3. Aplikasi akan tersedia di URL yang diberikan Vercel

### Struktur Deployment

```
├── api/
│   └── index.ts          # Serverless function entry point
├── client/
│   └── dist/             # Frontend build output
├── server/
│   ├── index.ts          # Backend server
│   ├── routes.ts         # API routes
│   └── db.ts             # Database connection
├── shared/
│   └── schema.ts         # Database schema
└── vercel.json           # Vercel configuration
```

### Database Setup

Pastikan database Supabase memiliki tabel-tabel berikut:
- `users`
- `rkas_activities`
- `rkas_budget_items`
- `user_preferences`

### Environment Variables yang Diperlukan

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |

### Troubleshooting

#### Build Errors
- Pastikan semua dependencies terinstall
- Check TypeScript errors dengan `npm run check`
- Verify database connection string

#### Runtime Errors
- Check Vercel function logs
- Verify environment variables
- Test database connectivity

#### Database Connection Issues
- Verify Supabase database is accessible
- Check connection string format
- Ensure database tables exist

### Custom Domain (Optional)
1. Di Vercel Dashboard, pilih project
2. Go to "Settings" > "Domains"
3. Add custom domain
4. Follow DNS configuration instructions

### Monitoring
- Vercel provides built-in analytics
- Monitor function execution times
- Check error rates in dashboard

### Updates
Untuk update aplikasi:
1. Push changes ke repository
2. Vercel akan otomatis rebuild dan deploy
3. Zero-downtime deployment

### Support
Jika mengalami masalah:
1. Check Vercel documentation
2. Review build logs
3. Test locally dengan `npm run build` dan `npm start`