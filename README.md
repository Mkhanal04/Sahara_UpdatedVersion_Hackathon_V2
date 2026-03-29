# Sahara

### Culturally-Grounded Mental Health Support for Families and Individuals

**Nepal-US Hackathon 2026 · Team 23**

**Live demo:** [team23hackathon.vercel.app](https://team23hackathon.vercel.app)

---

## The Problem

Modern mental health technology assumes the person in distress will self-refer. In collectivist cultures — Nepal, South Asia, and diaspora communities worldwide — that assumption breaks down. The family member notices first. They see the withdrawal, the sleepless nights, the missed responsibilities. But they have no structured pathway. "Psychiatrist" feels like calling their loved one *paagal*. They don't know where to start.

The intervention gap is at the **family level**, not the individual level.

---

## Our Solution

Sahara is a mental health platform with **two front doors**: one for concerned family members, one for individuals seeking support. Both paths lead to the same destination — culturally-grounded guidance, community connection, and professional help when ready.

Instead of pushing users toward clinical labels or urgent intervention, Sahara builds **mental fitness capacity** first. Users explore, learn from others' stories, and connect with professionals on their own timeline — reducing stigma by reframing mental health as something everyone tends to.

---

## Features

### For Families (Sita's Door)
- **Intake flow** — describe what you're observing in plain language, no clinical terms required
- **Maan (AI Companion)** — context-aware AI chat that understands you're speaking as a family member
- **AI-Organized Summary** — observations structured into a shareable brief for a professional
- **Consultation Booking** — connect with a clinical psychologist for a family guidance session

### For Individuals (Ram's Door)
- **Individual intake** — describe what you're experiencing in your own words
- **Maan** — AI companion framed for individual support, with prompts tailored to personal experience
- **Professional connection** — book an individual session when ready

### Shared Platform
- **Ma Pani (Explore)** — browse articles, community Q&A, and video content on mental wellness
- **Chautari (Community Feed)** — anonymous community stories with AI-organized patterns; expert cards from verified professionals; **Similar Patterns on Sahara** surfaces peer experiences that resonate
- **Private Journal** — PIN-gated space for personal reflection (demo PIN: 1234)
- **Crisis resources** on every screen — Nepal: **1166** · US: **988**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vite + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| AI | Google Gemini 2.0 Flash |
| Deployment | Vercel |

---

## Team

| Name | Role |
|------|------|
| Milan Khanal | PM / Team Lead |
| Tanu Nepal | Research & Engineering |
| Saroj Shrestha | Research & Content |
| Utsav Shrestha | Design & Frontend |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com/app/apikey))

### Installation

```bash
git clone <repo-url>
cd Sahara_UpdatedVersion_Hackathon_V2
npm install
cp .env.example .env
# Add your Gemini key to .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key. If absent, the app automatically uses hardcoded demo summaries for both Sita and Ram — no setup required for demo purposes. |

> **Demo mode:** The app works without a real Gemini key. All AI features fall back to realistic hardcoded content, indistinguishable in the demo.

---

## Demo Flow

### Sita's Journey (~90 seconds)
1. Land on home screen → choose **"I'm concerned about someone I love"**
2. Browse **Ma Pani** — explore community stories and wellness content
3. Enter **Maan** — describe observations via AI chat ("He's been withdrawing, not sleeping")
4. View **AI-Organized Summary** — observations structured for a professional
5. **Book a consultation** with Dr. Anjali Sharma (Family Guidance session)

### Ram's Quick Peek (~30 seconds)
1. Back to home → choose **"I'm looking for support for myself"**
2. Enter **Maan** — now framed for individual experience with different prompts
3. Shows the platform serves both doors with the same care

---

## Ethics & Safety

- **No diagnostic claims.** Sahara organizes observations — it never labels, categorizes, or diagnoses.
- **Crisis resources on every screen.** Nepal: 1166 · US: 988. Non-negotiable.
- **No real patient data.** All professional and community data is seeded demo content.
- **HCAI-grounded.** Aligned with Shneiderman's HCAI framework, WHO 2024/2025 guidelines, and 100+ RCTs on family psychoeducation.
- **Community content is anonymous.** No identifiable information in Chautari posts.

---

## Hackathon

**Event:** Nepal-US Hackathon 2026
**Problem Statement:** "Create solutions that lower mental health stigma and improve early support in culturally conservative communities."
**Submission:** March 29, 2026
**Team:** Team 23

---

*Rooted in Nepal, designed for the world.*
