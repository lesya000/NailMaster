import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getPortfolioItems } from "@/lib/data/queries";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Портфолио",
};

export default async function PortfolioPage() {
  const items = await getPortfolioItems();

  return (
    <>
      <PageHeader
        title="Портфолио"
        description="Таблица public.portfolio_items; для загрузки файлов используйте Supabase Storage и сохраняйте публичный URL в image_url."
        actions={
          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center justify-center rounded-full bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
          >
            Загрузить фото (TODO)
          </button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          title="Портфолио пустое"
          description="Добавьте элементы в portfolio_items или проверьте права доступа."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
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
    </>
  );
}
