# MarginDefense.ai

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
