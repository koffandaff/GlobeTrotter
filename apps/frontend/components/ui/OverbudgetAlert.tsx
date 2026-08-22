import React from "react";

interface OverbudgetAlertProps {
  day: number;
  cityName: string;
  total: number;
  limit: number;
}

export function OverbudgetAlert({ day, cityName, total, limit }: OverbudgetAlertProps) {
  const overage = total - limit;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
        background: "var(--color-surface)",
        border: "1px solid var(--color-danger)",
        borderLeft: "4px solid var(--color-danger)",
        borderRadius: "var(--radius-sm)",
        marginBottom: "12px",
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span style={{ fontWeight: 600 }}>Day {day}</span>
          <span className="text-muted" style={{ fontSize: "0.9rem" }}>in {cityName}</span>
        </div>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-danger)" }}>
          Exceeded daily limit by ${overage.toLocaleString()}
        </p>
      </div>
      
      <div style={{ textAlign: "right" }}>
        <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>${total.toLocaleString()}</div>
        <div className="text-muted" style={{ fontSize: "0.85rem" }}>Limit: ${limit.toLocaleString()}</div>
      </div>
    </div>
  );
}
