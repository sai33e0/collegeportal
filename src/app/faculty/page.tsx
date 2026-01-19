"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import { ROLE_IDS } from "@/lib/constants";

export default function FacultyDashboard() {
  return (
    <ProtectedRoute requiredRoleId={ROLE_IDS.FACULTY}>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <Header />

        <div className="dashboard-card">
          <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "#333", marginBottom: "20px" }}>
            Faculty Dashboard
          </h1>
          <p style={{ fontSize: "18px", color: "#666", marginBottom: "30px" }}>
            Welcome to the Faculty Portal
          </p>

          <div className="placeholder-section">
            Classes Module - Coming Soon
          </div>

          <div className="placeholder-section">
            Student Roster - Coming Soon
          </div>

          <div className="placeholder-section">
            Grade Entry - Coming Soon
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
