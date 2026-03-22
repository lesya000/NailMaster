import { PageHeader } from "@/components/page-header";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Новый клиент",
};

export default function NewClientPage() {
  return (
    <>
      <PageHeader
        title="Новый клиент"
        description="Шаблон формы. Подключите server action: insert в public.clients с master_id = auth.uid()."
        actions={
          <Link
            href="/clients"
            className="text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400"
          >
            ← К списку
          </Link>
        }
      />

      <form className="max-w-lg space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Имя
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
            placeholder="Например, Анна"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Телефон
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
            placeholder="+7 …"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Заметки
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
            placeholder="Предпочтения, история визитов…"
          />
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Подключите server action или API route для вставки в public.clients.
        </p>
        <button
          type="button"
          disabled
          className="rounded-full bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
        >
          Сохранить (TODO)
        </button>
      </form>
    </>
  );
}
