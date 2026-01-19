# SRIT College Portal - Complete Setup Guide

## Project Overview

**SRIT College Portal** - A production-grade college management system for Srinivasa Ramanujan Institute of Technology.

**Architecture:**
- **Backend:** Node.js + Express + Supabase (PostgreSQL + Auth)
- **Frontend:** React 19 + Next.js 16 + Vite + TypeScript
- **Authentication:** JWT tokens via Supabase
- **Role-based Access:** Admin (6), Faculty (2), Student (1)

---

## Project Structure

```
collegeportal/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── app.js          # Express app
│   │   ├── config/         # Supabase client
│   │   ├── middleware/     # Auth & role checking
│   │   └── routes/         # API endpoints
│   ├── server.js           # Server entry point
│   ├── package.json
│   ├── .env.example
│   ├── README.md
│   ├── DATABASE_SCHEMA.md
│   └── API_TESTING_GUIDE.md
│
├── src/                     # Next.js Frontend
│   ├── app/                # App router pages
│   │   ├── page.tsx       # Root redirect
│   │   ├── login/         # Login page
│   │   ├── admin/         # Admin dashboard
│   │   ├── student/       # Student dashboard
│   │   └── faculty/       # Faculty dashboard
│   ├── components/        # Shared components
│   │   ├── Header.tsx
│   │   └── ProtectedRoute.tsx
│   └── lib/               # Utilities
│       ├── auth.ts
│       └── constants.ts
│
├── package.json            # Frontend dependencies
└── SETUP_GUIDE.md         # This file
```

---

## Phase 1: Backend Setup (Complete This First!)

### Step 1: Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Wait for database to initialize
4. Note down:
   - Project URL
   - Anon key
   - Service role key (Settings → API)

### Step 2: Database Schema

1. Open Supabase SQL Editor
2. Open `backend/DATABASE_SCHEMA.md`
3. Copy the entire SQL setup script
4. Paste and run in SQL Editor
5. Verify tables created:
   - users
   - departments
   - students
   - faculty
   - subjects
   - faculty_subjects

### Step 3: Create Test Users

**Option A: Via Supabase Dashboard**

1. Go to Authentication → Users
2. Add new user:
   - Email: `admin@srit.ac.in`
   - Password: `Admin@123`
   - Auto-confirm email: ✅
3. Copy the user ID
4. Go to SQL Editor, run:
```sql
INSERT INTO users (id, full_name, role_id)
VALUES ('<paste-user-id-here>', 'Admin User', 6);
```

Repeat for:
- Student: `student@srit.ac.in` / `Student@123` (role_id = 1)
- Faculty: `faculty@srit.ac.in` / `Faculty@123` (role_id = 2)

**Important:** For student, also insert into students table:
```sql
INSERT INTO students (user_id, roll_no, dept_id, semester, year_of_admission)
VALUES ('<student-user-id>', '21CS001', 1, 5, 2021);
```

For faculty, also insert into faculty table:
```sql
INSERT INTO faculty (user_id, employee_id, dept_id, designation)
VALUES ('<faculty-user-id>', 'FAC001', 1, 'Assistant Professor');
```

### Step 4: Backend Configuration

```bash
cd collegeportal/backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
PORT=5000
NODE_ENV=development
```

### Step 5: Start Backend

```bash
npm run dev
```

Expected output:
```
===========================================
  SRIT College Portal Backend
===========================================
  Server running on: http://localhost:5000
  Environment: development
  Health check: http://localhost:5000/health
===========================================
```

### Step 6: Test Backend

**Method 1: Browser**
Open http://localhost:5000/health

**Method 2: Curl**
```bash
curl http://localhost:5000/health
```

**Method 3: Thunder Client (Recommended)**
Follow `backend/API_TESTING_GUIDE.md` for complete testing workflow.

