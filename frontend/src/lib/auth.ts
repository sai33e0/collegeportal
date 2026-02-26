import { STORAGE_KEYS, ROLE_ROUTES } from "./constants";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function getRoleId(): number | null {
  if (typeof window === "undefined") return null;
  const roleId = localStorage.getItem(STORAGE_KEYS.ROLE_ID);
  return roleId ? parseInt(roleId, 10) : null;
}

export function setAuthData(token: string, roleId: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.ROLE_ID, roleId.toString());
}

export function clearAuthData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.ROLE_ID);
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return getToken() !== null;
}

export function getRoleRoute(roleId: number): string {
  return ROLE_ROUTES[roleId] || "/auth/login";
}

export function hasRequiredRole(requiredRoleId: number): boolean {
  const currentRoleId = getRoleId();
  return currentRoleId === requiredRoleId;
}
