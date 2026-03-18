import { NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

function getBucket(): R2Bucket | null {
  try {
    const ctx = getRequestContext();
    return (ctx.env as { MEDIA_BUCKET?: R2Bucket }).MEDIA_BUCKET ?? null;
  } catch {
    return null;
  }
}

// GET /api/media/[key] — public read (stream file from R2)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const bucket  = getBucket();
  if (!bucket) return NextResponse.json({ error: "R2 not available" }, { status: 503 });

  const obj = await bucket.get(key);
  if (!obj) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return new NextResponse(obj.body, {
    headers: {
      "Content-Type":  obj.httpMetadata?.contentType ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
