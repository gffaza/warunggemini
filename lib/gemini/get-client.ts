import {
  GoogleGenerativeAI,
  type GenerationConfig,
  type GenerativeModel,
} from "@google/generative-ai";

let client: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
    client = new GoogleGenerativeAI(apiKey);
  }
  return client;
}

export function getGeminiModel(
  model: string,
  generationConfig?: GenerationConfig,
): GenerativeModel {
  return getGeminiClient().getGenerativeModel({ model, generationConfig });
}
