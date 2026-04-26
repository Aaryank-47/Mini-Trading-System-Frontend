# 🚀 Nexus Institutional Trading Terminal (Frontend)

<div align="center">
  <p>A flagship, ultra-premium cryptocurrency trading dashboard designed with <b>Glassmorphism 3.0</b> and lightning-fast <b>60FPS React DOM Rendering</b> for high-volume traders.</p>
</div>

---

## 🌌 Overview

The **Nexus Mini-Trading-System** is a highly reactive, responsive, and performance-tuned frontend built. Our goal was to replicate the intensity and precision of real Wall Street trading terminals (like Bloomberg and Kraken Pro), while injecting a sleek, modern, cyberpunk-inspired UI.

### 🎨 The Glassmorphic Grid Architecture
Unlike standard web apps, this frontend utilizes a completely custom **CSS-driven cursor-tracking system**.
We bypassed native React `useState` tracking for background glows to eliminate render cycle lag. Instead, the UI reads directly from a React `useRef` and manipulates custom CSS variables (`--mouse-x`, `--mouse-y`) to power massive, full-screen transparent glowing grids—operating at a flawless 60 FPS under heavy chart loads without triggering a single React re-render.

---

## ⚡ Core Features

- **Dynamic Theme Profiles**: Every module has a distinct institutional color identity.
  - 🟦 **Dashboard**: Deep Sapphire Blue for broad portfolio overviews.
  - 🟩 **Market Heatmap**: Emerald Green for high-volume liquidity analysis.
  - 🟧 **Execution Trade Deck**: Warning Amber to signify active financial commitment. 
  - 🟪 **Notification Center**: Neon Violet for critical system and security alerts.
  
- **Pro-Level 3-Column Trade Deck**: A complete overhaul of the trading interface replicating elite exchanges. 
  - Left: Interactive Market Pairs.
  - Center: Live Rechart area graph mapping to asset volatility.
  - Right: Execution payload form & Free Margin limits.

- **Global Command Palette**: Hit `Ctrl + K` (or via the UI) to summon a global routing search bar that mimics Mac's Spotlight and immediately teleports you to deep application routes.

- **State Persistence**: Redux slices gracefully manage Session States, Portfolio Holdings, and Trade Histories, backing directly onto a Python FastAPI backend.

---

## 🛠️ Tech Stack

- **React 18** - UI Component Engine.
- **Tailwind CSS V3** - Utility-first styling with deeply configured blur drop-shadows and mesh gradients.
- **Redux Toolkit** - Bulletproof state management for Portfolio sync and Auth.
- **React Router DOM V6** - Fast, lazy-loaded Single Page Application execution.
- **Recharts** - Lightning-fast SVG charting data visualization.
- **Lucide React** - Crisp, featherweight SVG icon taxonomy.

---

## 🗺️ Application Topology & Routes

| Route Protocol | Terminal Module | Description |
| :--- | :--- | :--- |
| `/` | **Dashboard** | The command center. Displays total equity, active positions, and high-level spark metrics. |
| `/market` | **Market Intel** | Live data tables mapping 24h Trends, Volume caps, and direct 'Execute' entry points. |
| `/trade/:symbol` | **Execution Deck** | Real-time AreaCharts, slippage protection, and Buy/Sell execution payloads. |
| `/portfolio` | **Asset Matrix** | Full breakdown of holdings, unrealized P&L, pie-allocations, and withdraw portals. |
| `/orders` | **Transaction Ledger**| The immutable record of all historical filled and rejected orders. |
| `/settings` | **Security Hub** | 2FA, Biometrics, API Rate limits, Session revocation, and KYC profiles. |
| `/support` | **Knowledge Base** | Tier-1 support pipeline, Live System Status, FAQ accordions, and Ticket Submission. |
| `/notifications` | **Alert Center** | Real-time push notifications for Stop-Loss triggers, Deposits, and Security warnings. |

---

## 🚀 Getting Started

### 1. Requirements
Ensure you have **Node.js (v16+)** installed on your machine.

### 2. Installation
Clone the repository, drop into the directory, and invoke the install protocol:
```bash
npm install
```

### 3. Launching Development Server
Fire up Vite's HMR server:
```bash
npm run dev
```

The application will spin up at `http://localhost:5173`.

> **Note on Backend**: The frontend fetches live endpoints from the deployed backend instance `https://mini-trading-system-backend.onrender.com`. Ensure you have active internet connectivity to fetch live auth schemas and execution chains.

---

## 👨‍💻 Architects

Proudly engineered, refined, and deployed by:
- **Aaryan** 

_Built for the future of decentralized and institutional finance._