**Critical Tests:**
1. ✅ Health check responds
2. ✅ Login as admin returns token + role_id
3. ✅ Admin can create users
4. ✅ Admin can create subjects
5. ✅ Student can view profile
6. ✅ Faculty can view profile

**⚠️ Do NOT proceed to Phase 2 until all backend tests pass!**

---

## Phase 2: Frontend Setup (After Backend Works)

### Step 1: Install Frontend Dependencies

```bash
cd collegeportal
npm install
```

### Step 2: Verify Frontend Configuration

The frontend is already configured:
- ✅ Port 5173 (matches backend CORS)
- ✅ API base URL: http://localhost:5000
- ✅ Role constants: Admin=6, Student=1, Faculty=2
- ✅ Protected routes setup
- ✅ SRIT branding

### Step 3: Start Frontend

```bash
npm run dev
```

Expected output:
```
▲ Next.js 16.0.1
- Local:        http://localhost:5173
```

### Step 4: Test Complete Flow

**Test 1: Admin Login**
1. Open http://localhost:5173
2. Should redirect to /login
3. Login with: `admin@srit.ac.in` / `Admin@123`
4. Should redirect to /admin dashboard
5. Verify header shows "Admin"
6. Click Logout
7. Should return to /login

**Test 2: Student Login**
1. Go to http://localhost:5173/login
2. Login with: `student@srit.ac.in` / `Student@123`
3. Should redirect to /student dashboard
4. Verify header shows "Student"

**Test 3: Faculty Login**
1. Go to http://localhost:5173/login
2. Login with: `faculty@srit.ac.in` / `Faculty@123`
3. Should redirect to /faculty dashboard
4. Verify header shows "Faculty"

**Test 4: Protected Routes**
1. Login as student
2. Manually navigate to /admin
3. Should be immediately redirected to /login
4. Student CANNOT access admin pages ✅

**Test 5: Page Refresh**
1. Login as any role
2. Refresh page (F5)
3. Should stay logged in
4. Token persists in localStorage ✅

---

## Phase 3: Development Workflow

### Running Both Servers

**Terminal 1 - Backend:**
```bash
cd collegeportal/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd collegeportal
npm run dev
```

### Making Changes

**Backend Changes:**
1. Edit files in `backend/src/`
2. Server auto-restarts (--watch flag)
3. Test via Thunder Client
4. Verify no errors in terminal

**Frontend Changes:**
1. Edit files in `src/`
2. Hot reload happens automatically
3. Check browser for updates
4. Check browser console for errors

---

## Common Issues & Solutions

### Issue 1: Backend won't start
**Error:** "Missing Supabase configuration"
**Fix:**
- Check `.env` file exists in `backend/` folder
- Verify all 3 Supabase keys are set
- No quotes around values in .env

### Issue 2: Login fails with 401
**Error:** "Invalid credentials"
**Fix:**
- Verify user exists in Supabase Auth
- Check password is correct
- Ensure user record exists in `users` table with role_id

### Issue 3: Login succeeds but shows wrong dashboard
**Error:** Student sees admin dashboard
**Fix:**
- Check `users` table has correct role_id
- Verify frontend is using latest code
- Clear localStorage and login again

### Issue 4: "Insufficient permissions" after login
**Fix:**
- User exists in auth but not in users table
- Run INSERT statement to add user to users table
- Make sure role_id matches auth user's intended role

### Issue 5: CORS error in browser
**Error:** "Access-Control-Allow-Origin"
**Fix:**
- Backend CORS is set for http://localhost:5173
- Make sure frontend is running on port 5173 (not 3000)
- Check `package.json` has `"dev": "next dev -p 5173"`

### Issue 6: Token expired
**Fix:**
- Tokens expire after some time
- Logout and login again
- Future: Implement token refresh

### Issue 7: Can't access admin routes
**Fix:**
- Verify logged in user has role_id = 6
- Check token is being sent in Authorization header
- Test backend API directly with Thunder Client

---

