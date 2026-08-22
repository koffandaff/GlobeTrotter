"use client";

import React, { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api/client";

interface AdminUser {
  id: string;
  email: string;
  username: string | null;
  firstName: string;
  lastName: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  createdAt: string;
  lastLoginAt: string | null;
  _count: { trips: number };
}

interface UserManagementData {
  users: AdminUser[];
  totalItems: number;
  page: number;
  limit: number;
  search: string;
  loading: boolean;
  error: string | null;
  saving: Record<string, boolean>;
}

export default function UserManagementPage() {
  const [data, setData] = useState<UserManagementData>({
    users: [],
    totalItems: 0,
    page: 1,
    limit: 20,
    search: "",
    loading: true,
    error: null,
    saving: {},
  });

  const fetchUsers = async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));
      const params = new URLSearchParams({
        page: String(data.page),
        limit: String(data.limit),
      });
      if (data.search) params.set("search", data.search);

      const result = await fetchApi(`/admin/users?${params}`);
      
      setData((prev) => ({
        ...prev,
        users: result.data.users,
        totalItems: result.data.totalItems,
        loading: false,
      }));
    } catch (err) {
      setData((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load users",
      }));
    }
  };

  const updateUser = async (userId: string, updates: { role?: "USER" | "ADMIN"; status?: "ACTIVE" | "SUSPENDED" | "DELETED" }) => {
    setData((prev) => ({ ...prev, saving: { ...prev.saving, [userId]: true } }));
    try {
      await fetchApi(`/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      await fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setData((prev) => {
        const { [userId]: _, ...rest } = prev.saving;
        return { ...prev, saving: rest };
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [data.page, data.limit, data.search]);

  const totalPages = Math.ceil(data.totalItems / data.limit);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setData((prev) => ({ ...prev, page: 1 }));
  };

  const getRoleBadge = (role: string) => {
    if (role === "ADMIN") {
      return (
        <span style={{ 
          background: "var(--color-surface-alt)", 
          color: "var(--color-text)", 
          padding: "4px 12px", 
          borderRadius: "16px", 
          fontSize: "0.85rem",
          fontWeight: 500,
          border: "1px solid var(--color-border)"
        }}>
          Super Admin
        </span>
      );
    }
    return (
      <span style={{ 
        background: "transparent", 
        color: "var(--color-text-muted)", 
        padding: "4px 12px", 
        fontSize: "0.85rem",
      }}>
        User
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    let color = "var(--color-text-muted)";
    let dotColor = "gray";
    let text = "Unknown";

    if (status === "ACTIVE") {
      color = "#2e7d32"; // green
      dotColor = "#4caf50";
      text = "Active";
    } else if (status === "SUSPENDED") {
      color = "#ed6c02"; // orange
      dotColor = "#ff9800";
      text = "Suspended";
    } else if (status === "DELETED") {
      color = "#d32f2f"; // red
      dotColor = "#f44336";
      text = "Deleted";
    }

    return (
      <span style={{ color, fontSize: "0.85rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: dotColor, display: "inline-block" }}></span>
        {text}
      </span>
    );
  };

  return (
    <main className="page-main" style={{ maxWidth: "100%", padding: "var(--space-6)" }}>
      <style>{`
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          background: var(--color-surface);
        }
        .admin-table th {
          padding: 16px 24px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--color-border);
          background: var(--color-surface-alt);
        }
        .admin-table td {
          padding: 16px 24px;
          border-bottom: 1px solid var(--color-border);
          vertical-align: middle;
        }
        .admin-table tbody tr:hover {
          background: var(--color-surface-hover);
        }
        .avatar-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--color-primary-soft);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .action-btn {
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-weight: 500;
          transition: all 0.2s;
        }
        .action-btn:hover {
          background: var(--color-surface-alt);
          color: var(--color-text);
        }
        .action-btn.danger:hover {
          background: #fee2e2;
          color: #dc2626;
        }
      `}</style>

      <div className="page-header" style={{ marginBottom: "var(--space-6)" }}>
        <h1>User Management</h1>
        <p>View and manage user accounts</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden", border: "1px solid var(--color-border)" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--color-surface)" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", gap: "12px", width: "400px" }}>
            <div style={{ position: "relative", width: "100%" }}>
              <svg style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="search"
                className="field"
                style={{ marginBottom: 0, paddingLeft: "36px", width: "100%", background: "var(--color-surface-alt)", border: "none" }}
                placeholder="Search users..."
                value={data.search}
                onChange={(e) => setData((prev) => ({ ...prev, search: e.target.value }))}
              />
            </div>
          </form>
          <span style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", fontWeight: 500 }}>
            {data.totalItems} Users
          </span>
        </div>

        {data.error && (
          <div style={{ padding: "24px", color: "var(--color-danger)", textAlign: "center" }}>
            <p>{data.error}</p>
            <button className="btn btn-primary" onClick={fetchUsers} style={{ marginTop: "8px" }}>Retry</button>
          </div>
        )}

        {data.loading && data.users.length === 0 ? (
          <div style={{ padding: "64px", textAlign: "center", color: "var(--color-text-muted)" }}>Loading users...</div>
        ) : data.users.length === 0 ? (
          <div style={{ padding: "64px", textAlign: "center", color: "var(--color-text-muted)" }}>
            <h3>No users found</h3>
            <p>Try adjusting your search query.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: "30%" }}>Name</th>
                  <th style={{ width: "15%" }}>Role</th>
                  <th style={{ width: "15%" }}>Trips</th>
                  <th style={{ width: "15%" }}>Status</th>
                  <th style={{ width: "25%", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div className="avatar-circle">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--color-text)", fontSize: "0.95rem" }}>
                            {user.firstName} {user.lastName}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>
                      <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                        {user._count.trips} Trips
                      </span>
                    </td>
                    <td>{getStatusBadge(user.status)}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                        
                        {user.status === "ACTIVE" ? (
                          <button 
                            className="action-btn"
                            onClick={() => updateUser(user.id, { status: "SUSPENDED" })}
                            disabled={data.saving[user.id]}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>
                            Suspend
                          </button>
                        ) : (
                          <button 
                            className="action-btn"
                            onClick={() => updateUser(user.id, { status: "ACTIVE" })}
                            disabled={data.saving[user.id]}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Activate
                          </button>
                        )}

                        {user.role === "USER" ? (
                          <button 
                            className="action-btn"
                            onClick={() => updateUser(user.id, { role: "ADMIN" })}
                            disabled={data.saving[user.id]}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            Promote
                          </button>
                        ) : (
                          <button 
                            className="action-btn"
                            onClick={() => updateUser(user.id, { role: "USER" })}
                            disabled={data.saving[user.id]}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                            Demote
                          </button>
                        )}

                        <button 
                          className="action-btn danger"
                          onClick={() => {
                            if(confirm("Are you sure you want to permanently delete this user?")) {
                              updateUser(user.id, { status: "DELETED" })
                            }
                          }}
                          disabled={data.saving[user.id] || user.status === "DELETED"}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ padding: "16px 24px", borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--color-surface)" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
              Showing {(data.page - 1) * data.limit + 1} to Math.min(data.page * data.limit, data.totalItems) of {data.totalItems} entries
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className="btn btn-secondary"
                style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                onClick={() => setData((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={data.page === 1 || data.loading}
              >
                Previous
              </button>
              <button
                className="btn btn-secondary"
                style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                onClick={() => setData((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={data.page >= totalPages || data.loading}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}