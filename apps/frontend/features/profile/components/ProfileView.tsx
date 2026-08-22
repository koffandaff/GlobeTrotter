"use client";

import React, { useState, useEffect } from "react";
import { useProfile } from "../hooks/useProfile";

export function ProfileView() {
  const {
    profile,
    isLoading,
    error,
    updateProfile,
    removeSavedDestination,
    deleteAccount,
  } = useProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [language, setLanguage] = useState("English");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setDisplayName(profile.displayName || `${profile.firstName} ${profile.lastName}`);
      setLanguage(profile.preferredLanguage || "English");
    }
  }, [profile]);

  if (isLoading || !profile) {
    return (
      <div style={{ textAlign: "center", padding: "64px 0" }}>
        <div className="spinner" style={{ margin: "0 auto 16px" }} />
        <p>Loading your profile and settings...</p>
      </div>
    );
  }

  const initials = `${(firstName || "U").charAt(0)}${(lastName || "").charAt(0)}`.toUpperCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!lastName.trim()) errors.lastName = "Last name is required";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSaving(true);
    const res = await updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      displayName: displayName.trim() || undefined,
      language: language,
    });
    setIsSaving(false);

    if (res.success) {
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3500);
    }
  };

  return (
    <div style={{ maxWidth: "980px", margin: "0 auto" }}>
      {showSavedToast && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "24px",
            zIndex: 9999,
            background: "var(--color-accent-dark)",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "var(--radius-sm)",
            boxShadow: "var(--shadow-md)",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          ✓ Profile settings saved successfully!
        </div>
      )}

      <div className="page-header" style={{ marginBottom: "28px" }}>
        <div
          className="eyebrow"
          style={{
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight: 700,
            color: "var(--color-accent)",
            marginBottom: "4px",
          }}
        >
          Account Preferences
        </div>
        <h1 style={{ margin: "0 0 6px 0", fontSize: "2rem" }}>Profile & Settings</h1>
        <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
          Manage your personal information, travel preferences, and account privacy.
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            background: "rgba(181, 83, 60, 0.1)",
            border: "1px solid var(--color-danger)",
            borderRadius: "var(--radius-sm)",
            color: "var(--color-danger)",
            marginBottom: "24px",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "28px", alignItems: "start" }}>
        {/* Left Column: Avatar & Summary */}
        <div
          className="card"
          style={{
            padding: "32px 24px",
            textAlign: "center",
            background: "#ffffff",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              background: "var(--color-accent)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "2rem",
              margin: "0 auto 16px",
              boxShadow: "var(--shadow-md)",
            }}
          >
            {initials}
          </div>

          <h2 style={{ margin: "0 0 4px 0", fontSize: "1.3rem" }}>
            {firstName} {lastName}
          </h2>
          <p style={{ margin: "0 0 12px 0", fontSize: "0.88rem", color: "var(--color-text-muted)" }}>
            {profile.email}
          </p>
          <span
            className="badge"
            style={{
              background: "var(--color-surface-alt)",
              color: "var(--color-accent-dark)",
              border: "1px solid var(--color-border)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {profile.role} ACCOUNT
          </span>
        </div>

        {/* Right Column: Settings Forms */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Personal Info Card */}
          <div
            className="card"
            style={{
              padding: "28px",
              background: "#ffffff",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
            }}
          >
            <h3 style={{ margin: "0 0 20px 0", fontSize: "1.2rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "12px" }}>
              Personal Information
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div className="field">
                  <label htmlFor="userFirstName" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    First Name
                  </label>
                  <input
                    id="userFirstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "var(--radius-sm)",
                      border: formErrors.firstName ? "1px solid var(--color-danger)" : "1px solid var(--color-border)",
                      fontSize: "0.92rem",
                    }}
                  />
                  {formErrors.firstName && (
                    <span style={{ fontSize: "0.78rem", color: "var(--color-danger)", marginTop: "4px", display: "block" }}>
                      {formErrors.firstName}
                    </span>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="userLastName" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Last Name
                  </label>
                  <input
                    id="userLastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "var(--radius-sm)",
                      border: formErrors.lastName ? "1px solid var(--color-danger)" : "1px solid var(--color-border)",
                      fontSize: "0.92rem",
                    }}
                  />
                  {formErrors.lastName && (
                    <span style={{ fontSize: "0.78rem", color: "var(--color-danger)", marginTop: "4px", display: "block" }}>
                      {formErrors.lastName}
                    </span>
                  )}
                </div>
              </div>

              <div className="field" style={{ marginBottom: "16px" }}>
                <label htmlFor="userDisplayName" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  Display Name
                </label>
                <input
                  id="userDisplayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--color-border)",
                    fontSize: "0.92rem",
                  }}
                />
              </div>

              <div className="field" style={{ marginBottom: "24px" }}>
                <label htmlFor="userLang" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  Preferred Language
                </label>
                <select
                  id="userLang"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--color-border)",
                    background: "#ffffff",
                    fontSize: "0.92rem",
                  }}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="Japanese">Japanese (日本語)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="btn btn-primary"
                style={{ padding: "10px 24px", fontWeight: 600 }}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Saved Destinations Card */}
          <div
            className="card"
            style={{
              padding: "28px",
              background: "#ffffff",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
            }}
          >
            <h3 style={{ margin: "0 0 16px 0", fontSize: "1.2rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "12px" }}>
              Saved Destinations
            </h3>

            {!profile.savedDestinations || profile.savedDestinations.length === 0 ? (
              <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                You have not saved any destination cities yet. Explore destinations in City Search!
              </p>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {profile.savedDestinations.map((dest) => (
                  <div
                    key={dest.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                    }}
                  >
                    <span>📍 {dest.name}, {dest.country}</span>
                    <button
                      type="button"
                      onClick={() => removeSavedDestination(dest.id)}
                      title="Remove"
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--color-danger)",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        padding: 0,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div
            className="card"
            style={{
              padding: "28px",
              background: "#ffffff",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-danger)",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem", color: "var(--color-danger)" }}>
              Danger Zone
            </h3>
            <p style={{ margin: "0 0 18px 0", fontSize: "0.88rem", color: "var(--color-text-muted)" }}>
              Once you delete your account, all associated travel itineraries and saved preferences will be deactivated.
            </p>

            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="btn btn-outline"
                style={{ borderColor: "var(--color-danger)", color: "var(--color-danger)", padding: "8px 16px" }}
              >
                Delete Account
              </button>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "rgba(181, 83, 60, 0.08)",
                  padding: "14px 18px",
                  borderRadius: "var(--radius-sm)",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontWeight: 600, color: "var(--color-danger)", fontSize: "0.88rem" }}>
                  Are you absolutely certain?
                </span>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn btn-outline"
                  style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={deleteAccount}
                  className="btn btn-primary"
                  style={{ background: "var(--color-danger)", borderColor: "var(--color-danger)", padding: "6px 14px", fontSize: "0.85rem" }}
                >
                  Yes, Delete My Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
