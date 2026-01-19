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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
        const studentUsers = studentsData.users?.filter((u: any) => u.role_id === 1) || [];
        // For now, use user IDs as student IDs (ideally fetch from students table)
        setStudents(studentUsers.map((u: any) => ({
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
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
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
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <Header />

        <div className="dashboard-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <div>
              <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "#333", marginBottom: "10px" }}>
                Marks Management
              </h1>
              <p style={{ fontSize: "16px", color: "#666" }}>
                Add, edit, publish marks for students
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
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              {showAddForm ? "Cancel" : "+ Add Marks"}
            </button>
          </div>

          {error && (
            <div style={{ background: "#fee", border: "1px solid #fcc", padding: "12px", borderRadius: "6px", marginBottom: "20px", color: "#c00" }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ background: "#efe", border: "1px solid #cfc", padding: "12px", borderRadius: "6px", marginBottom: "20px", color: "#060" }}>
              {success}
            </div>
          )}

          {/* Add/Edit Form */}
          {showAddForm && (
            <div style={{ background: "#f9f9f9", padding: "30px", borderRadius: "8px", marginBottom: "30px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>
                {editingId ? "Edit Marks" : "Add New Marks"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Student</label>
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
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Subject</label>
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
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Exam Type</label>
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
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Marks Obtained</label>
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
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Max Marks</label>
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

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      style={{ width: "20px", height: "20px" }}
                    />
                    <label style={{ fontWeight: "600" }}>Publish immediately</label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: "auto", padding: "12px 40px" }}
                >
                  {editingId ? "Update Marks" : "Add Marks"}
                </button>
              </form>
            </div>
          )}

          {/* Marks Table */}
          <div style={{ overflowX: "auto" }}>
            {loading ? (
              <p>Loading marks...</p>
            ) : marks.length === 0 ? (
              <div className="placeholder-section">
                No marks added yet. Click "Add Marks" to get started.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f5f5f5", borderBottom: "2px solid #667eea" }}>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Student</th>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Roll No</th>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Subject</th>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Exam</th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Marks</th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Status</th>
                    <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((mark, idx) => (
                    <tr key={mark.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                      <td style={{ padding: "12px" }}>{mark.students?.users?.full_name || "N/A"}</td>
                      <td style={{ padding: "12px" }}>{mark.students?.roll_no || "N/A"}</td>
                      <td style={{ padding: "12px" }}>{mark.subjects?.code || "N/A"}</td>
                      <td style={{ padding: "12px" }}>
                        {mark.exam_type === "internal1" ? "Internal 1" :
                         mark.exam_type === "internal2" ? "Internal 2" : "Final"}
                      </td>
                      <td style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>
                        {mark.marks_obtained} / {mark.max_marks}
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
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button
                            onClick={() => handleEdit(mark)}
                            style={{
                              background: "#2196f3",
                              color: "white",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              fontSize: "14px",
                              cursor: "pointer"
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handlePublish(mark.id, !mark.published)}
                            style={{
                              background: mark.published ? "#ff9800" : "#4caf50",
                              color: "white",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              fontSize: "14px",
                              cursor: "pointer"
                            }}
                          >
                            {mark.published ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            onClick={() => handleDelete(mark.id)}
                            style={{
                              background: "#f44336",
                              color: "white",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              fontSize: "14px",
                              cursor: "pointer"
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
