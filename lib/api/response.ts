import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ ok: true as const, data }, { status });
}

export function fail(
  code: string,
  message: string,
  status = 400,
): NextResponse {
  return NextResponse.json(
    { ok: false as const, error: { code, message } },
    { status },
  );
}
