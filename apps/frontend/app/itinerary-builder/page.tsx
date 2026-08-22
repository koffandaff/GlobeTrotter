"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ItineraryStop, Activity, itineraryStops } from "@/data/data";
import { StopCard } from "@/components/forms/StopCard";

export default function ItineraryBuilderPage() {
  const [stops, setStops] = useState<ItineraryStop[]>(itineraryStops);

  // Add a new empty stop
  const handleAddStop = () => {
    const newStop: ItineraryStop = {
      id: `stop-${Date.now()}`,
      city: "",
      startDate: "",
      endDate: "",
      activities: [],
    };
    setStops((prev) => [...prev, newStop]);
  };

  // Remove a stop completely
  const handleRemoveStop = (stopId: string) => {
    setStops((prev) => prev.filter((stop) => stop.id !== stopId));
  };

  // Update a top-level field on a stop (e.g., city, startDate, endDate)
  const handleChangeStop = (stopId: string, field: keyof ItineraryStop, value: string) => {
    setStops((prev) =>
      prev.map((stop) => (stop.id === stopId ? { ...stop, [field]: value } : stop))
    );
  };

  // Add a blank activity to a specific stop
  const handleAddActivity = (stopId: string) => {
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      name: "New activity",
      type: "Sightseeing",
    };
    
    setStops((prev) =>
      prev.map((stop) =>
        stop.id === stopId
          ? { ...stop, activities: [...stop.activities, newActivity] }
          : stop
      )
    );
  };

  // Remove an activity from a specific stop
  const handleRemoveActivity = (stopId: string, activityId: string) => {
    setStops((prev) =>
      prev.map((stop) =>
        stop.id === stopId
          ? {
              ...stop,
              activities: stop.activities.filter((act) => act.id !== activityId),
            }
          : stop
      )
    );
  };

  // Update a field on a specific activity inside a specific stop
  const handleChangeActivity = (
    stopId: string,
    activityId: string,
    field: keyof Activity,
    value: string | number
  ) => {
    setStops((prev) =>
      prev.map((stop) => {
        if (stop.id !== stopId) return stop;
        
        return {
          ...stop,
          activities: stop.activities.map((act) =>
            act.id === activityId ? { ...act, [field]: value } : act
          ),
        };
      })
    );
  };

  return (
    <main className="page-main" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="page-header">
        <h1>Itinerary Builder</h1>
        <p>Plan out your trip day by day. Add stops, activities, and timings below.</p>
      </div>

      <div style={{ marginBottom: "32px" }}>
        {stops.length === 0 ? (
          <div className="empty-state">
            <h3>No stops added</h3>
            <p>You haven't added any destinations to your itinerary yet.</p>
          </div>
        ) : (
          stops.map((stop, index) => (
            <StopCard
              key={stop.id}
              stop={stop}
              index={index}
              onRemove={() => handleRemoveStop(stop.id)}
              onChange={(field, value) => handleChangeStop(stop.id, field, value)}
              onAddActivity={() => handleAddActivity(stop.id)}
              onRemoveActivity={(activityId) => handleRemoveActivity(stop.id, activityId)}
              onChangeActivity={(activityId, field, value) =>
                handleChangeActivity(stop.id, activityId, field, value)
              }
            />
          ))
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={handleAddStop} className="btn" style={{ background: "var(--color-surface-alt)", border: "1px solid var(--color-border)" }}>
          + Add another stop
        </button>

        <Link href="/itinerary-view" className="btn btn-primary">
          Review itinerary
        </Link>
      </div>
    </main>
  );
}
