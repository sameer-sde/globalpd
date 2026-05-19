export const COUNTRIES = [
  "United States", "United Kingdom", "India", "Germany", "France",
  "Australia", "Canada", "Japan", "Brazil", "South Africa",
  "UAE", "Singapore", "Mexico", "Italy", "Spain"
];

export const CRIME_TYPES = [
  "Homicide", "Cybercrime", "Terrorism", "Drug Trafficking",
  "Human Trafficking", "Fraud", "Kidnapping", "Armed Robbery",
  "Money Laundering", "Organized Crime"
];

export const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export const PRIORITY_COLORS = {
  Low: "#3fb950",
  Medium: "#e3b341",
  High: "#f0883e",
  Critical: "#f85149",
};

export const STATUS_COLORS = {
  Open: "#388bfd",
  Investigation: "#e3b341",
  Arrested: "#f0883e",
  Closed: "#3fb950",
};

export const RANKS = [
  "Constable", "Sergeant", "Inspector", "Chief Inspector",
  "Superintendent", "Commissioner"
];

export const INITIAL_CASES = [
  { id: "C-001", title: "Operation Darkweb", type: "Cybercrime", country: "United States", city: "New York", priority: "Critical", status: "Investigation", date: "2026-05-10", officer: "Agent Rivera", description: "Large-scale dark web marketplace trafficking stolen financial data across 12 countries.", suspects: 3, arrests: 1 },
  { id: "C-002", title: "Harbor Smuggling Ring", type: "Drug Trafficking", country: "United Kingdom", city: "London", priority: "High", status: "Open", date: "2026-05-12", officer: "Inspector Patel", description: "Coordinated drug smuggling operation using commercial shipping containers.", suspects: 7, arrests: 0 },
  { id: "C-003", title: "Project Phoenix", type: "Terrorism", country: "Germany", city: "Berlin", priority: "Critical", status: "Investigation", date: "2026-05-08", officer: "Officer Müller", description: "Suspected cell planning coordinated attacks on infrastructure.", suspects: 5, arrests: 2 },
  { id: "C-004", title: "Golden Triangle Fraud", type: "Fraud", country: "India", city: "Mumbai", priority: "High", status: "Arrested", date: "2026-05-05", officer: "Inspector Sharma", description: "Multi-crore investment fraud scheme targeting retail investors.", suspects: 4, arrests: 4 },
  { id: "C-005", title: "Missing Diplomat", type: "Kidnapping", country: "UAE", city: "Dubai", priority: "Critical", status: "Open", date: "2026-05-14", officer: "Agent Al-Rashid", description: "Senior diplomat reported missing. Last seen at international summit.", suspects: 2, arrests: 0 },
  { id: "C-006", title: "Cartel Crossroads", type: "Organized Crime", country: "Mexico", city: "Mexico City", priority: "High", status: "Investigation", date: "2026-05-09", officer: "Agent Reyes", description: "Cross-border cartel operation linked to 3 homicides.", suspects: 12, arrests: 3 },
  { id: "C-007", title: "SkyNet Breach", type: "Cybercrime", country: "Japan", city: "Tokyo", priority: "Medium", status: "Closed", date: "2026-05-01", officer: "Officer Tanaka", description: "State-sponsored cyber attack on financial infrastructure. Perpetrators identified.", suspects: 2, arrests: 2 },
  { id: "C-008", title: "Cape Town Trafficking", type: "Human Trafficking", country: "South Africa", city: "Cape Town", priority: "Critical", status: "Investigation", date: "2026-05-11", officer: "Inspector Dlamini", description: "Transnational human trafficking network operating across 5 African nations.", suspects: 9, arrests: 4 },
];

export const INITIAL_OFFICERS = [
  { id: "O-001", name: "Agent Rivera", country: "United States", rank: "Inspector", status: "On Duty", cases: 12, arrests: 28, avatar: "🕵️" },
  { id: "O-002", name: "Inspector Patel", country: "United Kingdom", rank: "Chief Inspector", status: "On Scene", cases: 18, arrests: 41, avatar: "👮" },
  { id: "O-003", name: "Officer Müller", country: "Germany", rank: "Sergeant", status: "Available", cases: 8, arrests: 15, avatar: "🚔" },
  { id: "O-004", name: "Inspector Sharma", country: "India", rank: "Superintendent", status: "On Duty", cases: 24, arrests: 67, avatar: "🔍" },
  { id: "O-005", name: "Agent Al-Rashid", country: "UAE", rank: "Inspector", status: "On Scene", cases: 9, arrests: 19, avatar: "🕵️" },
  { id: "O-006", name: "Agent Reyes", country: "Mexico", rank: "Sergeant", status: "Available", cases: 15, arrests: 33, avatar: "👮" },
];

export const ACTIVITY_FEED = [
  { id: 1, time: "2 min ago", type: "arrest", msg: "Inspector Sharma made an arrest in Case C-004", country: "India" },
  { id: 2, time: "8 min ago", type: "alert", msg: "CRITICAL alert issued for Case C-005 — Missing Diplomat", country: "UAE" },
  { id: 3, time: "15 min ago", type: "update", msg: "Case C-003 status updated to Investigation", country: "Germany" },
  { id: 4, time: "32 min ago", type: "new", msg: "New case C-008 opened — Cape Town Trafficking", country: "South Africa" },
  { id: 5, time: "1 hr ago", type: "closed", msg: "Case C-007 closed — SkyNet Breach resolved", country: "Japan" },
  { id: 6, time: "2 hr ago", type: "dispatch", msg: "Agent Al-Rashid dispatched to Dubai — Case C-005", country: "UAE" },
];
