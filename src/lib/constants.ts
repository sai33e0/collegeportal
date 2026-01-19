export const API_BASE_URL = "http://localhost:5000";

export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
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
