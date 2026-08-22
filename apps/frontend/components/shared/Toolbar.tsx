import React from "react";
import Link from "next/link";

interface Option {
  label: string;
  value: string;
}

interface ToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  groupBy: string;
  onGroupByChange: (value: string) => void;
  groupByOptions?: Option[];
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  filterOptions?: Option[];
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOptions?: Option[];
  actionLabel?: string;
  actionHref?: string;
}

export function Toolbar({
  searchValue,
  onSearchChange,
  groupBy,
  onGroupByChange,
  groupByOptions = [],
  filterStatus,
  onFilterStatusChange,
  filterOptions = [],
  sortBy,
  onSortByChange,
  sortOptions = [],
  actionLabel,
  actionHref,
}: ToolbarProps) {
  return (
    <div
      className="toolbar"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
        background: "var(--color-surface)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
        marginBottom: "24px",
      }}
    >
      <div style={{ display: "flex", gap: "16px", flex: "1 1 auto", flexWrap: "wrap" }}>
        {/* Search */}
        <div className="field" style={{ margin: 0, minWidth: "200px", flex: "1 1 auto" }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ margin: 0 }}
          />
        </div>

        {/* Group By */}
        {groupByOptions.length > 0 && (
          <div className="field" style={{ margin: 0 }}>
            <select value={groupBy} onChange={(e) => onGroupByChange(e.target.value)} style={{ margin: 0 }}>
              {groupByOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Group by: {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Filter */}
        {filterOptions.length > 0 && (
          <div className="field" style={{ margin: 0 }}>
            <select value={filterStatus} onChange={(e) => onFilterStatusChange(e.target.value)} style={{ margin: 0 }}>
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Filter: {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sort */}
        {sortOptions.length > 0 && (
          <div className="field" style={{ margin: 0 }}>
            <select value={sortBy} onChange={(e) => onSortByChange(e.target.value)} style={{ margin: 0 }}>
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort by: {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Action Button */}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
