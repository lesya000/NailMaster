type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div
      className="rounded-xl border border-dashed border-zinc-300 bg-white/60 px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900/40"
      role="status"
    >
      <p className="font-medium text-zinc-800 dark:text-zinc-200">{title}</p>
      {description ? (
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      ) : null}
    </div>
  );
}
