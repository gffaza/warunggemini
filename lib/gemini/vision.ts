import {
  visionScanResponseSchema,
  type VisionScanResponse,
} from "@/domain/schemas/inventory.schema";
import type { VisionScanResult } from "@/domain/types/inventory";
import { getGeminiClient } from "@/lib/gemini/get-client";
import { GEMINI_VISION } from "@/lib/gemini/models";
import { parseJsonResponse } from "@/lib/gemini/parse-json-response";
import { VISION_SCAN_PROMPT } from "@/lib/gemini/prompts/vision-scan.prompt";

export async function analyzeShelfImage(
  imageBase64: string,
  mimeType: string,
): Promise<VisionScanResult> {
  const model = getGeminiClient().getGenerativeModel({
    model: GEMINI_VISION,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  });

  const result = await model.generateContent([
    { text: VISION_SCAN_PROMPT },
    {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    },
  ]);

  const data: VisionScanResponse = parseJsonResponse(
    result.response.text(),
    visionScanResponseSchema,
    "Gemini vision",
  );

  return {
    items: data.items,
    confidence: data.confidence,
    notes: data.notes,
  };
}
