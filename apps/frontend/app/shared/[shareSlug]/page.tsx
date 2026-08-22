"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSharedTrip, copySharedTrip, SharedTrip } from "@/features/sharing/api/sharingApi";
import { useAuth } from "@/lib/auth/AuthContext";

interface SharedTripPageProps {
  params: { shareSlug: string };
}

export default function SharedTripPage({ params }: SharedTripPageProps) {
  const { shareSlug } = params;
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [trip, setTrip] = useState<SharedTrip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSharedTrip(shareSlug);
        setTrip(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "This shared trip could not be found.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [shareSlug]);

  const handleCopy = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/shared/${shareSlug}`);
      return;
    }
    setIsCopying(true);
    try {
      const newTrip = await copySharedTrip(shareSlug);
      router.push(`/itinerary-builder?tripId=${newTrip.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to copy trip.");
      setIsCopying(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;

  if (isLoading) {
    return (
      <main className="page-main" style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
          <div className="spinner" />
        </div>
      </main>
    );
  }

  if (error || !trip) {
    return (
      <main className="page-main" style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div className="empty-state">
          <h3>Trip not found</h3>
          <p>{error ?? "This trip link may have expired or been removed."}</p>
          <Link href="/" className="btn btn-primary" style={{ marginTop: "16px" }}>
            Go to GlobeTrotter
          </Link>
        </div>
      </main>
    );
  }

  const authorName = trip.user.username || `${trip.user.firstName} ${trip.user.lastName}`;

  return (
    <main className="page-main" style={{ maxWidth: "700px", margin: "0 auto" }}>
      {/* Header */}
      <div className="page-header">
        <div className="eyebrow">Shared Trip</div>
        <h1>{trip.name}</h1>
        {trip.description && <p>{trip.description}</p>}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
          <span>by <strong>{authorName}</strong></span>
          {trip.startDate && (
            <span>
              {formatDate(trip.startDate)}
              {trip.endDate && ` – ${formatDate(trip.endDate)}`}
            </span>
          )}
          <span>❤️ {trip._count.likes} likes · 💬 {trip._count.comments} comments</span>
        </div>
      </div>

      {/* Cover image */}
      {trip.coverImageUrl && (
        <div
          style={{
            height: 220,
            borderRadius: "var(--radius-md)",
            background: `url(${trip.coverImageUrl}) center/cover`,
            marginBottom: "var(--space-4)",
          }}
        />
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "var(--space-4)", flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={handleCopy} disabled={isCopying}>
          {isCopying ? "Copying..." : "📋 Copy this Trip"}
        </button>
        <button className="btn btn-outline" onClick={handleCopyLink}>
          {copied ? "✅ Link Copied!" : "🔗 Copy Link"}
        </button>
      </div>

      {/* Stops */}
      {trip.stops.length === 0 ? (
        <div className="empty-state">
          <p>No stops added to this trip yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {trip.stops.map((stop, idx) => (
            <div key={stop.id} className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "var(--color-accent-soft)",
                    color: "var(--color-accent-dark)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "1rem" }}>{stop.city.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{stop.city.country}</div>
                </div>
                {(stop.arrivalDate || stop.departureDate) && (
                  <div style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--color-text-muted)", textAlign: "right" }}>
                    {formatDate(stop.arrivalDate)} {stop.departureDate && `→ ${formatDate(stop.departureDate)}`}
                  </div>
                )}
              </div>
              {stop.notes && (
                <p style={{ margin: "8px 0 0 44px", fontSize: "0.85rem", color: "var(--color-text)" }}>{stop.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer CTA */}
      {!isAuthenticated && (
        <div className="card" style={{ marginTop: "var(--space-4)", textAlign: "center", background: "var(--color-accent-soft)" }}>
          <h3>Want to plan your own trip?</h3>
          <p>Sign up for GlobeTrotter and start planning today.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "12px" }}>
            <Link href="/signup" className="btn btn-primary">Sign up free</Link>
            <Link href="/login" className="btn btn-outline">Log in</Link>
          </div>
        </div>
      )}
    </main>
  );
}
