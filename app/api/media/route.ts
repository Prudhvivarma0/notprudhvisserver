import { NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

function getEnv() {
  try {
    const ctx = getRequestContext();
    return ctx.env as { MEDIA_BUCKET?: R2Bucket; ADMIN_SECRET?: string };
  } catch {
    return {} as { MEDIA_BUCKET?: R2Bucket; ADMIN_SECRET?: string };
  }
}

function authOk(req: NextRequest, secret: string | undefined): boolean {
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

// POST /api/media — upload a file to R2
export async function POST(req: NextRequest) {
  const env = getEnv();
  if (!authOk(req, env.ADMIN_SECRET)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!env.MEDIA_BUCKET) return NextResponse.json({ error: "R2 not available" }, { status: 503 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key  = `${Date.now()}-${safe}`;

  await env.MEDIA_BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });

  return NextResponse.json({ key, url: `/api/media/${key}`, size: file.size, filename: file.name });
}

// GET /api/media — list all files
export async function GET(req: NextRequest) {
  const env = getEnv();
  if (!authOk(req, env.ADMIN_SECRET)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!env.MEDIA_BUCKET) return NextResponse.json([], { status: 200 });

  const list = await env.MEDIA_BUCKET.list();
  return NextResponse.json(
    list.objects.map(o => ({
      key:      o.key,
      size:     o.size,
      uploaded: o.uploaded.toISOString(),
      url:      `/api/media/${o.key}`,
    }))
  );
}

// DELETE /api/media?key=… — delete a file
export async function DELETE(req: NextRequest) {
  const env = getEnv();
  if (!authOk(req, env.ADMIN_SECRET)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!env.MEDIA_BUCKET) return NextResponse.json({ error: "R2 not available" }, { status: 503 });

  const key = new URL(req.url).searchParams.get("key");
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

  await env.MEDIA_BUCKET.delete(key);
  return NextResponse.json({ ok: true });
}
