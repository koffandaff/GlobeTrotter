"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CalendarControls } from "./CalendarControls";
import { CalendarGrid } from "./CalendarGrid";
import { DayDetailModal } from "./DayDetailModal";
import { fetchCalendarTrips } from "../api/calendarApi";
import type {
  CalendarActivity,
  CalendarDayInfo,
  CalendarTrip,
  FilterStatus,
  GroupByOption,
  SortOption,
} from "../types";

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [trips, setTrips] = useState<CalendarTrip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>("ALL");
  const [selectedGroupBy, setSelectedGroupBy] = useState<GroupByOption>("NONE");
  const [selectedSort, setSelectedSort] = useState<SortOption>("DATE_ASC");

  const [selectedDay, setSelectedDay] = useState<CalendarDayInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const loadTrips = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCalendarTrips();
      setTrips(data);
      // Auto-navigate to first upcoming trip if available
      const now = new Date();
      const upcoming = data.find(t => new Date(t.startDate) >= now);
      if (upcoming && upcoming.startDate) {
        setCurrentDate(new Date(upcoming.startDate));
      } else if (data.length > 0 && data[0].startDate) {
        setCurrentDate(new Date(data[0].startDate));
      }
    } catch {
      // Graceful fallback handled in API client
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Filter and sort trips
  const filteredTrips = useMemo(() => {
    return trips
      .filter((trip) => {
        // Status filter
        if (selectedFilter !== "ALL" && trip.status !== selectedFilter) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = trip.name.toLowerCase().includes(query);
          const matchDesc = trip.description?.toLowerCase().includes(query) ?? false;
          const matchCity = trip.cityName?.toLowerCase().includes(query) ?? false;
          const matchAct = trip.activities?.some((a) => a.title.toLowerCase().includes(query)) ?? false;
          if (!matchName && !matchDesc && !matchCity && !matchAct) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (selectedSort === "DATE_ASC") return a.startDate.localeCompare(b.startDate);
        if (selectedSort === "DATE_DESC") return b.startDate.localeCompare(a.startDate);
        if (selectedSort === "NAME_ASC") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [trips, selectedFilter, searchQuery, selectedSort]);

  // Generate 7-column month grid days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startWeekday = firstDayOfMonth.getDay(); // 0 = Sun, 1 = Mon, ...
    const daysInMonth = lastDayOfMonth.getDate();

    const days: CalendarDayInfo[] = [];

    const now = new Date();
    const todayString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")}`;

    // Leading days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startWeekday - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const d = new Date(year, month - 1, dayNum);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        dayNum
      ).padStart(2, "0")}`;

      const activeTrips = filteredTrips.filter(
        (t) => t.startDate <= dateStr && dateStr <= t.endDate
      );
      const activities: CalendarActivity[] = activeTrips.flatMap((t) => t.activities || []);

      days.push({
        date: d,
        dateString: dateStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: dateStr === todayString,
        trips: activeTrips,
        activities,
      });
    }

    // Days in current month
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const d = new Date(year, month, dayNum);
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;

      const activeTrips = filteredTrips.filter(
        (t) => t.startDate <= dateStr && dateStr <= t.endDate
      );
      const activities: CalendarActivity[] = activeTrips.flatMap((t) => t.activities || []);

      days.push({
        date: d,
        dateString: dateStr,
        dayNumber: dayNum,
        isCurrentMonth: true,
        isToday: dateStr === todayString,
        trips: activeTrips,
        activities,
      });
    }

    // Trailing days for next month to complete standard grid (multiple of 7)
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let dayNum = 1; dayNum <= remainingDays; dayNum++) {
        const d = new Date(year, month + 1, dayNum);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
          dayNum
        ).padStart(2, "0")}`;

        const activeTrips = filteredTrips.filter(
          (t) => t.startDate <= dateStr && dateStr <= t.endDate
        );
        const activities: CalendarActivity[] = activeTrips.flatMap((t) => t.activities || []);

        days.push({
          date: d,
          dateString: dateStr,
          dayNumber: dayNum,
          isCurrentMonth: false,
          isToday: dateStr === todayString,
          trips: activeTrips,
          activities,
        });
      }
    }

    return days;
  }, [currentDate, filteredTrips]);

  const handleSelectDay = (day: CalendarDayInfo) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="calendar-view-page" style={{ padding: "16px 0 48px 0" }}>
      <CalendarControls
        currentDate={currentDate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        selectedGroupBy={selectedGroupBy}
        onGroupByChange={setSelectedGroupBy}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "48px" }}>
          <div className="spinner" style={{ margin: "0 auto 16px" }} />
          <p>Loading your calendar schedule...</p>
        </div>
      ) : (
        <CalendarGrid days={calendarDays} onSelectDay={handleSelectDay} />
      )}

      {/* Date Description & Daily Schedule Modal */}
      <DayDetailModal
        dayInfo={selectedDay}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
