import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { url, init } = body as unknown as { url: string; init: RequestInit };

  const res = await fetch(url, init);

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
