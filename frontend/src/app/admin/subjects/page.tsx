'use client';

import { useState, useCallback, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Link from 'next/link';
import { ROLE_IDS, API_BASE_URL } from '@/lib/constants';
import { getToken } from '@/lib/auth';

interface Subject {
  id: number;
  subject_name: string;
  subject_code: string;
  department_id: number;
  semester_id?: number;
  credits?: number;
}

interface Department {
  id: number;
  name: string;
  code: string;
}

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    subject_name: '',
    subject_code: '',
    department_id: '',
    semester_id: '1',
    credits: '4'
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

      const [subjectsRes, deptsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/subjects`, { headers: adminHeaders }),
        fetch(`${API_BASE_URL}/admin/departments`, { headers: publicHeaders })
      ]);

      if (subjectsRes.ok) {
        const data = await subjectsRes.json();
        setSubjects(data.subjects || []);
      }

      if (deptsRes.ok) {
        const data = await deptsRes.json();
        setDepartments(data.departments || []);
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
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/admin/subjects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject_name: formData.subject_name,
          subject_code: formData.subject_code,
          department_id: parseInt(formData.department_id),
          semester_id: parseInt(formData.semester_id),
          credits: parseInt(formData.credits)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Subject created successfully!');
        resetForm();
        fetchData();
      } else {
        setError(data.error || 'Failed to create subject');
      }
    } catch (err) {
      setError('Failed to create subject');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({
      subject_name: '',
      subject_code: '',
      department_id: '',
      semester_id: '1',
      credits: '4'
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
              📚 Subject Management
            </h1>
            <p style={{ color: '#6b7280' }}>Create and manage subjects</p>
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
            {showForm ? '✕ Cancel' : '➕ Add Subject'}
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
              ➕ Add New Subject
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    value={formData.subject_name}
                    onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                    required
                    placeholder="e.g., Data Structures"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    value={formData.subject_code}
                    onChange={(e) => setFormData({ ...formData, subject_code: e.target.value.toUpperCase() })}
                    required
                    placeholder="e.g., CS201"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                    Department *
                  </label>
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
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
                    <option value="">Select Department</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.code} - {d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                    Semester *
                  </label>
                  <select
                    value={formData.semester_id}
                    onChange={(e) => setFormData({ ...formData, semester_id: e.target.value })}
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
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                    Credits
                  </label>
                  <input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'inherit'
                    }}
                  />
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
                Create Subject
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
              Loading subjects...
            </div>
          ) : subjects.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
              <p>No subjects found. Click "Add Subject" to create one.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Code</th>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Name</th>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Department</th>
                    <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Semester</th>
                    <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject) => (
                    <tr key={subject.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 20px', fontWeight: '600', color: '#1f2937' }}>{subject.subject_code}</td>
                      <td style={{ padding: '16px 20px', color: '#4b5563' }}>{subject.subject_name}</td>
                      <td style={{ padding: '16px 20px', color: '#6b7280' }}>Dept {subject.department_id}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'center', color: '#6b7280' }}>Sem {subject.semester_id || '-'}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'center', color: '#6b7280' }}>{subject.credits || 4}</td>
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
