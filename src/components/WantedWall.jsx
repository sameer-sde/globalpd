import { useState } from "react";

const WANTED = [
  { id: "W-001", name: "Viktor Volkov", alias: "The Ghost", reward: "$500,000", status: "WANTED", threat: "EXTREMELY DANGEROUS", crimes: ["Cybercrime", "Espionage", "Money Laundering"], lastSeen: "Berlin, Germany", nationality: "Russian", height: "6'1\"", build: "Athletic", hair: "Dark", eyes: "Grey", born: "1979", caseId: "C-001", img: "👤", warrantDate: "2026-03-14", priority: "critical" },
  { id: "W-002", name: "Carlos Mendoza", alias: "El Capitán", reward: "$750,000", status: "WANTED", threat: "ARMED & DANGEROUS", crimes: ["Drug Trafficking", "Organized Crime", "Homicide"], lastSeen: "Mexico City", nationality: "Colombian", height: "5'9\"", build: "Heavy", hair: "Black", eyes: "Brown", born: "1972", caseId: "C-006", img: "👤", warrantDate: "2025-11-20", priority: "critical" },
  { id: "W-003", name: "Ahmed Al-Farsi", alias: "Unknown", reward: "$250,000", status: "PERSON OF INTEREST", threat: "APPROACH WITH CAUTION", crimes: ["Kidnapping", "Terrorism"], lastSeen: "Dubai, UAE", nationality: "Unknown", height: "Unknown", build: "Medium", hair: "Black", eyes: "Brown", born: "Unknown", caseId: "C-005", img: "❓", warrantDate: "2026-05-14", priority: "high" },
  { id: "W-004", name: "Ivan Petrov", alias: "The Broker", reward: "$400,000", status: "WANTED", threat: "EXTREMELY DANGEROUS", crimes: ["Arms Trafficking", "Terrorism", "Money Laundering"], lastSeen: "Eastern Europe", nationality: "Russian", height: "5'11\"", build: "Slim", hair: "Blonde", eyes: "Blue", born: "1975", caseId: "C-003", img: "👤", warrantDate: "2025-09-08", priority: "critical" },
  { id: "W-005", name: "Jin-ho Park", alias: "Shadow", reward: "$180,000", status: "WANTED", threat: "DANGEROUS", crimes: ["Cybercrime", "Fraud"], lastSeen: "Seoul / Tokyo", nationality: "North Korean", height: "5'8\"", build: "Slim", hair: "Black", eyes: "Dark", born: "1988", caseId: "C-007", img: "👤", warrantDate: "2025-07-22", priority: "high" },
  { id: "W-006", name: "Fatima Nkosi", alias: "The Conductor", reward: "$350,000", status: "WANTED", threat: "EXTREMELY DANGEROUS", crimes: ["Human Trafficking", "Organized Crime"], lastSeen: "Cape Town, SA", nationality: "South African", height: "5'6\"", build: "Medium", hair: "Black", eyes: "Brown", born: "1981", caseId: "C-008", img: "👤", warrantDate: "2026-01-30", priority: "critical" },
];

const PRIORITY_STYLES = {
  critical: { border: "2px solid #f85149", glow: "0 0 20px rgba(248,81,73,0.2)", headerBg: "#f85149", stamp: "#f85149" },
  high: { border: "2px solid #f0883e", glow: "0 0 15px rgba(240,136,62,0.15)", headerBg: "#f0883e", stamp: "#f0883e" },
};

