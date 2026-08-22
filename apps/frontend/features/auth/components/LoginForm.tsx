"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchApi } from "@/lib/api/client";

export function LoginForm() {
  const router = useRouter();
  const { login, user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setSubmitError("");
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    }

    if (!isValid) return;

    try {
      setIsSubmitting(true);
      const res = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      
      if (res.data) {
        login(res.data.accessToken, res.data.user);
        router.push("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError(String(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "420px", margin: "0 auto" }}>
      <div className="page-header" style={{ textAlign: "center" }}>
        <div className="eyebrow">Welcome back</div>
        <h1>Log in</h1>
        <p>Access your trips, budgets, and saved plans.</p>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="loginEmail">Email address</label>
          <input
            id="loginEmail"
            type="text"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={emailError ? { borderColor: "var(--color-danger)" } : {}}
          />
          {emailError && <span className="field-error">{emailError}</span>}
        </div>

        <div className="field">
          <label htmlFor="loginPassword">Password</label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              id="loginPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              style={{
                width: "100%",
                paddingRight: "60px",
                borderColor: passwordError ? "var(--color-danger)" : undefined,
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "8px",
                background: "none",
                border: "none",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--color-accent-dark)",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {passwordError && <span className="field-error">{passwordError}</span>}
        </div>

        <div className="flex justify-between items-center" style={{ marginBottom: "16px" }}>
          <label
            className="flex items-center gap-2"
            style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}
          >
            <input type="checkbox" style={{ minHeight: "auto" }} /> Remember me
          </label>
          <Link
            href="/forgot-password"
            className="field-hint"
            style={{ color: "var(--color-accent-dark)", fontWeight: 600 }}
          >
            Forgot password?
          </Link>
        </div>

        {submitError && (
          <div className="field-error" style={{ marginBottom: "16px", textAlign: "center" }}>
            {submitError}
          </div>
        )}

        <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "16px" }}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" style={{ color: "var(--color-accent-dark)", fontWeight: 600 }}>
          Sign up
        </Link>
      </p>
    </div>
  );
}
