"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated, getRoleId, getRoleRoute } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      const roleId = getRoleId();
      if (roleId) {
        setIsLoggedIn(true);
      }
    }
  }, []);

  const handleLoginClick = () => {
    if (isLoggedIn) {
      const roleId = getRoleId();
      if (roleId) {
        const route = getRoleRoute(roleId);
        router.push(route);
      }
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      {/* Header */}
      <header style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "15px 40px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={{
              width: "60px",
              height: "60px",
              background: "white",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#667eea",
              fontWeight: "bold",
              fontSize: "24px"
            }}>
              SRIT
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "bold" }}>
                Srinivasa Ramanujan Institute of Technology
              </h1>
              <p style={{ margin: "5px 0 0 0", fontSize: "12px", opacity: 0.9 }}>
                Approved by AICTE, New Delhi | Affiliated to JNTUA, Ananthapuramu
              </p>
            </div>
          </div>
          <button
            onClick={handleLoginClick}
            style={{
              background: "white",
              color: "#667eea",
              border: "none",
              padding: "12px 30px",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}
          >
            {isLoggedIn ? "Go to Dashboard" : "Portal Login"}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        background: "linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)",
        padding: "80px 20px",
        textAlign: "center",
        color: "white"
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "20px", textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
            Welcome to SRIT College Portal
          </h1>
          <p style={{ fontSize: "20px", marginBottom: "30px", lineHeight: "1.6" }}>
            A modern digital platform for students, faculty, and administrators to access academic information, manage courses, and view results seamlessly.
          </p>
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/auth/login" style={{
              background: "white",
              color: "#667eea",
              padding: "15px 40px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "18px",
              fontWeight: "600",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
            }}>
              Student Login
            </Link>
            <Link href="/auth/login" style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "2px solid white",
              padding: "15px 40px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "18px",
              fontWeight: "600"
            }}>
              Faculty/Admin Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "60px 20px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "36px", fontWeight: "bold", color: "#333", marginBottom: "50px" }}>
          Portal Features
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
          {/* Feature 1 */}
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: "36px"
            }}>
              👨‍🎓
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: "bold", color: "#333", marginBottom: "15px" }}>
              For Students
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              View marks, check attendance, download results, access course materials, and track academic progress.
            </p>
          </div>

          {/* Feature 2 */}
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: "36px"
            }}>
              👨‍🏫
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: "bold", color: "#333", marginBottom: "15px" }}>
              For Faculty
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              View assigned subjects, access student rosters, review marks, and manage class information.
            </p>
          </div>

          {/* Feature 3 */}
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: "36px"
            }}>
              👔
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: "bold", color: "#333", marginBottom: "15px" }}>
              For Admin
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              Manage users, subjects, departments, marks entry, publish results, and oversee entire portal.
            </p>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section style={{ background: "#f9f9f9", padding: "60px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "36px", fontWeight: "bold", color: "#333", marginBottom: "50px" }}>
            Our Departments
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            {["Computer Science & Engineering", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering"].map((dept, idx) => (
              <div key={idx} style={{
                background: "white",
                padding: "25px",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                borderLeft: "4px solid #667eea"
              }}>
                <h4 style={{ fontSize: "18px", fontWeight: "600", color: "#333" }}>{dept}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: "#333",
        color: "white",
        padding: "40px 20px",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h3 style={{ fontSize: "24px", marginBottom: "15px" }}>
            Srinivasa Ramanujan Institute of Technology
          </h3>
          <p style={{ fontSize: "14px", opacity: 0.8, marginBottom: "20px" }}>
            Official Website: <a href="https://www.srit.ac.in/" target="_blank" rel="noopener noreferrer" style={{ color: "#667eea" }}>
              www.srit.ac.in
            </a>
          </p>
          <p style={{ fontSize: "12px", opacity: 0.6 }}>
            © 2026 SRIT College Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
