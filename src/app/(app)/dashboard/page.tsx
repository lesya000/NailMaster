import { PageHeader } from "@/components/page-header";
import {
  getAppointments,
  getClients,
  getPortfolioItems,
  getProfile,
  getServices,
} from "@/lib/data/queries";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Обзор",
};

export default async function DashboardPage() {
  const [profile, clients, services, appointments, portfolio] = await Promise.all([
    getProfile(),
    getClients(),
    getServices(),
    getAppointments(),
    getPortfolioItems(),
  ]);

  const stats = [
    { label: "Клиенты", value: clients.length, href: "/clients" },
    { label: "Услуги", value: services.length, href: "/services" },
    { label: "Записи", value: appointments.length, href: "/appointments" },
    { label: "Работы в портфолио", value: portfolio.length, href: "/portfolio" },
  ];

  return (
    <>
      <PageHeader
        title="Обзор"
        description={
          profile?.full_name
            ? `Вы вошли как ${profile.full_name}. Данные подтягиваются из Supabase (таблицы public.*).`
            : "Войдите в аккаунт и примените миграцию, чтобы увидеть данные из базы."
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-rose-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-rose-900/50"
          >
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {value}
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Дальше</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Добавьте формы создания/редактирования и server actions или route handlers.</li>
          <li>Подключите календарь для записей (например, на странице «Записи»).</li>
          <li>Загрузку фото портфолио — через Supabase Storage и поле image_url.</li>
        </ul>
      </section>
    </>
  );
}
