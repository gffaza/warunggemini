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
  const model = getGeminiClient().getGenerativeModel({
    model: GEMINI_FLASH,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const result = await model.generateContent(buildChatParsePrompt(message));
  return parseJsonResponse(
    result.response.text(),
    geminiParseResponseSchema,
    "Gemini",
  );
}
