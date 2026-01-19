"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRoleId, getRoleRoute, setAuthData } from "@/lib/auth";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/constants";

interface LoginResponse {
  access_token: string;
  role_id: number;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      const roleId = getRoleId();
      if (roleId) {
        const route = getRoleRoute(roleId);
        router.push(route);
      }
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data: LoginResponse = await response.json();
        setAuthData(data.access_token, data.role_id);
        const route = getRoleRoute(data.role_id);
        router.push(route);
      } else {
        setLoading(false);
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      setError("Unable to connect to server. Please try again.");
    }
  };

  return (
    <div className="gradient-bg">
      <div style={{ padding: "20px 40px", background: "white", borderBottom: "3px solid #667eea", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ width: "60px", height: "60px", background: "#667eea", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "24px" }}>
            SRIT
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", margin: 0 }}>
            Srinivasa Ramanujan Institute of Technology
          </h1>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 140px)", padding: "40px 20px" }}>
        <div className="portal-card">
          <h2 style={{ fontSize: "28px", fontWeight: "bold", textAlign: "center", marginBottom: "10px", color: "#333" }}>
            College Portal Login
          </h2>
          <p style={{ fontSize: "14px", color: "#666", textAlign: "center", marginBottom: "30px" }}>
            Enter your credentials to access the portal
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#333" }}>
                Email Address
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#333" }}>
                Password
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>

            {error && <div className="error-text">{error}</div>}
          </form>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "20px", color: "white", fontSize: "14px" }}>
        © 2026 Srinivasa Ramanujan Institute of Technology. All rights reserved.
      </div>
    </div>
  );
}
