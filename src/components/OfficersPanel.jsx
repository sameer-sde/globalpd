import { RANKS, COUNTRIES } from "../data/data.js";

const STATUS_COLORS = { "On Duty": "#3fb950", "On Scene": "#e3b341", "Available": "#388bfd", "Off Duty": "#484f58" };

export function OfficersPanel({ officers, cases }) {
  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Officers</h1>
          <p style={s.sub}>{officers.length} officers across {[...new Set(officers.map(o => o.country))].length} countries</p>
        </div>
      </div>

      <div style={s.grid}>
        {officers.map(o => {
          const officerCases = cases.filter(c => c.officer === o.name);
          const activeCases = officerCases.filter(c => c.status !== "Closed").length;
          return (
            <div key={o.id} style={s.card}>
              <div style={s.cardTop}>
                <div style={s.avatar}>{o.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={s.name}>{o.name}</div>
                  <div style={s.rank}>{o.rank}</div>
                  <div style={s.country}>🌍 {o.country}</div>
                </div>
                <span style={{ ...s.statusBadge, background: `${STATUS_COLORS[o.status]}15`, color: STATUS_COLORS[o.status], border: `1px solid ${STATUS_COLORS[o.status]}30` }}>
                  {o.status}
                </span>
              </div>
              <div style={s.divider} />
              <div style={s.stats}>
                <div style={s.stat}>
                  <div style={s.statNum}>{o.cases}</div>
                  <div style={s.statLabel}>Cases</div>
                </div>
                <div style={s.stat}>
                  <div style={{ ...s.statNum, color: "#f0883e" }}>{o.arrests}</div>
                  <div style={s.statLabel}>Arrests</div>
                </div>
                <div style={s.stat}>
                  <div style={{ ...s.statNum, color: "#e3b341" }}>{activeCases}</div>
                  <div style={s.statLabel}>Active</div>
                </div>
              </div>
              <div style={s.rankBar}>
                <div style={s.rankBarLabel}>
                  <span style={{ fontSize: 10, color: "var(--text3)" }}>Rank Progress</span>
                  <span style={{ fontSize: 10, color: "var(--text3)" }}>{RANKS.indexOf(o.rank) + 1}/{RANKS.length}</span>
                </div>
                <div style={s.rankBarTrack}>
                  <div style={{ ...s.rankBarFill, width: `${((RANKS.indexOf(o.rank) + 1) / RANKS.length) * 100}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  header: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 4 },
  sub: { fontSize: 13, color: "var(--text2)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 },
  card: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 16 },
  cardTop: { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 },
  avatar: { fontSize: 32, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg3)", borderRadius: 8, border: "1px solid var(--border)", flexShrink: 0 },
  name: { fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 2 },
  rank: { fontSize: 12, color: "#388bfd", marginBottom: 2 },
  country: { fontSize: 11, color: "var(--text2)" },
  statusBadge: { fontSize: 10, padding: "2px 8px", borderRadius: 3, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 },
  divider: { borderTop: "1px solid var(--border2)", margin: "12px 0" },
  stats: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 },
  stat: { textAlign: "center", background: "var(--bg3)", borderRadius: 6, padding: "8px 4px" },
  statNum: { fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 2 },
  statLabel: { fontSize: 10, color: "var(--text3)", letterSpacing: "0.08em" },
  rankBar: {},
  rankBarLabel: { display: "flex", justifyContent: "space-between", marginBottom: 4 },
  rankBarTrack: { height: 4, background: "var(--bg3)", borderRadius: 2, overflow: "hidden" },
  rankBarFill: { height: "100%", background: "linear-gradient(to right, #1f6feb, #388bfd)", borderRadius: 2, transition: "width 0.6s ease" },
};
