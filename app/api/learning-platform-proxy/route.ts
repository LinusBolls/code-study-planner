import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/backend/datasource";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const body: { url: string; init: RequestInit } = await req.json();

  const { url: rawUrl, init } = body;

  const url = new URL(rawUrl);

  if (url.protocol !== "https:" || url.hostname !== "api.app.code.berlin") {
    return NextResponse.json(
      { message: "invalid url: must start with 'https://api.app.code.berlin'" },
      { status: 400 },
    );
  }

  // @ts-expect-error
  if (init && !init?.headers?.Cookie) {
    if (!init.headers) {
      init.headers = {};
    }
    // @ts-expect-error
    init.headers.Cookie = req.headers.get("Cookie");
  }

  try {
    const fetchRes = await fetch(url, init);

    const data = await fetchRes.json();

    if (init?.body) {
      // @ts-ignore
      console.log("fetched learning platform:", JSON.parse(init.body), data);
    } else {
      console.log("fetched learning platform:", data);
    }

    const res = NextResponse.json(data, {
      status: fetchRes.status,
      headers: {
        "Set-Cookie": fetchRes.headers.getSetCookie().join("; "),
      },
    });
    res.headers.set("cache-control", "max-age=300, private");

    return res;
  } catch (err) {
    try {
      console.error(
        `[learning-platform-proxy] failed to fetch learning platform:`,
        // @ts-ignore
        JSON.parse(init.body),
        init.headers,
      );
    } catch (err) {
      console.error(
        `[learning-platform-proxy] failed to fetch learning platform:`,
        init,
      );
    }
    throw new Error("Failed to fetch learning platform");
  }
}
