"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Link from "next/link";
import { ROLE_IDS, API_BASE_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth";
import { useState, useEffect } from "react";

export default function StudentDashboard() {
  const [academicData, setAcademicData] = useState<any>(null);
  const [feeData, setFeeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      try {
        // Fetch academic info
        const acadRes = await fetch(`${API_BASE_URL}/academic/my-info`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (acadRes.ok) {
          setAcademicData(await acadRes.json());
        }

        // Fetch fee details
        const feeRes = await fetch(`${API_BASE_URL}/fees/my-fees`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (feeRes.ok) {
          setFeeData(await feeRes.json());
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const studentInfo = academicData?.student || {
    full_name: "Student Name",
    roll_no: "21CS1A0501",
    department: "CSE",
    semester: 6
  };

  const academics = academicData?.academics || {
    cgpa: 0,
    subjects: []
  };

  const fees = feeData?.summary || {
    total_fees: 0,
    total_paid: 0,
    total_due: 0,
    overall_status: 'pending'
  };

  const quickLinks = [
    { title: "View Marks", icon: "📊", description: "Check your marks", color: "#ff6b35", href: "/student/marks" },
    { title: "Attendance", icon: "📅", description: "View attendance", color: "#ff8c42", description: "View attendance records", color: "#ff8c42", href: "/student/attendance" },
    { title: "Fee Details", icon: "💰", description: "Payment status", color: "#ffa952", href: "#fees" },
    { title: "Time Table", icon: "🕐", description: "Class schedule", color: "#ff6b35", href: "#" },
    { title: "Library", icon: "📚", description: "E-Library access", color: "#ff8c42", href: "#" },
    { title: "Results", icon: "🎓", description: "Semester results", color: "#ffa952", href: "#" }
  ];

  if (loading) {
    return (
      <ProtectedRoute requiredRoleId={ROLE_IDS.STUDENT}>
        <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>
          <Header />
          <div style={{ padding: "60px", textAlign: "center", color: "#6b7280" }}>
            Loading dashboard...
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRoleId={ROLE_IDS.STUDENT}>
      <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>
        <Header />

        <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px" }}>
          {/* Welcome Banner */}
          <div style={{
            background: "linear-gradient(135deg, #ff6b35 0%, #ffa952 100%)",
            borderRadius: "20px",
            padding: "40px",
            marginBottom: "32px",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px",
            boxShadow: "0 10px 40px rgba(255, 107, 53, 0.3)"
          }}>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px" }}>
                Welcome, {studentInfo.full_name}! 🎓
              </h1>
              <p style={{ fontSize: "16px", opacity: 0.9 }}>
                Track your academic progress and stay updated with your courses.
              </p>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.2)",
              padding: "20px 32px",
              borderRadius: "14px",
              textAlign: "center"
            }}>
              <p style={{ fontSize: "14px", opacity: 0.9, marginBottom: "4px" }}>Current CGPA</p>
              <p style={{ fontSize: "36px", fontWeight: "700", margin: 0 }}>{academics.cgpa}</p>
            </div>
          </div>

          {/* Academic Info Card */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "28px",
            marginBottom: "32px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "24px"
          }}>
            {[
              { label: "Roll Number", value: studentInfo.roll_no, icon: "🆔" },
              { label: "Department", value: studentInfo.department, icon: "🏛️" },
              { label: "Semester", value: `${studentInfo.semester} Sem`, icon: "📖" },
              { label: "Total Subjects", value: academics.subjects.length, icon: "📚" }
            ].map((info, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  background: "#ff6b35",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  color: "white"
                }}>
                  {info.icon}
                </div>
                <div>
                  <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "2px" }}>{info.label}</p>
                  <p style={{ fontSize: "15px", fontWeight: "600", color: "#1f2937", margin: 0 }}>{info.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Marks and Fees Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
            marginBottom: "32px"
          }}>
            {/* Marks */}
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "28px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
            }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>📊</span> Your Marks
              </h2>
              {academics.subjects && academics.subjects.length > 0 ? (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {academics.subjects.map((subject: any, idx: number) => (
                    <div key={idx} style={{
                      padding: "16px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                      marginBottom: "12px",
                      borderLeft: "4px solid #ff6b35"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <div>
                          <p style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937", margin: 0 }}>{subject.subject_code} - {subject.subject_name}</p>
                          <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 0 0" }}>Credits: {subject.credits}</p>
                        </div>
                        <span style={{
                          background: parseFloat(subject.percentage) >= 60 ? "#10b98115" : "#ef444415",
                          color: parseFloat(subject.percentage) >= 60 ? "#10b981" : "#ef4444",
                          padding: "4px 12px",
                          borderRadius: "6px",
                          fontWeight: "600",
                          fontSize: "13px"
                        }}>
                          {subject.percentage}%
                        </span>
                      </div>
                      <div style={{ marginTop: "10px", fontSize: "12px", color: "#4b5563" }}>
                        {subject.marks.internal1 && <div>Internal 1: {subject.marks.internal1.obtained}/{subject.marks.internal1.max}</div>}
                        {subject.marks.internal2 && <div>Internal 2: {subject.marks.internal2.obtained}/{subject.marks.internal2.max}</div>}
                        {subject.marks.lab && <div>Lab: {subject.marks.lab.obtained}/{subject.marks.lab.max}</div>}
                        {subject.marks.assignment && <div>Assignment: {subject.marks.assignment.obtained}/{subject.marks.assignment.max}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>No marks published yet</p>
              )}
            </div>

            {/* Fee Details */}
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "28px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
            }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>💰</span> Fee Details
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "20px"
              }}>
                <div style={{
                  background: "#ff6b3515",
                  padding: "16px",
                  borderRadius: "12px",
                  borderLeft: "4px solid #ff6b35"
                }}>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: 0, marginBottom: "4px" }}>Total Fees</p>
                  <p style={{ fontSize: "20px", fontWeight: "700", color: "#ff6b35", margin: 0 }}>₹{fees.total_fees?.toLocaleString()}</p>
                </div>
                <div style={{
                  background: "#10b98115",
                  padding: "16px",
                  borderRadius: "12px",
                  borderLeft: "4px solid #10b981"
                }}>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: 0, marginBottom: "4px" }}>Amount Paid</p>
                  <p style={{ fontSize: "20px", fontWeight: "700", color: "#10b981", margin: 0 }}>₹{fees.total_paid?.toLocaleString()}</p>
                </div>
                <div style={{
                  background: "#ef444415",
                  padding: "16px",
                  borderRadius: "12px",
                  borderLeft: "4px solid #ef4444"
                }}>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: 0, marginBottom: "4px" }}>Amount Due</p>
                  <p style={{ fontSize: "20px", fontWeight: "700", color: "#ef4444", margin: 0 }}>₹{fees.total_due?.toLocaleString()}</p>
                </div>
                <div style={{
                  background: "#8b5cf615",
                  padding: "16px",
                  borderRadius: "12px",
                  borderLeft: "4px solid #8b5cf6"
                }}>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: 0, marginBottom: "4px" }}>Status</p>
                  <p style={{ 
                    fontSize: "14px", 
                    fontWeight: "700", 
                    color: fees.overall_status === 'all_paid' ? '#10b981' : fees.overall_status === 'partial_paid' ? '#f59e0b' : '#ef4444',
                    margin: 0,
                    textTransform: "capitalize"
                  }}>
                    {fees.overall_status?.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
              {feeData?.fees && feeData.fees.length > 0 && (
                <div style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  padding: "12px",
                  background: "#f8fafc",
                  borderRadius: "8px"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#1f2937" }}>Semester Breakdown</p>
                  {feeData.fees.map((f: any, idx: number) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>Sem {f.semester} ({f.academic_year}): ₹{f.total_fee?.toLocaleString()} - {f.payment_status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "20px" }}>
            Quick Access
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "16px"
          }}>
            {quickLinks.map((link, idx) => (
              <Link key={idx} href={link.href} style={{
                background: "white",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
                textDecoration: "none",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                border: "1px solid transparent"
              }} onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              }} onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>{link.icon}</div>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937", margin: "0 0 6px 0" }}>{link.title}</h3>
                <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>{link.description}</p>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
