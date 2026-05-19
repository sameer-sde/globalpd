import { useState } from "react";
import { COUNTRIES, PRIORITY_COLORS, STATUS_COLORS } from "../data/data.js";

export function DispatchPanel({ officers, cases, addAlert, addCase }) {
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("All");

  function sendAlert() {
    if (!msg.trim()) return;
    addAlert(`📡 Dispatch: ${msg}`);
    setSent(prev => [{ msg, time: new Date().toLocaleTimeString(), id: Date.now() }, ...prev]);
    setMsg("");
  }

  const filteredCases = selectedCountry === "All" ? cases : cases.filter(c => c.country === selectedCountry);

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.title}>Dispatch Center</h1>
        <p style={s.sub}>Broadcast alerts and manage officer assignments</p>
      </div>

      <div style={s.layout}>
        {/* Broadcast */}
        <div style={s.panel}>
          <div style={s.panelTitle}>📡 Broadcast Alert</div>
          <textarea style={s.textarea} value={msg} onChange={e => setMsg(e.target.value)}
            placeholder="Type emergency alert or dispatch message..." rows={4} />
          <button style={s.broadcastBtn} onClick={sendAlert} disabled={!msg.trim()}>
            🚨 Broadcast to All Units
          </button>

          <div style={{ marginTop: 20 }}>
            <div style={s.sentTitle}>Sent Dispatches</div>
            {sent.length === 0
              ? <div style={s.empty}>No dispatches sent yet.</div>
              : sent.map(s2 => (
                <div key={s2.id} style={s.sentItem}>
                  <span style={s.sentTime}>{s2.time}</span>
                  <span style={s.sentMsg}>{s2.msg}</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Officer status */}
        <div style={s.panel}>
          <div style={s.panelTitle}>👮 Officer Status</div>
          {officers.map(o => (
            <div key={o.id} style={s.officerRow}>
              <span style={s.officerAvatar}>{o.avatar}</span>
              <div style={{ flex: 1 }}>
                <div style={s.officerName}>{o.name}</div>
                <div style={s.officerMeta}>{o.rank} · {o.country}</div>
              </div>
              <span style={{ ...s.statusDot, background: o.status === "On Duty" || o.status === "On Scene" ? "#3fb950" : o.status === "Available" ? "#388bfd" : "#484f58" }} />
              <span style={s.officerStatus}>{o.status}</span>
            </div>
          ))}
        </div>

        {/* Case filter by country */}
        <div style={s.panel}>
          <div style={s.panelTitle}>📁 Cases by Country</div>
          <select style={s.select} value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}>
            <option>All</option>
            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
          </select>
          {filteredCases.slice(0, 6).map(c => (
            <div key={c.id} style={s.caseItem}>
              <span style={{ ...s.priorityDot, background: PRIORITY_COLORS[c.priority] }} />
              <div style={{ flex: 1 }}>
                <div style={s.caseName}>{c.title}</div>
                <div style={s.caseMeta}>{c.id} · {c.officer || "Unassigned"}</div>
              </div>
              <span style={{ ...s.statusBadge, color: STATUS_COLORS[c.status] }}>{c.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WorldMap({ cases }) {
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const countryCaseCounts = cases.reduce((acc, c) => {
    acc[c.country] = (acc[c.country] || 0) + 1;
    return acc;
  }, {});

  const criticalCountries = cases.filter(c => c.priority === "Critical").map(c => c.country);

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.title}>Global Operations Map</h1>
        <p style={s.sub}>Active cases across all jurisdictions</p>
      </div>

      {/* SVG World Map */}
      <div style={s.mapContainer}>
        <div style={s.mapHeader}>
          <span style={s.mapLabel}>GLOBAL THREAT OVERVIEW</span>
          <div style={s.mapLegend}>
            <span style={s.legendItem}><span style={{ ...s.legendDot, background: "#f85149" }} />Critical</span>
            <span style={s.legendItem}><span style={{ ...s.legendDot, background: "#f0883e" }} />High</span>
            <span style={s.legendItem}><span style={{ ...s.legendDot, background: "#e3b341" }} />Medium</span>
            <span style={s.legendItem}><span style={{ ...s.legendDot, background: "#3fb950" }} />Low</span>
          </div>
        </div>

        {/* Visual country grid map */}
        <div style={s.countryGrid}>
          {cases.map(c => (
            <div
              key={c.id}
              style={{ ...s.countryPin, background: `${PRIORITY_COLORS[c.priority]}15`, border: `1px solid ${PRIORITY_COLORS[c.priority]}40` }}
              onMouseEnter={() => setHoveredCountry(c)}
              onMouseLeave={() => setHoveredCountry(null)}
            >
              <div style={{ ...s.pinDot, background: PRIORITY_COLORS[c.priority], boxShadow: `0 0 6px ${PRIORITY_COLORS[c.priority]}` }} />
              <div style={s.pinCountry}>{c.country}</div>
              <div style={s.pinCase}>{c.title}</div>
              <div style={{ ...s.pinPriority, color: PRIORITY_COLORS[c.priority] }}>{c.priority}</div>
            </div>
          ))}
        </div>

        {hoveredCountry && (
          <div style={s.tooltip}>
            <div style={s.tooltipId}>{hoveredCountry.id}</div>
            <div style={s.tooltipTitle}>{hoveredCountry.title}</div>
            <div style={s.tooltipMeta}>{hoveredCountry.city}, {hoveredCountry.country}</div>
            <div style={s.tooltipMeta}>{hoveredCountry.type} · {hoveredCountry.status}</div>
            <div style={{ ...s.tooltipMeta, color: PRIORITY_COLORS[hoveredCountry.priority] }}>{hoveredCountry.priority} Priority</div>
          </div>
        )}
      </div>

      {/* Summary by country */}
      <div style={s.summaryGrid}>
        {Object.entries(countryCaseCounts).map(([country, count]) => (
          <div key={country} style={s.summaryCard}>
            <div style={s.summaryFlag}>🌍</div>
            <div style={s.summaryCountry}>{country}</div>
            <div style={s.summaryCount}>{count} case{count > 1 ? "s" : ""}</div>
            {criticalCountries.includes(country) && <div style={s.summaryAlert}>⚠ CRITICAL</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  header: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 4 },
  sub: { fontSize: 13, color: "var(--text2)" },
  layout: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 },
  panel: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 16 },
  panelTitle: { fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 14 },
  textarea: { width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 12px", color: "var(--text)", fontSize: 13, resize: "vertical", marginBottom: 10 },
  broadcastBtn: { width: "100%", padding: "10px", background: "rgba(248,81,73,0.15)", border: "1px solid rgba(248,81,73,0.4)", borderRadius: 6, color: "#f85149", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  sentTitle: { fontSize: 11, color: "var(--text3)", letterSpacing: "0.08em", marginBottom: 8 },
  empty: { fontSize: 12, color: "var(--text3)", fontStyle: "italic" },
  sentItem: { display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border2)" },
  sentTime: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text3)", flexShrink: 0 },
  sentMsg: { fontSize: 12, color: "var(--text2)" },
  officerRow: { display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--border2)" },
  officerAvatar: { fontSize: 20 },
  officerName: { fontSize: 13, fontWeight: 500, color: "var(--text)" },
  officerMeta: { fontSize: 11, color: "var(--text3)" },
  statusDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  officerStatus: { fontSize: 11, color: "var(--text2)" },
  select: { width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 10px", color: "var(--text)", fontSize: 12, marginBottom: 12 },
  caseItem: { display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border2)" },
  priorityDot: { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
  caseName: { fontSize: 12, fontWeight: 500, color: "var(--text)" },
  caseMeta: { fontSize: 11, color: "var(--text3)" },
  statusBadge: { fontSize: 10, fontFamily: "'JetBrains Mono', monospace" },
  // Map styles
  mapContainer: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 20, marginBottom: 16, position: "relative" },
  mapHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  mapLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--text3)", letterSpacing: "0.15em" },
  mapLegend: { display: "flex", gap: 16 },
  legendItem: { display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text2)" },
  legendDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  countryGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 },
  countryPin: { borderRadius: 6, padding: "10px 12px", cursor: "pointer", transition: "all 0.15s" },
  pinDot: { width: 8, height: 8, borderRadius: "50%", marginBottom: 6 },
  pinCountry: { fontSize: 11, fontWeight: 600, color: "var(--text)", marginBottom: 2 },
  pinCase: { fontSize: 11, color: "var(--text2)", marginBottom: 2 },
  pinPriority: { fontSize: 10, fontFamily: "'JetBrains Mono', monospace" },
  tooltip: { position: "absolute", bottom: 16, right: 16, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: 12, minWidth: 180 },
  tooltipId: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#388bfd", marginBottom: 4 },
  tooltipTitle: { fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 },
  tooltipMeta: { fontSize: 11, color: "var(--text2)", marginBottom: 2 },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 },
  summaryCard: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, padding: "12px 14px", textAlign: "center" },
  summaryFlag: { fontSize: 20, marginBottom: 6 },
  summaryCountry: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 4 },
  summaryCount: { fontSize: 11, color: "var(--text2)", marginBottom: 4 },
  summaryAlert: { fontSize: 10, color: "#f85149", fontFamily: "'JetBrains Mono', monospace" },
};
