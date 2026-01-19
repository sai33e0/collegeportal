"use client";

import { useRouter } from "next/navigation";
import { getRoleId, clearAuthData } from "@/lib/auth";
import { ROLE_IDS } from "@/lib/constants";

export default function Header() {
  const router = useRouter();

  const getRoleName = () => {
    const roleId = getRoleId();
    switch (roleId) {
      case ROLE_IDS.ADMIN:
        return "Admin";
      case ROLE_IDS.STUDENT:
        return "Student";
      case ROLE_IDS.FACULTY:
        return "Faculty";
      default:
        return "User";
    }
  };

  const handleLogout = () => {
    clearAuthData();
    router.push("/auth/login");
  };

  return (
    <header style={{
      width: "100%",
      background: "#ffffff",
      borderBottom: "3px solid #667eea",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      padding: "15px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <div style={{
          width: "60px",
          height: "60px",
          background: "#667eea",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: "24px"
        }}>
          SRIT
        </div>
        <div style={{ fontSize: "20px", fontWeight: "bold", color: "#333" }}>
          Srinivasa Ramanujan Institute of Technology
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span style={{ fontSize: "16px", color: "#333", fontWeight: "600" }}>
          {getRoleName()}
        </span>
        <button
          onClick={handleLogout}
          style={{
            border: "1px solid #667eea",
            background: "white",
            color: "#667eea",
            padding: "8px 16px",
            borderRadius: "4px",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
