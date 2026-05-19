import { useState } from "react";

const OFFICERS = [
  { id: "GPD-001", password: "inspector", name: "Inspector Sharma", rank: "Superintendent", country: "India", avatar: "🔍" },
  { id: "GPD-002", password: "london", name: "Inspector Patel", rank: "Chief Inspector", country: "United Kingdom", avatar: "👮" },
  { id: "GPD-003", password: "admin", name: "Commissioner Reed", rank: "Commissioner", country: "United States", avatar: "🎖" },
];

export function LoginScreen({ onLogin }) {
  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    if (!officerId || !password) { setError("Enter your Officer ID and password."); return; }
    setLoading(true);
    setTimeout(() => {
      const officer = OFFICERS.find(o => o.id === officerId && o.password === password);
      if (officer) {
        onLogin(officer);
      } else {
        setError("Invalid credentials. Access denied.");
        setLoading(false);
      }
    }, 1200);
  }

  return (
    <div style={s.page}>
      {/* Scanline effect */}
      <div style={s.scanline} />
      <div style={s.grid} />

      <div style={s.card}>
        <div style={s.logo}>
          <div style={s.logoIcon}>🔰</div>
          <div style={s.logoTitle}>GlobalPD</div>
          <div style={s.logoSub}>INTERNATIONAL OPERATIONS CENTER</div>
        </div>

        <div style={s.divider} />

        <div style={s.classifiedBanner}>
          🔒 CLASSIFIED SYSTEM — AUTHORIZED ACCESS ONLY
        </div>

        <div style={s.field}>
          <label style={s.label}>OFFICER ID</label>
          <input style={s.input} value={officerId} onChange={e => setOfficerId(e.target.value)}
            placeholder="GPD-XXX" onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>

        <div style={s.field}>
          <label style={s.label}>ACCESS CODE</label>
          <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>

        {error && <div style={s.error}>⚠ {error}</div>}

        <button style={s.loginBtn} onClick={handleLogin} disabled={loading}>
          {loading ? "AUTHENTICATING..." : "→ ACCESS SYSTEM"}
        </button>

        <div style={s.hint}>
          <div style={s.hintTitle}>Demo Credentials</div>
          {OFFICERS.map(o => (
            <div key={o.id} style={s.hintRow}>
              <span style={s.hintId}>{o.id}</span>
              <span style={s.hintPass}>/ {o.password}</span>
              <span style={s.hintName}>{o.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#080c12", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" },
  grid: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(31,111,235,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(31,111,235,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" },
  scanline: { position: "fixed", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)", pointerEvents: "none", zIndex: 0 },
  card: { background: "rgba(13,17,23,0.95)", border: "1px solid rgba(31,111,235,0.3)", borderRadius: 12, padding: "40px 40px 32px", width: 420, position: "relative", zIndex: 1, backdropFilter: "blur(20px)", boxShadow: "0 0 40px rgba(31,111,235,0.1)" },
  logo: { textAlign: "center", marginBottom: 24 },
  logoIcon: { fontSize: 44, filter: "drop-shadow(0 0 16px rgba(31,111,235,0.8))", marginBottom: 10 },
  logoTitle: { fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700, color: "#388bfd", letterSpacing: "0.1em" },
  logoSub: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(56,139,253,0.5)", letterSpacing: "0.2em", marginTop: 4 },
  divider: { borderTop: "1px solid rgba(31,111,235,0.15)", margin: "0 0 20px" },
  classifiedBanner: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#f85149", background: "rgba(248,81,73,0.06)", border: "1px solid rgba(248,81,73,0.2)", borderRadius: 4, padding: "7px 12px", textAlign: "center", letterSpacing: "0.08em", marginBottom: 24 },
  field: { marginBottom: 16 },
  label: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(56,139,253,0.7)", letterSpacing: "0.15em", display: "block", marginBottom: 6 },
  input: { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(31,111,235,0.25)", borderRadius: 6, padding: "11px 14px", color: "#e6edf3", fontSize: 14, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" },
  error: { background: "rgba(248,81,73,0.08)", border: "1px solid rgba(248,81,73,0.25)", borderRadius: 6, padding: "9px 12px", fontSize: 12, color: "#f85149", marginBottom: 14, fontFamily: "'JetBrains Mono', monospace" },
  loginBtn: { width: "100%", padding: "13px", background: "var(--blue)", border: "none", borderRadius: 6, color: "#fff", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.1em", marginBottom: 24 },
  hint: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "12px 14px" },
  hintTitle: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(139,148,158,0.5)", letterSpacing: "0.15em", marginBottom: 8 },
  hintRow: { display: "flex", gap: 10, alignItems: "center", marginBottom: 5 },
  hintId: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#388bfd" },
  hintPass: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(139,148,158,0.5)" },
  hintName: { fontSize: 11, color: "rgba(139,148,158,0.6)" },
};
