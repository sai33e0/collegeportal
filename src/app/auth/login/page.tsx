"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, getRoleId, getRoleRoute, setAuthData } from "@/lib/auth";
import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";

interface LoginResponse {
  access_token: string;
  role_id: number;
  user?: {
    id: string;
    email: string;
    full_name: string;
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      const data: LoginResponse = await apiClient.post(
        API_ENDPOINTS.LOGIN,
        { email, password }
      );
      
      setAuthData(data.access_token, data.role_id);
      // Store user name if available
      if (data.user?.full_name) {
        localStorage.setItem("user_name", data.user.full_name);
      }
      const route = getRoleRoute(data.role_id);
      router.push(route);
    } catch (err) {
      setLoading(false);
      const errorMessage = err instanceof Error ? err.message : "Unable to connect to server. Please try again.";
      setError(errorMessage || "Invalid email or password. Please try again.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #ff6b35 0%, #ffa952 50%, #ff8c42 100%)",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Header */}
      <header style={{
        padding: "20px 40px",
        background: "rgba(255,255,255,0.95)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "16px", textDecoration: "none" }}>
          <div style={{
            width: "60px",
            height: "60px",
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
            <h1 style={{ fontSize: "18px", fontWeight: "700", color: "#ff6b35", margin: 0 }}>
              Srinivasa Ramanujan Institute of Technology
            </h1>
            <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 0 0" }}>
              College Portal
            </p>
          </div>
        </Link>
      </header>

      {/* Login Form */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px"
      }}>
        <div style={{
          background: "white",
          borderRadius: "24px",
          boxShadow: "0 25px 80px rgba(0,0,0,0.25)",
          padding: "48px",
          width: "100%",
          maxWidth: "440px"
        }}>
          {/* Logo in card */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{
              width: "80px",
              height: "80px",
            background: "linear-gradient(135deg, #ff6b35 0%, #ffa952 100%)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 8px 24px rgba(255, 107, 53, 0.3)"
          }}>
            <span style={{ fontSize: "28px" }}>🔐</span>
          </div>
            <h2 style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#ff6b35",
              marginBottom: "8px"
            }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: "15px", color: "#6b7280" }}>
              Sign in to access your portal
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                marginBottom: "10px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151"
              }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "18px"
                }}>
                  📧
                </span>
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: "48px" }}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: "32px" }}>
              <label style={{
                display: "block",
                marginBottom: "10px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151"
              }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "18px"
                }}>
                  🔒
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  style={{ paddingLeft: "48px", paddingRight: "48px" }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px"
                  }}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "17px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px"
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }} />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span>→</span>
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div style={{
                marginTop: "20px",
                padding: "14px 18px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "10px",
                color: "#dc2626",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <span>⚠️</span>
                {error}
              </div>
            )}

            {/* Demo Credentials */}
            <div style={{
              marginTop: "20px",
              padding: "14px",
              background: "#f0f9ff",
              border: "1px solid #bfdbfe",
              borderRadius: "10px",
              fontSize: "12px",
              color: "#0c4a6e"
            }}>
              <p style={{ margin: "0 0 8px 0", fontWeight: "600" }}>📋 Demo Credentials:</p>
              <div style={{ margin: "6px 0", fontFamily: "monospace" }}>
                <strong>Admin:</strong> admin@srit.com / srit1234
              </div>
              <div style={{ margin: "6px 0", fontFamily: "monospace" }}>
                <strong>Faculty:</strong> faculty1@srit.com / srit1234
              </div>
              <div style={{ margin: "6px 0", fontFamily: "monospace" }}>
                <strong>Student:</strong> 234g1a33i0@srit.ac.in / srit1234
              </div>
            </div>
          </form>

          {/* Help Text */}
          <div style={{
            marginTop: "32px",
            padding: "20px",
            background: "#f8fafc",
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px" }}>
              Need help? Contact the administrator
            </p>
            <p style={{ fontSize: "13px", color: "#3b82f6" }}>
              📧 support@srit.ac.in
            </p>
          </div>

          {/* Back to Home */}
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Link href="/" style={{
              color: "#6b7280",
              textDecoration: "none",
              fontSize: "14px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}>
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "20px",
        color: "rgba(255,255,255,0.7)",
        fontSize: "13px"
      }}>
        © 2026 Srinivasa Ramanujan Institute of Technology. All rights reserved.
      </footer>

      {/* Spinner Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
