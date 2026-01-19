"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import { ROLE_IDS, API_BASE_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth";

interface Mark {
  id: number;
  student_id: number;
  subject_id: number;
  exam_type: string;
  marks_obtained: number;
  max_marks: number;
  published: boolean;
  subjects?: {
    name: string;
    code: string;
    credits: number;
  };
}

export default function StudentDashboard() {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/marks/student/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMarks(data.marks || []);
      } else {
        setError("Failed to fetch marks");
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch marks");
      setLoading(false);
    }
  };

  const getExamTypeName = (examType: string) => {
    switch (examType) {
      case "internal1": return "Internal 1";
      case "internal2": return "Internal 2";
      case "final": return "Final Exam";
      default: return examType;
    }
  };

  const calculatePercentage = (obtained: number, max: number) => {
    return ((obtained / max) * 100).toFixed(2);
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  };

  return (
    <ProtectedRoute requiredRoleId={ROLE_IDS.STUDENT}>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <Header />

        <div className="dashboard-card">
          <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "#333", marginBottom: "10px" }}>
            Student Dashboard
          </h1>
          <p style={{ fontSize: "18px", color: "#666", marginBottom: "30px" }}>
            View your published marks and academic performance
          </p>

          {error && (
            <div style={{ background: "#fee", border: "1px solid #fcc", padding: "12px", borderRadius: "6px", marginBottom: "20px", color: "#c00" }}>
              {error}
            </div>
          )}

          {/* Marks Section */}
          <div style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", marginBottom: "20px" }}>
              My Marks
            </h2>

            {loading ? (
              <p>Loading marks...</p>
            ) : marks.length === 0 ? (
              <div className="placeholder-section">
                No published marks available yet. Check back later!
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden" }}>
                  <thead>
                    <tr style={{ background: "#f5f5f5", borderBottom: "2px solid #667eea" }}>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Subject</th>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Code</th>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Exam Type</th>
                      <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Marks Obtained</th>
                      <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Max Marks</th>
                      <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Percentage</th>
                      <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((mark) => {
                      const percentage = parseFloat(calculatePercentage(mark.marks_obtained, mark.max_marks));
                      const grade = getGrade(percentage);

                      return (
                        <tr key={mark.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                          <td style={{ padding: "12px" }}>{mark.subjects?.name || "N/A"}</td>
                          <td style={{ padding: "12px" }}>{mark.subjects?.code || "N/A"}</td>
                          <td style={{ padding: "12px" }}>{getExamTypeName(mark.exam_type)}</td>
                          <td style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>
                            {mark.marks_obtained}
                          </td>
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            {mark.max_marks}
                          </td>
                          <td style={{ padding: "12px", textAlign: "center", fontWeight: "600", color: percentage >= 40 ? "#2e7d32" : "#c62828" }}>
                            {percentage}%
                          </td>
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <span style={{
                              padding: "4px 12px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "600",
                              background: percentage >= 40 ? "#e8f5e9" : "#ffebee",
                              color: percentage >= 40 ? "#2e7d32" : "#c62828"
                            }}>
                              {grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
