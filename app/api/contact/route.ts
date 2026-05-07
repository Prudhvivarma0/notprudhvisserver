export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { getRequestContext } = await import("@cloudflare/next-on-pages");
    const { env } = getRequestContext();
    const db = (env as { DB?: D1Database }).DB;

    const body = await req.json() as { name?: string; email?: string; message?: string };
    const name    = (body.name    ?? "").trim();
    const email   = (body.email   ?? "").trim();
    const message = (body.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "name, email, and message are required" }, { status: 400 });
    }

    if (!db) return NextResponse.json({ ok: true });

    await db
      .prepare("INSERT INTO v3_contacts (name, email, message) VALUES (?, ?, ?)")
      .bind(name, email, message)
      .run();

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { getRequestContext } = await import("@cloudflare/next-on-pages");
    const { env } = getRequestContext();
    const secret = (env as { ADMIN_SECRET?: string }).ADMIN_SECRET;
    const auth = req.headers.get("Authorization") ?? "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token || token !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const db = (env as { DB?: D1Database }).DB;
    if (!db) return NextResponse.json([]);
    const result = await db
      .prepare("SELECT * FROM v3_contacts ORDER BY ts DESC")
      .all<{ id: number; name: string; email: string; message: string; read: number; ts: string }>();
    return NextResponse.json(result.results ?? []);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const { getRequestContext } = await import("@cloudflare/next-on-pages");
    const { env } = getRequestContext();
    const secret = (env as { ADMIN_SECRET?: string }).ADMIN_SECRET;
    const auth = req.headers.get("Authorization") ?? "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token || token !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const db = (env as { DB?: D1Database }).DB;
    if (!db) return NextResponse.json({ ok: true });
    await db.prepare("DELETE FROM v3_contacts WHERE id = ?").bind(Number(id)).run();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
