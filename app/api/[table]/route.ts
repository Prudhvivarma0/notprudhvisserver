import { NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

const ALLOWED_TABLES = new Set([
  "hero", "about", "projects", "experience",
  "certifications", "achievements", "word_scroll",
  "contact_links", "sections", "theme", "custom_blocks",
]);

// Single-row tables (no AUTOINCREMENT id, always update by id=1)
const SINGLETON_TABLES = new Set(["hero", "theme"]);

function getEnv() {
  try {
    const ctx = getRequestContext();
    return ctx.env as { DB?: D1Database; ADMIN_SECRET?: string; MEDIA_BUCKET?: R2Bucket };
  } catch {
    return {} as { DB?: D1Database; ADMIN_SECRET?: string };
  }
}

function authOk(req: NextRequest, secret: string | undefined): boolean {
  if (!secret) return false;
  const auth = req.headers.get("authorization") ?? "";
  return auth === `Bearer ${secret}`;
}

function err(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const { table } = await params;
  if (!ALLOWED_TABLES.has(table)) return err("Unknown table", 404);

  const { DB } = getEnv();
  if (!DB) return err("D1 not available — run via wrangler pages dev", 503);

  try {
    if (SINGLETON_TABLES.has(table)) {
      const row = await DB.prepare(`SELECT * FROM ${table} WHERE id = 1`).first();
      return NextResponse.json(row ?? {});
    }
    const { results } = await DB.prepare(`SELECT * FROM ${table} ORDER BY sort_order`).all();
    return NextResponse.json(results);
  } catch (e) {
    return err(String(e), 500);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const { table } = await params;
  if (!ALLOWED_TABLES.has(table)) return err("Unknown table", 404);
  if (SINGLETON_TABLES.has(table)) return err("Cannot POST to singleton table", 400);

  const env = getEnv();
  if (!authOk(req, env.ADMIN_SECRET)) return err("Unauthorized", 401);
  if (!env.DB) return err("D1 not available", 503);

  try {
    const body = await req.json() as Record<string, unknown>;
    const keys = Object.keys(body).filter(k => k !== "id");
    const cols = keys.join(", ");
    const placeholders = keys.map(() => "?").join(", ");
    const vals = keys.map(k => body[k]);
    const result = await env.DB
      .prepare(`INSERT INTO ${table} (${cols}) VALUES (${placeholders})`)
      .bind(...vals)
      .run();
    return NextResponse.json({ id: result.meta.last_row_id });
  } catch (e) {
    return err(String(e), 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const { table } = await params;
  if (!ALLOWED_TABLES.has(table)) return err("Unknown table", 404);

  const env = getEnv();
  if (!authOk(req, env.ADMIN_SECRET)) return err("Unauthorized", 401);
  if (!env.DB) return err("D1 not available", 503);

  try {
    const body = await req.json() as Record<string, unknown>;
    const id = SINGLETON_TABLES.has(table) ? 1 : (body.id as number);
    if (!id && !SINGLETON_TABLES.has(table)) return err("id required");

    const keys = Object.keys(body).filter(k => k !== "id");
    const sets = keys.map(k => `${k} = ?`).join(", ");
    const vals = [...keys.map(k => body[k]), id];
    await env.DB
      .prepare(`UPDATE ${table} SET ${sets} WHERE id = ?`)
      .bind(...vals)
      .run();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return err(String(e), 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const { table } = await params;
  if (!ALLOWED_TABLES.has(table)) return err("Unknown table", 404);
  if (SINGLETON_TABLES.has(table)) return err("Cannot DELETE singleton", 400);

  const env = getEnv();
  if (!authOk(req, env.ADMIN_SECRET)) return err("Unauthorized", 401);
  if (!env.DB) return err("D1 not available", 503);

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return err("id required");
    await env.DB.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return err(String(e), 500);
  }
}
