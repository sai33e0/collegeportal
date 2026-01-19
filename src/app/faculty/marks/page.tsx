"use client";

import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Link from "next/link";
import { ROLE_IDS, API_BASE_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth";

interface Subject {
  id: number;
  code: string;
  name: string;
  credits: number;
  semester: number;
}

interface Student {
  id: number;
  roll_no: string;
  semester: number;
  users?: { full_name: string };
  departments?: { code: string };
}

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
    users?: { full_name: string };
  };
  subjects?: { name: string; code: string };
}

export default function FacultyMarksPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedExamType, setSelectedExamType] = useState("internal1");
  const [showEntryForm, setShowEntryForm] = useState(false);

  // Bulk marks entry
  const [marksEntries, setMarksEntries] = useState<{ [studentId: number]: string }>({});
  const [maxMarks, setMaxMarks] = useState("100");

  const fetchSubjects = useCallback(async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/faculty/subjects`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSubjects(data.subjects || []);
      }
      setLoading(false);
    } catch {
      setError("Failed to fetch subjects");
      setLoading(false);
    }
  }, []);

  const fetchStudents = useCallback(async (semester?: number) => {
    try {
      const token = getToken();
      let url = `${API_BASE_URL}/faculty/students`;
      if (semester) {
        url += `?semester=${semester}`;
      }

      const response = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
      }
    } catch {
      setError("Failed to fetch students");
    }
  }, []);

  const fetchMarks = useCallback(async () => {
    if (!selectedSubject) return;

    try {
      const token = getToken();
      let url = `${API_BASE_URL}/faculty/marks?subject_id=${selectedSubject}`;
      if (selectedExamType) {
        url += `&exam_type=${selectedExamType}`;
      }

      const response = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setMarks(data.marks || []);
      }
    } catch {
      setError("Failed to fetch marks");
    }
  }, [selectedSubject, selectedExamType]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    if (selectedSubject) {
      const subject = subjects.find(s => s.id === selectedSubject);
      if (subject) {
        fetchStudents(subject.semester);
      }
      fetchMarks();
    }
  }, [selectedSubject, selectedExamType, subjects, fetchStudents, fetchMarks]);

  const handleSubjectSelect = (subjectId: number) => {
    setSelectedSubject(subjectId);
    setMarksEntries({});
  };

  const handleMarksChange = (studentId: number, value: string) => {
    setMarksEntries(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  const handleBulkSubmit = async () => {
    if (!selectedSubject) return;

    setError("");
    setSuccess("");

    const marksData = Object.entries(marksEntries)
      .filter(([, value]) => value !== "" && !isNaN(parseFloat(value)))
      .map(([studentId, value]) => ({
        student_id: parseInt(studentId),
        marks_obtained: parseFloat(value)
      }));

    if (marksData.length === 0) {
      setError("Please enter at least one mark");
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/faculty/marks/bulk`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          subject_id: selectedSubject,
          exam_type: selectedExamType,
          max_marks: parseFloat(maxMarks),
          marks_data: marksData
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(`Successfully saved ${data.results?.length || 0} marks entries!`);
        setMarksEntries({});
        setShowEntryForm(false);
        fetchMarks();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save marks");
      }
    } catch {
      setError("Failed to save marks");
    }
  };

  const examTypes = [
    { value: "internal1", label: "Internal 1" },
    { value: "internal2", label: "Internal 2" },
    { value: "lab", label: "Lab Exam" },
    { value: "assignment", label: "Assignment" },
    { value: "final", label: "Final Exam" }
  ];

  return (
    <ProtectedRoute requiredRoleId={ROLE_IDS.FACULTY}>
      <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>
        <Header />

        <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px" }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Link href="/faculty" style={{ color: "#6b7280", textDecoration: "none", fontSize: "14px" }}>
              Dashboard
            </Link>
            <span style={{ color: "#9ca3af" }}>/</span>
            <span style={{ color: "#1f2937", fontSize: "14px", fontWeight: "500" }}>Marks Entry</span>
          </div>

          {/* Header */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
          }}>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1f2937", marginBottom: "8px" }}>
              📝 Marks Entry
            </h1>
            <p style={{ fontSize: "15px", color: "#6b7280" }}>
              Enter and manage marks for your assigned subjects
            </p>
          </div>

          {/* Alerts */}
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
              <button onClick={() => setError("")} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}>✕</button>
            </div>
          )}

          {success && (
            <div style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              padding: "16px 20px",
              borderRadius: "12px",
              marginBottom: "24px",
              color: "#16a34a",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <span>✅</span>
              {success}
              <button onClick={() => setSuccess("")} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}>✕</button>
            </div>
          )}

          {/* Subject Selection */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "16px" }}>
              Select Subject
            </h3>
            {loading ? (
              <p style={{ color: "#6b7280" }}>Loading subjects...</p>
            ) : subjects.length === 0 ? (
              <p style={{ color: "#6b7280" }}>No subjects assigned to you yet.</p>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {subjects.map(subject => (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectSelect(subject.id)}
                    style={{
                      padding: "12px 20px",
                      borderRadius: "10px",
                      border: selectedSubject === subject.id ? "2px solid #3b82f6" : "2px solid #e5e7eb",
                      background: selectedSubject === subject.id ? "#eff6ff" : "white",
                      color: selectedSubject === subject.id ? "#1e40af" : "#4b5563",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {subject.code} - {subject.name}
                    <span style={{ display: "block", fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                      Semester {subject.semester} • {subject.credits} Credits
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Exam Type & Actions */}
          {selectedSubject && (
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <label style={{ fontWeight: "600", color: "#374151" }}>Exam Type:</label>
                <select
                  value={selectedExamType}
                  onChange={(e) => setSelectedExamType(e.target.value)}
                  className="form-input"
                  style={{ width: "auto", minWidth: "180px" }}
                >
                  {examTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setShowEntryForm(!showEntryForm)}
                style={{
                  background: showEntryForm ? "#6b7280" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
                }}
              >
                {showEntryForm ? "✕ Close Entry Form" : "📝 Enter Marks"}
              </button>
            </div>
          )}

          {/* Marks Entry Form */}
          {showEntryForm && selectedSubject && (
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              borderLeft: "4px solid #10b981"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937" }}>
                  Enter Marks - {examTypes.find(t => t.value === selectedExamType)?.label}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <label style={{ fontWeight: "500", color: "#374151" }}>Max Marks:</label>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(e.target.value)}
                    className="form-input"
                    style={{ width: "100px" }}
                    min="1"
                  />
                </div>
              </div>

              {students.length === 0 ? (
                <p style={{ color: "#6b7280" }}>No students found for this subject.</p>
              ) : (
                <>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e5e7eb" }}>
                          <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Roll No</th>
                          <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Student Name</th>
                          <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Marks Obtained</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(student => (
                          <tr key={student.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ padding: "12px 16px", fontWeight: "600", color: "#1f2937" }}>
                              {student.roll_no}
                            </td>
                            <td style={{ padding: "12px 16px", color: "#4b5563" }}>
                              {student.users?.full_name || "N/A"}
                            </td>
                            <td style={{ padding: "12px 16px", textAlign: "center" }}>
                              <input
                                type="number"
                                value={marksEntries[student.id] || ""}
                                onChange={(e) => handleMarksChange(student.id, e.target.value)}
                                className="form-input"
                                style={{ width: "100px", textAlign: "center" }}
                                min="0"
                                max={maxMarks}
                                placeholder="--"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
                    <button
                      onClick={handleBulkSubmit}
                      className="btn-primary"
                      style={{ padding: "14px 32px" }}
                    >
                      💾 Save All Marks
                    </button>
                    <button
                      onClick={() => { setMarksEntries({}); setShowEntryForm(false); }}
                      style={{
                        background: "#f1f5f9",
                        color: "#4b5563",
                        border: "none",
                        padding: "14px 32px",
                        borderRadius: "10px",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Existing Marks */}
          {selectedSubject && (
            <div style={{
              background: "white",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
            }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937" }}>
                  📋 Existing Marks - {examTypes.find(t => t.value === selectedExamType)?.label}
                </h3>
              </div>

              {marks.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center" }}>
                  <p style={{ color: "#6b7280" }}>No marks entered yet for this exam type.</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f8fafc" }}>
                        <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Roll No</th>
                        <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Student Name</th>
                        <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Marks</th>
                        <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Percentage</th>
                        <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marks.map(mark => {
                        const percentage = ((mark.marks_obtained / mark.max_marks) * 100).toFixed(1);
                        return (
                          <tr key={mark.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ padding: "14px 20px", fontWeight: "600", color: "#1f2937" }}>
                              {mark.students?.roll_no || "N/A"}
                            </td>
                            <td style={{ padding: "14px 20px", color: "#4b5563" }}>
                              {mark.students?.users?.full_name || "N/A"}
                            </td>
                            <td style={{ padding: "14px 20px", textAlign: "center", fontWeight: "600" }}>
                              {mark.marks_obtained} / {mark.max_marks}
                            </td>
                            <td style={{ padding: "14px 20px", textAlign: "center" }}>
                              <span style={{
                                padding: "4px 12px",
                                borderRadius: "20px",
                                fontSize: "13px",
                                fontWeight: "600",
                                background: parseFloat(percentage) >= 40 ? "#f0fdf4" : "#fef2f2",
                                color: parseFloat(percentage) >= 40 ? "#16a34a" : "#dc2626"
                              }}>
                                {percentage}%
                              </span>
                            </td>
                            <td style={{ padding: "14px 20px", textAlign: "center" }}>
                              <span style={{
                                padding: "4px 12px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: "600",
                                background: mark.published ? "#f0fdf4" : "#fef3c7",
                                color: mark.published ? "#16a34a" : "#d97706"
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
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
