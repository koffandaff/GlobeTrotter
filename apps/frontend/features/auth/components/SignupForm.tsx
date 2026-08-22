"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/api/client";
import { isValidPhoneNumber } from "libphonenumber-js";

import { useAuth } from "@/lib/auth/AuthContext";

export function SignupForm() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const MAX_CHARS = 300;

  const handleInfoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setAdditionalInfo(text);
    }
  };

  const validateName = (name: string) => /^[a-zA-Z\s\-']+$/.test(name.trim()) && name.trim().length > 0;
  const validateLocation = (loc: string) => /^[a-zA-Z\s\-',\.]+$/.test(loc.trim()) && loc.trim().length > 0;
  const validateEmail = (emailStr: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr.trim());
  const validatePhone = (phoneStr: string) => {
    try {
      return isValidPhoneNumber(phoneStr);
    } catch {
      return false;
    }
  };
  const validatePassword = (pass: string) => pass.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setErrors({});

    const newErrors: Record<string, string> = {};

    if (!validateName(firstName)) {
      newErrors.firstName = "Please enter a valid first name (letters only).";
    }
    if (!validateName(lastName)) {
      newErrors.lastName = "Please enter a valid last name (letters only).";
    }
    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!validatePhone(phone)) {
      newErrors.phone = "Invalid phone number format for the provided country code.";
    }
    if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters long.";
    }
    if (!validateLocation(city)) {
      newErrors.city = "Please enter a valid city name.";
    }
    if (!validateLocation(country)) {
      newErrors.country = "Please enter a valid country name.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await fetchApi("/auth/register", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email, password, phone, city, country, additionalInfo }),
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
    <div style={{ maxWidth: "520px", margin: "0 auto" }}>
      <div className="page-header" style={{ textAlign: "center" }}>
        <div className="eyebrow">Join GlobeTrotter</div>
        <h1>Create your account</h1>
        <p>Start planning trips, tracking budgets, and sharing itineraries.</p>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div className="field-row">
          <div className="field">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={errors.firstName ? { borderColor: "var(--color-danger)" } : {}}
            />
            {errors.firstName && <span className="field-error">{errors.firstName}</span>}
          </div>
          <div className="field">
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={errors.lastName ? { borderColor: "var(--color-danger)" } : {}}
            />
            {errors.lastName && <span className="field-error">{errors.lastName}</span>}
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
            style={errors.email ? { borderColor: "var(--color-danger)" } : {}}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="phone">Phone number</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={errors.phone ? { borderColor: "var(--color-danger)" } : {}}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>
          <div className="field">
            <label htmlFor="signupPassword">Password</label>
            <input
              id="signupPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={errors.password ? { borderColor: "var(--color-danger)" } : {}}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={errors.city ? { borderColor: "var(--color-danger)" } : {}}
            />
            {errors.city && <span className="field-error">{errors.city}</span>}
          </div>
          <div className="field">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={errors.country ? { borderColor: "var(--color-danger)" } : {}}
            />
            {errors.country && <span className="field-error">{errors.country}</span>}
          </div>
        </div>

        <div className="field">
          <label htmlFor="additionalInfo">Additional information (optional)</label>
          <textarea
            id="additionalInfo"
            placeholder="Travel interests, preferences..."
            value={additionalInfo}
            onChange={handleInfoChange}
          ></textarea>
          <span className="char-counter">
            {additionalInfo.length} / {MAX_CHARS} characters
          </span>
        </div>

        {submitError && (
          <div className="field-error" style={{ marginBottom: "16px", textAlign: "center" }}>
            {submitError}
          </div>
        )}

        <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
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
