import { useState, useEffect, useRef } from "react";
import { STATUS_COLORS, PRIORITY_COLORS } from "../data/data.js";

export function GlobalSearch({ cases, officers, setPage }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const q = query.toLowerCase().trim();
  const caseResults = q ? cases.filter(c => c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.type.toLowerCase().includes(q)).slice(0, 4) : [];
  const officerResults = q ? officers.filter(o => o.name.toLowerCase().includes(q) || o.country.toLowerCase().includes(q)).slice(0, 3) : [];
  const hasResults = caseResults.length > 0 || officerResults.length > 0;

  return (
    <>
      <button style={s.trigger} onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}>
        <span style={s.searchIcon}>🔍</span>
        <span style={s.triggerText}>Search...</span>
        <span style={s.kbd}>⌘K</span>
      </button>

      {open && (
        <div style={s.overlay} onClick={() => setOpen(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.inputRow}>
              <span style={{ fontSize: 16, color: "var(--text2)" }}>🔍</span>
              <input ref={inputRef} style={s.input} value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search cases, suspects, officers, countries..." autoFocus />
              {query && <button style={s.clearBtn} onClick={() => setQuery("")}>✕</button>}
            </div>

            {!q && (
              <div style={s.empty}>
                <div style={s.emptyText}>Type to search across all GlobalPD data</div>
                <div style={s.shortcuts}>
                  <span style={s.shortcut}>Cases</span>
                  <span style={s.shortcut}>Officers</span>
                  <span style={s.shortcut}>Countries</span>
                  <span style={s.shortcut}>Crime Types</span>
                </div>
              </div>
            )}

            {q && !hasResults && <div style={s.noResults}>No results found for "{query}"</div>}

            {caseResults.length > 0 && (
              <div style={s.section}>
                <div style={s.sectionLabel}>CASES</div>
                {caseResults.map(c => (
                  <button key={c.id} style={s.result} onClick={() => { setPage("cases"); setOpen(false); setQuery(""); }}>
                    <span style={s.resultIcon}>📁</span>
                    <div style={s.resultInfo}>
                      <div style={s.resultTitle}>{c.title}</div>
                      <div style={s.resultMeta}>{c.id} · {c.country} · {c.type}</div>
                    </div>
                    <div style={s.resultBadges}>
                      <span style={{ fontSize: 10, color: PRIORITY_COLORS[c.priority] }}>{c.priority}</span>
                      <span style={{ fontSize: 10, color: STATUS_COLORS[c.status], marginLeft: 8 }}>{c.status}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {officerResults.length > 0 && (
              <div style={s.section}>
                <div style={s.sectionLabel}>OFFICERS</div>
                {officerResults.map(o => (
                  <button key={o.id} style={s.result} onClick={() => { setPage("officers"); setOpen(false); setQuery(""); }}>
                    <span style={s.resultIcon}>{o.avatar}</span>
                    <div style={s.resultInfo}>
                      <div style={s.resultTitle}>{o.name}</div>
                      <div style={s.resultMeta}>{o.rank} · {o.country}</div>
                    </div>
                    <span style={{ fontSize: 12, color: "var(--text3)" }}>{o.status}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const s = {
  trigger: { display: "flex", alignItems: "center", gap: 8, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 12px", cursor: "pointer", color: "var(--text2)", fontSize: 12, width: 200 },
  searchIcon: { fontSize: 12 },
  triggerText: { flex: 1, textAlign: "left" },
  kbd: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text3)", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 3, padding: "1px 5px" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 500, paddingTop: 80 },
  modal: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, width: 560, maxHeight: "60vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" },
  inputRow: { display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid var(--border)" },
  input: { flex: 1, background: "transparent", border: "none", color: "var(--text)", fontSize: 15, fontFamily: "inherit" },
  clearBtn: { background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 14 },
  empty: { padding: "24px 16px", textAlign: "center" },
  emptyText: { fontSize: 13, color: "var(--text3)", marginBottom: 12 },
  shortcuts: { display: "flex", gap: 8, justifyContent: "center" },
  shortcut: { background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 4, padding: "3px 10px", fontSize: 11, color: "var(--text2)" },
  noResults: { padding: "24px", textAlign: "center", fontSize: 13, color: "var(--text3)", fontStyle: "italic" },
  section: { padding: "8px 0", borderBottom: "1px solid var(--border2)", overflowY: "auto" },
  sectionLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text3)", letterSpacing: "0.15em", padding: "6px 16px 4px" },
  result: { display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", width: "100%", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.1s" },
  resultIcon: { fontSize: 18, flexShrink: 0 },
  resultInfo: { flex: 1 },
  resultTitle: { fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 2 },
  resultMeta: { fontSize: 11, color: "var(--text3)" },
  resultBadges: { flexShrink: 0 },
};
