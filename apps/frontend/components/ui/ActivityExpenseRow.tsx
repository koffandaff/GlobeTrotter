import React from "react";
import { Activity } from "@/data/data";

interface ActivityExpenseRowProps {
  activity: Activity;
}

export function ActivityExpenseRow({ activity }: ActivityExpenseRowProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        marginBottom: "8px",
      }}
    >
      <div style={{ flex: "1 1 auto" }}>
        <h4 style={{ margin: 0 }}>{activity.name}</h4>
        <span className="text-muted" style={{ fontSize: "0.85rem" }}>
          {activity.type} {activity.duration ? `• ${activity.duration}` : ""}
        </span>
      </div>
      
      <div style={{ fontWeight: 600, color: "var(--color-text)" }}>
        {activity.cost !== undefined ? `$${activity.cost}` : "-"}
      </div>
    </div>
  );
}
