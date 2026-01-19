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
  students?: {
    roll_no: string;
    users: { full_name: string };
  };
  subjects?: {
    name: string;
    code: string;
  };
}

export default function FacultyDashboard() {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/marks/faculty/subjects`, {
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

  // Get unique subjects
  const uniqueSubjects = Array.from(
    new Set(marks.map(m => m.subjects?.code).filter(Boolean))
  );

  // Filter marks by selected subject
  const filteredMarks = selectedSubject === "all"
    ? marks
    : marks.filter(m => m.subjects?.code === selectedSubject);

  return (
    <ProtectedRoute requiredRoleId={ROLE_IDS.FACULTY}>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <Header />

        <div className="dashboard-card">
          <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "#333", marginBottom: "10px" }}>
            Faculty Dashboard
          </h1>
          <p style={{ fontSize: "18px", color: "#666", marginBottom: "30px" }}>
            View marks for your assigned subjects (Read-only)
          </p>

          {error && (
            <div style={{ background: "#fee", border: "1px solid #fcc", padding: "12px", borderRadius: "6px", marginBottom: "20px", color: "#c00" }}>
              {error}
            </div>
          )}

          {/* Subject Filter */}
          {!loading && marks.length > 0 && uniqueSubjects.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Filter by Subject:</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="form-input"
                style={{ maxWidth: "300px" }}
              >
                <option value="all">All Subjects</option>
                {uniqueSubjects.map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>
          )}

          {/* Marks Section */}
          <div style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", marginBottom: "20px" }}>
              Student Marks
            </h2>

            {loading ? (
              <p>Loading marks...</p>
            ) : marks.length === 0 ? (
              <div className="placeholder-section">
                No marks available for your assigned subjects. Contact admin if you believe this is an error.
              </div>
            ) : filteredMarks.length === 0 ? (
              <div className="placeholder-section">
                No marks found for the selected subject.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden" }}>
                  <thead>
                    <tr style={{ background: "#f5f5f5", borderBottom: "2px solid #667eea" }}>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Student Name</th>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Roll No</th>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Subject</th>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Exam Type</th>
                      <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Marks</th>
                      <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Percentage</th>
                      <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMarks.map((mark) => {
                      const percentage = parseFloat(calculatePercentage(mark.marks_obtained, mark.max_marks));

                      return (
                        <tr key={mark.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                          <td style={{ padding: "12px" }}>{mark.students?.users?.full_name || "N/A"}</td>
                          <td style={{ padding: "12px" }}>{mark.students?.roll_no || "N/A"}</td>
                          <td style={{ padding: "12px" }}>{mark.subjects?.code || "N/A"}</td>
                          <td style={{ padding: "12px" }}>{getExamTypeName(mark.exam_type)}</td>
                          <td style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>
                            {mark.marks_obtained} / {mark.max_marks}
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
                              background: mark.published ? "#e8f5e9" : "#fff3e0",
                              color: mark.published ? "#2e7d32" : "#e65100"
                            }}>
                              {mark.published ? "Published" : "Draft"}
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

          <div style={{ background: "#e3f2fd", padding: "15px", borderRadius: "6px", border: "1px solid #90caf9" }}>
            <p style={{ fontSize: "14px", color: "#1565c0", margin: 0 }}>
              <strong>Note:</strong> You can only view marks for subjects assigned to you. This is a read-only view. Contact admin to modify marks.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
