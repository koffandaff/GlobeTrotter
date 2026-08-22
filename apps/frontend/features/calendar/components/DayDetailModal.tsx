"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import type { CalendarDayInfo } from "../types";

interface DayDetailModalProps {
  dayInfo: CalendarDayInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DayDetailModal({ dayInfo, isOpen, onClose }: DayDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !dayInfo) return null;

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedFullDate = dayInfo.date.toLocaleDateString("en-US", dateOptions);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="day-detail-title"
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

      {/* Modal Container */}
      <div
        className="card"
        style={{
          position: "relative",
          zIndex: 10000,
          background: "#ffffff",
          maxWidth: "640px",
          width: "100%",
          maxHeight: "88vh",
          overflowY: "auto",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-md)",
          padding: "28px",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "1px solid var(--color-border)",
            paddingBottom: "16px",
            marginBottom: "20px",
          }}
        >
          <div>
            <div
              className="eyebrow"
              style={{
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 700,
                color: "var(--color-accent)",
              }}
            >
              Date Description & Daily Schedule
            </div>
            <h2 id="day-detail-title" style={{ margin: "4px 0 0 0", fontSize: "1.5rem" }}>
              {formattedFullDate}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "1.2rem",
              color: "var(--color-text-muted)",
            }}
          >
            ✕
          </button>
        </div>

        {/* Trips Active on this Date */}
        {dayInfo.trips.length > 0 ? (
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "12px", color: "var(--color-text)" }}>
              Active Trip{dayInfo.trips.length > 1 ? "s" : ""} ({dayInfo.trips.length})
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {dayInfo.trips.map((trip) => {
                const isStart = trip.startDate === dayInfo.dateString;
                const isEnd = trip.endDate === dayInfo.dateString;
                return (
                  <div
                    key={trip.id}
                    style={{
                      padding: "16px",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--color-surface-alt)",
                      borderLeft: "4px solid var(--color-accent)",
                      borderTop: "1px solid var(--color-border)",
                      borderRight: "1px solid var(--color-border)",
                      borderBottom: "1px solid var(--color-border)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "1.05rem",
                          color: "var(--color-text)",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {trip.name}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: "12px",
                          background:
                            trip.status === "ONGOING"
                              ? "var(--color-gold-soft)"
                              : "var(--color-accent-soft)",
                          color:
                            trip.status === "ONGOING"
                              ? "var(--color-gold)"
                              : "var(--color-accent-dark)",
                          textTransform: "uppercase",
                        }}
                      >
                        {trip.status}
                      </span>
                    </div>

                    {trip.cityName && (
                      <div
                        style={{
                          fontSize: "0.88rem",
                          color: "var(--color-text-muted)",
                          marginBottom: "6px",
                        }}
                      >
                        📍 <strong>Destination:</strong> {trip.cityName}
                      </div>
                    )}

                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--color-text-muted)",
                        marginBottom: "10px",
                      }}
                    >
                      🗓️ <strong>Duration:</strong> {trip.startDate} to {trip.endDate}
                      {isStart && <span style={{ color: "var(--color-accent)", fontWeight: 600 }}> (Day 1 — Departure)</span>}
                      {isEnd && <span style={{ color: "var(--color-gold)", fontWeight: 600 }}> (Final Day — Return)</span>}
                    </div>

                    {trip.description && (
                      <p
                        style={{
                          fontSize: "0.9rem",
                          lineHeight: 1.45,
                          color: "var(--color-text)",
                          marginBottom: "12px",
                          background: "#ffffff",
                          padding: "10px 12px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--color-border)",
                        }}
                      >
                        {trip.description}
                      </p>
                    )}

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <Link
                        href={`/itinerary-view`}
                        className="btn btn-outline"
                        style={{
                          fontSize: "0.82rem",
                          padding: "6px 12px",
                          textDecoration: "none",
                        }}
                      >
                        View Full Itinerary
                      </Link>
                      <Link
                        href={`/budget`}
                        className="btn btn-outline"
                        style={{
                          fontSize: "0.82rem",
                          padding: "6px 12px",
                          textDecoration: "none",
                        }}
                      >
                        Trip Budget
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              background: "var(--color-surface-alt)",
              borderRadius: "var(--radius-sm)",
              marginBottom: "24px",
              border: "1px dashed var(--color-border)",
            }}
          >
            <p style={{ margin: "0 0 10px 0", color: "var(--color-text-muted)" }}>
              No trips scheduled for this date.
            </p>
            <Link
              href="/create-trip"
              className="btn btn-primary"
              style={{
                fontSize: "0.85rem",
                padding: "8px 16px",
                display: "inline-block",
                textDecoration: "none",
              }}
            >
              + Plan a Trip for this Day
            </Link>
          </div>
        )}

        {/* Scheduled Activities for this Date */}
        <div>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "12px", color: "var(--color-text)" }}>
            Scheduled Activities & Itinerary ({dayInfo.activities.length})
          </h3>

          {dayInfo.activities.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {dayInfo.activities.map((act) => (
                <div
                  key={act.id}
                  style={{
                    display: "flex",
                    gap: "14px",
                    alignItems: "flex-start",
                    padding: "14px",
                    borderRadius: "var(--radius-sm)",
                    background: "#ffffff",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {/* Time Badge */}
                  <div
                    style={{
                      minWidth: "70px",
                      textAlign: "center",
                      background: "var(--color-surface)",
                      padding: "6px 8px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "var(--color-accent-dark)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {act.startTime ? act.startTime : "All Day"}
                    {act.endTime && <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>to {act.endTime}</div>}
                  </div>

                  {/* Activity Details */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.96rem", color: "var(--color-text)" }}>
                        {act.title}
                      </span>
                      {act.category && (
                        <span
                          style={{
                            fontSize: "0.72rem",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            background: "var(--color-surface-alt)",
                            color: "var(--color-text-muted)",
                            fontWeight: 600,
                          }}
                        >
                          {act.category}
                        </span>
                      )}
                    </div>

                    {act.notes && (
                      <p style={{ margin: "0 0 6px 0", fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.4 }}>
                        {act.notes}
                      </p>
                    )}

                    <div style={{ display: "flex", gap: "12px", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                      {act.cityName && <span>📍 {act.cityName}</span>}
                      {act.estimatedCost !== undefined && act.estimatedCost !== null && (
                        <span>💰 {act.currency || "$"}{act.estimatedCost}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: "16px",
                textAlign: "center",
                color: "var(--color-text-muted)",
                fontSize: "0.9rem",
                background: "var(--color-surface)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              No specific activities scheduled yet for this date.
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            style={{ padding: "8px 20px" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
