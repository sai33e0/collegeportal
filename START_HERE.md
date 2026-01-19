# 🚀 SRIT College Portal - Quick Start Guide

## ⚠️ IMPORTANT: Follow Steps in Order!

---

## 📋 Pre-Requisites Checklist

Before starting, ensure you have:
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Supabase account (free tier works)
- [ ] Code editor (VS Code recommended)

---

## 🗄️ STEP 1: Supabase Setup (10 minutes)

### 1.1 Create Supabase Project

1. Go to https://supabase.com
2. Sign up / Log in
3. Click "New Project"
4. Fill in:
   - Name: `srit-portal`
   - Database Password: (save this!)
   - Region: Choose closest to you
5. Click "Create new project"
6. **Wait 2-3 minutes** for database to initialize

### 1.2 Get Your API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these 3 values (you'll need them soon):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`
   - **service_role key**: Longer string (⚠️ Keep secret!)

### 1.3 Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Open file: `collegeportal/backend/DATABASE_SCHEMA.md`
4. Copy the **ENTIRE SQL SETUP SCRIPT** (starts with "-- Enable UUID extension")
5. Paste into SQL Editor
6. Click "Run" or press `Ctrl+Enter`
7. Wait for success message
8. Verify tables created: Go to **Table Editor**, you should see:
   - users
   - departments (with 4 departments pre-loaded)
   - students
   - faculty
   - subjects
   - faculty_subjects

### 1.4 Create Test Users

**Create Admin User:**
1. Go to **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Fill in:
   - Email: `admin@srit.ac.in`
   - Password: `Admin@123`
   - ✅ Auto Confirm User: **CHECKED**
4. Click "Create user"
5. **COPY THE USER ID** (looks like: `a1b2c3d4-...`)
6. Go to **SQL Editor**, run:
```sql
INSERT INTO users (id, full_name, role_id)
VALUES ('PASTE_USER_ID_HERE', 'Admin User', 6);
```

**Create Student User:**
1. Repeat above with:
   - Email: `student@srit.ac.in`
   - Password: `Student@123`
2. After creating, copy user ID and run:
```sql
INSERT INTO users (id, full_name, role_id)
VALUES ('PASTE_STUDENT_USER_ID_HERE', 'Test Student', 1);

INSERT INTO students (user_id, roll_no, dept_id, semester, year_of_admission)
VALUES ('PASTE_STUDENT_USER_ID_HERE', '21CS001', 1, 5, 2021);
```

**Create Faculty User:**
1. Repeat above with:
   - Email: `faculty@srit.ac.in`
   - Password: `Faculty@123`
2. After creating, copy user ID and run:
```sql
INSERT INTO users (id, full_name, role_id)
VALUES ('PASTE_FACULTY_USER_ID_HERE', 'Test Faculty', 2);

INSERT INTO faculty (user_id, employee_id, dept_id, designation)
VALUES ('PASTE_FACULTY_USER_ID_HERE', 'FAC001', 1, 'Assistant Professor');
```

✅ **Verify:** Go to **Table Editor** → `users` → Should see 3 users with role_id 6, 1, and 2

---

## 🖥️ STEP 2: Backend Setup (5 minutes)

### 2.1 Install Dependencies

```bash
cd collegeportal/backend
npm install
```

Expected output: "added 84 packages"

### 2.2 Configure Environment

```bash
# Edit the .env file that already exists
nano .env
# Or use your editor
```

Replace these values with YOUR Supabase credentials:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-key
PORT=5000
NODE_ENV=development
```

⚠️ **CRITICAL:**
- No quotes around values
- No spaces around `=`
- Service key is different from anon key!

### 2.3 Start Backend

```bash
npm run dev
```

**Expected Output:**
```
===========================================
  SRIT College Portal Backend
===========================================
  Server running on: http://localhost:5000
  Environment: development
  Health check: http://localhost:5000/health
===========================================
```

### 2.4 Test Backend

**Test 1: Health Check**
```bash
curl http://localhost:5000/health
```
Should return: `{"status":"ok", ...}`

**Test 2: Admin Login**
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@srit.ac.in","password":"Admin@123"}'
```

Should return:
```json
{
  "access_token": "eyJ...",
  "role_id": 6,
  "user": {...}
}
```

✅ **If you get the token, backend is working perfectly!**

❌ **If you get errors:**
- "Invalid credentials" → Check user was created in Step 1.4
- "Missing Supabase configuration" → Check .env file
- Connection refused → Backend not started

---

## 🌐 STEP 3: Frontend Setup (3 minutes)

**Open NEW terminal** (keep backend running!)

### 3.1 Install Dependencies (if not already)

```bash
cd collegeportal
npm install
```

### 3.2 Start Frontend

```bash
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.0.1
- Local:        http://localhost:5173
```

⚠️ **MUST be port 5173** (backend CORS is configured for this port)

### 3.3 Test Frontend

1. Open browser: http://localhost:5173
2. Should automatically redirect to `/login`
3. Login page should show:
   - SRIT header with logo
   - "College Portal Login" title
   - Email and Password fields
   - Purple gradient background

---

## ✅ STEP 4: Full System Test (5 minutes)

### Test Admin Flow

1. **Login:**
   - Email: `admin@srit.ac.in`
   - Password: `Admin@123`
   - Click "LOGIN"

2. **Verify:**
   - ✅ Redirects to `/admin`
   - ✅ Header shows "Admin"
   - ✅ Dashboard shows "Admin Dashboard"
   - ✅ 3 placeholder modules visible

