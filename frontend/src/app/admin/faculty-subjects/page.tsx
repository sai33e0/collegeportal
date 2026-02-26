'use client';

import { useState, useCallback, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import { ROLE_IDS, API_BASE_URL } from '@/lib/constants';
import { getToken } from '@/lib/auth';

interface Faculty {
  id: number;
  user_id: string;
  department_id: number;
  employee_id: string;
  users?: { full_name: string };
}

interface Subject {
  id: number;
  subject_name: string;
  subject_code: string;
  semester_id: number;
  department_id: number;
}

interface Assignment {
  id: number;
  faculty_id: number;
  subject_id: number;
  faculty?: { users?: { full_name: string }; employee_id?: string };
  subjects?: { subject_name: string; subject_code: string };
}

export default function FacultySubjectPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    faculty_id: '',
    subject_id: ''
  });

  const token = getToken();

  const fetchData = useCallback(async () => {
    try {
      const adminHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const publicHeaders = {
        'Content-Type': 'application/json'
      };

      const [facultyRes, subjectsRes, assignRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/faculty`, { headers: adminHeaders }),
        fetch(`${API_BASE_URL}/admin/subjects`, { headers: adminHeaders }),
        fetch(`${API_BASE_URL}/admin/faculty-subjects`, { headers: adminHeaders })
      ]);

      if (facultyRes.ok) {
        const data = await facultyRes.json();
        setFaculties(data.faculty || []);
      }

      if (subjectsRes.ok) {
        const data = await subjectsRes.json();
        setSubjects(data.subjects || []);
      }

      if (assignRes.ok) {
        const data = await assignRes.json();
        setAssignments(data.faculty_subjects || []);
      }

      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch data');
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/admin/faculty-subjects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          faculty_id: parseInt(formData.faculty_id),
          subject_id: parseInt(formData.subject_id)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Faculty assigned to subject successfully!');
        resetForm();
        fetchData();
      } else {
        setError(data.error || 'Failed to assign faculty');
      }
    } catch (err) {
      setError('Failed to assign faculty');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this assignment?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/faculty-subjects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setSuccess('Assignment removed!');
        fetchData();
      } else {
        setError('Failed to remove assignment');
      }
    } catch (err) {
      setError('Failed to remove assignment');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({
      faculty_id: '',
      subject_id: ''
    });
  };

  return (
    <ProtectedRoute requiredRoleId={ROLE_IDS.ADMIN}>
      <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
        <Header />

        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                👨‍🏫 Faculty Subject Assignment
              </h1>
              <p style={{ color: '#6b7280' }}>Assign faculty to subjects</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                background: showForm ? '#6b7280' : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              {showForm ? '✕ Cancel' : '➕ Assign Faculty'}
            </button>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '24px',
              color: '#dc2626'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '24px',
              color: '#16a34a'
            }}>
              {success}
            </div>
          )}

          {showForm && (
            <div style={{
              background: 'white',
              padding: '32px',
              borderRadius: '16px',
              marginBottom: '24px',
              borderLeft: '4px solid #10b981'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
                ➕ Assign Faculty to Subject
              </h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                      Faculty *
                    </label>
                    <select
                      value={formData.faculty_id}
                      onChange={(e) => setFormData({ ...formData, faculty_id: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'inherit'
                      }}
                    >
                      <option value="">Select Faculty</option>
                      {faculties.map(f => (
                        <option key={f.id} value={f.id}>
                          {f.users?.full_name || 'N/A'} ({f.employee_id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                      Subject *
                    </label>
                    <select
                      value={formData.subject_id}
                      onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'inherit'
                      }}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.subject_code} - {s.subject_name} (Sem {s.semester_id})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '14px 36px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}>
                  Assign Faculty
                </button>
              </form>
            </div>
          )}

          <div style={{
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}>
            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
                Loading assignments...
              </div>
            ) : assignments.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>👨‍🏫</div>
                <p>No assignments found. Click "Assign Faculty" to create one.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Faculty</th>
                      <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Subject Code</th>
                      <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Subject Name</th>
                      <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((assign) => (
                      <tr key={assign.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '16px 20px', fontWeight: '600', color: '#1f2937' }}>
                          {assign.faculty?.users?.full_name || 'N/A'}
                        </td>
                        <td style={{ padding: '16px 20px', color: '#4b5563' }}>
                          {assign.subjects?.subject_code || 'N/A'}
                        </td>
                        <td style={{ padding: '16px 20px', color: '#4b5563' }}>
                          {assign.subjects?.subject_name || 'N/A'}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleDelete(assign.id)}
                            style={{
                              background: '#fef2f2',
                              color: '#dc2626',
                              border: 'none',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: '500'
                            }}
                          >
                            🗑️ Remove
                          </button>
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
