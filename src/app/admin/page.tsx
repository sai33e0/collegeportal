"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Link from "next/link";
import { ROLE_IDS } from "@/lib/constants";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Students", value: "2,456", icon: "🎓", color: "#3b82f6", change: "+12%" },
    { label: "Total Faculty", value: "156", icon: "👨‍🏫", color: "#10b981", change: "+3%" },
    { label: "Departments", value: "8", icon: "🏛️", color: "#8b5cf6", change: "0%" },
    { label: "Active Courses", value: "42", icon: "📚", color: "#f59e0b", change: "+5%" }
  ];

  const quickActions = [
    { title: "Manage Users", icon: "👥", description: "Add, edit, or remove users", href: "#", color: "#3b82f6" },
    { title: "Manage Marks", icon: "📝", description: "Enter and update student marks", href: "/admin/marks", color: "#10b981" },
    { title: "Departments", icon: "🏢", description: "Manage departments", href: "#", color: "#8b5cf6" },
    { title: "Subjects", icon: "📖", description: "Configure subjects", href: "#", color: "#f59e0b" },
    { title: "Reports", icon: "📊", description: "View analytics and reports", href: "#", color: "#ef4444" },
    { title: "Settings", icon: "⚙️", description: "System configuration", href: "#", color: "#6b7280" }
  ];

  const recentActivities = [
    { action: "New student registered", user: "Rahul Kumar", time: "2 minutes ago", icon: "🎓" },
    { action: "Marks updated for CSE-A", user: "Prof. Sharma", time: "15 minutes ago", icon: "📝" },
    { action: "New subject added", user: "Admin", time: "1 hour ago", icon: "📚" },
    { action: "Faculty profile updated", user: "Dr. Patel", time: "2 hours ago", icon: "👨‍🏫" }
  ];

  return (
    <ProtectedRoute requiredRoleId={ROLE_IDS.ADMIN}>
      <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>
        <Header />

        <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px" }}>
          {/* Welcome Section */}
          <div style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
            borderRadius: "20px",
            padding: "40px",
            marginBottom: "32px",
            color: "white",
            boxShadow: "0 10px 40px rgba(30, 58, 138, 0.3)"
          }}>
            <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px" }}>
              Welcome, Administrator! 👋
            </h1>
            <p style={{ fontSize: "16px", opacity: 0.9, marginBottom: "24px" }}>
              Manage your college portal from this central dashboard.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/admin/marks" style={{
                background: "white",
                color: "#1e3a8a",
                padding: "12px 24px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "14px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}>
                📝 Manage Marks
              </Link>
              <button style={{
                background: "rgba(255,255,255,0.2)",
                color: "white",
                border: "2px solid rgba(255,255,255,0.3)",
                padding: "12px 24px",
                borderRadius: "10px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}>
                📊 View Reports
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
            marginBottom: "32px"
          }}>
            {stats.map((stat, idx) => (
              <div key={idx} style={{
                background: "white",
                borderRadius: "16px",
                padding: "28px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: "20px"
              }}>
                <div style={{
                  width: "64px",
                  height: "64px",
                  background: `${stat.color}15`,
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px"
                }}>
                  {stat.icon}
                </div>
                <div>
                  <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>
                    {stat.label}
                  </p>
                  <p style={{ fontSize: "28px", fontWeight: "700", color: "#1f2937", margin: 0 }}>
                    {stat.value}
                  </p>
                  <span style={{
                    fontSize: "12px",
                    color: stat.change.startsWith("+") ? "#10b981" : "#6b7280",
                    fontWeight: "500"
                  }}>
                    {stat.change} from last month
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "32px"
          }}>
            {/* Quick Actions */}
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "20px" }}>
                Quick Actions
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px"
              }}>
                {quickActions.map((action, idx) => (
                  <Link key={idx} href={action.href} style={{
                    background: "white",
                    borderRadius: "14px",
                    padding: "24px",
                    textDecoration: "none",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                    transition: "all 0.3s ease",
                    display: "block",
                    borderLeft: `4px solid ${action.color}`
                  }}>
                    <div style={{
                      width: "48px",
                      height: "48px",
                      background: `${action.color}15`,
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      marginBottom: "16px"
                    }}>
                      {action.icon}
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937", marginBottom: "6px" }}>
                      {action.title}
                    </h3>
                    <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                      {action.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "20px" }}>
                Recent Activity
              </h2>
              <div style={{
                background: "white",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
              }}>
                {recentActivities.map((activity, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "16px 0",
                    borderBottom: idx < recentActivities.length - 1 ? "1px solid #f1f5f9" : "none"
                  }}>
                    <div style={{
                      width: "44px",
                      height: "44px",
                      background: "#f1f5f9",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px"
                    }}>
                      {activity.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "14px", fontWeight: "500", color: "#1f2937", marginBottom: "4px" }}>
                        {activity.action}
                      </p>
                      <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
                        by {activity.user}
                      </p>
                    </div>
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
