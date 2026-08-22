"use client";

import React, { useState } from "react";
import type { BudgetCategory, TripBudgetBreakdown } from "../types";

interface CategoryAllocationModalProps {
  isOpen: boolean;
  budgetData: TripBudgetBreakdown | null;
  onClose: () => void;
  onUpdateCategory: (cat: BudgetCategory, amount: number | null) => Promise<{ success: boolean; error?: string }>;
}

export function CategoryAllocationModal({
  isOpen,
  budgetData,
  onClose,
  onUpdateCategory,
}: CategoryAllocationModalProps) {
  const [totalBudget, setTotalBudget] = useState<string>(
    budgetData?.totalBudget ? String(budgetData.totalBudget) : ""
  );
  const [transport, setTransport] = useState<string>(
    budgetData?.categories.transport.allocated ? String(budgetData.categories.transport.allocated) : ""
  );
  const [accommodation, setAccommodation] = useState<string>(
    budgetData?.categories.accommodation.allocated
      ? String(budgetData.categories.accommodation.allocated)
      : ""
  );
  const [activities, setActivities] = useState<string>(
    budgetData?.categories.activities.allocated ? String(budgetData.categories.activities.allocated) : ""
  );
  const [food, setFood] = useState<string>(
    budgetData?.categories.food.allocated ? String(budgetData.categories.food.allocated) : ""
  );
  const [other, setOther] = useState<string>(
    budgetData?.categories.other.allocated ? String(budgetData.categories.other.allocated) : ""
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !budgetData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (totalBudget) await onUpdateCategory("total", Number(totalBudget));
      if (transport) await onUpdateCategory("transport", Number(transport));
      if (accommodation) await onUpdateCategory("accommodation", Number(accommodation));
      if (activities) await onUpdateCategory("activities", Number(activities));
      if (food) await onUpdateCategory("food", Number(food));
      if (other) await onUpdateCategory("other", Number(other));

      setIsSubmitting(false);
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      setError(err instanceof Error ? err.message : "Failed to update category allocations.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(36, 53, 46, 0.6)",
          backdropFilter: "blur(3px)",
        }}
      />

      <div
        className="card"
        style={{
          position: "relative",
          zIndex: 10000,
          background: "#ffffff",
          maxWidth: "520px",
          width: "100%",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-md)",
          padding: "28px",
          border: "1px solid var(--color-border)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "1.35rem", margin: 0 }}>Edit Budget Allocations</h2>
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
              {budgetData.tripName} ({budgetData.currency})
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              color: "var(--color-text-muted)",
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(181, 83, 60, 0.1)",
              border: "1px solid var(--color-danger)",
              borderRadius: "var(--radius-sm)",
              color: "var(--color-danger)",
              marginBottom: "16px",
              fontSize: "0.88rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field" style={{ marginBottom: "16px" }}>
            <label htmlFor="totalBudgetInput" style={{ fontWeight: 700, display: "block", marginBottom: "6px" }}>
              Total Trip Budget ({budgetData.currency})
            </label>
            <input
              id="totalBudgetInput"
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              placeholder="e.g. 2500"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-accent)",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "24px" }}>
            <div className="field">
              <label htmlFor="transportInput" style={{ fontWeight: 600, display: "block", marginBottom: "4px" }}>
                🚗 Transportation
              </label>
              <input
                id="transportInput"
                type="number"
                value={transport}
                onChange={(e) => setTransport(e.target.value)}
                placeholder="e.g. 500"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  fontSize: "0.9rem",
                }}
              />
            </div>

            <div className="field">
              <label htmlFor="accommodationInput" style={{ fontWeight: 600, display: "block", marginBottom: "4px" }}>
                🏨 Lodging & Stays
              </label>
              <input
                id="accommodationInput"
                type="number"
                value={accommodation}
                onChange={(e) => setAccommodation(e.target.value)}
                placeholder="e.g. 800"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  fontSize: "0.9rem",
                }}
              />
            </div>

            <div className="field">
              <label htmlFor="activitiesInput" style={{ fontWeight: 600, display: "block", marginBottom: "4px" }}>
                🎟️ Tours & Sightseeing
              </label>
              <input
                id="activitiesInput"
                type="number"
                value={activities}
                onChange={(e) => setActivities(e.target.value)}
                placeholder="e.g. 400"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  fontSize: "0.9rem",
                }}
              />
            </div>

            <div className="field">
              <label htmlFor="foodInput" style={{ fontWeight: 600, display: "block", marginBottom: "4px" }}>
                🍽️ Food & Dining
              </label>
              <input
                id="foodInput"
                type="number"
                value={food}
                onChange={(e) => setFood(e.target.value)}
                placeholder="e.g. 350"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  fontSize: "0.9rem",
                }}
              />
            </div>

            <div className="field" style={{ gridColumn: "span 2" }}>
              <label htmlFor="otherInput" style={{ fontWeight: 600, display: "block", marginBottom: "4px" }}>
                🛍️ Miscellaneous & Shopping
              </label>
              <input
                id="otherInput"
                type="number"
                value={other}
                onChange={(e) => setOther(e.target.value)}
                placeholder="e.g. 150"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  fontSize: "0.9rem",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ padding: "8px 16px" }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ padding: "8px 20px" }}
            >
              {isSubmitting ? "Saving..." : "Save Allocations"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
