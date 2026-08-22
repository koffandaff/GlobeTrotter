"use client";

import React, { useEffect, useState } from "react";

interface AuditLog {
  id: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: { id: string; email: string } | null;
}

interface LogsResponse {
  logs: AuditLog[];
  totalItems: number;
}

interface LogsData {
  logs: AuditLog[];
  totalItems: number;
  page: number;
  limit: number;
  filters: {
    type: string;
    userId: string;
    from: string;
    to: string;
  };
  loading: boolean;
  error: string | null;
  selectedLog: AuditLog | null;
}

function SystemLogsPage() {
  const [data, setData] = useState<LogsData>({
    logs: [],
    totalItems: 0,
    page: 1,
    limit: 20,
    filters: { type: "", userId: "", from: "", to: "" },
    loading: true,
    error: null,
    selectedLog: null,
  });

  const fetchLogs = async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));
      const params = new URLSearchParams({
        page: String(data.page),
        limit: String(data.limit),
      });
      if (data.filters.type) params.set("type", data.filters.type);
      if (data.filters.userId) params.set("userId", data.filters.userId);
      if (data.filters.from) params.set("from", data.filters.from);
      if (data.filters.to) params.set("to", data.filters.to);

      const res = await fetch(`/api/admin/logs?${params}`);
      if (!res.ok) throw new Error("Failed to fetch logs");

      const result = await res.json();
      setData((prev) => ({
        ...prev,
        logs: result.data.logs,
        totalItems: result.data.totalItems,
        loading: false,
      }));
    } catch (err) {
      setData((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load logs",
      }));
    }
  };

  const fetchLogDetail = async (logId: string) => {
    try {
      const res = await fetch(`/api/admin/logs/${logId}`);
      if (!res.ok) throw new Error("Failed to fetch log detail");
      const result = await res.json();
      setData((prev) => ({ ...prev, selectedLog: result.data }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to load log detail");
    }
  };

  const handleFilterChange = (key: keyof LogsData["filters"], value: string) => {
    setData((prev) => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
      page: 1,
    }));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const totalPages = Math.ceil(data.totalItems / data.limit);

  useEffect(() => {
    fetchLogs();
  }, [data.page, data.limit, data.filters.type, data.filters.userId, data.filters.from, data.filters.to]);

  return (
    <main className="page-main">
      <div className="page-header">
        <div className="eyebrow">Admin</div>
        <h1>System Logs</h1>
        <p>Audit trail and system events</p>
      </div>

      <div className="card" style={{ marginBottom: "var(--space-4)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-3)" }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Action Type</label>
            <input
              className="search-input"
              type="text"
              placeholder="e.g. trip.created"
              value={data.filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>User ID</label>
            <input
              className="search-input"
              type="text"
              placeholder="User UUID"
              value={data.filters.userId}
              onChange={(e) => handleFilterChange("userId", e.target.value)}
            />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>From</label>
            <input
              type="datetime-local"
              className="search-input"
              value={data.filters.from}
              onChange={(e) => handleFilterChange("from", e.target.value)}
            />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>To</label>
            <input
              type="datetime-local"
              className="search-input"
              value={data.filters.to}
              onChange={(e) => handleFilterChange("to", e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginTop: "var(--space-3)", display: "flex", gap: "var(--space-2)" }}>
          <button className="btn btn-secondary" onClick={fetchLogs} disabled={data.loading}>
            Apply Filters
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => setData((prev) => ({ ...prev, filters: { type: "", userId: "", from: "", to: "" }, page: 1 }))}
          >
            Clear
          </button>
        </div>
      </div>

      {data.error && (
        <div className="card" style={{ color: "var(--color-danger)", marginBottom: "var(--space-4)" }}>
          <p>{data.error}</p>
          <button className="btn btn-primary" onClick={fetchLogs} style={{ marginTop: "8px" }}>
            Retry
          </button>
        </div>
      )}

      {data.loading && data.logs.length === 0 ? (
        <div className="placeholder-box">Loading logs...</div>
      ) : data.logs.length === 0 ? (
        <div className="empty-state">
          <h3>No logs found</h3>
          <p>Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {data.logs.map((log) => (
              <div
                key={log.id}
                className="list-row"
                style={{ cursor: "pointer" }}
                onClick={() => fetchLogDetail(log.id)}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    <span className="badge" style={{ background: "var(--color-gold-soft)", color: "#8a5a16" }}>
                      {log.action}
                    </span>
                    {log.entityType && (
                      <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                        {log.entityType}{log.entityId && `: ${log.entityId.slice(0, 8)}...`}
                      </span>
                    )}
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontFamily: "monospace" }}>
                      {log.id.slice(0, 8)}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
                    {log.user ? `by ${log.user.email}` : "System"}
                    {log.ipAddress && ` • IP: ${log.ipAddress}`}
                    • {formatDate(log.createdAt)}
                  </div>
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Click for details</span>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="toolbar" style={{ justifyContent: "center", marginTop: "var(--space-4)" }}>
              <button
                className="btn btn-secondary"
                onClick={() => setData((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={data.page === 1 || data.loading}
              >
                Previous
              </button>
              <span style={{ display: "flex", alignItems: "center", padding: "0 var(--space-3)" }}>
                Page {data.page} of {totalPages} ({data.totalItems} total)
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => setData((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={data.page >= totalPages || data.loading}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {data.selectedLog && (
        <div
          className="nav-backdrop open"
          onClick={() => setData((prev) => ({ ...prev, selectedLog: null }))}
        />
      )}

      {data.selectedLog && (
        <div
          className="main-nav open"
          style={{
            width: "min(600px, 90vw)",
            left: "auto",
            right: 0,
            borderRight: "none",
            borderLeft: "1px solid var(--color-border)",
          }}
        >
          <div style={{ padding: "var(--space-3)", borderBottom: "1px solid var(--color-border)" }}>
            <h2 style={{ margin: 0 }}>Log Detail</h2>
            <button
              className="nav-toggle"
              onClick={() => setData((prev) => ({ ...prev, selectedLog: null }))}
              style={{ position: "absolute", right: "var(--space-3)", top: "var(--space-3)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div style={{ padding: "var(--space-4)", overflowY: "auto", flex: 1 }}>
            <div style={{ marginBottom: "var(--space-4)" }}>
              <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginBottom: "var(--space-3)" }}>
                <span className="badge" style={{ background: "var(--color-gold-soft)", color: "#8a5a16" }}>
                  {data.selectedLog.action}
                </span>
                {data.selectedLog.entityType && <span className="badge">{data.selectedLog.entityType}</span>}
                <span className="badge-gold">{formatDate(data.selectedLog.createdAt)}</span>
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                <strong>ID:</strong> {data.selectedLog.id}
              </div>
              {data.selectedLog.user && (
                <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
                  <strong>User:</strong> {data.selectedLog.user.email} ({data.selectedLog.user.id})
                </div>
              )}
              {data.selectedLog.ipAddress && (
                <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
                  <strong>IP:</strong> {data.selectedLog.ipAddress}
                </div>
              )}
            </div>

            {data.selectedLog.oldData && (
              <div style={{ marginBottom: "var(--space-4)" }}>
                <h3 style={{ fontSize: "0.9rem", marginBottom: "var(--space-2)" }}>Before</h3>
                <pre style={{
                  background: "var(--color-surface-alt)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "var(--space-3)",
                  fontSize: "0.75rem",
                  overflow: "auto",
                  maxHeight: "200px",
                }}>
                  {JSON.stringify(data.selectedLog.oldData, null, 2)}
                </pre>
              </div>
            )}

            {data.selectedLog.newData && (
              <div style={{ marginBottom: "var(--space-4)" }}>
                <h3 style={{ fontSize: "0.9rem", marginBottom: "var(--space-2)" }}>After</h3>
                <pre style={{
                  background: "var(--color-surface-alt)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "var(--space-3)",
                  fontSize: "0.75rem",
                  overflow: "auto",
                  maxHeight: "200px",
                }}>
                  {JSON.stringify(data.selectedLog.newData, null, 2)}
                </pre>
              </div>
            )}

            {data.selectedLog.userAgent && (
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", maxHeight: "60px", overflow: "hidden" }}>
                <strong>User Agent:</strong> {data.selectedLog.userAgent}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default SystemLogsPage;