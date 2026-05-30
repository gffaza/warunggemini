import { z } from "zod";

export const warungTypeSchema = z.enum(["kelontong", "warteg", "kios"]);

export const saveWarungProfileSchema = z.object({
  warungName: z.string().trim().min(2, "Nama warung minimal 2 karakter."),
  businessCategory: warungTypeSchema.optional(),
  location: z.string().trim().max(200).optional(),
});

export type SaveWarungProfilePayload = z.infer<typeof saveWarungProfileSchema>;
