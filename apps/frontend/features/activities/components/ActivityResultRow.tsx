"use client";

import React from "react";
import type { Activity } from "../types";

interface ActivityResultRowProps {
  activity: Activity;
  onAddToTrip: (activity: Activity) => void;
}

export function ActivityResultRow({ activity, onAddToTrip }: ActivityResultRowProps) {
  const durationFormatted = activity.durationMinutes
    ? activity.durationMinutes >= 60
      ? `${Math.floor(activity.durationMinutes / 60)} hr${activity.durationMinutes % 60 ? ` ${activity.durationMinutes % 60}m` : ""}`
      : `${activity.durationMinutes}m`
    : null;

  return (
    <div
      className="card"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        marginBottom: "12px",
        background: "#ffffff",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-sm)",
        gap: "20px",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: "1 1 300px" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "var(--radius-sm)",
            backgroundImage: activity.imageUrl
              ? `url(${activity.imageUrl})`
              : "linear-gradient(135deg, var(--color-accent-soft), var(--color-gold-soft))",
            backgroundSize: "cover",
            backgroundPosition: "center",
            flexShrink: 0,
          }}
        />

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span
              className="badge"
              style={{
                background: "var(--color-surface-alt)",
                color: "var(--color-accent-dark)",
                border: "1px solid var(--color-border)",
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {activity.category}
            </span>
            {activity.city && (
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                📍 {activity.city.name}
              </span>
            )}
          </div>

          <h3 style={{ margin: "0 0 4px 0", fontSize: "1.05rem", color: "var(--color-text)" }}>
            {activity.name}
          </h3>

          {activity.description && (
            <p
              style={{
                margin: 0,
                fontSize: "0.82rem",
                color: "var(--color-text-muted)",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                maxWidth: "480px",
              }}
            >
              {activity.description}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: 0 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-text)" }}>
            {activity.estimatedCost !== null && activity.estimatedCost !== undefined
              ? activity.estimatedCost === 0
                ? "Free"
                : `$${activity.estimatedCost}`
              : "Free"}
          </div>
          {durationFormatted && (
            <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
              ⏱️ {durationFormatted}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onAddToTrip(activity)}
          className="btn btn-primary"
          style={{ padding: "8px 16px", fontSize: "0.88rem", fontWeight: 600 }}
        >
          + Add to Itinerary
        </button>
      </div>
    </div>
  );
}
