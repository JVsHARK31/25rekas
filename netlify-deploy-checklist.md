# ✅ Netlify Deployment Checklist untuk eRKAS Pro

## Status: SIAP DEPLOY ✅

### Files Ready:
- ✅ Frontend build: `dist/public/` (755KB, optimized)
- ✅ _redirects file: Untuk SPA routing 
- ✅ API config: Dynamic URL switching
- ✅ Responsive design: Mobile + Desktop ready

### Next Steps:

#### 1. Database Setup (Neon.tech)
```bash
# 1. Register at neon.tech (free)
# 2. Create project: "erkas-pro-db" 
# 3. Copy connection string
```

#### 2. Backend Deploy (Vercel)
```bash
# Upload files: server/ + shared/ + vercel.json
# Set env: DATABASE_URL=postgresql://...
# Get API URL: https://your-app.vercel.app
```

#### 3. Frontend Deploy (Netlify)
```bash
# Upload folder: dist/public/
# Set env: VITE_API_BASE_URL=https://your-api.vercel.app
# Result: https://your-app.netlify.app
```

### Ready Files Structure:
```
dist/public/
├── index.html (0.6KB)
├── _redirects (SPA routing)
└── assets/
    ├── index-A9r16pN-.css (82KB)
    └── index-kCM6pZOZ.js (755KB)
```

### Environment Variables Needed:
**Netlify (Frontend):**
- VITE_API_BASE_URL=https://your-api-url.vercel.app

**Vercel (Backend):**  
- DATABASE_URL=postgresql://user:pass@host/db
- NODE_ENV=production

### Test Checklist After Deploy:
- [ ] Login works (admin@rkas.com / 123456)
- [ ] Data CRUD operations
- [ ] Period filters (TW1-TW4)
- [ ] Responsive design
- [ ] API connectivity

## 🎯 Alternative: Replit Deploy (Easier)
One-click deploy dengan database included!