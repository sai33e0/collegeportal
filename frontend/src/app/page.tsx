"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated, getRoleId, getRoleRoute } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Notifications from "@/components/Notifications";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const campusVideo = "/WhatsApp Video 2026-01-22 at 10.13.41 PM.mp4";

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

  const stats = [
    { number: "5000+", label: "Students" },
    { number: "200+", label: "Faculty" },
    { number: "50+", label: "Programs" },
    { number: "95%", label: "Placement Rate" }
  ];

  const rankings = [
    { region: "India", title: "Top 100 Engineering", badge: "NAAC Accredited", accent: "#ffd166" },
    { region: "Asia", title: "Emerging Institutions 150", badge: "Research & Innovation", accent: "#7ae582" },
    { region: "Global", title: "Recognized for Innovation", badge: "Industry Partnerships", accent: "#6ba4ff" }
  ];

  const focusAreas = [
    { title: "AI & Data", description: "Applied AI labs, analytics sandboxes, and interdisciplinary projects.", icon: "🤖" },
    { title: "Sustainability", description: "Energy, water, and smart city pilots across the campus.", icon: "🌿" },
    { title: "Innovation & Incubation", description: "Incubation center, startup mentoring, and patent support.", icon: "🚀" },
    { title: "Global Connect", description: "Collaborations, exchange programs, and international immersion.", icon: "🌏" }
  ];

  const exploreCampus = [
    { title: "Learning Resource Center", description: "Digital libraries, maker spaces, and silent study zones.", tag: "Open late" },
    { title: "Innovation Hub", description: "Prototyping labs, AR/VR suites, and hackathon pods.", tag: "Build" },
    { title: "Sports & Wellness", description: "Indoor arenas, outdoor tracks, and wellness studios.", tag: "Compete" },
    { title: "Student Life", description: "Cultural fests, clubs, leadership circles, and community impact.", tag: "Lead" }
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
    { title: "Examinations", icon: "📝", description: "Schedules and results", href: "/auth/login" },
    { title: "Library", icon: "📚", description: "Digital resources", href: "#" },
    { title: "Placements", icon: "💼", description: "Career support", href: "#" },
    { title: "Events", icon: "📅", description: "Campus calendar", href: "#" }
  ];

  const announcements = [
    "Admissions Open for 2026-27 Academic Year - Apply Now!",
    "SRIT ranked among Top 100 Engineering Colleges in India",
    "Campus Placement Drive by Top MNCs - Register Today",
    "National Level Technical Symposium - TECHFEST 2026"
  ];

  return (
    <div className="page-root">
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

      {/* Hero Section with video background */}
      <section className="hero">
        <div className="hero-video-wrapper">
          <video className="hero-video" src={campusVideo} autoPlay loop muted playsInline poster="/fallback-poster.jpg" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="pill">Future-ready Campus</div>
          <h1 className="hero-title">Engineering education that blends research, industry, and impact.</h1>
          <p className="hero-subtitle">
            SRIT brings together rigorous academics, modern infrastructure, and immersive campus life so students can build, experiment, and lead.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={handleLoginClick}>
              {isLoggedIn ? "Go to Dashboard" : "Access Portal"}
            </button>
            <Link href="#focus" className="btn-ghost">Experience the campus</Link>
          </div>
          <div className="hero-meta">
            <div className="meta-badge">AICTE Approved</div>
            <div className="meta-badge">JNTUA Affiliated</div>
            <div className="meta-badge">NAAC Accredited</div>
          </div>
        </div>
        <div className="hero-sidecard">
          <div className="glass-card">
            <p className="card-kicker">At a glance</p>
            <div className="card-grid">
              {stats.map((stat, idx) => (
                <div key={idx} className="card-stat">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="card-foot">
              <span>Access academics, marks, attendance, and placements in one portal.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rankings */}
      <section className="section-shell rank-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Rankings & Recognition</p>
            <h2 className="section-title">Credible, consistent performance</h2>
            <p className="section-subtitle">Independent surveys place SRIT among the leading engineering institutions with strong research and industry outcomes.</p>
          </div>
          <div className="badge-inline">Industry-driven curriculum • Outcome-based learning</div>
        </div>
        <div className="rank-grid">
          {rankings.map((rank, idx) => (
            <div key={rank.region} className="rank-card" style={{ borderColor: rank.accent, animationDelay: `${idx * 0.1}s` }}>
              <div className="rank-pill" style={{ color: rank.accent }}>{rank.region}</div>
              <h3>{rank.title}</h3>
              <p>{rank.badge}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Focus Areas */}
      <section id="focus" className="section-shell focus-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Academic + Industry</p>
            <h2 className="section-title">Where we invest focus</h2>
            <p className="section-subtitle">Labs, faculty, and curriculum aligned to the technologies and impact areas shaping tomorrow.</p>
          </div>
          <Link href="#departments" className="btn-ghost">Browse departments</Link>
        </div>
        <div className="focus-grid">
          {focusAreas.map((item, idx) => (
            <div key={item.title} className="focus-card" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="focus-icon">{item.icon}</div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="section-shell">
        <div className="section-head">
          <div>
            <p className="eyebrow">Portals</p>
            <h2 className="section-title">Quick Access</h2>
            <p className="section-subtitle">Jump into the services you need right now.</p>
          </div>
        </div>
        <div className="quick-links-grid">
          {quickLinks.map((link, idx) => (
            <Link href={link.href} key={idx} className="quick-link-item" style={{ animationDelay: `${idx * 0.08}s` }}>
              <div className="quick-link-icon">{link.icon}</div>
              <span className="quick-link-text">{link.title}</span>
              <span className="quick-link-desc">{link.description}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-shell about-section">
        <div className="split-grid">
          <div>
            <p className="eyebrow">About SRIT</p>
            <h2 className="section-title">Built for learners who want to build things</h2>
            <p className="section-subtitle">
              Srinivasa Ramanujan Institute of Technology nurtures future technologists through rigorous academics, applied research, and an environment that rewards curiosity.
            </p>
            <div className="badge-row">
              <div className="meta-badge">Outcome-based curriculum</div>
              <div className="meta-badge">Industry mentors</div>
              <div className="meta-badge">Research-driven projects</div>
            </div>
          </div>
          <div className="glass-card about-card">
            <div>
              <h3>Mission</h3>
              <p>Develop competent professionals with strong ethics and real-world readiness.</p>
            </div>
            <div>
              <h3>Vision</h3>
              <p>Be a recognized institution of excellence in engineering education, research, and innovation.</p>
            </div>
            <div className="about-foot">
              <span>Live projects</span>
              <span>Modern labs</span>
              <span>Industry pathways</span>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="section-shell">
        <div className="section-head">
          <div>
            <p className="eyebrow">Academics</p>
            <h2 className="section-title">Departments</h2>
            <p className="section-subtitle">Programs across engineering disciplines with labs, projects, and practice schools.</p>
          </div>
        </div>
        <div className="dept-grid">
          {departments.map((dept, idx) => (
            <div key={idx} className="card dept-card" style={{ borderColor: `${dept.color}40`, animationDelay: `${idx * 0.08}s` }}>
              <div className="dept-icon" style={{ background: `${dept.color}20`, color: dept.color }}>
                {dept.icon}
              </div>
              <div>
                <h3>{dept.name}</h3>
                <p>B.Tech • M.Tech Programs</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Campus */}
      <section className="section-shell explore-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Explore</p>
            <h2 className="section-title">Life across campus</h2>
            <p className="section-subtitle">Facilities, resources, and communities that shape your journey.</p>
          </div>
          <div className="badge-inline">24/7 Wi-Fi Campus • Modern labs • Active student clubs</div>
        </div>
        <div className="explore-grid">
          {exploreCampus.map((item, idx) => (
            <div key={item.title} className="explore-card" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="explore-tag">{item.tag}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Notifications & Events Section */}
      <Notifications />

      {/* Social Media Feed Section */}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-shell">
          <div>
            <p className="eyebrow">Portal-first experience</p>
            <h2 className="section-title">Ready to start your journey?</h2>
            <p className="section-subtitle">Access academics, marks, attendance, placements, and resources through one secure portal.</p>
          </div>
          <div className="cta-actions">
            <button className="btn-primary" onClick={handleLoginClick}>{isLoggedIn ? "Go to Dashboard" : "Login to Portal"}</button>
            <Link href="#about" className="btn-ghost">Know more</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