export function WantedWall() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? WANTED : WANTED.filter(w => w.priority === filter.toLowerCase() || w.status === filter);

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Wanted Criminals</h1>
          <p style={s.sub}>{WANTED.filter(w => w.status === "WANTED").length} active warrants · Total rewards: ${(WANTED.reduce((a, w) => a + parseInt(w.reward.replace(/[$,]/g, "")), 0) / 1000).toFixed(0)}K</p>
        </div>
      </div>

      <div style={s.filters}>
        {["All", "WANTED", "PERSON OF INTEREST", "critical", "high"].map(f => (
          <button key={f} style={{ ...s.filterBtn, ...(filter === f ? s.filterActive : {}) }} onClick={() => setFilter(f)}>
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={s.wall}>
        {filtered.map(w => {
          const ps = PRIORITY_STYLES[w.priority] || PRIORITY_STYLES.high;
          return (
            <div key={w.id} style={{ ...s.poster, border: ps.border, boxShadow: ps.glow }} onClick={() => setSelected(w)}>
              {/* Poster header */}
              <div style={{ ...s.posterHeader, background: ps.headerBg }}>
                <div style={s.posterHeaderText}>
                  {w.status === "WANTED" ? "⚠ WANTED ⚠" : "PERSON OF INTEREST"}
                </div>
                <div style={s.posterReward}>REWARD: {w.reward}</div>
              </div>

              {/* Photo area */}
              <div style={s.photoArea}>
                <div style={s.photo}>{w.img}</div>
                {w.status === "WANTED" && (
                  <div style={s.dangerStamp}>
                    <div style={{ ...s.stampText, color: ps.stamp, border: `2px solid ${ps.stamp}` }}>
                      {w.threat.split(" ")[0]}
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={s.posterBody}>
                <div style={s.posterName}>{w.name}</div>
                {w.alias !== "Unknown" && <div style={s.posterAlias}>"{w.alias}"</div>}
                <div style={s.posterNat}>{w.nationality}</div>

                <div style={s.crimeList}>
                  {w.crimes.slice(0, 2).map(c => <span key={c} style={s.crimeTag}>{c}</span>)}
                </div>

                <div style={s.posterMeta}>
                  <div style={s.metaRow}><span style={s.metaLabel}>Last Seen</span><span style={s.metaVal}>{w.lastSeen}</span></div>
                  <div style={s.metaRow}><span style={s.metaLabel}>Case</span><span style={{ ...s.metaVal, color: "#388bfd" }}>{w.caseId}</span></div>
                </div>
              </div>

              <div style={s.posterFooter}>GlobalPD · Warrant {w.id} · {w.warrantDate}</div>
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      {selected && (
        <div style={s.overlay} onClick={() => setSelected(null)}>
          <div style={{ ...s.modal, border: PRIORITY_STYLES[selected.priority]?.border }} onClick={e => e.stopPropagation()}>
            <div style={{ ...s.modalHeader, background: PRIORITY_STYLES[selected.priority]?.headerBg }}>
              <div style={s.modalHeaderText}>{selected.status === "WANTED" ? "⚠ WANTED CRIMINAL ⚠" : "PERSON OF INTEREST"}</div>
              <button style={s.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div style={s.modalBody}>
              <div style={s.modalTop}>
                <div style={s.modalPhoto}>{selected.img}</div>
                <div style={{ flex: 1 }}>
                  <div style={s.modalName}>{selected.name}</div>
                  {selected.alias !== "Unknown" && <div style={s.modalAlias}>aka "{selected.alias}"</div>}
                  <div style={{ ...s.modalReward, color: PRIORITY_STYLES[selected.priority]?.stamp }}>REWARD: {selected.reward}</div>
                  <div style={s.modalThreat}>{selected.threat}</div>
                </div>
              </div>
              <div style={s.detailGrid}>
                {[["Nationality", selected.nationality], ["Date of Birth", selected.born], ["Height", selected.height], ["Build", selected.build], ["Hair", selected.hair], ["Eyes", selected.eyes], ["Last Seen", selected.lastSeen], ["Warrant Date", selected.warrantDate], ["Linked Case", selected.caseId]].map(([k, v]) => (
                  <div key={k} style={s.detailField}><div style={s.detailLabel}>{k}</div><div style={s.detailVal}>{v}</div></div>
                ))}
              </div>
              <div><div style={s.detailLabel}>Known Crimes</div><div style={s.crimeListBig}>{selected.crimes.map(c => <span key={c} style={s.crimeTagBig}>{c}</span>)}</div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 4 },
  sub: { fontSize: 13, color: "var(--text2)" },
  filters: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 },
  filterBtn: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 4, padding: "5px 12px", color: "var(--text2)", fontSize: 11, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" },
  filterActive: { background: "rgba(248,81,73,0.1)", borderColor: "#f85149", color: "#f85149" },
  wall: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 },
  poster: { background: "var(--bg2)", borderRadius: 8, overflow: "hidden", cursor: "pointer", transition: "transform 0.15s" },
  posterHeader: { padding: "8px 12px", textAlign: "center" },
  posterHeaderText: { fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.1em" },
  posterReward: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  photoArea: { background: "var(--bg3)", height: 120, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", borderBottom: "1px solid var(--border)" },
  photo: { fontSize: 64 },
  dangerStamp: { position: "absolute", bottom: 8, right: 8 },
  stampText: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, letterSpacing: "0.1em" },
  posterBody: { padding: "12px 14px" },
  posterName: { fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 2 },
  posterAlias: { fontSize: 12, color: "#a371f7", marginBottom: 3 },
  posterNat: { fontSize: 11, color: "var(--text3)", marginBottom: 8 },
  crimeList: { display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 },
  crimeTag: { fontSize: 9, background: "rgba(248,81,73,0.1)", border: "1px solid rgba(248,81,73,0.2)", color: "#f85149", borderRadius: 3, padding: "2px 6px", fontFamily: "'JetBrains Mono', monospace" },
  posterMeta: {},
  metaRow: { display: "flex", justifyContent: "space-between", marginBottom: 4 },
  metaLabel: { fontSize: 10, color: "var(--text3)" },
  metaVal: { fontSize: 10, color: "var(--text)", fontFamily: "'JetBrains Mono', monospace" },
  posterFooter: { fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "var(--text3)", textAlign: "center", padding: "8px", background: "var(--bg3)", borderTop: "1px solid var(--border)", letterSpacing: "0.08em" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 },
  modal: { background: "var(--bg2)", borderRadius: 10, maxWidth: 560, width: "100%", maxHeight: "90vh", overflowY: "auto", overflow: "hidden" },
  modalHeader: { padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  modalHeaderText: { fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "0.08em" },
  closeBtn: { background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 18 },
  modalBody: { padding: 20 },
  modalTop: { display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" },
  modalPhoto: { width: 80, height: 80, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, flexShrink: 0 },
  modalName: { fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 4 },
  modalAlias: { fontSize: 13, color: "#a371f7", marginBottom: 6 },
  modalReward: { fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, marginBottom: 4 },
  modalThreat: { fontSize: 11, color: "var(--text3)", fontFamily: "'JetBrains Mono', monospace" },
  detailGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 },
  detailField: {},
  detailLabel: { fontSize: 9, color: "var(--text3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 },
  detailVal: { fontSize: 13, color: "var(--text)", fontWeight: 500 },
  crimeListBig: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 },
  crimeTagBig: { fontSize: 11, background: "rgba(248,81,73,0.08)", border: "1px solid rgba(248,81,73,0.25)", color: "#f85149", borderRadius: 4, padding: "4px 10px" },
};
