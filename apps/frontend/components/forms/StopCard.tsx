import React from "react";
import { FormField } from "./FormField";
import { ActivityRow } from "./ActivityRow";
import { ItineraryStop, Activity } from "@/data/data";

interface StopCardProps {
  stop: ItineraryStop;
  index: number;
  onRemove: () => void;
  onChange: (field: keyof ItineraryStop, value: string) => void;
  onAddActivity: () => void;
  onRemoveActivity: (activityId: string) => void;
  onChangeActivity: (activityId: string, field: keyof Activity, value: string | number) => void;
}

export function StopCard({
  stop,
  index,
  onRemove,
  onChange,
  onAddActivity,
  onRemoveActivity,
  onChangeActivity,
}: StopCardProps) {
  return (
    <div className="card" style={{ padding: "24px", marginBottom: "24px", position: "relative" }}>
      <button
        onClick={onRemove}
        className="btn"
        style={{
          position: "absolute",
          top: "24px",
          right: "24px",
          color: "var(--color-danger)",
          background: "transparent",
          padding: 0,
        }}
        title="Remove Stop"
      >
        Remove
      </button>

      <h3 style={{ marginBottom: "16px" }}>Stop {index + 1}</h3>

      <div style={{ marginBottom: "24px" }}>
        <FormField
          label="City / Destination"
          id={`city-${stop.id}`}
          value={stop.city}
          onChange={(e) => onChange("city", e.target.value)}
          placeholder="e.g. Miami, USA"
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <FormField
            label="Start Date"
            id={`start-${stop.id}`}
            type="date"
            value={stop.startDate}
            onChange={(e) => onChange("startDate", e.target.value)}
          />
          <FormField
            label="End Date"
            id={`end-${stop.id}`}
            type="date"
            value={stop.endDate}
            onChange={(e) => onChange("endDate", e.target.value)}
          />
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "24px" }}>
        <h4 style={{ marginBottom: "16px" }}>Activities</h4>
        
        {stop.activities.length === 0 ? (
          <div className="placeholder-box" style={{ marginBottom: "16px" }}>
            <p className="mb-0">No activities added yet.</p>
          </div>
        ) : (
          <div style={{ marginBottom: "16px" }}>
            {stop.activities.map((activity) => (
              <ActivityRow
                key={activity.id}
                activity={activity}
                onRemove={() => onRemoveActivity(activity.id)}
                onChange={(field, value) => onChangeActivity(activity.id, field, value)}
              />
            ))}
          </div>
        )}

        <button onClick={onAddActivity} className="btn" style={{ background: "var(--color-surface-alt)" }}>
          + Add activity
        </button>
      </div>
    </div>
  );
}
