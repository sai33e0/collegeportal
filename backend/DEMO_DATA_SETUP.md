# Demo Data Setup Guide

## Overview
This guide explains how to set up demo data for the SRIT College Portal including:
- Faculty accounts with assignments
- Student accounts with marks
- Fee structures
- Academic records with CGPA calculation

## Prerequisites

1. **Backend running**: `npm start` in the `backend` folder
2. **Supabase configured**: Valid Supabase credentials in `.env`
3. **Database tables exist**: fees table must be created (see below)

## Step 1: Create Fees Table (if not exists)

Run this SQL in your Supabase SQL Editor:

```sql
-- Create fees table
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

-- Create index for faster queries
CREATE INDEX idx_fees_student ON fees(student_id);
CREATE INDEX idx_fees_semester ON fees(semester);

-- Optional: Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_fees_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER fees_timestamp BEFORE UPDATE ON fees
FOR EACH ROW EXECUTE FUNCTION update_fees_timestamp();
```

## Step 2: Run Demo Data Script

```bash
cd backend
node create-demo-data.js
```

## Step 3: What Gets Created

### Demo Faculty Accounts
```
rajesh.kumar@srit.ac.in / srit1234 - Dr. Rajesh Kumar (CSE Faculty)
priya.sharma@srit.ac.in / srit1234 - Dr. Priya Sharma (CSE Faculty)
arun.patel@srit.ac.in / srit1234 - Prof. Arun Patel (CSE Faculty)
neha.gupta@srit.ac.in / srit1234 - Dr. Neha Gupta (ECE Faculty)
```

### Demo Student Accounts
```
student1@srit.ac.in / srit1234 - Rahul Kumar (21CS1A0501)
student2@srit.ac.in / srit1234 - Priya Singh (21CS1A0502)
student3@srit.ac.in / srit1234 - Amit Desai (21CS1A0503)
student4@srit.ac.in / srit1234 - Divya Nair (21EC1A0401)
```

### Demo Data Created
- ✅ 4 Faculty accounts with department assignments
- ✅ 4 Student accounts with academic details
- ✅ Faculty assigned to subjects (CSE301, CSE302, CSE303, EC301)
- ✅ Marks for each student in assigned subjects:
  - Internal 1: 20-25/25
  - Internal 2: 19-24/25
  - Lab: 16-20/20
  - Assignment: 8-10/10
- ✅ Fee records:
  - Tuition: ₹120,000
  - Lab: ₹12,000-15,000
  - Other: ₹10,000
  - Various payment statuses (paid, partial, pending)

## Step 4: Verify Data

### Check Faculty Created
```sql
SELECT f.employee_id, u.full_name, d.name FROM faculty f
JOIN users u ON f.user_id = u.id
JOIN departments d ON f.dept_id = d.id;
```

### Check Students Created
```sql
SELECT s.roll_no, u.full_name, d.name FROM students s
JOIN users u ON s.user_id = u.id
JOIN departments d ON s.dept_id = d.id;
```

### Check Marks Added
```sql
SELECT s.roll_no, sub.code, m.exam_type, m.marks_obtained, m.max_marks
FROM marks m
JOIN students s ON m.student_id = s.id
JOIN subjects sub ON m.subject_id = sub.id
LIMIT 20;
```

### Check Fees Added
```sql
SELECT s.roll_no, f.tuition_fee, f.lab_fee, f.amount_paid, f.amount_due
FROM fees f
JOIN students s ON f.student_id = s.id;
```

## Step 5: Test in Portal

### Student Portal
1. Login: `student1@srit.ac.in` / `srit1234`
2. View marks: All 3 subjects with calculated percentages
3. View fees: Total, paid, due amounts with payment status
4. CGPA calculated based on marks

### Faculty Portal
1. Login: `rajesh.kumar@srit.ac.in` / `srit1234`
2. View assigned subjects: CS301
3. View student marks in subject
4. Update marks if needed

