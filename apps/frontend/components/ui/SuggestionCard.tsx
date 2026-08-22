import React from "react";
import { TripSuggestion } from "@/data/data";

interface SuggestionCardProps {
  suggestion: TripSuggestion;
}

export function SuggestionCard({ suggestion }: SuggestionCardProps) {
  return (
    <div className="trip-card" style={{ padding: "16px", marginBottom: "16px" }}>
      <h4 style={{ margin: "0 0 8px 0" }}>{suggestion.name}</h4>
      <p className="text-muted" style={{ margin: 0, fontSize: "0.9rem" }}>
        {suggestion.description}
      </p>
    </div>
  );
}
