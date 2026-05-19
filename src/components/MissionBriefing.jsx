import { useState } from "react";

const API_URL = "https://api.anthropic.com/v1/messages";
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export function MissionBriefing({ cases, officers }) {
  const [selectedCase, setSelectedCase] = useState(cases[0]?.id || "");
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generateBriefing() {
    if (!selectedCase || loading) return;
    setLoading(true);
    setBriefing(null);
    const c = cases.find(x => x.id === selectedCase);
    const officer = officers.find(o => o.name === c?.officer);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: `You are a senior intelligence officer generating mission briefings for GlobalPD. Respond ONLY with valid JSON:
{
  "classification": "TOP SECRET|SECRET|CONFIDENTIAL",
  "mission_name": "Operation [codename]",
  "objective": "one sentence primary objective",
  "background": "2 sentences of context",
  "key_targets": ["target1", "target2"],
  "recommended_team_size": "e.g. 4-6 officers",
  "equipment": ["item1", "item2", "item3"],
  "phases": [{"phase": "Phase 1", "action": "description"}, {"phase": "Phase 2", "action": "description"}, {"phase": "Phase 3", "action": "description"}],
  "risks": ["risk1", "risk2"],
  "success_criteria": "what defines mission success",
  "extraction_plan": "how to exit safely"
}`,
          messages: [{ role: "user", content: `Generate a mission briefing for Case ${c?.id}: ${c?.title}. Type: ${c?.type}. Location: ${c?.city}, ${c?.country}. Priority: ${c?.priority}. Description: ${c?.description}` }]
        })
      });
      const data = await res.json();
      const raw = data.content?.find(b => b.type === "text")?.text || "{}";
      setBriefing(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch {
      setBriefing({ error: "Briefing generation failed." });
    }
    setLoading(false);
  }

  const CLASSIFICATION_COLORS = { "TOP SECRET": "#f85149", "SECRET": "#f0883e", "CONFIDENTIAL": "#e3b341" };

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.title}>Mission Briefing Generator</h1>
        <p style={s.sub}>AI-generated tactical briefings for field operations</p>
      </div>

      <div style={s.layout}>
        <div style={s.controlPanel}>
          <div style={s.panel}>
            <div style={s.panelTitle}>Select Case</div>
            <select style={s.select} value={selectedCase} onChange={e => setSelectedCase(e.target.value)}>
              {cases.map(c => <option key={c.id} value={c.id}>{c.id} — {c.title}</option>)}
            </select>
            {selectedCase && (() => {
              const c = cases.find(x => x.id === selectedCase);
              return c ? (
                <div style={s.casePreview}>
                  <div style={s.previewRow}><span style={s.previewLabel}>Type</span><span style={s.previewVal}>{c.type}</span></div>
                  <div style={s.previewRow}><span style={s.previewLabel}>Location</span><span style={s.previewVal}>{c.city}, {c.country}</span></div>
                  <div style={s.previewRow}><span style={s.previewLabel}>Priority</span><span style={s.previewVal}>{c.priority}</span></div>
                  <div style={s.previewRow}><span style={s.previewLabel}>Officer</span><span style={s.previewVal}>{c.officer || "Unassigned"}</span></div>
                </div>
              ) : null;
            })()}
            <button style={s.generateBtn} onClick={generateBriefing} disabled={loading || !selectedCase}>
              {loading ? "⏳ Generating..." : "📋 Generate Briefing →"}
            </button>
          </div>
        </div>

        <div style={s.briefingCol}>
          {!briefing && !loading && (
            <div style={s.empty}>
              <div style={{ fontSize: 40, opacity: 0.3, marginBottom: 12 }}>📋</div>
              <div style={{ fontSize: 14, color: "var(--text2)" }}>Select a case and generate a mission briefing</div>
            </div>
          )}
          {loading && (
            <div style={s.empty}>
              <div style={{ fontSize: 40, marginBottom: 12, animation: "pulse 1s infinite" }}>📋</div>
              <div style={{ fontSize: 14, color: "var(--text2)" }}>Generating tactical briefing...</div>
            </div>
          )}
          {briefing && !briefing.error && (
            <div style={s.briefingCard}>
              {/* Header */}
              <div style={s.briefingHeader}>
                <div style={{ ...s.classTag, color: CLASSIFICATION_COLORS[briefing.classification] || "#f85149", border: `1px solid ${CLASSIFICATION_COLORS[briefing.classification] || "#f85149"}40` }}>
                  🔒 {briefing.classification}
                </div>
                <div style={s.missionName}>{briefing.mission_name}</div>
                <div style={s.missionDate}>Issued: {new Date().toUTCString().slice(0, 25)} UTC</div>
              </div>

              <div style={s.objectiveBox}>
                <div style={s.objLabel}>PRIMARY OBJECTIVE</div>
                <div style={s.objText}>{briefing.objective}</div>
              </div>

              <div style={s.briefingGrid}>
                <div>
                  <div style={s.sectionTitle}>📖 Background</div>
                  <div style={s.sectionText}>{briefing.background}</div>
                </div>
                <div>
                  <div style={s.sectionTitle}>🎯 Key Targets</div>
                  {briefing.key_targets?.map((t, i) => <div key={i} style={s.listItem}>• {t}</div>)}
                </div>
                <div>
                  <div style={s.sectionTitle}>🛡 Equipment Required</div>
                  {briefing.equipment?.map((e, i) => <div key={i} style={s.listItem}>• {e}</div>)}
                </div>
                <div>
                  <div style={s.sectionTitle}>⚠ Identified Risks</div>
                  {briefing.risks?.map((r, i) => <div key={i} style={{ ...s.listItem, color: "#f85149" }}>• {r}</div>)}
                </div>
              </div>

              <div style={s.sectionTitle}>📍 Mission Phases</div>
              <div style={s.phases}>
                {briefing.phases?.map((p, i) => (
                  <div key={i} style={s.phaseItem}>
                    <div style={s.phaseNum}>{i + 1}</div>
                    <div>
                      <div style={s.phaseLabel}>{p.phase}</div>
                      <div style={s.phaseAction}>{p.action}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={s.briefingGrid}>
                <div>
                  <div style={s.sectionTitle}>✅ Success Criteria</div>
                  <div style={s.sectionText}>{briefing.success_criteria}</div>
                </div>
                <div>
                  <div style={s.sectionTitle}>🚁 Extraction Plan</div>
                  <div style={s.sectionText}>{briefing.extraction_plan}</div>
                </div>
              </div>

              <div style={s.footer}>Team Size: {briefing.recommended_team_size} · GlobalPD Operations Center · CLASSIFIED</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  header: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 4 },
  sub: { fontSize: 13, color: "var(--text2)" },
  layout: { display: "grid", gridTemplateColumns: "280px 1fr", gap: 16 },
  controlPanel: {},
  panel: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 16 },
  panelTitle: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 12 },
  select: { width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", fontSize: 13, marginBottom: 12 },
  casePreview: { background: "var(--bg3)", borderRadius: 6, padding: 12, marginBottom: 12 },
  previewRow: { display: "flex", justifyContent: "space-between", marginBottom: 6 },
  previewLabel: { fontSize: 11, color: "var(--text3)" },
  previewVal: { fontSize: 11, color: "var(--text)", fontWeight: 500 },
  generateBtn: { width: "100%", padding: "11px", background: "var(--blue)", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  briefingCol: {},
  empty: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8 },
  briefingCard: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 24 },
  briefingHeader: { paddingBottom: 16, borderBottom: "1px solid var(--border)", marginBottom: 16 },
  classTag: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: "3px 10px", borderRadius: 3, display: "inline-block", marginBottom: 8 },
  missionName: { fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: "#388bfd", marginBottom: 4 },
  missionDate: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text3)" },
  objectiveBox: { background: "rgba(31,111,235,0.06)", border: "1px solid rgba(31,111,235,0.2)", borderRadius: 6, padding: "12px 16px", marginBottom: 16 },
  objLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#388bfd", letterSpacing: "0.15em", marginBottom: 6 },
  objText: { fontSize: 14, fontWeight: 600, color: "var(--text)", lineHeight: 1.5 },
  briefingGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 8, letterSpacing: "0.03em" },
  sectionText: { fontSize: 13, color: "var(--text)", lineHeight: 1.6, background: "var(--bg3)", borderRadius: 6, padding: "8px 12px" },
  listItem: { fontSize: 12, color: "var(--text)", lineHeight: 1.8 },
  phases: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 },
  phaseItem: { display: "flex", gap: 14, alignItems: "flex-start", background: "var(--bg3)", borderRadius: 6, padding: "10px 14px" },
  phaseNum: { width: 24, height: 24, borderRadius: "50%", background: "var(--blue)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 },
  phaseLabel: { fontSize: 12, fontWeight: 600, color: "#388bfd", marginBottom: 3 },
  phaseAction: { fontSize: 12, color: "var(--text)", lineHeight: 1.5 },
  footer: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text3)", textAlign: "center", paddingTop: 16, borderTop: "1px solid var(--border)", letterSpacing: "0.1em" },
};