### Admin Portal
1. Login: `admin@srit.com` / `srit1234`
2. View all marks by department/semester
3. Manage student fees
4. View academic reports

## API Endpoints

### Student - Get Academic Info
```bash
GET /academic/my-info
Authorization: Bearer {token}
```

**Response:**
```json
{
  "student": {
    "full_name": "Rahul Kumar",
    "roll_no": "21CS1A0501",
    "department": "Computer Science and Engineering",
    "semester": 6
  },
  "academics": {
    "cgpa": 7.85,
    "total_subjects": 3,
    "subjects": [
      {
        "subject_code": "CS301",
        "subject_name": "Data Structures",
        "credits": 4,
        "total_obtained": 89,
        "total_max": 100,
        "percentage": "89.00",
        "marks": {...}
      }
    ]
  }
}
```

### Student - Get Fee Details
```bash
GET /fees/my-fees
Authorization: Bearer {token}
```

**Response:**
```json
{
  "student_roll": "21CS1A0501",
  "fees": [
    {
      "semester": 6,
      "academic_year": "2024-25",
      "tuition_fee": 120000,
      "lab_fee": 15000,
      "other_fee": 10000,
      "total_fee": 145000,
      "amount_paid": 80000,
      "amount_due": 65000,
      "payment_status": "partial"
    }
  ],
  "summary": {
    "total_fees": 145000,
    "total_paid": 80000,
    "total_due": 65000,
    "overall_status": "partial_paid"
  }
}
```

### Admin - Get All Fees
```bash
GET /fees/all
Authorization: Bearer {admin_token}
```

### Admin - Update Student Payment
```bash
PUT /fees/{fee_id}/payment
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "amount_paid": 145000
}
```

## Scalability Notes

### Adding More Data
1. **More Students**: Edit `demoStudents` array in `create-demo-data.js`
2. **More Faculty**: Edit `demoFaculty` array
3. **More Marks**: Edit `marksData` array
4. **Batch Operations**: Use SQL directly for large datasets

### Performance Considerations
- Marks indexed on `student_id` and `subject_id`
- Fees indexed on `student_id` and `semester`
- CGPA calculated on-demand (cacheable for production)
- Pagination recommended for large result sets (>100 records)

### Database Optimization
```sql
-- Add for better performance
CREATE INDEX idx_marks_published ON marks(student_id, published);
CREATE INDEX idx_marks_subject_semester ON marks(subject_id, student_id);

-- For fee reporting
CREATE INDEX idx_fees_year_semester ON fees(academic_year, semester);
```

## Troubleshooting

### "User already exists" Error
- Either skip (script does this automatically) or:
- Delete user from Supabase Auth > Users
- Run script again

### "Student record not found" Error
- Ensure student records exist before adding marks
- Check `students` table has entries for students

### Marks not visible in portal
- Verify `published = true` in marks table
- Student must be logged in and data cached properly
- Clear browser cache

### CGPA showing 0
- Check marks have `published = true`
- Ensure marks are added with correct `subject_id`
- Verify `subjects.credits` are set correctly

## Cleanup (Reset Demo Data)

To remove all demo data:

```bash
node backend/scripts/cleanup-demo.js
```

Or manually:
```sql
-- Delete in order (respecting foreign keys)
DELETE FROM marks WHERE student_id IN (SELECT id FROM students WHERE roll_no LIKE '21%');
DELETE FROM fees WHERE student_id IN (SELECT id FROM students WHERE roll_no LIKE '21%');
DELETE FROM students WHERE roll_no LIKE '21%';
DELETE FROM faculty_subjects WHERE faculty_id IN (SELECT id FROM faculty WHERE employee_id LIKE 'FAC%');
DELETE FROM faculty WHERE employee_id LIKE 'FAC%';
DELETE FROM users WHERE id IN (SELECT id FROM auth.users WHERE email LIKE '%@srit.ac.in');
```

---

**Questions?** Check API_DOCUMENTATION.md and DATABASE_SCHEMA.md in the backend folder.
