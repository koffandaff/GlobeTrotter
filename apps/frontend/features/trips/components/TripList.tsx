"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useTrips } from "../hooks/useTrips";
import { TripCard } from "./TripCard";
import type { Trip } from "../types";

export function TripList() {
  const { trips, isLoading, error, duplicateTrip, deleteTrip } = useTrips();

  const [searchValue, setSearchValue] = useState("");
  const [groupBy, setGroupBy] = useState("status");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("startDate");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDuplicate = async (tripId: string) => {
    const res = await duplicateTrip(tripId);
    if (res.success) {
      showNotification("Trip duplicated successfully!");
    } else {
      showNotification(res.error || "Failed to duplicate trip", "error");
    }
  };

  const handleDelete = async (tripId: string) => {
    const res = await deleteTrip(tripId);
    if (res.success) {
      showNotification("Trip deleted.");
    } else {
      showNotification(res.error || "Failed to delete trip", "error");
    }
  };

  // Filter & sort
  const processedTrips = useMemo(() => {
    let result = [...trips];

    if (searchValue.trim()) {
      const lower = searchValue.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(lower) ||
          (t.destination && t.destination.toLowerCase().includes(lower)) ||
          (t.description && t.description.toLowerCase().includes(lower))
      );
    }

    if (filterStatus !== "all") {
      result = result.filter((t) => t.status.toLowerCase() === filterStatus.toLowerCase());
    }

    result.sort((a, b) => {
      if (sortBy === "startDate") {
        if (!a.startDate) return 1;
        if (!b.startDate) return -1;
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      } else {
        return (b.id || "").localeCompare(a.id || "");
      }
    });

    return result;
  }, [trips, searchValue, filterStatus, sortBy]);

  // Compute sections based on groupBy
  const sections = useMemo(() => {
    if (groupBy === "status") {
      return [
        {
          title: "Ongoing Trips",
          trips: processedTrips.filter((t) => t.status === "ONGOING"),
          emptyMessage: "No ongoing trips right now.",
        },
        {
          title: "Upcoming & Planned Trips",
          trips: processedTrips.filter((t) => t.status === "PLANNED"),
          emptyMessage: "No upcoming trips planned yet.",
        },
        {
          title: "Completed Trips",
          trips: processedTrips.filter((t) => t.status === "COMPLETED"),
          emptyMessage: "No completed trips yet.",
        },
        {
          title: "Drafts",
          trips: processedTrips.filter((t) => t.status === "DRAFT"),
          emptyMessage: "No draft trips.",
        },
      ].filter((sec) => sec.trips.length > 0 || (filterStatus === "all" && !searchValue));
    } else if (groupBy === "destination") {
      const destinations = Array.from(new Set(processedTrips.map((t) => t.destination || "Other"))).sort();
      if (destinations.length === 0) {
        return [{ title: "Destinations", trips: [], emptyMessage: "No trips match your filters." }];
      }
      return destinations.map((dest) => ({
        title: dest,
        trips: processedTrips.filter((t) => (t.destination || "Other") === dest),
        emptyMessage: `No trips found for ${dest}.`,
      }));
    }
    return [{ title: "All Trips", trips: processedTrips, emptyMessage: "No trips found." }];
  }, [processedTrips, groupBy, filterStatus, searchValue]);

  return (
    <div style={{ width: "100%" }}>
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "24px",
            zIndex: 9999,
            background: notification.type === "success" ? "var(--color-accent-dark)" : "var(--color-danger)",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "var(--radius-sm)",
            boxShadow: "var(--shadow-md)",
            fontSize: "0.9rem",
            fontWeight: 600,
            animation: "fadeIn 0.2s ease",
          }}
        >
          {notification.message}
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
          marginBottom: "32px",
          padding: "14px 18px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div style={{ flex: "1 1 240px" }}>
          <input
            type="text"
            placeholder="Search trips by name, destination, or notes..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
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
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
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
            <option value="status">Group by: Status</option>
            <option value="destination">Group by: Destination</option>
            <option value="none">Group by: None</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
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
            <option value="all">Filter: All</option>
            <option value="ongoing">Filter: Ongoing</option>
            <option value="planned">Filter: Planned</option>
            <option value="completed">Filter: Completed</option>
            <option value="draft">Filter: Draft</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
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
            <option value="startDate">Sort: Earliest Date</option>
            <option value="recent">Sort: Recently Added</option>
          </select>

          <Link
            href="/create-trip"
            className="btn btn-primary"
            style={{
              padding: "10px 18px",
              fontSize: "0.9rem",
              fontWeight: 600,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            + Plan a Trip
          </Link>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div
          style={{
            padding: "14px 18px",
            background: "rgba(181, 83, 60, 0.1)",
            border: "1px solid var(--color-danger)",
            borderRadius: "var(--radius-sm)",
            color: "var(--color-danger)",
            marginBottom: "24px",
            fontSize: "0.9rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="trip-card"
              style={{ height: "260px", background: "var(--color-surface)", opacity: 0.6 }}
            >
              <div className="thumb" style={{ background: "var(--color-surface-alt)" }} />
              <div style={{ height: "20px", background: "var(--color-border)", borderRadius: "4px", marginBottom: "8px" }} />
              <div style={{ height: "14px", width: "60%", background: "var(--color-border)", borderRadius: "4px" }} />
            </div>
          ))}
        </div>
      ) : processedTrips.length === 0 ? (
        <div
          className="card"
          style={{
            padding: "48px 24px",
            textAlign: "center",
            background: "var(--color-surface)",
            border: "1px dashed var(--color-border)",
          }}
        >
          <h3 style={{ fontSize: "1.3rem", marginBottom: "8px" }}>No trips found</h3>
          <p style={{ color: "var(--color-text-muted)", marginBottom: "20px" }}>
            {searchValue ? "Try adjusting your search terms or filters." : "Start planning your next adventure today!"}
          </p>
          <Link href="/create-trip" className="btn btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
            + Plan Your First Trip
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
          {sections.map((sec, idx) => (
            <section key={idx} className="section">
              <div className="section-title-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "1.4rem", margin: 0 }}>{sec.title}</h2>
                <span className="text-muted" style={{ fontSize: "0.88rem" }}>
                  {sec.trips.length} {sec.trips.length === 1 ? "trip" : "trips"}
                </span>
              </div>

              {sec.trips.length === 0 ? (
                <div
                  style={{
                    padding: "20px",
                    background: "var(--color-surface)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--color-text-muted)",
                    fontSize: "0.9rem",
                  }}
                >
                  {sec.emptyMessage}
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                  {sec.trips.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onDuplicate={handleDuplicate}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
