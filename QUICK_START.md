# 🚀 Quick Start Guide

## In 5 Minutes

### 1️⃣ Create Fees Table (2 min)
Copy and paste this in Supabase SQL Editor (copy from DEMO_DATA_SETUP.md):

```sql
CREATE TABLE IF NOT EXISTS fees (
  id serial PRIMARY KEY,
  student_id integer NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  tuition_fee numeric(10,2) NOT NULL DEFAULT 0,
  lab_fee numeric(10,2) NOT NULL DEFAULT 0,
  other_fee numeric(10,2) NOT NULL DEFAULT 0,
  amount_paid numeric(10,2) NOT NULL DEFAULT 0,
  amount_due numeric(10,2) NOT NULL DEFAULT 0,
  semester integer NOT NULL,
  academic_year text NOT NULL,
  due_date date,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX idx_fees_student ON fees(student_id);
CREATE INDEX idx_fees_semester ON fees(semester);
```

### 2️⃣ Run Demo Script (1 min)
```bash
cd backend
node create-demo-data.js
```

### 3️⃣ Start App (2 min)
Terminal 1:
```bash
npm run dev  # Frontend on localhost:3000
```

Terminal 2:
```bash
cd backend
npm start   # Backend on localhost:3001
```

---

## 🔑 Demo Accounts

### Student
```
Email: student1@srit.ac.in
Pass:  srit1234
```
✨ See marks, fees, CGPA

### Faculty  
```
Email: rajesh.kumar@srit.ac.in
Pass:  srit1234
```
✨ See marks for assigned subjects

### Admin
```
Email: admin@srit.com
Pass:  srit1234
```
✨ Manage all marks & fees

---

## 🎯 What to Test

### Student Portal
1. Login as student1
2. View dashboard → See CGPA, marks, fees
3. Scroll down → See fee breakdown
4. Click "View Marks" → See detailed marks

### Faculty Portal
1. Login as rajesh.kumar
2. View assigned subjects
3. See student marks

### Admin Portal
1. Login as admin
2. Manage marks & fees
3. View all students

---

## 📊 Demo Data Created

✅ 4 Faculty (CS & ECE)
✅ 4 Students (with marks)
✅ 12 Mark entries (3 subjects × 4 exam types)
✅ 4 Fee records (with various payment statuses)

---

## 🎨 Orange & White Theme

- Primary: **#ff6b35** (Orange)
- Secondary: **#ffa952** (Light Orange)
- Background: **#0a101f** (Dark Blue)
- Text: **#ffffff** (White)

Applied to:
- ✅ Homepage
- ✅ Login page
- ✅ All dashboards
- ✅ Buttons & accents

---

## 📁 File Structure

```
collegeportal/
├── backend/
│   ├── create-demo-data.js        ← Run this!
│   ├── src/
│   │   ├── routes/
│   │   │   ├── fees.js            ← Fee API
│   │   │   ├── academic.js        ← Academic API (CGPA)
│   │   │   ├── marks.js
│   │   │   └── student.js
│   │   └── app.js
│   └── DEMO_DATA_SETUP.md          ← Full guide
│
├── src/
│   ├── app/
│   │   ├── student/page.tsx        ← Fetches real data
│   │   ├── auth/login/page.tsx
│   │   └── globals.css             ← Orange theme
│   └── components/
│       ├── Navbar.tsx              ← Orange header
│       ├── Header.tsx
│       └── Footer.tsx
│
└── IMPLEMENTATION_SUMMARY.md       ← Full details
```

---

## 🔗 API Endpoints

### Get Student Marks & CGPA
```bash
GET http://localhost:3001/academic/my-info
Authorization: Bearer {token}
```

### Get Student Fees
```bash
GET http://localhost:3001/fees/my-fees  
Authorization: Bearer {token}
```

### Admin: Get All Fees
```bash
GET http://localhost:3001/fees/all
Authorization: Bearer {admin_token}
```

---

## ⚡ Performance

- ✅ Database indexes on frequently queried fields
- ✅ CGPA calculated efficiently
- ✅ Clean API design
- ✅ Minimal database hits

---

## 🐛 Troubleshooting

**Marks not showing?**
→ Ensure published = true in marks table

**CGPA is 0?**
→ Check subjects have credits set

**Fees not showing?**
→ Run fees table SQL first

**Can't login?**
→ Check credentials: email: `student1@srit.ac.in`, pass: `srit1234`

---

## 📚 Full Documentation

- `DEMO_DATA_SETUP.md` - Detailed setup & SQL
- `IMPLEMENTATION_SUMMARY.md` - Architecture & features
- `backend/API_DOCUMENTATION.md` - API reference
- `backend/DATABASE_SCHEMA.md` - Database schema

---

## ✨ What's Included

| Feature | Status |
|---------|--------|
| Demo faculty & students | ✅ |
| Marks management | ✅ |
| CGPA calculation | ✅ |
| Fee management | ✅ |
| Real-time sync | ✅ |
| Student portal | ✅ |
| Faculty portal | ✅ |
| Admin portal | ✅ |
| Orange & white theme | ✅ |
| Responsive design | ✅ |
| API documentation | ✅ |
| Demo data guide | ✅ |

---

## 🚀 Next Steps

1. ✅ Create fees table
2. ✅ Run demo script
3. ✅ Test student login
4. ✅ View marks & fees
5. 🔄 Optional: Customize colors, add more students, integrate payment gateway

---

**Questions?** Check the detailed guides or API documentation.

**Ready?** Go run `node create-demo-data.js` 🎉
