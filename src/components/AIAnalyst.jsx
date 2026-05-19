import { useState } from "react";

const API_URL = "https://api.anthropic.com/v1/messages";
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const TEMPLATES = [
  "Analyze patterns in the cybercrime cases and suggest the most likely suspect profile",
  "What connections might exist between the drug trafficking cases in UK and Mexico?",
  "Generate an official case report for the Missing Diplomat case in Dubai",
  "Predict the next likely target based on the organized crime patterns",
  "Recommend which cases should be prioritized for immediate action",
];

export function AIAnalyst({ cases, officers }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "GlobalPD AI Analyst online. I have access to all active case files and officer data. How can I assist your investigation?" }
  ]);
  const [loading, setLoading] = useState(false);

  async function analyze(q) {
    const question = q || input.trim();
    if (!question || loading) return;
    setInput("");
    setLoading(true);

    const newMessages = [...messages, { role: "user", content: question }];
    setMessages(newMessages);

    const casesSummary = cases.map(c => `${c.id}: ${c.title} (${c.type}, ${c.country}, ${c.priority} priority, ${c.status})`).join("\n");
    const officersSummary = officers.map(o => `${o.name} — ${o.rank}, ${o.country}, ${o.status}, ${o.arrests} arrests`).join("\n");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          system: `You are an elite AI Crime Analyst for GlobalPD — a fictional international police operations platform. You have access to the following case files and officer data.

ACTIVE CASES:
${casesSummary}

OFFICERS:
${officersSummary}

Your role:
- Analyze crime patterns, connections between cases, suspect profiles
- Generate professional police reports and recommendations
- Provide strategic intelligence briefings
- Suggest resource allocation and officer assignments
- Be concise, professional, and use police/intelligence terminology
- Format responses clearly with sections where appropriate
- This is a fictional platform for demonstration purposes`,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "Analysis unavailable.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "⚠ Connection error. Please retry." }]);
    }
    setLoading(false);
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>AI Crime Analyst</h1>
          <p style={s.sub}>Powered by advanced AI — pattern analysis, case reports, strategic intelligence</p>
        </div>
        <div style={s.statusBadge}>
          <span className="live-dot" />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#3fb950" }}>ANALYST ONLINE</span>
        </div>
      </div>

      <div style={s.layout}>
        {/* Chat */}
        <div style={s.chatPanel}>
          <div style={s.chatWindow}>
            {messages.map((m, i) => (
              <div key={i} style={m.role === "user" ? s.userMsg : s.aiMsg}>
                <div style={m.role === "user" ? s.userLabel : s.aiLabel}>
                  {m.role === "user" ? "👮 OFFICER" : "🤖 AI ANALYST"}
                </div>
                <div style={s.msgText}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={s.aiMsg}>
                <div style={s.aiLabel}>🤖 AI ANALYST</div>
                <div style={{ ...s.msgText, color: "var(--text3)", fontStyle: "italic" }}>
                  Analyzing case data<span style={{ animation: "blink 1s infinite" }}>...</span>
                </div>
              </div>
            )}
          </div>

          <div style={s.inputRow}>
            <input style={s.input} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && analyze()}
              placeholder="Ask the AI analyst..." disabled={loading} />
            <button style={s.sendBtn} onClick={() => analyze()} disabled={loading || !input.trim()}>
              Analyze →
            </button>
          </div>
        </div>

        {/* Templates */}
        <div style={s.templatesPanel}>
          <div style={s.templatesTitle}>Quick Analysis</div>
          {TEMPLATES.map((t, i) => (
            <button key={i} style={s.templateBtn} onClick={() => analyze(t)}>
              <span style={s.templateIcon}>⚡</span>
              {t}
            </button>
          ))}

          <div style={{ ...s.templatesTitle, marginTop: 20 }}>Case Stats</div>
          <div style={s.statsBox}>
            <div style={s.statRow}><span style={s.statLabel}>Cases Loaded</span><span style={s.statVal}>{cases.length}</span></div>
            <div style={s.statRow}><span style={s.statLabel}>Officers</span><span style={s.statVal}>{officers.length}</span></div>
            <div style={s.statRow}><span style={s.statLabel}>Critical</span><span style={{ ...s.statVal, color: "#f85149" }}>{cases.filter(c => c.priority === "Critical").length}</span></div>
            <div style={s.statRow}><span style={s.statLabel}>Countries</span><span style={s.statVal}>{[...new Set(cases.map(c => c.country))].length}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {},
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 4 },
  sub: { fontSize: 13, color: "var(--text2)" },
  statusBadge: { display: "flex", alignItems: "center", gap: 8, background: "rgba(63,185,80,0.1)", border: "1px solid rgba(63,185,80,0.3)", borderRadius: 6, padding: "6px 12px" },
  layout: { display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, height: "calc(100vh - 200px)" },
  chatPanel: { display: "flex", flexDirection: "column", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" },
  chatWindow: { flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 },
  userMsg: { background: "rgba(31,111,235,0.08)", border: "1px solid rgba(31,111,235,0.15)", borderRadius: 6, padding: "12px 14px" },
  aiMsg: { background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "12px 14px" },
  userLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#388bfd", letterSpacing: "0.1em", marginBottom: 6 },
  aiLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#3fb950", letterSpacing: "0.1em", marginBottom: 6 },
  msgText: { fontSize: 13, color: "var(--text)", lineHeight: 1.7, whiteSpace: "pre-wrap" },
  inputRow: { display: "flex", gap: 8, padding: "12px 16px", borderTop: "1px solid var(--border)" },
  input: { flex: 1, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 12px", color: "var(--text)", fontSize: 13 },
  sendBtn: { padding: "10px 18px", background: "var(--blue)", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0 },
  templatesPanel: { display: "flex", flexDirection: "column" },
  templatesTitle: { fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 8 },
  templateBtn: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 12px", color: "var(--text2)", fontSize: 12, cursor: "pointer", textAlign: "left", marginBottom: 6, lineHeight: 1.5, display: "flex", gap: 8, alignItems: "flex-start", transition: "all 0.15s" },
  templateIcon: { flexShrink: 0, fontSize: 12 },
  statsBox: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, padding: 12 },
  statRow: { display: "flex", justifyContent: "space-between", marginBottom: 8 },
  statLabel: { fontSize: 12, color: "var(--text3)" },
  statVal: { fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: "var(--text)" },
};
