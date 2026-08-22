"use client";

import React from "react";
import type { CalendarDayInfo, CalendarTrip } from "../types";

interface CalendarGridProps {
  days: CalendarDayInfo[];
  onSelectDay: (day: CalendarDayInfo) => void;
}

const WEEKDAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const THEME_STYLES: Record<string, { bg: string; text: string; border: string; barBg: string }> = {
  teal: {
    bg: "var(--color-accent-soft)",
    barBg: "var(--color-accent)",
    text: "var(--color-accent-dark)",
    border: "var(--color-accent)",
  },
  gold: {
    bg: "var(--color-gold-soft)",
    barBg: "var(--color-gold)",
    text: "#8a5a16",
    border: "var(--color-gold)",
  },
  rust: {
    bg: "rgba(181, 83, 60, 0.12)",
    barBg: "var(--color-danger)",
    text: "#782b19",
    border: "var(--color-danger)",
  },
  forest: {
    bg: "rgba(36, 53, 46, 0.08)",
    barBg: "var(--color-text)",
    text: "var(--color-text)",
    border: "var(--color-text)",
  },
  sage: {
    bg: "var(--color-surface-alt)",
    barBg: "var(--color-accent-dark)",
    text: "var(--color-text)",
    border: "var(--color-border)",
  },
};

export function CalendarGrid({ days, onSelectDay }: CalendarGridProps) {
  return (
    <div
      className="card calendar-container"
      style={{
        maxWidth: "960px",
        width: "100%",
        margin: "0 auto",
        background: "#ffffff",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-md)",
        border: "1px solid var(--color-border)",
        overflow: "hidden",
        padding: 0,
        boxSizing: "border-box",
      }}
    >
      {/* Weekday Headers (Strict 7 equal-width columns) */}
      <div
        className="calendar-weekdays-row"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          width: "100%",
          background: "var(--color-surface-alt)",
          borderBottom: "1px solid var(--color-border)",
          boxSizing: "border-box",
        }}
      >
        {WEEKDAY_NAMES.map((weekday) => (
          <div
            key={weekday}
            style={{
              padding: "14px 4px",
              textAlign: "center",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              color: "var(--color-text)",
              borderRight: "1px solid var(--color-border)",
              boxSizing: "border-box",
            }}
          >
            {weekday}
          </div>
        ))}
      </div>

      {/* Days Grid (Strict 7 equal-width columns & uniform row heights) */}
      <div
        className="calendar-days-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          width: "100%",
          background: "var(--color-border)",
          gap: "1px",
          boxSizing: "border-box",
        }}
      >
        {days.map((day, idx) => {
          const hasTrips = day.trips.length > 0;
          const primaryTrip = day.trips[0] as CalendarTrip | undefined;
          const theme = primaryTrip?.colorTheme
            ? THEME_STYLES[primaryTrip.colorTheme] || THEME_STYLES.teal
            : null;

          const dayOfWeekIndex = idx % 7; // 0 = SUN, 6 = SAT

          return (
            <button
              key={`${day.dateString}-${idx}`}
              type="button"
              onClick={() => onSelectDay(day)}
              aria-label={`Date ${day.dateString}, ${
                day.trips.length > 0 ? `${day.trips.map((t) => t.name).join(", ")}` : "No scheduled trips"
              }. Click to show description.`}
              className="calendar-day-cell"
              style={{
                width: "100%",
                height: "125px",
                minHeight: "125px",
                maxHeight: "125px",
                boxSizing: "border-box",
                background: hasTrips && theme ? theme.bg : day.isCurrentMonth ? "#ffffff" : "var(--color-surface)",
                padding: "8px 10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "space-between",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.15s ease, filter 0.15s ease",
                opacity: day.isCurrentMonth ? 1 : 0.4,
                overflow: "hidden",
              }}
            >
              {/* Day Top Row: Number on Top-Left + Activity Count Pill on Right */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  height: "28px",
                }}
              >
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: day.isToday ? 800 : 600,
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    background: day.isToday ? "var(--color-accent)" : "transparent",
                    color: day.isToday ? "#ffffff" : "var(--color-text)",
                  }}
                >
                  {day.dayNumber}
                </span>

                {day.activities.length > 0 && (
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      background: "rgba(255, 255, 255, 0.95)",
                      color: "var(--color-accent-dark)",
                      padding: "2px 6px",
                      borderRadius: "10px",
                      border: "1px solid var(--color-border)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {day.activities.length} act
                  </span>
                )}
              </div>

              {/* Trip Highlight Banners (Solid color banners with white text) */}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  margin: "auto 0 4px 0",
                }}
              >
                {day.trips.map((trip) => {
                  const isStart = trip.startDate === day.dateString;
                  const isEnd = trip.endDate === day.dateString;
                  const isFirstCellInRow = dayOfWeekIndex === 0;
                  const showTitle = isStart || isFirstCellInRow;

                  const tripTheme = trip.colorTheme
                    ? THEME_STYLES[trip.colorTheme] || THEME_STYLES.teal
                    : THEME_STYLES.teal;

                  return (
                    <div
                      key={trip.id}
                      style={{
                        width: "100%",
                        height: "24px",
                        padding: "0 6px",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        background: tripTheme.barBg,
                        color: "#ffffff",
                        borderRadius:
                          isStart && isEnd
                            ? "4px"
                            : isStart
                            ? "4px 0 0 4px"
                            : isEnd
                            ? "0 4px 4px 0"
                            : "0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        boxSizing: "border-box",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
                      }}
                      title={`${trip.name} (${trip.startDate} to ${trip.endDate})`}
                    >
                      {showTitle ? trip.name : " "}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Click Hint */}
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "var(--color-text-muted)",
                  width: "100%",
                  height: "14px",
                  lineHeight: "14px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {hasTrips ? "Click to view ›" : ""}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
