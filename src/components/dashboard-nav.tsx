"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Обзор" },
  { href: "/appointments", label: "Записи" },
  { href: "/clients", label: "Клиенты" },
  { href: "/services", label: "Услуги" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/settings", label: "Настройки" },
] as const;

function isActive(href: string, pathname: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1.5 md:flex-col md:gap-0.5" aria-label="Основное меню">
      {items.map(({ href, label }) => {
        const active = isActive(href, pathname);
        return (
          <Link
            key={href}
            href={href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition md:px-3 md:py-2 ${
              active
                ? "bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-100"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
