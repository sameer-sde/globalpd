import { useState } from "react";

const INITIAL_SUSPECTS = [
  { id: "S-001", name: "Viktor Volkov", alias: "The Ghost", nationality: "Russian", age: 45, status: "At Large", threat: "Critical", linkedCases: ["C-001", "C-003"], lastSeen: "Berlin, Germany", description: "Former intelligence operative turned cybercriminal. Suspected ringleader of dark web operations.", avatar: "👤" },
  { id: "S-002", name: "Maria Chen", alias: "Silk Road", nationality: "Chinese", age: 38, status: "Arrested", threat: "High", linkedCases: ["C-001"], lastSeen: "New York, USA", description: "Financial expert specializing in cryptocurrency laundering. Currently in custody.", avatar: "👤" },
  { id: "S-003", name: "Carlos Mendoza", alias: "El Capitán", nationality: "Colombian", age: 52, status: "At Large", threat: "Critical", linkedCases: ["C-002", "C-006"], lastSeen: "Mexico City, Mexico", description: "Cartel leader operating transnational drug routes. Armed and dangerous.", avatar: "👤" },
  { id: "S-004", name: "Ahmed Al-Farsi", alias: "Unknown", nationality: "Unknown", age: 0, status: "Person of Interest", threat: "High", linkedCases: ["C-005"], lastSeen: "Dubai, UAE", description: "Connected to the missing diplomat case. Identity unconfirmed.", avatar: "❓" },
  { id: "S-005", name: "Priya Nair", alias: "The Accountant", nationality: "Indian", age: 41, status: "Arrested", threat: "Medium", linkedCases: ["C-004"], lastSeen: "Mumbai, India", description: "Chief financial officer behind the Golden Triangle fraud scheme.", avatar: "👤" },
];

const THREAT_COLORS = { Critical: "#f85149", High: "#f0883e", Medium: "#e3b341", Low: "#3fb950" };
const STATUS_COLORS = { "At Large": "#f85149", "Arrested": "#3fb950", "Person of Interest": "#e3b341", "Deceased": "#484f58" };

