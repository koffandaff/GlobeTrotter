import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ProfileView } from "@/features/profile/components/ProfileView";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

export const metadata: Metadata = {
  title: "Profile & Settings",
  description: "Manage your personal account details, travel preferences, and saved destinations.",
};

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <main className="page-main">
        <Suspense fallback={<div className="spinner" style={{ margin: "40px auto" }} />}>
          <ProfileView />
        </Suspense>
      </main>
    </ProtectedRoute>
  );
}
