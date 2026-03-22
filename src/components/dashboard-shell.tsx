import Link from "next/link";
import { DashboardNav } from "@/components/dashboard-nav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 font-sans dark:bg-zinc-950 md:flex-row">
      <aside className="shrink-0 border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 md:w-56 md:border-r">
        <Link
          href="/dashboard"
          className="mb-4 block text-sm font-semibold tracking-wide text-rose-600 dark:text-rose-400"
        >
          NailMaster
        </Link>
        <DashboardNav />
        <Link
          href="/"
          className="mt-6 inline-block text-xs font-medium text-zinc-500 transition hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400"
        >
          ← Публичный сайт
        </Link>
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
