export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_CONTENT, fetchContent, saveContent, SiteContent } from "@/lib/content";

export async function GET(): Promise<NextResponse> {
  try {
    const { getRequestContext } = await import("@cloudflare/next-on-pages");
    const { env } = getRequestContext();
    const db = (env as { DB?: D1Database }).DB;
    if (!db) return NextResponse.json(DEFAULT_CONTENT);
    const content = await fetchContent(db);
    return NextResponse.json(content);
  } catch {
    return NextResponse.json(DEFAULT_CONTENT);
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { getRequestContext } = await import("@cloudflare/next-on-pages");
    const { env } = getRequestContext();
    const secret = (env as { ADMIN_SECRET?: string }).ADMIN_SECRET;

    const auth = req.headers.get("Authorization") ?? "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

    if (!token || token !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as SiteContent;
    const db = (env as { DB?: D1Database }).DB;
    if (!db) return NextResponse.json({ error: "No DB binding" }, { status: 500 });
    await saveContent(db, body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
