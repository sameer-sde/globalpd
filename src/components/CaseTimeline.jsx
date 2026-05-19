import { useState } from "react";
import { STATUS_COLORS, PRIORITY_COLORS } from "../data/data.js";

const CASE_TIMELINES = {
  "C-001": [
    { date: "2026-05-10", time: "09:00", event: "Case opened", detail: "Initial report filed. Cybercrime unit alerted.", type: "open" },
    { date: "2026-05-10", time: "14:30", event: "Evidence collected", detail: "Dark web server logs obtained via court order.", type: "evidence" },
    { date: "2026-05-11", time: "10:00", event: "Suspect identified", detail: "Viktor Volkov linked through IP analysis.", type: "suspect" },
    { date: "2026-05-12", time: "16:45", event: "Arrest made", detail: "Maria Chen arrested at JFK Airport.", type: "arrest" },
    { date: "2026-05-14", time: "09:00", event: "Status updated", detail: "Case upgraded to Investigation.", type: "update" },
  ],
  "C-002": [
    { date: "2026-05-12", time: "08:00", event: "Case opened", detail: "Customs flagged suspicious shipping containers.", type: "open" },
    { date: "2026-05-13", time: "11:00", event: "Surveillance initiated", detail: "Inspector Patel assigned. Harbor monitored.", type: "update" },
    { date: "2026-05-15", time: "03:30", event: "Container intercepted", detail: "3 containers seized at Port of London.", type: "evidence" },
  ],
};

const EVENT_COLORS = { open: "#388bfd", evidence: "#a371f7", suspect: "#e3b341", arrest: "#f0883e", update: "#3fb950", closed: "#3fb950" };
const EVENT_ICONS = { open: "📁", evidence: "🔍", suspect: "👤", arrest: "⛓", update: "📋", closed: "✅" };

export function CaseTimeline({ cases }) {
  const [selectedCase, setSelectedCase] = useState(cases[0]?.id || "");
  const [newEvent, setNewEvent] = useState({ event: "", detail: "", type: "update" });
  const [timelines, setTimelines] = useState(CASE_TIMELINES);

  const timeline = timelines[selectedCase] || [];
  const caseData = cases.find(c => c.id === selectedCase);

  function addEvent() {
    if (!newEvent.event || !selectedCase) return;
    const entry = {
      ...newEvent,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    };
    setTimelines(prev => ({ ...prev, [selectedCase]: [...(prev[selectedCase] || []), entry] }));
    setNewEvent({ event: "", detail: "", type: "update" });
  }

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.title}>Case Timeline</h1>
        <p style={s.sub}>Full chronological record of case events</p>
      </div>

      <div style={s.layout}>
        {/* Case selector */}
        <div style={s.casesCol}>
          <div style={s.colTitle}>Select Case</div>
          {cases.map(c => (
            <button key={c.id} style={{ ...s.caseBtn, ...(selectedCase === c.id ? s.caseBtnActive : {}) }}
              onClick={() => setSelectedCase(c.id)}>
              <div style={s.caseBtnId}>{c.id}</div>
              <div style={s.caseBtnTitle}>{c.title}</div>
              <div style={{ ...s.caseBtnStatus, color: STATUS_COLORS[c.status] }}>{c.status}</div>
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div style={s.timelineCol}>
          {caseData && (
            <div style={s.caseInfo}>
              <div style={s.caseInfoTitle}>{caseData.title}</div>
              <div style={s.caseInfoMeta}>{caseData.id} · {caseData.country} · {caseData.type}</div>
            </div>
          )}

          <div style={s.timeline}>
            {timeline.length === 0
              ? <div style={s.empty}>No events recorded for this case yet.</div>
              : timeline.map((e, i) => (
                <div key={i} style={s.timelineItem}>
                  <div style={s.timelineLeft}>
                    <div style={{ ...s.timelineDot, background: EVENT_COLORS[e.type] || "#388bfd", boxShadow: `0 0 6px ${EVENT_COLORS[e.type]}60` }} />
                    {i < timeline.length - 1 && <div style={s.timelineLine} />}
                  </div>
                  <div style={s.timelineContent}>
                    <div style={s.timelineTime}>{e.date} · {e.time}</div>
                    <div style={s.timelineEvent}>
                      <span style={s.timelineIcon}>{EVENT_ICONS[e.type] || "📋"}</span>
                      {e.event}
                    </div>
                    <div style={s.timelineDetail}>{e.detail}</div>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Add event */}
          <div style={s.addEvent}>
            <div style={s.addTitle}>Add Event</div>
            <div style={s.addRow}>
              <input style={s.input} value={newEvent.event} onChange={e => setNewEvent(p => ({ ...p, event: e.target.value }))} placeholder="Event title..." />
              <select style={s.select} value={newEvent.type} onChange={e => setNewEvent(p => ({ ...p, type: e.target.value }))}>
                {["open", "evidence", "suspect", "arrest", "update", "closed"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <input style={{ ...s.input, marginBottom: 8 }} value={newEvent.detail} onChange={e => setNewEvent(p => ({ ...p, detail: e.target.value }))} placeholder="Event details..." />
            <button style={s.addBtn} onClick={addEvent} disabled={!newEvent.event}>Add to Timeline →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  header: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 4 },
  sub: { fontSize: 13, color: "var(--text2)" },
  layout: { display: "grid", gridTemplateColumns: "240px 1fr", gap: 16 },
  casesCol: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 14, overflowY: "auto", maxHeight: "calc(100vh - 200px)" },
  colTitle: { fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 10 },
  caseBtn: { width: "100%", textAlign: "left", background: "transparent", border: "1px solid transparent", borderRadius: 6, padding: "10px 10px", cursor: "pointer", marginBottom: 4, transition: "all 0.15s" },
  caseBtnActive: { background: "rgba(31,111,235,0.1)", border: "1px solid rgba(31,111,235,0.25)" },
  caseBtnId: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#388bfd", marginBottom: 2 },
  caseBtnTitle: { fontSize: 12, fontWeight: 500, color: "var(--text)", marginBottom: 2 },
  caseBtnStatus: { fontSize: 10, fontFamily: "'JetBrains Mono', monospace" },
  timelineCol: { display: "flex", flexDirection: "column", gap: 16 },
  caseInfo: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px" },
  caseInfoTitle: { fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 4 },
  caseInfoMeta: { fontSize: 12, color: "var(--text2)" },
  timeline: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 20, flex: 1 },
  empty: { fontSize: 13, color: "var(--text3)", fontStyle: "italic", textAlign: "center", padding: "30px 0" },
  timelineItem: { display: "flex", gap: 16, marginBottom: 0 },
  timelineLeft: { display: "flex", flexDirection: "column", alignItems: "center", width: 20, flexShrink: 0 },
  timelineDot: { width: 12, height: 12, borderRadius: "50%", flexShrink: 0 },
  timelineLine: { width: 2, flex: 1, background: "var(--border)", margin: "4px 0" },
  timelineContent: { flex: 1, paddingBottom: 20 },
  timelineTime: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text3)", marginBottom: 4 },
  timelineEvent: { fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 },
  timelineIcon: { fontSize: 14 },
  timelineDetail: { fontSize: 12, color: "var(--text2)", lineHeight: 1.5 },
  addEvent: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 16 },
  addTitle: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 10 },
  addRow: { display: "flex", gap: 8, marginBottom: 8 },
  input: { flex: 1, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", fontSize: 13, width: "100%" },
  select: { background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", fontSize: 12 },
  addBtn: { width: "100%", padding: "9px", background: "var(--blue)", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" },
};
