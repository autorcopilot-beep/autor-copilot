import { LegalSidebar } from "@/components/legal/LegalSidebar";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 text-ink sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="font-serif text-3xl font-semibold text-ink">Documentos legais</h1>
        <p className="mt-2 text-sm text-muted">
          Termos, políticas e contratos que regem o uso do Autor Copilot.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
        <LegalSidebar />
        <main>{children}</main>
      </div>
    </div>
  );
}
