import { getDb } from "@/lib/db";

const columnCache = new Map<string, boolean>();

export async function hasColumn(
  tableName: string,
  columnName: string
): Promise<boolean> {
  const cacheKey = `${tableName}.${columnName}`;
  if (columnCache.has(cacheKey)) {
    return columnCache.get(cacheKey) ?? false;
  }

  const db = getDb();
  const result = await db.query<{ exists: boolean }>(
    `SELECT EXISTS (
       SELECT 1
       FROM information_schema.columns
       WHERE table_name = $1
         AND column_name = $2
     ) AS exists`,
    [tableName, columnName]
  );

  const exists = Boolean(result.rows[0]?.exists);
  columnCache.set(cacheKey, exists);
  return exists;
}
