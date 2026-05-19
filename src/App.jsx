import { useState } from "react";
import { Sidebar } from "./components/Sidebar.jsx";
import { Dashboard } from "./components/Dashboard.jsx";
import { CasesPanel } from "./components/CasesPanel.jsx";
import { OfficersPanel } from "./components/OfficersPanel.jsx";
import { AIAnalyst } from "./components/AIAnalyst.jsx";
import { DispatchPanel } from "./components/DispatchPanel.jsx";
import { WorldMap } from "./components/WorldMap.jsx";
import { AnalyticsPanel } from "./components/AnalyticsPanel.jsx";
import { SuspectTracker } from "./components/SuspectTracker.jsx";
import { CaseTimeline } from "./components/CaseTimeline.jsx";
import { EvidenceVault } from "./components/EvidenceVault.jsx";
import { SuspectProfiler } from "./components/SuspectProfiler.jsx";
import { ThreatLevelSystem } from "./components/ThreatLevelSystem.jsx";
import { MissionBriefing } from "./components/MissionBriefing.jsx";
import { IntelBulletin } from "./components/IntelBulletin.jsx";
import { LoginScreen } from "./components/LoginScreen.jsx";
import { GlobalSearch } from "./components/GlobalSearch.jsx";
import { NotificationCenter } from "./components/NotificationCenter.jsx";
import { OfficerChat } from "./components/OfficerChat.jsx";
import { WantedWall } from "./components/WantedWall.jsx";
import { CaseLinkBoard } from "./components/CaseLinkBoard.jsx";
import { UndercoverTracker } from "./components/UndercoverTracker.jsx";
import { INITIAL_CASES, INITIAL_OFFICERS, ACTIVITY_FEED } from "./data/data.js";

export default function App() {
  const [officer, setOfficer] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [cases, setCases] = useState(INITIAL_CASES);
  const [officers] = useState(INITIAL_OFFICERS);
  const [activity, setActivity] = useState(ACTIVITY_FEED);
  const [alerts, setAlerts] = useState([]);

  function addActivity(msg, type, country) {
    setActivity(prev => [{ id: Date.now(), time: "Just now", type, msg, country }, ...prev.slice(0, 19)]);
  }

  function addCase(newCase) {
    setCases(prev => [newCase, ...prev]);
    addActivity(`New case ${newCase.id} opened — ${newCase.title}`, "new", newCase.country);
  }

  function updateCase(id, updates) {
    setCases(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    addActivity(`Case ${id} updated`, "update", "");
  }

  function addAlert(msg) {
    const a = { id: Date.now(), msg };
    setAlerts(prev => [a, ...prev.slice(0, 3)]);
    addActivity(msg, "alert", "");
    setTimeout(() => setAlerts(prev => prev.filter(x => x.id !== a.id)), 5000);
  }

  if (!officer) return <LoginScreen onLogin={setOfficer} />;

  const stats = {
    totalCases: cases.length,
    open: cases.filter(c => c.status === "Open").length,
    investigation: cases.filter(c => c.status === "Investigation").length,
    arrested: cases.filter(c => c.status === "Arrested").length,
    closed: cases.filter(c => c.status === "Closed").length,
    critical: cases.filter(c => c.priority === "Critical").length,
    totalOfficers: officers.length,
    onDuty: officers.filter(o => o.status === "On Duty" || o.status === "On Scene").length,
    totalArrests: cases.reduce((a, c) => a + c.arrests, 0),
  };

  const props = { cases, officers, activity, stats, addCase, updateCase, addAlert, setPage, officer };

  const pages = {
    dashboard: <Dashboard {...props} />,
    map: <WorldMap {...props} />,
    threat: <ThreatLevelSystem {...props} />,
    cases: <CasesPanel {...props} />,
    suspects: <SuspectTracker {...props} />,
    wanted: <WantedWall {...props} />,
    evidence: <EvidenceVault {...props} />,
    timeline: <CaseTimeline {...props} />,
    linkboard: <CaseLinkBoard {...props} />,
    undercover: <UndercoverTracker {...props} />,
    chat: <OfficerChat {...props} />,
    dispatch: <DispatchPanel {...props} />,
    profiler: <SuspectProfiler {...props} />,
    mission: <MissionBriefing {...props} />,
    bulletin: <IntelBulletin {...props} />,
    analytics: <AnalyticsPanel {...props} />,
    analyst: <AIAnalyst {...props} />,
    officers: <OfficersPanel {...props} />,
  };

  return (
    <div style={s.root}>
      <div style={s.alertStack}>
        {alerts.map(a => (
          <div key={a.id} style={s.alertToast}>
            <span style={{ color: "#f85149" }}>🚨</span>
            <span style={{ fontSize: 12, color: "var(--text)" }}>{a.msg}</span>
          </div>
        ))}
      </div>

      <Sidebar page={page} setPage={setPage} stats={stats} officer={officer} />

      <main style={s.main}>
        <div style={s.topbar}>
          <div style={s.topbarLeft}>
            <span className="live-dot" />
            <span style={s.liveText}>SYSTEM ONLINE</span>
            <span style={s.sep}>|</span>
            <span style={s.time}>{new Date().toUTCString().slice(0, 25)} UTC</span>
          </div>
          <div style={s.topbarCenter}>
            <GlobalSearch cases={cases} officers={officers} setPage={setPage} />
          </div>
          <div style={s.topbarRight}>
            <div style={s.critBadge}>🚨 {stats.critical} CRITICAL</div>
            <div style={s.dutyBadge}>👮 {stats.onDuty}/{stats.totalOfficers} ON DUTY</div>
            <NotificationCenter activity={activity} />
            <button style={s.logoutBtn} onClick={() => setOfficer(null)} title="Logout">🔓</button>
          </div>
        </div>

        <div style={s.content} className="fade-in" key={page}>
          {pages[page]}
        </div>
      </main>
    </div>
  );
}

const s = {
  root: { display: "flex", minHeight: "100vh", background: "var(--bg)" },
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px", background: "var(--bg2)", borderBottom: "1px solid var(--border)", flexShrink: 0, gap: 16 },
  topbarLeft: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
  liveText: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#3fb950", letterSpacing: "0.1em" },
  sep: { color: "var(--border)", fontSize: 12 },
  time: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text2)" },
  topbarCenter: { flex: 1, display: "flex", justifyContent: "center" },
  topbarRight: { display: "flex", gap: 8, alignItems: "center", flexShrink: 0 },
  critBadge: { background: "rgba(248,81,73,0.1)", border: "1px solid rgba(248,81,73,0.3)", borderRadius: 4, padding: "4px 8px", fontSize: 10, color: "#f85149", fontFamily: "'JetBrains Mono', monospace" },
  dutyBadge: { background: "rgba(63,185,80,0.1)", border: "1px solid rgba(63,185,80,0.3)", borderRadius: 4, padding: "4px 8px", fontSize: 10, color: "#3fb950", fontFamily: "'JetBrains Mono', monospace" },
  logoutBtn: { background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 8px", cursor: "pointer", fontSize: 14 },
  content: { flex: 1, padding: "22px", overflowY: "auto" },
  alertStack: { position: "fixed", top: 16, right: 16, zIndex: 1000, display: "flex", flexDirection: "column", gap: 8 },
  alertToast: { background: "rgba(248,81,73,0.1)", border: "1px solid rgba(248,81,73,0.4)", borderRadius: 6, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, backdropFilter: "blur(8px)", animation: "fadeIn 0.3s ease", maxWidth: 360 },
};
