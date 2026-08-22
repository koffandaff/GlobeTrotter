import React, { useState } from "react";
import { CityOption } from "@/data/data";

interface CityResultCardProps {
  city: CityOption;
}

export function CityResultCard({ city }: CityResultCardProps) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    // TODO: Replace with real API call
    console.log(`Adding ${city.name} to trip...`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px" }}>
      <div>
        <h3 style={{ marginBottom: "4px" }}>{city.name}</h3>
        <p className="text-muted" style={{ marginBottom: "16px", fontSize: "0.95rem" }}>
          {city.country} • {city.region}
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <span className="badge" style={{ background: "var(--color-surface-alt)", color: "var(--color-text)", border: "1px solid var(--color-border)" }}>
            {city.costIndex}
          </span>
          <span className="badge" style={{ background: "var(--color-surface-alt)", color: "var(--color-text)", border: "1px solid var(--color-border)" }}>
            Popularity: {city.popularity}/100
          </span>
        </div>
      </div>
      
      <button
        onClick={handleAdd}
        className={added ? "btn" : "btn btn-primary"}
        style={added ? { background: "var(--color-success)", color: "white", borderColor: "var(--color-success)" } : {}}
      >
        {added ? "Added ✓" : "Add to trip"}
      </button>
    </div>
  );
}
