export function AuthorCard({
  department,
  updatedAtLabel,
}: {
  department: string;
  updatedAtLabel: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-control border border-line bg-surface-muted p-3 text-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
        {department
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()}
      </div>
      <div>
        <p className="font-medium text-ink">Publicado por {department}</p>
        <p className="text-muted">Última atualização: {updatedAtLabel}</p>
      </div>
    </div>
  );
}
