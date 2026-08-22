"use client";

import React, { useState } from "react";
import type { AddActivityInput } from "../types";

interface AddActivityModalProps {
  isOpen: boolean;
  stopId: string | null;
  stopCityName?: string;
  onClose: () => void;
  onAddActivity: (stopId: string, data: AddActivityInput) => Promise<{ success: boolean; error?: string }>;
  existingItems?: any[]; // Array of ItineraryItem
}

export function AddActivityModal({
  isOpen,
  stopId,
  stopCityName,
  existingItems = [],
  onClose,
  onAddActivity,
}: AddActivityModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [cost, setCost] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !stopId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Activity title is required.");
      return;
    }

    if (cost !== undefined && cost < 0) {
      setError("Cost must be a positive number.");
      return;
    }

    const start = startTime ? startTime.slice(0, 5) : undefined;
    const end = endTime ? endTime.slice(0, 5) : undefined;

    if (start && end && start > end) {
      setError("Start time cannot be after end time.");
      return;
    }

    // Time overlap checking
    if (date && start && end) {
      const hasOverlap = existingItems.some(item => {
        if (!item.date || !item.startTime || !item.endTime) return false;
        // Strip time portion of date for safe comparison
        const itemDateStr = item.date.split("T")[0];
        const newDateStr = date;
        
        if (itemDateStr === newDateStr) {
          const itemStart = item.startTime.slice(0, 5);
          const itemEnd = item.endTime.slice(0, 5);
          return (start < itemEnd && end > itemStart); // Overlap condition
        }
        return false;
      });

      if (hasOverlap) {
        setError("This time slot overlaps with an existing activity.");
        return;
      }
    }

    setError(null);
    setIsSubmitting(true);

    const res = await onAddActivity(stopId, {
      title: title.trim(),
      date: date || undefined,
      startTime: start,
      endTime: end,
      estimatedCost: cost,
      notes: notes.trim() || undefined,
    });

    setIsSubmitting(false);
    if (res.success) {
      setTitle("");
      setStartTime("");
      setEndTime("");
      setCost(undefined);
      setNotes("");
      onClose();
    } else {
      setError(res.error || "Failed to add activity.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(36, 53, 46, 0.6)",
          backdropFilter: "blur(3px)",
        }}
      />

      {/* Modal Card */}
      <div
        className="card"
        style={{
          position: "relative",
          zIndex: 10000,
          background: "#ffffff",
          maxWidth: "500px",
          width: "100%",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-md)",
          padding: "28px",
          border: "1px solid var(--color-border)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "1.3rem", margin: 0 }}>Add Activity</h2>
            {stopCityName && <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>📍 {stopCityName}</span>}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              color: "var(--color-text-muted)",
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(181, 83, 60, 0.1)",
              border: "1px solid var(--color-danger)",
              borderRadius: "var(--radius-sm)",
              color: "var(--color-danger)",
              marginBottom: "16px",
              fontSize: "0.88rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field" style={{ marginBottom: "16px" }}>
            <label htmlFor="activityTitle" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Activity Title <span style={{ color: "var(--color-danger)" }}>*</span>
            </label>
            <input
              id="activityTitle"
              type="text"
              placeholder="e.g. Louvre Guided Tour, Sunset Dinner Cruise"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                fontSize: "0.92rem",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
            <div className="field">
              <label htmlFor="startTime" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                Start Time
              </label>
              <input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
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
              <label htmlFor="endTime" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                End Time
              </label>
              <input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  fontSize: "0.92rem",
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
            <div className="field">
              <label htmlFor="activityDate" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                Date (Optional)
              </label>
              <input
                id="activityDate"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
              <label htmlFor="estimatedCost" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                Estimated Cost ($)
              </label>
              <input
                id="estimatedCost"
                type="number"
                placeholder="e.g. 45"
                value={cost !== undefined ? cost : ""}
                onChange={(e) => setCost(e.target.value ? Number(e.target.value) : undefined)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  fontSize: "0.92rem",
                }}
              />
            </div>
          </div>

          <div className="field" style={{ marginBottom: "24px" }}>
            <label htmlFor="activityNotes" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Notes & Booking Info
            </label>
            <textarea
              id="activityNotes"
              rows={2}
              placeholder="e.g. Booking confirmation code, meeting location..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ padding: "8px 16px" }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ padding: "8px 20px" }}
            >
              {isSubmitting ? "Adding..." : "Add Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
