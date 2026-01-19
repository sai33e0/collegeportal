"use client";

import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Link from "next/link";
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

interface Student {
  id: number;
  roll_no: string;
  users: { full_name: string };
}

interface Subject {
  id: number;
  name: string;
  code: string;
}

interface UserData {
  id: string | number;
  role_id: number;
  full_name: string;
}

export default function AdminMarksPage() {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    student_id: "",
    subject_id: "",
    exam_type: "internal1",
    marks_obtained: "",
    max_marks: "100",
    published: false
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const token = getToken();
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      // Fetch marks
      const marksRes = await fetch(`${API_BASE_URL}/marks/all`, { headers });
      if (marksRes.ok) {
        const marksData = await marksRes.json();
        setMarks(marksData.marks || []);
      }

      // Fetch students
      const studentsRes = await fetch(`${API_BASE_URL}/admin/users`, { headers });
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        // Filter only students (role_id = 1)
        const studentUsers = studentsData.users?.filter((u: UserData) => u.role_id === 1) || [];
        // For now, use user IDs as student IDs (ideally fetch from students table)
        setStudents(studentUsers.map((u: UserData) => ({
          id: u.id,
          roll_no: "N/A",
          users: { full_name: u.full_name }
        })));
      }

      // Fetch subjects
      const subjectsRes = await fetch(`${API_BASE_URL}/admin/subjects`, { headers });
      if (subjectsRes.ok) {
        const subjectsData = await subjectsRes.json();
        setSubjects(subjectsData.subjects || []);
      }

      setLoading(false);
    } catch {
      setError("Failed to fetch data");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = getToken();
      const url = editingId
        ? `${API_BASE_URL}/marks/${editingId}`
        : `${API_BASE_URL}/marks`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          student_id: parseInt(formData.student_id),
          subject_id: parseInt(formData.subject_id),
          exam_type: formData.exam_type,
          marks_obtained: parseFloat(formData.marks_obtained),
          max_marks: parseFloat(formData.max_marks),
          published: formData.published
        })
      });

      if (response.ok) {
        setSuccess(editingId ? "Marks updated successfully!" : "Marks added successfully!");
        setShowAddForm(false);
        setEditingId(null);
        setFormData({
          student_id: "",
          subject_id: "",
          exam_type: "internal1",
          marks_obtained: "",
          max_marks: "100",
          published: false
        });
        fetchData();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save marks");
      }
    } catch {
      setError("Failed to save marks");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete these marks?")) return;

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/marks/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess("Marks deleted successfully!");
        fetchData();
      } else {
        setError("Failed to delete marks");
      }
    } catch {
      setError("Failed to delete marks");
    }
  };

  const handlePublish = async (id: number, published: boolean) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/marks/${id}/publish`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ published })
      });

      if (response.ok) {
        setSuccess(`Marks ${published ? "published" : "unpublished"} successfully!`);
        fetchData();
      } else {
        setError("Failed to update publish status");
      }
    } catch {
      setError("Failed to update publish status");
    }
  };

  const handleEdit = (mark: Mark) => {
    setEditingId(mark.id);
    setFormData({
      student_id: mark.student_id.toString(),
      subject_id: mark.subject_id.toString(),
      exam_type: mark.exam_type,
      marks_obtained: mark.marks_obtained.toString(),
      max_marks: mark.max_marks.toString(),
      published: mark.published
    });
    setShowAddForm(true);
  };

  return (
    <ProtectedRoute requiredRoleId={ROLE_IDS.ADMIN}>
      <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>
        <Header />

        <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px" }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Link href="/admin" style={{ color: "#6b7280", textDecoration: "none", fontSize: "14px" }}>
              Dashboard
            </Link>
            <span style={{ color: "#9ca3af" }}>/</span>
            <span style={{ color: "#1f2937", fontSize: "14px", fontWeight: "500" }}>Marks Management</span>
          </div>

          {/* Header Section */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px"
          }}>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1f2937", marginBottom: "8px" }}>
                📝 Marks Management
              </h1>
              <p style={{ fontSize: "15px", color: "#6b7280" }}>
                Add, edit, and publish student marks
              </p>
            </div>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditingId(null);
                setFormData({
                  student_id: "",
                  subject_id: "",
                  exam_type: "internal1",
                  marks_obtained: "",
                  max_marks: "100",
                  published: false
                });
              }}
              style={{
                background: showAddForm ? "#6b7280" : "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                color: "white",
                border: "none",
                padding: "14px 28px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 12px rgba(30, 58, 138, 0.3)"
              }}
            >
              {showAddForm ? "✕ Cancel" : "➕ Add Marks"}
            </button>
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
              <button
                onClick={() => setError("")}
                style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}
              >
                ✕
              </button>
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
              <button
                onClick={() => setSuccess("")}
                style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Add/Edit Form */}
          {showAddForm && (
            <div style={{
              background: "white",
              padding: "32px",
              borderRadius: "16px",
              marginBottom: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              borderLeft: "4px solid #3b82f6"
            }}>
              <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "24px" }}>
                {editingId ? "✏️ Edit Marks" : "➕ Add New Marks"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "24px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151", fontSize: "14px" }}>
                      Student
                    </label>
                    <select
                      value={formData.student_id}
                      onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                      required
                      className="form-input"
                    >
                      <option value="">Select Student</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.users.full_name} ({s.roll_no})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151", fontSize: "14px" }}>
                      Subject
                    </label>
                    <select
                      value={formData.subject_id}
                      onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                      required
                      className="form-input"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.code} - {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151", fontSize: "14px" }}>
                      Exam Type
                    </label>
                    <select
                      value={formData.exam_type}
                      onChange={(e) => setFormData({ ...formData, exam_type: e.target.value })}
                      required
                      className="form-input"
                    >
                      <option value="internal1">Internal 1</option>
                      <option value="internal2">Internal 2</option>
                      <option value="final">Final Exam</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151", fontSize: "14px" }}>
                      Marks Obtained
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.marks_obtained}
                      onChange={(e) => setFormData({ ...formData, marks_obtained: e.target.value })}
                      required
                      className="form-input"
                      placeholder="Enter marks"
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151", fontSize: "14px" }}>
                      Max Marks
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.max_marks}
                      onChange={(e) => setFormData({ ...formData, max_marks: e.target.value })}
                      required
                      className="form-input"
                      placeholder="Maximum marks"
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "32px" }}>
                    <input
                      type="checkbox"
                      id="publishCheck"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      style={{ width: "20px", height: "20px", accentColor: "#3b82f6" }}
                    />
                    <label htmlFor="publishCheck" style={{ fontWeight: "500", color: "#374151" }}>
                      Publish immediately
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: "14px 36px" }}
                >
                  {editingId ? "Update Marks" : "Add Marks"}
                </button>
              </form>
            </div>
          )}

          {/* Marks Table */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
          }}>
            {loading ? (
              <div style={{ padding: "60px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
                <p style={{ color: "#6b7280" }}>Loading marks...</p>
              </div>
            ) : marks.length === 0 ? (
              <div style={{ padding: "60px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "8px" }}>
                  No marks added yet
                </h3>
                <p style={{ color: "#6b7280", marginBottom: "20px" }}>
                  Click &quot;Add Marks&quot; to get started.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e5e7eb" }}>
                      <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#374151", fontSize: "13px", textTransform: "uppercase" }}>Student</th>
                      <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#374151", fontSize: "13px", textTransform: "uppercase" }}>Roll No</th>
                      <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#374151", fontSize: "13px", textTransform: "uppercase" }}>Subject</th>
                      <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#374151", fontSize: "13px", textTransform: "uppercase" }}>Exam</th>
                      <th style={{ padding: "16px 20px", textAlign: "center", fontWeight: "600", color: "#374151", fontSize: "13px", textTransform: "uppercase" }}>Marks</th>
                      <th style={{ padding: "16px 20px", textAlign: "center", fontWeight: "600", color: "#374151", fontSize: "13px", textTransform: "uppercase" }}>Status</th>
                      <th style={{ padding: "16px 20px", textAlign: "center", fontWeight: "600", color: "#374151", fontSize: "13px", textTransform: "uppercase" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((mark) => (
                      <tr key={mark.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "16px 20px", fontWeight: "500", color: "#1f2937" }}>
                          {mark.students?.users?.full_name || "N/A"}
                        </td>
                        <td style={{ padding: "16px 20px", color: "#6b7280" }}>
                          {mark.students?.roll_no || "N/A"}
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{
                            background: "#f1f5f9",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "#374151"
                          }}>
                            {mark.subjects?.code || "N/A"}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px", color: "#6b7280" }}>
                          {mark.exam_type === "internal1" ? "Internal 1" :
                           mark.exam_type === "internal2" ? "Internal 2" : "Final"}
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "center" }}>
                          <span style={{
                            fontSize: "15px",
                            fontWeight: "600",
                            color: (mark.marks_obtained / mark.max_marks) >= 0.4 ? "#10b981" : "#ef4444"
                          }}>
                            {mark.marks_obtained} / {mark.max_marks}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "center" }}>
                          <span style={{
                            padding: "6px 14px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                            background: mark.published ? "#f0fdf4" : "#fef3c7",
                            color: mark.published ? "#16a34a" : "#d97706"
                          }}>
                            {mark.published ? "✓ Published" : "Draft"}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            <button
                              onClick={() => handleEdit(mark)}
                              style={{
                                background: "#eff6ff",
                                color: "#3b82f6",
                                border: "none",
                                padding: "8px 14px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: "500",
                                cursor: "pointer"
                              }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handlePublish(mark.id, !mark.published)}
                              style={{
                                background: mark.published ? "#fef3c7" : "#f0fdf4",
                                color: mark.published ? "#d97706" : "#16a34a",
                                border: "none",
                                padding: "8px 14px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: "500",
                                cursor: "pointer"
                              }}
                            >
                              {mark.published ? "📤 Unpublish" : "📢 Publish"}
                            </button>
                            <button
                              onClick={() => handleDelete(mark.id)}
                              style={{
                                background: "#fef2f2",
                                color: "#dc2626",
                                border: "none",
                                padding: "8px 14px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: "500",
                                cursor: "pointer"
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
