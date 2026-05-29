import type { z } from "zod";

export function parseJsonResponse<T extends z.ZodType>(
  text: string,
  schema: T,
  errorLabel: string,
): z.infer<T> {
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`${errorLabel} returned invalid JSON`);
  }

  const validated = schema.safeParse(parsed);

  if (!validated.success) {
    throw new Error(`${errorLabel} response failed schema validation`);
  }

  return validated.data;
}
