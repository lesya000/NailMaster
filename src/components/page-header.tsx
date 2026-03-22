type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0 flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
