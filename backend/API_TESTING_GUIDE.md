# SRIT College Portal - API Testing Guide

## Phase 1: Backend Testing (Before Frontend)

This guide shows how to test all backend APIs using Thunder Client, Postman, or curl.

---

## Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Create `.env` file in backend folder:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
PORT=5000
NODE_ENV=development
```

### 3. Start Server
```bash
npm run dev
```

Server should start on http://localhost:5000

---

## API Endpoints

### Health Check

**GET** `/health`

**Description:** Verify server is running

**Request:**
```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "SRIT Portal Backend"
}
```

---

## Authentication APIs

### 1. Login

**POST** `/auth/login`

**Description:** Authenticate user and get access token

**Request Body:**
```json
{
  "email": "admin@srit.ac.in",
  "password": "Admin@123"
}
```

**Thunder Client:**
- Method: POST
- URL: http://localhost:5000/auth/login
- Body → JSON → paste above

**Expected Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role_id": 6,
  "user": {
    "id": "uuid-here",
    "email": "admin@srit.ac.in",
    "full_name": "Admin User"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

**IMPORTANT:** Save the `access_token` - you'll need it for all protected routes!

---

### 2. Logout

**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Expected Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Admin APIs

All admin routes require:
- **Header:** `Authorization: Bearer <token>`
- **Role:** Admin (role_id = 6)

### 1. Get Dashboard Stats

**GET** `/admin/dashboard`

**Request:**
```bash
curl -H "Authorization: Bearer <token>" http://localhost:5000/admin/dashboard
```

**Expected Response:**
```json
{
  "stats": {
    "students": 150,
    "faculty": 25,
    "subjects": 40
  }
}
```

---

### 2. Create User

**POST** `/admin/users`

**Request Body:**
```json
{
  "email": "newstudent@srit.ac.in",
  "password": "Student@123",
  "full_name": "New Student",
  "role_id": 1
}
```

**Expected Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid-here",
    "email": "newstudent@srit.ac.in",
    "full_name": "New Student",
    "role_id": 1
  }
}
```

**Role IDs:**
- 1 = Student
- 2 = Faculty
- 6 = Admin

---

### 3. List All Users

**GET** `/admin/users`

