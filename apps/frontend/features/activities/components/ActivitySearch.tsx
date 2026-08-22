"use client";

import React, { useState } from "react";
import { useActivities } from "../hooks/useActivities";
import { ActivityResultRow } from "./ActivityResultRow";
import { AddActivityToTripModal } from "./AddActivityToTripModal";
import type { Activity } from "../types";

export function ActivitySearch() {
  const {
    activities,
    total,
    isLoading,
    error,
    search,
    setSearch,
    category,
    setCategory,
    costFilter,
    setCostFilter,
    sortBy,
    setSortBy,
  } = useActivities();

  const [selectedActivityForTrip, setSelectedActivityForTrip] = useState<Activity | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleActivityAdded = (activityName: string, tripName: string) => {
    setToastMessage(`Scheduled "${activityName}" in ${tripName}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Toast */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "24px",
            zIndex: 9999,
            background: "var(--color-accent-dark)",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "var(--radius-sm)",
            boxShadow: "var(--shadow-md)",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          ✓ {toastMessage}
        </div>
      )}

      {/* Toolbar */}
      <div
        className="card"
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "24px",
          padding: "14px 18px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div style={{ flex: "1 1 240px" }}>
          <input
            type="text"
            placeholder="Search activities (e.g. Louvre, Sunset Cruise, Food Tour)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              background: "#ffffff",
              fontSize: "0.92rem",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              background: "#ffffff",
              fontSize: "0.88rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <option value="all">All Categories</option>
            <option value="Sightseeing">Sightseeing</option>
            <option value="Food">Food & Dining</option>
            <option value="Adventure">Adventure</option>
            <option value="Relaxation">Relaxation</option>
          </select>

          <select
            value={costFilter}
            onChange={(e) => setCostFilter(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              background: "#ffffff",
              fontSize: "0.88rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <option value="all">Any Price</option>
            <option value="under50">Under $50</option>
            <option value="50to150">$50 – $150</option>
            <option value="over150">Over $150</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "COST_ASC" | "COST_DESC" | "POPULARITY")}
            style={{
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              background: "#ffffff",
              fontSize: "0.88rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <option value="POPULARITY">Sort: Popularity</option>
            <option value="COST_ASC">Sort: Price (Low to High)</option>
            <option value="COST_DESC">Sort: Price (High to Low)</option>
          </select>
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

      {/* List Content */}
      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="card"
              style={{ height: "96px", background: "var(--color-surface)", opacity: 0.6 }}
            />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div
          className="card"
          style={{
            padding: "48px",
            textAlign: "center",
            background: "#ffffff",
            border: "1px dashed var(--color-border)",
          }}
        >
          <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>No activities match your search</h3>
          <p style={{ color: "var(--color-text-muted)" }}>
            Try adjusting your search keywords, price filter, or category selection.
          </p>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: "12px", fontSize: "0.86rem", color: "var(--color-text-muted)" }}>
            Showing {activities.length} {activities.length === 1 ? "activity" : "activities"}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {activities.map((activity) => (
              <ActivityResultRow
                key={activity.id}
                activity={activity}
                onAddToTrip={(act) => setSelectedActivityForTrip(act)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add To Itinerary Modal */}
      <AddActivityToTripModal
        isOpen={!!selectedActivityForTrip}
        activity={selectedActivityForTrip}
        onClose={() => setSelectedActivityForTrip(null)}
        onSuccess={handleActivityAdded}
      />
    </div>
  );
}
