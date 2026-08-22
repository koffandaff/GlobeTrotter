import React from "react";

interface BudgetStatCardProps {
  label: string;
  amount: number;
}

export function BudgetStatCard({ label, amount }: BudgetStatCardProps) {
  return (
    <div className="stat-card card">
      <h3 className="stat-label">{label}</h3>
      <p className="stat-value">${amount.toLocaleString()}</p>
    </div>
  );
}
