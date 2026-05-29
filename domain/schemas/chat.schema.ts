import { z } from "zod";

export const chatMessageRequestSchema = z.object({
  message: z.string().trim().min(1).max(500),
});

export const geminiParseResponseSchema = z.object({
  intent: z.enum(["record_sale", "record_expense", "clarify", "chitchat"]),
  product: z.string().optional(),
  quantity: z.number().positive().optional(),
  price: z.number().nonnegative().optional(),
  unitPrice: z.number().nonnegative().optional(),
  confirmationMessage: z.string(),
  clarificationQuestion: z.string().nullable().optional(),
});

export type GeminiParseResponse = z.infer<typeof geminiParseResponseSchema>;

export const apiSuccessSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    ok: z.literal(true),
    data: dataSchema,
  });

export const apiErrorSchema = z.object({
  ok: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});
