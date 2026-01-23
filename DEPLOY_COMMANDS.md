# 🎯 DEPLOYMENT - Copy & Paste Commands

## Your GitHub Repository
```
https://github.com/sai33e0/collegeportal
```

---

## 🚀 OPTION 1: Deploy in 3 Steps (RECOMMENDED)

### Step 1: Deploy Frontend to Vercel (3 minutes)
```
✨ DO THIS MANUALLY (easier):

1. Go to: https://vercel.com
2. Click: "Add New" → "Project"
3. Click: "Import Git Repository"
4. Search: "collegeportal"
5. Select: sai33e0/collegeportal
6. Click: "Import"
7. Click: "Deploy"
8. WAIT FOR: Green checkmark (2-3 minutes)
9. YOUR URL: https://collegeportal.vercel.app ✅
```

---

### Step 2: Deploy Backend to Railway (3 minutes)
```
✨ DO THIS MANUALLY (easier):

1. Go to: https://railway.app
2. Click: "New Project"
3. Click: "Deploy from GitHub"
4. Connect GitHub (if not already)
5. Choose: sai33e0/collegeportal
6. Select Root Directory: "backend"
7. Click: "Deploy"
8. WAIT FOR: Green status
9. YOUR URL: (shown in Railway dashboard)
```

---

### Step 3: Connect Frontend to Backend (2 minutes)
```
1. Go to: Vercel Dashboard
2. Select: collegeportal project
3. Click: Settings → Environment Variables
4. Add new variable:
   - Name: NEXT_PUBLIC_API_BASE_URL
   - Value: https://your-railway-url.railway.app
5. Click: Save
6. Go to: Deployments
7. Click: "Redeploy" on latest deployment
8. DONE! ✅
```

**Result: Everything connected!**

---

## 🖥️ OPTION 2: Deploy with Commands (For DevOps)

### Prerequisites
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login
```

### Deploy Frontend
```bash
cd c:\Users\Sai\OneDrive\Desktop\project\collegeportal

# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_API_BASE_URL

# Redeploy
vercel --prod
```

### Deploy Backend
```bash
cd c:\Users\Sai\OneDrive\Desktop\project\collegeportal\backend

# Link to Railway project
railway link

# Set environment variables in Railway
railway variables set SUPABASE_URL=your-url
railway variables set SUPABASE_SERVICE_KEY=your-key
railway variables set PORT=5000
railway variables set NODE_ENV=production

# Deploy
railway up
```

---

## 📋 Check Deployment Status

### Check Vercel
```bash
vercel projects list
vercel status
```

### Check Railway
```bash
railway projects list
railway status
```

### Check Backend Health
```bash
# After deployment, test backend
curl https://your-railway-url.railway.app/health

# Should return: 200 OK
```

---

## 🔄 Auto-Deploy on Git Push

After initial setup, EVERY TIME you do:

```bash
git add .
git commit -m "Update something"
git push origin main
```

✅ **Vercel automatically rebuilds frontend**
✅ **Railway automatically rebuilds backend**
✅ **Live in 2-5 minutes**

---

## 🌐 Your Final URLs

### After Deployment:
```
Frontend:  https://collegeportal.vercel.app
Backend:   https://your-project.railway.app
Database:  https://mzvyfcnatbgbrfxfidml.supabase.co
GitHub:    https://github.com/sai33e0/collegeportal
```

---

## ✅ Test Deployment

```bash
# 1. Open frontend
https://collegeportal.vercel.app

# 2. Test login
- Use test credentials you created

# 3. Check if backend responds
curl https://your-railway-url.railway.app/health

# 4. Test database query
- Login and check if student data loads

# 5. Test animations
- Scroll page and watch animations

# 6. Test notifications
- Click any "Get Info" button in notifications
```

---

## 🔑 Environment Variables Reference

### Vercel (Frontend)
```
NEXT_PUBLIC_API_BASE_URL=https://your-railway-url.railway.app
```

### Railway (Backend)
```
SUPABASE_URL=https://mzvyfcnatbgbrfxfidml.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=5000
NODE_ENV=production
```

### Local Development
```
# Frontend (.env.local)
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# Backend (.env)
SUPABASE_URL=https://mzvyfcnatbgbrfxfidml.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=3001
NODE_ENV=development
```

---

## 🆘 Troubleshooting

### "Build failed on Vercel"
```bash
# Fix: Clear cache and redeploy
vercel env pull
vercel --prod --skip-build
```

### "Backend won't start on Railway"
```bash
# Check logs
railway logs

# Check if Supabase key is correct
# Verify in .env file
```

### "Cannot connect to backend"
```bash
# Test backend URL directly
curl https://your-railway-url.railway.app/health

# If fails, check:
# 1. Is backend running? (Railway dashboard)
# 2. Is port 5000 exposed?
# 3. Are env variables set?
```

### "Database connection error"
```bash
# Test Supabase connection
curl -H "Authorization: Bearer YOUR_SERVICE_KEY" \
  https://mzvyfcnatbgbrfxfidml.supabase.co/rest/v1/

# Check Supabase dashboard for status
```

---

## 📊 Pricing Summary

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | Free | Frontend hosting |
| Railway | $5/month | Backend + database storage |
| Supabase | Free | Up to 500MB (can upgrade) |
| **Total** | **$5/month** | Production-ready |

---

## 🎉 YOU'RE DONE!

Your college portal is:
- ✅ Deployed to Vercel (Frontend)
- ✅ Deployed to Railway (Backend)
- ✅ Connected to Supabase (Database)
- ✅ Auto-deploying on GitHub pushes
- ✅ Ready for students to use!

**Share this link:** https://collegeportal.vercel.app

---

## 📞 Support Resources

- **Vercel Help**: https://vercel.com/support
- **Railway Help**: https://railway.app/help
- **Supabase Docs**: https://supabase.com/docs
- **Your GitHub**: https://github.com/sai33e0/collegeportal

---

**Last Updated:** January 23, 2026
**Status:** ✅ Ready for Production
