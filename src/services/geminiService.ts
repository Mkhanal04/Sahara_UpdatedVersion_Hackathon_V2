import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// The platform injects process.env.GEMINI_API_KEY
const apiKey = typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : (import.meta as any).env?.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export async function generateChatResponse(messages: { role: 'user' | 'model', text: string }[], context: string) {
  try {
    const systemInstruction = `You are Maan (मन), a culturally grounded, empathetic AI companion for a mental health platform called Sahara, designed for the Nepali and South Asian diaspora. 
Your tone is warm, non-judgmental, and supportive. You use occasional Nepali words naturally (like 'sathi', 'Namaste', 'ekdam').
The user is currently in the context of: "${context}".
Your goal is to listen, validate their feelings, and gently guide them. Keep your responses concise (1-3 short paragraphs).
Do not diagnose or offer medical advice. If they seem in crisis, gently suggest they talk to a professional or use the crisis resources.
After a few exchanges, you may suggest they view community stories or talk to a professional, but don't be pushy.`;

    const contents = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "I'm having a little trouble connecting right now, sathi. Please try again in a moment.";
  }
}
