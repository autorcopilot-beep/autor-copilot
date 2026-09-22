export function RelatedFeatures({ features }: { features: string[] }) {
  if (!features?.length) return null;
  return (
    <div className="mt-10 rounded-card border border-line bg-surface-muted p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        Onde este documento se aplica
      </p>
      <div className="flex flex-wrap gap-2">
        {features.map((f) => (
          <span
            key={f}
            className="rounded-full bg-accent-subtle px-3 py-1 text-xs text-accent"
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
