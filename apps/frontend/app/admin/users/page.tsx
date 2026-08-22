"use client";

import React, { useEffect, useState } from "react";

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

interface UsersResponse {
  users: AdminUser[];
  totalItems: number;
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

import { fetchApi } from "@/lib/api/client";

function UserManagementPage() {
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

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="page-main">
      <div className="page-header">
        <div className="eyebrow">Admin</div>
        <h1>User Management</h1>
        <p>View and manage user accounts</p>
      </div>

      <form className="card toolbar" onSubmit={handleSearch} style={{ marginBottom: "var(--space-4)" }}>
        <input
          type="search"
          className="search-input"
          placeholder="Search by name, email, username..."
          value={data.search}
          onChange={(e) => setData((prev) => ({ ...prev, search: e.target.value }))}
        />
        <span style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
          {data.totalItems} users
        </span>
      </form>

      {data.error && (
        <div className="card" style={{ color: "var(--color-danger)", marginBottom: "var(--space-4)" }}>
          <p>{data.error}</p>
          <button className="btn btn-primary" onClick={fetchUsers} style={{ marginTop: "8px" }}>
            Retry
          </button>
        </div>
      )}

      {data.loading && data.users.length === 0 ? (
        <div className="placeholder-box">Loading users...</div>
      ) : data.users.length === 0 ? (
        <div className="empty-state">
          <h3>No users found</h3>
          <p>Try adjusting your search or check back later.</p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {data.users.map((user) => (
              <div key={user.id} className="list-row">
                <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    <span style={{ fontWeight: 600 }}>{user.firstName} {user.lastName}</span>
                    {user.username && (
                      <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                        @{user.username}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                    {user.email} • {user._count.trips} trips • Joined {formatDate(user.createdAt)}
                    {user.lastLoginAt && ` • Last login ${formatDate(user.lastLoginAt)}`}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                  <select
                    className="field"
                    style={{ width: "auto", minWidth: "120px", marginBottom: 0 }}
                    value={user.role}
                    onChange={(e) => updateUser(user.id, { role: e.target.value as "USER" | "ADMIN" })}
                    disabled={data.saving[user.id]}
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>

                  <select
                    className="field"
                    style={{ width: "auto", minWidth: "140px", marginBottom: 0 }}
                    value={user.status}
                    onChange={(e) => updateUser(user.id, { status: e.target.value as "ACTIVE" | "SUSPENDED" | "DELETED" })}
                    disabled={data.saving[user.id]}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="DELETED">Deleted</option>
                  </select>

                  {data.saving[user.id] && (
                    <span style={{ fontSize: "0.8rem", color: "var(--color-accent)" }}>Saving…</span>
                  )}
                </div>
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
                Page {data.page} of {totalPages}
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
    </main>
  );
}

export default UserManagementPage;