import { PRIORITY_COLORS, STATUS_COLORS } from "../data/data.js";

export function Dashboard({ stats, cases, activity, setPage }) {
  return (
    <div>
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>Command Dashboard</h1>
          <p style={s.pageSub}>Global operations overview — all jurisdictions</p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={s.statGrid}>
        {[
          { label: "Total Cases", val: stats.totalCases, color: "#388bfd", icon: "📁" },
          { label: "Open", val: stats.open, color: "#388bfd", icon: "🔵" },
          { label: "Under Investigation", val: stats.investigation, color: "#e3b341", icon: "🔍" },
          { label: "Arrested", val: stats.arrested, color: "#f0883e", icon: "⛓" },
          { label: "Closed", val: stats.closed, color: "#3fb950", icon: "✅" },
          { label: "Critical Priority", val: stats.critical, color: "#f85149", icon: "🚨" },
          { label: "Officers On Duty", val: `${stats.onDuty}/${stats.totalOfficers}`, color: "#3fb950", icon: "👮" },
          { label: "Total Arrests", val: stats.totalArrests, color: "#f0883e", icon: "🔒" },
        ].map(card => (
          <div key={card.label} style={s.statCard}>
            <div style={s.statCardTop}>
              <span style={s.statCardIcon}>{card.icon}</span>
              <span style={{ ...s.statCardNum, color: card.color }}>{card.val}</span>
            </div>
            <div style={s.statCardLabel}>{card.label}</div>
          </div>
        ))}
      </div>

      <div style={s.twoCol}>
        {/* Recent cases */}
        <div style={s.panel}>
          <div style={s.panelHeader}>
            <span style={s.panelTitle}>Recent Cases</span>
            <button style={s.viewAll} onClick={() => setPage("cases")}>View All →</button>
          </div>
          {cases.slice(0, 5).map(c => (
            <div key={c.id} style={s.caseRow}>
              <div style={s.caseRowLeft}>
                <span style={{ ...s.priority, background: `${PRIORITY_COLORS[c.priority]}20`, color: PRIORITY_COLORS[c.priority], border: `1px solid ${PRIORITY_COLORS[c.priority]}40` }}>{c.priority}</span>
                <div>
                  <div style={s.caseTitle}>{c.title}</div>
                  <div style={s.caseMeta}>{c.id} · {c.country} · {c.type}</div>
                </div>
              </div>
              <span style={{ ...s.status, background: `${STATUS_COLORS[c.status]}15`, color: STATUS_COLORS[c.status], border: `1px solid ${STATUS_COLORS[c.status]}30` }}>{c.status}</span>
            </div>
          ))}
        </div>

        {/* Activity feed */}
        <div style={s.panel}>
          <div style={s.panelHeader}>
            <span style={s.panelTitle}>Live Activity Feed</span>
            <span className="live-dot" />
          </div>
          {activity.slice(0, 8).map((a, i) => (
            <div key={a.id || i} style={s.activityRow}>
              <span style={s.activityIcon}>{typeIcon(a.type)}</span>
              <div style={{ flex: 1 }}>
                <div style={s.activityMsg}>{a.msg}</div>
                <div style={s.activityTime}>{a.time} {a.country && `· ${a.country}`}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function typeIcon(type) {
  if (type === "arrest") return "⛓";
  if (type === "alert") return "🚨";
  if (type === "new") return "📁";
  if (type === "closed") return "✅";
  if (type === "dispatch") return "📡";
  return "📋";
}

const s = {
  pageHeader: { marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  pageTitle: { fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 4 },
  pageSub: { fontSize: 13, color: "var(--text2)" },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 },
  statCard: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "16px 14px" },
  statCardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  statCardIcon: { fontSize: 18 },
  statCardNum: { fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 700 },
  statCardLabel: { fontSize: 11, color: "var(--text2)", letterSpacing: "0.05em" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  panel: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 16 },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  panelTitle: { fontSize: 13, fontWeight: 600, color: "var(--text)", letterSpacing: "0.03em" },
  viewAll: { background: "none", border: "none", color: "#388bfd", fontSize: 12, cursor: "pointer" },
  caseRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border2)" },
  caseRowLeft: { display: "flex", alignItems: "center", gap: 10, flex: 1 },
  priority: { fontSize: 10, padding: "2px 8px", borderRadius: 3, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 },
  status: { fontSize: 10, padding: "2px 8px", borderRadius: 3, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 },
  caseTitle: { fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 2 },
  caseMeta: { fontSize: 11, color: "var(--text2)" },
  activityRow: { display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border2)" },
  activityIcon: { fontSize: 14, flexShrink: 0, marginTop: 2 },
  activityMsg: { fontSize: 12, color: "var(--text)", lineHeight: 1.5 },
  activityTime: { fontSize: 11, color: "var(--text3)", marginTop: 2 },
};
