# 🥋 DebugDojo

<h3 align="center">A gamified AI debugging mentor powered by Xiaomi MiMo V2.5 Pro</h3>

<p align="center">
Generate realistic bug missions, solve them, get AI judging, and level up your developer rank through MiMo-powered coaching.
</p>

<p align="center">
  🚀 <strong>Live Demo:</strong> <a href="https://debug-dojo.vercel.app/">https://debug-dojo.vercel.app/</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NEXT.JS-14-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/TYPESCRIPT-5-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/AI_ENGINE-MiMo_V2.5_Pro-FF6900?style=flat-square&logo=xiaomi" />
  <img src="https://img.shields.io/badge/STREAMING-SSE-00FFD5?style=flat-square" />
  <img src="https://img.shields.io/badge/GAMIFICATION-XP_+_Ranks-8BFF6A?style=flat-square" />
</p>

---

## Overview

**DebugDojo** turns debugging practice into a daily AI-powered training game. Developers choose a mission type — **Debug**, **Refactor**, **Test Writer**, or **Explain** — and Xiaomi MiMo V2.5 Pro generates a fresh mission with a realistic scenario, broken code, constraints, hints, and expected focus areas. The user submits a fix or explanation, then MiMo judges the answer with a score, missing issues, improved solution, and next-step lesson.

The core problem: developers improve fastest through feedback loops, but realistic code review and debugging mentorship is expensive and inconsistent. DebugDojo creates an always-available AI mentor that generates practice tasks, streams guidance in real time, evaluates answers, and rewards progress with XP, ranks, achievements, and activity history.

---

## Why this is MiMo-native

DebugDojo does not use AI as a cosmetic chatbot. MiMo powers the core product loop:

```text
User level + selected mission type
        ↓
MiMo generates a contextual debugging mission via SSE
        ↓
User submits code / reasoning / tests
        ↓
MiMo judges correctness, edge cases, and explanation quality
        ↓
XP + rank + achievements update
        ↓
MiMo mentor gives personalized follow-up coaching
```

This creates a closed learning loop: **generate → solve → judge → coach → level up**.

---

## Core AI Workflows

### 1. MiMo Mission Generator

MiMo generates original coding missions across four categories:

- **Debug** — find the bug and propose a fix
- **Refactor** — improve readability, reliability, and maintainability
- **Test Writer** — design regression tests and edge cases
- **Explain** — teach the underlying concept clearly

Each mission adapts to the user's level:

| Level | Difficulty |
|---|---|
| 1–4 | Easy |
| 5–11 | Medium |
| 12+ | Hard |

Missions use randomized creative scenarios such as haunted deployments, pirate APIs, lunar bases, robot kitchens, and dragon databases to avoid repetitive template fatigue.

### 2. MiMo Answer Judge

After the user submits an answer, MiMo evaluates it as a strict but helpful senior code reviewer. The judging output includes:

- Score out of 100
- Correct parts
- Missing issues
- Improved solution
- One next-step lesson

The score drives XP rewards:

| Score | Reward |
|---|---:|
| 85+ | 90 XP |
| 65–84 | 60 XP |
| <65 | 30 XP |

### 3. MiMo Mentor Chat

The user can ask a contextual mentor for hints, debugging strategy, architecture advice, or explanations. The mentor knows the user's rank, level, and learning progress.

### 4. SSE Streaming UX

All major AI interactions stream token-by-token through an internal `/api/mimo` route. This creates immediate feedback and shows MiMo as the active reasoning engine behind the product.

---

## Features

- 🥋 Gamified debugging dojo
- 🧠 MiMo V2.5 Pro mission generation
- ⚖️ AI answer judging and scoring
- 💬 Mentor chat with personalized coaching
- ⚡ Real-time SSE token streaming
- 🏆 XP, ranks, achievements, and activity feed
- 🎲 Randomized mission themes to prevent repetition
- 💾 Local state persistence with `localStorage`
- 🧪 Fallback mission mode when API is unavailable

---

## Architecture

```text
┌────────────────────┐
│  Developer action  │
│ type / answer / Q  │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Next.js Client UI  │
│ XP + rank engine   │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ /api/mimo proxy    │
│ SSE + Token Plan   │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Xiaomi MiMo V2.5   │
│ mission/judge/chat │
└────────────────────┘
```

---

## Token Plan Usage Estimate

DebugDojo is designed to be token-efficient but high-frequency.

| Interaction | Estimated tokens |
|---|---:|
| Mission generation | 1K–2K |
| Answer judging | 1K–2K |
| Mentor chat | 300–800 |
| Full learning loop | 2.5K–5K |

A realistic daily demo usage of 300–500 full loops would consume roughly **750K–2.5M tokens/day**. A smaller review/demo setting of 100–200 loops would consume roughly **250K–1M tokens/day**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI Engine | Xiaomi MiMo V2.5 Pro |
| Streaming | Server-Sent Events |
| Storage | localStorage |
| Deployment | Vercel-ready |

---

## Getting Started

```bash
git clone <repo-url>
cd debugdojo
npm install
cp .env.example .env.local
npm run dev
```

Set your MiMo Token Plan key:

```env
MIMO_API_KEY=your-token-plan-key
MIMO_ENDPOINT=https://token-plan-sgp.xiaomimimo.com/v1
MIMO_MODEL=mimo-v2.5-pro
```

---

## Application Description

I built **DebugDojo**, a gamified AI debugging mentor powered by Xiaomi MiMo V2.5 Pro. The project solves the problem that developers need consistent, realistic feedback to improve debugging skills, but human mentorship and code review are not always available. DebugDojo creates a closed-loop AI workflow where users choose a mission type, MiMo generates a fresh debugging/refactoring/testing/explanation challenge, the user submits their fix, MiMo judges the answer, and the app updates XP, ranks, achievements, and learning history.

The core logic flow is: user skill state + mission type → MiMo mission generation through SSE → user solution submission → MiMo judging and feedback → XP/rank progression → personalized mentor chat. This creates a continuous AI-driven practice loop rather than a one-off chatbot. MiMo is used for long-form reasoning, code review, feedback generation, and coaching, with token-by-token streaming for an interactive training experience.

---

## License

MIT