3. **Test Logout:**
   - Click "Logout" button
   - ✅ Redirects to `/login`

### Test Student Flow

1. **Login:**
   - Email: `student@srit.ac.in`
   - Password: `Student@123`

2. **Verify:**
   - ✅ Redirects to `/student`
   - ✅ Header shows "Student"
   - ✅ Dashboard shows "Student Dashboard"

### Test Faculty Flow

1. **Login:**
   - Email: `faculty@srit.ac.in`
   - Password: `Faculty@123`

2. **Verify:**
   - ✅ Redirects to `/faculty`
   - ✅ Header shows "Faculty"
   - ✅ Dashboard shows "Faculty Dashboard"

### Test Security (IMPORTANT!)

1. Login as **Student**
2. In browser address bar, manually navigate to: `http://localhost:5173/admin`
3. **Expected:** Immediately redirected to `/login` ✅
4. Students **CANNOT** access admin pages!

### Test Persistence

1. Login as any role
2. Press F5 to refresh page
3. **Expected:** Still logged in, no redirect ✅

---

## 🎉 SUCCESS! What You've Built

If all tests pass, you now have:

✅ **Backend API** running on http://localhost:5000
- JWT authentication with Supabase
- Role-based access control (Admin, Student, Faculty)
- RESTful APIs for all operations
- PostgreSQL database with proper schema

✅ **Frontend App** running on http://localhost:5173
- Next.js 16 with App Router
- Role-based routing and redirects
- Protected routes with middleware
- SRIT branding and professional UI

✅ **3 User Types** with different permissions
- Admin can manage everything
- Students can view their data
- Faculty can view their classes

✅ **Production-Ready Architecture**
- Clean code separation
- Proper error handling
- Secure token storage
- Extensible structure

---

## 🚨 Troubleshooting

### Backend Won't Start

**Error:** "Missing Supabase configuration"
```bash
# Check .env file exists
ls -la backend/.env

# Check content
cat backend/.env

# Make sure no spaces around = and no quotes
```

**Error:** "EADDRINUSE port 5000"
```bash
# Port already in use, kill process
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env
PORT=5001
```

### Login Fails

**Error:** "Invalid credentials"
1. Verify user exists in Supabase Auth
2. Check password is exactly `Admin@123`
3. Verify user record in `users` table

**Error:** "User role not found"
1. Check SQL INSERT ran successfully
2. Verify role_id is 1, 2, or 6
3. Check user ID matches between auth.users and users table

### Frontend Issues

**Port 3000 instead of 5173:**
```bash
# Check package.json
cat package.json | grep "dev"
# Should show: "dev": "next dev -p 5173"
```

**CORS Error in Browser:**
1. Frontend MUST be on port 5173
2. Backend CORS is set for http://localhost:5173
3. Restart both servers if you changed ports

**White screen / Won't load:**
```bash
# Check browser console (F12)
# Look for errors
# Common: TypeScript errors or missing dependencies
npm install
```

### Token Issues

**"Invalid or expired token":**
- Tokens expire after time
- Logout and login again
- Clear localStorage: Browser DevTools → Application → Local Storage → Clear

**Can access wrong role pages:**
- Clear localStorage completely
- Hard refresh (Ctrl+Shift+R)
- Check you're logged in as correct user

---

## 📂 Important File Locations

| Need to... | File |
|------------|------|
| Change Supabase keys | `backend/.env` |
| See API endpoints | `backend/API_TESTING_GUIDE.md` |
| See database schema | `backend/DATABASE_SCHEMA.md` |
| Add backend route | `backend/src/routes/` |
| Add frontend page | `src/app/` |
| Change styling | `src/app/globals.css` |
| API constants | `src/lib/constants.ts` |
| Auth utilities | `src/lib/auth.ts` |

---

## 🔄 Daily Development Workflow

**Starting Work:**
```bash
# Terminal 1 - Backend
cd collegeportal/backend
npm run dev

# Terminal 2 - Frontend
cd collegeportal
npm run dev
```

**Making Changes:**
- Backend: Edit files in `backend/src/` → auto-restarts
- Frontend: Edit files in `src/` → hot reload
- Database: SQL changes in Supabase dashboard

**Testing:**
- Backend: Use Thunder Client or curl
- Frontend: Browser at http://localhost:5173
- Always test in browser as different roles

---

## 🎯 Next Steps

Once everything works:

**Phase 3: Admin UI**
- Build user management interface
- Add subject creation forms
- Faculty assignment UI

**Phase 4: Academic Features**
- Marks/grades system
- Attendance tracking
- Result generation

**Phase 5: Advanced Features**
- Notifications
- Reports and analytics
- PDF generation
- Email notifications

---

## 📚 Documentation

- **Backend:** `backend/README.md`
- **Database:** `backend/DATABASE_SCHEMA.md`
- **API Testing:** `backend/API_TESTING_GUIDE.md`
- **Setup:** `SETUP_GUIDE.md`
- **This File:** Quick start reference

---

## 🆘 Need Help?

1. Check error message carefully
2. Look in relevant documentation
3. Check browser console (F12)
4. Check backend terminal for logs
5. Verify database in Supabase dashboard

---

**Current Status:** ✅ Phase 1 & 2 Complete - Full Auth System Working!

**Institution:** Srinivasa Ramanujan Institute of Technology
**Website:** https://www.srit.ac.in/
