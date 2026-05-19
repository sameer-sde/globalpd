const NAV = [
  { id: "dashboard", icon: "⊞", label: "Dashboard", group: "OVERVIEW" },
  { id: "map", icon: "🌍", label: "World Map", group: "OVERVIEW" },
  { id: "threat", icon: "🚨", label: "Threat Levels", group: "OVERVIEW" },
  { id: "cases", icon: "📁", label: "Cases", group: "OPERATIONS" },
  { id: "suspects", icon: "👤", label: "Suspects", group: "OPERATIONS" },
  { id: "wanted", icon: "🎯", label: "Wanted Wall", group: "OPERATIONS" },
  { id: "evidence", icon: "🔒", label: "Evidence Vault", group: "OPERATIONS" },
  { id: "timeline", icon: "⏱", label: "Case Timeline", group: "OPERATIONS" },
  { id: "linkboard", icon: "🔗", label: "Case Link Board", group: "OPERATIONS" },
  { id: "undercover", icon: "🕵️", label: "Undercover Ops", group: "OPERATIONS" },
  { id: "chat", icon: "💬", label: "Officer Chat", group: "COMMS" },
  { id: "dispatch", icon: "📡", label: "Dispatch", group: "COMMS" },
  { id: "profiler", icon: "🧠", label: "AI Profiler", group: "INTELLIGENCE" },
  { id: "mission", icon: "📋", label: "Mission Briefing", group: "INTELLIGENCE" },
  { id: "bulletin", icon: "📰", label: "Intel Bulletin", group: "INTELLIGENCE" },
  { id: "analytics", icon: "📊", label: "Analytics", group: "INTELLIGENCE" },
  { id: "analyst", icon: "🤖", label: "AI Analyst", group: "INTELLIGENCE" },
  { id: "officers", icon: "👮", label: "Officers", group: "PERSONNEL" },
];

const GROUPS = ["OVERVIEW", "OPERATIONS", "COMMS", "INTELLIGENCE", "PERSONNEL"];

export function Sidebar({ page, setPage, stats, officer }) {
  return (
    <aside style={s.sidebar}>
      <div style={s.logo}>
        <div style={s.logoIcon}>🔰</div>
        <div>
          <div style={s.logoTitle}>GlobalPD</div>
          <div style={s.logoSub}>OPERATIONS CENTER</div>
        </div>
      </div>

      {officer && (
        <div style={s.officerCard}>
          <span style={{ fontSize: 18 }}>{officer.avatar}</span>
          <div>
            <div style={s.officerName}>{officer.name}</div>
            <div style={s.officerRank}>{officer.rank}</div>
          </div>
        </div>
      )}

      <nav style={s.nav}>
        {GROUPS.map(group => (
          <div key={group}>
            <div style={s.groupLabel}>{group}</div>
            {NAV.filter(n => n.group === group).map(item => (
              <button key={item.id}
                style={{ ...s.navBtn, ...(page === item.id ? s.navActive : {}) }}
                onClick={() => setPage(item.id)}>
                <span style={s.navIcon}>{item.icon}</span>
                <span style={s.navLabel}>{item.label}</span>
                {item.id === "cases" && stats.critical > 0 && <span style={s.navBadge}>{stats.critical}</span>}
                {item.id === "undercover" && <span style={{ ...s.navBadge, background: "#a371f7" }}>5</span>}
                {item.id === "wanted" && <span style={{ ...s.navBadge, background: "#f85149" }}>6</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div style={s.bottomStats}>
        <div style={s.statRow}><span style={s.statLabel}>Active Cases</span><span style={s.statVal}>{stats.open + stats.investigation}</span></div>
        <div style={s.statRow}><span style={s.statLabel}>Arrests</span><span style={{ ...s.statVal, color: "#f0883e" }}>{stats.totalArrests}</span></div>
        <div style={s.statRow}><span style={s.statLabel}>Closed</span><span style={{ ...s.statVal, color: "#3fb950" }}>{stats.closed}</span></div>
        <div style={s.divider} />
        <div style={s.versionTag}>v5.0.0 · CLASSIFIED</div>
      </div>
    </aside>
  );
}

const s = {
  sidebar: { width: 210, background: "var(--bg2)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0 },
  logo: { display: "flex", alignItems: "center", gap: 10, padding: "14px", borderBottom: "1px solid var(--border)" },
  logoIcon: { fontSize: 20, filter: "drop-shadow(0 0 6px rgba(31,111,235,0.5))" },
  logoTitle: { fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: "#388bfd", letterSpacing: "0.05em" },
  logoSub: { fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "var(--text3)", letterSpacing: "0.2em", marginTop: 2 },
  officerCard: { display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: "1px solid var(--border)", background: "rgba(31,111,235,0.04)" },
  officerName: { fontSize: 12, fontWeight: 600, color: "var(--text)" },
  officerRank: { fontSize: 10, color: "var(--text3)" },
  nav: { flex: 1, padding: "8px 6px", display: "flex", flexDirection: "column", overflowY: "auto" },
  groupLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "var(--text3)", letterSpacing: "0.2em", padding: "10px 8px 4px" },
  navBtn: { display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 5, border: "none", background: "transparent", color: "var(--text2)", fontSize: 12, cursor: "pointer", width: "100%", textAlign: "left", transition: "all 0.15s" },
  navActive: { background: "rgba(31,111,235,0.15)", color: "#388bfd", border: "1px solid rgba(31,111,235,0.2)" },
  navIcon: { fontSize: 13, width: 16, textAlign: "center" },
  navLabel: { flex: 1 },
  navBadge: { background: "#f85149", color: "#fff", fontSize: 9, borderRadius: 10, padding: "1px 5px", fontFamily: "'JetBrains Mono', monospace" },
  bottomStats: { padding: "12px", borderTop: "1px solid var(--border)" },
  statRow: { display: "flex", justifyContent: "space-between", marginBottom: 6 },
  statLabel: { fontSize: 10, color: "var(--text3)" },
  statVal: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: "var(--text)" },
  divider: { borderTop: "1px solid var(--border)", margin: "8px 0" },
  versionTag: { fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "var(--text3)", letterSpacing: "0.1em", textAlign: "center" },
};
