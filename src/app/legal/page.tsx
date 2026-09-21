import Link from "next/link";
import type { Metadata } from "next";
import { formatUpdatedAt } from "@/lib/legal/documents";
import { loadLegalDocuments } from "@/lib/legal/server";

export const metadata: Metadata = {
  title: "Documentos Legais",
  description: "Termos de uso, política de privacidade e demais documentos legais do Autor Copilot.",
};

export default async function LegalIndexPage() {
  const legalDocuments = await loadLegalDocuments();
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {legalDocuments.map((doc) => (
        <li key={doc.slug}>
          <Link
            href={`/legal/${doc.slug}`}
            className="block h-full rounded-card border border-line bg-surface p-5 shadow-soft transition-colors hover:border-accent hover:bg-surface-muted"
          >
            <p className="font-serif text-lg font-semibold text-ink">{doc.title}</p>
            <p className="mt-2 text-sm text-muted">{doc.shortDescription}</p>
            <p className="mt-4 text-xs text-muted">
              Atualizado em {formatUpdatedAt(doc.updatedAt)}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
