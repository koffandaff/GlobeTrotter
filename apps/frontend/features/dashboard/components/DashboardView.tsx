"use client";

import React from "react";
import Link from "next/link";
import { useDashboard } from "../hooks/useDashboard";

export function DashboardView() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading || !data) {
    return (
      <div style={{ textAlign: "center", padding: "64px 0" }}>
        <div className="spinner" style={{ margin: "0 auto 16px" }} />
        <p>Loading your travel dashboard...</p>
      </div>
    );
  }

  const upcomingCount = data.recentTrips.filter((t) => t.status !== "COMPLETED").length;
  const completedCount = data.recentTrips.filter((t) => t.status === "COMPLETED").length;
  const totalBudgetVal = data.budgetHighlights.totalBudget ?? 0;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {/* Welcome Page Header */}
      <div className="page-header" style={{ marginBottom: "28px" }}>
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
          Travel Hub
        </div>
        <h1 style={{ margin: "0 0 6px 0", fontSize: "2rem" }}>Where to next?</h1>
        <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
          Here is a quick summary of your active journeys, recommendations, and budget highlights.
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            background: "rgba(181, 83, 60, 0.1)",
            border: "1px solid var(--color-danger)",
            borderRadius: "var(--radius-sm)",
            color: "var(--color-danger)",
            marginBottom: "24px",
          }}
        >
          {error}
        </div>
      )}

      {/* Top 3 Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
          marginBottom: "36px",
        }}
      >
        <div
          className="card"
          style={{
            padding: "20px 24px",
            background: "#ffffff",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase" }}>
            Active / Upcoming Trips
          </span>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-accent-dark)", margin: "4px 0" }}>
            {upcomingCount}
          </div>
          <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
            In planning & transit
          </span>
        </div>

        <div
          className="card"
          style={{
            padding: "20px 24px",
            background: "#ffffff",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase" }}>
            Completed Trips
          </span>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-text)", margin: "4px 0" }}>
            {completedCount}
          </div>
          <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
            Memories archived
          </span>
        </div>

        <div
          className="card"
          style={{
            padding: "20px 24px",
            background: "#ffffff",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase" }}>
            Total Planned Budget
          </span>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-gold)", margin: "4px 0" }}>
            ${totalBudgetVal.toLocaleString()}
          </div>
          <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
            ${data.budgetHighlights.totalSpent.toLocaleString()} spent to date
          </span>
        </div>
      </div>

      {/* Your Trips Section */}
      <section style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <h2 style={{ fontSize: "1.35rem", margin: 0 }}>Your Trips</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link href="/my-trips" className="btn btn-outline" style={{ padding: "6px 14px", fontSize: "0.86rem", textDecoration: "none" }}>
              View All ({data.recentTrips.length})
            </Link>
            <Link href="/create-trip" className="btn btn-primary" style={{ padding: "6px 16px", fontSize: "0.86rem", textDecoration: "none" }}>
              + Plan a Trip
            </Link>
          </div>
        </div>

        {data.recentTrips.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "40px",
              textAlign: "center",
              background: "#ffffff",
              border: "1px dashed var(--color-border)",
            }}
          >
            <p style={{ color: "var(--color-text-muted)", marginBottom: "16px" }}>You don't have any trips planned yet.</p>
            <Link href="/create-trip" className="btn btn-primary" style={{ textDecoration: "none" }}>
              Plan Your First Trip
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {data.recentTrips.map((trip) => (
              <div
                key={trip.id}
                className="card"
                style={{
                  background: "#ffffff",
                  padding: "20px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      height: "120px",
                      borderRadius: "var(--radius-sm)",
                      backgroundImage: trip.coverImageUrl
                        ? `url(${trip.coverImageUrl})`
                        : "linear-gradient(135deg, var(--color-accent-soft), var(--color-gold-soft))",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      marginBottom: "14px",
                    }}
                  />
                  <h3 style={{ margin: "0 0 6px 0", fontSize: "1.15rem" }}>{trip.name}</h3>
                  <div style={{ fontSize: "0.84rem", color: "var(--color-text-muted)", marginBottom: "12px" }}>
                    🗓️ {trip.startDate || "Date TBD"} {trip.endDate && `→ ${trip.endDate}`}
                    {trip.stopsCount > 0 && ` · 📍 ${trip.stopsCount} stops`}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--color-border)" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                    {trip.totalEstimatedCost ? `${trip.currency} ${trip.totalEstimatedCost.toLocaleString()}` : "Budget TBD"}
                  </span>
                  <Link
                    href={`/itinerary-view?tripId=${trip.id}`}
                    className="btn btn-primary"
                    style={{ padding: "6px 12px", fontSize: "0.8rem", textDecoration: "none" }}
                  >
                    View Itinerary →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recommended Destinations Section */}
      <section style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <h2 style={{ fontSize: "1.35rem", margin: 0 }}>Recommended Destinations</h2>
          <Link href="/city-search" className="btn btn-outline" style={{ padding: "6px 14px", fontSize: "0.86rem", textDecoration: "none" }}>
            Explore All Cities →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "18px" }}>
          {data.recommendedDestinations.map((city) => (
            <div
              key={city.id}
              className="card"
              style={{
                background: "#ffffff",
                padding: "16px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  height: "110px",
                  borderRadius: "var(--radius-sm)",
                  backgroundImage: city.imageUrl
                    ? `url(${city.imageUrl})`
                    : "linear-gradient(135deg, var(--color-accent-soft), var(--color-gold-soft))",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  marginBottom: "10px",
                }}
              />
              <h4 style={{ margin: "0 0 2px 0", fontSize: "1.05rem" }}>{city.name}</h4>
              <p style={{ margin: "0 0 8px 0", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                {city.country}
              </p>
              {city.reason && (
                <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--color-accent-dark)", fontWeight: 500 }}>
                  ✨ {city.reason}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
