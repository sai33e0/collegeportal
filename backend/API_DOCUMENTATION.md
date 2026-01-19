# SRIT College Portal - API Documentation

Complete REST API documentation for the SRIT College Portal backend.

## Base URL

```
http://localhost:5001
```

## Authentication

All protected routes require a JWT token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

## Role Constants

| Role | ID | Description |
|------|----|----|
| Student | 1 | Regular students who can view marks and attendance |
| Faculty | 2 | Teachers who can add marks and attendance for assigned subjects |
| Admin | 6 | Full access to all features including user management |

---

## 1. Authentication APIs

### POST `/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role_id": 1,
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

**Errors:**
- `400`: Email and password required
- `401`: Invalid credentials
- `500`: Login failed

---

### POST `/auth/logout`
Logout the current user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## 2. Admin APIs

All admin routes require authentication and Admin role (role_id = 6).

### Dashboard

#### GET `/admin/dashboard`
Get dashboard statistics.

**Response (200):**
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

### User Management

#### POST `/admin/users`
Create a new user with any role.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "full_name": "Jane Doe",
  "role_id": 1
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid-here",
    "email": "newuser@example.com",
    "full_name": "Jane Doe",
    "role_id": 1
  }
}
```

#### GET `/admin/users`
List all users.

**Response (200):**
```json
{
  "users": [
    {
      "id": "uuid-here",
      "full_name": "John Doe",
      "role_id": 1,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Student Management

#### POST `/admin/students`
Create a new student with authentication account.

**Request Body:**
```json
{
  "email": "student@college.edu",
  "password": "student123",
  "full_name": "John Student",
  "roll_no": "21CS001",
  "dept_id": 1,
  "semester": 3,
  "year_of_admission": 2021
}
```

**Response (201):**
```json
{
  "message": "Student created successfully",
  "student": {
    "id": 1,
    "email": "student@college.edu",
    "full_name": "John Student",
    "roll_no": "21CS001",
    "dept_id": 1,
    "semester": 3,
    "year_of_admission": 2021
  }
}
```

#### GET `/admin/students`
List all students with their department info.

**Response (200):**
```json
{
  "students": [
    {
      "id": 1,
      "user_id": "uuid-here",
      "roll_no": "21CS001",
      "dept_id": 1,
      "semester": 3,
      "year_of_admission": 2021,
      "users": { "full_name": "John Student" },
      "departments": { "name": "Computer Science", "code": "CSE" }
    }
  ]
}
```

#### PUT `/admin/students/:id`
Update student information.

**Request Body:**
```json
{
  "roll_no": "21CS002",
  "dept_id": 2,
  "semester": 4,
  "full_name": "Updated Name"
}
```

**Response (200):**
```json
{
  "message": "Student updated successfully",
  "student": { ... }
}
```

#### DELETE `/admin/students/:id`
Delete a student and their auth account.

**Response (200):**
```json
{
  "message": "Student deleted successfully"
}
```

---

### Faculty Management

#### POST `/admin/faculty`
Create a new faculty member with authentication account.

**Request Body:**
```json
{
  "email": "faculty@college.edu",
  "password": "faculty123",
  "full_name": "Dr. Jane Faculty",
  "employee_id": "FAC001",
  "dept_id": 1,
  "designation": "Professor"
}
```

**Response (201):**
```json
{
  "message": "Faculty created successfully",
  "faculty": {
    "id": 1,
    "email": "faculty@college.edu",
    "full_name": "Dr. Jane Faculty",
    "employee_id": "FAC001",
    "dept_id": 1,
    "designation": "Professor"
  }
}
```

#### GET `/admin/faculty`
List all faculty members.

**Response (200):**
```json
{
  "faculty": [
    {
      "id": 1,
      "user_id": "uuid-here",
      "employee_id": "FAC001",
      "dept_id": 1,
      "designation": "Professor",
      "users": { "full_name": "Dr. Jane Faculty" },
      "departments": { "name": "Computer Science", "code": "CSE" }
    }
  ]
}
```

#### PUT `/admin/faculty/:id`
Update faculty information.

**Request Body:**
```json
{
  "employee_id": "FAC002",
  "dept_id": 2,
  "designation": "Associate Professor",
  "full_name": "Updated Name"
}
```

**Response (200):**
```json
{
  "message": "Faculty updated successfully",
  "faculty": { ... }
}
```

#### DELETE `/admin/faculty/:id`
Delete a faculty member and their auth account.

**Response (200):**
```json
{
  "message": "Faculty deleted successfully"
}
```

---

### Department Management

#### GET `/admin/departments`
List all departments.

**Response (200):**
```json
{
  "departments": [
    {
      "id": 1,
      "name": "Computer Science",
      "code": "CSE",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### Subject Management

#### POST `/admin/subjects`
Create a new subject.

**Request Body:**
```json
{
  "code": "CS301",
  "name": "Data Structures",
  "dept_id": 1,
  "credits": 4
}
```

**Response (201):**
```json
{
  "message": "Subject created successfully",
  "subject": {
    "id": 1,
    "code": "CS301",
    "name": "Data Structures",
    "dept_id": 1,
    "credits": 4
  }
}
```

#### GET `/admin/subjects`
List all subjects with department info.

**Response (200):**
```json
{
  "subjects": [
    {
      "id": 1,
      "code": "CS301",
      "name": "Data Structures",
      "dept_id": 1,
      "credits": 4,
      "departments": { "name": "Computer Science" }
    }
  ]
}
```

---

### Faculty-Subject Assignment

#### POST `/admin/faculty-subjects`
Assign a faculty member to teach a subject.

**Request Body:**
```json
{
  "faculty_id": 1,
  "subject_id": 1,
  "academic_year": "2024-2025"
}
```

**Response (201):**
```json
{
  "message": "Faculty assigned to subject successfully",
  "assignment": {
    "id": 1,
    "faculty_id": 1,
    "subject_id": 1,
    "academic_year": "2024-2025"
  }
}
```

---

## 3. Faculty APIs

All faculty routes require authentication and Faculty role (role_id = 2).

### Profile

#### GET `/faculty/profile`
Get faculty profile information.

**Response (200):**
```json
{
  "profile": {
    "id": 1,
    "user_id": "uuid-here",
    "employee_id": "FAC001",
    "dept_id": 1,
    "designation": "Professor",
    "users": { "full_name": "Dr. Jane Faculty", "role_id": 2 },
    "departments": { "name": "Computer Science", "code": "CSE" }
  }
}
```

---

### Assigned Subjects

#### GET `/faculty/subjects`
Get subjects assigned to the faculty.

**Response (200):**
```json
{
  "subjects": [
    {
      "id": 1,
      "code": "CS301",
      "name": "Data Structures",
      "dept_id": 1,
      "credits": 4,
      "departments": { "name": "Computer Science" }
    }
  ]
}
```

---

### Students

#### GET `/faculty/students`
Get students for assigned subjects.

**Query Parameters:**
- `subject_id` (optional): Filter by subject
- `semester` (optional): Filter by semester
- `dept_id` (optional): Filter by department

**Response (200):**
```json
{
  "students": [
    {
      "id": 1,
      "roll_no": "21CS001",
      "semester": 3,
      "users": { "full_name": "John Student" },
      "departments": { "name": "Computer Science", "code": "CSE" }
    }
  ]
}
```

---

### Marks Management

#### POST `/faculty/marks`
Add marks for a student (for assigned subjects only).

**Request Body:**
```json
{
  "student_id": 1,
  "subject_id": 1,
  "exam_type": "internal1",
  "marks_obtained": 18,
  "max_marks": 20
}
```

**Valid exam_type values:** `internal1`, `internal2`, `lab`, `assignment`, `final`

**Response (201):**
```json
{
  "message": "Marks added successfully",
  "marks": {
    "id": 1,
    "student_id": 1,
    "subject_id": 1,
    "exam_type": "internal1",
    "marks_obtained": 18,
    "max_marks": 20,
    "published": false
  }
}
```

#### POST `/faculty/marks/bulk`
Add marks for multiple students at once.

**Request Body:**
```json
{
  "subject_id": 1,
  "exam_type": "internal1",
  "max_marks": 20,
  "marks_data": [
    { "student_id": 1, "marks_obtained": 18 },
    { "student_id": 2, "marks_obtained": 17 },
    { "student_id": 3, "marks_obtained": 19 }
  ]
}
```

**Response (200):**
```json
{
  "message": "Processed 3 marks entries",
  "results": [
    { "student_id": 1, "status": "created", "data": { ... } },
    { "student_id": 2, "status": "updated", "data": { ... } }
  ],
  "errors": []
}
```

#### GET `/faculty/marks`
Get marks for faculty's assigned subjects.

**Query Parameters:**
- `subject_id` (optional): Filter by specific subject
- `exam_type` (optional): Filter by exam type
- `semester` (optional): Filter by student semester

**Response (200):**
```json
{
  "marks": [
    {
      "id": 1,
      "student_id": 1,
      "subject_id": 1,
      "exam_type": "internal1",
      "marks_obtained": 18,
      "max_marks": 20,
      "published": false,
      "students": {
        "id": 1,
        "roll_no": "21CS001",
        "semester": 3,
        "users": { "full_name": "John Student" },
        "departments": { "code": "CSE" }
      },
      "subjects": { "name": "Data Structures", "code": "CS301" }
    }
  ]
}
```

---

### Attendance Management

#### POST `/faculty/attendance`
Add attendance for a student.

**Request Body:**
```json
{
  "student_id": 1,
  "subject_id": 1,
  "date": "2024-01-15",
  "status": "present",
  "period": 1
}
```

**Valid status values:** `present`, `absent`, `late`, `excused`

**Response (201):**
```json
{
  "message": "Attendance added successfully",
  "attendance": {
    "id": 1,
    "student_id": 1,
    "subject_id": 1,
    "date": "2024-01-15",
    "status": "present",
    "period": 1,
    "faculty_id": 1
  }
}
```

#### POST `/faculty/attendance/bulk`
Add attendance for multiple students.

**Request Body:**
```json
{
  "subject_id": 1,
  "date": "2024-01-15",
  "period": 1,
  "attendance_data": [
    { "student_id": 1, "status": "present" },
    { "student_id": 2, "status": "absent" },
    { "student_id": 3, "status": "late" }
  ]
}
```

**Response (200):**
```json
{
  "message": "Processed 3 attendance entries",
  "results": [
    { "student_id": 1, "status": "created", "data": { ... } }
  ],
  "errors": []
}
```

#### GET `/faculty/attendance`
Get attendance records for assigned subjects.

**Query Parameters:**
- `subject_id` (optional): Filter by subject
- `date` (optional): Filter by specific date
- `start_date` & `end_date` (optional): Filter by date range

**Response (200):**
```json
{
  "attendance": [
    {
      "id": 1,
      "student_id": 1,
      "subject_id": 1,
      "date": "2024-01-15",
      "status": "present",
      "period": 1,
      "students": {
        "roll_no": "21CS001",
        "users": { "full_name": "John Student" }
      },
      "subjects": { "name": "Data Structures", "code": "CS301" }
    }
  ]
}
```

---

## 4. Student APIs

All student routes require authentication and Student role (role_id = 1).

### Profile

#### GET `/student/profile`
Get student profile information.

**Response (200):**
```json
{
  "profile": {
    "id": 1,
    "user_id": "uuid-here",
    "roll_no": "21CS001",
    "dept_id": 1,
    "semester": 3,
    "year_of_admission": 2021,
    "users": { "full_name": "John Student", "role_id": 1 },
    "departments": { "name": "Computer Science", "code": "CSE" }
  }
}
```

---

### Subjects

#### GET `/student/subjects`
Get enrolled subjects for current semester.

**Response (200):**
```json
{
  "subjects": [
    {
      "id": 1,
      "code": "CS301",
      "name": "Data Structures",
      "credits": 4,
      "semester": 3,
      "departments": { "name": "Computer Science" }
    }
  ]
}
```

---

### Marks

#### GET `/student/marks`
Get student's published marks.

**Query Parameters:**
- `subject_id` (optional): Filter by subject
- `exam_type` (optional): Filter by exam type
- `semester` (optional): Filter by semester

**Response (200):**
```json
{
  "marks": [
    {
      "id": 1,
      "exam_type": "internal1",
      "marks_obtained": 18,
      "max_marks": 20,
      "published": true,
      "subjects": {
        "name": "Data Structures",
        "code": "CS301",
        "credits": 4,
        "semester": 3
      }
    }
  ],
  "grouped": {
    "CS301": {
      "subject": { "name": "Data Structures", "code": "CS301" },
      "marks": [
        {
          "id": 1,
          "exam_type": "internal1",
          "marks_obtained": 18,
          "max_marks": 20,
          "percentage": "90.00"
        }
      ]
    }
  }
}
```

#### GET `/student/marks/summary`
Get semester-wise marks summary.

**Response (200):**
```json
{
  "summary": [
    {
      "semester": 3,
      "subjects": [
        {
          "name": "Data Structures",
          "code": "CS301",
          "credits": 4,
          "marks": {
            "internal1": { "obtained": 18, "max": 20 },
            "internal2": { "obtained": 17, "max": 20 }
          }
        }
      ],
      "total_obtained": 35,
      "total_max": 40,
      "percentage": "87.50"
    }
  ],
  "current_semester": 3
}
```

---

### Attendance

#### GET `/student/attendance`
Get student's attendance records.

**Query Parameters:**
- `subject_id` (optional): Filter by subject
- `start_date` & `end_date` (optional): Filter by date range

**Response (200):**
```json
{
  "attendance": [
    {
      "id": 1,
      "date": "2024-01-15",
      "status": "present",
      "period": 1,
      "subjects": { "name": "Data Structures", "code": "CS301" }
    }
  ],
  "summary": [
    {
      "subject": { "name": "Data Structures", "code": "CS301" },
      "total": 30,
      "present": 27,
      "absent": 2,
      "late": 1,
      "excused": 0,
      "percentage": "90.00"
    }
  ]
}
```

---

## 5. Marks APIs (Mixed Access)

These routes are accessible by different roles with different permissions.

### Admin Only

#### POST `/marks`
Add marks for any student.

**Request Body:**
```json
{
  "student_id": 1,
  "subject_id": 1,
  "exam_type": "internal1",
  "marks_obtained": 18,
  "max_marks": 20,
  "published": true
}
```

#### PUT `/marks/:id`
Update marks.

**Request Body:**
```json
{
  "marks_obtained": 19,
  "max_marks": 20,
  "published": true
}
```

#### DELETE `/marks/:id`
Delete marks record.

#### GET `/marks/all`
Get all marks with filters.

**Query Parameters:**
- `dept_id` (optional): Filter by department
- `semester` (optional): Filter by semester
- `subject_id` (optional): Filter by subject

#### PATCH `/marks/:id/publish`
Publish or unpublish marks.

**Request Body:**
```json
{
  "published": true
}
```

---

### Student Only

#### GET `/marks/student/me`
Get own published marks (alternative endpoint).

---

### Faculty Only

#### GET `/marks/faculty/subjects`
Get published marks for assigned subjects.

---

## 6. Health Check

#### GET `/health`
Check if the server is running.

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "SRIT Portal Backend"
}
```

---

## Error Responses

All API errors follow this format:

```json
{
  "error": "Error message here"
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - No token or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## Quick Reference - API Summary Table

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | User login | No |
| POST | `/auth/logout` | User logout | Yes |

### Admin APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard` | Get dashboard stats |
| POST | `/admin/users` | Create new user |
| GET | `/admin/users` | List all users |
| POST | `/admin/students` | Create student with auth |
| GET | `/admin/students` | List all students |
| PUT | `/admin/students/:id` | Update student |
| DELETE | `/admin/students/:id` | Delete student |
| POST | `/admin/faculty` | Create faculty with auth |
| GET | `/admin/faculty` | List all faculty |
| PUT | `/admin/faculty/:id` | Update faculty |
| DELETE | `/admin/faculty/:id` | Delete faculty |
| GET | `/admin/departments` | List departments |
| POST | `/admin/subjects` | Create subject |
| GET | `/admin/subjects` | List subjects |
| POST | `/admin/faculty-subjects` | Assign faculty to subject |

### Faculty APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/faculty/profile` | Get faculty profile |
| GET | `/faculty/subjects` | Get assigned subjects |
| GET | `/faculty/students` | Get students |
| POST | `/faculty/marks` | Add marks |
| POST | `/faculty/marks/bulk` | Bulk add marks |
| GET | `/faculty/marks` | Get marks |
| POST | `/faculty/attendance` | Add attendance |
| POST | `/faculty/attendance/bulk` | Bulk add attendance |
| GET | `/faculty/attendance` | Get attendance |

### Student APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/student/profile` | Get student profile |
| GET | `/student/subjects` | Get enrolled subjects |
| GET | `/student/marks` | Get published marks |
| GET | `/student/marks/summary` | Get marks summary |
| GET | `/student/attendance` | Get attendance |

### Marks APIs (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/marks` | Add marks |
| PUT | `/marks/:id` | Update marks |
| DELETE | `/marks/:id` | Delete marks |
| GET | `/marks/all` | Get all marks |
| PATCH | `/marks/:id/publish` | Publish/unpublish marks |
| GET | `/marks/student/me` | Student: Get own marks |
| GET | `/marks/faculty/subjects` | Faculty: Get assigned subject marks |
