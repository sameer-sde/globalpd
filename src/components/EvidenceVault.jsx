import { useState } from "react";

const INITIAL_EVIDENCE = [
  { id: "E-001", caseId: "C-001", title: "Server Logs", type: "Digital", description: "Dark web server access logs showing 847 transactions", date: "2026-05-10", status: "Verified", icon: "💾" },
  { id: "E-002", caseId: "C-001", title: "Cryptocurrency Wallet", type: "Financial", description: "Bitcoin wallet containing $2.3M in traced funds", date: "2026-05-11", status: "Verified", icon: "₿" },
  { id: "E-003", caseId: "C-002", title: "Shipping Manifest", type: "Document", description: "Falsified customs documents for 3 containers", date: "2026-05-13", status: "Pending", icon: "📄" },
  { id: "E-004", caseId: "C-003", title: "Surveillance Footage", type: "Video", description: "CCTV footage from Berlin train station — suspect sighted", date: "2026-05-09", status: "Verified", icon: "📹" },
  { id: "E-005", caseId: "C-004", title: "Bank Records", type: "Financial", description: "14 months of fraudulent transactions totalling ₹480 crore", date: "2026-05-06", status: "Verified", icon: "🏦" },
  { id: "E-006", caseId: "C-005", title: "Last Known Location", type: "Intelligence", description: "GPS data from diplomat's phone — last ping at Marina Bay", date: "2026-05-14", status: "Pending", icon: "📍" },
];

const TYPE_COLORS = { Digital: "#388bfd", Financial: "#e3b341", Document: "#a371f7", Video: "#f0883e", Intelligence: "#3fb950", Physical: "#484f58" };
const STATUS_COLORS = { Verified: "#3fb950", Pending: "#e3b341", Contested: "#f85149" };

export function EvidenceVault({ cases }) {
  const [evidence, setEvidence] = useState(INITIAL_EVIDENCE);
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ caseId: cases[0]?.id || "", title: "", type: "Digital", description: "", status: "Pending" });

  const filtered = filter === "All" ? evidence : evidence.filter(e => e.caseId === filter || e.type === filter || e.status === filter);

  function addEvidence() {
    if (!form.title) return;
    const icons = { Digital: "💾", Financial: "🏦", Document: "📄", Video: "📹", Intelligence: "🔍", Physical: "📦" };
    setEvidence(prev => [...prev, { ...form, id: `E-${String(prev.length + 1).padStart(3, "0")}`, date: new Date().toISOString().slice(0, 10), icon: icons[form.type] || "📋" }]);
    setShowAdd(false);
    setForm({ caseId: cases[0]?.id || "", title: "", type: "Digital", description: "", status: "Pending" });
  }

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Evidence Vault</h1>
          <p style={s.sub}>{evidence.length} pieces of evidence · {evidence.filter(e => e.status === "Verified").length} verified</p>
        </div>
        <button style={s.addBtn} onClick={() => setShowAdd(true)}>+ Log Evidence</button>
      </div>

      <div style={s.filters}>
        <select style={s.select} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All Evidence</option>
          {cases.map(c => <option key={c.id} value={c.id}>{c.id} — {c.title}</option>)}
          {["Digital", "Financial", "Document", "Video", "Intelligence"].map(t => <option key={t} value={t}>{t}</option>)}
          {["Verified", "Pending", "Contested"].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div style={s.grid}>
        {filtered.map(e => (
          <div key={e.id} style={s.card}>
            <div style={s.cardTop}>
              <span style={s.icon}>{e.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={s.evidenceTitle}>{e.title}</div>
                <div style={s.meta}>{e.id} · {e.caseId} · {e.date}</div>
              </div>
              <div style={s.badges}>
                <span style={{ ...s.badge, background: `${TYPE_COLORS[e.type]}15`, color: TYPE_COLORS[e.type], border: `1px solid ${TYPE_COLORS[e.type]}30` }}>{e.type}</span>
                <span style={{ ...s.badge, marginTop: 4, background: `${STATUS_COLORS[e.status]}15`, color: STATUS_COLORS[e.status], border: `1px solid ${STATUS_COLORS[e.status]}30` }}>{e.status}</span>
              </div>
            </div>
            <div style={s.desc}>{e.description}</div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div style={s.overlay} onClick={() => setShowAdd(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <div style={s.modalTitle}>Log New Evidence</div>
              <button style={s.closeBtn} onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <div style={s.formGrid}>
              <div><label style={s.label}>Title *</label><input style={s.input} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
              <div>
                <label style={s.label}>Linked Case</label>
                <select style={s.input} value={form.caseId} onChange={e => setForm(p => ({ ...p, caseId: e.target.value }))}>
                  {cases.map(c => <option key={c.id} value={c.id}>{c.id} — {c.title}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Type</label>
                <select style={s.input} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  {["Digital", "Financial", "Document", "Video", "Intelligence", "Physical"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Description</label>
              <textarea style={s.textarea} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} />
            </div>
            <button style={s.submitBtn} onClick={addEvidence}>Log Evidence →</button>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 4 },
  sub: { fontSize: 13, color: "var(--text2)" },
  addBtn: { background: "var(--blue)", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600, padding: "9px 16px", cursor: "pointer" },
  filters: { marginBottom: 16 },
  select: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 12px", color: "var(--text)", fontSize: 13, minWidth: 220 },
  grid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 },
  card: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 14 },
  cardTop: { display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" },
  icon: { fontSize: 26, flexShrink: 0 },
  evidenceTitle: { fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 3 },
  meta: { fontSize: 11, color: "var(--text3)" },
  badges: { display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 },
  badge: { fontSize: 10, padding: "2px 7px", borderRadius: 3, fontFamily: "'JetBrains Mono', monospace" },
  desc: { fontSize: 12, color: "var(--text2)", lineHeight: 1.5 },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 },
  modal: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: 24, maxWidth: 500, width: "100%" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 17, fontWeight: 700, color: "var(--text)" },
  closeBtn: { background: "none", border: "none", color: "var(--text2)", cursor: "pointer", fontSize: 18 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 },
  label: { fontSize: 10, color: "var(--text3)", display: "block", marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" },
  input: { width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", fontSize: 13 },
  textarea: { width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", fontSize: 13, resize: "vertical" },
  submitBtn: { width: "100%", padding: "11px", background: "var(--blue)", border: "none", borderRadius: 6, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" },
};
