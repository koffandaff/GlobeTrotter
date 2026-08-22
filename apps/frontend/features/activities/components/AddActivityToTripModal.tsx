"use client";

import React, { useState, useEffect } from "react";
import type { Activity } from "../types";
import { listTrips } from "@/features/trips/api/tripsApi";
import { addActivityToStop, fetchTripStops } from "@/features/itinerary/api/itineraryApi";
import type { Trip } from "@/features/trips/types";
import type { ItineraryStop } from "@/features/itinerary/types";

interface AddActivityToTripModalProps {
  isOpen: boolean;
  activity: Activity | null;
  onClose: () => void;
  onSuccess: (activityName: string, tripName: string) => void;
}

export function AddActivityToTripModal({
  isOpen,
  activity,
  onClose,
  onSuccess,
}: AddActivityToTripModalProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [stops, setStops] = useState<ItineraryStop[]>([]);
  const [selectedStopId, setSelectedStopId] = useState<string>("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch user trips
  useEffect(() => {
    if (!isOpen) return;
    async function loadTrips() {
      setIsLoading(true);
      try {
        const res = await listTrips({ limit: 50 });
        setTrips(res.trips);
        if (res.trips.length > 0) {
          setSelectedTripId(res.trips[0].id);
        }
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    }
    loadTrips();
  }, [isOpen]);

  // 2. Fetch stops for selected trip
  useEffect(() => {
    if (!selectedTripId) return;
    async function loadStops() {
      try {
        const stopsList = await fetchTripStops(selectedTripId);
        setStops(stopsList);
        if (stopsList.length > 0) {
          setSelectedStopId(stopsList[0].id);
        } else {
          setSelectedStopId("");
        }
      } catch {
        // Fallback
      }
    }
    loadStops();
  }, [selectedTripId]);

  if (!isOpen || !activity) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStopId) {
      setError("Please add at least one destination stop to your trip before scheduling activities.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await addActivityToStop(selectedStopId, {
        title: activity.name,
        activityId: activity.id,
        date: scheduledDate || undefined,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        estimatedCost: activity.estimatedCost || undefined,
        currency: activity.currency || "USD",
      });

      const selectedTrip = trips.find((t) => t.id === selectedTripId);
      onSuccess(activity.name, selectedTrip?.name || "your trip");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add activity to itinerary.");
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
            <h2 style={{ fontSize: "1.3rem", margin: 0 }}>Add to Itinerary</h2>
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
              {activity.name} • {activity.category}
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
          <div className="field" style={{ marginBottom: "14px" }}>
            <label htmlFor="selectTrip" style={{ fontWeight: 600, display: "block", marginBottom: "4px" }}>
              Target Trip
            </label>
            {isLoading ? (
              <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)" }}>Loading trips...</p>
            ) : trips.length === 0 ? (
              <p style={{ fontSize: "0.88rem", color: "var(--color-danger)" }}>Please create a trip first.</p>
            ) : (
              <select
                id="selectTrip"
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  background: "#ffffff",
                  fontSize: "0.9rem",
                }}
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="field" style={{ marginBottom: "14px" }}>
            <label htmlFor="selectStop" style={{ fontWeight: 600, display: "block", marginBottom: "4px" }}>
              Destination Stop
            </label>
            {stops.length === 0 ? (
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                No stops in this trip yet. (Add a stop in Itinerary Builder first)
              </p>
            ) : (
              <select
                id="selectStop"
                value={selectedStopId}
                onChange={(e) => setSelectedStopId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  background: "#ffffff",
                  fontSize: "0.9rem",
                }}
              >
                {stops.map((s, idx) => (
                  <option key={s.id} value={s.id}>
                    Stop {idx + 1}: {s.city.name} ({s.arrivalDate || "Date TBD"})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div className="field">
              <label htmlFor="actStartTime" style={{ fontWeight: 600, display: "block", marginBottom: "4px" }}>
                Start Time
              </label>
              <input
                id="actStartTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  fontSize: "0.9rem",
                }}
              />
            </div>

            <div className="field">
              <label htmlFor="actEndTime" style={{ fontWeight: 600, display: "block", marginBottom: "4px" }}>
                End Time
              </label>
              <input
                id="actEndTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  fontSize: "0.9rem",
                }}
              />
            </div>
          </div>

          <div className="field" style={{ marginBottom: "24px" }}>
            <label htmlFor="actDate" style={{ fontWeight: 600, display: "block", marginBottom: "4px" }}>
              Date (Optional)
            </label>
            <input
              id="actDate"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                fontSize: "0.9rem",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ padding: "8px 16px" }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || stops.length === 0}
              className="btn btn-primary"
              style={{ padding: "8px 20px" }}
            >
              {isSubmitting ? "Scheduling..." : "Add to Itinerary"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