export function SuspectTracker({ cases }) {
  const [suspects, setSuspects] = useState(INITIAL_SUSPECTS);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", alias: "", nationality: "", age: "", status: "Person of Interest", threat: "Medium", lastSeen: "", description: "" });

  const filtered = filter === "All" ? suspects : suspects.filter(s => s.status === filter || s.threat === filter);

  function addSuspect() {
    if (!form.name) return;
    setSuspects(prev => [...prev, { ...form, id: `S-${String(prev.length + 1).padStart(3, "0")}`, linkedCases: [], avatar: "👤" }]);
    setShowAdd(false);
    setForm({ name: "", alias: "", nationality: "", age: "", status: "Person of Interest", threat: "Medium", lastSeen: "", description: "" });
  }

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Suspect Tracker</h1>
          <p style={s.sub}>{suspects.filter(x => x.status === "At Large").length} suspects at large · {suspects.filter(x => x.status === "Arrested").length} in custody</p>
        </div>
        <button style={s.addBtn} onClick={() => setShowAdd(true)}>+ Add Suspect</button>
      </div>

      <div style={s.filters}>
        {["All", "At Large", "Arrested", "Person of Interest", "Critical", "High", "Medium"].map(f => (
          <button key={f} style={{ ...s.filterBtn, ...(filter === f ? s.filterActive : {}) }} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div style={s.grid}>
        {filtered.map(sus => (
          <div key={sus.id} style={s.card} onClick={() => setSelected(sus)}>
            <div style={s.cardTop}>
              <div style={s.avatar}>{sus.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={s.name}>{sus.name}</div>
                {sus.alias !== "Unknown" && <div style={s.alias}>aka "{sus.alias}"</div>}
                <div style={s.meta}>{sus.nationality}{sus.age > 0 ? ` · Age ${sus.age}` : ""}</div>
              </div>
              <div style={s.badges}>
                <div style={{ ...s.badge, background: `${THREAT_COLORS[sus.threat]}15`, color: THREAT_COLORS[sus.threat], border: `1px solid ${THREAT_COLORS[sus.threat]}30` }}>{sus.threat}</div>
                <div style={{ ...s.badge, background: `${STATUS_COLORS[sus.status]}15`, color: STATUS_COLORS[sus.status], border: `1px solid ${STATUS_COLORS[sus.status]}30`, marginTop: 4 }}>{sus.status}</div>
              </div>
            </div>
            <div style={s.lastSeen}>📍 Last seen: {sus.lastSeen || "Unknown"}</div>
            <div style={s.desc}>{sus.description}</div>
            {sus.linkedCases.length > 0 && (
              <div style={s.linkedCases}>
                {sus.linkedCases.map(c => <span key={c} style={s.caseTag}>{c}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div style={s.overlay} onClick={() => setSelected(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <div>
                <div style={s.modalId}>{selected.id} · SUSPECT FILE</div>
                <div style={s.modalName}>{selected.name}</div>
                {selected.alias !== "Unknown" && <div style={s.alias}>aka "{selected.alias}"</div>}
              </div>
              <button style={s.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div style={s.modalGrid}>
              {[["Nationality", selected.nationality], ["Age", selected.age || "Unknown"], ["Status", selected.status], ["Threat Level", selected.threat], ["Last Seen", selected.lastSeen || "Unknown"]].map(([k, v]) => (
                <div key={k}>
                  <div style={s.fieldLabel}>{k}</div>
                  <div style={s.fieldVal}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={s.fieldLabel}>Profile</div>
              <div style={{ ...s.fieldVal, lineHeight: 1.6 }}>{selected.description}</div>
            </div>
            <div>
              <div style={s.fieldLabel}>Linked Cases</div>
              <div style={s.linkedCases}>
                {selected.linkedCases.length > 0
                  ? selected.linkedCases.map(c => <span key={c} style={s.caseTag}>{c}</span>)
                  : <span style={{ fontSize: 12, color: "var(--text3)" }}>No linked cases</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <div style={s.overlay} onClick={() => setShowAdd(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <div style={s.modalName}>Add New Suspect</div>
              <button style={s.closeBtn} onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <div style={s.formGrid}>
              {[{ k: "name", l: "Full Name *" }, { k: "alias", l: "Alias" }, { k: "nationality", l: "Nationality" }, { k: "age", l: "Age" }, { k: "lastSeen", l: "Last Known Location" }].map(f => (
                <div key={f.k}>
                  <label style={s.fieldLabel}>{f.l}</label>
                  <input style={s.input} value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} />
                </div>
              ))}
              {[{ k: "status", l: "Status", opts: ["At Large", "Arrested", "Person of Interest"] }, { k: "threat", l: "Threat Level", opts: ["Critical", "High", "Medium", "Low"] }].map(f => (
                <div key={f.k}>
                  <label style={s.fieldLabel}>{f.l}</label>
                  <select style={s.select} value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}>
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={s.fieldLabel}>Description</label>
              <textarea style={s.textarea} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} />
            </div>
            <button style={s.submitBtn} onClick={addSuspect}>Add Suspect →</button>
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
  filters: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 },
  filterBtn: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 4, padding: "5px 12px", color: "var(--text2)", fontSize: 12, cursor: "pointer" },
  filterActive: { background: "rgba(31,111,235,0.15)", borderColor: "#388bfd", color: "#388bfd" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 },
  card: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 16, cursor: "pointer", transition: "border-color 0.15s" },
  cardTop: { display: "flex", gap: 12, marginBottom: 10 },
  avatar: { width: 44, height: 44, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 },
  name: { fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 2 },
  alias: { fontSize: 12, color: "#a371f7", marginBottom: 2 },
  meta: { fontSize: 11, color: "var(--text3)" },
  badges: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
  badge: { fontSize: 10, padding: "2px 8px", borderRadius: 3, fontFamily: "'JetBrains Mono', monospace", textAlign: "center" },
  lastSeen: { fontSize: 11, color: "var(--text3)", marginBottom: 6 },
  desc: { fontSize: 12, color: "var(--text2)", lineHeight: 1.5, marginBottom: 10 },
  linkedCases: { display: "flex", gap: 6, flexWrap: "wrap" },
  caseTag: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, background: "rgba(31,111,235,0.1)", border: "1px solid rgba(31,111,235,0.2)", borderRadius: 3, padding: "2px 6px", color: "#388bfd" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 },
  modal: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: 24, maxWidth: 560, width: "100%", maxHeight: "90vh", overflowY: "auto" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  modalId: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#388bfd", marginBottom: 4 },
  modalName: { fontSize: 18, fontWeight: 700, color: "var(--text)" },
  closeBtn: { background: "none", border: "none", color: "var(--text2)", cursor: "pointer", fontSize: 18 },
  modalGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 },
  fieldLabel: { fontSize: 10, color: "var(--text3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4, display: "block" },
  fieldVal: { fontSize: 13, color: "var(--text)", fontWeight: 500 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 },
  input: { width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", fontSize: 13 },
  select: { width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", fontSize: 13 },
  textarea: { width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", fontSize: 13, resize: "vertical" },
  submitBtn: { width: "100%", padding: "11px", background: "var(--blue)", border: "none", borderRadius: 6, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" },
};
