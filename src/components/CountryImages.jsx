import { useEffect, useState } from "react";

// Unsplash free-to-use image URLs per country/theme
const COUNTRY_IMAGES = {
  "United States": "https://images.unsplash.com/photo-1568514387698-24b921cd3d63?w=400&q=80",
  "United Kingdom": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80",
  "Germany": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=80",
  "India": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80",
  "UAE": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80",
  "Mexico": "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&q=80",
  "Japan": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80",
  "South Africa": "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&q=80",
  "France": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80",
  "Australia": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
};

const CRIME_IMAGES = {
  "Cybercrime": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80",
  "Drug Trafficking": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80",
  "Terrorism": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80",
  "Fraud": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80",
  "Kidnapping": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80",
  "Organized Crime": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80",
  "Homicide": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80",
  "Human Trafficking": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80",
};

const POLICE_IMAGES = [
  "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80",
  "https://images.unsplash.com/photo-1568514387698-24b921cd3d63?w=400&q=80",
  "https://images.unsplash.com/photo-1523492200690-2b6c7e24c85f?w=400&q=80",
];

export function CountryImage({ country, size = 120 }) {
  const url = COUNTRY_IMAGES[country] || `https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80`;
  return (
    <div style={{ width: size, height: size * 0.6, borderRadius: 6, overflow: "hidden", flexShrink: 0, position: "relative" }}>
      <img src={url} alt={country} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />
    </div>
  );
}

export function CrimeTypeImage({ type, width = "100%", height = 140 }) {
  const url = CRIME_IMAGES[type] || POLICE_IMAGES[0];
  return (
    <div style={{ width, height, borderRadius: 6, overflow: "hidden", position: "relative", flexShrink: 0 }}>
      <img src={url} alt={type} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,12,18,0.85) 0%, transparent 60%)" }} />
      <div style={{ position: "absolute", bottom: 8, left: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em" }}>{type.toUpperCase()}</div>
    </div>
  );
}

export function PoliceImageStrip() {
  return (
    <div style={{ display: "flex", gap: 8, overflow: "hidden", borderRadius: 8, height: 80 }}>
      {POLICE_IMAGES.map((url, i) => (
        <div key={i} style={{ flex: 1, overflow: "hidden", borderRadius: 6, position: "relative" }}>
          <img src={url} alt="police" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(8,12,18,0.4)" }} />
        </div>
      ))}
    </div>
  );
}
