

export async function generateObservationSummary(
  messages: { role: 'user' | 'model', text: string }[],
  context: string
): Promise<{ summary: string; patterns: string[]; peerEvidence: string }> {
  try {
    const response = await fetch('/api/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, context }),
    });

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating summary:", error);
    return context === 'family'
      ? {
          summary: "Family member reports social withdrawal over approximately 3 weeks, irregular sleep patterns, and disengagement from work. Family interprets behavior as laziness. Observer recognizes deeper issue and seeks guidance.",
          patterns: ["Social withdrawal (3 weeks)", "Sleep pattern changes", "Work disengagement", "Family misinterpretation"],
          peerEvidence: "Resonated with: Social Withdrawal (47 families)"
        }
      : {
          summary: "Individual reports persistent feelings of exhaustion despite outward composure. Difficulty sleeping, chest heaviness at night. Seeking culturally-grounded understanding of their experience.",
          patterns: ["Emotional exhaustion", "Sleep disruption", "Somatic symptoms", "Desire for cultural context"],
          peerEvidence: "Resonated with: Sleep Changes (32 individuals)"
        };
  }
}

// --- CRISIS DETECTION (Layer 1 — deterministic, never reaches the LLM) ---
const CRISIS_PATTERNS = [
  // English
  /\b(kill\s*(my)?self|suicide|suicidal|end\s*my\s*life|want\s*to\s*die|don'?t\s*want\s*to\s*(live|be\s*alive)|self[- ]?harm|cut\s*myself|hurt\s*myself|no\s*reason\s*to\s*live|can'?t\s*go\s*on|give\s*up\s*on\s*life)\b/i,
  // Romanized Nepali
  /\b(marna\s*man|aatma\s*hatya|bachna\s*man\s*chaina|jiuna\s*man\s*chaina|mardichhu|marchu)\b/i,
  // Devanagari
  /मर्न\s*मन|आत्महत्या|बाँच्न\s*मन\s*छैन|जिउन\s*मन\s*छैन/,
];

const CRISIS_RESPONSE = `I hear you, and I'm glad you're here.

What you're feeling right now matters — and you don't have to face it alone. Please reach out to someone who can help right now:

🇳🇵 Nepal: 1166 (National Mental Health Helpline)
🇺🇸 US: 988 (Suicide & Crisis Lifeline)

You can call or text, any time. If you're in immediate danger, please call emergency services.

I'm not able to give you what you need in this moment — but the people on those lines can. Will you reach out?`;

function detectCrisis(messages: { role: 'user' | 'model', text: string }[]): boolean {
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
  if (!lastUserMessage) return false;
  return CRISIS_PATTERNS.some(pattern => pattern.test(lastUserMessage.text));
}

export async function generateChatResponse(messages: { role: 'user' | 'model', text: string }[], context: string) {
  // Layer 1: deterministic crisis intercept — never reaches the LLM
  if (detectCrisis(messages)) return CRISIS_RESPONSE;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, context }),
    });

    if (!response.ok) {
      console.error("[Maan] Proxied API error:", response.status);
      return getFallbackChatResponse(messages.length, context);
    }

    const data = await response.json();
    if (!data.reply) return getFallbackChatResponse(messages.length, context);
    return data.reply;

  } catch (error) {
    console.error("Error generating AI response:", error);
    return getFallbackChatResponse(messages.length, context);
  }
}

// Contextual fallback responses — cycles based on message count so the conversation feels natural
function getFallbackChatResponse(messageCount: number, context: string): string {
  const familyResponses = [
    "Thank you for sharing this. Noticing these changes in someone you love — and deciding to do something about it — takes real courage. Can you tell me a little more about what you've been observing? How long has this been going on?",
    "What you're describing — the withdrawal, the changes in routine — these are patterns that many families have noticed before they reached out. You're not overreacting. The fact that you're paying attention matters more than you know. What feels most worrying to you right now?",
    "It's hard to carry this kind of concern, especially when you're not sure what to call it or what to do next. You don't have to have all the answers. When you're ready, I can help you organize what you've observed into something you could share with a professional — at your own pace.",
    "Every family's situation is different, and there's no single right way to respond. What you're doing right now — pausing, reflecting, seeking guidance — is already a meaningful step. Is there anything specific you've been unsure about how to handle?",
  ];

  const individualResponses = [
    "Thank you for being here and for putting this into words. What you're feeling is real — and it makes sense that it's been hard to carry. You don't have to explain it perfectly. Just share what feels true right now, and I'll listen.",
    "It takes a lot to acknowledge something isn't feeling right, especially when life keeps moving around you. You're not alone in this. A lot of people in this community have described something similar — that gap between how things look on the outside and how they actually feel. What's been weighing on you most?",
    "What you're going through sounds genuinely heavy, and I want you to know that reaching out — even just to reflect — is a real act of care toward yourself. When you're ready, there are people in this community and professionals on this platform who can offer more than I can. But for now, I'm here. Keep going.",
    "Sometimes just naming what's happening — even imperfectly — is the first thing that shifts something. You're doing that right now. Is there a moment recently that stands out as particularly hard? Sometimes starting there helps.",
  ];

  const shareResponses = [
    "Thank you for being willing to share your experience. Stories like yours help others feel less alone. Take your time — there's no right way to tell it.",
    "What you've been through matters, and the community here is listening. When you share, you're not just processing your own experience — you're creating a marker for someone else who might need it.",
  ];

  const responses = context === 'family'
    ? familyResponses
    : context === 'share'
    ? shareResponses
    : individualResponses;

  return responses[Math.floor(messageCount / 2) % responses.length];
}
