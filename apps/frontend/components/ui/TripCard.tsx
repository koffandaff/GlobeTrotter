import React from "react";
import { Trip } from "@/data/data";

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  const statusColor =
    trip.status === "completed"
      ? "badge badge-gold"
      : trip.status === "upcoming"
        ? "badge"
        : "badge";

  return (
    <div className="trip-card">
      <div className="thumb"></div>
      <h3>{trip.name}</h3>
      <p className="text-muted" style={{ marginBottom: "16px" }}>
        {trip.destination}
      </p>
      <div className="flex justify-between items-center mt-4">
        <span className={statusColor} style={{ textTransform: "capitalize" }}>
          {trip.status}
        </span>
        <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
          ${trip.budget?.toLocaleString() || 0}
        </span>
      </div>
    </div>
  );
}
