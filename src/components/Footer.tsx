"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#0a0a0a", color: "white" }}>
      {/* Main Footer */}
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "60px 24px 40px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "40px"
      }}>
        {/* About Section */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{
              width: "50px",
              height: "50px",
              background: "linear-gradient(135deg, #ff6b35 0%, #ffa952 100%)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px"
            }}>
              SRIT
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>SRIT</h3>
              <p style={{ margin: 0, fontSize: "12px", opacity: 0.7 }}>College Portal</p>
            </div>
          </div>
          <p style={{ fontSize: "14px", lineHeight: 1.8, opacity: 0.8, marginBottom: "20px" }}>
            Srinivasa Ramanujan Institute of Technology is committed to providing quality education 
            and fostering innovation in engineering and technology.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            {["📘", "🐦", "📷", "💼"].map((icon, idx) => (
              <div key={idx} style={{
                width: "40px",
                height: "40px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "18px",
                transition: "all 0.3s ease"
              }}>
                {icon}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ 
            fontSize: "18px", 
            fontWeight: "600", 
            marginBottom: "24px",
            paddingBottom: "12px",
            borderBottom: "2px solid #ff6b35",
            display: "inline-block"
          }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              { name: "About Us", href: "#about" },
              { name: "Departments", href: "#departments" },
              { name: "Admissions", href: "#" },
              { name: "Placements", href: "#" },
              { name: "Research", href: "#" },
              { name: "Student Portal", href: "/auth/login" }
            ].map((link, idx) => (
              <li key={idx} style={{ marginBottom: "12px" }}>
                <Link href={link.href} style={{
                  color: "rgba(255,255,255,0.8)",
                  textDecoration: "none",
                  fontSize: "14px",
                  transition: "all 0.3s ease"
                }}>
                  → {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Departments */}
        <div>
          <h4 style={{ 
            fontSize: "18px", 
            fontWeight: "600", 
            marginBottom: "24px",
            paddingBottom: "12px",
            borderBottom: "2px solid #3b82f6",
            display: "inline-block"
          }}>
            Departments
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Computer Science & Engineering",
              "Electronics & Communication",
              "Mechanical Engineering",
              "Civil Engineering",
              "Electrical Engineering",
              "Information Technology"
            ].map((dept, idx) => (
              <li key={idx} style={{ marginBottom: "12px" }}>
                <span style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "14px"
                }}>
                  → {dept}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ 
            fontSize: "18px", 
            fontWeight: "600", 
            marginBottom: "24px",
            paddingBottom: "12px",
            borderBottom: "2px solid #3b82f6",
            display: "inline-block"
          }}>
            Contact Us
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>📍</span>
              <div>
                <p style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>
                  SRIT Campus, Anantapur District,<br />
                  Andhra Pradesh - 515001, India
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>📞</span>
              <p style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>+91 8555-123456</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>📧</span>
              <p style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>info@srit.ac.in</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>🌐</span>
              <a 
                href="https://www.srit.ac.in" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ margin: 0, fontSize: "14px", opacity: 0.8, color: "#3b82f6", textDecoration: "none" }}
              >
                www.srit.ac.in
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.1)",
        padding: "20px 24px",
        textAlign: "center"
      }}>
        <p style={{ margin: 0, fontSize: "14px", opacity: 0.6 }}>
          © 2026 Srinivasa Ramanujan Institute of Technology. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
