import { getPublicPortfolio, getPublicServices, getSalonProfile } from "@/lib/data/public-queries";
import { formatPriceCents } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

const WEEK_SCHEDULE = [
  { day: "Пн", hours: "10:00 – 20:00" },
  { day: "Вт", hours: "10:00 – 20:00" },
  { day: "Ср", hours: "10:00 – 20:00" },
  { day: "Чт", hours: "10:00 – 20:00" },
  { day: "Пт", hours: "10:00 – 21:00" },
  { day: "Сб", hours: "10:00 – 19:00" },
  { day: "Вс", hours: "выходной" },
] as const;

export async function LandingView() {
  const [profile, services, portfolio] = await Promise.all([
    getSalonProfile(),
    getPublicServices(),
    getPublicPortfolio(6),
  ]);

  const salon = profile?.salon_name?.trim() || profile?.full_name?.trim() || "Студия маникюра";
  const tagline =
    profile?.bio?.trim() ||
    "Аккуратное покрытие, бережный уход и удобная онлайн-запись.";

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <SiteHeader salonName={profile?.salon_name || profile?.full_name} />

      <section className="relative overflow-hidden border-b border-rose-100/80 bg-gradient-to-b from-rose-50 to-zinc-50 dark:border-zinc-800 dark:from-rose-950/40 dark:to-zinc-950">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wide text-rose-600 dark:text-rose-400">
              Маникюр и педикюр
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              {salon}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">{tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition hover:bg-rose-700"
              >
                Записаться онлайн
              </Link>
              <Link
                href="/#services"
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                Смотреть услуги
              </Link>
            </div>
            {profile?.city ? (
              <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-500">{profile.city}</p>
            ) : null}
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-20 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Услуги и цены</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          Актуальный прайс подтягивается из базы после применения миграции с публичным доступом к услугам.
        </p>
        {services.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-white/60 p-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
            Услуги скоро появятся. Добавьте их в кабинете мастера или проверьте политики RLS для anon.
          </div>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li
                key={s.id}
                className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{s.name}</h3>
                {s.description ? (
                  <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">{s.description}</p>
                ) : null}
                <div className="mt-4 flex items-end justify-between gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <span className="text-sm text-zinc-500">{s.duration_minutes} мин</span>
                  <span className="text-lg font-semibold text-rose-700 dark:text-rose-400">
                    {formatPriceCents(s.price_cents, s.currency)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        id="schedule"
        className="scroll-mt-20 border-y border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Расписание</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Ориентировочные часы работы. Точное время визита согласуем после заявки.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WEEK_SCHEDULE.map(({ day, hours }) => (
              <div
                key={day}
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-950/50"
              >
                <span className="font-medium text-zinc-800 dark:text-zinc-200">{day}</span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">{hours}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-500">
            Онлайн-календарь свободных слотов можно добавить позже и связать с таблицей записей.
          </p>
        </div>
      </section>

      <section id="portfolio" className="scroll-mt-20 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Работы</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Подборка из портфолио.</p>
        {portfolio.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-white/60 p-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
            Фото появятся здесь после добавления в разделе «Портфолио» в кабинете.
          </div>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portfolio.map((item) => (
              <li
                key={item.id}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={item.image_url}
                    alt={item.caption ?? "Работа"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                </div>
                {item.caption ? (
                  <p className="p-3 text-sm text-zinc-700 dark:text-zinc-300">{item.caption}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="about" className="scroll-mt-20 border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">О мастере</h2>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
            {profile?.avatar_url ? (
              <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800">
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name ?? "Мастер"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : null}
            <div className="max-w-2xl space-y-3 text-zinc-600 dark:text-zinc-400">
              <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                {profile?.full_name ?? "Ваш мастер"}
              </p>
              <p>{profile?.bio ?? "Здесь будет описание студии и мастера. Заполните профиль в настройках кабинета."}</p>
            </div>
          </div>
          <div className="mt-8">
            <Link
              href="/book"
              className="inline-flex rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Записаться
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter phone={profile?.phone} city={profile?.city} />
    </div>
  );
}
