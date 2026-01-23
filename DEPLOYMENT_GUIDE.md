# 🚀 Complete Deployment Guide - SRIT College Portal

## Part 1: GitHub Setup

### Step 1: Push to GitHub
```bash
# Stage all changes
git add .

# Commit changes
git commit -m "Add animations and notifications - Ready for deployment"

# Push to GitHub
git push origin main
```

### Step 2: GitHub Repository Configuration
1. Go to https://github.com/your-username/collegeportal
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets for CI/CD:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase public key
   - `DATABASE_URL`: Your PostgreSQL connection string

---

## Part 2: Frontend Deployment (Next.js)

### Option A: Deploy on Vercel (Recommended - Free & Easiest)

**Step 1: Connect Vercel to GitHub**
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository `collegeportal`
4. Select `main` branch

**Step 2: Configure Environment Variables**
1. In Vercel Dashboard → Project Settings → Environment Variables
2. Add these variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
   ```

**Step 3: Deploy**
- Vercel auto-deploys on every push to `main`
- Your site will be at: `https://collegeportal.vercel.app`

---

### Option B: Deploy on Netlify (Alternative)

**Step 1: Connect Netlify**
1. Go to https://netlify.com
2. Click "Import an existing project"
3. Select GitHub → Choose your repo

**Step 2: Configure**
- Build command: `npm run build`
- Publish directory: `.next`
- Add environment variables in Netlify UI

**Step 3: Deploy**
- Auto-deploys on push to main

---

## Part 3: Backend Deployment (Node.js + Express)

### Option A: Deploy on Railway (Recommended - $5/month)

**Step 1: Create Railway Account**
1. Go to https://railway.app
2. Sign in with GitHub
3. Create a new project

**Step 2: Connect Backend**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link your project
cd backend
railway link

# Deploy
railway up
```

**Step 3: Configure Environment Variables**
In Railway Dashboard → Your Project → Variables:
```
NODE_ENV=production
PORT=5000
SUPABASE_URL=your-url
SUPABASE_KEY=your-key
JWT_SECRET=your-secret-key
```

**Step 4: Get Backend URL**
- Railway provides a URL like: `https://collegeportal-backend.railway.app`
- Use this in your frontend `NEXT_PUBLIC_API_URL`

---

### Option B: Deploy on Render (Alternative - Free Tier Available)

**Step 1: Create Render Account**
1. Go to https://render.com
2. Sign in with GitHub

**Step 2: Create Web Service**
1. Click "New+" → "Web Service"
2. Select your `collegeportal` repository
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node.js
   - **Plan**: Free tier available

**Step 3: Add Environment Variables**
```
NODE_ENV=production
SUPABASE_URL=your-url
SUPABASE_KEY=your-key
JWT_SECRET=your-secret
```

**Step 4: Deploy**
- Render auto-deploys from GitHub
- Get your URL from dashboard

---

### Option C: Deploy on Railway + Heroku (Full Stack)

**Step 1: Database**
- Keep using Supabase (already configured)

**Step 2: Backend on Railway** (see Option A above)

**Step 3: Frontend on Vercel** (see Option A in Part 2)

---

## Part 4: Database Configuration

Your Supabase is already set up. Ensure:

**Step 1: Verify Supabase Connection**
```bash
# In your backend, test connection
node -e "require('dotenv').config(); const { createClient } = require('@supabase/supabase-js'); const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY); console.log('Connected');"
```

**Step 2: Set Backend Connection String**
Update your backend `.env` to use Supabase:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

---

## Part 5: CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm run build
      
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
        run: npx vercel --prod --token $VERCEL_TOKEN

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          cd backend
          npm install
          railway up
```

---

## Part 6: Complete Deployment Steps (All at Once)

### Step 1: Prepare Project
```bash
# Navigate to project root
cd c:\Users\Sai\OneDrive\Desktop\project\collegeportal

# Install dependencies
npm install
cd backend && npm install && cd ..

# Create .env files

