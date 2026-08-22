import React from "react";

interface SavedDestinationChipProps {
  name: string;
}

export function SavedDestinationChip({ name }: SavedDestinationChipProps) {
  return (
    <span className="badge" style={{ fontSize: "0.95rem", padding: "6px 12px", background: "var(--color-surface-alt)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}>
      {name}
    </span>
  );
}
