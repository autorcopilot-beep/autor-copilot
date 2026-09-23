"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function LegalSidebar({ documents }: { documents: Array<{ slug: string; title: string }> }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentos legais" className="space-y-1 md:sticky md:top-6 md:self-start">
      <Link
        href="/legal"
        className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          pathname === "/legal"
            ? "bg-accent text-white"
            : "text-muted hover:bg-surface-muted hover:text-ink"
        }`}
      >
        Visão geral
      </Link>
      {documents.map((doc) => {
        const href = `/legal/${doc.slug}`;
        const active = pathname === href;
        return (
          <Link
            key={doc.slug}
            href={href}
            className={`block rounded-md px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-accent text-white font-medium"
                : "text-muted hover:bg-surface-muted hover:text-ink"
            }`}
          >
            {doc.title}
          </Link>
        );
      })}
    </nav>
  );
}
