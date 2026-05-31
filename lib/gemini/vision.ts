import {
  visionScanResponseSchema,
  type VisionScanResponse,
} from "@/domain/schemas/inventory.schema";
import type { VisionScanResult } from "@/domain/types/inventory";
import { getGeminiModel } from "@/lib/gemini/get-client";
import { GEMINI_VISION } from "@/lib/gemini/models";
import { parseJsonResponse } from "@/lib/gemini/parse-json-response";
import { VISION_SCAN_PROMPT } from "@/lib/gemini/prompts/vision-scan.prompt";

export async function analyzeShelfImage(
  imageBase64: string,
  mimeType: string,
): Promise<VisionScanResult> {
  const model = getGeminiModel(GEMINI_VISION, {
    responseMimeType: "application/json",
    temperature: 0.1,
  });
  const response = await model.generateContent([
    { text: VISION_SCAN_PROMPT },
    {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    },
  ]);

  const text = response.response.text();

  if (!text) {
    throw new Error("Gemini vision returned empty response");
  }

  const data: VisionScanResponse = parseJsonResponse(
    text,
    visionScanResponseSchema,
    "Gemini vision",
  );

  return {
    items: data.items,
    confidence: data.confidence,
    notes: data.notes,
  };
}
