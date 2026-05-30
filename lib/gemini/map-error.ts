export interface GeminiErrorResponse {
  code: string;
  message: string;
  status: number;
}

function getErrorText(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function isQuotaError(error: unknown, text: string): boolean {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status: unknown }).status;
    if (status === 429) return true;
  }

  const lower = text.toLowerCase();
  return (
    lower.includes("resource_exhausted") ||
    lower.includes("quota") ||
    lower.includes("rate limit") ||
    lower.includes("rate-limit")
  );
}

function isParseError(text: string): boolean {
  return (
    text.includes("invalid JSON") ||
    text.includes("schema validation") ||
    text.includes("empty response")
  );
}

export function mapGeminiChatError(error: unknown): GeminiErrorResponse {
  const text = getErrorText(error);

  if (isQuotaError(error, text)) {
    return {
      code: "AI_QUOTA_EXCEEDED",
      message:
        "Kuota gratis Mas Gemini habis untuk hari ini. Coba lagi besok ya, Pak, atau aktifkan billing di Google AI Studio.",
      status: 429,
    };
  }

  if (isParseError(text)) {
    return {
      code: "AI_PARSE_FAILED",
      message:
        "Mas Gemini belum paham. Coba tulis lebih detail, misal: jual 3 indomie 45 ribu",
      status: 502,
    };
  }

  return {
    code: "AI_UNAVAILABLE",
    message: "Mas Gemini lagi sibuk. Coba lagi sebentar ya, Pak.",
    status: 502,
  };
}

export function mapGeminiVisionError(error: unknown): GeminiErrorResponse {
  const text = getErrorText(error);

  if (isQuotaError(error, text)) {
    return {
      code: "AI_QUOTA_EXCEEDED",
      message:
        "Kuota gratis scan foto habis untuk hari ini. Coba lagi besok ya, Pak.",
      status: 429,
    };
  }

  return {
    code: "VISION_FAILED",
    message: "Mas Gemini gagal analisis foto. Coba foto ulang ya, Pak.",
    status: 502,
  };
}
