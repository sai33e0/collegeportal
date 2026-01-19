"use client";

import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Link from "next/link";
import { ROLE_IDS, API_BASE_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth";

interface Mark {
  id: number;
  exam_type: string;
  marks_obtained: number;
  max_marks: number;
  subjects?: {
    name: string;
    code: string;
    credits: number;
    semester: number;
  };
}

interface GroupedMark {
  subject: {
    name: string;
    code: string;
    credits: number;
    semester: number;
  } | null;
  marks: {
    id: number;
    exam_type: string;
    marks_obtained: number;
    max_marks: number;
    percentage: string;
  }[];
}

interface MarksSummary {
  semester: number;
  subjects: {
    name: string;
    code: string;
    credits: number;
    marks: { [key: string]: { obtained: number; max: number } };
  }[];
  total_obtained: number;
  total_max: number;
  percentage: string;
}

export default function StudentMarksPage() {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [grouped, setGrouped] = useState<{ [key: string]: GroupedMark }>({});
  const [summary, setSummary] = useState<MarksSummary[]>([]);
  const [currentSemester, setCurrentSemester] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"detailed" | "summary">("detailed");

  const fetchMarks = useCallback(async () => {
    try {
      const token = getToken();

      const [marksRes, summaryRes] = await Promise.all([
        fetch(`${API_BASE_URL}/student/marks`, {
          headers: { "Authorization": `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/student/marks/summary`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
      ]);

      if (marksRes.ok) {
        const data = await marksRes.json();
        setMarks(data.marks || []);
        setGrouped(data.grouped || {});
      }

      if (summaryRes.ok) {
        const data = await summaryRes.json();
        setSummary(data.summary || []);
        setCurrentSemester(data.current_semester || 1);
      }

      setLoading(false);
    } catch {
      setError("Failed to fetch marks");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarks();
  }, [fetchMarks]);

  const getExamTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      internal1: "Internal 1",
      internal2: "Internal 2",
      lab: "Lab Exam",
      assignment: "Assignment",
      final: "Final Exam"
    };
    return labels[type] || type;
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: "A+", color: "#16a34a" };
    if (percentage >= 80) return { grade: "A", color: "#22c55e" };
    if (percentage >= 70) return { grade: "B+", color: "#84cc16" };
    if (percentage >= 60) return { grade: "B", color: "#eab308" };
    if (percentage >= 50) return { grade: "C", color: "#f59e0b" };
    if (percentage >= 40) return { grade: "D", color: "#ef4444" };
    return { grade: "F", color: "#dc2626" };
  };

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
            <span style={{ color: "#1f2937", fontSize: "14px", fontWeight: "500" }}>My Marks</span>
          </div>

          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "24px",
            boxShadow: "0 4px 20px rgba(30, 58, 138, 0.3)",
            color: "white"
          }}>
            <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>
              📊 My Academic Performance
            </h1>
            <p style={{ fontSize: "15px", opacity: 0.9 }}>
              View your marks and academic progress across all semesters
            </p>
          </div>

          {/* View Toggle */}
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "8px",
            marginBottom: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            display: "inline-flex",
            gap: "8px"
          }}>
            <button
              onClick={() => setViewMode("detailed")}
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                background: viewMode === "detailed" ? "#1e3a8a" : "transparent",
                color: viewMode === "detailed" ? "white" : "#4b5563",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              📋 Detailed View
            </button>
            <button
              onClick={() => setViewMode("summary")}
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                background: viewMode === "summary" ? "#1e3a8a" : "transparent",
                color: viewMode === "summary" ? "white" : "#4b5563",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              📊 Semester Summary
            </button>
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
              <p style={{ color: "#6b7280" }}>Loading your marks...</p>
            </div>
          ) : viewMode === "detailed" ? (
            /* Detailed View */
            <div>
              {marks.length === 0 ? (
                <div style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "60px",
                  textAlign: "center",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
                }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "8px" }}>
                    No marks available yet
                  </h3>
                  <p style={{ color: "#6b7280" }}>
                    Your marks will appear here once they are published by faculty.
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "24px" }}>
                  {Object.entries(grouped).map(([subjectCode, data]) => {
                    const totalObtained = data.marks.reduce((sum, m) => sum + m.marks_obtained, 0);
                    const totalMax = data.marks.reduce((sum, m) => sum + m.max_marks, 0);
                    const overallPercentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
                    const grade = getGrade(overallPercentage);

                    return (
                      <div
                        key={subjectCode}
                        style={{
                          background: "white",
                          borderRadius: "16px",
                          overflow: "hidden",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
                        }}
                      >
                        {/* Subject Header */}
                        <div style={{
                          padding: "20px 24px",
                          background: "#f8fafc",
                          borderBottom: "1px solid #e5e7eb",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}>
                          <div>
                            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "4px" }}>
                              {subjectCode} - {data.subject?.name || "Unknown"}
                            </h3>
                            <p style={{ fontSize: "13px", color: "#6b7280" }}>
                              Semester {data.subject?.semester} • {data.subject?.credits} Credits
                            </p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{
                              fontSize: "28px",
                              fontWeight: "700",
                              color: grade.color
                            }}>
                              {grade.grade}
                            </div>
                            <div style={{ fontSize: "13px", color: "#6b7280" }}>
                              {overallPercentage.toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        {/* Marks Table */}
                        <div style={{ overflowX: "auto" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                              <tr style={{ background: "#f8fafc" }}>
                                <th style={{ padding: "12px 20px", textAlign: "left", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Exam Type</th>
                                <th style={{ padding: "12px 20px", textAlign: "center", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Marks Obtained</th>
                                <th style={{ padding: "12px 20px", textAlign: "center", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Max Marks</th>
                                <th style={{ padding: "12px 20px", textAlign: "center", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Percentage</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.marks.map(mark => {
                                const pct = parseFloat(mark.percentage);
                                return (
                                  <tr key={mark.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <td style={{ padding: "14px 20px", fontWeight: "500", color: "#1f2937" }}>
                                      {getExamTypeLabel(mark.exam_type)}
                                    </td>
                                    <td style={{ padding: "14px 20px", textAlign: "center", fontWeight: "600", color: "#1f2937" }}>
                                      {mark.marks_obtained}
                                    </td>
                                    <td style={{ padding: "14px 20px", textAlign: "center", color: "#6b7280" }}>
                                      {mark.max_marks}
                                    </td>
                                    <td style={{ padding: "14px 20px", textAlign: "center" }}>
                                      <span style={{
                                        padding: "4px 12px",
                                        borderRadius: "20px",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        background: pct >= 40 ? "#f0fdf4" : "#fef2f2",
                                        color: pct >= 40 ? "#16a34a" : "#dc2626"
                                      }}>
                                        {mark.percentage}%
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot>
                              <tr style={{ background: "#f8fafc" }}>
                                <td style={{ padding: "14px 20px", fontWeight: "700", color: "#1f2937" }}>Total</td>
                                <td style={{ padding: "14px 20px", textAlign: "center", fontWeight: "700", color: "#1f2937" }}>{totalObtained}</td>
                                <td style={{ padding: "14px 20px", textAlign: "center", fontWeight: "600", color: "#6b7280" }}>{totalMax}</td>
                                <td style={{ padding: "14px 20px", textAlign: "center", fontWeight: "700", color: grade.color }}>{overallPercentage.toFixed(1)}%</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Summary View */
            <div>
              {summary.length === 0 ? (
                <div style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "60px",
                  textAlign: "center",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
                }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "8px" }}>
                    No semester data available
                  </h3>
                  <p style={{ color: "#6b7280" }}>
                    Your semester summary will appear here once marks are published.
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "24px" }}>
                  {summary.map(sem => {
                    const grade = getGrade(parseFloat(sem.percentage));
                    return (
                      <div
                        key={sem.semester}
                        style={{
                          background: "white",
                          borderRadius: "16px",
                          overflow: "hidden",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
                        }}
                      >
                        {/* Semester Header */}
                        <div style={{
                          padding: "24px",
                          background: sem.semester === currentSemester
                            ? "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)"
                            : "#f8fafc",
                          color: sem.semester === currentSemester ? "white" : "#1f2937",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}>
                          <div>
                            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "4px" }}>
                              Semester {sem.semester}
                              {sem.semester === currentSemester && (
                                <span style={{
                                  marginLeft: "12px",
                                  padding: "4px 12px",
                                  background: "rgba(255,255,255,0.2)",
                                  borderRadius: "20px",
                                  fontSize: "12px",
                                  fontWeight: "500"
                                }}>
                                  Current
                                </span>
                              )}
                            </h3>
                            <p style={{ fontSize: "14px", opacity: 0.8 }}>
                              {sem.subjects.length} Subjects
                            </p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{
                              fontSize: "36px",
                              fontWeight: "800",
                              color: sem.semester === currentSemester ? "white" : grade.color
                            }}>
                              {sem.percentage}%
                            </div>
                            <div style={{
                              fontSize: "14px",
                              opacity: 0.8
                            }}>
                              {sem.total_obtained} / {sem.total_max}
                            </div>
                          </div>
                        </div>

                        {/* Subjects List */}
                        <div style={{ padding: "20px 24px" }}>
                          {sem.subjects.map(sub => {
                            const subTotal = Object.values(sub.marks).reduce((sum, m) => sum + m.obtained, 0);
                            const subMax = Object.values(sub.marks).reduce((sum, m) => sum + m.max, 0);
                            const subPct = subMax > 0 ? (subTotal / subMax) * 100 : 0;

                            return (
                              <div
                                key={sub.code}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  padding: "12px 0",
                                  borderBottom: "1px solid #f1f5f9"
                                }}
                              >
                                <div>
                                  <div style={{ fontWeight: "600", color: "#1f2937" }}>{sub.code}</div>
                                  <div style={{ fontSize: "13px", color: "#6b7280" }}>{sub.name}</div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                  <span style={{
                                    padding: "4px 12px",
                                    borderRadius: "20px",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    background: subPct >= 40 ? "#f0fdf4" : "#fef2f2",
                                    color: subPct >= 40 ? "#16a34a" : "#dc2626"
                                  }}>
                                    {subPct.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
