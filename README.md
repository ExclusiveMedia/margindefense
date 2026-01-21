# MarginDefense.ai V2 — Command Center

<div align="center">

![MarginDefense](https://img.shields.io/badge/MarginDefense-AI%20Operating%20System-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-2.0.0-green?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge)

**The AI Operating System for Business Profitability**

*Enterprise-grade margin protection for service businesses generating $100K+/month*

</div>

---

## 🎯 What is MarginDefense?

MarginDefense.ai is an AI-powered operating system that measures, optimizes, and governs human + AI labor based on **economic value**. It's the CFO-in-a-box that turns every hour of work into a visible ROI decision.

### Core Philosophy
- **Profit First**: Margin protection over raw output
- **Work Classification**: Billable vs Busy Work separation  
- **Client Experience**: Real-time clarity without endless meetings
- **Automation-First**: Manual data entry = design failure

---

## ✨ V2 Features — Command Center

### 📊 Executive Dashboard
- **Billable Ratio KPI** with trend analysis and 65% threshold alerts
- **At-Risk Revenue** tracking from scope creep and project overruns
- **AI Hours Saved** showing automation value
- **Efficiency Score** with letter grades (A+ to F)
- **Client Health Overview** at a glance

### 👥 Client Health Monitoring
- Per-client margin percentage visualization
- Sentiment indicators (Happy → At Risk)
- Retainer utilization tracking
- Risk scoring with priority sorting
- One-click "Optimize Now" actions

### 🤖 AI Agents
- **Margin Defender**: Real-time margin threshold monitoring
- **Intake Classifier**: Automatic work categorization
- **Scope Sentinel**: Scope creep pattern detection
- Agent status dashboard with efficiency scores
- Pause/Resume/Reset controls

### 🚨 Margin Alerts
- Real-time alert feed with severity levels
- Critical/Emergency alert prioritization
- AI-suggested actions for each alert
- Impact amount calculations
- One-click acknowledgment

### 🔥 The Incinerator (Work Feed)
- Live work log classification
- Billable vs Burn visual separation
- Manual reclassification with instant feedback
- Cost impact calculations

### 🛡️ Scope Shield
- Pending scope request inbox
- Convert/Reject/Accept Burn actions
- Risk value aggregation
- Client attribution

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🏗️ Architecture

```
src/
├── components/
│   ├── command-center/     # V2 KPI cards, client health
│   │   ├── KPICards.tsx
│   │   └── ClientMarginCards.tsx
│   ├── agents/             # AI agent monitoring
│   │   ├── AlertsPanel.tsx
│   │   └── AgentStatusPanel.tsx
│   ├── dashboard/          # Core dashboard components
│   ├── layout/             # App shell
│   ├── leakage/            # Burn analysis
│   └── scope-shield/       # Scope request management
├── hooks/
│   ├── useData.ts          # Data hooks
│   └── useCommandCenter.ts # V2 hooks
├── lib/
│   ├── classifier.ts       # Work classification engine
│   ├── store.ts            # Mock data store
│   └── utils.ts            # Utilities
├── pages/
│   ├── DashboardPage.tsx   # Command Center
│   ├── LeakagePage.tsx     # Burn analysis
│   ├── ScopeShieldPage.tsx # Scope requests
│   └── SettingsPage.tsx    # Configuration
├── types/                  # TypeScript definitions
└── integrations/
    └── supabase/           # Database integration
```

---

## 🎨 Design System

### Premium Enterprise Aesthetics
- **Dark mode optimized** for extended executive use
- **Glass morphism** with subtle gradients
- **Framer Motion** animations throughout
- **JetBrains Mono** for financial data
- **Space Grotesk** for headings
- **Color-coded severity** (Green → Amber → Rose)

### Key Visual Elements
- Glow effects on critical metrics
- Animated progress bars
- Live pulse indicators
- Hover micro-interactions
- Premium card shadows

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS 4.0 |
| Animations | Framer Motion |
| Routing | React Router 7 |
| State | React Hooks + Zustand |
| Database | Supabase (PostgreSQL) |
| Build | Vite 7 |
| Icons | Lucide React |

---

## 🔐 Database Schema

```sql
-- Core tables
organizations     -- Company settings
clients          -- Client profiles
projects         -- Project tracking
work_logs        -- Time/work entries
scope_requests   -- Scope creep inbox

-- V2 tables (planned)
margin_alerts    -- Real-time alerts
agent_logs       -- AI agent activity
client_health    -- Health snapshots
```

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy dist/ folder
```

### Netlify
```bash
npm run build
# Deploy dist/ folder with _redirects
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
CMD ["npm", "run", "preview"]
```

---

## 🔮 Roadmap

### Phase 1 ✅ Complete
- [x] Core dashboard with burn metrics
- [x] Work classification engine
- [x] Scope Shield
- [x] Command Center V2
- [x] Client Health cards
- [x] AI Agent monitoring
- [x] Margin Alerts

### Phase 2 — Coming Soon
- [ ] LLM-powered classification
- [ ] Slack/Teams integration
- [ ] CSV import (Toggl, Harvest)
- [ ] Client portal (external view)
- [ ] Benchmark data

### Phase 3 — Future
- [ ] Work verification layer
- [ ] Data cooperative
- [ ] Tokenization system
- [ ] Ghost Mode (zero-UI)

---

## 📄 License

Proprietary. All rights reserved.

---

<div align="center">

**Built for agencies and service businesses who refuse to watch their margins burn.**

[Get Started](/) • [Documentation](#) • [Support](#)

</div>

**Revenue Defense Platform** — The Automated CFO that protects your profit margins.

![MarginDefense](https://img.shields.io/badge/Version-0.1.0_MVP-red)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)

## 🔥 What Is This?

MarginDefense transforms how service businesses track profitability. Instead of boring time tracking, it shows you **money burning in real-time**.

**Old Way:** "Admin: 4 hours." (Boring. Ignored.)  
**New Way:** "Margin Burn: **-$600.00** (20% of Project Net Profit)" (Painful. Actionable.)

## 🎯 Core Features

### 1. The Burn Ticker
Real-time animated counter showing daily/weekly margin burn. Red numbers, fire effects, visceral impact.

### 2. The Incinerator Feed
Live feed of work events classified as:
- ✅ **Billable** (Revenue Generating)
- 🔥 **Margin Burn** (Non-billable overhead)
- ⚠️ **Scope Risk** (Potential scope creep)

### 3. Scope Shield
Inbox for catching "quick favors" and scope creep requests. Two actions:
- **Accept Burn** — Log it as a loss
- **Convert to Revenue** — Generate a quote/invoice

### 4. Leakage Analysis
- Burn by Client (bar chart)
- Burn by Category (pie chart)
- Hall of Shame (top 5 most expensive burn events)

### 5. Project Watch
Grid of project cards showing budget health with "UNDERWATER" warnings.

## 🚀 Quick Start

```bash
# Unzip the package
unzip margindefense-mvp-v2.zip
cd margindefense

# Install dependencies
npm install

# Start development server (runs in demo mode)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🗄️ Supabase Setup (Optional)

The MVP runs in demo mode with mock data. To connect to a real database:

### 1. Create Supabase Project
Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run the Schema
In Supabase SQL Editor, run:
```sql
-- First, run the schema
\i supabase/schema.sql

-- Then, seed demo data (optional)
\i supabase/seed.sql
```

### 3. Configure Environment
Create `.env` from the example:
```bash
cp .env.example .env
```

Add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Enable Supabase Client
Update `src/integrations/supabase/client.ts` to uncomment the full implementation.

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── BurnTicker.tsx       # Animated money counter
│   │   ├── IncineratorFeed.tsx  # Live work event feed
│   │   ├── ProjectWatch.tsx     # Project health cards
│   │   └── WorkLogForm.tsx      # Manual work entry
│   ├── scope-shield/
│   │   └── ScopeShield.tsx      # Scope creep inbox
│   ├── leakage/
│   │   └── LeakageAnalysis.tsx  # Charts & Hall of Shame
│   └── Layout.tsx               # App shell with navigation
├── pages/
│   ├── DashboardPage.tsx
│   ├── ScopeShieldPage.tsx
│   ├── LeakagePage.tsx
│   └── SettingsPage.tsx
├── hooks/
│   └── useData.ts               # React hooks for state
├── lib/
│   ├── classifier.ts            # AI classification engine
│   ├── store.ts                 # Mock data store
│   └── utils.ts                 # Utility functions
├── types/
│   └── index.ts                 # TypeScript definitions
└── index.css                    # Tailwind + custom styles
```

## 🧠 The Classification Engine

The "Incinerator" uses rule-based classification (expandable to LLM):

```typescript
// Billable keywords
['deliverable', 'client work', 'design', 'development', 'coding']

// Burn keywords  
['meeting', 'sync', 'email', 'slack', 'admin', 'rework', 'debugging']

// Scope risk keywords
['quick favor', 'can you also', 'while you\'re at it', 'additional']
```

Each work log gets:
- **Category**: billable | margin_burn | scope_risk | unclassified
- **Burn Reason**: internal_meeting | rework | admin | communication | etc.
- **Confidence Score**: 0-1 (for AI transparency)
- **Cost Impact**: duration × hourly_rate

## 🔌 Integration Ready (Middleware Architecture)

Built as **standalone + middleware**. Currently using manual entry + mock data. Designed for easy integration with:

| Integration | Status | Description |
|------------|--------|-------------|
| **Manual Entry** | ✅ Ready | Log work directly in the UI |
| **CSV Import** | 🔜 Next | Import from Harvest, Toggl, Clockify |
| **Slack** | 🔜 Planned | Auto-detect scope creep from channels |
| **Email** | 🔜 Planned | Forward client emails for analysis |
| **Jira/Asana** | 🔜 Planned | Sync tasks via webhooks |
| **Webhooks** | ✅ Architecture Ready | Real-time ingestion from any source |

### CRM Middleware Pattern

MarginDefense sits *between* your existing tools and your financial reality:

```
[Slack] ──┐
[Jira]  ──┼──▶ [MarginDefense] ──▶ [Pain Dashboard]
[Email] ──┘         │
                    ▼
              [Classification]
              [Cost Calculation]
              [Scope Detection]
```

## 🎨 Design System

Dark "control room" aesthetic with:
- **Burn colors**: Red gradients (#ef4444 → #7f1d1d)
- **Secure colors**: Green gradients (#22c55e → #14532d)
- **Fonts**: Space Grotesk (display), JetBrains Mono (numbers)
- **Effects**: Glow animations, pulsing warnings, animated counters

## 📊 Demo Data

The app comes seeded with realistic demo data:
- 3 clients (TechCorp, StartupXYZ, Enterprise Solutions)
- 3 projects (one UNDERWATER at 120% budget)
- 15+ work logs showing ~$4,200 in margin burn
- 3 pending scope creep requests (~$9,300 at risk)

Reset demo data anytime from Settings → Danger Zone.

## 🛣️ Roadmap

### MVP (Current) ✅
- [x] Manual work entry with AI classification
- [x] Burn metrics dashboard with animated tickers
- [x] Scope Shield inbox with Accept/Convert actions
- [x] Leakage analysis with charts
- [x] Project health monitoring
- [x] Settings and configuration

### Phase 2 (Next)
- [ ] Real LLM classification (Claude API)
- [ ] Supabase backend with RLS
- [ ] CSV import for time tracking tools
- [ ] User authentication

### Phase 3 (Future)
- [ ] Slack integration (OAuth + webhooks)
- [ ] Email forwarding/parsing
- [ ] Jira/Asana webhooks
- [ ] Real-time push alerts
- [ ] Quote/invoice generation
- [ ] Mobile responsive improvements

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 18 + TypeScript |
| **Build** | Vite 5 |
| **Styling** | Tailwind CSS 3 |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Routing** | React Router 6 |
| **State** | React hooks (ready for Zustand/TanStack Query) |
| **Backend** | Mock store (ready for Supabase) |

## 🔧 Configuration

### Environment Variables (for Supabase integration)

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Adjustable Settings

- **Hourly Rate**: Default $75/hour, configurable per org
- **Burn Threshold**: Alert when burn ratio > 20%
- **Classification Rules**: Extend keywords in `lib/classifier.ts`

## 📄 License

MIT — Built for TORQOS Revenue Operating System

---

**Stop tracking time. Start defending margins.** 🔥
