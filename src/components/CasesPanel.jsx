import { useState } from "react";
import { COUNTRIES, CRIME_TYPES, PRIORITIES, PRIORITY_COLORS, STATUS_COLORS } from "../data/data.js";
import { CountryImage, CrimeTypeImage } from "./CountryImages.jsx";

export function CasesPanel({ cases, addCase, updateCase }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("grid");
  const [form, setForm] = useState({ title: "", type: CRIME_TYPES[0], country: COUNTRIES[0], city: "", priority: "Medium", officer: "", description: "" });

  const filtered = cases.filter(c => {
    const mf = filter === "All" || c.status === filter || c.priority === filter;
    const ms = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase()) || c.type.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  function createCase() {
    if (!form.title || !form.city) return;
    addCase({ ...form, id: `C-${String(cases.length + 1).padStart(3, "0")}`, status: "Open", date: new Date().toISOString().slice(0, 10), suspects: 0, arrests: 0 });
    setShowCreate(false);
    setForm({ title: "", type: CRIME_TYPES[0], country: COUNTRIES[0], city: "", priority: "Medium", officer: "", description: "" });
  }

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Case Files</h1>
          <p style={s.sub}>{cases.length} cases across all jurisdictions</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ ...s.viewBtn, ...(view === "grid" ? s.viewActive : {}) }} onClick={() => setView("grid")}>⊞ Grid</button>
          <button style={{ ...s.viewBtn, ...(view === "table" ? s.viewActive : {}) }} onClick={() => setView("table")}>☰ Table</button>
          <button style={s.createBtn} onClick={() => setShowCreate(true)}>+ New Case</button>
        </div>
      </div>

      <div style={s.filterRow}>
        <input style={s.search} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cases..." />
        <div style={s.filters}>
          {["All","Open","Investigation","Arrested","Closed","Critical"].map(f => (
            <button key={f} style={{ ...s.filterBtn, ...(filter === f ? s.filterActive : {}) }} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {view === "grid" && (
        <div style={s.grid}>
          {filtered.map(c => (
            <div key={c.id} style={s.card} onClick={() => setSelected(c)}>
              <CrimeTypeImage type={c.type} width="100%" height={100} />
              <div style={s.cardBody}>
                <div style={s.cardTop}>
                  <span style={s.cardId}>{c.id}</span>
                  <span style={{ ...s.badge, color: PRIORITY_COLORS[c.priority], border: `1px solid ${PRIORITY_COLORS[c.priority]}30`, background: `${PRIORITY_COLORS[c.priority]}10` }}>{c.priority}</span>
                </div>
                <div style={s.cardTitle}>{c.title}</div>
                <div style={s.cardMeta}>
                  <CountryImage country={c.country} size={60} />
                  <div>
                    <div style={s.cardCountry}>📍 {c.city}, {c.country}</div>
                    <div style={s.cardType}>{c.type}</div>
                    <span style={{ ...s.badge, color: STATUS_COLORS[c.status], border: `1px solid ${STATUS_COLORS[c.status]}30`, background: `${STATUS_COLORS[c.status]}10`, marginTop: 4, display: "inline-block" }}>{c.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "table" && (
        <div style={s.table}>
          <div style={s.tableHead}>
            {["Case ID","Title","Type","Country","Priority","Status","Officer","Arrests","Action"].map(h => <div key={h} style={s.th}>{h}</div>)}
          </div>
          {filtered.map(c => (
            <div key={c.id} style={s.tableRow} onClick={() => setSelected(c)}>
              <div style={s.td}><span style={s.caseId}>{c.id}</span></div>
              <div style={s.td}>{c.title}</div>
              <div style={s.td}><span style={s.tag}>{c.type}</span></div>
              <div style={s.td}>{c.country}</div>
              <div style={s.td}><span style={{ ...s.badge, color: PRIORITY_COLORS[c.priority], border: `1px solid ${PRIORITY_COLORS[c.priority]}30`, background: `${PRIORITY_COLORS[c.priority]}10` }}>{c.priority}</span></div>
              <div style={s.td}><span style={{ ...s.badge, color: STATUS_COLORS[c.status], border: `1px solid ${STATUS_COLORS[c.status]}30`, background: `${STATUS_COLORS[c.status]}10` }}>{c.status}</span></div>
              <div style={s.td}>{c.officer || "—"}</div>
              <div style={s.td}><span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#f0883e" }}>{c.arrests}</span></div>
              <div style={s.td}><button style={s.actionBtn} onClick={e => { e.stopPropagation(); setSelected(c); }}>View</button></div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div style={s.overlay} onClick={() => setSelected(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <CrimeTypeImage type={selected.type} width="100%" height={150} />
            <div style={{ padding: 20 }}>
              <div style={s.modalHeader}>
                <div><div style={s.modalId}>{selected.id}</div><div style={s.modalTitle}>{selected.title}</div></div>
                <button style={s.closeBtn} onClick={() => setSelected(null)}>✕</button>
              </div>
              <div style={s.modalGrid}>
                {[["Type",selected.type],["Country",selected.country],["City",selected.city],["Priority",selected.priority],["Status",selected.status],["Officer",selected.officer||"Unassigned"],["Suspects",selected.suspects],["Arrests",selected.arrests],["Date",selected.date]].map(([k,v]) => (
                  <div key={k}><div style={s.mLabel}>{k}</div><div style={s.mVal}>{v}</div></div>
                ))}
              </div>
              <div style={s.descBox}><div style={s.mLabel}>Description</div><div style={{ fontSize:13,color:"var(--text)",lineHeight:1.6 }}>{selected.description}</div></div>
              <div style={s.modalActions}>
                {["Open","Investigation","Arrested","Closed"].map(st => (
                  <button key={st} style={{ ...s.statusBtn, ...(selected.status===st?{background:`${STATUS_COLORS[st]}15`,borderColor:STATUS_COLORS[st],color:STATUS_COLORS[st]}:{}) }}
                    onClick={() => { updateCase(selected.id,{status:st}); setSelected({...selected,status:st}); }}>{st}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreate && (
        <div style={s.overlay} onClick={() => setShowCreate(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={{ padding: 24 }}>
              <div style={s.modalHeader}><div style={s.modalTitle}>Open New Case</div><button style={s.closeBtn} onClick={() => setShowCreate(false)}>✕</button></div>
              <div style={s.formGrid}>
                {[{k:"title",l:"Case Title *"},{k:"city",l:"City *"},{k:"officer",l:"Officer"}].map(f => (
                  <div key={f.k}><label style={s.mLabel}>{f.l}</label><input style={s.input} value={form[f.k]} onChange={e => setForm(p=>({...p,[f.k]:e.target.value}))} /></div>
                ))}
                {[{k:"type",l:"Crime Type",opts:CRIME_TYPES},{k:"country",l:"Country",opts:COUNTRIES},{k:"priority",l:"Priority",opts:PRIORITIES}].map(f => (
                  <div key={f.k}><label style={s.mLabel}>{f.l}</label><select style={s.input} value={form[f.k]} onChange={e => setForm(p=>({...p,[f.k]:e.target.value}))}>{f.opts.map(o=><option key={o}>{o}</option>)}</select></div>
                ))}
              </div>
              <div style={{marginBottom:14}}><label style={s.mLabel}>Description</label><textarea style={{...s.input,resize:"vertical"}} rows={3} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} /></div>
              <button style={s.submitBtn} onClick={createCase}>Open Case →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  header:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16},
  title:{fontSize:22,fontWeight:700,color:"var(--text)",marginBottom:4},
  sub:{fontSize:13,color:"var(--text2)"},
  viewBtn:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:6,padding:"7px 12px",color:"var(--text2)",fontSize:12,cursor:"pointer"},
  viewActive:{background:"rgba(31,111,235,0.15)",borderColor:"#388bfd",color:"#388bfd"},
  createBtn:{background:"var(--blue)",border:"none",borderRadius:6,color:"#fff",fontSize:13,fontWeight:600,padding:"8px 14px",cursor:"pointer"},
  filterRow:{display:"flex",gap:12,marginBottom:16,alignItems:"center",flexWrap:"wrap"},
  search:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:6,padding:"8px 12px",color:"var(--text)",fontSize:13,width:220},
  filters:{display:"flex",gap:6,flexWrap:"wrap"},
  filterBtn:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:4,padding:"5px 12px",color:"var(--text2)",fontSize:12,cursor:"pointer"},
  filterActive:{background:"rgba(31,111,235,0.15)",borderColor:"#388bfd",color:"#388bfd"},
  grid:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14},
  card:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:8,overflow:"hidden",cursor:"pointer",transition:"border-color 0.15s"},
  cardBody:{padding:"10px 12px"},
  cardTop:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6},
  cardId:{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#388bfd"},
  badge:{fontSize:10,padding:"2px 7px",borderRadius:3,fontFamily:"'JetBrains Mono',monospace"},
  cardTitle:{fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:8,lineHeight:1.3},
  cardMeta:{display:"flex",gap:8,alignItems:"flex-start"},
  cardCountry:{fontSize:11,color:"var(--text2)",marginBottom:2},
  cardType:{fontSize:10,color:"var(--text3)"},
  table:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:8,overflow:"hidden"},
  tableHead:{display:"grid",gridTemplateColumns:"70px 1fr 100px 110px 80px 100px 110px 60px 70px",padding:"10px 14px",background:"var(--bg3)",borderBottom:"1px solid var(--border)"},
  tableRow:{display:"grid",gridTemplateColumns:"70px 1fr 100px 110px 80px 100px 110px 60px 70px",padding:"11px 14px",borderBottom:"1px solid var(--border2)",cursor:"pointer",alignItems:"center"},
  th:{fontSize:10,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase"},
  td:{fontSize:13,color:"var(--text2)"},
  caseId:{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#388bfd"},
  tag:{fontSize:10,color:"var(--text2)",background:"var(--bg3)",padding:"2px 6px",borderRadius:3},
  actionBtn:{background:"rgba(31,111,235,0.1)",border:"1px solid rgba(31,111,235,0.25)",borderRadius:4,color:"#388bfd",fontSize:11,padding:"3px 8px",cursor:"pointer"},
  overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20},
  modal:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:10,maxWidth:560,width:"100%",maxHeight:"90vh",overflowY:"auto"},
  modalHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16},
  modalId:{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#388bfd",marginBottom:4},
  modalTitle:{fontSize:17,fontWeight:700,color:"var(--text)"},
  closeBtn:{background:"none",border:"none",color:"var(--text2)",cursor:"pointer",fontSize:18},
  modalGrid:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14},
  mLabel:{fontSize:10,color:"var(--text3)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4,display:"block"},
  mVal:{fontSize:13,color:"var(--text)",fontWeight:500},
  descBox:{background:"var(--bg3)",borderRadius:6,padding:12,marginBottom:14},
  modalActions:{display:"flex",gap:8},
  statusBtn:{flex:1,padding:"8px",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:6,color:"var(--text2)",fontSize:12,cursor:"pointer"},
  formGrid:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12},
  input:{width:"100%",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:6,padding:"8px 10px",color:"var(--text)",fontSize:13},
  submitBtn:{width:"100%",padding:"11px",background:"var(--blue)",border:"none",borderRadius:6,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"},
};
