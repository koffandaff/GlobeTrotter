"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/api/client";

export function SignupForm() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!firstName || !lastName || !email || !password) {
      setSubmitError("Please fill out all fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      await fetchApi("/auth/register", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
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
        <h2>Account Created!</h2>
        <p>Redirecting you to login...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "420px", margin: "0 auto" }}>
      <div className="page-header" style={{ textAlign: "center" }}>
        <div className="eyebrow">Join Us</div>
        <h1>Sign up</h1>
        <p>Create your account to start planning your next adventure.</p>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "16px" }}>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              type="text"
              placeholder="Jane"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="signupEmail">Email address</label>
          <input
            id="signupEmail"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="signupPassword">Password</label>
          <input
            id="signupPassword"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {submitError && (
          <div className="field-error" style={{ marginBottom: "16px", textAlign: "center" }}>
            {submitError}
          </div>
        )}

        <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "16px" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--color-accent-dark)", fontWeight: 600 }}>
          Log in
        </Link>
      </p>
    </div>
  );
}
