export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

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
      .prepare("SELECT id, saved_at FROM v3_versions ORDER BY id DESC LIMIT 20")
      .all<{ id: number; saved_at: string }>();
    return NextResponse.json(result.results ?? []);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
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
    const db = (env as { DB?: D1Database }).DB;
    if (!db) return NextResponse.json({ error: "No DB binding" }, { status: 500 });

    const body = await req.json() as { id: number };
    const versionId = body.id;
    if (!versionId) return NextResponse.json({ error: "id required" }, { status: 400 });

    // Fetch the version data
    const vrow = await db
      .prepare("SELECT data FROM v3_versions WHERE id = ?")
      .bind(versionId)
      .first<{ data: string }>();
    if (!vrow) return NextResponse.json({ error: "Version not found" }, { status: 404 });

    // Restore to v3_content
    await db
      .prepare(
        `INSERT INTO v3_content (id, data, updated_at) VALUES (1, ?, datetime('now'))
         ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`
      )
      .bind(vrow.data)
      .run();

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
