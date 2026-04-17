import { NextResponse } from "next/server";
import { getDb, type Product } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { hasColumn } from "@/lib/db-schema";

const BASE_QUERY = `
  SELECT
    p.id, p.category_id, c.slug AS category_slug, c.name AS category_name,
    p.name, p.description, p.price_inr, p.image_url, p.available_sizes, p.is_active, p.created_at
  FROM products p
  JOIN product_categories c ON c.id = p.category_id
`;

export async function GET(request: Request) {
  try {
    const includeInactive =
      new URL(request.url).searchParams.get("includeInactive") === "true";
    if (includeInactive) {
      const unauthorized = await requireAdmin();
      if (unauthorized) return unauthorized;
    }
    const db = getDb();
    const hasAvailableSizes = await hasColumn("products", "available_sizes");
    const result = await db.query<Product>(
      includeInactive
        ? `${BASE_QUERY.replace(
            "p.name, p.description, p.price_inr, p.image_url, p.available_sizes, p.is_active, p.created_at",
            hasAvailableSizes
              ? "p.name, p.description, p.price_inr, p.image_url, p.available_sizes, p.is_active, p.created_at"
              : "p.name, p.description, p.price_inr, p.image_url, ARRAY[]::text[] AS available_sizes, p.is_active, p.created_at"
          )} ORDER BY c.sort_order, p.created_at DESC`
        : `${BASE_QUERY.replace(
            "p.name, p.description, p.price_inr, p.image_url, p.available_sizes, p.is_active, p.created_at",
            hasAvailableSizes
              ? "p.name, p.description, p.price_inr, p.image_url, p.available_sizes, p.is_active, p.created_at"
              : "p.name, p.description, p.price_inr, p.image_url, ARRAY[]::text[] AS available_sizes, p.is_active, p.created_at"
          )} WHERE p.is_active = true ORDER BY c.sort_order, p.created_at DESC`
    );
    return NextResponse.json(result.rows);
  } catch (e) {
    console.error("GET /api/products", e);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const categoryId = Number(body.category_id);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : "";
    const priceInr = Number(body.price_inr);
    const imageUrl =
      typeof body.image_url === "string" && body.image_url.trim().length > 0
        ? body.image_url.trim()
        : null;
    const availableSizes = Array.isArray(body.available_sizes)
      ? body.available_sizes
          .map((size: unknown) => (typeof size === "string" ? size.trim().toUpperCase() : ""))
          .filter((size: string) => size.length > 0)
      : [];
    const isActive = Boolean(body.is_active ?? true);
    const hasAvailableSizes = await hasColumn("products", "available_sizes");

    if (!Number.isInteger(categoryId) || !name || !Number.isFinite(priceInr)) {
      return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
    }

    const db = getDb();
    const result = hasAvailableSizes
      ? await db.query(
          `INSERT INTO products (category_id, name, description, price_inr, image_url, available_sizes, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id`,
          [
            categoryId,
            name,
            description,
            Math.round(priceInr),
            imageUrl,
            availableSizes,
            isActive,
          ]
        )
      : await db.query(
          `INSERT INTO products (category_id, name, description, price_inr, image_url, is_active)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id`,
          [categoryId, name, description, Math.round(priceInr), imageUrl, isActive]
        );
    return NextResponse.json({ success: true, id: result.rows[0]?.id });
  } catch (e) {
    console.error("POST /api/products", e);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
