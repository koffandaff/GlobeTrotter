"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Trip } from "../types";

interface TripCardProps {
  trip: Trip;
  onDuplicate?: (id: string) => Promise<unknown>;
  onDelete?: (id: string) => Promise<unknown>;
}

export function TripCard({ trip, onDuplicate, onDelete }: TripCardProps) {
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!onDuplicate || isDuplicating) return;
    setIsDuplicating(true);
    await onDuplicate(trip.id);
    setIsDuplicating(false);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!onDelete || isDeleting) return;
    setIsDeleting(true);
    await onDelete(trip.id);
    setIsDeleting(false);
    setShowConfirmDelete(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return { label: "Completed", className: "badge badge-gold" };
      case "ONGOING":
        return { label: "Ongoing", className: "badge" };
      case "PLANNED":
        return { label: "Planned", className: "badge" };
      default:
        return { label: "Draft", className: "badge" };
    }
  };

  const badgeInfo = getStatusBadge(trip.status);

  // Compute duration in days if dates are present
  let durationText = "";
  if (trip.startDate && trip.endDate) {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    durationText = `${diffDays} ${diffDays === 1 ? "day" : "days"}`;
  }

  return (
    <div
      className="trip-card"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <div>
        {/* Cover thumbnail */}
        <div
          className="thumb"
          style={{
            backgroundImage: trip.coverImageUrl ? `url(${trip.coverImageUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          {trip.visibility && trip.visibility !== "PRIVATE" && (
            <span
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "10px",
                background: "rgba(36, 53, 46, 0.8)",
                color: "#ffffff",
                textTransform: "uppercase",
              }}
            >
              {trip.visibility}
            </span>
          )}
        </div>

        {/* Title and Destination */}
        <h3 style={{ fontSize: "1.15rem", marginBottom: "4px", color: "var(--color-text)" }}>
          {trip.name}
        </h3>
        <p className="text-muted" style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
          📍 {trip.destination || "Multiple destinations"}
        </p>

        {/* Dates & Duration */}
        {trip.startDate && trip.endDate && (
          <div
            style={{
              fontSize: "0.82rem",
              color: "var(--color-text-muted)",
              marginBottom: "12px",
            }}
          >
            🗓️ {trip.startDate} → {trip.endDate} {durationText && `(${durationText})`}
          </div>
        )}

        {trip.description && (
          <p
            style={{
              fontSize: "0.86rem",
              lineHeight: 1.45,
              color: "var(--color-text-muted)",
              marginBottom: "16px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {trip.description}
          </p>
        )}
      </div>

      <div>
        {/* Status and Budget row */}
        <div className="flex justify-between items-center" style={{ marginBottom: "14px" }}>
          <span className={badgeInfo.className}>{badgeInfo.label}</span>
          <span style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--color-text)" }}>
            {trip.currency || "$"}{trip.totalEstimatedCost ? trip.totalEstimatedCost.toLocaleString() : 0}
          </span>
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            borderTop: "1px solid var(--color-border)",
            paddingTop: "12px",
            alignItems: "center",
          }}
        >
          <Link
            href={`/itinerary-view?tripId=${trip.id}`}
            className="btn btn-primary"
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: "0.82rem",
              padding: "6px 12px",
              textDecoration: "none",
            }}
          >
            View Itinerary
          </Link>

          {onDuplicate && (
            <button
              type="button"
              onClick={handleDuplicate}
              disabled={isDuplicating}
              className="btn btn-outline"
              title="Duplicate this trip"
              style={{
                fontSize: "0.82rem",
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              {isDuplicating ? "..." : "📋 Clone"}
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              className="btn btn-outline"
              title="Delete this trip"
              style={{
                fontSize: "0.82rem",
                padding: "6px 10px",
                color: "var(--color-danger)",
                borderColor: "rgba(181, 83, 60, 0.3)",
                cursor: "pointer",
              }}
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showConfirmDelete && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255, 255, 255, 0.96)",
            borderRadius: "var(--radius-md)",
            zIndex: 10,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <p style={{ fontWeight: 600, color: "var(--color-text)", marginBottom: "8px" }}>
            Delete &quot;{trip.name}&quot;?
          </p>
          <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginBottom: "16px" }}>
            This action cannot be undone.
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowConfirmDelete(false)}
              style={{ fontSize: "0.82rem", padding: "6px 12px" }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn"
              onClick={handleDelete}
              disabled={isDeleting}
              style={{
                background: "var(--color-danger)",
                color: "#ffffff",
                fontSize: "0.82rem",
                padding: "6px 12px",
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
              }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
