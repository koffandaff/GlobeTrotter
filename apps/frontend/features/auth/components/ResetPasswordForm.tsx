"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/api/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!email || !code || !newPassword) {
      setSubmitError("Please fill out all fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      await fetchApi("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, code, newPassword }),
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2500);
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

  if (success) {
    return (
      <div style={{ maxWidth: "420px", margin: "0 auto", textAlign: "center" }}>
        <h2>Password Reset!</h2>
        <p>Your password has been changed. Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "420px", margin: "0 auto" }}>
      <div className="page-header" style={{ textAlign: "center" }}>
        <div className="eyebrow">Recovery</div>
        <h1>Reset Password</h1>
        <p>Enter the code sent to your email and your new password.</p>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="resetEmail">Email address</label>
          <input
            id="resetEmail"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="resetCode">Recovery Code</label>
          <input
            id="resetCode"
            type="text"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {submitError && (
          <div className="field-error" style={{ marginBottom: "16px", textAlign: "center" }}>
            {submitError}
          </div>
        )}

        <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "16px" }}>
        Remember your password?{" "}
        <Link href="/login" style={{ color: "var(--color-accent-dark)", fontWeight: 600 }}>
          Log in
        </Link>
      </p>
    </div>
  );
}
