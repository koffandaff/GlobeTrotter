"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useItinerary } from "../hooks/useItinerary";
import { AddStopModal } from "./AddStopModal";
import { AddActivityModal } from "./AddActivityModal";

interface ItineraryBuilderProps {
  initialTripId?: string;
}

export function ItineraryBuilder({ initialTripId }: ItineraryBuilderProps) {
  const {
    tripId,
    setTripId,
    availableTrips,
    itinerary,
    isLoading,
    error,
    addStop,
    updateStop,
    reorderStop,
    deleteStop,
    addActivity,
    deleteActivity,
  } = useItinerary(initialTripId);

  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [activeStopForActivity, setActiveStopForActivity] = useState<{ id: string; name: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMoveUp = async (stopId: string, currentSeq: number) => {
    if (currentSeq <= 1) return;
    const res = await reorderStop(stopId, currentSeq - 1);
    if (res.success) showToast("Stop order updated.");
  };

  const handleMoveDown = async (stopId: string, currentSeq: number, maxSeq: number) => {
    if (currentSeq >= maxSeq) return;
    const res = await reorderStop(stopId, currentSeq + 1);
    if (res.success) showToast("Stop order updated.");
  };

  const handleDeleteStop = async (stopId: string, cityName: string) => {
    if (confirm(`Remove ${cityName} from itinerary?`)) {
      const res = await deleteStop(stopId);
      if (res.success) showToast("Stop removed.");
    }
  };

  const handleDeleteActivity = async (actId: string) => {
    const res = await deleteActivity(actId);
    if (res.success) showToast("Activity removed.");
  };

  return (
    <div style={{ maxWidth: "880px", margin: "0 auto" }}>
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "24px",
            zIndex: 9999,
            background: "var(--color-accent-dark)",
            color: "#ffffff",
            padding: "10px 18px",
            borderRadius: "var(--radius-sm)",
            boxShadow: "var(--shadow-md)",
            fontSize: "0.88rem",
            fontWeight: 600,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Trip Switcher Header */}
      <div
        className="card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "28px",
          padding: "16px 20px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Editing Trip:</span>
          <select
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}
            style={{
              padding: "8px 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              background: "#ffffff",
              fontWeight: 600,
              fontSize: "0.92rem",
              color: "var(--color-text)",
              cursor: "pointer",
            }}
          >
            {availableTrips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <Link
          href={`/itinerary-view?tripId=${tripId}`}
          className="btn btn-primary"
          style={{ padding: "8px 18px", fontSize: "0.88rem", textDecoration: "none" }}
        >
          View Full Itinerary →
        </Link>
      </div>

      {error && (
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
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <div className="spinner" style={{ margin: "0 auto 16px" }} />
          <p>Loading itinerary stops and activities...</p>
        </div>
      ) : !itinerary || itinerary.stops.length === 0 ? (
        <div
          className="card"
          style={{
            padding: "48px 24px",
            textAlign: "center",
            background: "#ffffff",
            border: "1px dashed var(--color-border)",
          }}
        >
          <h3 style={{ fontSize: "1.25rem", marginBottom: "8px" }}>No Destination Stops Yet</h3>
          <p style={{ color: "var(--color-text-muted)", marginBottom: "20px" }}>
            Add your first destination city to start scheduling daily activities.
          </p>
          <button
            type="button"
            onClick={() => setIsAddStopOpen(true)}
            className="btn btn-primary"
          >
            + Add First Destination Stop
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {itinerary.stops.map((stop, index) => {
            const allItems = stop.days ? stop.days.flatMap((d) => d.items) : [];

            return (
              <div
                key={stop.id}
                className="card"
                style={{
                  background: "#ffffff",
                  padding: "24px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {/* Stop Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    borderBottom: "1px solid var(--color-border)",
                    paddingBottom: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "var(--color-accent)",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                      }}
                    >
                      {index + 1}
                    </div>

                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.2rem", color: "var(--color-text)" }}>
                        {stop.city.name}, {stop.city.country}
                      </h3>
                      <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
                        🗓️ {stop.arrivalDate || "Arrival TBD"} → {stop.departureDate || "Departure TBD"}
                      </span>
                    </div>
                  </div>

                  {/* Reorder and Delete controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(stop.id, index + 1)}
                      title="Move Stop Up"
                      style={{
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        cursor: index === 0 ? "not-allowed" : "pointer",
                        opacity: index === 0 ? 0.4 : 1,
                      }}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={index === itinerary.stops.length - 1}
                      onClick={() => handleMoveDown(stop.id, index + 1, itinerary.stops.length)}
                      title="Move Stop Down"
                      style={{
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        cursor: index === itinerary.stops.length - 1 ? "not-allowed" : "pointer",
                        opacity: index === itinerary.stops.length - 1 ? 0.4 : 1,
                      }}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStop(stop.id, stop.city.name)}
                      title="Delete Stop"
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--color-danger)",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        marginLeft: "8px",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {stop.notes && (
                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--color-text-muted)",
                      background: "var(--color-surface)",
                      padding: "8px 12px",
                      borderRadius: "var(--radius-sm)",
                      marginBottom: "16px",
                    }}
                  >
                    📝 {stop.notes}
                  </p>
                )}

                {/* Activities for this stop */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <h4 style={{ margin: 0, fontSize: "0.95rem", color: "var(--color-text)" }}>
                      Scheduled Activities ({allItems.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveStopForActivity({ id: stop.id, name: stop.city.name })}
                      className="btn btn-outline"
                      style={{ fontSize: "0.8rem", padding: "4px 10px" }}
                    >
                      + Add Activity
                    </button>
                  </div>

                  {allItems.length === 0 ? (
                    <div
                      style={{
                        padding: "16px",
                        textAlign: "center",
                        background: "var(--color-surface)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.86rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      No activities added for {stop.city.name} yet.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {allItems.map((act) => (
                        <div
                          key={act.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px 14px",
                            borderRadius: "var(--radius-sm)",
                            background: "var(--color-surface-alt)",
                            border: "1px solid var(--color-border)",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--color-text)" }}>
                              {act.title}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
                              {act.startTime ? `🕒 ${act.startTime}` : "🕒 Flexible"}
                              {act.endTime && ` to ${act.endTime}`}
                              {act.estimatedCost !== undefined && act.estimatedCost !== null && ` · 💰 $${act.estimatedCost}`}
                              {act.notes && ` · ${act.notes}`}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteActivity(act.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--color-danger)",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add Stop Trigger */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
            <button
              type="button"
              onClick={() => setIsAddStopOpen(true)}
              className="btn btn-outline"
              style={{ padding: "10px 20px" }}
            >
              + Add Another Destination Stop
            </button>

            <Link
              href={`/itinerary-view?tripId=${tripId}`}
              className="btn btn-primary"
              style={{ padding: "10px 24px", textDecoration: "none" }}
            >
              Review Full Itinerary
            </Link>
          </div>
        </div>
      )}

      {/* Add Stop Modal */}
      <AddStopModal
        isOpen={isAddStopOpen}
        onClose={() => setIsAddStopOpen(false)}
        onAddStop={addStop}
      />

      {/* Add Activity Modal */}
      <AddActivityModal
        isOpen={!!activeStopForActivity}
        stopId={activeStopForActivity?.id || null}
        stopCityName={activeStopForActivity?.name}
        onClose={() => setActiveStopForActivity(null)}
        onAddActivity={addActivity}
      />
    </div>
  );
}
