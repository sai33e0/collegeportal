"use client";

import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Link from "next/link";
import { ROLE_IDS, API_BASE_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth";

interface Student {
  id: number;
  roll_no: string;
  user_id: string;
  department_id?: number;
  semester?: number;
  year_of_admission?: number;
  users?: { full_name: string };
  departments?: { name: string; code: string };
}

interface Department {
  id: number;
  name: string;
  code: string;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    roll_no: "",
    department_id: "",
    semester: "6",
    year_of_admission: new Date().getFullYear().toString()
  });

  const fetchData = useCallback(async () => {
    try {
      const token = getToken();
      const adminHeaders = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      // Departments endpoint is public (no auth needed)
      const publicHeaders = {
        "Content-Type": "application/json"
      };

      const [studentsRes, deptsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/students`, { headers: adminHeaders }),
        fetch(`${API_BASE_URL}/admin/departments`, { headers: publicHeaders })
      ]);

      if (studentsRes.ok) {
        const data = await studentsRes.json();
        setStudents(data.students || []);
      }

      if (deptsRes.ok) {
        const data = await deptsRes.json();
        console.log('Departments fetched:', data);
        setDepartments(data.departments || []);
      } else {
        const errData = await deptsRes.json();
        console.error('Departments error:', deptsRes.status, errData);
      }

      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
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
        ? `${API_BASE_URL}/admin/students/${editingId}`
        : `${API_BASE_URL}/admin/students`;

      const method = editingId ? "PUT" : "POST";

      const body = editingId
        ? {
            roll_no: formData.roll_no,
            department_id: parseInt(formData.department_id),
            semester: parseInt(formData.semester),
            full_name: formData.full_name
          }
        : {
            email: formData.email,
            password: formData.password,
            full_name: formData.full_name,
            roll_no: formData.roll_no,
            department_id: parseInt(formData.department_id),
            semester: parseInt(formData.semester),
            year_of_admission: parseInt(formData.year_of_admission)
          };

      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setSuccess(editingId ? "Student updated successfully!" : "Student created successfully!");
        resetForm();
        fetchData();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save student");
      }
    } catch {
      setError("Failed to save student");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/admin/students/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        setSuccess("Student deleted successfully!");
        fetchData();
      } else {
        setError("Failed to delete student");
      }
    } catch {
      setError("Failed to delete student");
    }
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setFormData({
      email: "",
      password: "",
      full_name: student.users?.full_name || "",
      roll_no: student.roll_no,
      department_id: student.departments
        ? (departments.find(d => d.code === student.departments?.code)?.id?.toString() || "")
        : (student.department_id ? student.department_id.toString() : ""),
      semester: student.semester ? student.semester.toString() : "6",
      year_of_admission: ((student.year_of_admission ?? new Date().getFullYear())).toString()
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      email: "",
      password: "",
      full_name: "",
      roll_no: "",
      department_id: "",
      semester: "6",
      year_of_admission: new Date().getFullYear().toString()
    });
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
            <span style={{ color: "#1f2937", fontSize: "14px", fontWeight: "500" }}>Student Management</span>
          </div>

          {/* Header */}
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
                🎓 Student Management
              </h1>
              <p style={{ fontSize: "15px", color: "#6b7280" }}>
                Add, edit, and manage student accounts
              </p>
            </div>
            <button
              onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}
              style={{
                background: showForm ? "#6b7280" : "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
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
              {showForm ? "✕ Cancel" : "➕ Add Student"}
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

          {/* Add/Edit Form */}
          {showForm && (
            <div style={{
              background: "white",
              padding: "32px",
              borderRadius: "16px",
              marginBottom: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              borderLeft: "4px solid #10b981"
            }}>
              <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "24px" }}>
                {editingId ? "✏️ Edit Student" : "➕ Add New Student"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "24px" }}>
                  {!editingId && (
                    <>
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151", fontSize: "14px" }}>
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required={!editingId}
                          className="form-input"
                          placeholder="student@srit.ac.in"
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151", fontSize: "14px" }}>
                          Password *
                        </label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required={!editingId}
                          className="form-input"
                          placeholder="Enter password"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151", fontSize: "14px" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                      className="form-input"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151", fontSize: "14px" }}>
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      value={formData.roll_no}
                      onChange={(e) => setFormData({ ...formData, roll_no: e.target.value })}
                      required
                      className="form-input"
                      placeholder="e.g., 21CS001"
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151", fontSize: "14px" }}>
                      Department *
                    </label>
                    <select
                      value={formData.department_id}
                      onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                      required
                      className="form-input"
                    >
                      <option value="">Select Department</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.code} - {d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151", fontSize: "14px" }}>
                      Semester *
                    </label>
                    <select
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      required
                      className="form-input"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>

                  {!editingId && (
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151", fontSize: "14px" }}>
                        Year of Admission
                      </label>
                      <input
                        type="number"
                        value={formData.year_of_admission}
                        onChange={(e) => setFormData({ ...formData, year_of_admission: e.target.value })}
                        className="form-input"
                        min="2000"
                        max="2030"
                      />
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-primary" style={{ padding: "14px 36px" }}>
                  {editingId ? "Update Student" : "Create Student"}
                </button>
              </form>
            </div>
          )}

          {/* Students Table */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
          }}>
            {loading ? (
              <div style={{ padding: "60px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
                <p style={{ color: "#6b7280" }}>Loading students...</p>
              </div>
            ) : students.length === 0 ? (
              <div style={{ padding: "60px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎓</div>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "8px" }}>
                  No students found
                </h3>
                <p style={{ color: "#6b7280" }}>
                  Click &quot;Add Student&quot; to create a new student account.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e5e7eb" }}>
                      <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#374151", fontSize: "13px", textTransform: "uppercase" }}>Roll No</th>
                      <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#374151", fontSize: "13px", textTransform: "uppercase" }}>Name</th>
                      <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#374151", fontSize: "13px", textTransform: "uppercase" }}>Department</th>
                      <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#374151", fontSize: "13px", textTransform: "uppercase" }}>Semester</th>
                      <th style={{ padding: "16px 20px", textAlign: "center", fontWeight: "600", color: "#374151", fontSize: "13px", textTransform: "uppercase" }}>Year</th>
                      <th style={{ padding: "16px 20px", textAlign: "center", fontWeight: "600", color: "#374151", fontSize: "13px", textTransform: "uppercase" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "16px 20px", fontWeight: "600", color: "#1f2937" }}>
                          {student.roll_no}
                        </td>
                        <td style={{ padding: "16px 20px", color: "#4b5563" }}>
                          {student.users?.full_name || "N/A"}
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
                            {student.departments?.code || "N/A"}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "center", color: "#6b7280" }}>
                          Sem {student.semester ?? "-"}
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "center", color: "#6b7280" }}>
                          {student.year_of_admission ?? "-"}
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            <button
                              onClick={() => handleEdit(student)}
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
                              onClick={() => handleDelete(student.id)}
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
