# 🚀 OpenLand Deployment Guide

## Overview
Deploy OpenLand using **Vercel** (frontend) + **Railway** (backend + PostgreSQL)

---

## Step 1: Push to GitHub

First, push your code to GitHub:

```bash
cd c:\xampp\htdocs\openland
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/openland.git
git push -u origin main
```

---

## Step 2: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `openland` repository
4. Click **"Add Service"** → **"Database"** → **"PostgreSQL"**
5. Click on your backend service and go to **Settings**:
   - Set **Root Directory**: `backend`
   - Set **Build Command**: `npm install && npm run build`
   - Set **Start Command**: `npm start`

6. Go to **Variables** and add:
   ```
   JWT_SECRET=your_secret_key_minimum_32_chars
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```
   
   > Railway auto-adds `DATABASE_URL` from PostgreSQL service

7. Copy your Railway backend URL (e.g., `https://openland-backend.railway.app`)

---

## Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New"** → **"Project"**
3. Import your `openland` repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   
5. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```

6. Click **Deploy**!

---

## Step 4: Update CORS

After Vercel deployment, go back to Railway and update:
```
FRONTEND_URL=https://your-actual-vercel-url.vercel.app
```

---

## 🎉 Done!

Your app is now live:
- **Frontend**: `https://openland.vercel.app`
- **Backend**: `https://openland-backend.railway.app`

---

## Custom Domain (Optional)

### Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your domain: `openland.dz`
3. Update DNS records as instructed

### Railway (Backend)
1. Go to Service Settings → Networking
2. Add custom domain: `api.openland.dz`
3. Update DNS records

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Check FRONTEND_URL in Railway |
| API not found | Verify NEXT_PUBLIC_API_URL in Vercel |
| Database error | Check DATABASE_URL connection |
