# SRIT College Portal - Database Schema

## Overview
This document describes the complete database schema for the SRIT College Portal. All tables are managed in Supabase PostgreSQL.

---

## Tables

### 1. users
**Purpose:** Core user table linked to Supabase Auth

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | References auth.users(id) |
| full_name | text | NOT NULL | User's full name |
| role_id | integer | NOT NULL | Role: 1=Student, 2=Faculty, 6=Admin |
| created_at | timestamp | DEFAULT now() | Record creation time |

**Indexes:**
- `idx_users_role` on role_id

---

### 2. departments
**Purpose:** Academic departments

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PRIMARY KEY | Auto-increment ID |
| name | text | NOT NULL, UNIQUE | Department name |
| code | text | NOT NULL, UNIQUE | Short code (e.g., 'CSE') |
| created_at | timestamp | DEFAULT now() | Record creation time |

**Sample Data:**
```sql
INSERT INTO departments (name, code) VALUES
('Computer Science and Engineering', 'CSE'),
('Electronics and Communication Engineering', 'ECE'),
('Mechanical Engineering', 'MECH'),
('Civil Engineering', 'CIVIL');
```

---

### 3. students
**Purpose:** Student-specific information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PRIMARY KEY | Auto-increment ID |
| user_id | uuid | UNIQUE, FOREIGN KEY → users(id) | Links to user |
| roll_no | text | NOT NULL, UNIQUE | Student roll number |
| dept_id | integer | FOREIGN KEY → departments(id) | Department |
| semester | integer | CHECK (semester BETWEEN 1 AND 8) | Current semester |
| year_of_admission | integer | NOT NULL | Admission year |
| created_at | timestamp | DEFAULT now() | Record creation time |

**Indexes:**
- `idx_students_user` on user_id
- `idx_students_dept` on dept_id
- `idx_students_roll` on roll_no

---

### 4. faculty
**Purpose:** Faculty-specific information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PRIMARY KEY | Auto-increment ID |
| user_id | uuid | UNIQUE, FOREIGN KEY → users(id) | Links to user |
| employee_id | text | NOT NULL, UNIQUE | Faculty employee ID |
| dept_id | integer | FOREIGN KEY → departments(id) | Department |
| designation | text | | Faculty designation/title |
| created_at | timestamp | DEFAULT now() | Record creation time |

**Indexes:**
- `idx_faculty_user` on user_id
- `idx_faculty_dept` on dept_id
- `idx_faculty_emp` on employee_id

---

### 5. subjects
**Purpose:** Course subjects

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PRIMARY KEY | Auto-increment ID |
| code | text | NOT NULL, UNIQUE | Subject code (e.g., 'CS101') |
| name | text | NOT NULL | Subject name |
| dept_id | integer | FOREIGN KEY → departments(id) | Department |
| credits | integer | DEFAULT 3 | Credit hours |
| semester | integer | CHECK (semester BETWEEN 1 AND 8) | Semester number |
| created_at | timestamp | DEFAULT now() | Record creation time |

**Indexes:**
- `idx_subjects_dept` on dept_id
- `idx_subjects_code` on code

---

### 6. faculty_subjects
**Purpose:** Maps faculty to subjects they teach

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PRIMARY KEY | Auto-increment ID |
| faculty_id | integer | FOREIGN KEY → faculty(id) | Faculty member |
| subject_id | integer | FOREIGN KEY → subjects(id) | Subject |
| academic_year | text | NOT NULL | e.g., '2024-25' |
| created_at | timestamp | DEFAULT now() | Record creation time |

**Constraints:**
- UNIQUE(faculty_id, subject_id, academic_year) - One faculty per subject per year

**Indexes:**
- `idx_fac_sub_faculty` on faculty_id
- `idx_fac_sub_subject` on subject_id

---

### 7. marks (Future)
**Purpose:** Student marks/grades

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | serial | PRIMARY KEY | Auto-increment ID |
| student_id | integer | FOREIGN KEY → students(id) | Student |
| subject_id | integer | FOREIGN KEY → subjects(id) | Subject |
| exam_type | text | NOT NULL | 'internal1', 'internal2', 'final' |
| marks_obtained | numeric(5,2) | CHECK (marks >= 0) | Marks scored |
| max_marks | numeric(5,2) | NOT NULL | Maximum marks |
| created_at | timestamp | DEFAULT now() | Record creation time |

---

## SQL Setup Script

Run this in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. users table (linked to auth.users)
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role_id integer NOT NULL CHECK (role_id IN (1, 2, 6)),
  created_at timestamp DEFAULT now()
);

CREATE INDEX idx_users_role ON users(role_id);

-- 2. departments table
CREATE TABLE departments (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  created_at timestamp DEFAULT now()
);

