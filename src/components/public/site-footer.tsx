import Link from "next/link";

type SiteFooterProps = {
  phone?: string | null;
  city?: string | null;
};

export function SiteFooter({ phone, city }: SiteFooterProps) {
  return (
    <footer id="contacts" className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Контакты</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            {phone ? (
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-rose-600 dark:hover:text-rose-400">
                  {phone}
                </a>
              </li>
            ) : (
              <li>Телефон уточняется при записи</li>
            )}
            {city ? <li>{city}</li> : null}
          </ul>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/book" className="font-medium text-rose-600 hover:underline dark:text-rose-400">
            Онлайн-запись
          </Link>
          <Link href="/dashboard" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Вход для мастера
          </Link>
        </div>
      </div>
      <div className="border-t border-zinc-200/80 py-4 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
        © {new Date().getFullYear()} NailMaster
      </div>
    </footer>
  );
}
