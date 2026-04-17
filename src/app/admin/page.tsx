import { AdminPanel } from "@/components/AdminPanel";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-stone-800">Avacarto Admin</h1>
          <Link
            href="/"
            className="text-sm text-stone-600 hover:text-stone-900 transition"
          >
            ← Back to site
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <AdminPanel />
      </main>
    </div>
  );
}