## Development Checklist

### Phase 1: Backend (DO THIS FIRST)
- [ ] Supabase project created
- [ ] Database schema deployed
- [ ] Test users created (admin, student, faculty)
- [ ] Backend .env configured
- [ ] Backend dependencies installed
- [ ] Backend server starts successfully
- [ ] Health check endpoint works
- [ ] Login returns token for all roles
- [ ] Admin APIs tested
- [ ] Student APIs tested
- [ ] Faculty APIs tested

### Phase 2: Frontend (AFTER BACKEND WORKS)
- [ ] Frontend dependencies installed
- [ ] Frontend starts on port 5173
- [ ] Can access login page
- [ ] Admin login → admin dashboard
- [ ] Student login → student dashboard
- [ ] Faculty login → faculty dashboard
- [ ] Logout works for all roles
- [ ] Protected routes block wrong roles
- [ ] Page refresh maintains login state

### Phase 3: Integration (BOTH WORKING)
- [ ] Both servers running simultaneously
- [ ] Login flow end-to-end works
- [ ] Role-based redirects correct
- [ ] API calls return proper data
- [ ] Error handling works
- [ ] SRIT branding displays correctly

---

## Next Features (Phase 4)

Once basic auth and routing work:

**Admin Features:**
- ✅ Create users (already works via API)
- ✅ Create subjects (already works via API)
- ✅ Assign faculty (already works via API)
- 🔲 Build UI for these operations
- 🔲 User management interface
- 🔲 Department management

**Student Features:**
- 🔲 View enrolled subjects
- 🔲 View marks/grades
- 🔲 View attendance
- 🔲 Download result PDF

**Faculty Features:**
- 🔲 View assigned classes
- 🔲 Upload marks
- 🔲 Take attendance
- 🔲 View student roster

---

## Production Deployment

### Backend
1. Set NODE_ENV=production
2. Use environment variables (not .env file)
3. Deploy to:
   - Railway.app
   - Render.com
   - DigitalOcean
   - AWS EC2

### Frontend
1. Run `npm run build`
2. Deploy to:
   - Vercel (recommended for Next.js)
   - Netlify
   - Cloudflare Pages

### Environment Variables
Update CORS origin to your production frontend URL:
```javascript
// backend/src/app.js
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

Update API base URL in frontend:
```typescript
// src/lib/constants.ts
export const API_BASE_URL = "https://your-backend-domain.com";
```

---

## File Locations Quick Reference

| Need to... | File Location |
|------------|---------------|
| Change backend port | `backend/.env` (PORT=5000) |
| Change frontend port | `package.json` (--dev -p 5173) |
| Add new backend route | `backend/src/routes/` |
| Add auth middleware | `backend/src/middleware/auth.js` |
| See database schema | `backend/DATABASE_SCHEMA.md` |
| Test APIs | `backend/API_TESTING_GUIDE.md` |
| Add new frontend page | `src/app/` |
| Update styling | `src/app/globals.css` |
| Auth utilities | `src/lib/auth.ts` |
| API constants | `src/lib/constants.ts` |

---

## Support & Documentation

- **Backend:** See `backend/README.md`
- **Database:** See `backend/DATABASE_SCHEMA.md`
- **API Testing:** See `backend/API_TESTING_GUIDE.md`
- **Architecture:** This file (SETUP_GUIDE.md)

---

## Current Status

✅ **Phase 1 Complete:** Backend fully functional with auth, role checking, and CRUD APIs
✅ **Phase 2 Complete:** Frontend with login, role-based routing, and dashboards
⏳ **Phase 3:** Add admin features, marks system, results
⏳ **Phase 4:** Attendance, notifications, reports

---

**Institution:** Srinivasa Ramanujan Institute of Technology
**Website:** https://www.srit.ac.in/
**Architecture:** Clean, production-ready, extendable
**Built with:** Real college project standards, not tutorial code
