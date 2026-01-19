"use client";

import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Link from "next/link";
import { ROLE_IDS, API_BASE_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth";

interface Faculty {
  id: number;
  employee_id: string;
  designation: string;
  user_id: string;
  users?: { full_name: string };
  departments?: { name: string; code: string };
}

interface Department {
  id: number;
  name: string;
  code: string;
}

export default function AdminFacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
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
    employee_id: "",
    dept_id: "",
    designation: "Assistant Professor"
  });

  const fetchData = useCallback(async () => {
    try {
      const token = getToken();
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const [facultyRes, deptsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/faculty`, { headers }),
        fetch(`${API_BASE_URL}/admin/departments`, { headers })
      ]);

      if (facultyRes.ok) {
        const data = await facultyRes.json();
        setFaculty(data.faculty || []);
      }

      if (deptsRes.ok) {
        const data = await deptsRes.json();
        setDepartments(data.departments || []);
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
        ? `${API_BASE_URL}/admin/faculty/${editingId}`
        : `${API_BASE_URL}/admin/faculty`;

      const method = editingId ? "PUT" : "POST";

      const body = editingId
        ? {
            employee_id: formData.employee_id,
            dept_id: parseInt(formData.dept_id),
            designation: formData.designation,
            full_name: formData.full_name
          }
        : {
            email: formData.email,
            password: formData.password,
            full_name: formData.full_name,
            employee_id: formData.employee_id,
            dept_id: parseInt(formData.dept_id),
            designation: formData.designation
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
        setSuccess(editingId ? "Faculty updated successfully!" : "Faculty created successfully!");
        resetForm();
        fetchData();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save faculty");
      }
    } catch {
      setError("Failed to save faculty");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this faculty member?")) return;

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/admin/faculty/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        setSuccess("Faculty deleted successfully!");
        fetchData();
      } else {
        setError("Failed to delete faculty");
      }
    } catch {
      setError("Failed to delete faculty");
    }
  };

  const handleEdit = (fac: Faculty) => {
    setEditingId(fac.id);
    setFormData({
      email: "",
      password: "",
      full_name: fac.users?.full_name || "",
      employee_id: fac.employee_id,
      dept_id: fac.departments ? departments.find(d => d.code === fac.departments?.code)?.id.toString() || "" : "",
      designation: fac.designation || "Assistant Professor"
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
      employee_id: "",
      dept_id: "",
      designation: "Assistant Professor"
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
            <span style={{ color: "#1f2937", fontSize: "14px", fontWeight: "500" }}>Faculty Management</span>
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
                👨‍🏫 Faculty Management
              </h1>
              <p style={{ fontSize: "15px", color: "#6b7280" }}>
                Add, edit, and manage faculty accounts
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
              {showForm ? "✕ Cancel" : "➕ Add Faculty"}
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
              borderLeft: "4px solid #8b5cf6"
            }}>
              <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "24px" }}>
                {editingId ? "✏️ Edit Faculty" : "➕ Add New Faculty"}
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
                          placeholder="faculty@srit.ac.in"
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
                      Employee ID *
                    </label>
                    <input
                      type="text"
                      value={formData.employee_id}
                      onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                      required
                      className="form-input"
                      placeholder="e.g., FAC001"
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151", fontSize: "14px" }}>
                      Department *
                    </label>
                    <select
                      value={formData.dept_id}
                      onChange={(e) => setFormData({ ...formData, dept_id: e.target.value })}
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
                      Designation
                    </label>
                    <select
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="form-input"
                    >
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Professor">Professor</option>
                      <option value="HOD">Head of Department</option>
                      <option value="Lecturer">Lecturer</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ padding: "14px 36px" }}>
                  {editingId ? "Update Faculty" : "Create Faculty"}
                </button>
              </form>
            </div>
          )}

          {/* Faculty Table */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
          }}>
            {loading ? (
              <div style={{ padding: "60px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
                <p style={{ color: "#6b7280" }}>Loading faculty...</p>
              </div>
            ) : faculty.length === 0 ? (
              <div style={{ padding: "60px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>👨‍🏫</div>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "8px" }}>
                  No faculty found
                </h3>
                <p style={{ color: "#6b7280" }}>
                  Click &quot;Add Faculty&quot; to create a new faculty account.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e5e7eb" }}>
                      <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#374151", fontSize: "13px", textTransform: "uppercase" }}>Employee ID</th>
                      <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#374151", fontSize: "13px", textTransform: "uppercase" }}>Name</th>
                      <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#374151", fontSize: "13px", textTransform: "uppercase" }}>Department</th>
                      <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: "600", color: "#374151", fontSize: "13px", textTransform: "uppercase" }}>Designation</th>
                      <th style={{ padding: "16px 20px", textAlign: "center", fontWeight: "600", color: "#374151", fontSize: "13px", textTransform: "uppercase" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faculty.map((fac) => (
                      <tr key={fac.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "16px 20px", fontWeight: "600", color: "#1f2937" }}>
                          {fac.employee_id}
                        </td>
                        <td style={{ padding: "16px 20px", color: "#4b5563" }}>
                          {fac.users?.full_name || "N/A"}
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{
                            background: "#f3e8ff",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "#7c3aed"
                          }}>
                            {fac.departments?.code || "N/A"}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px", color: "#4b5563" }}>
                          {fac.designation || "N/A"}
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            <button
                              onClick={() => handleEdit(fac)}
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
                              onClick={() => handleDelete(fac.id)}
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
