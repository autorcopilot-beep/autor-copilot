export default function AdminLoading() {
  return <div className="animate-pulse" role="status" aria-label="Carregando área administrativa">
    <div className="rounded-[1.75rem] border border-line bg-surface p-7 shadow-soft sm:p-9">
      <div className="h-3 w-32 rounded-full bg-surface-muted" />
      <div className="mt-5 h-9 w-full max-w-xl rounded-xl bg-surface-muted" />
      <div className="mt-4 h-4 w-full max-w-2xl rounded-full bg-surface-muted" />
      <div className="mt-2 h-4 w-3/5 max-w-lg rounded-full bg-surface-muted" />
    </div>
    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => <div key={index} className="h-40 rounded-2xl border border-line bg-surface shadow-soft"><span className="m-5 block size-10 rounded-xl bg-surface-muted" /></div>)}
    </div>
    <span className="sr-only">Carregando…</span>
  </div>;
}
