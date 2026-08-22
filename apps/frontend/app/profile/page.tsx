"use client";

import React, { useState } from "react";
import { currentUser } from "@/data/data";
import { FormField } from "@/components/forms/FormField";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import { SavedDestinationChip } from "@/components/ui/SavedDestinationChip";

export default function ProfilePage() {
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [email, setEmail] = useState(currentUser.email);
  const [preferredLanguage, setPreferredLanguage] = useState(currentUser.preferredLanguage);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSaved, setShowSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "??";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim() || !email.includes("@") || !email.includes(".")) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // TODO: replace with real API call
      console.log("Updated user profile:", {
        firstName,
        lastName,
        email,
        preferredLanguage,
      });

      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    }
  };

  return (
    <main className="page-main" style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div className="page-header">
        <h1>Profile & Settings</h1>
        <p>Manage your personal information and preferences.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "32px", alignItems: "start" }}>
        {/* Left Column: Avatar & Summary */}
        <div className="card" style={{ padding: "32px", textAlign: "center" }}>
          <AvatarUpload initials={initials} />
          <h2 style={{ marginTop: "24px", marginBottom: "4px" }}>
            {firstName} {lastName}
          </h2>
          <p className="text-muted" style={{ marginBottom: "0" }}>{email}</p>
        </div>

        {/* Right Column: Settings Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <div className="card" style={{ padding: "32px" }}>
            <h3 style={{ marginBottom: "24px", borderBottom: "1px solid var(--color-border)", paddingBottom: "16px" }}>
              Personal Information
            </h3>
            
            <form onSubmit={handleSave}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <FormField
                  label="First Name"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: "" }));
                  }}
                  error={errors.firstName}
                />
                <FormField
                  label="Last Name"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: "" }));
                  }}
                  error={errors.lastName}
                />
              </div>

              <div style={{ marginTop: "16px" }}>
                <FormField
                  label="Email Address"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  error={errors.email}
                />
              </div>

              <div className="field" style={{ marginTop: "16px" }}>
                <label htmlFor="language">Preferred Language</label>
                <select
                  id="language"
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Japanese">Japanese</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "32px" }}>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                {showSaved && (
                  <span style={{ color: "var(--color-primary)", fontWeight: 500 }}>
                    ✓ Changes saved
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Saved Destinations Section */}
          <div className="card" style={{ padding: "32px" }}>
            <h3 style={{ marginBottom: "24px", borderBottom: "1px solid var(--color-border)", paddingBottom: "16px" }}>
              Saved Destinations
            </h3>
            
            {currentUser.savedDestinations.length === 0 ? (
              <p className="text-muted">You haven't saved any destinations yet.</p>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {currentUser.savedDestinations.map((dest, idx) => (
                  <SavedDestinationChip key={idx} name={dest} />
                ))}
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="card" style={{ padding: "32px", border: "1px solid var(--color-danger)" }}>
            <h3 style={{ color: "var(--color-danger)", marginBottom: "16px" }}>Danger Zone</h3>
            <p className="text-muted" style={{ marginBottom: "24px" }}>
              Once you delete your account, there is no going back. Please be certain.
            </p>

            {/* 
              Inline-confirm pattern replacing window.confirm().
              Easy to reuse elsewhere for non-disruptive, accessible confirmation.
            */}
            {!showDeleteConfirm ? (
              <button
                type="button"
                className="btn"
                style={{ background: "transparent", color: "var(--color-danger)", border: "1px solid var(--color-danger)" }}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete account
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "var(--color-surface-alt)", padding: "16px", borderRadius: "var(--radius-md)" }}>
                <span style={{ fontWeight: 500, color: "var(--color-danger)" }}>Are you absolutely sure?</span>
                <button
                  type="button"
                  className="btn"
                  style={{ padding: "6px 12px", fontSize: "0.9rem" }}
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn"
                  style={{ background: "var(--color-danger)", color: "white", padding: "6px 12px", fontSize: "0.9rem" }}
                  onClick={() => {
                    // TODO: Replace with real API call
                    console.log("Account deletion confirmed");
                    setShowDeleteConfirm(false);
                  }}
                >
                  Yes, delete my account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
