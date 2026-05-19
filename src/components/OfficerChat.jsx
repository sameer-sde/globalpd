import { useState, useRef, useEffect } from "react";

const INITIAL_MESSAGES = [
  { id: 1, from: "Inspector Patel", avatar: "👮", country: "UK", time: "09:14", text: "Case C-002 update — harbour surveillance picked up a suspicious vessel overnight. Requesting backup.", type: "alert" },
  { id: 2, from: "Agent Rivera", avatar: "🕵️", country: "USA", time: "09:17", text: "Noted Patel. We have intel linking the vessel to the C-001 dark web network. Sending encrypted file.", type: "intel" },
  { id: 3, from: "Inspector Sharma", avatar: "🔍", country: "India", time: "09:22", text: "C-004 arrests confirmed. All 4 suspects in custody. Case closed. Good work team.", type: "success" },
  { id: 4, from: "Officer Müller", avatar: "🚔", country: "Germany", time: "09:31", text: "Project Phoenix — we intercepted encrypted communications. Translation pending. Will update.", type: "normal" },
  { id: 5, from: "Agent Al-Rashid", avatar: "🕵️", country: "UAE", time: "09:45", text: "🚨 URGENT — Missing diplomat case escalating. Last phone ping traced to industrial district. Need immediate air support.", type: "alert" },
];

const TYPE_COLORS = {
  alert: { bg: "rgba(248,81,73,0.06)", border: "rgba(248,81,73,0.2)", dot: "#f85149" },
  intel: { bg: "rgba(163,113,247,0.06)", border: "rgba(163,113,247,0.2)", dot: "#a371f7" },
  success: { bg: "rgba(63,185,80,0.06)", border: "rgba(63,185,80,0.2)", dot: "#3fb950" },
  normal: { bg: "rgba(255,255,255,0.02)", border: "rgba(48,54,70,0.5)", dot: "#8b949e" },
};

