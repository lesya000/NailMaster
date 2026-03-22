import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { formatDateTime } from "@/lib/format";
import { getAppointments } from "@/lib/data/queries";
import type { AppointmentStatus } from "@/lib/data/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Записи",
};

const statusLabels: Record<AppointmentStatus, string> = {
  scheduled: "Запланировано",
  confirmed: "Подтверждено",
  completed: "Завершено",
  cancelled: "Отменено",
  no_show: "Не явился",
};

export default async function AppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <>
      <PageHeader
        title="Записи"
        description="Таблица public.appointments. Связь с клиентами и услугами — через client_id и appointment_services."
        actions={
          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center justify-center rounded-full bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
          >
            Новая запись (TODO)
          </button>
        }
      />

      {appointments.length === 0 ? (
        <EmptyState
          title="Записей пока нет"
          description="Добавьте календарь и форму записи; здесь можно вывести список или неделю по starts_at."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3">Начало</th>
                <th className="px-4 py-3">Конец</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Клиент (id)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {appointments.map((a) => (
                <tr key={a.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50">
                  <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">
                    {formatDateTime(a.starts_at)}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {formatDateTime(a.ends_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                      {statusLabels[a.status] ?? a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    {a.client_id.slice(0, 8)}…
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
