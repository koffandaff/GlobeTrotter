"use client";

import React from "react";
import type { FilterStatus, GroupByOption, SortOption } from "../types";

interface CalendarControlsProps {
  currentDate: Date;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedFilter: FilterStatus;
  onFilterChange: (val: FilterStatus) => void;
  selectedGroupBy: GroupByOption;
  onGroupByChange: (val: GroupByOption) => void;
  selectedSort: SortOption;
  onSortChange: (val: SortOption) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function CalendarControls({
  currentDate,
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  selectedGroupBy,
  onGroupByChange,
  selectedSort,
  onSortChange,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarControlsProps) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  return (
    <div className="calendar-controls-wrapper" style={{ maxWidth: "960px", margin: "0 auto 24px auto" }}>
      {/* Top Search & Filter Bar (Matching Mockup Wireframe) */}
      <div
        className="calendar-top-bar"
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "24px",
          padding: "12px 16px",
          background: "var(--color-surface)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div style={{ flex: "1 1 240px", position: "relative" }}>
          <input
            type="text"
            placeholder="Search trips, cities, or activities..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              background: "#ffffff",
              fontSize: "0.92rem",
              color: "var(--color-text)",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <select
              value={selectedGroupBy}
              onChange={(e) => onGroupByChange(e.target.value as GroupByOption)}
              style={{
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                background: "#ffffff",
                fontSize: "0.88rem",
                fontWeight: 500,
                color: "var(--color-text)",
                cursor: "pointer",
              }}
            >
              <option value="NONE">Group by: None</option>
              <option value="STATUS">Group by: Status</option>
              <option value="CITY">Group by: Destination</option>
            </select>
          </div>

          <div style={{ position: "relative" }}>
            <select
              value={selectedFilter}
              onChange={(e) => onFilterChange(e.target.value as FilterStatus)}
              style={{
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                background: "#ffffff",
                fontSize: "0.88rem",
                fontWeight: 500,
                color: "var(--color-text)",
                cursor: "pointer",
              }}
            >
              <option value="ALL">Filter: All Trips</option>
              <option value="PLANNED">Filter: Planned</option>
              <option value="ONGOING">Filter: Ongoing</option>
              <option value="COMPLETED">Filter: Completed</option>
              <option value="DRAFT">Filter: Draft</option>
            </select>
          </div>

          <div style={{ position: "relative" }}>
            <select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              style={{
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                background: "#ffffff",
                fontSize: "0.88rem",
                fontWeight: 500,
                color: "var(--color-text)",
                cursor: "pointer",
              }}
            >
              <option value="DATE_ASC">Sort by: Earliest</option>
              <option value="DATE_DESC">Sort by: Latest</option>
              <option value="NAME_ASC">Sort by: Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Screen Title & Month Header Navigation */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div
          className="eyebrow"
          style={{
            fontSize: "0.82rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: 700,
            color: "var(--color-accent)",
            marginBottom: "4px",
          }}
        >
          Screen 11
        </div>
        <h1 style={{ margin: "0 0 16px 0", fontSize: "2rem" }}>Calendar View</h1>

        {/* Month Navigator Header (< January 2026 >) */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            background: "#ffffff",
            padding: "8px 24px",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--color-border)",
          }}
        >
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label="Previous month"
            style={{
              background: "none",
              border: "none",
              fontSize: "1.3rem",
              cursor: "pointer",
              padding: "4px 8px",
              color: "var(--color-text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ←
          </button>

          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 600,
              minWidth: "180px",
              color: "var(--color-text)",
            }}
          >
            {currentMonthName} {currentYear}
          </span>

          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Next month"
            style={{
              background: "none",
              border: "none",
              fontSize: "1.3rem",
              cursor: "pointer",
              padding: "4px 8px",
              color: "var(--color-text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            →
          </button>

          <button
            type="button"
            onClick={onToday}
            style={{
              marginLeft: "8px",
              padding: "4px 10px",
              fontSize: "0.8rem",
              fontWeight: 600,
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface-alt)",
              color: "var(--color-accent-dark)",
              cursor: "pointer",
            }}
          >
            Today
          </button>
        </div>
      </div>
    </div>
  );
}
