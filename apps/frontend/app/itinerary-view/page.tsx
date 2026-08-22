"use client";

import React, { useState, useMemo } from "react";
import { itineraryStops } from "@/data/data";
import { Toolbar } from "@/components/shared/Toolbar";
import { DaySection } from "@/components/layout/DaySection";
import { EmptyState } from "@/components/shared/EmptyState";

export default function ItineraryViewPage() {
  const [searchValue, setSearchValue] = useState("");
  const [groupBy, setGroupBy] = useState("day");
  const [viewMode, setViewMode] = useState<"List" | "Calendar">("List");

  const groupByOptions = [
    { label: "Day", value: "day" },
    { label: "City", value: "city" },
  ];

  // Flatten all activities across all stops, injecting the city name so we can group by it
  const flattenedActivities = useMemo(() => {
    return itineraryStops.flatMap((stop) =>
      stop.activities.map((act) => ({
        ...act,
        city: stop.city,
      }))
    );
  }, []);

  // Filter and group
  const groupedSections = useMemo(() => {
    // 1. Filter
    let filtered = flattenedActivities;
    if (searchValue.trim()) {
      const lower = searchValue.toLowerCase();
      filtered = filtered.filter((a) => a.name.toLowerCase().includes(lower));
    }

    // 2. Group
    if (groupBy === "day") {
      // Group by day number
      const daysMap = new Map<number, typeof filtered>();
      
      // Initialize map with all days that exist in the original data to preserve order
      flattenedActivities.forEach((a) => {
        if (!daysMap.has(a.day)) daysMap.set(a.day, []);
      });

      // Populate with filtered activities
      filtered.forEach((a) => {
        daysMap.get(a.day)?.push(a);
      });

      // Convert to array sorted by day
      return Array.from(daysMap.entries())
        .sort(([dayA], [dayB]) => dayA - dayB)
        .map(([day, acts]) => {
          // Find the city for this day (assume activities on the same day are usually in the same city)
          // If the day is completely empty due to filtering, use original un-filtered array to find city
          const representativeAct = acts.length > 0 
            ? acts[0] 
            : flattenedActivities.find((a) => a.day === day);
            
          return {
            id: `day-${day}`,
            badge: day,
            title: representativeAct?.city || "Unknown City",
            activities: acts,
          };
        });
    } else {
      // Group by city name
      const cityMap = new Map<string, typeof filtered>();
      
      flattenedActivities.forEach((a) => {
        if (!cityMap.has(a.city)) cityMap.set(a.city, []);
      });

      filtered.forEach((a) => {
        cityMap.get(a.city)?.push(a);
      });

      return Array.from(cityMap.entries()).map(([city, acts]) => ({
        id: `city-${city}`,
        badge: "📍",
        title: city,
        activities: acts.sort((a, b) => a.day - b.day), // sort activities inside the city by day
      }));
    }
  }, [flattenedActivities, searchValue, groupBy]);

  return (
    <main className="page-main" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1>Itinerary View</h1>
          <p>Your complete trip plan, expenses, and schedule.</p>
        </div>
        
        {/* View Toggle */}
        <div style={{ display: "flex", background: "var(--color-surface-alt)", padding: "4px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
          <button
            onClick={() => setViewMode("List")}
            className="btn"
            style={{
              background: viewMode === "List" ? "var(--color-surface)" : "transparent",
              border: viewMode === "List" ? "1px solid var(--color-border)" : "none",
              color: viewMode === "List" ? "var(--color-text)" : "var(--color-text-muted)",
              padding: "6px 16px",
              boxShadow: viewMode === "List" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}
          >
            List
          </button>
          <button
            onClick={() => setViewMode("Calendar")}
            className="btn"
            style={{
              background: viewMode === "Calendar" ? "var(--color-surface)" : "transparent",
              border: viewMode === "Calendar" ? "1px solid var(--color-border)" : "none",
              color: viewMode === "Calendar" ? "var(--color-text)" : "var(--color-text-muted)",
              padding: "6px 16px",
              boxShadow: viewMode === "Calendar" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}
          >
            Calendar
          </button>
        </div>
      </div>

      <Toolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterStatus="all"
        onFilterStatusChange={() => {}} // Not used here
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        groupByOptions={groupByOptions}
        sortBy="none"
        onSortByChange={() => {}} // Not used here
      />

      <div style={{ marginTop: "32px", paddingLeft: "16px" }}>
        {viewMode === "Calendar" ? (
          <div className="card" style={{ padding: "48px", textAlign: "center" }}>
            <h3 style={{ marginBottom: "8px" }}>Calendar view coming soon</h3>
            <p className="text-muted">For now, please use the List view to see your itinerary.</p>
          </div>
        ) : (
          groupedSections.length === 0 ? (
            <EmptyState title="No itinerary data" message="It looks like you haven't built an itinerary yet." />
          ) : (
            groupedSections.map((section) => (
              <DaySection
                key={section.id}
                dayNumber={section.badge}
                cityName={section.title}
                activities={section.activities}
              />
            ))
          )
        )}
      </div>
    </main>
  );
}