INSERT INTO departments (name, code) VALUES
('Computer Science and Engineering', 'CSE'),
('Electronics and Communication Engineering', 'ECE'),
('Mechanical Engineering', 'MECH'),
('Civil Engineering', 'CIVIL');

-- 3. students table
CREATE TABLE students (
  id serial PRIMARY KEY,
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  roll_no text NOT NULL UNIQUE,
  dept_id integer NOT NULL REFERENCES departments(id),
  semester integer CHECK (semester BETWEEN 1 AND 8),
  year_of_admission integer NOT NULL,
  created_at timestamp DEFAULT now()
);

CREATE INDEX idx_students_user ON students(user_id);
CREATE INDEX idx_students_dept ON students(dept_id);
CREATE INDEX idx_students_roll ON students(roll_no);

-- 4. faculty table
CREATE TABLE faculty (
  id serial PRIMARY KEY,
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  employee_id text NOT NULL UNIQUE,
  dept_id integer NOT NULL REFERENCES departments(id),
  designation text,
  created_at timestamp DEFAULT now()
);

CREATE INDEX idx_faculty_user ON faculty(user_id);
CREATE INDEX idx_faculty_dept ON faculty(dept_id);
CREATE INDEX idx_faculty_emp ON faculty(employee_id);

-- 5. subjects table
CREATE TABLE subjects (
  id serial PRIMARY KEY,
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  dept_id integer NOT NULL REFERENCES departments(id),
  credits integer DEFAULT 3,
  semester integer CHECK (semester BETWEEN 1 AND 8),
  created_at timestamp DEFAULT now()
);

CREATE INDEX idx_subjects_dept ON subjects(dept_id);
CREATE INDEX idx_subjects_code ON subjects(code);

-- 6. faculty_subjects table
CREATE TABLE faculty_subjects (
  id serial PRIMARY KEY,
  faculty_id integer NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
  subject_id integer NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  academic_year text NOT NULL,
  created_at timestamp DEFAULT now(),
  UNIQUE(faculty_id, subject_id, academic_year)
);

CREATE INDEX idx_fac_sub_faculty ON faculty_subjects(faculty_id);
CREATE INDEX idx_fac_sub_subject ON faculty_subjects(subject_id);

-- 7. marks table (for future use)
CREATE TABLE marks (
  id serial PRIMARY KEY,
  student_id integer NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id integer NOT NULL REFERENCES subjects(id),
  exam_type text NOT NULL CHECK (exam_type IN ('internal1', 'internal2', 'final')),
  marks_obtained numeric(5,2) CHECK (marks_obtained >= 0),
  max_marks numeric(5,2) NOT NULL,
  created_at timestamp DEFAULT now()
);
```

---

## Row Level Security (RLS)

Enable RLS on all tables for security:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Admin can do everything (service role will be used from backend)
-- Students can read their own data
-- Faculty can read their own data and assigned subjects

-- Note: Backend uses service_role key which bypasses RLS
-- These policies are for direct Supabase client access (if needed)
```

---

## Role IDs
- **1** = Student
- **2** = Faculty
- **6** = Admin

---

## Sample Test Data

```sql
-- Create test admin user (do this via backend API or Supabase dashboard)
-- Email: admin@srit.ac.in
-- Password: Admin@123
-- Then run:
INSERT INTO users (id, full_name, role_id)
VALUES ('<admin_user_id_from_auth>', 'Admin User', 6);

-- Create test student
-- Email: student@srit.ac.in
-- Password: Student@123
INSERT INTO users (id, full_name, role_id)
VALUES ('<student_user_id_from_auth>', 'Test Student', 1);

INSERT INTO students (user_id, roll_no, dept_id, semester, year_of_admission)
VALUES ('<student_user_id_from_auth>', '21CS001', 1, 5, 2021);

-- Create test faculty
-- Email: faculty@srit.ac.in
-- Password: Faculty@123
INSERT INTO users (id, full_name, role_id)
VALUES ('<faculty_user_id_from_auth>', 'Test Faculty', 2);

INSERT INTO faculty (user_id, employee_id, dept_id, designation)
VALUES ('<faculty_user_id_from_auth>', 'FAC001', 1, 'Assistant Professor');

-- Create sample subjects
INSERT INTO subjects (code, name, dept_id, credits, semester) VALUES
('CS101', 'Programming in C', 1, 4, 1),
('CS201', 'Data Structures', 1, 4, 3),
('CS301', 'Database Management Systems', 1, 3, 5),
('CS401', 'Machine Learning', 1, 3, 7);
```

---

## Migration Notes

1. Always run schema changes in a transaction
2. Test on development database first
3. Backup before running migrations
4. Use Supabase migration system for version control

---

## Future Enhancements

- Attendance tracking
- Exam schedules
- Assignment submissions
- Student enrollments (many-to-many with subjects)
- Results publishing system
- Notifications/announcements
