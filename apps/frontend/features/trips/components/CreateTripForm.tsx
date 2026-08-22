"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createTrip } from "../api/tripsApi";
import type { CreateTripInput, TripStatus, TripVisibility } from "../types";

export function CreateTripForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<CreateTripInput>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    currency: "USD",
    visibility: "PRIVATE",
    status: "PLANNED",
    totalBudget: undefined,
    coverImageUrl: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalBudget" ? (value ? Number(value) : undefined) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Trip name is required.";
    } else if (formData.name.length > 200) {
      newErrors.name = "Trip name must be at most 200 characters.";
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = "End date must be on or after start date.";
      }
    }

    if (formData.totalBudget !== undefined && formData.totalBudget <= 0) {
      newErrors.totalBudget = "Budget must be a positive number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload: CreateTripInput = {
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        currency: formData.currency || "USD",
        visibility: formData.visibility || "PRIVATE",
        status: (formData.status || "PLANNED") as TripStatus,
        totalBudget: formData.totalBudget,
        coverImageUrl: formData.coverImageUrl?.trim() || undefined,
      };

      const newTrip = await createTrip(payload);
      router.push(`/itinerary-builder?tripId=${newTrip.id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to create trip. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card"
      style={{
        padding: "32px",
        background: "#ffffff",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {submitError && (
        <div
          style={{
            padding: "12px 16px",
            background: "rgba(181, 83, 60, 0.1)",
            border: "1px solid var(--color-danger)",
            borderRadius: "var(--radius-sm)",
            color: "var(--color-danger)",
            marginBottom: "20px",
            fontSize: "0.9rem",
          }}
        >
          {submitError}
        </div>
      )}

      {/* Trip Name */}
      <div className="field" style={{ marginBottom: "20px" }}>
        <label htmlFor="tripName" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
          Trip Name <span style={{ color: "var(--color-danger)" }}>*</span>
        </label>
        <input
          id="tripName"
          name="name"
          type="text"
          placeholder="e.g. Summer in Paris, Tokyo Odyssey"
          value={formData.name}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            border: errors.name ? "1.5px solid var(--color-danger)" : "1px solid var(--color-border)",
            fontSize: "0.95rem",
          }}
        />
        {errors.name && (
          <span style={{ color: "var(--color-danger)", fontSize: "0.82rem", marginTop: "4px", display: "block" }}>
            {errors.name}
          </span>
        )}
      </div>

      {/* Date Range */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div className="field">
          <label htmlFor="startDate" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
            Start Date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              fontSize: "0.92rem",
            }}
          />
        </div>

        <div className="field">
          <label htmlFor="endDate" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
            End Date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              border: errors.endDate ? "1.5px solid var(--color-danger)" : "1px solid var(--color-border)",
              fontSize: "0.92rem",
            }}
          />
          {errors.endDate && (
            <span style={{ color: "var(--color-danger)", fontSize: "0.82rem", marginTop: "4px", display: "block" }}>
              {errors.endDate}
            </span>
          )}
        </div>
      </div>

      {/* Currency, Budget, Visibility */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div className="field">
          <label htmlFor="currency" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              background: "#ffffff",
              fontSize: "0.92rem",
              cursor: "pointer",
            }}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="CAD">CAD ($)</option>
            <option value="AUD">AUD ($)</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="totalBudget" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
            Estimated Budget
          </label>
          <input
            id="totalBudget"
            name="totalBudget"
            type="number"
            placeholder="e.g. 2000"
            value={formData.totalBudget || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              border: errors.totalBudget ? "1.5px solid var(--color-danger)" : "1px solid var(--color-border)",
              fontSize: "0.92rem",
            }}
          />
          {errors.totalBudget && (
            <span style={{ color: "var(--color-danger)", fontSize: "0.82rem", marginTop: "4px", display: "block" }}>
              {errors.totalBudget}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor="visibility" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
            Privacy / Visibility
          </label>
          <select
            id="visibility"
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              background: "#ffffff",
              fontSize: "0.92rem",
              cursor: "pointer",
            }}
          >
            <option value="PRIVATE">Private (Only You)</option>
            <option value="SHARED">Shared (Link access)</option>
            <option value="PUBLIC">Public (Community Feed)</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="field" style={{ marginBottom: "20px" }}>
        <label htmlFor="description" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
          Trip Description & Goals
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="What are you hoping to experience? (e.g. Art museums, mountain hiking, culinary street food)"
          value={formData.description || ""}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
            fontSize: "0.92rem",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* Cover Image URL */}
      <div className="field" style={{ marginBottom: "28px" }}>
        <label htmlFor="coverImageUrl" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
          Cover Image URL (Optional)
        </label>
        <input
          id="coverImageUrl"
          name="coverImageUrl"
          type="url"
          placeholder="https://images.unsplash.com/photo-..."
          value={formData.coverImageUrl || ""}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
            fontSize: "0.92rem",
          }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
          style={{ padding: "12px 28px", fontSize: "0.95rem", fontWeight: 600 }}
        >
          {isSubmitting ? "Creating Trip..." : "Create Trip"}
        </button>

        <Link
          href="/my-trips"
          style={{
            color: "var(--color-text-muted)",
            fontWeight: 500,
            textDecoration: "none",
            fontSize: "0.95rem",
          }}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
