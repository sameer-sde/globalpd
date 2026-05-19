import { useState } from "react";

const API_URL = "https://api.anthropic.com/v1/messages";
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const TEMPLATES = [
  "Cybercrime suspect who hacked 3 banks, leaves no traces, works at night, demands Bitcoin",
  "Drug cartel enforcer spotted near border, military background, travels with fake passport",
  "White collar fraudster posing as investment banker, extremely well dressed, British accent",
  "Terrorist cell leader, very religious, uses encrypted messaging, recruits young men online",
];

export function SuspectProfiler({ cases }) {
  const [description, setDescription] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  async function generateProfile() {
    if (!description.trim() || loading) return;
    setLoading(true);
    setProfile(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: `You are an elite criminal profiler for GlobalPD — a fictional international police platform. Generate detailed suspect profiles based on crime descriptions.

Respond ONLY with valid JSON, no markdown:
{
  "codename": "one word codename",
  "threat_level": "Critical|High|Medium|Low",
  "age_range": "e.g. 30-40",
  "likely_gender": "string",
  "nationality_guess": "string",
  "education": "string",
  "occupation_cover": "likely legitimate job used as cover",
  "psychological_profile": "2-3 sentences",
  "modus_operandi": "2-3 sentences about how they operate",
  "likely_hideout": "type of location they'd use",
  "known_weaknesses": ["weakness1", "weakness2", "weakness3"],
  "recommended_approach": "2 sentences on how to catch them",
  "danger_rating": 1-10,
  "notes": "any additional intelligence notes"
}`,
          messages: [{ role: "user", content: `Generate a suspect profile for: ${description}` }]
        })
      });
      const data = await res.json();
      const raw = data.content?.find(b => b.type === "text")?.text || "{}";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setProfile(parsed);
      setHistory(prev => [{ description, profile: parsed, id: Date.now() }, ...prev.slice(0, 4)]);
    } catch {
      setProfile({ error: "Profile generation failed. Please retry." });
    }
    setLoading(false);
  }

  const THREAT_COLORS = { Critical: "#f85149", High: "#f0883e", Medium: "#e3b341", Low: "#3fb950" };

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>AI Suspect Profiler</h1>
          <p style={s.sub}>Describe a crime or suspect — AI builds a complete psychological and criminal profile</p>
        </div>
        <div style={s.aiBadge}>🧠 AI POWERED</div>
      </div>

      <div style={s.layout}>
        <div style={s.inputCol}>
          <div style={s.panel}>
            <div style={s.panelTitle}>Crime / Suspect Description</div>
            <textarea style={s.textarea} value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Describe the crime, suspect behavior, or known details..." rows={5} />
            <button style={s.generateBtn} onClick={generateProfile} disabled={loading || !description.trim()}>
              {loading ? "⏳ Generating Profile..." : "🧠 Generate Profile →"}
            </button>

            <div style={{ marginTop: 20 }}>
              <div style={s.panelTitle}>Quick Templates</div>
              {TEMPLATES.map((t, i) => (
                <button key={i} style={s.templateBtn} onClick={() => setDescription(t)}>
                  <span style={{ color: "#388bfd", flexShrink: 0 }}>⚡</span> {t}
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div style={s.panel}>
              <div style={s.panelTitle}>Recent Profiles</div>
              {history.map(h => (
                <button key={h.id} style={s.historyBtn} onClick={() => { setProfile(h.profile); setDescription(h.description); }}>
                  <span style={{ ...s.threatDot, background: THREAT_COLORS[h.profile.threat_level] || "#388bfd" }} />
                  <div>
                    <div style={s.historyCodename}>{h.profile.codename}</div>
                    <div style={s.historyDesc}>{h.description.slice(0, 60)}...</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile output */}
        <div style={s.profileCol}>
          {!profile && !loading && (
            <div style={s.emptyState}>
              <div style={s.emptyIcon}>🕵️</div>
              <div style={s.emptyTitle}>No profile generated yet</div>
              <div style={s.emptySub}>Enter a description and click Generate Profile</div>
            </div>
          )}

          {loading && (
            <div style={s.emptyState}>
              <div style={{ fontSize: 40, marginBottom: 16, animation: "pulse 1s infinite" }}>🧠</div>
              <div style={s.emptyTitle}>Analyzing behavioral patterns...</div>
              <div style={s.emptySub}>Cross-referencing criminal databases</div>
            </div>
          )}

          {profile && !profile.error && (
            <div style={s.profileCard}>
              {/* Header */}
              <div style={s.profileHeader}>
                <div style={s.profileAvatar}>👤</div>
                <div style={{ flex: 1 }}>
                  <div style={s.codename}>CODENAME: {profile.codename}</div>
                  <div style={s.profileId}>SUSPECT PROFILE · AI GENERATED · CLASSIFIED</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                  <span style={{ ...s.threatBadge, background: `${THREAT_COLORS[profile.threat_level]}15`, color: THREAT_COLORS[profile.threat_level], border: `1px solid ${THREAT_COLORS[profile.threat_level]}30` }}>
                    {profile.threat_level} THREAT
                  </span>
                  <span style={s.dangerRating}>DANGER: {profile.danger_rating}/10</span>
                </div>
              </div>

              {/* Danger bar */}
              <div style={s.dangerBarWrap}>
                <div style={s.dangerBarTrack}>
                  <div style={{ ...s.dangerBarFill, width: `${profile.danger_rating * 10}%`, background: profile.danger_rating >= 8 ? "#f85149" : profile.danger_rating >= 6 ? "#f0883e" : "#e3b341" }} />
                </div>
              </div>

              {/* Basic info grid */}
              <div style={s.infoGrid}>
                {[
                  ["Age Range", profile.age_range],
                  ["Gender", profile.likely_gender],
                  ["Nationality", profile.nationality_guess],
                  ["Education", profile.education],
                  ["Cover Occupation", profile.occupation_cover],
                  ["Likely Hideout", profile.likely_hideout],
                ].map(([k, v]) => (
                  <div key={k} style={s.infoField}>
                    <div style={s.infoLabel}>{k}</div>
                    <div style={s.infoVal}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Sections */}
              {[
                ["🧠 Psychological Profile", profile.psychological_profile],
                ["🎯 Modus Operandi", profile.modus_operandi],
                ["🔍 Recommended Approach", profile.recommended_approach],
                ["📋 Intelligence Notes", profile.notes],
              ].map(([title, content]) => (
                <div key={title} style={s.section}>
                  <div style={s.sectionTitle}>{title}</div>
                  <div style={s.sectionContent}>{content}</div>
                </div>
              ))}

              {/* Weaknesses */}
              {profile.known_weaknesses?.length > 0 && (
                <div style={s.section}>
                  <div style={s.sectionTitle}>⚠ Known Weaknesses</div>
                  <div style={s.weaknessRow}>
                    {profile.known_weaknesses.map((w, i) => (
                      <span key={i} style={s.weaknessTag}>{w}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {profile?.error && (
            <div style={s.errorBox}>{profile.error}</div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 4 },
  sub: { fontSize: 13, color: "var(--text2)" },
  aiBadge: { background: "rgba(163,113,247,0.1)", border: "1px solid rgba(163,113,247,0.3)", borderRadius: 6, padding: "6px 12px", fontSize: 11, color: "#a371f7", fontFamily: "'JetBrains Mono', monospace" },
  layout: { display: "grid", gridTemplateColumns: "340px 1fr", gap: 16, alignItems: "start" },
  inputCol: { display: "flex", flexDirection: "column", gap: 14 },
  profileCol: { minHeight: 400 },
  panel: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 16 },
  panelTitle: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 12, letterSpacing: "0.03em" },
  textarea: { width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 12px", color: "var(--text)", fontSize: 13, resize: "vertical", marginBottom: 10, lineHeight: 1.6 },
  generateBtn: { width: "100%", padding: "11px", background: "var(--blue)", border: "none", borderRadius: 6, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  templateBtn: { width: "100%", textAlign: "left", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text2)", fontSize: 12, cursor: "pointer", marginBottom: 6, lineHeight: 1.5, display: "flex", gap: 8 },
  historyBtn: { width: "100%", textAlign: "left", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 12px", cursor: "pointer", marginBottom: 6, display: "flex", gap: 10, alignItems: "center" },
  threatDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  historyCodename: { fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 2 },
  historyDesc: { fontSize: 11, color: "var(--text3)" },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8 },
  emptyIcon: { fontSize: 48, marginBottom: 16, opacity: 0.4 },
  emptyTitle: { fontSize: 15, fontWeight: 600, color: "var(--text2)", marginBottom: 6 },
  emptySub: { fontSize: 13, color: "var(--text3)" },
  profileCard: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 20 },
  profileHeader: { display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid var(--border)" },
  profileAvatar: { width: 52, height: 52, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 },
  codename: { fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: "#388bfd", marginBottom: 4 },
  profileId: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text3)", letterSpacing: "0.12em" },
  threatBadge: { fontSize: 10, padding: "3px 10px", borderRadius: 3, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 },
  dangerRating: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text3)" },
  dangerBarWrap: { marginBottom: 16 },
  dangerBarTrack: { height: 4, background: "var(--bg3)", borderRadius: 2, overflow: "hidden" },
  dangerBarFill: { height: "100%", borderRadius: 2, transition: "width 0.6s ease" },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 },
  infoField: { background: "var(--bg3)", borderRadius: 6, padding: "10px 12px" },
  infoLabel: { fontSize: 10, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 },
  infoVal: { fontSize: 13, fontWeight: 500, color: "var(--text)" },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6, letterSpacing: "0.03em" },
  sectionContent: { fontSize: 13, color: "var(--text)", lineHeight: 1.7, background: "var(--bg3)", borderRadius: 6, padding: "10px 12px" },
  weaknessRow: { display: "flex", flexWrap: "wrap", gap: 6 },
  weaknessTag: { background: "rgba(248,81,73,0.1)", border: "1px solid rgba(248,81,73,0.2)", borderRadius: 4, padding: "3px 10px", fontSize: 11, color: "#f85149" },
  errorBox: { background: "rgba(248,81,73,0.08)", border: "1px solid rgba(248,81,73,0.2)", borderRadius: 6, padding: 14, fontSize: 13, color: "#f85149" },
};
