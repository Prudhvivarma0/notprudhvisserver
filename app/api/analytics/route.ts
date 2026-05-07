export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { getRequestContext } = await import("@cloudflare/next-on-pages");
    const { env } = getRequestContext();
    const db = (env as { DB?: D1Database }).DB;
    if (!db) return NextResponse.json({ ok: true });
    const body = await req.json() as { page?: string; referrer?: string; country?: string };
    const page     = body.page     ?? "/";
    const referrer = body.referrer ?? "";
    const country  = body.country  ?? "";
    await db
      .prepare("INSERT INTO v3_analytics (page, referrer, country) VALUES (?, ?, ?)")
      .bind(page, referrer, country)
      .run();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
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
    if (!db) return NextResponse.json({ totalViews: 0, viewsToday: 0, viewsThisWeek: 0, topReferrer: "", viewsPerDay: [], topReferrers: [] });

    // Total views
    const totalRow = await db
      .prepare("SELECT COUNT(*) as cnt FROM v3_analytics")
      .first<{ cnt: number }>();
    const totalViews = totalRow?.cnt ?? 0;

    // Views today
    const todayRow = await db
      .prepare("SELECT COUNT(*) as cnt FROM v3_analytics WHERE date(ts) = date('now')")
      .first<{ cnt: number }>();
    const viewsToday = todayRow?.cnt ?? 0;

    // Views this week
    const weekRow = await db
      .prepare("SELECT COUNT(*) as cnt FROM v3_analytics WHERE ts >= datetime('now', '-7 days')")
      .first<{ cnt: number }>();
    const viewsThisWeek = weekRow?.cnt ?? 0;

    // Views per day (last 30 days)
    const perDayResult = await db
      .prepare("SELECT date(ts) as date, COUNT(*) as count FROM v3_analytics WHERE ts >= datetime('now', '-30 days') GROUP BY date(ts) ORDER BY date(ts) ASC")
      .all<{ date: string; count: number }>();
    const viewsPerDay = perDayResult.results ?? [];

    // Top referrers (top 5)
    const referrersResult = await db
      .prepare("SELECT referrer, COUNT(*) as count FROM v3_analytics WHERE referrer != '' GROUP BY referrer ORDER BY count DESC LIMIT 5")
      .all<{ referrer: string; count: number }>();
    const topReferrers = referrersResult.results ?? [];
    const topReferrer = topReferrers[0]?.referrer ?? "";

    return NextResponse.json({ totalViews, viewsToday, viewsThisWeek, topReferrer, viewsPerDay, topReferrers });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
