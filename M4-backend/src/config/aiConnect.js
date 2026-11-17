import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

// Gemini configuration
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const MODEL = "gemini-3.5-flash-lite";
export const FALLBACK_MODEL = "gemini-3.1-flash-lite";

export { Type, ThinkingLevel };
