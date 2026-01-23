export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  
  // Admin
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  
  // Student
  STUDENT_DASHBOARD: "/student/dashboard",
  STUDENT_ATTENDANCE: "/student-attendance",
  STUDENT_MARKS: "/student/marks",
  
  // Faculty
  FACULTY_DASHBOARD: "/faculty/dashboard",
  FACULTY_ATTENDANCE: "/attendance",
  FACULTY_MARKS: "/marks",
  
  // Health
  HEALTH_CHECK: "/health",
};

export const ROLE_IDS = {
  ADMIN: 6,
  STUDENT: 1,
  FACULTY: 2,
};

export const ROLE_ROUTES: Record<number, string> = {
  [ROLE_IDS.ADMIN]: "/admin",
  [ROLE_IDS.STUDENT]: "/student",
  [ROLE_IDS.FACULTY]: "/faculty",
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  ROLE_ID: "role_id",
};
