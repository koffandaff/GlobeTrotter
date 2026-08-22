import React from "react";
import { CityOption } from "@/data/data";

interface CityTileProps {
  city: CityOption;
}

export function CityTile({ city }: CityTileProps) {
  return (
    <div className="trip-card" style={{ textAlign: "center" }}>
      <div className="thumb"></div>
      <h3>{city.name}</h3>
      <p className="text-muted mb-0">{city.country}</p>
    </div>
  );
}
