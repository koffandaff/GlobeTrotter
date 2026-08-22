"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setEmailError("");
    setPasswordError("");

    let isValid = true;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    // Validate password
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    }

    if (isValid) {
      router.push("/");
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
            href="#"
            className="field-hint"
            style={{ color: "var(--color-accent-dark)", fontWeight: 600 }}
          >
            Forgot password?
          </Link>
        </div>

        <button className="btn btn-primary btn-block" type="submit">
          Log in
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
