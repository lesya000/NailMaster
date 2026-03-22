import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { formatPriceCents } from "@/lib/format";
import { getServices } from "@/lib/data/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Услуги",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHeader
        title="Услуги"
        description="Таблица public.services — прайс и длительность. Добавьте CRUD и сортировку sort_order."
        actions={
          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center justify-center rounded-full bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
          >
            Добавить услугу (TODO)
          </button>
        }
      />

      {services.length === 0 ? (
        <EmptyState
          title="Услуги не заведены"
          description="Создайте записи в services или проверьте вход в аккаунт и RLS."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3">Название</th>
                <th className="px-4 py-3">Минуты</th>
                <th className="px-4 py-3">Цена</th>
                <th className="px-4 py-3">Активна</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50">
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                    {s.name}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-400">
                    {s.duration_minutes}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-400">
                    {formatPriceCents(s.price_cents, s.currency)}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {s.is_active ? "Да" : "Нет"}
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
