"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getRoleId, clearAuthData, getToken } from "@/lib/auth";
import { ROLE_IDS, API_BASE_URL } from "@/lib/constants";
import { useState, useEffect } from "react";

export default function Header() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Get user name from localStorage (stored during login)
    const storedName = localStorage.getItem("user_name");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const getRoleName = () => {
    const roleId = getRoleId();
    switch (roleId) {
      case ROLE_IDS.ADMIN:
        return "Administrator";
      case ROLE_IDS.STUDENT:
        return "Student";
      case ROLE_IDS.FACULTY:
        return "Faculty";
      default:
        return "User";
    }
  };

  const getRoleColor = () => {
    const roleId = getRoleId();
    switch (roleId) {
      case ROLE_IDS.ADMIN:
        return "#dc2626";
      case ROLE_IDS.STUDENT:
        return "#10b981";
      case ROLE_IDS.FACULTY:
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  const handleLogout = async () => {
    try {
      const token = getToken();
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
      }
    } catch {
      // Continue with logout even if API call fails
    }
    clearAuthData();
    localStorage.removeItem("user_name");
    router.push("/auth/login");
  };

  return (
    <header style={{
      width: "100%",
      background: "white",
      boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      {/* Top accent bar */}
      <div style={{
        height: "4px",
        background: "linear-gradient(90deg, #1e3a8a 0%, #3b82f6 50%, #1e3a8a 100%)"
      }} />
      
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "16px", textDecoration: "none" }}>
          <div style={{
            width: "56px",
            height: "56px",
            background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
            boxShadow: "0 4px 12px rgba(30, 58, 138, 0.3)"
          }}>
            SRIT
          </div>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "700",
              color: "#1e3a8a"
            }}>
              SRIT College Portal
            </h1>
            <p style={{
              margin: "2px 0 0 0",
              fontSize: "12px",
              color: "#6b7280"
            }}>
              Srinivasa Ramanujan Institute of Technology
            </p>
          </div>
        </Link>

        {/* User Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Role Badge */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 20px",
            background: "#f8fafc",
            borderRadius: "12px",
            border: "1px solid #e5e7eb"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              background: `${getRoleColor()}15`,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px"
            }}>
              {getRoleId() === ROLE_IDS.ADMIN ? "👔" : getRoleId() === ROLE_IDS.FACULTY ? "👨‍🏫" : "🎓"}
            </div>
            <div>
              <p style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: "600",
                color: "#1f2937"
              }}>
                {userName || getRoleName()}
              </p>
              <p style={{
                margin: 0,
                fontSize: "12px",
                color: getRoleColor(),
                fontWeight: "500"
              }}>
                {getRoleName()} Dashboard
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              background: "white",
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              color: "#6b7280",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#dc2626";
              e.currentTarget.style.color = "#dc2626";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.color = "#6b7280";
            }}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
