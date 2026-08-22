"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useBudget } from "../hooks/useBudget";
import { CategoryAllocationModal } from "./CategoryAllocationModal";

interface BudgetViewProps {
  initialTripId?: string;
}

export function BudgetView({ initialTripId }: BudgetViewProps) {
  const {
    tripId,
    setTripId,
    availableTrips,
    budgetData,
    isLoading,
    error,
    updateCategory,
  } = useBudget(initialTripId);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const categoriesList = budgetData ? Object.values(budgetData.categories) : [];

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
      {/* Header & Trip Selector */}
      <div
        className="card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "28px",
          padding: "20px 24px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div>
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
            Financial Overview
          </div>
          <h1 style={{ margin: "0 0 4px 0", fontSize: "1.8rem" }}>Budget & Cost Breakdown</h1>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-text-muted)" }}>
            Tracking financial allocations and activity expenses for {budgetData?.tripName || "Trip"}.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <select
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}
            disabled={availableTrips.length === 0}
            style={{
              padding: "8px 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              background: "#ffffff",
              fontWeight: 600,
              fontSize: "0.88rem",
              cursor: availableTrips.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            {availableTrips.length === 0 ? (
              <option value="">No trips available</option>
            ) : (
              availableTrips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))
            )}
          </select>

          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="btn btn-outline"
            style={{ padding: "8px 16px", fontSize: "0.88rem" }}
          >
            ✏️ Set Limits
          </button>
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
            marginBottom: "24px",
          }}
        >
          {error}
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <div className="spinner" style={{ margin: "0 auto 16px" }} />
          <p>Loading financial breakdown...</p>
        </div>
      ) : availableTrips.length === 0 || !budgetData ? (
        <div className="empty-state" style={{ marginTop: "40px" }}>
          <h3>No budget data available</h3>
          <p>You haven't created any trips or selected a valid trip.</p>
          <Link href="/create-trip" className="btn btn-primary" style={{ marginTop: "16px" }}>
            Plan a Trip
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Top 4 Summary Stat Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            {/* Total Budget */}
            <div
              className="card"
              style={{
                padding: "20px",
                background: "#ffffff",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Total Budget
              </span>
              <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--color-text)", margin: "4px 0" }}>
                {budgetData.currency} {budgetData.totalBudget ? budgetData.totalBudget.toLocaleString() : "Not set"}
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                Allocated across categories
              </span>
            </div>

            {/* Total Spent */}
            <div
              className="card"
              style={{
                padding: "20px",
                background: "#ffffff",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Total Spent
              </span>
              <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--color-accent)", margin: "4px 0" }}>
                {budgetData.currency} {budgetData.totalSpent.toLocaleString()}
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                From scheduled activities
              </span>
            </div>

            {/* Remaining Balance */}
            <div
              className="card"
              style={{
                padding: "20px",
                background: "#ffffff",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Remaining Balance
              </span>
              <div
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: (budgetData.remainingBudget ?? 0) < 0 ? "var(--color-danger)" : "var(--color-accent-dark)",
                  margin: "4px 0",
                }}
              >
                {budgetData.currency} {budgetData.remainingBudget !== null ? budgetData.remainingBudget.toLocaleString() : "—"}
              </div>
              <span style={{ fontSize: "0.8rem", color: (budgetData.remainingBudget ?? 0) < 0 ? "var(--color-danger)" : "var(--color-text-muted)" }}>
                {(budgetData.remainingBudget ?? 0) < 0 ? "⚠️ Over budget limit" : "✓ Within target budget"}
              </span>
            </div>

            {/* Daily Average */}
            <div
              className="card"
              style={{
                padding: "20px",
                background: "#ffffff",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Avg. Spend / Day
              </span>
              <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--color-gold)", margin: "4px 0" }}>
                {budgetData.currency} {Math.round(budgetData.perDayAverage).toLocaleString()}
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                Over {budgetData.durationDays} days duration
              </span>
            </div>
          </div>

          {/* Cost Breakdown Progress Bars & Alerts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {/* Category Breakdown Progress */}
            <div
              className="card"
              style={{
                padding: "24px",
                background: "#ffffff",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Category Allocations</h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-accent)",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {categoriesList.map((cat) => {
                  const percentOfAllocated = cat.allocated ? Math.min(100, Math.round((cat.spent / cat.allocated) * 100)) : 0;
                  const isOver = cat.allocated ? cat.spent > cat.allocated : false;

                  return (
                    <div key={cat.category}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.9rem" }}>
                        <span style={{ fontWeight: 600 }}>{cat.label}</span>
                        <span>
                          <strong>{budgetData.currency} {cat.spent.toLocaleString()}</strong>
                          {cat.allocated && (
                            <span style={{ color: "var(--color-text-muted)" }}> / {cat.allocated.toLocaleString()}</span>
                          )}
                        </span>
                      </div>

                      <div
                        style={{
                          width: "100%",
                          height: "10px",
                          background: "var(--color-surface-alt)",
                          borderRadius: "var(--radius-sm)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${cat.allocated ? percentOfAllocated : cat.percentageOfTotal}%`,
                            height: "100%",
                            background: isOver
                              ? "var(--color-danger)"
                              : cat.category === "activities"
                              ? "var(--color-gold)"
                              : "var(--color-accent)",
                            borderRadius: "var(--radius-sm)",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>

                      {isOver && (
                        <span style={{ fontSize: "0.76rem", color: "var(--color-danger)", fontWeight: 600, marginTop: "2px", display: "block" }}>
                          ⚠️ Exceeded allocation by {budgetData.currency} {(cat.spent - (cat.allocated || 0)).toLocaleString()}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Overbudget Alerts & Insights */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div
                className="card"
                style={{
                  padding: "24px",
                  background: "#ffffff",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <h3 style={{ margin: "0 0 16px 0", fontSize: "1.2rem" }}>Budget Alerts</h3>

                {budgetData.alerts.length === 0 ? (
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      background: "var(--color-surface)",
                      borderRadius: "var(--radius-sm)",
                      color: "var(--color-accent-dark)",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    ✓ All expenses are within your target budgets!
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {budgetData.alerts.map((alert, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "12px 16px",
                          background: "rgba(181, 83, 60, 0.08)",
                          borderLeft: "4px solid var(--color-danger)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.88rem",
                          color: "var(--color-danger)",
                          lineHeight: 1.4,
                        }}
                      >
                        ⚠️ {alert.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Action Card */}
              <div
                className="card"
                style={{
                  padding: "20px 24px",
                  background: "var(--color-surface-alt)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h4 style={{ margin: "0 0 4px 0", fontSize: "1rem" }}>Review Activities Schedule</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                    Add or modify items to optimize your travel expenses.
                  </p>
                </div>
                <Link
                  href={`/itinerary-view?tripId=${tripId}`}
                  className="btn btn-primary"
                  style={{ padding: "8px 16px", fontSize: "0.85rem", textDecoration: "none" }}
                >
                  Open Itinerary →
                </Link>
              </div>
            </div>
          </div>

          {/* Daily Expenses Breakdown Table / Timeline */}
          {budgetData.dailyExpenses.length > 0 && (
            <div
              className="card"
              style={{
                padding: "24px",
                background: "#ffffff",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
              }}
            >
              <h3 style={{ margin: "0 0 16px 0", fontSize: "1.2rem" }}>Daily Expense Breakdown</h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "12px" }}>
                {budgetData.dailyExpenses.map((day) => (
                  <div
                    key={day.date}
                    style={{
                      padding: "12px",
                      borderRadius: "var(--radius-sm)",
                      background: day.isOverDailyAverage ? "rgba(181, 83, 60, 0.08)" : "var(--color-surface)",
                      border: day.isOverDailyAverage ? "1px solid var(--color-danger)" : "1px solid var(--color-border)",
                      textAlign: "center",
                    }}
                  >
                    <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", display: "block" }}>
                      {day.date}
                    </span>
                    <strong style={{ fontSize: "1.1rem", color: day.isOverDailyAverage ? "var(--color-danger)" : "var(--color-text)", display: "block", margin: "4px 0" }}>
                      {budgetData.currency} {day.amount.toLocaleString()}
                    </strong>
                    {day.isOverDailyAverage && (
                      <span style={{ fontSize: "0.72rem", color: "var(--color-danger)", fontWeight: 700 }}>
                        Over Avg.
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Category Allocations Modal */}
      <CategoryAllocationModal
        isOpen={isEditModalOpen}
        budgetData={budgetData}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateCategory={updateCategory}
      />
    </div>
  );
}
