import { useState } from "react";
import { PRIORITY_COLORS, STATUS_COLORS } from "../data/data.js";
import { CountryImage, CrimeTypeImage } from "./CountryImages.jsx";

export function WorldMap({ cases }) {
  const [hoveredCase, setHoveredCase] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const countryCaseCounts = cases.reduce((acc, c) => {
    acc[c.country] = (acc[c.country] || 0) + 1;
    return acc;
  }, {});

  const criticalCountries = cases.filter(c => c.priority === "Critical").map(c => c.country);
  const selectedCases = selectedCountry ? cases.filter(c => c.country === selectedCountry) : [];

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.title}>Global Operations Map</h1>
        <p style={s.sub}>Active cases across all jurisdictions — click a country to inspect</p>
      </div>

      <div style={s.layout}>
        {/* Case pins grid */}
        <div style={s.mapPanel}>
          <div style={s.mapHeader}>
            <span style={s.mapLabel}>GLOBAL THREAT OVERVIEW</span>
            <div style={s.legend}>
              {["Critical", "High", "Medium", "Low"].map(p => (
                <span key={p} style={s.legendItem}>
                  <span style={{ ...s.legendDot, background: PRIORITY_COLORS[p] }} />{p}
                </span>
              ))}
            </div>
          </div>
          <div style={s.pinsGrid}>
            {cases.map(c => (
              <div key={c.id} style={{ ...s.pin, background: `${PRIORITY_COLORS[c.priority]}10`, border: `1px solid ${PRIORITY_COLORS[c.priority]}35`, ...(hoveredCase?.id === c.id ? { border: `1px solid ${PRIORITY_COLORS[c.priority]}80` } : {}) }}
                onMouseEnter={() => setHoveredCase(c)} onMouseLeave={() => setHoveredCase(null)}
                onClick={() => setSelectedCountry(c.country === selectedCountry ? null : c.country)}>
                <CountryImage country={c.country} size={200} />
                <div style={s.pinBody}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <span style={s.pinId}>{c.id}</span>
                    <span style={{ ...s.pinPriority, color: PRIORITY_COLORS[c.priority] }}>{c.priority}</span>
                  </div>
                  <div style={s.pinTitle}>{c.title}</div>
                  <div style={s.pinMeta}>📍 {c.city}, {c.country}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    <span style={{ ...s.statusTag, color: STATUS_COLORS[c.status] }}>{c.status}</span>
                    <span style={s.pinType}>{c.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={s.rightPanel}>
          {/* Country summary */}
          <div style={s.panel}>
            <div style={s.panelTitle}>Countries with Active Cases</div>
            {Object.entries(countryCaseCounts).map(([country, count]) => (
              <div key={country} style={{ ...s.countryRow, background: selectedCountry === country ? "rgba(56,139,253,0.08)" : "transparent", cursor: "pointer" }}
                onClick={() => setSelectedCountry(country === selectedCountry ? null : country)}>
                <CountryImage country={country} size={60} />
                <div style={{ flex: 1 }}>
                  <div style={s.countryName}>{country}</div>
                  <div style={s.countryCases}>{count} case{count > 1 ? "s" : ""}</div>
                  {criticalCountries.includes(country) && <span style={s.critTag}>⚠ CRITICAL</span>}
                </div>
                <span style={{ fontSize: 12, color: "var(--text3)" }}>→</span>
              </div>
            ))}
          </div>

          {/* Selected country cases */}
          {selectedCountry && selectedCases.length > 0 && (
            <div style={s.panel}>
              <div style={s.panelTitle}>📁 {selectedCountry} — {selectedCases.length} Cases</div>
              {selectedCases.map(c => (
                <div key={c.id} style={s.selectedCase}>
                  <CrimeTypeImage type={c.type} width="100%" height={80} />
                  <div style={s.selectedCaseBody}>
                    <div style={s.selectedCaseTitle}>{c.title}</div>
                    <div style={s.selectedCaseMeta}>{c.id} · {c.type}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 10, color: PRIORITY_COLORS[c.priority] }}>{c.priority}</span>
                      <span style={{ fontSize: 10, color: STATUS_COLORS[c.status] }}>{c.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { WorldMap as default };

const s = {
  header: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 4 },
  sub: { fontSize: 13, color: "var(--text2)" },
  layout: { display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 },
  mapPanel: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 16 },
  mapHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  mapLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text3)", letterSpacing: "0.15em" },
  legend: { display: "flex", gap: 12 },
  legendItem: { display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text2)" },
  legendDot: { width: 7, height: 7, borderRadius: "50%" },
  pinsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 },
  pin: { borderRadius: 7, overflow: "hidden", cursor: "pointer", transition: "all 0.15s" },
  pinBody: { padding: "8px 10px" },
  pinId: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#388bfd" },
  pinPriority: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700 },
  pinTitle: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 3, lineHeight: 1.3 },
  pinMeta: { fontSize: 10, color: "var(--text3)" },
  statusTag: { fontSize: 10, fontFamily: "'JetBrains Mono', monospace" },
  pinType: { fontSize: 10, color: "var(--text3)" },
  rightPanel: { display: "flex", flexDirection: "column", gap: 14 },
  panel: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 14 },
  panelTitle: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 12 },
  countryRow: { display: "flex", alignItems: "center", gap: 10, padding: "8px 6px", borderRadius: 6, marginBottom: 4, transition: "background 0.15s" },
  countryName: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 2 },
  countryCases: { fontSize: 11, color: "var(--text3)" },
  critTag: { fontSize: 9, color: "#f85149", fontFamily: "'JetBrains Mono', monospace" },
  selectedCase: { marginBottom: 10, background: "var(--bg3)", borderRadius: 6, overflow: "hidden" },
  selectedCaseBody: { padding: "8px 10px" },
  selectedCaseTitle: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 3 },
  selectedCaseMeta: { fontSize: 10, color: "var(--text3)" },
};
