import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ADMIN_COOKIE = "avacarto_admin_session";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "9703";

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "ok";
}

export async function requireAdmin(): Promise<NextResponse | null> {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export { ADMIN_COOKIE };
