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
    id: "t3",
    name: "The South American Expedition",
    description: "Machu Picchu trek, Sacred Valley tour, Ceviche culinary experience.",
    coverImageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=600&auto=format&fit=crop",
    startDate: "2026-06-05",
    endDate: "2026-06-25",
    status: "Ongoing",
    totalEstimatedCost: 2800,
    currency: "USD",
    stopsCount: 2,
  },
  {
    id: "t2",
    name: "Scandinavian Winter Retreat",
    description: "Northern Lights safari, Husky sledding, Ice Hotel stay.",
    coverImageUrl: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=600&auto=format&fit=crop",
    startDate: "2025-12-15",
    endDate: "2025-12-28",
    status: "Planned",
    totalEstimatedCost: 4200,
    currency: "USD",
    stopsCount: 2,
  },
];

const mockRecommendedDestinations: RecommendedDestination[] = [
  {
    id: "d1",
    name: "Buenos Aires",
    country: "Argentina",
    imageUrl: "https://images.unsplash.com/photo-1614094723472-7eb3e284a1e9?q=80&w=600&auto=format&fit=crop",
    costIndex: 4.5,
    popularityScore: 9.1,
    reason: "Because you liked South American destinations.",
  },
  {
    id: "d2",
    name: "Reykjavik",
    country: "Iceland",
    imageUrl: "https://images.unsplash.com/photo-1521323389643-9829910d56c5?q=80&w=600&auto=format&fit=crop",
    costIndex: 8.8,
    popularityScore: 9.6,
    reason: "Based on your interest in winter retreats.",
  }
];

const mockBudgetHighlights: BudgetHighlights = {
  totalBudget: 4200,
  totalSpent: 850,
  totalEstimated: 3350,
  currency: "USD",
  byCategory: [
    { category: "Flights", budget: 1500, spent: 850, estimated: 650 },
    { category: "Accommodation", budget: 1500, spent: 0, estimated: 1500 },
    { category: "Food & Dining", budget: 700, spent: 0, estimated: 700 },
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
              <Link key={trip.id} href={`/itinerary-view?tripId=${trip.id}`} className="trip-card" style={{ textDecoration: "none" }}>
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
              <Link key={dest.id} href={`/city-search?q=${dest.name}`} className="card" style={{ textDecoration: "none", display: "flex", flexDirection: "column" }}>
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
