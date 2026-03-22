import { PageHeader } from "@/components/page-header";
import { getProfile } from "@/lib/data/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Настройки",
};

export default async function SettingsPage() {
  const profile = await getProfile();

  return (
    <>
      <PageHeader
        title="Профиль мастера"
        description="Таблица public.profiles, строка с id = auth.users.id. Обновление через supabase.from('profiles').update(...)."
      />

      <div className="max-w-lg space-y-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">Имя</dt>
            <dd className="mt-1 text-zinc-900 dark:text-zinc-100">{profile?.full_name ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">Телефон</dt>
            <dd className="mt-1 text-zinc-900 dark:text-zinc-100">{profile?.phone ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">Салон</dt>
            <dd className="mt-1 text-zinc-900 dark:text-zinc-100">{profile?.salon_name ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">Город</dt>
            <dd className="mt-1 text-zinc-900 dark:text-zinc-100">{profile?.city ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">О себе</dt>
            <dd className="mt-1 text-zinc-700 dark:text-zinc-300">{profile?.bio ?? "—"}</dd>
          </div>
        </dl>

        <button
          type="button"
          disabled
          className="rounded-full bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
        >
          Редактировать (TODO)
        </button>
      </div>
    </>
  );
}
