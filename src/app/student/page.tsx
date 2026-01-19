"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Link from "next/link";
import { ROLE_IDS } from "@/lib/constants";

export default function StudentDashboard() {
  const academicInfo = {
    rollNumber: "21CS1A0501",
    branch: "Computer Science & Engineering",
    semester: "6th Semester",
    section: "A",
    cgpa: "8.75"
  };

  const upcomingClasses = [
    { subject: "Data Structures", time: "09:00 AM", room: "Room 301", faculty: "Dr. Sharma" },
    { subject: "Database Systems", time: "10:00 AM", room: "Room 205", faculty: "Prof. Kumar" },
    { subject: "Computer Networks", time: "11:30 AM", room: "Lab 102", faculty: "Dr. Patel" }
  ];

  const recentMarks = [
    { subject: "Data Structures", internal1: 24, internal2: 22, assignment: 9, total: 55 },
    { subject: "Database Systems", internal1: 22, internal2: 23, assignment: 10, total: 55 },
    { subject: "Computer Networks", internal1: 20, internal2: 21, assignment: 8, total: 49 }
  ];

  const quickLinks = [
    { title: "View Marks", icon: "📊", description: "Check your internal marks", color: "#3b82f6", href: "/student/marks" },
    { title: "Attendance", icon: "📅", description: "View attendance records", color: "#10b981", href: "/student/attendance" },
    { title: "Time Table", icon: "🕐", description: "Class schedule", color: "#8b5cf6", href: "#" },
    { title: "Fee Details", icon: "💰", description: "Payment status", color: "#f59e0b", href: "#" },
    { title: "Library", icon: "📚", description: "E-Library access", color: "#ef4444", href: "#" },
    { title: "Results", icon: "🎓", description: "Semester results", color: "#06b6d4", href: "#" }
  ];

  return (
    <ProtectedRoute requiredRoleId={ROLE_IDS.STUDENT}>
      <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>
        <Header />

        <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px" }}>
          {/* Welcome Banner */}
          <div style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            borderRadius: "20px",
            padding: "40px",
            marginBottom: "32px",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px",
            boxShadow: "0 10px 40px rgba(16, 185, 129, 0.3)"
          }}>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px" }}>
                Welcome, Student! 🎓
              </h1>
              <p style={{ fontSize: "16px", opacity: 0.9 }}>
                Track your academic progress and stay updated with your courses.
              </p>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.2)",
              padding: "20px 32px",
              borderRadius: "14px",
              textAlign: "center"
            }}>
              <p style={{ fontSize: "14px", opacity: 0.9, marginBottom: "4px" }}>Current CGPA</p>
              <p style={{ fontSize: "36px", fontWeight: "700", margin: 0 }}>{academicInfo.cgpa}</p>
            </div>
          </div>

          {/* Academic Info Card */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "28px",
            marginBottom: "32px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "24px"
          }}>
            {[
              { label: "Roll Number", value: academicInfo.rollNumber, icon: "🆔" },
              { label: "Branch", value: academicInfo.branch, icon: "🏛️" },
              { label: "Semester", value: academicInfo.semester, icon: "📖" },
              { label: "Section", value: academicInfo.section, icon: "📋" }
            ].map((info, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  background: "#f1f5f9",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px"
                }}>
                  {info.icon}
                </div>
                <div>
                  <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "2px" }}>{info.label}</p>
                  <p style={{ fontSize: "15px", fontWeight: "600", color: "#1f2937", margin: 0 }}>{info.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
            marginBottom: "32px"
          }}>
            {/* Today's Classes */}
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "28px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
            }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>📅</span> {"Today's Classes"}
              </h2>
              {upcomingClasses.map((cls, idx) => (
                <div key={idx} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  marginBottom: idx < upcomingClasses.length - 1 ? "12px" : 0,
                  borderLeft: "4px solid #10b981"
                }}>
                  <div style={{
                    background: "#10b98115",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    textAlign: "center"
                  }}>
                    <p style={{ fontSize: "14px", fontWeight: "600", color: "#10b981", margin: 0 }}>{cls.time}</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "15px", fontWeight: "600", color: "#1f2937", marginBottom: "4px" }}>{cls.subject}</p>
                    <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>{cls.room} • {cls.faculty}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Marks */}
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "28px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
            }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>📊</span> Recent Internal Marks
              </h2>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                    <th style={{ textAlign: "left", padding: "12px 8px", fontSize: "13px", color: "#6b7280", fontWeight: "500" }}>Subject</th>
                    <th style={{ textAlign: "center", padding: "12px 8px", fontSize: "13px", color: "#6b7280", fontWeight: "500" }}>Int 1</th>
                    <th style={{ textAlign: "center", padding: "12px 8px", fontSize: "13px", color: "#6b7280", fontWeight: "500" }}>Int 2</th>
                    <th style={{ textAlign: "center", padding: "12px 8px", fontSize: "13px", color: "#6b7280", fontWeight: "500" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMarks.map((mark, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "14px 8px", fontSize: "14px", fontWeight: "500", color: "#1f2937" }}>{mark.subject}</td>
                      <td style={{ padding: "14px 8px", fontSize: "14px", textAlign: "center", color: "#4b5563" }}>{mark.internal1}/25</td>
                      <td style={{ padding: "14px 8px", fontSize: "14px", textAlign: "center", color: "#4b5563" }}>{mark.internal2}/25</td>
                      <td style={{ padding: "14px 8px", fontSize: "14px", textAlign: "center" }}>
                        <span style={{
                          background: mark.total >= 50 ? "#10b98115" : "#ef444415",
                          color: mark.total >= 50 ? "#10b981" : "#ef4444",
                          padding: "4px 12px",
                          borderRadius: "6px",
                          fontWeight: "600"
                        }}>
                          {mark.total}/60
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Links */}
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "20px" }}>
            Quick Access
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px"
          }}>
            {quickLinks.map((link, idx) => (
              <Link key={idx} href={link.href} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "white",
                  borderRadius: "14px",
                  padding: "24px",
                  textAlign: "center",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  borderBottom: `4px solid ${link.color}`
                }}>
                  <div style={{
                    width: "56px",
                    height: "56px",
                    background: `${link.color}15`,
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    margin: "0 auto 16px"
                  }}>
                    {link.icon}
                  </div>
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1f2937", marginBottom: "6px" }}>
                    {link.title}
                  </h3>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
                    {link.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
