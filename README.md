<div align="center">

# PathMind

**AI-Powered Personalized Learning Path System**

An intelligent platform that maps personality traits to optimal AI career paths and generates tailored learning roadmaps — built with React 19, TypeScript, Neo4j, and DeepSeek.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Neo4j](https://img.shields.io/badge/Neo4j-5-4581C3?style=flat-square&logo=neo4j&logoColor=white)](https://neo4j.com/)

</div>

---

## Overview

PathMind combines MBTI personality assessment with graph-based career matching to help users discover their ideal path in the AI industry. The system analyzes cognitive preferences across four dimensions, then leverages a Neo4j knowledge graph to recommend careers, generate skill trees, and build step-by-step learning plans.

### Key Capabilities

- **Personality Assessment** — Three test depths (quick 12q / standard 28q / deep 48q) with four question types: binary choice, Likert scale, scenario-based, and ranking
- **Career Matching** — Graph-powered recommendation engine maps 16 MBTI types to AI career paths with skill gap analysis
- **Learning Roadmaps** — Auto-generated course sequences from beginner to advanced, personalized by personality and target role
- **AI Advisor** — Context-aware chat assistant (DeepSeek) that provides real-time study guidance and answers domain questions
- **Knowledge Graph** — Interactive force-directed visualization of skills, careers, and course relationships
- **Admin Dashboard** — Question management, student analytics, batch import/export

---

## Architecture

```
Frontend                          Backend                    Data
─────────────────────────────     ──────────────────────     ──────────────
React 19 + TypeScript             Express + TypeScript       Neo4j Graph DB
Tailwind CSS 4 + Framer Motion    Neo4j Driver               DeepSeek API
Three.js (WebGL background)       Zod validation
HeroUI + Recharts
```

### Design System

- CSS custom properties for light/dark theming with `.dark` class toggle
- Glassmorphism UI with `backdrop-filter` blur layers
- Noto Serif SC + Inter font pairing
- Lucide icon set (SVG, tree-shakeable)
- WebGL particle grid background via Three.js + React Three Fiber
- Framer Motion page transitions with blur/fade effects

---

## Getting Started

### Prerequisites

- Node.js 18+
- Neo4j Desktop or Neo4j AuraDB
- DeepSeek API Key

### Setup

```bash
# Clone
git clone https://github.com/shiro123444/PathMind-AI.git
cd PathMind-AI

# Install dependencies
./setup.sh          # Linux/Mac
# .\setup.ps1       # Windows

# Configure environment
cp server/.env.example server/.env
# Edit server/.env with your Neo4j and DeepSeek credentials

# Seed database
cd server && npm run seed && cd ..

# Start backend (port 3001)
cd server && npm run dev

# Start frontend (port 5173) — in a separate terminal
npm run dev
```

### Endpoints

| Service | URL |
|---------|-----|
| Frontend | `http://localhost:5173` |
| API | `http://localhost:3001/api` |
| Health | `http://localhost:3001/api/health` |

---

## Project Structure

```
src/
├── pages/                  # Route-level views
│   ├── HomePageBPCO.tsx    # Landing page
│   ├── MBTITestPage.tsx    # Test engine
│   ├── ResultsPage.tsx     # Personality analysis
│   ├── CareerPage.tsx      # Career recommendations
│   ├── LearningPathPage.tsx
│   ├── AIAdvisor.tsx       # Chat interface
│   ├── GraphPage.tsx       # Knowledge graph
│   └── admin/              # Admin panel
├── components/
│   ├── ui/                 # Shared UI primitives
│   ├── mbti/               # Test question components
│   ├── animations/         # Motion & transition
│   └── premium/            # Glass panel, 3D card
├── theme/
│   ├── ThemeContext.tsx     # Dark/light provider + toggle
│   ├── colors.ts           # Color tokens
│   ├── motion.ts           # Animation presets
│   └── premium.ts          # Glass utilities
├── types/                  # TypeScript interfaces
└── services/               # API client layer

server/src/
├── routes/                 # REST endpoints
├── config/                 # Neo4j + env config
└── scripts/                # DB seed scripts
```

---

## API Reference

```
POST /api/mbti/submit                    # Submit test answers
GET  /api/mbti/type/:code                # Get type profile
GET  /api/careers/recommend/:mbtiCode    # Career recommendations
GET  /api/learning-path/career/:id       # Learning path for career
POST /api/chat                           # AI chat message
GET  /api/graph/full                     # Full knowledge graph
GET  /api/graph/student/:id              # Student-specific subgraph
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| UI Framework | React 19 | Component architecture |
| Language | TypeScript 5.9 | Type safety |
| Build | Vite 7 | Dev server + bundling |
| Styling | Tailwind CSS 4 | Utility-first CSS with CSS variable theming |
| Animation | Framer Motion 12 | Layout animations, page transitions |
| Components | HeroUI 2.8 | Base UI components |
| Charts | Recharts 3.5 | Radar charts, bar charts |
| 3D | Three.js + R3F | WebGL background effects |
| Graph Viz | react-force-graph-2d | Knowledge graph rendering |
| Icons | Lucide React | SVG icon system |
| Backend | Express 4.18 | REST API |
| Database | Neo4j 5.15 | Graph queries for career/skill matching |
| AI | DeepSeek API | Chat completions (OpenAI-compatible) |
| Validation | Zod 3.22 | Runtime schema validation |

---

## License

MIT © 2025 PathMind
