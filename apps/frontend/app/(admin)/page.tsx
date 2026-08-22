"use client";

import React, { useEffect, useState } from "react";

interface AdminStats {
  users: { total: number; active: number };
  trips: { total: number; public: number };
  activities: { total: number };
}

interface TopCity {
  id: string;
  name: string;
  country: string;
  tripCount: number;
  saveCount: number;
  viewCount: number;
}

interface TopActivity {
  id: string;
  name: string;
  category: string;
  popularityScore: number;
  saveCount: number;
  viewCount: number;
  city: { name: string; country: string };
}

interface AdminDashboardData {
  stats: AdminStats | null;
  topCities: TopCity[];
  topActivities: TopActivity[];
  loading: boolean;
  error: string | null;
}

function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData>({
    stats: null,
    topCities: [],
    topActivities: [],
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));
      const [statsRes, citiesRes, activitiesRes] = await Promise.all([
        fetch("/api/admin/stats/overview"),
        fetch("/api/admin/stats/top-cities"),
        fetch("/api/admin/stats/top-activities"),
      ]);

      if (!statsRes.ok || !citiesRes.ok || !activitiesRes.ok) {
        throw new Error("Failed to fetch admin data");
      }

      const [stats, topCities, topActivities] = await Promise.all([
        statsRes.json(),
        citiesRes.json(),
        activitiesRes.json(),
      ]);

      setData({
        stats: stats.data,
        topCities: citiesRes.data || [],
        topActivities: activitiesRes.data || [],
        loading: false,
        error: null,
      });
    } catch (err) {
      setData((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load dashboard",
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (data.loading) {
    return (
      <main className="page-main">
        <div className="placeholder-box">Loading admin dashboard...</div>
      </main>
    );
  }

  if (data.error) {
    return (
      <main className="page-main">
        <div className="card" style={{ color: "var(--color-danger)" }}>
          <h2>Error</h2>
          <p>{data.error}</p>
          <button className="btn btn-primary" onClick={fetchData} style={{ marginTop: "16px" }}>
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-main">
      <div className="page-header">
        <div className="eyebrow">Admin</div>
        <h1>Dashboard</h1>
        <p>System overview and key metrics</p>
      </div>

      <div className="grid grid-3" style={{ marginBottom: "var(--space-5)" }}>
        <div className="stat-card">
          <div className="stat-value">{data.stats?.users.total ?? 0}</div>
          <div className="stat-label">Total Users</div>
          <div style={{ fontSize: "0.85rem", color: "var(--color-accent)", marginTop: "8px" }}>
            {data.stats?.users.active ?? 0} active
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{data.stats?.trips.total ?? 0}</div>
          <div className="stat-label">Total Trips</div>
          <div style={{ fontSize: "0.85rem", color: "var(--color-accent)", marginTop: "8px" }}>
            {data.stats?.trips.public ?? 0} public
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{data.stats?.activities.total ?? 0}</div>
          <div className="stat-label">Total Activities</div>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: "var(--space-4)" }}>
        <div className="card">
          <div className="section-title-row">
            <h2>Top Cities by Trips</h2>
          </div>
          {data.topCities.length === 0 ? (
            <div className="empty-state">No city data available</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {data.topCities.map((city) => (
                <div
                  key={city.id}
                  className="list-row"
                  style={{ padding: "var(--space-2) var(--space-3)" }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{city.name}, {city.country}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                      {city.tripCount} trips • {city.saveCount} saves • {city.viewCount} views
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="section-title-row">
            <h2>Top Activities</h2>
          </div>
          {data.topActivities.length === 0 ? (
            <div className="empty-state">No activity data available</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {data.topActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="list-row"
                  style={{ padding: "var(--space-2) var(--space-3)" }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{activity.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                      {activity.category} • {activity.city.name}, {activity.city.country}
                    </div>
                  </div>
                  <span className="badge">{activity.popularityScore.toFixed(1)} score</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default AdminDashboardPage;