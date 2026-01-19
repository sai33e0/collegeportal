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
  semester: number;
}

interface Student {
  id: number;
  roll_no: string;
  users?: { full_name: string };
}

interface AttendanceRecord {
  id: number;
  student_id: number;
  subject_id: number;
  date: string;
  period: number;
  status: string;
  students?: {
    roll_no: string;
    users?: { full_name: string };
  };
}

export default function FacultyAttendancePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [showEntryForm, setShowEntryForm] = useState(false);

  // Attendance entries
  const [attendanceEntries, setAttendanceEntries] = useState<{ [studentId: number]: string }>({});

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
        // Initialize all as present
        const initialEntries: { [key: number]: string } = {};
        (data.students || []).forEach((s: Student) => {
          initialEntries[s.id] = "present";
        });
        setAttendanceEntries(initialEntries);
      }
    } catch {
      setError("Failed to fetch students");
    }
  }, []);

  const fetchAttendance = useCallback(async () => {
    if (!selectedSubject) return;

    try {
      const token = getToken();
      const url = `${API_BASE_URL}/faculty/attendance?subject_id=${selectedSubject}&date=${selectedDate}`;

      const response = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAttendance(data.attendance || []);
      }
    } catch {
      setError("Failed to fetch attendance");
    }
  }, [selectedSubject, selectedDate]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    if (selectedSubject) {
      const subject = subjects.find(s => s.id === selectedSubject);
      if (subject) {
        fetchStudents(subject.semester);
      }
      fetchAttendance();
    }
  }, [selectedSubject, selectedDate, subjects, fetchStudents, fetchAttendance]);

  const handleSubjectSelect = (subjectId: number) => {
    setSelectedSubject(subjectId);
  };

  const handleAttendanceChange = (studentId: number, status: string) => {
    setAttendanceEntries(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAllPresent = () => {
    const entries: { [key: number]: string } = {};
    students.forEach(s => {
      entries[s.id] = "present";
    });
    setAttendanceEntries(entries);
  };

  const handleMarkAllAbsent = () => {
    const entries: { [key: number]: string } = {};
    students.forEach(s => {
      entries[s.id] = "absent";
    });
    setAttendanceEntries(entries);
  };

  const handleBulkSubmit = async () => {
    if (!selectedSubject) return;

    setError("");
    setSuccess("");

    const attendanceData = Object.entries(attendanceEntries)
      .map(([studentId, status]) => ({
        student_id: parseInt(studentId),
        status
      }));

    if (attendanceData.length === 0) {
      setError("No attendance data to save");
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/faculty/attendance/bulk`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          subject_id: selectedSubject,
          date: selectedDate,
          period: selectedPeriod,
          attendance_data: attendanceData
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(`Attendance saved for ${data.results?.length || 0} students!`);
        setShowEntryForm(false);
        fetchAttendance();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save attendance");
      }
    } catch {
      setError("Failed to save attendance");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: { bg: string; color: string } } = {
      present: { bg: "#f0fdf4", color: "#16a34a" },
      absent: { bg: "#fef2f2", color: "#dc2626" },
      late: { bg: "#fef3c7", color: "#d97706" },
      excused: { bg: "#eff6ff", color: "#3b82f6" }
    };
    const style = styles[status] || styles.absent;
    return (
      <span style={{
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        background: style.bg,
        color: style.color,
        textTransform: "capitalize"
      }}>
        {status}
      </span>
    );
  };

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
            <span style={{ color: "#1f2937", fontSize: "14px", fontWeight: "500" }}>Attendance</span>
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
              📋 Attendance Management
            </h1>
            <p style={{ fontSize: "15px", color: "#6b7280" }}>
              Mark and manage student attendance for your subjects
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
                      border: selectedSubject === subject.id ? "2px solid #8b5cf6" : "2px solid #e5e7eb",
                      background: selectedSubject === subject.id ? "#f5f3ff" : "white",
                      color: selectedSubject === subject.id ? "#6d28d9" : "#4b5563",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {subject.code} - {subject.name}
                    <span style={{ display: "block", fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                      Semester {subject.semester}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date & Period Selection */}
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
              <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <label style={{ fontWeight: "600", color: "#374151" }}>Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="form-input"
                    style={{ width: "auto" }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <label style={{ fontWeight: "600", color: "#374151" }}>Period:</label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
                    className="form-input"
                    style={{ width: "auto" }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                      <option key={p} value={p}>Period {p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => setShowEntryForm(!showEntryForm)}
                style={{
                  background: showEntryForm ? "#6b7280" : "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)"
                }}
              >
                {showEntryForm ? "✕ Close" : "📋 Mark Attendance"}
              </button>
            </div>
          )}

          {/* Attendance Entry Form */}
          {showEntryForm && selectedSubject && (
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              borderLeft: "4px solid #8b5cf6"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937" }}>
                  Mark Attendance - {selectedDate}
                </h3>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={handleMarkAllPresent}
                    style={{
                      background: "#f0fdf4",
                      color: "#16a34a",
                      border: "1px solid #bbf7d0",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "500",
                      cursor: "pointer"
                    }}
                  >
                    ✓ Mark All Present
                  </button>
                  <button
                    onClick={handleMarkAllAbsent}
                    style={{
                      background: "#fef2f2",
                      color: "#dc2626",
                      border: "1px solid #fecaca",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "500",
                      cursor: "pointer"
                    }}
                  >
                    ✕ Mark All Absent
                  </button>
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
                          <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Status</th>
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
                              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                {["present", "absent", "late", "excused"].map(status => (
                                  <button
                                    key={status}
                                    onClick={() => handleAttendanceChange(student.id, status)}
                                    style={{
                                      padding: "6px 14px",
                                      borderRadius: "6px",
                                      border: attendanceEntries[student.id] === status ? "2px solid" : "1px solid #e5e7eb",
                                      background: attendanceEntries[student.id] === status
                                        ? (status === "present" ? "#f0fdf4" : status === "absent" ? "#fef2f2" : status === "late" ? "#fef3c7" : "#eff6ff")
                                        : "white",
                                      color: attendanceEntries[student.id] === status
                                        ? (status === "present" ? "#16a34a" : status === "absent" ? "#dc2626" : status === "late" ? "#d97706" : "#3b82f6")
                                        : "#6b7280",
                                      borderColor: attendanceEntries[student.id] === status
                                        ? (status === "present" ? "#16a34a" : status === "absent" ? "#dc2626" : status === "late" ? "#d97706" : "#3b82f6")
                                        : "#e5e7eb",
                                      fontSize: "12px",
                                      fontWeight: "500",
                                      cursor: "pointer",
                                      textTransform: "capitalize"
                                    }}
                                  >
                                    {status === "present" ? "✓ P" : status === "absent" ? "✕ A" : status === "late" ? "⏱ L" : "📝 E"}
                                  </button>
                                ))}
                              </div>
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
                      💾 Save Attendance
                    </button>
                    <button
                      onClick={() => setShowEntryForm(false)}
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

          {/* Existing Attendance Records */}
          {selectedSubject && (
            <div style={{
              background: "white",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
            }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937" }}>
                  📋 Attendance Records - {selectedDate}
                </h3>
              </div>

              {attendance.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center" }}>
                  <p style={{ color: "#6b7280" }}>No attendance records for this date.</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f8fafc" }}>
                        <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Roll No</th>
                        <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Student Name</th>
                        <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Period</th>
                        <th style={{ padding: "14px 20px", textAlign: "center", fontWeight: "600", fontSize: "13px", color: "#374151" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map(record => (
                        <tr key={record.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "14px 20px", fontWeight: "600", color: "#1f2937" }}>
                            {record.students?.roll_no || "N/A"}
                          </td>
                          <td style={{ padding: "14px 20px", color: "#4b5563" }}>
                            {record.students?.users?.full_name || "N/A"}
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
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
