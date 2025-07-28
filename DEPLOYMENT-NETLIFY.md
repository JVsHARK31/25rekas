# 🚀 Deployment eRKAS Pro ke Netlify - Panduan Lengkap

## ✅ Persiapan Selesai
Files sudah disiapkan untuk deployment:
- ✅ Frontend build: `dist/public/` (755KB optimized)
- ✅ Redirects config: `_redirects` file untuk SPA routing
- ✅ API config: Dynamic API URL untuk production/development
- ✅ Backend config: `vercel.json` untuk API deployment

## 📋 Step-by-Step Deployment

### STEP 1: Setup Database Eksternal
Karena Netlify tidak support database, gunakan **Neon.tech** (gratis):

1. **Daftar di neon.tech**
   - Buka: https://neon.tech
   - Sign up gratis dengan GitHub/Google
   
2. **Buat Database Baru**
   - Create new project: "erkas-pro-db"
   - Region: pilih terdekat (Singapore/US East)
   - Copy CONNECTION STRING (dimulai dengan postgresql://)

### STEP 2: Deploy Backend ke Vercel
Backend harus di service terpisah karena Netlify cuma static:

1. **Buat akun Vercel.com**
   - Import project dari GitHub/upload files
   - Upload folder server/ + shared/ + vercel.json
   
2. **Set Environment Variables di Vercel:**
   ```
   DATABASE_URL = postgresql://username:password@host/dbname
   NODE_ENV = production
   ```

3. **Deploy dan dapatkan URL:**
   - Contoh: https://erkas-pro-api.vercel.app

### STEP 3: Deploy Frontend ke Netlify

1. **Upload ke Netlify:**
   - Drag & drop folder `dist/public/` ke netlify.com
   - Atau connect GitHub repository
   
2. **Set Environment Variables di Netlify:**
   ```
   VITE_API_BASE_URL = https://erkas-pro-api.vercel.app
   ```

3. **Build Settings:**
   ```
   Build command: npm run build
   Publish directory: dist/public
   ```

## 🔧 Files yang Sudah Disiapkan

### Frontend (`dist/public/`)
```
dist/public/
├── index.html              # Entry point
├── assets/
│   ├── index-A9r16pN-.css  # Styles (82KB)
│   └── index-kCM6pZOZ.js   # App bundle (755KB)
└── _redirects              # SPA routing rules
```

### Backend Config (`vercel.json`)
```json
{
  "version": 2,
  "builds": [{"src": "server/index.ts", "use": "@vercel/node"}],
  "routes": [{"src": "/api/(.*)", "dest": "/server/index.ts"}]
}
```

### API Configuration
Frontend sudah dikonfigurasi untuk:
- Development: `http://localhost:5000`
- Production: `https://erkas-pro-api.vercel.app`

## 🎯 Hasil Akhir
Setelah deploy selesai:
- **Frontend**: https://erkas-pro.netlify.app
- **Backend API**: https://erkas-pro-api.vercel.app
- **Database**: Neon PostgreSQL (persistent)

## ⚠️ Catatan Penting
1. **Database harus di-setup dulu** - data tidak akan tersimpan tanpa database
2. **Backend dan Frontend terpisah** - beda domain tapi terhubung via API
3. **CORS sudah dikonfigurasi** untuk lintas domain
4. **Authentication bekerja** dengan JWT tokens

## 🆘 Troubleshooting
- **API Error**: Pastikan VITE_API_BASE_URL benar di Netlify
- **Database Error**: Periksa DATABASE_URL di Vercel
- **404 Error**: Pastikan _redirects file ter-upload

## 📞 Alternative: Replit Deploy
Jika mau yang lebih mudah:
- 1-click deploy di Replit
- Database otomatis tersedia
- Domain langsung: .replit.app