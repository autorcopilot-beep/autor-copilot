import { LegalSection, slugifyHeading } from "@/lib/legal/documents";

export function TableOfContents({ sections }: { sections: LegalSection[] }) {
  if (sections.length < 3) return null; // só vale a pena para documentos longos

  return (
    <aside className="mb-8 rounded-card border border-line bg-surface-muted p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        Nesta página
      </p>
      <ol className="space-y-1 text-sm">
        {sections.map((section) => (
          <li key={section.heading}>
            <a
              href={`#${slugifyHeading(section.heading)}`}
              className="text-muted hover:text-accent hover:underline"
            >
              {section.heading}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