**Expected Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "full_name": "Admin User",
      "role_id": 6,
      "created_at": "2024-01-15T10:00:00Z"
    },
    {
      "id": "uuid",
      "full_name": "Test Student",
      "role_id": 1,
      "created_at": "2024-01-15T11:00:00Z"
    }
  ]
}
```

---

### 4. List Departments

**GET** `/admin/departments`

**Expected Response:**
```json
{
  "departments": [
    {
      "id": 1,
      "name": "Computer Science and Engineering",
      "code": "CSE",
      "created_at": "2024-01-15T09:00:00Z"
    },
    {
      "id": 2,
      "name": "Electronics and Communication Engineering",
      "code": "ECE",
      "created_at": "2024-01-15T09:00:00Z"
    }
  ]
}
```

---

### 5. Create Subject

**POST** `/admin/subjects`

**Request Body:**
```json
{
  "code": "CS101",
  "name": "Programming in C",
  "dept_id": 1,
  "credits": 4
}
```

**Expected Response (201):**
```json
{
  "message": "Subject created successfully",
  "subject": {
    "id": 1,
    "code": "CS101",
    "name": "Programming in C",
    "dept_id": 1,
    "credits": 4
  }
}
```

---

### 6. List Subjects

**GET** `/admin/subjects`

**Expected Response:**
```json
{
  "subjects": [
    {
      "id": 1,
      "code": "CS101",
      "name": "Programming in C",
      "dept_id": 1,
      "credits": 4,
      "departments": {
        "name": "Computer Science and Engineering"
      }
    }
  ]
}
```

---

### 7. Assign Faculty to Subject

**POST** `/admin/faculty-subjects`

**Request Body:**
```json
{
  "faculty_id": 1,
  "subject_id": 1
}
```

**Note:** You need to create faculty record first (see database schema)

**Expected Response (201):**
```json
{
  "message": "Faculty assigned to subject successfully",
  "assignment": {
    "id": 1,
    "faculty_id": 1,
    "subject_id": 1
  }
}
```

---

## Student APIs

All student routes require:
- **Header:** `Authorization: Bearer <token>`
- **Role:** Student (role_id = 1)

### 1. Get Profile

**GET** `/student/profile`

**Expected Response:**
```json
{
  "profile": {
    "id": 1,
    "user_id": "uuid",
    "roll_no": "21CS001",
    "dept_id": 1,
    "semester": 5,
    "year_of_admission": 2021,
    "users": {
      "full_name": "Test Student",
      "role_id": 1
    },
    "departments": {
      "name": "Computer Science and Engineering",
      "code": "CSE"
    }
  }
}
```

---

### 2. Get Subjects

**GET** `/student/subjects`

**Expected Response:**
```json
{
  "subjects": [
    {
      "id": 1,
      "code": "CS101",
      "name": "Programming in C",
      "credits": 4,
      "departments": {
        "name": "Computer Science and Engineering"
      }
    }
  ]
}
```

---

### 3. Get Marks

**GET** `/student/marks`

**Expected Response (Placeholder):**
```json
{
  "message": "Marks module coming soon",
  "marks": []
}
```

---

## Faculty APIs

All faculty routes require:
- **Header:** `Authorization: Bearer <token>`
- **Role:** Faculty (role_id = 2)

### 1. Get Profile

**GET** `/faculty/profile`

**Expected Response:**
```json
{
  "profile": {
    "id": 1,
    "user_id": "uuid",
    "employee_id": "FAC001",
    "dept_id": 1,
    "designation": "Assistant Professor",
    "users": {
      "full_name": "Test Faculty",
      "role_id": 2
    },
    "departments": {
      "name": "Computer Science and Engineering",
      "code": "CSE"
    }
  }
}
```

---

### 2. Get Assigned Subjects

**GET** `/faculty/subjects`

**Expected Response:**
```json
{
  "subjects": [
    {
      "id": 1,
      "code": "CS101",
      "name": "Programming in C",
      "credits": 4,
      "departments": {
        "name": "Computer Science and Engineering"
      }
    }
  ]
}
```

---

### 3. Get Students

**GET** `/faculty/students`

**Expected Response (Placeholder):**
```json
{
  "message": "Student roster coming soon",
  "students": []
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions",
  "required": [6],
  "current": 1
}
```

### 404 Not Found
```json
{
  "error": "Route not found",
  "path": "/invalid/path"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Testing Workflow

### Step 1: Create Admin User
1. Create admin user in Supabase Dashboard (Authentication → Add User)
2. Email: admin@srit.ac.in
3. Password: Admin@123
4. Insert into users table:
```sql
INSERT INTO users (id, full_name, role_id)
VALUES ('<admin_user_id>', 'Admin User', 6);
```

### Step 2: Login as Admin
```bash
POST http://localhost:5000/auth/login
Body: {"email": "admin@srit.ac.in", "password": "Admin@123"}
```
Save the token!

### Step 3: Create Student User
```bash
POST http://localhost:5000/admin/users
Header: Authorization: Bearer <admin_token>
Body: {
  "email": "student@srit.ac.in",
  "password": "Student@123",
  "full_name": "Test Student",
  "role_id": 1
}
```

### Step 4: Create Student Record
Manually in Supabase (for now):
```sql
INSERT INTO students (user_id, roll_no, dept_id, semester, year_of_admission)
VALUES ('<student_user_id>', '21CS001', 1, 5, 2021);
```

### Step 5: Login as Student
```bash
POST http://localhost:5000/auth/login
Body: {"email": "student@srit.ac.in", "password": "Student@123"}
```

### Step 6: Test Student APIs
```bash
GET http://localhost:5000/student/profile
Header: Authorization: Bearer <student_token>
```

### Step 7: Create Faculty (Similar Process)
- Create user via admin API with role_id = 2
- Insert faculty record manually
- Login and test faculty APIs

---

## Thunder Client Collections

Create these collections for organized testing:

**Collection 1: Auth**
- Login (Admin)
- Login (Student)
- Login (Faculty)
- Logout

**Collection 2: Admin**
- Dashboard Stats
- Create User
- List Users
- Create Subject
- List Subjects
- Assign Faculty

**Collection 3: Student**
- Get Profile
- Get Subjects
- Get Marks

**Collection 4: Faculty**
- Get Profile
- Get Assigned Subjects
- Get Students

---

## Common Issues

### Issue 1: "Missing Supabase configuration"
**Fix:** Check your .env file has all three Supabase keys

### Issue 2: "Invalid or expired token"
**Fix:** Token might be expired, login again to get new token

### Issue 3: "Insufficient permissions"
**Fix:** Check you're using the right token for the right role

### Issue 4: "User role not found"
**Fix:** Make sure user exists in users table with correct role_id

---

## Next Steps

After verifying all APIs work:
1. ✅ Backend is stable
2. → Move to Phase 2: Frontend Development
3. → Connect frontend to these APIs
4. → Build UI for each role

**Phase 1 Complete when:**
- Health check works
- Login returns token for all 3 roles
- Admin APIs tested
- Student APIs tested
- Faculty APIs tested
- No server crashes or errors
