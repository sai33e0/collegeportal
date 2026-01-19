# SRIT College Portal

**Production-grade college management system for Srinivasa Ramanujan Institute of Technology**

[![Status](https://img.shields.io/badge/Status-Phase%201%20%26%202%20Complete-success)]()
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)]()
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2016-blue)]()
[![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)]()

---

## 🎯 What This Is

A complete, production-ready college management portal with:
- **JWT Authentication** via Supabase
- **Role-Based Access Control** (Admin, Faculty, Student)
- **RESTful APIs** for all operations
- **Modern Frontend** with Next.js 16 + React 19
- **PostgreSQL Database** with proper relationships
- **Clean Architecture** ready for expansion

**Not a tutorial project. Built like a real college system.**

---

## 🚀 Quick Start

### 1. Run Verification
```bash
./verify-setup.sh
```

### 2. Follow Complete Guide
→ **[START_HERE.md](START_HERE.md)** ← Step-by-step setup instructions

### 3. Start Servers
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 4. Test
Open http://localhost:5173
- Login: `admin@srit.ac.in` / `Admin@123`

---

## 📚 Documentation

| Document | What's Inside |
|----------|---------------|
| **[START_HERE.md](START_HERE.md)** | Complete setup guide - start here! |
| **[SETUP_GUIDE.md](SETUP_GUIDE.md)** | Architecture & development workflow |
| **[backend/README.md](backend/README.md)** | Backend API overview |
| **[backend/DATABASE_SCHEMA.md](backend/DATABASE_SCHEMA.md)** | Complete database schema + SQL |
| **[backend/API_TESTING_GUIDE.md](backend/API_TESTING_GUIDE.md)** | API testing with examples |
| **verify-setup.sh** | Automated verification script |

---

## ✨ Features

✅ JWT Authentication
✅ Role-Based Access (Admin/Faculty/Student)
✅ Protected Routes
✅ Admin CRUD APIs
✅ Student & Faculty Dashboards
✅ SRIT Branding
✅ Production-Ready Code

---

## 🏗️ Tech Stack

**Backend:** Node.js + Express + Supabase + PostgreSQL
**Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind
**Auth:** JWT via Supabase Auth

---

## 🗂️ Structure

```
collegeportal/
├── backend/          # Node.js Express API
│   ├── src/         # Routes, middleware, config
│   └── .env         # Supabase credentials
├── src/             # Next.js frontend
│   ├── app/         # Pages (login, dashboards)
│   ├── components/  # Header, ProtectedRoute
│   └── lib/         # Auth utilities
└── [docs]           # Complete documentation
```

---

## 📊 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@srit.ac.in | Admin@123 |
| Student | student@srit.ac.in | Student@123 |
| Faculty | faculty@srit.ac.in | Faculty@123 |

---

## 🔧 Development

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd ..
npm install
npm run dev
```

Detailed instructions: [START_HERE.md](START_HERE.md)

---

## 📝 API Endpoints

**Auth:** `/auth/login`, `/auth/logout`
**Admin:** `/admin/*` (users, subjects, departments)
**Student:** `/student/*` (profile, subjects, marks)
**Faculty:** `/faculty/*` (profile, assigned subjects)

Full API docs: [backend/API_TESTING_GUIDE.md](backend/API_TESTING_GUIDE.md)

---

## 🐛 Troubleshooting

**Backend won't start?**
- Check backend/.env has Supabase credentials
- Run `npm install` in backend folder

**Login fails?**
- Verify users created in Supabase
- Check database schema is deployed

**CORS error?**
- Frontend must run on port 5173
- Check package.json: `"dev": "next dev -p 5173"`

Full troubleshooting: [START_HERE.md](START_HERE.md)

---

## ✅ Current Status

| Phase | Status |
|-------|--------|
| Phase 1: Backend API | ✅ Complete |
| Phase 2: Frontend Auth | ✅ Complete |
| Phase 3: Admin UI | 📋 Planned |
| Phase 4: Academic Features | 📋 Planned |

---

## 🏫 About

**Institution:** Srinivasa Ramanujan Institute of Technology
**Website:** https://www.srit.ac.in/
**Purpose:** Real-world college management system

---

## 📄 License

ISC - Free for educational use

---

**Ready to start?** → [START_HERE.md](START_HERE.md)
