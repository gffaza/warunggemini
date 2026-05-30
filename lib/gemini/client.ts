import {
  geminiParseResponseSchema,
  type GeminiParseResponse,
} from "@/domain/schemas/chat.schema";
import { getGeminiClient } from "@/lib/gemini/get-client";
import { GEMINI_FLASH } from "@/lib/gemini/models";
import { parseJsonResponse } from "@/lib/gemini/parse-json-response";
import { buildChatParsePrompt } from "@/lib/gemini/prompts/chat-parse.prompt";

export async function parseTransactionMessage(
  message: string,
): Promise<GeminiParseResponse> {
  const response = await getGeminiClient().models.generateContent({
    model: GEMINI_FLASH,
    contents: buildChatParsePrompt(message),
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned empty response");
  }

  return parseJsonResponse(text, geminiParseResponseSchema, "Gemini");
}
