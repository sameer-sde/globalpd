import { useState } from "react";

const THREAT_LEVELS = [
  { level: 1, label: "LOW", color: "#3fb950", bg: "rgba(63,185,80,0.08)", desc: "Normal operations. No significant threats detected.", icon: "🟢" },
  { level: 2, label: "GUARDED", color: "#388bfd", bg: "rgba(56,139,253,0.08)", desc: "General risk of criminal activity. Standard vigilance required.", icon: "🔵" },
  { level: 3, label: "ELEVATED", color: "#e3b341", bg: "rgba(227,179,65,0.08)", desc: "Significant risk. Increased surveillance and patrols recommended.", icon: "🟡" },
  { level: 4, label: "HIGH", color: "#f0883e", bg: "rgba(240,136,62,0.08)", desc: "High risk of criminal activity. All units on standby. Borders monitored.", icon: "🟠" },
  { level: 5, label: "CRITICAL", color: "#f85149", bg: "rgba(248,81,73,0.08)", desc: "IMMINENT THREAT. Maximum alert. Emergency protocols activated.", icon: "🔴" },
];

const COUNTRY_THREATS = [
  { country: "United States", level: 3, reason: "Active cybercrime investigation" },
  { country: "United Kingdom", level: 3, reason: "Ongoing drug trafficking case" },
  { country: "Germany", level: 4, reason: "Terrorism investigation active" },
  { country: "UAE", level: 5, reason: "Missing diplomat — critical case" },
  { country: "Mexico", level: 4, reason: "Cartel activity escalating" },
  { country: "India", level: 2, reason: "Fraud case resolved" },
  { country: "Japan", level: 1, reason: "All cases closed" },
  { country: "South Africa", level: 4, reason: "Human trafficking network active" },
];

