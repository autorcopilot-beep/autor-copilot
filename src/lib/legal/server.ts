import 'server-only';

import { getLegalDocument, legalDocuments, type LegalDocument, type LegalSection } from '@/lib/legal/documents';
import { createClient } from '@/lib/supabase/server';

function validSections(value: unknown): value is LegalSection[] {
  return Array.isArray(value) && value.every((section) => {
    if (!section || typeof section !== 'object') return false;
    const candidate = section as { heading?: unknown; paragraphs?: unknown };
    return typeof candidate.heading === 'string' && Array.isArray(candidate.paragraphs) && candidate.paragraphs.every((paragraph) => typeof paragraph === 'string');
  });
}

function mapDocument(row: { slug: string; title: string; short_description: string; department: string; effective_at: string; sections: unknown; related_features: string[]; pdf_href: string }): LegalDocument | null {
  if (!validSections(row.sections) || !row.sections.length) return null;
  return { slug: row.slug, title: row.title, shortDescription: row.short_description, department: row.department, updatedAt: row.effective_at, sections: row.sections, relatedFeatures: row.related_features, pdfHref: row.pdf_href };
}

export async function loadLegalDocuments() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('legal_documents').select('slug, title, short_description, department, effective_at, sections, related_features, pdf_href').eq('is_published', true).order('title');
  if (error || !data?.length) return legalDocuments;
  const mapped = data.map(mapDocument).filter((document): document is LegalDocument => Boolean(document));
  return mapped.length ? mapped : legalDocuments;
}

export async function loadLegalDocument(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('legal_documents').select('slug, title, short_description, department, effective_at, sections, related_features, pdf_href').eq('slug', slug).eq('is_published', true).maybeSingle();
  if (error || !data) return getLegalDocument(slug);
  return mapDocument(data) ?? getLegalDocument(slug);
}