# Frontend: Create .env.local in root
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Backend: Create .env in backend/
cd backend
echo "NODE_ENV=development" > .env
echo "PORT=5000" >> .env
echo "SUPABASE_URL=your-url" >> .env
echo "SUPABASE_KEY=your-key" >> .env
cd ..
```

### Step 2: Test Locally
```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
npm run dev

# Visit http://localhost:5173
```

### Step 3: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment - all features complete"
git push origin main
```

### Step 4: Deploy Frontend to Vercel
1. Go to https://vercel.com/import
2. Select your GitHub repo
3. Click Import
4. Set environment variables
5. Click Deploy

### Step 5: Deploy Backend to Railway
1. Go to https://railway.app
2. Create new project
3. Connect GitHub repo (select `backend` folder)
4. Add environment variables
5. Deploy automatically

### Step 6: Update Frontend Environment
After backend deployment, update Vercel environment:
```
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.com
```

---

## Part 7: Custom Domain Setup

### Add Custom Domain to Vercel
1. Go to Vercel Dashboard → Project Settings
2. Click "Domains"
3. Add your domain (e.g., `sritportal.com`)
4. Update DNS records as shown

### Add Custom Domain to Railway
1. Go to Railway Dashboard → Your Backend
2. Click Settings → Domains
3. Add custom domain
4. Update DNS records

---

## Part 8: Monitoring & Logs

### Check Vercel Logs
- Dashboard → Functions → Logs
- Or: `vercel logs`

### Check Railway Logs
- Railway Dashboard → Your Project → Logs
- Or: `railway logs`

### Monitor Backend Health
```bash
# Add health check endpoint
curl https://your-backend-url.com/health
```

---

## Part 9: Security Checklist

✅ **Before Deployment:**
- [ ] Remove `.env` from git history: `git rm --cached .env`
- [ ] Add `*.env` to `.gitignore`
- [ ] Change JWT secret to random string
- [ ] Update CORS to only allow production domains
- [ ] Enable HTTPS everywhere
- [ ] Set secure database passwords
- [ ] Enable API rate limiting
- [ ] Add API authentication for admin routes

**Update Backend CORS:**
```javascript
app.use(cors({
  origin: ['https://collegeportal.vercel.app', 'https://yourdomain.com'],
  credentials: true
}));
```

---

## Part 10: Troubleshooting

### Frontend Won't Load
```bash
# Clear Vercel cache
vercel --prod --skip-build

# Check env variables in Vercel
echo $NEXT_PUBLIC_API_URL
```

### Backend Connection Failed
```bash
# Check Supabase connection
curl -H "Authorization: Bearer YOUR_KEY" \
  https://your-project.supabase.co/rest/v1/
```

### Database Errors
1. Check Supabase dashboard → SQL editor
2. Run migrations if needed
3. Verify service role key has permissions

### Port Already in Use
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## Part 11: Auto-Deploy on Push

Your setup will be:
1. **Push to GitHub** → Automatic
2. **Vercel** builds & deploys frontend → Automatic
3. **Railway** builds & deploys backend → Automatic
4. **Live in ~2-5 minutes** ✨

---

## Deployment Summary Table

| Component | Platform | Cost | URL |
|-----------|----------|------|-----|
| Frontend | Vercel | Free | `collegeportal.vercel.app` |
| Backend | Railway | $5/mo | `railway-url.railway.app` |
| Database | Supabase | Free | (included) |
| **Total** | - | **$5/month** | - |

---

## Quick Start (TL;DR)

```bash
# 1. Push to GitHub
git add .
git commit -m "Deployment ready"
git push origin main

# 2. Deploy Frontend
# Go to vercel.com → Import → Select repo → Deploy

# 3. Deploy Backend
# Go to railway.app → New Project → Select GitHub → Deploy

# 4. Update Frontend Env in Vercel
# Add NEXT_PUBLIC_API_URL from Railway

# 5. Done! ✨
```

---

## Need Help?

- **Vercel Issues**: https://vercel.com/support
- **Railway Issues**: https://railway.app/help
- **Supabase Issues**: https://supabase.com/docs
- **GitHub Actions**: https://docs.github.com/en/actions

Your project is production-ready! 🎉
