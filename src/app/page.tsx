"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated, getRoleId, getRoleRoute } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "Welcome to SRIT",
      subtitle: "Empowering Future Engineers",
      description: "A premier institution committed to excellence in education, research, and innovation.",
      image: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)"
    },
    {
      title: "World-Class Education",
      subtitle: "Learn from the Best",
      description: "Expert faculty, modern infrastructure, and industry-aligned curriculum.",
      image: "linear-gradient(135deg, #065f46 0%, #10b981 100%)"
    },
    {
      title: "Shape Your Future",
      subtitle: "Excellence in Engineering",
      description: "Join thousands of successful alumni making a difference worldwide.",
      image: "linear-gradient(135deg, #7c2d12 0%, #f59e0b 100%)"
    }
  ];

  useEffect(() => {
    if (isAuthenticated()) {
      const roleId = getRoleId();
      if (roleId) {
        setIsLoggedIn(true);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

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

  const stats = [
    { number: "5000+", label: "Students" },
    { number: "200+", label: "Faculty" },
    { number: "50+", label: "Courses" },
    { number: "95%", label: "Placement Rate" }
  ];

  const departments = [
    { name: "Computer Science & Engineering", icon: "💻", color: "#3b82f6" },
    { name: "Electronics & Communication", icon: "📡", color: "#10b981" },
    { name: "Mechanical Engineering", icon: "⚙️", color: "#f59e0b" },
    { name: "Civil Engineering", icon: "🏗️", color: "#8b5cf6" },
    { name: "Electrical Engineering", icon: "⚡", color: "#ef4444" },
    { name: "Information Technology", icon: "🌐", color: "#06b6d4" }
  ];

  const quickLinks = [
    { title: "Student Portal", icon: "🎓", description: "Access your academic information", href: "/auth/login" },
    { title: "Faculty Portal", icon: "👨‍🏫", description: "Manage classes and grades", href: "/auth/login" },
    { title: "Examinations", icon: "📝", description: "View exam schedules and results", href: "/auth/login" },
    { title: "Library", icon: "📚", description: "Digital library resources", href: "#" },
    { title: "Placements", icon: "💼", description: "Career opportunities", href: "#" },
    { title: "Events", icon: "📅", description: "Campus events and activities", href: "#" }
  ];

  const announcements = [
    "Admissions Open for 2026-27 Academic Year - Apply Now!",
    "SRIT ranked among Top 100 Engineering Colleges in India",
    "Campus Placement Drive by Top MNCs - Register Today",
    "National Level Technical Symposium - TECHFEST 2026"
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />

      {/* News Ticker */}
      <div className="news-ticker">
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", padding: "0 24px" }}>
          <span style={{
            background: "#dc2626",
            padding: "4px 16px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "600",
            marginRight: "20px",
            whiteSpace: "nowrap"
          }}>
            📢 NEWS
          </span>
          <div className="news-ticker-content">
            {announcements.map((item, idx) => (
              <span key={idx} style={{ marginRight: "60px" }}>• {item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section with Slider */}
      <section style={{
        background: heroSlides[currentSlide].image,
        padding: "100px 24px",
        position: "relative",
        transition: "background 0.5s ease-in-out",
        minHeight: "500px",
        display: "flex",
        alignItems: "center"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.3)"
        }} />
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          color: "white",
          width: "100%"
        }}>
          <p style={{
            fontSize: "18px",
            fontWeight: "500",
            marginBottom: "12px",
            opacity: 0.9,
            textTransform: "uppercase",
            letterSpacing: "2px"
          }}>
            {heroSlides[currentSlide].subtitle}
          </p>
          <h1 style={{
            fontSize: "56px",
            fontWeight: "800",
            marginBottom: "24px",
            lineHeight: 1.1,
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
          }}>
            {heroSlides[currentSlide].title}
          </h1>
          <p style={{
            fontSize: "20px",
            marginBottom: "40px",
            maxWidth: "600px",
            lineHeight: 1.6,
            opacity: 0.95
          }}>
            {heroSlides[currentSlide].description}
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <button
              onClick={handleLoginClick}
              style={{
                background: "white",
                color: "#1e3a8a",
                border: "none",
                padding: "16px 36px",
                borderRadius: "12px",
                fontSize: "17px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease"
              }}
            >
              {isLoggedIn ? "Go to Dashboard →" : "Access Portal →"}
            </button>
            <Link href="#about" style={{
              background: "transparent",
              color: "white",
              border: "2px solid white",
              padding: "16px 36px",
              borderRadius: "12px",
              fontSize: "17px",
              fontWeight: "600",
              textDecoration: "none",
              transition: "all 0.3s ease"
            }}>
              Explore More
            </Link>
          </div>

          {/* Slider Dots */}
          <div style={{ display: "flex", gap: "12px", marginTop: "48px" }}>
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: idx === currentSlide ? "32px" : "12px",
                  height: "12px",
                  borderRadius: "6px",
                  border: "none",
                  background: idx === currentSlide ? "white" : "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section style={{
        background: "white",
        marginTop: "-60px",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "1200px",
        borderRadius: "20px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        position: "relative",
        zIndex: 2
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          padding: "40px"
        }}>
          {stats.map((stat, idx) => (
            <div key={idx} className="stats-item" style={{
              borderRight: idx < stats.length - 1 ? "1px solid #e5e7eb" : "none"
            }}>
              <div className="stats-number">{stat.number}</div>
              <div className="stats-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links Section */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 className="section-title">Quick Access</h2>
          <p className="section-subtitle">Everything you need at your fingertips</p>
          
          <div className="quick-links-grid">
            {quickLinks.map((link, idx) => (
              <Link href={link.href} key={idx} className="quick-link-item">
                <div className="quick-link-icon">{link.icon}</div>
                <span className="quick-link-text">{link.title}</span>
                <span style={{ fontSize: "13px", color: "#6b7280", textAlign: "center", marginTop: "8px" }}>
                  {link.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ background: "#1e3a8a", padding: "80px 24px", color: "white" }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px",
          alignItems: "center"
        }}>
          <div>
            <h2 style={{ fontSize: "40px", fontWeight: "700", marginBottom: "24px" }}>
              About SRIT
            </h2>
            <p style={{ fontSize: "18px", lineHeight: 1.8, opacity: 0.9, marginBottom: "24px" }}>
              Srinivasa Ramanujan Institute of Technology is a premier engineering institution 
              dedicated to nurturing future leaders in technology and innovation. Established 
              with a vision to provide world-class education, we have consistently maintained 
              high academic standards.
            </p>
            <p style={{ fontSize: "18px", lineHeight: 1.8, opacity: 0.9, marginBottom: "32px" }}>
              Our state-of-the-art infrastructure, experienced faculty, and industry partnerships 
              ensure that our students are well-prepared for successful careers.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <div style={{
                background: "rgba(255,255,255,0.1)",
                padding: "16px 24px",
                borderRadius: "10px"
              }}>
                <div style={{ fontSize: "24px", fontWeight: "700" }}>AICTE</div>
                <div style={{ fontSize: "13px", opacity: 0.8 }}>Approved</div>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.1)",
                padding: "16px 24px",
                borderRadius: "10px"
              }}>
                <div style={{ fontSize: "24px", fontWeight: "700" }}>JNTUA</div>
                <div style={{ fontSize: "13px", opacity: 0.8 }}>Affiliated</div>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.1)",
                padding: "16px 24px",
                borderRadius: "10px"
              }}>
                <div style={{ fontSize: "24px", fontWeight: "700" }}>NAAC</div>
                <div style={{ fontSize: "13px", opacity: 0.8 }}>Accredited</div>
              </div>
            </div>
          </div>
          <div style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            borderRadius: "20px",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}>
            <h3 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px" }}>Our Mission</h3>
            <p style={{ fontSize: "16px", lineHeight: 1.8, opacity: 0.9 }}>
              To develop competent professionals with strong ethical values, equipped with 
              the knowledge and skills to meet the challenges of a rapidly evolving technological world.
            </p>
            <h3 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px", marginTop: "16px" }}>Our Vision</h3>
            <p style={{ fontSize: "16px", lineHeight: 1.8, opacity: 0.9 }}>
              To be a globally recognized institution of excellence in engineering education, 
              research, and innovation, producing leaders who contribute to society.
            </p>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" style={{ padding: "80px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 className="section-title">Our Departments</h2>
          <p className="section-subtitle">Excellence across all engineering disciplines</p>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "24px"
          }}>
            {departments.map((dept, idx) => (
              <div key={idx} className="card" style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                borderLeft: `4px solid ${dept.color}`
              }}>
                <div style={{
                  width: "70px",
                  height: "70px",
                  background: `${dept.color}15`,
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  flexShrink: 0
                }}>
                  {dept.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "6px" }}>
                    {dept.name}
                  </h3>
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                    B.Tech • M.Tech Programs
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="facilities" style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 className="section-title">Why Choose SRIT?</h2>
          <p className="section-subtitle">We provide everything you need for a successful career</p>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "32px"
          }}>
            {[
              { icon: "🏛️", title: "Modern Infrastructure", description: "State-of-the-art labs, smart classrooms, and well-equipped facilities." },
              { icon: "👨‍🏫", title: "Expert Faculty", description: "Learn from industry experts and experienced academicians." },
              { icon: "💼", title: "Industry Partnerships", description: "Strong ties with leading companies for internships and placements." },
              { icon: "🔬", title: "Research Excellence", description: "Cutting-edge research opportunities and innovation labs." },
              { icon: "🎯", title: "Career Support", description: "Dedicated placement cell with 95%+ placement rate." },
              { icon: "🌐", title: "Global Exposure", description: "International collaborations and student exchange programs." }
            ].map((feature, idx) => (
              <div key={idx} style={{ textAlign: "center", padding: "32px 24px" }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  fontSize: "36px",
                  boxShadow: "0 8px 24px rgba(30, 58, 138, 0.3)"
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "12px" }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: "15px", color: "#6b7280", lineHeight: 1.7 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
        padding: "80px 24px",
        textAlign: "center",
        color: "white"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "40px", fontWeight: "700", marginBottom: "20px" }}>
            Ready to Start Your Journey?
          </h2>
          <p style={{ fontSize: "18px", marginBottom: "40px", opacity: 0.9 }}>
            Access the college portal to view your academic information, marks, and more.
          </p>
          <button
            onClick={handleLoginClick}
            style={{
              background: "white",
              color: "#1e3a8a",
              border: "none",
              padding: "18px 48px",
              borderRadius: "12px",
              fontSize: "18px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
            }}
          >
            {isLoggedIn ? "Go to Dashboard" : "Login to Portal"}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
