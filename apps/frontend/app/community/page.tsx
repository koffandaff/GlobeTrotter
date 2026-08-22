"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";

interface TripStop {
  city: { name: string; country: string };
}

interface CommunityTrip {
  id: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
  currency: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  stops: TripStop[];
  _count: { likes: number; comments: number };
}

interface CommunityResponse {
  trips: CommunityTrip[];
  totalItems: number;
}

function formatDate(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export default function CommunityPage() {
  const [trips, setTrips] = useState<CommunityTrip[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [likingId, setLikingId] = useState<string | null>(null);

  const loadTrips = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient<CommunityResponse>(
        `/community/trips?page=1&limit=50&sort=${sortBy}`
      );
      setTrips(data.trips);
      setTotalItems(data.totalItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load community trips.");
    } finally {
      setIsLoading(false);
    }
  }, [sortBy]);

  useEffect(() => { loadTrips(); }, [loadTrips]);

  const handleToggleLike = async (tripId: string) => {
    if (likingId) return;
    const isLiked = likedIds.has(tripId);
    setLikingId(tripId);

    // Optimistic update
    setLikedIds(prev => {
      const next = new Set(prev);
      isLiked ? next.delete(tripId) : next.add(tripId);
      return next;
    });
    setTrips(prev => prev.map(t =>
      t.id === tripId
        ? { ...t, _count: { ...t._count, likes: t._count.likes + (isLiked ? -1 : 1) } }
        : t
    ));

    try {
      if (isLiked) {
        await apiClient(`/community/trips/${tripId}/like`, { method: "DELETE" });
      } else {
        await apiClient(`/community/trips/${tripId}/like`, { method: "POST" });
      }
    } catch {
      // Revert on failure
      setLikedIds(prev => {
        const next = new Set(prev);
        isLiked ? next.add(tripId) : next.delete(tripId);
        return next;
      });
      setTrips(prev => prev.map(t =>
        t.id === tripId
          ? { ...t, _count: { ...t._count, likes: t._count.likes + (isLiked ? 1 : -1) } }
          : t
      ));
    } finally {
      setLikingId(null);
    }
  };

  const filtered = trips.filter(t => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      (t.description ?? "").toLowerCase().includes(q) ||
      t.stops.some(s => s.city.name.toLowerCase().includes(q) || s.city.country.toLowerCase().includes(q)) ||
      (t.user.displayName ?? t.user.username).toLowerCase().includes(q)
    );
  });

  return (
    <main className="page-main" style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: "var(--space-4)" }}>
        <div className="eyebrow">Explore</div>
        <h1>Community Trips</h1>
        <p>Discover public itineraries shared by fellow travellers</p>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search trips, destinations, travellers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: "220px",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
            fontSize: "0.92rem",
          }}
        />
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            type="button"
            onClick={() => setSortBy("recent")}
            className={sortBy === "recent" ? "btn btn-primary" : "btn btn-outline"}
            style={{ fontSize: "0.85rem", padding: "8px 16px" }}
          >
            Most Recent
          </button>
          <button
            type="button"
            onClick={() => setSortBy("popular")}
            className={sortBy === "popular" ? "btn btn-primary" : "btn btn-outline"}
            style={{ fontSize: "0.85rem", padding: "8px 16px" }}
          >
            Most Popular
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: "12px 16px",
          background: "rgba(181,83,60,0.1)",
          border: "1px solid var(--color-danger)",
          borderRadius: "var(--radius-sm)",
          color: "var(--color-danger)",
          marginBottom: "20px",
          fontSize: "0.9rem",
        }}>
          ⚠️ {error} — <button type="button" onClick={loadTrips} style={{ background: "none", border: "none", color: "inherit", textDecoration: "underline", cursor: "pointer" }}>Retry</button>
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[1, 2, 3].map(n => (
            <div key={n} className="card" style={{ opacity: 0.4, height: "140px", background: "var(--color-surface)" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h3>{trips.length === 0 ? "No public trips yet" : "No results found"}</h3>
          <p>{trips.length === 0 ? "Be the first to share your itinerary!" : "Try a different search term."}</p>
          {search && (
            <button type="button" className="btn btn-outline" onClick={() => setSearch("")} style={{ marginTop: "12px" }}>
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "16px" }}>
            {filtered.length} trip{filtered.length !== 1 ? "s" : ""} {search ? "found" : `· ${totalItems} total`}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filtered.map(trip => (
              <div
                key={trip.id}
                className="card"
                style={{ padding: "20px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}
              >
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  {/* Cover image */}
                  <div style={{
                    width: 100, height: 72, flexShrink: 0,
                    borderRadius: "var(--radius-sm)",
                    background: trip.coverImageUrl
                      ? `url(${trip.coverImageUrl}) center/cover`
                      : "linear-gradient(135deg, var(--color-accent-soft), var(--color-gold-soft))",
                  }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Title row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", flexWrap: "wrap" }}>
                      <div>
                        <Link
                          href={`/itinerary-view?tripId=${trip.id}`}
                          style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-text)", textDecoration: "none" }}
                        >
                          {trip.name}
                        </Link>
                        <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
                          by <strong>{trip.user.displayName || trip.user.username}</strong> · {timeAgo(trip.createdAt)}
                        </div>
                      </div>
                      <Link
                        href={`/itinerary-view?tripId=${trip.id}`}
                        className="btn btn-outline"
                        style={{ fontSize: "0.78rem", padding: "5px 12px", textDecoration: "none", flexShrink: 0 }}
                      >
                        View Itinerary →
                      </Link>
                    </div>

                    {/* Stops preview */}
                    {trip.stops.length > 0 && (
                      <div style={{ fontSize: "0.82rem", color: "var(--color-accent-dark)", fontWeight: 600, marginTop: "6px" }}>
                        📍 {trip.stops.map(s => `${s.city.name}, ${s.city.country}`).join(" → ")}
                        {totalItems > 3 && " · ..."}
                      </div>
                    )}

                    {/* Dates */}
                    {(trip.startDate || trip.endDate) && (
                      <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
                        🗓️ {formatDate(trip.startDate)} {trip.endDate ? `– ${formatDate(trip.endDate)}` : ""}
                      </div>
                    )}

                    {/* Description */}
                    {trip.description && (
                      <p style={{ margin: "8px 0 0", fontSize: "0.87rem", color: "var(--color-text)", lineHeight: 1.5 }}>
                        {trip.description.length > 120 ? trip.description.slice(0, 120) + "…" : trip.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "16px", marginTop: "12px", alignItems: "center" }}>
                      <button
                        type="button"
                        onClick={() => handleToggleLike(trip.id)}
                        disabled={likingId === trip.id}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", gap: "5px",
                          fontSize: "0.88rem",
                          color: likedIds.has(trip.id) ? "var(--color-danger)" : "var(--color-text-muted)",
                          fontWeight: likedIds.has(trip.id) ? 700 : 400,
                          transition: "color 0.15s, transform 0.15s",
                          transform: likingId === trip.id ? "scale(0.95)" : "scale(1)",
                          padding: 0,
                        }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill={likedIds.has(trip.id) ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {trip._count.likes}
                      </button>
                      <span style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "5px" }}>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                        </svg>
                        {trip._count.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

