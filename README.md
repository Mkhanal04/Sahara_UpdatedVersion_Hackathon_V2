# Sahara — Culturally-Grounded Mental Health Guidance

**Nepal-US Hackathon 2026 | Team 23**

Sahara is a mental health platform designed for collectivist cultures where the family member — not the patient — is often the first person to notice something is wrong. The platform provides two front doors: one for concerned family members and one for individuals seeking help, connecting both with AI-guided conversations, community support, and licensed professionals.

## Problem Statement

*Statement 2: "Create solutions that lower mental health stigma and improve early support in culturally conservative communities."*

In collectivist cultures like Nepal, the family member notices first but has no structured pathway. Modern mental health tech assumes the patient self-refers. Sahara closes this gap by making the family member a first-class user.

## Quick Start

```bash
# Clone the repo
git clone https://github.com/Mkhanal04/Sahara_UpdatedVersion_Hackathon_V2.git
cd Sahara_UpdatedVersion_Hackathon_V2

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your Gemini API key to .env:
# GEMINI_API_KEY=your_key_here

# Run development server
npm run dev
```

The app will be available at `http://localhost:3000`.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **AI:** Google Gemini API (gemini-3-flash-preview)
- **Icons:** Lucide React
- **Animations:** Motion (Framer Motion)
- **Deployment:** Vercel

## Project Structure

```
src/
  App.tsx              # All screens and components (single-file architecture)
  index.css            # Tailwind theme with brand tokens
  main.tsx             # React entry point
  services/
    geminiService.ts   # Gemini API integration for Maan AI companion
```

## Features

### Patient / Family Side
- **Two-door entry:** "I'm concerned about someone I love" (family) and "I want to understand myself better" (individual)
- **Maan AI Companion:** Culturally-grounded conversational AI that adapts based on whether the user is a family member or individual
- **Chautari (Community Feed):** Anonymous story sharing with AI-organized summaries, "Me Too" solidarity, and category filters
- **Share Your Experience:** AI-guided intake that creates structured summaries from free-form conversation
- **Journal:** Private mood tracking and session history

### Professional Side
- **Queue Dashboard:** Today's consultations with origin tags (Family Guidance / Individual Intake)
- **Pre-Consultation Brief:** AI Summary, Client's Intake Words, Community Resonance data
- **Client vs. Subject of Concern:** For family consultations, clearly separates who is on the call (Sita) from who they're concerned about (Ram)
- **Help SAHARA Learn:** Feedback loop (Accurate / Missed Nuance) for AI self-improvement
- **Client Roster:** Historical view of all clients with shared context and consent tracking
- **Professional Profile:** Cultural & clinical focus, languages, client impact rating

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI conversations |

**Note:** The API key is injected into the client bundle at build time for this prototype. This is acceptable for the hackathon but requires a backend proxy for production use.

## Deployment (Vercel)

1. Import the repo at [vercel.com/new](https://vercel.com/new)
2. Framework: **Vite** (auto-detected)
3. Add environment variable: `GEMINI_API_KEY`
4. Deploy

Every push to `main` triggers an automatic deployment.

## Demo Flow

**Sita's Journey (~90 sec):**
Prototype Environment → Patient/Family → Home → "I'm concerned about someone I love" → Maan AI conversation (family context) → AI summary → Post to Chautari → View community stories

**Professional View (~30 sec):**
Prototype Environment → Professional → Login → Queue → Review Brief (Sita) → See AI Summary + Client's Intake Words → Help SAHARA Learn feedback

## Research Foundation

- **100+ RCTs** validate family psychoeducation as an effective intervention
- **0 competitors globally** with a family-member-as-first-user model (confirmed March 2026)
- **HCAI-grounded:** Aligned with Shneiderman's framework, WHO guidelines (March 2026)
- **Clinical reference:** Dr. Richa Amatya's research on stigma-caused delays in help-seeking (JPAN, 2018)

## Ethics & Safety

- **Crisis hotline on every screen:** Nepal 1166, US 988
- **No diagnostic claims:** The platform organizes observations — it never labels, categorizes, or diagnoses
- **No real patient data:** All data is seeded/mocked for the prototype
- **Professional-only responses:** Only licensed professionals can respond to community stories

## Team

| Name | Role |
|------|------|
| Milan Khanal | PM / Team Lead |
| [Teammate 2] | [Role] |
| [Teammate 3] | [Role] |
| [Teammate 4] | [Role] |
| [Teammate 5] | [Role] |

## License

Built for the Nepal-US Hackathon 2026. All rights reserved.
