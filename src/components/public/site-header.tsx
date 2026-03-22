import Link from "next/link";

type SiteHeaderProps = {
  salonName?: string | null;
};

const nav = [
  { href: "/#services", label: "Услуги" },
  { href: "/#schedule", label: "Расписание" },
  { href: "/#portfolio", label: "Работы" },
  { href: "/#about", label: "О мастере" },
] as const;

export function SiteHeader({ salonName }: SiteHeaderProps) {
  const brand = salonName?.trim() || "NailMaster";

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-rose-700 dark:text-rose-400">
          {brand}
        </Link>
        <nav className="hidden items-center gap-1 text-sm font-medium md:flex md:gap-2">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-2 py-1.5 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/book"
            className="inline-flex items-center justify-center rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
          >
            Записаться
          </Link>
          <Link
            href="/dashboard"
            className="hidden rounded-full border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 sm:inline-flex dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Мастеру
          </Link>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-zinc-100 px-4 py-2 md:hidden dark:border-zinc-800">
        {nav.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="whitespace-nowrap rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
