"use client";

import React, { useState } from "react";
import type { AddStopInput } from "../types";
import { useCities } from "../../cities/hooks/useCities";

interface AddStopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStop: (data: AddStopInput) => Promise<{ success: boolean; error?: string }>;
}

export function AddStopModal({ isOpen, onClose, onAddStop }: AddStopModalProps) {
  const { cities, search, setSearch, isLoading: isCitiesLoading } = useCities();
  
  const [cityId, setCityId] = useState("");
  const [customCityName, setCustomCityName] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic date validation
    if (arrivalDate && departureDate) {
      if (new Date(departureDate) < new Date(arrivalDate)) {
        setError("Departure date cannot be before arrival date.");
        return;
      }
    }

    if (!cityId) {
      setError("Please select a destination city.");
      return;
    }

    setIsSubmitting(true);

    const res = await onAddStop({
      cityId: cityId,
      cityName: cities.find((c) => c.id === cityId)?.name || customCityName,
      arrivalDate: arrivalDate || undefined,
      departureDate: departureDate || undefined,
      notes: notes.trim() || undefined,
    });

    setIsSubmitting(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || "Failed to add stop.");
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
          <h2 style={{ fontSize: "1.4rem", margin: 0 }}>Add Destination Stop</h2>
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
            <label htmlFor="citySearch" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Search Destination
            </label>
            <input
              id="citySearch"
              type="text"
              placeholder="Search worldwide cities via OpenStreetMap..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCityId("");
              }}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                background: "#ffffff",
                fontSize: "0.92rem",
                marginBottom: "8px",
              }}
            />
            {isCitiesLoading ? (
              <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Searching...</span>
            ) : cities.length > 0 ? (
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  background: "#ffffff",
                  fontSize: "0.92rem",
                }}
              >
                <option value="" disabled>Select a matched city</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}, {c.country}
                  </option>
                ))}
              </select>
            ) : search.length > 1 ? (
              <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>No cities found.</span>
            ) : null}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
            <div className="field">
              <label htmlFor="arrivalDate" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                Arrival Date
              </label>
              <input
                id="arrivalDate"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
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
              <label htmlFor="departureDate" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                Departure Date
              </label>
              <input
                id="departureDate"
                type="date"
                min={arrivalDate || new Date().toISOString().split("T")[0]}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
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
            <label htmlFor="stopNotes" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Notes & Accommodations
            </label>
            <textarea
              id="stopNotes"
              rows={2}
              placeholder="e.g. Hotel reservation, arrival flight details, local transport..."
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
              {isSubmitting ? "Adding..." : "Add Stop"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
