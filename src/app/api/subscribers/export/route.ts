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
    const header = "email,created_at\n";
    const rows = result.rows
      .map((r) => {
        const date =
          r.created_at instanceof Date ? r.created_at : new Date(r.created_at);
        const iso = date.toISOString();
        return `${escapeCsv(r.email)},${iso}`;
      })
      .join("\n");
    const csv = header + rows;
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="avacarto-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (e) {
    console.error("GET /api/subscribers/export", e);
    return NextResponse.json(
      { error: "Failed to export subscribers" },
      { status: 500 }
    );
  }
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
