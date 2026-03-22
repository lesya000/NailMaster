import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getClients } from "@/lib/data/queries";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Клиенты",
};

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <>
      <PageHeader
        title="Клиенты"
        description="Таблица public.clients. Добавьте создание и редактирование через формы и Supabase."
        actions={
          <Link
            href="/clients/new"
            className="inline-flex items-center justify-center rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
          >
            Новый клиент
          </Link>
        }
      />

      {clients.length === 0 ? (
        <EmptyState
          title="Пока нет клиентов"
          description="После входа в аккаунт и при наличии строк в таблице clients данные появятся здесь."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3">Имя</th>
                <th className="px-4 py-3">Телефон</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Instagram</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50">
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                    {c.name}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{c.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{c.email ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {c.instagram ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
