import { useState } from "react";

const AGENTS = [
  { id: "UC-001", codename: "BLACKBIRD", realName: "CLASSIFIED", cover: "Import/Export Businessman", targetCase: "C-002", targetOrg: "harbour smuggling ring", country: "UK", city: "London", status: "Active", riskLevel: "High", lastReport: "2026-05-16", nextCheckIn: "2026-05-20", daysUndercover: 47, intel: ["Identified 3 key suspects", "Located warehouse storage site", "Obtained shipment schedules"], coverStrength: 82 },
  { id: "UC-002", codename: "SERPENT", realName: "CLASSIFIED", cover: "Cartel Financial Advisor", targetCase: "C-006", targetOrg: "Mendoza cartel", country: "Mexico", city: "Mexico City", status: "Active", riskLevel: "Critical", lastReport: "2026-05-14", nextCheckIn: "2026-05-18", daysUndercover: 103, intel: ["Deep inside cartel structure", "Has access to financial records", "Identified 6 high-value targets"], coverStrength: 68 },
  { id: "UC-003", codename: "PHANTOM", realName: "CLASSIFIED", cover: "IT Security Consultant", targetCase: "C-001", targetOrg: "dark web network", country: "Germany", city: "Berlin", status: "Compromised", riskLevel: "Critical", lastReport: "2026-05-10", nextCheckIn: "OVERDUE", daysUndercover: 28, intel: ["Infiltrated inner circle", "Last known: Viktor Volkov meeting"], coverStrength: 30 },
  { id: "UC-004", codename: "GHOST", realName: "CLASSIFIED", cover: "NGO Worker", targetCase: "C-008", targetOrg: "trafficking network", country: "South Africa", city: "Cape Town", status: "Active", riskLevel: "Medium", lastReport: "2026-05-17", nextCheckIn: "2026-05-21", daysUndercover: 19, intel: ["Identified 2 transit routes", "Mapping safe house locations"], coverStrength: 91 },
  { id: "UC-005", codename: "VIPER", realName: "CLASSIFIED", cover: "Diplomat's Assistant", targetCase: "C-005", targetOrg: "kidnapping cell", country: "UAE", city: "Dubai", status: "Standby", riskLevel: "High", lastReport: "2026-05-15", nextCheckIn: "2026-05-22", daysUndercover: 5, intel: ["Cover established", "Awaiting contact"], coverStrength: 95 },
];

const STATUS_STYLES = {
  "Active": { color: "#3fb950", bg: "rgba(63,185,80,0.08)", border: "rgba(63,185,80,0.25)" },
  "Compromised": { color: "#f85149", bg: "rgba(248,81,73,0.08)", border: "rgba(248,81,73,0.25)" },
  "Standby": { color: "#e3b341", bg: "rgba(227,179,65,0.08)", border: "rgba(227,179,65,0.25)" },
  "Extracted": { color: "#8b949e", bg: "rgba(139,148,158,0.08)", border: "rgba(139,148,158,0.25)" },
};

const RISK_COLORS = { Critical: "#f85149", High: "#f0883e", Medium: "#e3b341", Low: "#3fb950" };

