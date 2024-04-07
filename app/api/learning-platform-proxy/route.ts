import { connectToDatabase } from "@/backend/datasource";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const body: { url: string; init: RequestInit } = await req.json();

  const { url: rawUrl, init } = body;

  const url = new URL(rawUrl);

  if (url.protocol !== "https:" || url.hostname !== "api.app.code.berlin") {
    return NextResponse.json(
      { message: "invalid url: must start with 'https://api.app.code.berlin'" },
      { status: 400 }
    );
  }
  const fetchRes = await fetch(url, init);

  const data = await fetchRes.json();

  const res = NextResponse.json(data, { status: fetchRes.status });

  res.headers.set("cache-control", "max-age=300, private");

  return res;
}
