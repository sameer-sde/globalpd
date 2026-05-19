import { PRIORITY_COLORS, STATUS_COLORS, CRIME_TYPES } from "../data/data.js";

function Bar({ label, value, max, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={b.row}>
      <div style={b.label}>{label}</div>
      <div style={b.track}>
        <div style={{ ...b.fill, width: `${pct}%`, background: color }} />
      </div>
      <div style={b.val}>{value}</div>
    </div>
  );
}

function DonutChart({ data, size = 120 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  const r = 40, cx = size / 2, cy = size / 2;
  const circumference = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg3)" strokeWidth="16" />
      {data.map((d, i) => {
        const pct = d.value / total;
        const dash = pct * circumference;
        const gap = circumference - dash;
        const rotation = offset * 360 - 90;
        offset += pct;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={d.color} strokeWidth="16"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={0}
            transform={`rotate(${rotation} ${cx} ${cy})`}
          />
        );
      })}
      <text x={cx} y={cy + 5} textAnchor="middle" fill="var(--text)" fontSize="14" fontWeight="700" fontFamily="JetBrains Mono">{total}</text>
    </svg>
  );
}

export function AnalyticsPanel({ cases }) {
  const byStatus = ["Open", "Investigation", "Arrested", "Closed"].map(s => ({
    label: s, value: cases.filter(c => c.status === s).length, color: STATUS_COLORS[s]
  }));

  const byPriority = ["Critical", "High", "Medium", "Low"].map(p => ({
    label: p, value: cases.filter(c => c.priority === p).length, color: PRIORITY_COLORS[p]
  }));

  const byType = CRIME_TYPES.map(t => ({
    label: t, value: cases.filter(c => c.type === t).length
  })).filter(x => x.value > 0).sort((a, b) => b.value - a.value);

  const byCountry = Object.entries(
    cases.reduce((acc, c) => { acc[c.country] = (acc[c.country] || 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const maxType = Math.max(...byType.map(x => x.value), 1);
  const maxCountry = Math.max(...byCountry.map(x => x[1]), 1);

  const solveRate = Math.round((cases.filter(c => c.status === "Closed").length / cases.length) * 100);
  const arrestRate = Math.round((cases.filter(c => c.status === "Arrested" || c.status === "Closed").length / cases.length) * 100);

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.title}>Crime Analytics</h1>
        <p style={s.sub}>Statistical overview across all jurisdictions</p>
      </div>

      {/* KPI row */}
      <div style={s.kpiRow}>
        {[
          { label: "Solve Rate", val: `${solveRate}%`, color: "#3fb950", desc: "Cases closed" },
          { label: "Arrest Rate", val: `${arrestRate}%`, color: "#f0883e", desc: "Suspects in custody" },
          { label: "Avg Suspects/Case", val: (cases.reduce((a, c) => a + c.suspects, 0) / cases.length).toFixed(1), color: "#388bfd", desc: "Per active case" },
          { label: "Total Arrests", val: cases.reduce((a, c) => a + c.arrests, 0), color: "#a371f7", desc: "Across all cases" },
        ].map(k => (
          <div key={k.label} style={s.kpiCard}>
            <div style={{ ...s.kpiVal, color: k.color }}>{k.val}</div>
            <div style={s.kpiLabel}>{k.label}</div>
            <div style={s.kpiDesc}>{k.desc}</div>
          </div>
        ))}
      </div>

      <div style={s.grid}>
        {/* Status donut */}
        <div style={s.panel}>
          <div style={s.panelTitle}>Cases by Status</div>
          <div style={s.donutWrap}>
            <DonutChart data={byStatus} size={140} />
            <div style={s.donutLegend}>
              {byStatus.map(d => (
                <div key={d.label} style={s.legendRow}>
                  <span style={{ ...s.legendDot, background: d.color }} />
                  <span style={s.legendLabel}>{d.label}</span>
                  <span style={s.legendVal}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority donut */}
        <div style={s.panel}>
          <div style={s.panelTitle}>Cases by Priority</div>
          <div style={s.donutWrap}>
            <DonutChart data={byPriority} size={140} />
            <div style={s.donutLegend}>
              {byPriority.map(d => (
                <div key={d.label} style={s.legendRow}>
                  <span style={{ ...s.legendDot, background: d.color }} />
                  <span style={s.legendLabel}>{d.label}</span>
                  <span style={s.legendVal}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Crime types bar */}
        <div style={s.panel}>
          <div style={s.panelTitle}>Crime Type Distribution</div>
          {byType.map((t, i) => (
            <Bar key={t.label} label={t.label} value={t.value} max={maxType}
              color={`hsl(${200 + i * 25}, 70%, 55%)`} />
          ))}
        </div>

        {/* Country bar */}
        <div style={s.panel}>
          <div style={s.panelTitle}>Cases by Country</div>
          {byCountry.map(([country, count], i) => (
            <Bar key={country} label={country} value={count} max={maxCountry}
              color={`hsl(${140 + i * 20}, 60%, 50%)`} />
          ))}
        </div>
      </div>
    </div>
  );
}

const b = {
  row: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 },
  label: { fontSize: 11, color: "var(--text2)", width: 130, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  track: { flex: 1, height: 6, background: "var(--bg3)", borderRadius: 3, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 3, transition: "width 0.6s ease" },
  val: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--text)", width: 20, textAlign: "right" },
};

const s = {
  header: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 4 },
  sub: { fontSize: 13, color: "var(--text2)" },
  kpiRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 },
  kpiCard: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "16px 14px", textAlign: "center" },
  kpiVal: { fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700, marginBottom: 4 },
  kpiLabel: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 2 },
  kpiDesc: { fontSize: 11, color: "var(--text3)" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 },
  panel: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 16 },
  panelTitle: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 14, letterSpacing: "0.03em" },
  donutWrap: { display: "flex", alignItems: "center", gap: 16 },
  donutLegend: { flex: 1 },
  legendRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  legendDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  legendLabel: { fontSize: 12, color: "var(--text2)", flex: 1 },
  legendVal: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--text)", fontWeight: 600 },
};
