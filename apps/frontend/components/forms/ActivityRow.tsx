import React from "react";
import { Activity } from "@/data/data";

interface ActivityRowProps {
  activity: Activity;
  onRemove: () => void;
  onChange: (field: keyof Activity, value: string | number) => void;
}

export function ActivityRow({ activity, onRemove, onChange }: ActivityRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px",
        background: "var(--color-surface-alt)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-sm)",
        marginBottom: "8px",
      }}
    >
      <div style={{ flex: "2 1 auto" }}>
        <input
          type="text"
          value={activity.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Activity name"
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            margin: 0,
            fontSize: "1rem",
            fontWeight: 500,
            width: "100%",
            color: "var(--color-text)",
          }}
        />
      </div>
      <div style={{ flex: "1 1 auto" }}>
        <select
          value={activity.type}
          onChange={(e) => onChange("type", e.target.value)}
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            margin: 0,
            color: "var(--color-text-muted)",
            fontSize: "0.9rem",
          }}
        >
          <option value="Sightseeing">Sightseeing</option>
          <option value="Food">Food</option>
          <option value="Adventure">Adventure</option>
          <option value="Relaxation">Relaxation</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div style={{ flex: "0 0 auto" }}>
        <button
          onClick={onRemove}
          className="btn"
          style={{
            padding: "4px 8px",
            fontSize: "0.85rem",
            color: "var(--color-danger)",
            background: "transparent",
            border: "none",
          }}
          title="Remove Activity"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