export function OfficerChat({ officer }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [msgType, setMsgType] = useState("normal");
  const [filter, setFilter] = useState("All");
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  function sendMessage() {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      from: officer?.name || "You",
      avatar: officer?.avatar || "👮",
      country: officer?.country || "HQ",
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      text: input.trim(),
      type: msgType,
      isMe: true,
    }]);
    setInput("");
  }

  const filtered = filter === "All" ? messages : messages.filter(m => m.type === filter.toLowerCase());

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Officer Communications</h1>
          <p style={s.sub}>Encrypted inter-agency channel — {messages.length} messages</p>
        </div>
        <div style={s.onlineBadge}>
          <span className="live-dot" />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#3fb950" }}>CHANNEL SECURE</span>
        </div>
      </div>

      <div style={s.layout}>
        {/* Online officers */}
        <div style={s.officersPanel}>
          <div style={s.panelTitle}>Online Officers</div>
          {[
            { name: "Inspector Patel", country: "UK", avatar: "👮", status: "online" },
            { name: "Agent Rivera", country: "USA", avatar: "🕵️", status: "online" },
            { name: "Inspector Sharma", country: "India", avatar: "🔍", status: "away" },
            { name: "Officer Müller", country: "Germany", avatar: "🚔", status: "online" },
            { name: "Agent Al-Rashid", country: "UAE", avatar: "🕵️", status: "busy" },
            { name: "Agent Reyes", country: "Mexico", avatar: "👮", status: "offline" },
          ].map(o => (
            <div key={o.name} style={s.officerRow}>
              <span style={s.officerAvatar}>{o.avatar}</span>
              <div style={{ flex: 1 }}>
                <div style={s.officerName}>{o.name}</div>
                <div style={s.officerCountry}>{o.country}</div>
              </div>
              <span style={{ ...s.statusDot, background: o.status === "online" ? "#3fb950" : o.status === "away" ? "#e3b341" : o.status === "busy" ? "#f85149" : "#484f58" }} />
            </div>
          ))}

          <div style={{ ...s.panelTitle, marginTop: 20 }}>Filter</div>
          {["All", "Alert", "Intel", "Success", "Normal"].map(f => (
            <button key={f} style={{ ...s.filterBtn, ...(filter === f ? s.filterActive : {}) }} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>

        {/* Chat */}
        <div style={s.chatPanel}>
          <div ref={chatRef} style={s.chatWindow}>
            {filtered.map(m => {
              const tc = TYPE_COLORS[m.type] || TYPE_COLORS.normal;
              return (
                <div key={m.id} style={{ ...s.msgCard, background: tc.bg, border: `1px solid ${tc.border}`, ...(m.isMe ? { marginLeft: 40 } : { marginRight: 40 }) }}>
                  <div style={s.msgHeader}>
                    <div style={s.msgLeft}>
                      <span style={s.msgAvatar}>{m.avatar}</span>
                      <span style={s.msgFrom}>{m.from}</span>
                      <span style={s.msgCountry}>· {m.country}</span>
                    </div>
                    <div style={s.msgRight}>
                      <span style={{ ...s.typeDot, background: tc.dot }} />
                      <span style={s.msgTime}>{m.time}</span>
                    </div>
                  </div>
                  <div style={s.msgText}>{m.text}</div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div style={s.inputArea}>
            <div style={s.typeRow}>
              {["normal", "alert", "intel", "success"].map(t => (
                <button key={t} style={{ ...s.typeBtn, ...(msgType === t ? { ...s.typeBtnActive, borderColor: TYPE_COLORS[t].dot, color: TYPE_COLORS[t].dot } : {}) }}
                  onClick={() => setMsgType(t)}>{t.toUpperCase()}</button>
              ))}
            </div>
            <div style={s.inputRow}>
              <input style={s.input} value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Type a message to all units..." />
              <button style={s.sendBtn} onClick={sendMessage} disabled={!input.trim()}>Send →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {},
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 4 },
  sub: { fontSize: 13, color: "var(--text2)" },
  onlineBadge: { display: "flex", alignItems: "center", gap: 8, background: "rgba(63,185,80,0.08)", border: "1px solid rgba(63,185,80,0.2)", borderRadius: 6, padding: "6px 12px" },
  layout: { display: "grid", gridTemplateColumns: "200px 1fr", gap: 16, height: "calc(100vh - 200px)" },
  officersPanel: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 14, overflowY: "auto" },
  panelTitle: { fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 10 },
  officerRow: { display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid var(--border2)" },
  officerAvatar: { fontSize: 18 },
  officerName: { fontSize: 12, fontWeight: 500, color: "var(--text)" },
  officerCountry: { fontSize: 10, color: "var(--text3)" },
  statusDot: { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
  filterBtn: { width: "100%", padding: "6px 8px", background: "transparent", border: "1px solid var(--border2)", borderRadius: 4, color: "var(--text3)", fontSize: 11, cursor: "pointer", marginBottom: 4, textAlign: "left", fontFamily: "'JetBrains Mono', monospace" },
  filterActive: { background: "rgba(31,111,235,0.1)", borderColor: "#388bfd", color: "#388bfd" },
  chatPanel: { display: "flex", flexDirection: "column", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" },
  chatWindow: { flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 },
  msgCard: { borderRadius: 8, padding: "10px 14px" },
  msgHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  msgLeft: { display: "flex", alignItems: "center", gap: 8 },
  msgAvatar: { fontSize: 16 },
  msgFrom: { fontSize: 13, fontWeight: 600, color: "var(--text)" },
  msgCountry: { fontSize: 11, color: "var(--text3)" },
  msgRight: { display: "flex", alignItems: "center", gap: 6 },
  typeDot: { width: 6, height: 6, borderRadius: "50%" },
  msgTime: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text3)" },
  msgText: { fontSize: 13, color: "var(--text)", lineHeight: 1.6 },
  inputArea: { borderTop: "1px solid var(--border)", padding: 14 },
  typeRow: { display: "flex", gap: 6, marginBottom: 10 },
  typeBtn: { padding: "4px 10px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text3)", fontSize: 10, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" },
  typeBtnActive: { background: "rgba(31,111,235,0.1)" },
  inputRow: { display: "flex", gap: 8 },
  input: { flex: 1, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 12px", color: "var(--text)", fontSize: 13 },
  sendBtn: { padding: "10px 18px", background: "var(--blue)", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" },
};
