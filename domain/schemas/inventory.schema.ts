import { z } from "zod";

export const DEFAULT_LOW_STOCK_THRESHOLD = 5;

export const stockStatusSchema = z.enum(["ok", "low", "empty"]);

export const detectedItemSchema = z.object({
  name: z.string().min(1),
  estimatedQty: z.number().int().nonnegative(),
  status: stockStatusSchema,
});

export const visionScanResponseSchema = z.object({
  items: z.array(detectedItemSchema),
  confidence: z.enum(["high", "medium", "low"]),
  notes: z.string().optional(),
});

export const batchUpsertItemSchema = z.object({
  name: z.string().trim().min(1),
  qty: z.number().int().nonnegative(),
});

export const batchUpsertRequestSchema = z.object({
  items: z.array(batchUpsertItemSchema).min(1).max(30),
});

export type VisionScanResponse = z.infer<typeof visionScanResponseSchema>;
