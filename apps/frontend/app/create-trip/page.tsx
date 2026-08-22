"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormField } from "@/components/forms/FormField";
import { TextareaField } from "@/components/forms/TextareaField";
import { SuggestionCard } from "@/components/ui/SuggestionCard";
import { tripSuggestions } from "@/data/data";

interface FormData {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  coverImage: string;
}

interface FormErrors {
  name?: string;
  startDate?: string;
  endDate?: string;
}

export default function CreateTripPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    coverImage: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error for the field being edited
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, coverImage: e.target.files![0].name }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Trip name is required.";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required.";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required.";
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = "End date must be on or after the start date.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Success - simulate trip creation
    console.log("Trip created:", formData);
    // TODO: replace with real API call once backend is ready
    router.push("/my-trips");
  };

  return (
    <main
      className="page-main"
      style={{
        display: "flex",
        gap: "32px",
        flexWrap: "wrap",
        alignItems: "flex-start",
      }}
    >
      <div style={{ flex: "1 1 60%", minWidth: "300px" }}>
        <div className="page-header">
          <h1>Plan a new trip</h1>
          <p>Fill in the details below to start planning your next adventure.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="trip-card"
          style={{ padding: "32px" }}
        >
          <FormField
            label="Trip Name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="e.g. Summer in Paris"
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <FormField
              label="Start Date"
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              error={errors.startDate}
            />
            <FormField
              label="End Date"
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              error={errors.endDate}
            />
          </div>

          <TextareaField
            label="Description (Optional)"
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What are you hoping to do on this trip?"
            rows={4}
          />

          <div className="field" style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>Cover Photo</label>
            <div
              className="file-upload"
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <label
                style={{
                  background: "var(--color-surface-alt)",
                  border: "1px solid var(--color-border)",
                  padding: "8px 16px",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                Choose file
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
              <span className="text-muted" style={{ fontSize: "0.9rem" }}>
                {formData.coverImage || "No file chosen"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button type="submit" className="btn btn-primary">
              Create Trip
            </button>
            <Link
              href="/my-trips"
              style={{
                textDecoration: "none",
                color: "var(--color-text-muted)",
                fontWeight: 500,
              }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      <aside style={{ flex: "1 1 30%", minWidth: "300px" }}>
        <div className="page-header">
          <h2 style={{ fontSize: "1.25rem", margin: 0, paddingBottom: "8px" }}>
            Suggested places to visit
          </h2>
        </div>
        <div>
          {tripSuggestions.map((suggestion) => (
            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))}
        </div>
      </aside>
    </main>
  );
}
