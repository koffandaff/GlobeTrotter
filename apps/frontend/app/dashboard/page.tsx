"use client";

import React from "react";
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
}

interface RecommendedDestination {
  id: string;
  name: string;
  country: string;
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
}

const mockRecentTrips: RecentTrip[] = [
  {
    id: "1",
    name: "Summer in Kyoto",
    description: "A two-week cultural immersion in Japan's historic capital.",
    coverImageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop",
    startDate: "2026-06-15",
    endDate: "2026-06-29",
    status: "Planned",
    totalEstimatedCost: 4500,
    currency: "USD",
    stopsCount: 3,
  },
  {
    id: "2",
    name: "Weekend in Paris",
    description: "Quick getaway for anniversary.",
    coverImageUrl: "https://images.unsplash.com/photo-1502602898657-3e907a5ea582?q=80&w=600&auto=format&fit=crop",
    startDate: "2026-04-10",
    endDate: "2026-04-13",
    status: "Completed",
    totalEstimatedCost: 1200,
    currency: "USD",
    stopsCount: 1,
  },
];

const mockRecommendedDestinations: RecommendedDestination[] = [
  {
    id: "d1",
    name: "Bali",
    country: "Indonesia",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop",
    costIndex: 3.2,
    popularityScore: 9.5,
    reason: "Because you liked tropical destinations.",
  },
  {
    id: "d2",
    name: "Rome",
    country: "Italy",
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=600&auto=format&fit=crop",
    costIndex: 7.8,
    popularityScore: 9.8,
    reason: "Based on your interest in history and cuisine.",
  }
];

const mockBudgetHighlights: BudgetHighlights = {
  totalBudget: 6000,
  totalSpent: 1250,
  totalEstimated: 4750,
  currency: "USD",
  byCategory: [
    { category: "Flights", budget: 2000, spent: 1100, estimated: 900 },
    { category: "Accommodation", budget: 2500, spent: 150, estimated: 2350 },
    { category: "Food & Dining", budget: 1000, spent: 0, estimated: 1000 },
    { category: "Activities", budget: 500, spent: 0, estimated: 500 }
  ]
};

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
  const recentTrips = mockRecentTrips;
  const recommendedDestinations = mockRecommendedDestinations;
  const budgetHighlights = mockBudgetHighlights;

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
