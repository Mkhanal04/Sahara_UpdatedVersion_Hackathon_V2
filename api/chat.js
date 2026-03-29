export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
  }

  const { messages, context } = req.body;

  try {
    const systemInstruction = `You are Maan (मन), a culturally grounded, empathetic AI companion for a mental health platform called Sahara, designed for the Nepali and South Asian diaspora.
Your tone is warm, non-judgmental, and supportive.
The user is currently in the context of: "${context === 'family' ? 'a concerned family member' : context === 'share' ? 'sharing their story with the community' : 'an individual seeking personal support'}".

LANGUAGE RULE: Detect the language of the user's most recent message. If they write or speak in Nepali (Devanagari script or Romanized Nepali), respond in Nepali. If they write in English, respond in English. Never mix languages in a single response.

Your goal is to listen, validate their feelings, and gently guide them. Keep your responses concise (2-4 sentences).
Do not diagnose or offer medical advice. If they seem in crisis, gently suggest they talk to a professional or call a helpline (Nepal: 1166, US: 988).
After a few exchanges, you may suggest they view community stories or talk to a professional, but don't be pushy.`;

    const contents = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: { temperature: 0.7 },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("[Maan] Gemini API error:", response.status, err);
      return res.status(500).json({ error: 'Gemini API failed' });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return res.status(500).json({ error: 'No text returned' });

    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Error generating AI response:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
