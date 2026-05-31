import {
  geminiParseResponseSchema,
  type GeminiParseResponse,
} from "@/domain/schemas/chat.schema";
import { getGeminiModel } from "@/lib/gemini/get-client";
import { GEMINI_FLASH } from "@/lib/gemini/models";
import { parseJsonResponse } from "@/lib/gemini/parse-json-response";
import { buildChatParsePrompt } from "@/lib/gemini/prompts/chat-parse.prompt";

export async function parseTransactionMessage(
  message: string,
): Promise<GeminiParseResponse> {
  const model = getGeminiModel(GEMINI_FLASH, {
    responseMimeType: "application/json",
    temperature: 0.2,
  });
  const response = await model.generateContent(buildChatParsePrompt(message));

  const text = response.response.text();

  if (!text) {
    throw new Error("Gemini returned empty response");
  }

  return parseJsonResponse(text, geminiParseResponseSchema, "Gemini");
}
