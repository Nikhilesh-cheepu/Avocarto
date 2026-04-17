import { NextResponse } from "next/server";
import { getDb, type SiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    const result = await db.query<SiteSettings>(
      "SELECT * FROM site_settings LIMIT 1"
    );
    const row = result.rows[0];
    if (!row) {
      return NextResponse.json(
        {
          ...DEFAULT_SITE_SETTINGS,
          id: 0,
          updated_at: new Date().toISOString(),
        },
        { status: 200 }
      );
    }
    return NextResponse.json({
      ...row,
      updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
    });
  } catch (e) {
    console.error("GET /api/settings", e);
    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 }
    );
  }
}

const UPDATABLE_KEYS = [
  "announcement_text",
  "hero_headline",
  "hero_subtext",
  "cta_primary_label",
  "cta_secondary_label",
  "first_drop_title",
  "first_drop_note",
  "instagram_handle",
  "contact_email",
] as const;

export async function PATCH(request: Request) {
  try {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;
    const body = await request.json();
    const updates: Record<string, string> = {};
    for (const key of UPDATABLE_KEYS) {
      if (typeof body[key] === "string") {
        updates[key] = body[key];
      }
    }
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }
    const db = getDb();
    const setClause = Object.keys(updates)
      .map((k, i) => `${k} = $${i + 1}`)
      .join(", ");
    const values = [...Object.values(updates), new Date()];
    const result = await db.query<SiteSettings>(
      `UPDATE site_settings SET ${setClause}, updated_at = $${values.length} WHERE id = 1 RETURNING *`,
      values
    );
    const row = result.rows[0];
    if (!row) {
      return NextResponse.json(
        { error: "Settings row not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      ...row,
      updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
    });
  } catch (e) {
    console.error("PATCH /api/settings", e);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
