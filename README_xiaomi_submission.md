# DebugDojo — Xiaomi MiMo Submission

## Project Overview

**DebugDojo** is a gamified AI debugging mentor powered by Xiaomi MiMo V2.5 Pro. It turns coding practice into a closed-loop learning system where developers generate realistic missions, solve them, receive AI judging, and level up through XP, ranks, and achievements.

The project solves a simple but important problem: developers often need consistent practice with debugging, refactoring, test writing, and explanation skills, but high-quality mentorship and code review are not always available. DebugDojo makes that practice interactive, personalized, and repeatable.

---

## Why this project fits Xiaomi MiMo

DebugDojo is built around MiMo as the **core reasoning engine**, not as a cosmetic chatbot. MiMo powers the most important product loops:

1. **Mission generation** — MiMo creates fresh debugging, refactoring, test-writing, and explanation challenges.
2. **Answer judging** — MiMo evaluates the user's solution like a senior code reviewer.
3. **Mentor coaching** — MiMo provides follow-up hints, debugging strategies, and learning guidance.
4. **Real-time streaming** — all AI outputs are streamed token-by-token with SSE for an interactive experience.

This makes MiMo visible, useful, and central to the product story.

---

## Core User Flow

```text
User opens DebugDojo
        ↓
Chooses a mission type
        ↓
MiMo generates a challenge through SSE
        ↓
User submits a fix, explanation, or test strategy
        ↓
MiMo judges the answer and returns feedback
        ↓
XP, level, rank, achievements, and history update
        ↓
User asks MiMo mentor for follow-up coaching
```

This closed-loop workflow is the heart of the product.

---

## AI-Driven Workflow Details

### 1. Mission Generator
MiMo generates realistic coding missions based on:
- selected mission type
- user level
- difficulty
- random theme

Mission types:
- Debug
- Refactor
- Test Writer
- Explain

### 2. Answer Judge
After the user submits a response, MiMo returns:
- score /100
- what was correct
- what was missing
- improved solution direction
- next-step lesson

### 3. Mentor Chat
Users can ask MiMo for:
- hints
- debugging strategies
- architecture advice
- concept explanations

---

## Product Features

- Gamified XP and rank progression
- Mission generation with creative themes
- AI judging and coaching loop
- SSE token streaming
- Achievement tracking
- Activity feed
- Local persistence with `localStorage`
- Vercel-ready web deployment

---

## Technical Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **AI Engine:** Xiaomi MiMo V2.5 Pro
- **Streaming:** Server-Sent Events
- **Storage:** localStorage
- **Deployment:** Vercel

---

## Token Usage Estimate

A full learning loop typically uses:
- Mission generation: 1K–2K tokens
- Answer judging: 1K–2K tokens
- Mentor coaching: 300–800 tokens

Estimated full loop: **2.5K–5K tokens**

This makes the app suitable for frequent testing and daily engagement while still showing meaningful MiMo usage.

---

## What the screenshots show

The attached screenshot pack includes:
1. Landing page and mission buttons
2. Generated mission flow
3. Answer judging with XP/achievement update
4. Mentor chat and activity feed

---

## Submission Summary

DebugDojo is designed to showcase Xiaomi MiMo as a practical reasoning engine for real developer learning. It is not just a chatbot demo. It is a complete AI-driven training workflow with generation, evaluation, coaching, and gamified progression.
