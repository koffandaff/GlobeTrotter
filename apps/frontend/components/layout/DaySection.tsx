import React from "react";
import { Activity } from "@/data/data";
import { ActivityExpenseRow } from "@/components/ui/ActivityExpenseRow";
import { EmptyState } from "@/components/shared/EmptyState";

interface DaySectionProps {
  dayNumber: number | string;
  cityName: string;
  activities: Activity[];
}

export function DaySection({ dayNumber, cityName, activities }: DaySectionProps) {
  return (
    <div style={{ marginBottom: "32px", position: "relative" }}>
      {/* Visual connector line for the timeline effect */}
      <div
        style={{
          position: "absolute",
          left: "24px",
          top: "40px",
          bottom: "-32px",
          width: "2px",
          background: "var(--color-border)",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "var(--color-primary)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: "1.2rem",
            }}
          >
            {typeof dayNumber === "number" ? `D${dayNumber}` : dayNumber}
          </div>
          <span className="badge" style={{ background: "var(--color-surface-alt)", color: "var(--color-text)", border: "1px solid var(--color-border)", fontSize: "0.95rem", padding: "6px 12px" }}>
            {cityName}
          </span>
        </div>

        <div style={{ paddingLeft: "60px" }}>
          {activities.length === 0 ? (
            <EmptyState title="" message="No activities planned for this day yet." />
          ) : (
            activities.map((activity) => (
              <ActivityExpenseRow key={activity.id} activity={activity} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
