"use client";

import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Link from "next/link";
import { ROLE_IDS, API_BASE_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth";

interface AttendanceRecord {
  id: number;
  date: string;
  period: number;
  status: string;
  subjects?: {
    name: string;
    code: string;
  };
}

interface AttendanceSummary {
  subject: {
    name: string;
    code: string;
  } | null;
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: string;
}

export default function StudentAttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAttendance = useCallback(async () => {
    try {
      const token = getToken();

      const response = await fetch(`${API_BASE_URL}/student/attendance`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAttendance(data.attendance || []);
        setSummary(data.summary || []);
      }

      setLoading(false);
    } catch {
      setError("Failed to fetch attendance");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: { bg: string; color: string; icon: string } } = {
      present: { bg: "#f0fdf4", color: "#16a34a", icon: "✓" },
      absent: { bg: "#fef2f2", color: "#dc2626", icon: "✕" },
      late: { bg: "#fef3c7", color: "#d97706", icon: "⏱" },
      excused: { bg: "#eff6ff", color: "#3b82f6", icon: "📝" }
    };
    const style = styles[status] || styles.absent;
    return (
      <span style={{
        padding: "6px 14px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        background: style.bg,
        color: style.color,
        display: "inline-flex",
        alignItems: "center",
        gap: "4px"
      }}>
        {style.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 85) return "#16a34a";
    if (percentage >= 75) return "#22c55e";
    if (percentage >= 65) return "#eab308";
    return "#dc2626";
  };

  // Calculate overall attendance
  const overallStats = summary.reduce(
    (acc, s) => ({
      total: acc.total + s.total,
      present: acc.present + s.present,
      absent: acc.absent + s.absent,
      late: acc.late + s.late,
      excused: acc.excused + s.excused
    }),
    { total: 0, present: 0, absent: 0, late: 0, excused: 0 }
  );
  const overallPercentage = overallStats.total > 0
    ? ((overallStats.present / overallStats.total) * 100).toFixed(1)
    : "0";

  return (
    <ProtectedRoute requiredRoleId={ROLE_IDS.STUDENT}>
      <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>
        <Header />

        <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px" }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Link href="/student" style={{ color: "#6b7280", textDecoration: "none", fontSize: "14px" }}>
              Dashboard
            </Link>
            <span style={{ color: "#9ca3af" }}>/</span>
            <span style={{ color: "#1f2937", fontSize: "14px", fontWeight: "500" }}>My Attendance</span>
          </div>

          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "24px",
            boxShadow: "0 4px 20px rgba(16, 185, 129, 0.3)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px"
          }}>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>
                📋 My Attendance
              </h1>
              <p style={{ fontSize: "15px", opacity: 0.9 }}>
                Track your attendance across all subjects
              </p>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.2)",
              padding: "20px 32px",
              borderRadius: "12px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "36px", fontWeight: "800" }}>{overallPercentage}%</div>
              <div style={{ fontSize: "14px", opacity: 0.9 }}>Overall Attendance</div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              padding: "16px 20px",
              borderRadius: "12px",
              marginBottom: "24px",
              color: "#dc2626",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <span>⚠️</span>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "60px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
              <p style={{ color: "#6b7280" }}>Loading your attendance...</p>
            </div>
          ) : (
            <>
              {/* Subject-wise Summary */}
              <div style={{
                background: "white",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "24px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
              }}>
                <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "20px" }}>
                  📊 Subject-wise Attendance
                </h2>

                {summary.length === 0 ? (
                  <p style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>
                    No attendance records found.
                  </p>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                    {summary.map((sub, idx) => {
                      const pct = parseFloat(sub.percentage);
                      const color = getAttendanceColor(pct);
                      return (
                        <div
                          key={idx}
                          style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            padding: "20px",
                            background: "#fafafa"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                            <div>
                              <div style={{ fontWeight: "600", color: "#1f2937", fontSize: "16px" }}>
                                {sub.subject?.code || "Unknown"}
                              </div>
                              <div style={{ fontSize: "13px", color: "#6b7280" }}>
                                {sub.subject?.name || "Unknown Subject"}
                              </div>
                            </div>
                            <div style={{
                              fontSize: "24px",
                              fontWeight: "700",
                              color: color
                            }}>
                              {sub.percentage}%
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div style={{
                            height: "8px",
                            background: "#e5e7eb",
                            borderRadius: "4px",
                            overflow: "hidden",
                            marginBottom: "12px"
                          }}>
                            <div style={{
                              height: "100%",
                              width: `${pct}%`,
                              background: color,
                              borderRadius: "4px",
                              transition: "width 0.5s ease"
                            }} />
                          </div>

                          {/* Stats */}
                          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: "500" }}>
                              ✓ Present: {sub.present}
                            </span>
                            <span style={{ fontSize: "12px", color: "#dc2626", fontWeight: "500" }}>
                              ✕ Absent: {sub.absent}
                            </span>
                            <span style={{ fontSize: "12px", color: "#d97706", fontWeight: "500" }}>
                              ⏱ Late: {sub.late}
                            </span>
                            <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "500" }}>
                              Total: {sub.total}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent Attendance Records */}
              <div style={{
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
              }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb" }}>
                  <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937" }}>
                    📅 Recent Attendance Records
                  </h2>
                </div>

                {attendance.length === 0 ? (
                  <div style={{ padding: "40px", textAlign: "center" }}>
                    <p style={{ color: "#6b7280" }}>No attendance records found.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#f8fafc" }}>
                          <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Date</th>
                          <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Subject</th>
                          <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Period</th>
                          <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.slice(0, 50).map(record => (
                          <tr key={record.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ padding: "14px 20px", fontWeight: "500", color: "#1f2937" }}>
                              {new Date(record.date).toLocaleDateString("en-IN", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                              })}
                            </td>
                            <td style={{ padding: "14px 20px" }}>
                              <span style={{
                                background: "#f1f5f9",
                                padding: "4px 10px",
                                borderRadius: "6px",
                                fontSize: "13px",
                                fontWeight: "500",
                                color: "#374151"
                              }}>
                                {record.subjects?.code || "N/A"}
                              </span>
                            </td>
                            <td style={{ padding: "14px 20px", textAlign: "center", color: "#6b7280" }}>
                              Period {record.period}
                            </td>
                            <td style={{ padding: "14px 20px", textAlign: "center" }}>
                              {getStatusBadge(record.status)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
