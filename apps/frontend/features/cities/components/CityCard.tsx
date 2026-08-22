"use client";

import React from "react";
import type { City } from "../types";

interface CityCardProps {
  city: City;
  onAddToTrip: (city: City) => void;
}

export function CityCard({ city, onAddToTrip }: CityCardProps) {
  const getCostBadge = (cost: number | null) => {
    if (cost === null || cost === undefined) return "$$ Mid-range";
    if (cost <= 2) return "$ Budget";
    if (cost === 3) return "$$ Mid-range";
    return "$$$ Luxury";
  };

  return (
    <div
      className="card"
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#ffffff",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-sm)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      <div>
        {/* Thumbnail photo */}
        <div
          style={{
            height: "140px",
            borderRadius: "var(--radius-sm)",
            backgroundImage: city.imageUrl
              ? `url(${city.imageUrl})`
              : "linear-gradient(135deg, var(--color-accent-soft), var(--color-gold-soft))",
            backgroundSize: "cover",
            backgroundPosition: "center",
            marginBottom: "14px",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "rgba(36, 53, 46, 0.85)",
              color: "#ffffff",
              fontSize: "0.72rem",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "10px",
              textTransform: "uppercase",
            }}
          >
            {city.countryCode || "INTL"}
          </span>
        </div>

        <h3 style={{ fontSize: "1.2rem", margin: "0 0 4px 0", color: "var(--color-text)" }}>
          {city.name}
        </h3>
        <p className="text-muted" style={{ fontSize: "0.88rem", marginBottom: "12px" }}>
          {city.country} {city.region && `• ${city.region}`}
        </p>

        {city.description && (
          <p
            style={{
              fontSize: "0.85rem",
              lineHeight: 1.45,
              color: "var(--color-text-muted)",
              marginBottom: "14px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {city.description}
          </p>
        )}

        {/* Badges */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
          <span
            className="badge"
            style={{
              background: "var(--color-surface-alt)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              fontSize: "0.76rem",
              fontWeight: 600,
            }}
          >
            {getCostBadge(city.costIndex)}
          </span>

          <span
            className="badge"
            style={{
              background: "var(--color-gold-soft)",
              color: "#8a5a16",
              border: "1px solid rgba(217, 164, 65, 0.3)",
              fontSize: "0.76rem",
              fontWeight: 600,
            }}
          >
            ⭐ {city.popularityScore}/100
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onAddToTrip(city)}
        className="btn btn-primary"
        style={{
          width: "100%",
          padding: "8px 14px",
          fontSize: "0.88rem",
          fontWeight: 600,
        }}
      >
        + Add to Trip
      </button>
    </div>
  );
}
