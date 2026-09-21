import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  legalDocuments,
  formatUpdatedAt,
  slugifyHeading,
} from "@/lib/legal/documents";
import { loadLegalDocument } from "@/lib/legal/server";
import { TableOfContents } from "@/components/legal/TableOfContents";
import { AuthorCard } from "@/components/legal/AuthorCard";
import { RelatedFeatures } from "@/components/legal/RelatedFeatures";
import { DownloadPdfButton } from "@/components/legal/DownloadPdfButton";
import { LegalContactSection } from "@/components/legal/LegalContactSection";

// Deep link estático: /legal/[slug] funciona logado ou não logado,
// sem precisar consultar banco em tempo de requisição.
export function generateStaticParams() {
  return legalDocuments.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = await loadLegalDocument(slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.shortDescription,
  };
}

export default async function LegalDocumentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = await loadLegalDocument(slug);
  if (!doc) notFound();

  return (
    <article>
      <h2 className="font-serif text-2xl font-semibold text-ink">{doc.title}</h2>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <AuthorCard department={doc.department} updatedAtLabel={formatUpdatedAt(doc.updatedAt)} />
        <DownloadPdfButton href={doc.pdfHref} title={doc.title} />
      </div>

      <div className="mt-8">
        <TableOfContents sections={doc.sections} />

        <div className="space-y-8">
          {doc.sections.map((section) => (
            <section key={section.heading} id={slugifyHeading(section.heading)}>
              <h3 className="text-base font-semibold text-ink">{section.heading}</h3>
              {section.paragraphs.map((paragraph, i) => (
                <p key={i} className="mt-2 text-sm leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>

      <RelatedFeatures features={doc.relatedFeatures} />
      <LegalContactSection />
    </article>
  );
}
