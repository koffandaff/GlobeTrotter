import React, { useState } from "react";
import { ActivityOption } from "@/data/data";

interface ActivityResultRowProps {
  activity: ActivityOption;
}

export function ActivityResultRow({ activity }: ActivityResultRowProps) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    // TODO: Replace with real API call
    console.log(`Adding ${activity.name} to trip...`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        padding: "16px",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        marginBottom: "12px",
      }}
    >
      <div style={{ flex: "1 1 auto" }}>
        <h4 style={{ marginBottom: "4px" }}>{activity.name}</h4>
        <p className="text-muted" style={{ fontSize: "0.9rem", margin: 0 }}>
          {activity.city} • {activity.type} • {activity.duration} • ${activity.cost}
        </p>
      </div>

      <button
        onClick={handleAdd}
        className="btn"
        style={
          added
            ? { background: "var(--color-success)", color: "white", borderColor: "var(--color-success)", whiteSpace: "nowrap" }
            : { background: "var(--color-surface-alt)", border: "1px solid var(--color-border)", whiteSpace: "nowrap" }
        }
      >
        {added ? "Added ✓" : "Add"}
      </button>
    </div>
  );
}
