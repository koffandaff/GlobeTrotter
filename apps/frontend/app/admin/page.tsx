"use client";

import React, { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api/client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

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

interface AuditLog {
  id: string;
  action: string;
  entityType?: string;
  createdAt: string;
  user?: { email: string };
}

interface AdminDashboardData {
  stats: AdminStats | null;
  topCities: TopCity[];
  topActivities: TopActivity[];
  recentLogs: AuditLog[];
  loading: boolean;
  error: string | null;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData>({
    stats: null,
    topCities: [],
    topActivities: [],
    recentLogs: [],
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));
      const [statsRes, citiesRes, activitiesRes, logsRes] = await Promise.all([
        fetchApi("/admin/stats/overview"),
        fetchApi("/admin/stats/top-cities"),
        fetchApi("/admin/stats/top-activities"),
        fetchApi("/admin/logs?limit=8"), // Fetch recent logs for live feed
      ]);

      setData({
        stats: statsRes.data,
        topCities: citiesRes.data || [],
        topActivities: activitiesRes.data || [],
        recentLogs: logsRes.data?.logs || [],
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
      <main className="page-main" style={{ padding: "var(--space-6)", display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <div className="spinner" style={{ width: "40px", height: "40px" }} />
      </main>
    );
  }

  if (data.error) {
    return (
      <main className="page-main" style={{ padding: "var(--space-6)" }}>
        <div className="card" style={{ color: "var(--color-danger)", textAlign: "center", padding: "var(--space-8)" }}>
          <h2 style={{ marginBottom: "var(--space-2)" }}>Dashboard Failed to Load</h2>
          <p>{data.error}</p>
          <button className="btn btn-primary" onClick={fetchData} style={{ marginTop: "16px" }}>
            Retry Fetch
          </button>
        </div>
      </main>
    );
  }

  // Transform top cities data for Recharts
  const chartData = data.topCities.map(city => ({
    name: city.name,
    trips: city.tripCount,
    saves: city.saveCount
  }));

  return (
    <main className="page-main" style={{ maxWidth: "100%", padding: "var(--space-6)" }}>
      <div className="page-header" style={{ marginBottom: "var(--space-6)" }}>
        <div className="eyebrow">Admin</div>
        <h1>Dashboard</h1>
        <p>System overview and key metrics</p>
      </div>

      <div className="grid grid-3" style={{ marginBottom: "var(--space-6)", gap: "var(--space-4)" }}>
        <div className="card" style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "8px", borderTop: "4px solid var(--color-primary)" }}>
          <div style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Total Users</div>
          <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--color-text)", lineHeight: 1 }}>{data.stats?.users.total ?? 0}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--color-primary)" }}>
            {data.stats?.users.active ?? 0} active users
          </div>
        </div>

        <div className="card" style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "8px", borderTop: "4px solid var(--color-accent)" }}>
          <div style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Total Trips</div>
          <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--color-text)", lineHeight: 1 }}>{data.stats?.trips.total ?? 0}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--color-accent)" }}>
            {data.stats?.trips.public ?? 0} public trips
          </div>
        </div>

        <div className="card" style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "8px", borderTop: "4px solid var(--color-gold)" }}>
          <div style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Total Activities</div>
          <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--color-text)", lineHeight: 1 }}>{data.stats?.activities.total ?? 0}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--color-gold)" }}>
            In database
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
        <div className="card" style={{ padding: "var(--space-5)" }}>
          <div className="section-title-row" style={{ marginBottom: "var(--space-4)" }}>
            <h2>Top Cities Activity</h2>
          </div>
          {data.topCities.length === 0 ? (
            <div className="empty-state">No city data available</div>
          ) : (
            <div style={{ height: "300px", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
                  <RechartsTooltip 
                    cursor={{ fill: 'var(--color-surface-hover)' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="trips" name="Trips" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="saves" name="Saves" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card" style={{ padding: "var(--space-5)" }}>
          <div className="section-title-row" style={{ marginBottom: "var(--space-4)" }}>
            <h2>Live Activity Feed</h2>
          </div>
          {data.recentLogs.length === 0 ? (
            <div className="empty-state">No recent activity</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {data.recentLogs.map((log, index) => (
                <div
                  key={log.id}
                  style={{ 
                    padding: "12px 0", 
                    borderBottom: index !== data.recentLogs.length - 1 ? "1px solid var(--color-border)" : "none",
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start"
                  }}
                >
                  <div style={{ 
                    width: "8px", 
                    height: "8px", 
                    borderRadius: "50%", 
                    background: log.action.includes("DELETE") ? "var(--color-danger)" : log.action.includes("CREATE") ? "var(--color-primary)" : "var(--color-accent)", 
                    marginTop: "6px" 
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-text)", display: "flex", justifyContent: "space-between" }}>
                      <span>{log.action}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 400 }}>
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
                      {log.user ? log.user.email : "System"} {log.entityType && ` • ${log.entityType}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}