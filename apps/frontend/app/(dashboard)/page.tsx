"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface RecentTrip {
  id: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
  totalEstimatedCost: number | null;
  currency: string;
  stopsCount: number;
  createdAt: string;
}

interface RecommendedDestination {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  imageUrl: string | null;
  costIndex: number | null;
  popularityScore: number;
  reason: string | null;
}

interface BudgetCategory {
  category: string;
  budget: number | null;
  spent: number;
  estimated: number;
}

interface BudgetHighlights {
  totalBudget: number | null;
  totalSpent: number;
  totalEstimated: number;
  currency: string;
  byCategory: BudgetCategory[];
  tripsWithBudget: number;
  tripsWithoutBudget: number;
}

interface DashboardData {
  recentTrips: RecentTrip[];
  recommendedDestinations: RecommendedDestination[];
  budgetHighlights: BudgetHighlights;
}

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

function formatCurrency(amount: number | null, currency = "USD"): string {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusBadgeClass(status: string): string {
  const statusLower = status.toLowerCase();
  if (statusLower === "ongoing") return "badge";
  if (statusLower === "completed") return "badge-gold";
  if (statusLower === "planned") return "badge";
  return "badge";
}

function DashboardPage() {
  const [state, setState] = useState<DashboardState>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchDashboard = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const res = await fetch(`${API_BASE}/dashboard`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || "Failed to load dashboard");
      }

      const result = await res.json();
      setState({ data: result.data, loading: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load dashboard",
      }));
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (state.loading) {
    return (
      <main className="page-main">
        <div className="placeholder-box">Loading dashboard...</div>
      </main>
    );
  }

  if (state.error) {
    return (
      <main className="page-main">
        <div className="card" style={{ color: "var(--color-danger)" }}>
          <h2>Error</h2>
          <p>{state.error}</p>
          <button className="btn btn-primary" onClick={fetchDashboard} style={{ marginTop: "16px" }}>
            Retry
          </button>
        </div>
      </main>
    );
  }

  const { recentTrips, recommendedDestinations, budgetHighlights } = state.data!;

  return (
    <main className="page-main">
      <div className="page-header">
        <div className="eyebrow">Home</div>
        <h1>Dashboard</h1>
        <p>Your travel overview at a glance</p>
      </div>

      {/* Budget Highlights */}
      <div className="section">
        <div className="section-title-row">
          <h2>Budget Overview</h2>
          <Link href="/budget" className="btn btn-ghost" style={{ fontSize: "0.85rem" }}>
            View all
          </Link>
        </div>
        <div className="grid grid-3">
          <div className="stat-card">
            <div className="stat-value">{formatCurrency(budgetHighlights.totalSpent, budgetHighlights.currency)}</div>
            <div className="stat-label">Total Spent</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{formatCurrency(budgetHighlights.totalEstimated, budgetHighlights.currency)}</div>
            <div className="stat-label">Estimated</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {budgetHighlights.totalBudget ? formatCurrency(budgetHighlights.totalBudget, budgetHighlights.currency) : "Not set"}
            </div>
            <div className="stat-label">Total Budget</div>
          </div>
        </div>

        <div className="card" style={{ marginTop: "var(--space-4)" }}>
          <h3 style={{ marginBottom: "var(--space-3)" }}>By Category</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {budgetHighlights.byCategory.map((cat) => (
              <div key={cat.category} className="list-row">
                <div>
                  <div style={{ textTransform: "capitalize", fontWeight: 500 }}>{cat.category.toLowerCase()}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                    Budget: {cat.budget ? formatCurrency(cat.budget, budgetHighlights.currency) : "Not set"}
                    {cat.spent > 0 && ` • Spent: ${formatCurrency(cat.spent, budgetHighlights.currency)}`}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                    {formatCurrency(cat.spent, budgetHighlights.currency)}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                    {cat.estimated > 0 && `Est. ${formatCurrency(cat.estimated, budgetHighlights.currency)}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="section">
        <div className="section-title-row">
          <h2>Recent Trips</h2>
          <Link href="/my-trips" className="btn btn-ghost" style={{ fontSize: "0.85rem" }}>
            View all
          </Link>
        </div>
        {recentTrips.length === 0 ? (
          <div className="empty-state">
            <h3>No trips yet</h3>
            <p>Start planning your first adventure!</p>
            <Link href="/create-trip" className="btn btn-primary" style={{ marginTop: "var(--space-3)" }}>
              Plan a Trip
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {recentTrips.map((trip) => (
              <Link key={trip.id} href={`/trip/${trip.id}`} className="trip-card" style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}>
                  <div
                    className="trip-card-thumb"
                    style={{
                      width: 120,
                      height: 80,
                      borderRadius: "var(--radius-sm)",
                      background: trip.coverImageUrl
                        ? `url(${trip.coverImageUrl}) center/cover`
                        : "linear-gradient(135deg, var(--color-accent-soft), var(--color-gold-soft))",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "4px" }}>
                      <h3 style={{ margin: 0, fontSize: "1rem" }}>{trip.name}</h3>
                      <span className={getStatusBadgeClass(trip.status)} style={{ fontSize: "0.7rem" }}>
                        {trip.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>
                      {trip.startDate && trip.endDate
                        ? `${formatDate(trip.startDate)} – ${formatDate(trip.endDate)}`
                        : trip.startDate
                        ? `From ${formatDate(trip.startDate)}`
                        : "Dates not set"}
                      {trip.stopsCount > 0 && ` • ${trip.stopsCount} stop${trip.stopsCount > 1 ? "s" : ""}`}
                    </div>
                    {trip.description && (
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text)", lineHeight: 1.4 }}>
                        {trip.description.length > 100
                          ? trip.description.slice(0, 100) + "..."
                          : trip.description}
                      </p>
                    )}
                    <div style={{ marginTop: "8px", fontSize: "0.8rem", color: "var(--color-accent-dark)", fontWeight: 600 }}>
                      {trip.totalEstimatedCost
                        ? formatCurrency(trip.totalEstimatedCost, trip.currency)
                        : "No estimate"}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Destinations */}
      <div className="section">
        <div className="section-title-row">
          <h2>Recommended for You</h2>
          <Link href="/city-search" className="btn btn-ghost" style={{ fontSize: "0.85rem" }}>
            Explore
          </Link>
        </div>
        {recommendedDestinations.length === 0 ? (
          <div className="empty-state">
            <h3>No recommendations yet</h3>
            <p>Explore cities to get personalized suggestions.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {recommendedDestinations.map((dest) => (
              <Link key={dest.id} href={`/city/${dest.id}`} className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    height: 120,
                    borderRadius: "var(--radius-sm)",
                    background: dest.imageUrl
                      ? `url(${dest.imageUrl}) center/cover`
                      : "linear-gradient(135deg, var(--color-accent-soft), var(--color-gold-soft))",
                    margin: "calc(-1 * var(--space-4)) calc(-1 * var(--space-4)) var(--space-3)",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 var(--space-1)", fontSize: "1rem" }}>{dest.name}</h3>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                    {dest.country}
                  </p>
                  {dest.reason && (
                    <p style={{ margin: "var(--space-2) 0 0", fontSize: "0.8rem", color: "var(--color-accent-dark)" }}>
                      {dest.reason}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
                  <span className="badge">{dest.popularityScore.toFixed(1)}</span>
                  {dest.costIndex && (
                    <span className="badge-gold">Cost: {dest.costIndex.toFixed(1)}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default DashboardPage;