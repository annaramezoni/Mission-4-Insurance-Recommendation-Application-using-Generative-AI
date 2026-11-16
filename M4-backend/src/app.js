import cors from "cors";
import express from "express";
import { randomUUID } from "crypto";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import routes from "./routes/index.js";

const genAi = new GoogleGenAI({
  apiKey: process.env["GEMINI_API_KEY"],
});

const MODEL = "gemini-3.5-flash-lite";

// ========== SYSTEM PROMPT ========== //

const systemPrompt = ``;

// ========== GEMINI FUNCTION ========== //

// ========== EXPRESS CONFIGURATION ========== //
const app = express();
app.use(cors());
app.use(express.json());
routes(app);

export default app;