export function ThreatLevelSystem({ cases, addAlert }) {
  const [globalLevel, setGlobalLevel] = useState(4);
  const [countryThreats, setCountryThreats] = useState(COUNTRY_THREATS);
  const [log, setLog] = useState([
    { time: "14:32", msg: "UAE threat level elevated to CRITICAL — missing diplomat case", level: 5 },
    { time: "12:15", msg: "Germany threat level raised to HIGH — terrorism cell identified", level: 4 },
    { time: "09:00", msg: "Japan threat level lowered to LOW — SkyNet case resolved", level: 1 },
  ]);

  function updateGlobalLevel(newLevel) {
    const prev = THREAT_LEVELS[globalLevel - 1];
    const next = THREAT_LEVELS[newLevel - 1];
    setGlobalLevel(newLevel);
    const msg = `Global threat level ${newLevel > globalLevel ? "RAISED" : "LOWERED"} to ${next.label}`;
    addAlert?.(msg);
    setLog(l => [{ time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), msg, level: newLevel }, ...l]);
  }

  function updateCountryLevel(country, newLevel) {
    setCountryThreats(prev => prev.map(c => c.country === country ? { ...c, level: newLevel } : c));
    const tl = THREAT_LEVELS[newLevel - 1];
    const msg = `${country} threat level updated to ${tl.label}`;
    addAlert?.(msg);
    setLog(l => [{ time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), msg, level: newLevel }, ...l]);
  }

  const current = THREAT_LEVELS[globalLevel - 1];

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.title}>Global Threat Level System</h1>
        <p style={s.sub}>Real-time threat assessment across all jurisdictions</p>
      </div>

      {/* Global level */}
      <div style={{ ...s.globalCard, background: current.bg, borderColor: `${current.color}40` }}>
        <div style={s.globalLeft}>
          <div style={s.globalIcon}>{current.icon}</div>
          <div>
            <div style={s.globalLabel}>GLOBAL THREAT LEVEL</div>
            <div style={{ ...s.globalLevel, color: current.color }}>{current.label}</div>
            <div style={s.globalDesc}>{current.desc}</div>
          </div>
        </div>
        <div style={s.levelButtons}>
          {THREAT_LEVELS.map(tl => (
            <button key={tl.level}
              style={{ ...s.levelBtn, background: globalLevel === tl.level ? `${tl.color}20` : "var(--bg3)", border: `1px solid ${globalLevel === tl.level ? tl.color : "var(--border)"}`, color: globalLevel === tl.level ? tl.color : "var(--text2)" }}
              onClick={() => updateGlobalLevel(tl.level)}>
              {tl.label}
            </button>
          ))}
        </div>
      </div>

      <div style={s.twoCol}>
        {/* Country threats */}
        <div style={s.panel}>
          <div style={s.panelTitle}>Threat by Country</div>
          {countryThreats.map(ct => {
            const tl = THREAT_LEVELS[ct.level - 1];
            return (
              <div key={ct.country} style={s.countryRow}>
                <div style={s.countryLeft}>
                  <span style={{ ...s.threatDot, background: tl.color, boxShadow: `0 0 5px ${tl.color}60` }} />
                  <div>
                    <div style={s.countryName}>{ct.country}</div>
                    <div style={s.countryReason}>{ct.reason}</div>
                  </div>
                </div>
                <div style={s.countryRight}>
                  <span style={{ ...s.tBadge, color: tl.color, border: `1px solid ${tl.color}30`, background: `${tl.color}10` }}>{tl.label}</span>
                  <div style={s.levelMini}>
                    {[1, 2, 3, 4, 5].map(l => (
                      <button key={l}
                        style={{ ...s.miniBtn, background: ct.level >= l ? tl.color : "var(--bg3)", border: "none" }}
                        onClick={() => updateCountryLevel(ct.country, l)}
                        title={`Set to ${THREAT_LEVELS[l - 1].label}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Threat log */}
        <div style={s.panel}>
          <div style={s.panelTitle}>Threat Change Log</div>
          {log.map((entry, i) => {
            const tl = THREAT_LEVELS[entry.level - 1];
            return (
              <div key={i} style={s.logRow}>
                <span style={{ ...s.logDot, background: tl.color }} />
                <div style={{ flex: 1 }}>
                  <div style={s.logMsg}>{entry.msg}</div>
                  <div style={s.logTime}>{entry.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const s = {
  header: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 4 },
  sub: { fontSize: 13, color: "var(--text2)" },
  globalCard: { border: "1px solid", borderRadius: 10, padding: "20px 24px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 },
  globalLeft: { display: "flex", alignItems: "center", gap: 20 },
  globalIcon: { fontSize: 48, filter: "drop-shadow(0 0 12px currentColor)" },
  globalLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text3)", letterSpacing: "0.15em", marginBottom: 6 },
  globalLevel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 700, letterSpacing: "0.05em", marginBottom: 6 },
  globalDesc: { fontSize: 13, color: "var(--text2)", maxWidth: 400 },
  levelButtons: { display: "flex", gap: 6 },
  levelBtn: { padding: "7px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, transition: "all 0.15s" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  panel: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 16 },
  panelTitle: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 14, letterSpacing: "0.03em" },
  countryRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border2)" },
  countryLeft: { display: "flex", alignItems: "center", gap: 10, flex: 1 },
  threatDot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
  countryName: { fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 2 },
  countryReason: { fontSize: 11, color: "var(--text3)" },
  countryRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 },
  tBadge: { fontSize: 10, padding: "2px 8px", borderRadius: 3, fontFamily: "'JetBrains Mono', monospace" },
  levelMini: { display: "flex", gap: 3 },
  miniBtn: { width: 12, height: 12, borderRadius: 2, cursor: "pointer", transition: "all 0.15s" },
  logRow: { display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border2)" },
  logDot: { width: 8, height: 8, borderRadius: "50%", marginTop: 4, flexShrink: 0 },
  logMsg: { fontSize: 12, color: "var(--text)", lineHeight: 1.5, marginBottom: 2 },
  logTime: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text3)" },
};
