import { useState } from "react";

const API_URL = "https://api.anthropic.com/v1/messages";
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export function IntelBulletin({ cases, officers }) {
  const [bulletin, setBulletin] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generateBulletin() {
    if (loading) return;
    setLoading(true);
    setBulletin(null);

    const summary = cases.map(c => `${c.id}: ${c.title} (${c.type}, ${c.country}, ${c.priority}, ${c.status}, ${c.arrests} arrests)`).join("\n");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a senior intelligence analyst for GlobalPD. Generate a daily intelligence bulletin. Respond ONLY with valid JSON:
{
  "bulletin_id": "GPD-BULL-XXXX",
  "threat_summary": "2 sentence overall global threat assessment",
  "top_priority": "most urgent case/situation in one sentence",
  "regional_updates": [
    {"region": "name", "status": "Active|Stable|Critical", "update": "one sentence"},
    {"region": "name", "status": "Active|Stable|Critical", "update": "one sentence"},
    {"region": "name", "status": "Active|Stable|Critical", "update": "one sentence"}
  ],
  "key_developments": ["development1", "development2", "development3"],
  "recommended_actions": ["action1", "action2", "action3"],
  "watch_list": ["person or org 1", "person or org 2"],
  "closing_assessment": "1 sentence closing note"
}`,
          messages: [{ role: "user", content: `Generate today's intelligence bulletin based on these active cases:\n${summary}\n\nDate: ${new Date().toDateString()}` }]
        })
      });
      const data = await res.json();
      const raw = data.content?.find(b => b.type === "text")?.text || "{}";
      setBulletin(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch {
      setBulletin({ error: "Bulletin generation failed." });
    }
    setLoading(false);
  }

  const STATUS_COLORS = { Active: "#e3b341", Stable: "#3fb950", Critical: "#f85149" };

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Intelligence Bulletin</h1>
          <p style={s.sub}>AI-generated daily intelligence report across all jurisdictions</p>
        </div>
        <button style={s.generateBtn} onClick={generateBulletin} disabled={loading}>
          {loading ? "⏳ Generating..." : "📰 Generate Today's Bulletin"}
        </button>
      </div>

      {!bulletin && !loading && (
        <div style={s.empty}>
          <div style={{ fontSize: 48, opacity: 0.2, marginBottom: 16 }}>📰</div>
          <div style={{ fontSize: 15, color: "var(--text2)", marginBottom: 6 }}>No bulletin generated yet</div>
          <div style={{ fontSize: 13, color: "var(--text3)" }}>Click "Generate Today's Bulletin" to create an AI intelligence report</div>
        </div>
      )}

      {loading && (
        <div style={s.empty}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: "pulse 1s infinite" }}>📰</div>
          <div style={{ fontSize: 15, color: "var(--text2)" }}>Compiling intelligence data...</div>
        </div>
      )}

      {bulletin && !bulletin.error && (
        <div style={s.bulletin}>
          {/* Masthead */}
          <div style={s.masthead}>
            <div style={s.mastheadLeft}>
              <div style={s.mastheadTitle}>GLOBALPD INTELLIGENCE BULLETIN</div>
              <div style={s.mastheadId}>{bulletin.bulletin_id} · {new Date().toUTCString().slice(0, 25)} UTC · TOP SECRET</div>
            </div>
            <div style={s.mastheadRight}>🔰 CLASSIFIED</div>
          </div>

          {/* Threat summary */}
          <div style={s.threatBox}>
            <div style={s.threatLabel}>THREAT ASSESSMENT</div>
            <div style={s.threatText}>{bulletin.threat_summary}</div>
          </div>

          {/* Top priority */}
          <div style={s.priorityBox}>
            <span style={s.priorityLabel}>🚨 TOP PRIORITY:</span>
            <span style={s.priorityText}>{bulletin.top_priority}</span>
          </div>

          <div style={s.twoCol}>
            {/* Regional updates */}
            <div style={s.section}>
              <div style={s.sectionTitle}>🌍 Regional Updates</div>
              {bulletin.regional_updates?.map((r, i) => (
                <div key={i} style={s.regionRow}>
                  <span style={{ ...s.regionStatus, color: STATUS_COLORS[r.status] || "#388bfd", border: `1px solid ${STATUS_COLORS[r.status]}30`, background: `${STATUS_COLORS[r.status]}10` }}>{r.status}</span>
                  <div>
                    <div style={s.regionName}>{r.region}</div>
                    <div style={s.regionUpdate}>{r.update}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Key developments */}
            <div style={s.section}>
              <div style={s.sectionTitle}>📌 Key Developments</div>
              {bulletin.key_developments?.map((d, i) => (
                <div key={i} style={s.devItem}>
                  <span style={s.devBullet}>▸</span>
                  <span style={s.devText}>{d}</span>
                </div>
              ))}
            </div>

            {/* Recommended actions */}
            <div style={s.section}>
              <div style={s.sectionTitle}>⚡ Recommended Actions</div>
              {bulletin.recommended_actions?.map((a, i) => (
                <div key={i} style={{ ...s.devItem, borderColor: "rgba(56,139,253,0.2)" }}>
                  <span style={{ ...s.devBullet, color: "#388bfd" }}>→</span>
                  <span style={s.devText}>{a}</span>
                </div>
              ))}
            </div>

            {/* Watch list */}
            <div style={s.section}>
              <div style={s.sectionTitle}>👁 Watch List</div>
              {bulletin.watch_list?.map((w, i) => (
                <div key={i} style={s.watchItem}>
                  <span style={{ fontSize: 14 }}>⚠</span>
                  <span style={s.watchText}>{w}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={s.closing}>
            <span style={s.closingLabel}>CLOSING ASSESSMENT: </span>
            {bulletin.closing_assessment}
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 4 },
  sub: { fontSize: 13, color: "var(--text2)" },
  generateBtn: { background: "var(--blue)", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600, padding: "10px 18px", cursor: "pointer", flexShrink: 0 },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, textAlign: "center" },
  bulletin: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" },
  masthead: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg3)", padding: "16px 24px", borderBottom: "1px solid var(--border)" },
  mastheadLeft: {},
  mastheadTitle: { fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: "#388bfd", letterSpacing: "0.08em", marginBottom: 4 },
  mastheadId: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text3)", letterSpacing: "0.06em" },
  mastheadRight: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#f85149", border: "1px solid rgba(248,81,73,0.3)", padding: "4px 10px", borderRadius: 4 },
  threatBox: { background: "rgba(31,111,235,0.05)", borderBottom: "1px solid var(--border)", padding: "16px 24px" },
  threatLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#388bfd", letterSpacing: "0.15em", marginBottom: 6 },
  threatText: { fontSize: 14, color: "var(--text)", lineHeight: 1.6 },
  priorityBox: { background: "rgba(248,81,73,0.06)", borderBottom: "1px solid var(--border)", padding: "12px 24px", display: "flex", gap: 10, alignItems: "flex-start" },
  priorityLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#f85149", flexShrink: 0 },
  priorityText: { fontSize: 13, color: "var(--text)", lineHeight: 1.5 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 },
  section: { padding: "18px 24px", borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border)" },
  sectionTitle: { fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 12, letterSpacing: "0.03em" },
  regionRow: { display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" },
  regionStatus: { fontSize: 10, padding: "2px 7px", borderRadius: 3, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, marginTop: 2 },
  regionName: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 2 },
  regionUpdate: { fontSize: 12, color: "var(--text2)", lineHeight: 1.5 },
  devItem: { display: "flex", gap: 8, padding: "6px 0", borderBottom: "1px solid var(--border2)" },
  devBullet: { color: "#3fb950", flexShrink: 0, fontWeight: 700 },
  devText: { fontSize: 12, color: "var(--text)", lineHeight: 1.5 },
  watchItem: { display: "flex", gap: 8, padding: "6px 0", alignItems: "center" },
  watchText: { fontSize: 12, color: "#f0883e" },
  closing: { padding: "14px 24px", background: "var(--bg3)", fontSize: 13, color: "var(--text2)", lineHeight: 1.6 },
  closingLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text3)", letterSpacing: "0.1em", marginRight: 8 },
};
