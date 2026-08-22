"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/api/client";

export function ForgotPasswordForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!email.includes("@")) {
      setSubmitError("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      await fetchApi("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      // Redirect to reset password with email in query so user doesn't have to re-type
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
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
        <div className="eyebrow">Recovery</div>
        <h1>Forgot Password</h1>
        <p>Enter your email to receive a password reset code.</p>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="recoveryEmail">Email address</label>
          <input
            id="recoveryEmail"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {submitError && (
          <div className="field-error" style={{ marginBottom: "16px", textAlign: "center" }}>
            {submitError}
          </div>
        )}

        <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending code..." : "Send reset code"}
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
