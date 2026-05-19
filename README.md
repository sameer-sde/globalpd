# 🔰 GlobalPD — International Police Operations Platform

> A full-featured AI-powered police operations dashboard connecting law enforcement across countries. Track cases, manage suspects, dispatch officers, and generate intelligence reports.

![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Version](https://img.shields.io/badge/Version-5.0.0-blue?style=flat-square)

---



## ✨ Features

### 🗂 Operations
| Feature | Description |
|---------|-------------|
| 📁 Case Management | Create, track, filter, and update cases with grid/table views |
| 👤 Suspect Tracker | Full suspect profiles with threat levels and linked cases |
| 🎯 Wanted Wall | Criminal poster wall with rewards and warrants |
| 🔒 Evidence Vault | Log and categorize all types of evidence per case |
| ⏱ Case Timeline | Chronological event log for every case |
| 🔗 Case Link Board | SVG network board connecting related cases with red string |
| 🕵️ Undercover Ops | Track covert agents, cover integrity, and intel gathered |

### 🌍 Intelligence
| Feature | Description |
|---------|-------------|
| 🧠 AI Suspect Profiler | Describe a crime → AI generates full psychological profile |
| 📋 Mission Briefing | AI-generated classified tactical mission briefings |
| 📰 Intel Bulletin | Daily AI intelligence report across all jurisdictions |
| 🚨 Threat Level System | 5-level global and per-country threat assessment |
| 🤖 AI Crime Analyst | Chat with AI to analyze patterns, generate reports |
| 📊 Analytics | Donut charts, bar charts, KPI cards across all data |

### 👮 Personnel & Comms
| Feature | Description |
|---------|-------------|
| 💬 Officer Chat | Encrypted inter-agency communications channel |
| 📡 Dispatch Center | Broadcast alerts and manage officer assignments |
| 👮 Officer Profiles | Rank system, case stats, duty status |
| 🔔 Notifications | Real-time activity feed with unread count |

### 🌐 Platform
| Feature | Description |
|---------|-------------|
| 🔐 Login System | Officer authentication with role-based access |
| 🔍 Global Search | Search across cases, officers, countries (Cmd+K) |
| 🌍 World Map | Country photos + case pins per jurisdiction |
| 🖼 Crime Scene Images | Real photos for each crime type on case cards |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Anthropic API key → [console.anthropic.com](https://console.anthropic.com)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/globalpd.git
cd globalpd

# 2. Install dependencies
npm install

# 3. Add your API key
cp .env.example .env.local
# Edit .env.local:
# VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here

# 4. Start the app
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

### Demo Login Credentials

| Officer ID | Password | Name | Rank |
|-----------|----------|------|------|
| `GPD-001` | `inspector` | Inspector Sharma | Superintendent |
| `GPD-002` | `london` | Inspector Patel | Chief Inspector |
| `GPD-003` | `admin` | Commissioner Reed | Commissioner |

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| Claude Sonnet 4 | AI features (profiler, briefings, analyst, bulletin) |
| Unsplash API | Country & crime scene photos |
| SVG | Case link network board |
| Web Speech API | (Voice mode — Deadline Detective) |
| localStorage | Session & data persistence |

---

## 📁 Project Structure

```
globalpd/
├── src/
│   ├── components/
│   │   ├── LoginScreen.jsx        # Officer authentication
│   │   ├── Sidebar.jsx            # Navigation — 18 pages
│   │   ├── Dashboard.jsx          # Command overview
│   │   ├── WorldMap.jsx           # Global case map with photos
│   │   ├── CasesPanel.jsx         # Case management
│   │   ├── SuspectTracker.jsx     # Suspect profiles
│   │   ├── WantedWall.jsx         # Criminal poster wall
│   │   ├── EvidenceVault.jsx      # Evidence management
│   │   ├── CaseTimeline.jsx       # Case event log
│   │   ├── CaseLinkBoard.jsx      # Red string network board
│   │   ├── UndercoverTracker.jsx  # Covert operations
│   │   ├── OfficerChat.jsx        # Inter-agency comms
│   │   ├── DispatchPanel.jsx      # Officer dispatch
│   │   ├── SuspectProfiler.jsx    # AI profiler
│   │   ├── MissionBriefing.jsx    # AI mission generator
│   │   ├── IntelBulletin.jsx      # AI daily bulletin
│   │   ├── ThreatLevelSystem.jsx  # Global threat levels
│   │   ├── AnalyticsPanel.jsx     # Charts & KPIs
│   │   ├── AIAnalyst.jsx          # AI chat analyst
│   │   ├── OfficersPanel.jsx      # Officer profiles
│   │   ├── GlobalSearch.jsx       # Cmd+K search
│   │   ├── NotificationCenter.jsx # Activity notifications
│   │   └── CountryImages.jsx      # Photo utilities
│   ├── data/
│   │   └── data.js                # Cases, officers, mock data
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── .env.example
└── README.md
```

---

## 🚢 Deploy to Vercel (Free)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repo
3. Add `VITE_ANTHROPIC_API_KEY` in Environment Variables
4. Click Deploy ✅

---



## 🤝 Contributing

Pull requests welcome!

1. Fork the repo
2. Create branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "Add your feature"`
4. Push & open a Pull Request

---

## 📄 License

MIT — free to use, fork, and build on.

⭐ **Star the repo if you found it useful!**
