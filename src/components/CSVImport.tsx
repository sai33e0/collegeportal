"use client";

import { useState } from "react";
import { getToken } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/constants";

interface ImportResult {
  created: number;
  failed: number;
  skipped: number;
  errors: Array<{ email: string; error: string }>;
}

export default function CSVImportComponent() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError("Please select a CSV file");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  const parseCSV = (content: string): Array<Record<string, string>> => {
    const lines = content.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have header and at least one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const requiredHeaders = ['email', 'password', 'full_name', 'roll_no', 'dept_id', 'semester', 'year_of_admission'];
    
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    const data: Array<Record<string, string>> = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const values = lines[i].split(',').map(v => v.trim());
      const row: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      data.push(row);
    }

    return data;
  };

  const handleImport = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setResult(null);

    try {
      const fileContent = await file.text();
      const csvData = parseCSV(fileContent);

      if (csvData.length === 0) {
        setError("CSV file is empty");
        setLoading(false);
        return;
      }

      const token = getToken();
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/csv-import/import-students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ csvData })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Import failed');
      }

      const importResult = await response.json();
      setResult(importResult.results);
      setSuccess(`✅ Import successful! Created: ${importResult.results.created}, Skipped: ${importResult.results.skipped}, Failed: ${importResult.results.failed}`);
      setFile(null);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Import failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/csv-import/import-students/template`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to download template');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'students_template.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Download failed';
      setError(errorMessage);
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
        📥 Bulk Import Students via CSV
      </h2>

      {/* Instructions */}
      <div style={{
        background: '#f0f9ff',
        border: '1px solid #0284c7',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <p style={{ margin: '0 0 12px 0', color: '#0c4a6e', fontWeight: '500' }}>
          📋 Required CSV Columns:
        </p>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#0c4a6e', fontSize: '14px' }}>
          <li><strong>email</strong> - Student email (e.g., student01@srit.ac.in)</li>
          <li><strong>password</strong> - Login password</li>
          <li><strong>full_name</strong> - Student full name</li>
          <li><strong>roll_no</strong> - Roll number (e.g., 234G1A3301)</li>
          <li><strong>dept_id</strong> - Department ID (1=CSE, 3=AI/ML)</li>
          <li><strong>semester</strong> - Current semester (1-8)</li>
          <li><strong>year_of_admission</strong> - Year of admission (e.g., 2023)</li>
        </ul>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          color: '#991b1b',
          fontSize: '14px'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div style={{
          background: '#dcfce7',
          border: '1px solid #86efac',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          color: '#166534',
          fontSize: '14px'
        }}>
          {success}
        </div>
      )}

      {/* Import Results */}
      {result && (
        <div style={{
          background: '#f3f4f6',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
            📊 Import Summary
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div style={{
              background: '#dcfce7',
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#16a34a' }}>
                {result.created}
              </div>
              <div style={{ fontSize: '12px', color: '#166534' }}>Created</div>
            </div>
            <div style={{
              background: '#fef08a',
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#ca8a04' }}>
                {result.skipped}
              </div>
              <div style={{ fontSize: '12px', color: '#78350f' }}>Skipped</div>
            </div>
            <div style={{
              background: '#fee2e2',
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626' }}>
                {result.failed}
              </div>
              <div style={{ fontSize: '12px', color: '#991b1b' }}>Failed</div>
            </div>
          </div>

          {/* Error Details */}
          {result.errors.length > 0 && (
            <div style={{
              background: '#fff7ed',
              border: '1px solid #fed7aa',
              borderRadius: '8px',
              padding: '12px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#92400e' }}>
                ⚠️ Errors ({result.errors.length}):
              </p>
              {result.errors.map((err, idx) => (
                <div key={idx} style={{
                  fontSize: '12px',
                  color: '#b45309',
                  marginBottom: '6px',
                  paddingLeft: '12px',
                  borderLeft: '3px solid #f97316'
                }}>
                  <strong>{err.email}:</strong> {err.error}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* File Upload Section */}
      <div style={{
        border: '2px dashed #d1d5db',
        borderRadius: '8px',
        padding: '24px',
        textAlign: 'center',
        background: '#f9fafb',
        marginBottom: '16px'
      }}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={loading}
          style={{
            display: 'none'
          }}
          id="csv-file-input"
        />
        <label htmlFor="csv-file-input" style={{
          cursor: 'pointer',
          display: 'block'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
          <p style={{ margin: '0 0 8px 0', color: '#1f2937', fontWeight: '500' }}>
            {file ? `Selected: ${file.name}` : 'Click to select CSV file or drag & drop'}
          </p>
          <p style={{ margin: '0', fontSize: '13px', color: '#6b7280' }}>
            CSV format required. Max file size: 10MB
          </p>
        </label>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={downloadTemplate}
          disabled={loading}
          style={{
            background: '#e5e7eb',
            color: '#1f2937',
            padding: '10px 16px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '600',
            fontSize: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          📥 Download Template
        </button>
        <button
          onClick={handleImport}
          disabled={!file || loading}
          style={{
            background: file && !loading ? '#ff6b35' : '#d1d5db',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '600',
            fontSize: '14px',
            cursor: (file && !loading) ? 'pointer' : 'not-allowed',
            opacity: (file && !loading) ? 1 : 0.6
          }}
        >
          {loading ? '⏳ Importing...' : '🚀 Import Students'}
        </button>
      </div>
    </div>
  );
}
