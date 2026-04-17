import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { hasColumn } from "@/lib/db-schema";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const productId = Number(id);
    if (!Number.isInteger(productId)) {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
    }

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
    const isActive = Boolean(body.is_active);
    const hasAvailableSizes = await hasColumn("products", "available_sizes");

    const db = getDb();
    if (hasAvailableSizes) {
      await db.query(
        `UPDATE products
         SET category_id = $1, name = $2, description = $3, price_inr = $4, image_url = $5, available_sizes = $6, is_active = $7
         WHERE id = $8`,
        [
          categoryId,
          name,
          description,
          Math.round(priceInr),
          imageUrl,
          availableSizes,
          isActive,
          productId,
        ]
      );
    } else {
      await db.query(
        `UPDATE products
         SET category_id = $1, name = $2, description = $3, price_inr = $4, image_url = $5, is_active = $6
         WHERE id = $7`,
        [categoryId, name, description, Math.round(priceInr), imageUrl, isActive, productId]
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PATCH /api/products/[id]", e);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const productId = Number(id);
    if (!Number.isInteger(productId)) {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
    }
    const db = getDb();
    await db.query("DELETE FROM products WHERE id = $1", [productId]);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/products/[id]", e);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
