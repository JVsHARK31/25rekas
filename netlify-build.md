# Deploy eRKAS Pro ke Netlify - Panduan Lengkap

## Persiapan Database
1. **Setup Neon Database:**
   - Daftar di neon.tech (gratis)
   - Buat database PostgreSQL baru
   - Copy connection string

2. **Setup Vercel untuk Backend API:**
   - Deploy server ke Vercel (serverless functions)
   - Set DATABASE_URL di environment variables

## Build untuk Netlify (Frontend Only)

### Step 1: Build Frontend
```bash
npm run build
```

### Step 2: Deploy ke Netlify
1. Upload folder `dist/public` ke Netlify
2. Set redirects untuk SPA:
   - From: `/*` 
   - To: `/index.html`
   - Status: 200

### Step 3: Update API Base URL
Update di client untuk point ke Vercel backend:
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-vercel-api.vercel.app'
  : 'http://localhost:5000';
```

## Environment Variables di Netlify
Set di Netlify dashboard:
- `VITE_API_BASE_URL=https://your-vercel-api.vercel.app`

## Alternative: Full Deployment ke Vercel
Vercel mendukung full-stack Node.js aplikasi dengan database.