"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Link from "next/link";
import { ROLE_IDS } from "@/lib/constants";

export default function FacultyDashboard() {
  const facultyInfo = {
    empId: "FAC2021CSE015",
    department: "Computer Science & Engineering",
    designation: "Assistant Professor",
    subjects: 3
  };

  const assignedSubjects = [
    { name: "Data Structures", code: "CS301", semester: "3rd", sections: ["A", "B"], students: 120 },
    { name: "Database Systems", code: "CS401", semester: "4th", sections: ["A"], students: 60 },
    { name: "Computer Networks", code: "CS501", semester: "5th", sections: ["B"], students: 58 }
  ];

  const todaySchedule = [
    { subject: "Data Structures", time: "09:00 - 10:00 AM", room: "Room 301", section: "CSE-A" },
    { subject: "Database Systems", time: "11:00 - 12:00 PM", room: "Room 205", section: "CSE-A" },
    { subject: "Data Structures", time: "02:00 - 03:00 PM", room: "Lab 102", section: "CSE-B" }
  ];

  const quickActions = [
    { title: "Enter Marks", icon: "📝", description: "Update internal/lab marks", color: "#3b82f6", href: "/faculty/marks" },
    { title: "Attendance", icon: "📋", description: "Mark student attendance", color: "#10b981", href: "/faculty/attendance" },
    { title: "Student List", icon: "👥", description: "View student roster", color: "#8b5cf6", href: "#" },
    { title: "Time Table", icon: "🕐", description: "View schedule", color: "#f59e0b", href: "#" }
  ];

  const stats = [
    { label: "Assigned Subjects", value: "3", icon: "📚", color: "#3b82f6" },
    { label: "Total Students", value: "238", icon: "🎓", color: "#10b981" },
    { label: "Classes Today", value: "3", icon: "🏛️", color: "#f59e0b" },
    { label: "Pending Tasks", value: "5", icon: "📋", color: "#ef4444" }
  ];

  return (
    <ProtectedRoute requiredRoleId={ROLE_IDS.FACULTY}>
      <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>
        <Header />

        <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px" }}>
          {/* Welcome Banner */}
          <div style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
            borderRadius: "20px",
            padding: "40px",
            marginBottom: "32px",
            color: "white",
            boxShadow: "0 10px 40px rgba(59, 130, 246, 0.3)"
          }}>
            <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px" }}>
              Welcome, Faculty! 👨‍🏫
            </h1>
            <p style={{ fontSize: "16px", opacity: 0.9, marginBottom: "20px" }}>
              Manage your classes, enter marks, and track student performance.
            </p>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "20px",
              background: "rgba(255,255,255,0.15)",
              padding: "14px 24px",
              borderRadius: "12px"
            }}>
              <span>🏛️ {facultyInfo.department}</span>
              <span style={{ opacity: 0.5 }}>|</span>
              <span>📋 {facultyInfo.designation}</span>
              <span style={{ opacity: 0.5 }}>|</span>
              <span>🆔 {facultyInfo.empId}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "32px"
          }}>
            {stats.map((stat, idx) => (
              <div key={idx} style={{
                background: "white",
                borderRadius: "14px",
                padding: "24px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  background: `${stat.color}15`,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px"
                }}>
                  {stat.icon}
                </div>
                <div>
                  <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>{stat.label}</p>
                  <p style={{ fontSize: "28px", fontWeight: "700", color: "#1f2937", margin: 0 }}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "32px",
            marginBottom: "32px"
          }}>
            {/* Assigned Subjects */}
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "28px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
            }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>📚</span> Assigned Subjects
              </h2>
              {assignedSubjects.map((subject, idx) => (
                <div key={idx} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  marginBottom: idx < assignedSubjects.length - 1 ? "12px" : 0,
                  borderLeft: "4px solid #3b82f6"
                }}>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937", marginBottom: "6px" }}>
                      {subject.name}
                    </h3>
                    <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                      {subject.code} • {subject.semester} Semester • Section {subject.sections.join(", ")}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "24px", fontWeight: "700", color: "#3b82f6", margin: 0 }}>
                      {subject.students}
                    </p>
                    <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>Students</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Today's Schedule */}
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "28px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
            }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>📅</span> {"Today's Schedule"}
              </h2>
              {todaySchedule.map((cls, idx) => (
                <div key={idx} style={{
                  padding: "18px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  marginBottom: idx < todaySchedule.length - 1 ? "12px" : 0
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "10px"
                  }}>
                    <span style={{
                      background: "#3b82f615",
                      color: "#3b82f6",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600"
                    }}>
                      {cls.time}
                    </span>
                    <span style={{ fontSize: "13px", color: "#6b7280" }}>{cls.section}</span>
                  </div>
                  <h4 style={{ fontSize: "15px", fontWeight: "600", color: "#1f2937", marginBottom: "4px" }}>
                    {cls.subject}
                  </h4>
                  <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                    📍 {cls.room}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "20px" }}>
            Quick Actions
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px"
          }}>
            {quickActions.map((action, idx) => (
              <Link key={idx} href={action.href} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "white",
                  borderRadius: "14px",
                  padding: "28px",
                  textAlign: "center",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  borderTop: `4px solid ${action.color}`
                }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    background: `${action.color}15`,
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "30px",
                    margin: "0 auto 18px"
                  }}>
                    {action.icon}
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937", marginBottom: "8px" }}>
                    {action.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                    {action.description}
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
