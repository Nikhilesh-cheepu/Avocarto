import { NextResponse } from "next/server";
import { getDb, type Subscriber } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    const db = getDb();
    const result = await db.query<Subscriber>(
      "SELECT id, email, created_at FROM subscribers ORDER BY created_at DESC"
    );
    const rows = result.rows.map((r) => ({
      id: r.id,
      email: r.email,
      created_at:
        r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
    }));
    return NextResponse.json(rows);
  } catch (e) {
    console.error("GET /api/subscribers", e);
    return NextResponse.json(
      { error: "Failed to load subscribers" },
      { status: 500 }
    );
  }
}
