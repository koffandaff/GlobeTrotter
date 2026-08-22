"use client";

import React, { useState, useEffect } from "react";
import type { City } from "../types";
import { listTrips } from "@/features/trips/api/tripsApi";
import { addTripStop } from "@/features/itinerary/api/itineraryApi";
import type { Trip } from "@/features/trips/types";

interface AddToTripModalProps {
  isOpen: boolean;
  city: City | null;
  onClose: () => void;
  onSuccess: (cityName: string, tripName: string) => void;
}

export function AddToTripModal({ isOpen, city, onClose, onSuccess }: AddToTripModalProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    async function loadTrips() {
      setIsLoadingTrips(true);
      try {
        const res = await listTrips({ limit: 50 });
        setTrips(res.trips);
        if (res.trips.length > 0) {
          setSelectedTripId(res.trips[0].id);
        }
      } catch {
        // Fallback
      } finally {
        setIsLoadingTrips(false);
      }
    }
    loadTrips();
  }, [isOpen]);

  if (!isOpen || !city) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripId) {
      setError("Please select or create a trip first.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await addTripStop(selectedTripId, {
        cityId: city.id,
        cityName: city.name,
        arrivalDate: arrivalDate || undefined,
        departureDate: departureDate || undefined,
        notes: notes.trim() || undefined,
      });

      const selectedTrip = trips.find((t) => t.id === selectedTripId);
      onSuccess(city.name, selectedTrip?.name || "your trip");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add city to trip.");
    } finally {
      setIsSubmitting(false);
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

      <div
        className="card"
        style={{
          position: "relative",
          zIndex: 10000,
          background: "#ffffff",
          maxWidth: "480px",
          width: "100%",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-md)",
          padding: "28px",
          border: "1px solid var(--color-border)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "1.3rem", margin: 0 }}>Add {city.name} to Trip</h2>
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
              📍 {city.country} • {city.region || "Destination"}
            </span>
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
            <label htmlFor="tripSelect" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Select Target Trip
            </label>
            {isLoadingTrips ? (
              <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)" }}>Loading your trips...</p>
            ) : trips.length === 0 ? (
              <p style={{ fontSize: "0.88rem", color: "var(--color-danger)" }}>
                You have no existing trips. Please create a trip first!
              </p>
            ) : (
              <select
                id="tripSelect"
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  background: "#ffffff",
                  fontSize: "0.92rem",
                }}
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.startDate || "Date TBD"})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div className="field">
              <label htmlFor="modalArrivalDate" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                Arrival Date
              </label>
              <input
                id="modalArrivalDate"
                type="date"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  fontSize: "0.9rem",
                }}
              />
            </div>

            <div className="field">
              <label htmlFor="modalDepartureDate" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
                Departure Date
              </label>
              <input
                id="modalDepartureDate"
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  fontSize: "0.9rem",
                }}
              />
            </div>
          </div>

          <div className="field" style={{ marginBottom: "24px" }}>
            <label htmlFor="modalNotes" style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Stop Notes (Optional)
            </label>
            <textarea
              id="modalNotes"
              rows={2}
              placeholder="e.g. Hotel near city center, landmarks to see..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                fontSize: "0.9rem",
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
              disabled={isSubmitting || trips.length === 0}
              className="btn btn-primary"
              style={{ padding: "8px 20px" }}
            >
              {isSubmitting ? "Adding..." : "Add to Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