export function UndercoverTracker() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? AGENTS : AGENTS.filter(a => a.status === filter || a.riskLevel === filter);

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Undercover Operations</h1>
          <p style={s.sub}>{AGENTS.filter(a => a.status === "Active").length} agents active · {AGENTS.filter(a => a.status === "Compromised").length} compromised</p>
        </div>
        <div style={s.warningBadge}>🔒 TOP SECRET — NEED TO KNOW ONLY</div>
      </div>

      <div style={s.filters}>
        {["All", "Active", "Compromised", "Standby", "Critical", "High"].map(f => (
          <button key={f} style={{ ...s.filterBtn, ...(filter === f ? s.filterActive : {}) }} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div style={s.grid}>
        {filtered.map(agent => {
          const ss = STATUS_STYLES[agent.status] || STATUS_STYLES.Standby;
          return (
            <div key={agent.id} style={{ ...s.card, border: `1px solid ${ss.border}`, background: ss.bg }} onClick={() => setSelected(agent)}>
              {/* Header */}
              <div style={s.cardHeader}>
                <div style={s.codenameWrap}>
                  <div style={s.codenameBadge}>🕵️</div>
                  <div>
                    <div style={s.codename}>{agent.codename}</div>
                    <div style={s.agentId}>{agent.id}</div>
                  </div>
                </div>
                <span style={{ ...s.statusBadge, color: ss.color, border: `1px solid ${ss.border}`, background: "rgba(0,0,0,0.3)" }}>{agent.status}</span>
              </div>

              {/* Cover */}
              <div style={s.coverBox}>
                <div style={s.coverLabel}>COVER IDENTITY</div>
                <div style={s.coverText}>{agent.cover}</div>
              </div>

              {/* Cover strength bar */}
              <div style={s.coverStrength}>
                <div style={s.strengthHeader}>
                  <span style={s.strengthLabel}>Cover Integrity</span>
                  <span style={{ ...s.strengthPct, color: agent.coverStrength >= 70 ? "#3fb950" : agent.coverStrength >= 40 ? "#e3b341" : "#f85149" }}>{agent.coverStrength}%</span>
                </div>
                <div style={s.strengthTrack}>
                  <div style={{ ...s.strengthFill, width: `${agent.coverStrength}%`, background: agent.coverStrength >= 70 ? "#3fb950" : agent.coverStrength >= 40 ? "#e3b341" : "#f85149" }} />
                </div>
              </div>

              <div style={s.infoGrid}>
                <div><div style={s.infoLabel}>Location</div><div style={s.infoVal}>{agent.city}, {agent.country}</div></div>
                <div><div style={s.infoLabel}>Target Case</div><div style={{ ...s.infoVal, color: "#388bfd" }}>{agent.targetCase}</div></div>
                <div><div style={s.infoLabel}>Days Under</div><div style={s.infoVal}>{agent.daysUndercover}</div></div>
                <div><div style={s.infoLabel}>Risk Level</div><div style={{ ...s.infoVal, color: RISK_COLORS[agent.riskLevel] }}>{agent.riskLevel}</div></div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                <div style={s.checkIn}>
                  <span style={s.checkInLabel}>Next check-in: </span>
                  <span style={{ ...s.checkInDate, color: agent.nextCheckIn === "OVERDUE" ? "#f85149" : "var(--text2)" }}>{agent.nextCheckIn}</span>
                </div>
                {agent.nextCheckIn === "OVERDUE" && <span style={s.overdue}>⚠ OVERDUE</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      {selected && (
        <div style={s.overlay} onClick={() => setSelected(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <div>
                <div style={s.modalCodename}>AGENT: {selected.codename}</div>
                <div style={s.modalId}>{selected.id} · {selected.targetCase}</div>
              </div>
              <button style={s.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>

            <div style={{ ...s.coverBox, marginBottom: 16 }}>
              <div style={s.coverLabel}>COVER IDENTITY</div>
              <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>{selected.cover}</div>
            </div>

            <div style={s.detailGrid}>
              {[["Status", selected.status], ["Risk Level", selected.riskLevel], ["Location", `${selected.city}, ${selected.country}`], ["Days Undercover", selected.daysUndercover], ["Last Report", selected.lastReport], ["Next Check-in", selected.nextCheckIn], ["Target Org", selected.targetOrg], ["Cover Integrity", `${selected.coverStrength}%`]].map(([k, v]) => (
                <div key={k}><div style={s.infoLabel}>{k}</div><div style={s.infoVal}>{v}</div></div>
              ))}
            </div>

            <div>
              <div style={s.infoLabel}>INTELLIGENCE GATHERED</div>
              {selected.intel.map((item, i) => (
                <div key={i} style={s.intelItem}>
                  <span style={{ color: "#3fb950", marginRight: 8 }}>▸</span>
                  <span style={{ fontSize: 13, color: "var(--text)" }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={s.classified}>🔒 CLASSIFIED — UNAUTHORIZED ACCESS IS A FEDERAL OFFENSE</div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 4 },
  sub: { fontSize: 13, color: "var(--text2)" },
  warningBadge: { background: "rgba(248,81,73,0.08)", border: "1px solid rgba(248,81,73,0.25)", borderRadius: 6, padding: "6px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#f85149", letterSpacing: "0.05em" },
  filters: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 },
  filterBtn: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 4, padding: "5px 12px", color: "var(--text2)", fontSize: 12, cursor: "pointer" },
  filterActive: { background: "rgba(31,111,235,0.15)", borderColor: "#388bfd", color: "#388bfd" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 },
  card: { borderRadius: 8, padding: 14, cursor: "pointer", transition: "all 0.15s" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  codenameWrap: { display: "flex", alignItems: "center", gap: 10 },
  codenameBadge: { fontSize: 24 },
  codename: { fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: "var(--text)" },
  agentId: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text3)" },
  statusBadge: { fontSize: 10, padding: "3px 9px", borderRadius: 3, fontFamily: "'JetBrains Mono', monospace" },
  coverBox: { background: "rgba(0,0,0,0.2)", borderRadius: 6, padding: "8px 10px", marginBottom: 12 },
  coverLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "var(--text3)", letterSpacing: "0.15em", marginBottom: 4 },
  coverText: { fontSize: 12, color: "var(--text)" },
  coverStrength: { marginBottom: 12 },
  strengthHeader: { display: "flex", justifyContent: "space-between", marginBottom: 4 },
  strengthLabel: { fontSize: 10, color: "var(--text3)" },
  strengthPct: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600 },
  strengthTrack: { height: 5, background: "rgba(0,0,0,0.3)", borderRadius: 2, overflow: "hidden" },
  strengthFill: { height: "100%", borderRadius: 2, transition: "width 0.5s ease" },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  infoLabel: { fontSize: 9, color: "var(--text3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 },
  infoVal: { fontSize: 12, color: "var(--text)", fontWeight: 500 },
  checkIn: { fontSize: 11, color: "var(--text3)" },
  checkInLabel: {},
  checkInDate: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10 },
  overdue: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#f85149", animation: "pulse 1.5s infinite" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 },
  modal: { background: "var(--bg2)", border: "1px solid rgba(248,81,73,0.2)", borderRadius: 10, padding: 24, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  modalCodename: { fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color: "#388bfd" },
  modalId: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text3)", marginTop: 4 },
  closeBtn: { background: "none", border: "none", color: "var(--text2)", cursor: "pointer", fontSize: 18 },
  detailGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 },
  intelItem: { display: "flex", alignItems: "flex-start", padding: "6px 0", borderBottom: "1px solid var(--border2)" },
  classified: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#f85149", textAlign: "center", marginTop: 16, opacity: 0.6, letterSpacing: "0.08em" },
};
