import React from "react";
import { itineraryStops, dailyBudgetLimit } from "@/data/data";
import { BudgetStatCard } from "@/components/ui/BudgetStatCard";
import { CategoryBreakdownChart } from "@/components/ui/CategoryBreakdownChart";
import { OverbudgetAlert } from "@/components/ui/OverbudgetAlert";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  getAllActivities,
  calculateCategoryTotals,
  calculateDailyTotals,
  calculateAverageCostPerDay,
  findOverbudgetDays,
} from "@/lib/budget-utils";

export default function BudgetPage() {
  const allActivities = getAllActivities(itineraryStops);
  const categoryTotals = calculateCategoryTotals(allActivities);
  const dailyTotals = calculateDailyTotals(itineraryStops);
  const averagePerDay = calculateAverageCostPerDay(dailyTotals);
  const overbudgetDays = findOverbudgetDays(dailyTotals, dailyBudgetLimit);

  // Derive total trip cost for context
  const totalCost = categoryTotals.reduce((sum, cat) => sum + cat.total, 0);

  return (
    <main className="page-main" style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div className="page-header" style={{ marginBottom: "32px" }}>
        <h1>Budget & Cost Breakdown</h1>
        <p>Keep track of your expenses and avoid overspending on your trip.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-4" style={{ marginBottom: "32px" }}>
        {categoryTotals.map((cat) => (
          <BudgetStatCard key={cat.category} label={cat.label} amount={cat.total} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
        {/* Left Column: Breakdown Chart */}
        <div className="card" style={{ padding: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "24px" }}>
            <h3 style={{ margin: 0 }}>Cost Breakdown</h3>
            <span style={{ fontWeight: 600, fontSize: "1.2rem", color: "var(--color-primary)" }}>
              Total: ${totalCost.toLocaleString()}
            </span>
          </div>
          
          <CategoryBreakdownChart categoryTotals={categoryTotals} />
        </div>

        {/* Right Column: Averages & Alerts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <div className="card" style={{ padding: "32px", textAlign: "center" }}>
            <h3 style={{ marginBottom: "8px" }}>Average Cost per Day</h3>
            <div style={{ fontSize: "3rem", fontWeight: 700, color: "var(--color-primary)", lineHeight: 1.2 }}>
              ${averagePerDay.toLocaleString()}
            </div>
            <p className="text-muted" style={{ margin: 0 }}>Target Limit: ${dailyBudgetLimit.toLocaleString()}/day</p>
          </div>

          <div className="card" style={{ padding: "32px" }}>
            <h3 style={{ marginBottom: "24px", color: "var(--color-danger)" }}>Overbudget Days</h3>
            
            {overbudgetDays.length === 0 ? (
              <EmptyState title="On Track" message="No overbudget days! You're sticking to your plan perfectly." />
            ) : (
              <div>
                {overbudgetDays.map((dayData) => (
                  <OverbudgetAlert
                    key={dayData.day}
                    day={dayData.day}
                    cityName={dayData.cityName}
                    total={dayData.totalCost}
                    limit={dailyBudgetLimit}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
