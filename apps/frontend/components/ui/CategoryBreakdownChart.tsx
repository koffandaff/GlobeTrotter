import React from "react";

interface CategoryTotal {
  category: string;
  label: string;
  total: number;
}

interface CategoryBreakdownChartProps {
  categoryTotals: CategoryTotal[];
}

export function CategoryBreakdownChart({ categoryTotals }: CategoryBreakdownChartProps) {
  // Simple CSS bar chart for now — swap for a real charting library (e.g. Recharts) later once one is added to the project.
  const maxTotal = Math.max(...categoryTotals.map((c) => c.total), 1); // Avoid division by zero

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {categoryTotals.map((cat) => {
        const percentage = Math.round((cat.total / maxTotal) * 100);
        return (
          <div key={cat.category}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.95rem" }}>
              <span style={{ fontWeight: 500 }}>{cat.label}</span>
              <span className="text-muted">${cat.total.toLocaleString()}</span>
            </div>
            <div style={{ width: "100%", height: "12px", background: "var(--color-surface-alt)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
              <div
                style={{
                  width: `${percentage}%`,
                  height: "100%",
                  background: cat.category === "activities" ? "var(--color-gold, #f1c40f)" : "var(--color-accent, #3498db)",
                  transition: "width 0.3s ease",
                  borderRadius: "var(--radius-sm)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
