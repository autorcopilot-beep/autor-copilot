import { LegalSidebar } from "@/components/legal/LegalSidebar";
import { loadLegalDocuments } from "@/lib/legal/server";

export default async function LegalLayout({ children }: { children: React.ReactNode }) {
  const documents = await loadLegalDocuments();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 text-ink sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="font-serif text-3xl font-semibold text-ink">Documentos legais</h1>
        <p className="mt-2 text-sm text-muted">
          Termos, políticas e contratos que regem o uso do Autor Copilot.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
        <LegalSidebar documents={documents.map(({ slug, title }) => ({ slug, title }))} />
        <main>{children}</main>
      </div>
    </div>
  );
}
