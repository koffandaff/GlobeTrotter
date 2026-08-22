import React from "react";
import type { Metadata } from "next";
import { CalendarView } from "@/features/calendar/components/CalendarView";

export const metadata: Metadata = {
  title: "Calendar View",
  description: "View and explore your scheduled trips and daily itinerary activities.",
};

export default function CalendarPage() {
  return (
    <main className="page-main" style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 16px" }}>
      <CalendarView />
    </main>
  );
}
