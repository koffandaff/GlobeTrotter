import React from "react";
import { Trip } from "@/data/data";
import { TripCard } from "@/components/ui/TripCard";
import { EmptyState } from "@/components/shared/EmptyState";

interface TripListSectionProps {
  title: string;
  trips: Trip[];
  emptyMessage?: string;
}

export function TripListSection({
  title,
  trips,
  emptyMessage = "No trips found in this category.",
}: TripListSectionProps) {
  return (
    <section className="section mt-4">
      <div className="section-title-row">
        <h2>{title}</h2>
        <span className="text-muted" style={{ fontSize: "0.9rem" }}>
          {trips.length} {trips.length === 1 ? "trip" : "trips"}
        </span>
      </div>

      {trips.length === 0 ? (
        <EmptyState title="No trips" message={emptyMessage} />
      ) : (
        <div className="grid grid-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </section>
  );
}
