"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav style={{
      background: "white",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      {/* Top Bar */}
      <div style={{
        background: "#ff6b35",
        color: "white",
        padding: "8px 0",
        fontSize: "13px"
      }}>
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px"
        }}>
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <span>📧 info@srit.ac.in</span>
            <span>📞 +91 8555-123456</span>
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <Link href="/auth/login" style={{ color: "white", textDecoration: "none" }}>
              Student Login
            </Link>
            <span>|</span>
            <Link href="/auth/login" style={{ color: "white", textDecoration: "none" }}>
              Faculty Login
            </Link>
            <span>|</span>
            <Link href="/auth/login" style={{ color: "white", textDecoration: "none" }}>
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "70px",
            height: "70px",
            background: "linear-gradient(135deg, #ff6b35 0%, #ffa952 100%)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "20px",
            boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)"
          }}>
            SRIT
          </div>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "700",
              color: "#ff6b35",
              lineHeight: 1.2
            }}>
              Srinivasa Ramanujan Institute of Technology
            </h1>
            <p style={{
              margin: "4px 0 0 0",
              fontSize: "12px",
              color: "#4b5563"
            }}>
              Approved by AICTE, New Delhi | Affiliated to JNTUA, Ananthapuramu
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link href="/" className="nav-link">Home</Link>
          <Link href="#about" className="nav-link">About</Link>
          <Link href="#departments" className="nav-link">Departments</Link>
          <Link href="#facilities" className="nav-link">Facilities</Link>
          <Link href="#contact" className="nav-link">Contact</Link>
          <Link href="/auth/login" style={{
            background: "linear-gradient(135deg, #ff6b35 0%, #ffa952 100%)",
            color: "white",
            padding: "12px 24px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "600",
            marginLeft: "16px",
            boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)",
            transition: "all 0.3s ease"
          }}>
            Portal Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            fontSize: "28px",
            cursor: "pointer",
            color: "#1e3a8a"
          }}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{
          background: "white",
          padding: "20px",
          borderTop: "1px solid #e5e7eb"
        }}>
          <Link href="/" style={{ display: "block", padding: "12px 0", color: "#374151", textDecoration: "none" }}>Home</Link>
          <Link href="#about" style={{ display: "block", padding: "12px 0", color: "#374151", textDecoration: "none" }}>About</Link>
          <Link href="#departments" style={{ display: "block", padding: "12px 0", color: "#374151", textDecoration: "none" }}>Departments</Link>
          <Link href="#facilities" style={{ display: "block", padding: "12px 0", color: "#374151", textDecoration: "none" }}>Facilities</Link>
          <Link href="#contact" style={{ display: "block", padding: "12px 0", color: "#374151", textDecoration: "none" }}>Contact</Link>
          <Link href="/auth/login" style={{
            display: "block",
            marginTop: "12px",
            background: "#1e3a8a",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            textDecoration: "none",
            textAlign: "center",
            fontWeight: "600"
          }}>
            Portal Login
          </Link>
        </div>
      )}
    </nav>
  );
}
