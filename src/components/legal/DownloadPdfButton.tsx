export function DownloadPdfButton({ href, title }: { href: string; title: string }) {
  return (
    <a
      href={href}
      download
      className="inline-flex items-center gap-2 rounded-control border border-line-strong px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-accent hover:bg-accent-subtle hover:text-accent"
      aria-label={`Baixar PDF: ${title}`}
    >
      Baixar PDF
    </a>
  );
}
