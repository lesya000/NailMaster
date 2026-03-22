import { BookingForm } from "@/app/book/booking-form";
import { SiteHeader } from "@/components/public/site-header";
import { getPublicServices, getSalonProfile } from "@/lib/data/public-queries";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Запись",
  description: "Онлайн-запись на маникюр",
};

export default async function BookPage() {
  const [profile, services] = await Promise.all([getSalonProfile(), getPublicServices()]);

  const serviceOptions = services.map((s) => ({ id: s.id, name: s.name }));

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <SiteHeader salonName={profile?.salon_name || profile?.full_name} />
      <div className="mx-auto w-full max-w-lg flex-1 px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Запись</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Оставьте заявку — мастер подтвердит время. Данные сохраняются в таблицу{" "}
          <code className="rounded bg-zinc-200 px-1 text-xs dark:bg-zinc-800">booking_requests</code>{" "}
          после применения миграции.
        </p>
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <BookingForm services={serviceOptions} />
        </div>
      </div>
    </div>
  );
}
