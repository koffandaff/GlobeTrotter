"use client";

import React, { useState } from "react";
import { useCities } from "../hooks/useCities";
import { CityCard } from "./CityCard";
import { AddToTripModal } from "./AddToTripModal";
import type { City, CostCategory } from "../types";

export function CitySearch() {
  const {
    cities,
    total,
    isLoading,
    error,
    search,
    setSearch,
    region,
    setRegion,
    costCategory,
    setCostCategory,
    sortBy,
    setSortBy,
  } = useCities();

  const [selectedCityForTrip, setSelectedCityForTrip] = useState<City | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleTripAdded = (cityName: string, tripName: string) => {
    setToastMessage(`Added ${cityName} to ${tripName}!`);
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
          marginBottom: "28px",
          padding: "14px 18px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div style={{ flex: "1 1 240px" }}>
          <input
            type="text"
            placeholder="Search worldwide cities (e.g. Paris, Tokyo, Florence)..."
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
            value={region}
            onChange={(e) => setRegion(e.target.value)}
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
            <option value="all">All Regions</option>
            <option value="Europe">Europe</option>
            <option value="Asia">Asia</option>
            <option value="Americas">Americas</option>
            <option value="Africa">Africa</option>
            <option value="Oceania">Oceania</option>
          </select>

          <select
            value={costCategory}
            onChange={(e) => setCostCategory(e.target.value as CostCategory)}
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
            <option value="ALL">All Budgets</option>
            <option value="BUDGET">Budget ($)</option>
            <option value="MID_RANGE">Mid-range ($$)</option>
            <option value="LUXURY">Luxury ($$$)</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "POPULARITY" | "COST_ASC" | "COST_DESC" | "NAME")}
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
            <option value="COST_ASC">Sort: Cost (Low to High)</option>
            <option value="COST_DESC">Sort: Cost (High to Low)</option>
            <option value="NAME">Sort: Name (A-Z)</option>
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

      {/* Grid Content */}
      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="card"
              style={{ height: "300px", background: "var(--color-surface)", opacity: 0.6 }}
            >
              <div style={{ height: "140px", background: "var(--color-surface-alt)", borderRadius: "var(--radius-sm)", marginBottom: "12px" }} />
              <div style={{ height: "20px", background: "var(--color-border)", borderRadius: "4px", marginBottom: "8px" }} />
              <div style={{ height: "14px", width: "50%", background: "var(--color-border)", borderRadius: "4px" }} />
            </div>
          ))}
        </div>
      ) : cities.length === 0 ? (
        <div
          className="card"
          style={{
            padding: "48px",
            textAlign: "center",
            background: "#ffffff",
            border: "1px dashed var(--color-border)",
          }}
        >
          <h3 style={{ fontSize: "1.25rem", marginBottom: "8px" }}>No destinations found</h3>
          <p style={{ color: "var(--color-text-muted)" }}>
            Try searching for another city or adjusting your region & budget filters.
          </p>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "0.88rem", color: "var(--color-text-muted)" }}>
              Showing {cities.length} {cities.length === 1 ? "destination" : "destinations"}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {cities.map((city) => (
              <CityCard
                key={city.id}
                city={city}
                onAddToTrip={(c) => setSelectedCityForTrip(c)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add To Trip Modal */}
      <AddToTripModal
        isOpen={!!selectedCityForTrip}
        city={selectedCityForTrip}
        onClose={() => setSelectedCityForTrip(null)}
        onSuccess={handleTripAdded}
      />
    </div>
  );
}
