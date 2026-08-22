"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useItinerary } from "../hooks/useItinerary";

interface ItineraryViewProps {
  initialTripId?: string;
}

export function ItineraryView({ initialTripId }: ItineraryViewProps) {
  const searchParams = useSearchParams();
  const urlTripId = searchParams.get("tripId");
  const actualTripId = initialTripId || urlTripId || undefined;

  const { tripId, setTripId, availableTrips, itinerary, isLoading, error } =
    useItinerary(actualTripId);

  const [search, setSearch] = useState("");
  const [groupBy, setGroupBy] = useState<"DAY" | "CITY">("DAY");

  // Flatten days across stops
  const allDays = useMemo(() => {
    if (!itinerary) return [];
    const daysList: Array<{
      dayNumber: number;
      date: string;
      cityName: string;
      country: string;
      items: Array<{
        id: string;
        title: string;
        startTime?: string | null;
        endTime?: string | null;
        estimatedCost?: number | null;
        currency?: string;
        notes?: string | null;
      }>;
      totalCost: number;
    }> = [];

    let currentDayNum = 1;
    for (const stop of itinerary.stops) {
      if (stop.days && stop.days.length > 0) {
        for (const day of stop.days) {
          daysList.push({
            dayNumber: currentDayNum++,
            date: day.date,
            cityName: stop.city.name,
            country: stop.city.country,
            items: day.items,
            totalCost: day.totalEstimatedCost,
          });
        }
      }
    }

    return daysList;
  }, [itinerary]);

  // Filter items by search
  const filteredDays = useMemo(() => {
    if (!search.trim()) return allDays;
    const lower = search.toLowerCase();
    return allDays
      .map((day) => ({
        ...day,
        items: day.items.filter(
          (item) =>
            item.title.toLowerCase().includes(lower) ||
            (item.notes && item.notes.toLowerCase().includes(lower)) ||
            day.cityName.toLowerCase().includes(lower)
        ),
      }))
      .filter((day) => day.items.length > 0);
  }, [allDays, search]);

  const totalCostAllDays = useMemo(() => {
    return allDays.reduce((sum, d) => sum + d.totalCost, 0);
  }, [allDays]);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* Header with trip selector and action buttons */}
      <div
        className="card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "28px",
          padding: "20px 24px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div>
          <div
            className="eyebrow"
            style={{
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontWeight: 700,
              color: "var(--color-accent)",
              marginBottom: "4px",
            }}
          >
            Itinerary Schedule
          </div>
          <h1 style={{ margin: "0 0 6px 0", fontSize: "1.8rem" }}>
            {itinerary?.trip.name || "Trip Itinerary"}
          </h1>
          <div style={{ display: "flex", gap: "16px", fontSize: "0.86rem", color: "var(--color-text-muted)" }}>
            <span>🗓️ {allDays.length} Days</span>
            <span>📍 {itinerary?.stops.length || 0} Destinations</span>
            <span>💰 Total Budget: ${totalCostAllDays.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <select
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}
            style={{
              padding: "8px 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              background: "#ffffff",
              fontWeight: 600,
              fontSize: "0.88rem",
              cursor: "pointer",
            }}
          >
            {tripId && !availableTrips.some(t => t.id === tripId) && (
              <option value={tripId}>
                {itinerary?.trip.name || "Community Trip"}
              </option>
            )}
            {availableTrips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <Link
            href={`/itinerary-builder?tripId=${tripId}`}
            className="btn btn-outline"
            style={{ padding: "8px 16px", fontSize: "0.88rem", textDecoration: "none" }}
          >
            ✏️ Edit Stops
          </Link>
        </div>
      </div>

      {/* Filter toolbar */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          marginBottom: "28px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 240px" }}>
          <input
            type="text"
            placeholder="Search activities or cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              background: "#ffffff",
              fontSize: "0.9rem",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setGroupBy("DAY")}
            className="btn"
            style={{
              background: groupBy === "DAY" ? "var(--color-accent-dark)" : "var(--color-surface)",
              color: groupBy === "DAY" ? "#ffffff" : "var(--color-text)",
              border: "1px solid var(--color-border)",
              padding: "8px 16px",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            Day-by-Day
          </button>
          <button
            type="button"
            onClick={() => setGroupBy("CITY")}
            className="btn"
            style={{
              background: groupBy === "CITY" ? "var(--color-accent-dark)" : "var(--color-surface)",
              color: groupBy === "CITY" ? "#ffffff" : "var(--color-text)",
              border: "1px solid var(--color-border)",
              padding: "8px 16px",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            By Destination
          </button>
        </div>
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
          }}
        >
          {error}
        </div>
      )}

      {/* Loading & Content */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <div className="spinner" style={{ margin: "0 auto 16px" }} />
          <p>Loading itinerary timeline...</p>
        </div>
      ) : filteredDays.length === 0 ? (
        <div
          className="card"
          style={{
            padding: "48px",
            textAlign: "center",
            background: "#ffffff",
            border: "1px dashed var(--color-border)",
          }}
        >
          <p style={{ color: "var(--color-text-muted)", marginBottom: "16px" }}>
            No itinerary activities found.
          </p>
          <Link
            href={`/itinerary-builder?tripId=${tripId}`}
            className="btn btn-primary"
            style={{ textDecoration: "none" }}
          >
            + Build Itinerary Activities
          </Link>
        </div>
      ) : (
        <div style={{ position: "relative", paddingLeft: "16px" }}>
          {/* Vertical timeline line */}
          <div
            style={{
              position: "absolute",
              left: "40px",
              top: "24px",
              bottom: "24px",
              width: "2px",
              background: "var(--color-border)",
              zIndex: 0,
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "32px", position: "relative", zIndex: 1 }}>
            {filteredDays.map((day) => (
              <div key={day.dayNumber}>
                {/* Day Marker */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "var(--color-accent)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    D{day.dayNumber}
                  </div>

                  <div>
                    <span
                      style={{
                        fontSize: "0.92rem",
                        fontWeight: 700,
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        color: "var(--color-accent-dark)",
                      }}
                    >
                      📍 {day.cityName}, {day.country}
                    </span>
                    {day.date && (
                      <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginLeft: "10px" }}>
                        {day.date}
                      </span>
                    )}
                  </div>
                </div>

                {/* Day Activity List */}
                <div style={{ paddingLeft: "62px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {day.items.length === 0 ? (
                    <div
                      style={{
                        padding: "12px 16px",
                        background: "var(--color-surface)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.86rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      No activities planned for this day.
                    </div>
                  ) : (
                    day.items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          padding: "14px 18px",
                          borderRadius: "var(--radius-sm)",
                          background: "#ffffff",
                          border: "1px solid var(--color-border)",
                          boxShadow: "var(--shadow-sm)",
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {item.startTime && (
                              <span
                                style={{
                                  fontSize: "0.8rem",
                                  fontWeight: 700,
                                  color: "var(--color-accent-dark)",
                                  background: "var(--color-accent-soft)",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                }}
                              >
                                {item.startTime} {item.endTime ? `– ${item.endTime}` : ""}
                              </span>
                            )}
                            <span style={{ fontWeight: 600, fontSize: "0.96rem", color: "var(--color-text)" }}>
                              {item.title}
                            </span>
                          </div>

                          {item.notes && (
                            <p style={{ margin: "6px 0 0 0", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                              {item.notes}
                            </p>
                          )}
                        </div>

                        {item.estimatedCost !== undefined && item.estimatedCost !== null && (
                          <span
                            style={{
                              fontSize: "0.88rem",
                              fontWeight: 700,
                              color: "var(--color-text)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            ${item.estimatedCost}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
