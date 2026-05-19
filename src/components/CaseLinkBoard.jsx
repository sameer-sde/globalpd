import { useState, useRef, useEffect } from "react";

const INITIAL_LINKS = [
  { from: "C-001", to: "C-003", reason: "Same suspect — Viktor Volkov" },
  { from: "C-002", to: "C-006", reason: "Same smuggling network" },
  { from: "C-001", to: "C-002", reason: "Shared financial channels" },
];

const COLORS = ["#f85149", "#f0883e", "#e3b341", "#3fb950", "#388bfd", "#a371f7"];

const POSITIONS = {
  "C-001": { x: 80, y: 60 },
  "C-002": { x: 300, y: 40 },
  "C-003": { x: 520, y: 80 },
  "C-004": { x: 160, y: 220 },
  "C-005": { x: 400, y: 200 },
  "C-006": { x: 280, y: 320 },
  "C-007": { x: 520, y: 280 },
  "C-008": { x: 80, y: 340 },
};

export function CaseLinkBoard({ cases }) {
  const [links, setLinks] = useState(INITIAL_LINKS);
  const [linking, setLinking] = useState(null);
  const [hoveredCase, setHoveredCase] = useState(null);
  const [reason, setReason] = useState("");
  const [showAddLink, setShowAddLink] = useState(false);
  const [linkForm, setLinkForm] = useState({ from: cases[0]?.id || "", to: cases[1]?.id || "", reason: "" });
  const svgRef = useRef(null);

  function addLink() {
    if (!linkForm.from || !linkForm.to || linkForm.from === linkForm.to) return;
    setLinks(prev => [...prev, { from: linkForm.from, to: linkForm.to, reason: linkForm.reason || "Linked cases" }]);
    setShowAddLink(false);
    setLinkForm({ from: cases[0]?.id || "", to: "", reason: "" });
  }

  function removeLink(i) {
    setLinks(prev => prev.filter((_, idx) => idx !== i));
  }

  const getPos = (id) => POSITIONS[id] || { x: 300, y: 200 };

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Case Link Board</h1>
          <p style={s.sub}>Connect related cases — visualize criminal networks</p>
        </div>
        <button style={s.addBtn} onClick={() => setShowAddLink(true)}>+ Link Cases</button>
      </div>

      <div style={s.layout}>
        {/* Board */}
        <div style={s.board}>
          <div style={s.boardLabel}>INVESTIGATION BOARD — DRAG CASES TO REPOSITION</div>
          <svg ref={svgRef} style={s.svg} viewBox="0 0 640 420">
            {/* Cork board texture */}
            <rect width="640" height="420" fill="#0d1117" />
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            </pattern>
            <rect width="640" height="420" fill="url(#grid)" />

            {/* Red string connections */}
            {links.map((link, i) => {
              const from = getPos(link.from);
              const to = getPos(link.to);
              const mx = (from.x + to.x) / 2;
              const my = (from.y + to.y) / 2 - 20;
              const color = COLORS[i % COLORS.length];
              return (
                <g key={i}>
                  <path d={`M ${from.x + 50} ${from.y + 20} Q ${mx} ${my} ${to.x + 50} ${to.y + 20}`}
                    stroke={color} strokeWidth="1.5" fill="none" strokeDasharray="none" opacity="0.7" />
                  <circle cx={mx} cy={my - 10} r="3" fill={color} opacity="0.8" />
                  <text x={mx} y={my - 16} textAnchor="middle" fontSize="8" fill={color} opacity="0.8"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>{link.reason.slice(0, 20)}</text>
                </g>
              );
            })}

            {/* Case nodes */}
            {cases.slice(0, 8).map((c, i) => {
              const pos = getPos(c.id);
              const isHovered = hoveredCase === c.id;
              const priorityColor = { Critical: "#f85149", High: "#f0883e", Medium: "#e3b341", Low: "#3fb950" }[c.priority] || "#8b949e";
              return (
                <g key={c.id} style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredCase(c.id)}
                  onMouseLeave={() => setHoveredCase(null)}>
                  {/* Glow */}
                  {isHovered && <rect x={pos.x - 2} y={pos.y - 2} width={104} height={44} rx="6" fill={`${priorityColor}20`} />}
                  {/* Card */}
                  <rect x={pos.x} y={pos.y} width={100} height={40} rx="4"
                    fill="#161b22" stroke={isHovered ? priorityColor : "rgba(48,54,70,0.8)"} strokeWidth={isHovered ? 1.5 : 1} />
                  {/* Priority indicator */}
                  <rect x={pos.x} y={pos.y} width={4} height={40} rx="2" fill={priorityColor} />
                  {/* Pin */}
                  <circle cx={pos.x + 50} cy={pos.y - 5} r="4" fill={priorityColor} opacity="0.8" />
                  {/* Text */}
                  <text x={pos.x + 10} y={pos.y + 14} fontSize="9" fill="#388bfd" fontFamily="JetBrains Mono">{c.id}</text>
                  <text x={pos.x + 10} y={pos.y + 26} fontSize="8" fill="#e6edf3">{c.title.slice(0, 14)}{c.title.length > 14 ? "..." : ""}</text>
                  <text x={pos.x + 10} y={pos.y + 36} fontSize="7" fill="#8b949e">{c.country}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Links list */}
        <div style={s.linksPanel}>
          <div style={s.panelTitle}>Active Links ({links.length})</div>
          {links.map((link, i) => (
            <div key={i} style={s.linkRow}>
              <div style={{ ...s.linkDot, background: COLORS[i % COLORS.length] }} />
              <div style={{ flex: 1 }}>
                <div style={s.linkCases}>{link.from} ↔ {link.to}</div>
                <div style={s.linkReason}>{link.reason}</div>
              </div>
              <button style={s.removeBtn} onClick={() => removeLink(i)}>✕</button>
            </div>
          ))}
          {links.length === 0 && <div style={s.empty}>No case links yet. Click "+ Link Cases" to connect.</div>}
        </div>
      </div>

      {showAddLink && (
        <div style={s.overlay} onClick={() => setShowAddLink(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <div style={s.modalTitle}>Link Two Cases</div>
              <button style={s.closeBtn} onClick={() => setShowAddLink(false)}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              {[{ k: "from", l: "From Case" }, { k: "to", l: "To Case" }].map(f => (
                <div key={f.k}>
                  <label style={s.label}>{f.l}</label>
                  <select style={s.input} value={linkForm[f.k]} onChange={e => setLinkForm(p => ({ ...p, [f.k]: e.target.value }))}>
                    {cases.map(c => <option key={c.id} value={c.id}>{c.id} — {c.title.slice(0, 20)}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Connection Reason</label>
              <input style={s.input} value={linkForm.reason} onChange={e => setLinkForm(p => ({ ...p, reason: e.target.value }))} placeholder="e.g. Same suspect, shared network..." />
            </div>
            <button style={s.submitBtn} onClick={addLink}>Add Link →</button>
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
  layout: { display: "grid", gridTemplateColumns: "1fr 260px", gap: 16 },
  board: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" },
  boardLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text3)", letterSpacing: "0.15em", padding: "10px 14px", borderBottom: "1px solid var(--border)", background: "var(--bg3)" },
  svg: { width: "100%", display: "block" },
  linksPanel: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 14 },
  panelTitle: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 12 },
  linkRow: { display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--border2)", alignItems: "flex-start" },
  linkDot: { width: 8, height: 8, borderRadius: "50%", marginTop: 4, flexShrink: 0 },
  linkCases: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#388bfd", marginBottom: 3 },
  linkReason: { fontSize: 11, color: "var(--text2)" },
  removeBtn: { background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 12 },
  empty: { fontSize: 12, color: "var(--text3)", fontStyle: "italic", textAlign: "center", padding: "20px 0" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 },
  modal: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: 24, width: 420 },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 17, fontWeight: 700, color: "var(--text)" },
  closeBtn: { background: "none", border: "none", color: "var(--text2)", cursor: "pointer", fontSize: 18 },
  label: { fontSize: 10, color: "var(--text3)", display: "block", marginBottom: 5, letterSpacing: "0.1em", textTransform: "uppercase" },
  input: { width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", fontSize: 13 },
  submitBtn: { width: "100%", padding: "11px", background: "var(--blue)", border: "none", borderRadius: 6, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" },
};
