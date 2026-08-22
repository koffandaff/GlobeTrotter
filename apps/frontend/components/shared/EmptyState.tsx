import React from "react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, message, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn btn-primary" style={{ marginTop: "16px" }}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
