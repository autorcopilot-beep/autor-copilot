import { cn } from '@/lib/cn';

export function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-control bg-line/70 motion-reduce:animate-none', className)} {...props} />;
}

export function PageSkeleton({ variant = 'workspace' }: { variant?: 'workspace' | 'writing' | 'admin' | 'legal' | 'root' }) {
  if (variant === 'writing') {
    return <div className="min-h-dvh bg-canvas p-3" role="status" aria-label="Carregando editor">
      <span className="sr-only">Preparando o editor e seu manuscrito…</span>
      <div className="mx-auto flex min-h-[calc(100dvh-1.5rem)] max-w-[1600px] gap-3" aria-hidden="true">
        <aside className="hidden w-64 shrink-0 space-y-3 rounded-card border border-line bg-surface p-4 lg:block"><Skeleton className="h-9 w-40" /><Skeleton className="h-px w-full" />{Array.from({ length: 7 }, (_, index) => <Skeleton key={index} className="h-9 w-full" />)}</aside>
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-card border border-line bg-editor"><div className="flex h-14 items-center gap-3 border-b border-line px-5"><Skeleton className="size-8" /><Skeleton className="h-4 w-44" /><Skeleton className="ml-auto h-8 w-24" /></div><div className="mx-auto w-full max-w-3xl flex-1 px-6 py-14"><Skeleton className="h-10 w-2/3" /><Skeleton className="mt-8 h-px w-full" /><div className="mt-9 space-y-4">{[92, 100, 84, 96, 72, 89].map((width) => <Skeleton key={width} className="h-4" style={{ width: `${width}%` }} />)}</div></div></main>
      </div>
    </div>;
  }

  if (variant === 'admin') {
    return <div role="status" aria-label="Carregando dados administrativos"><span className="sr-only">Carregando dados administrativos…</span><div className="space-y-6" aria-hidden="true"><div><Skeleton className="h-3 w-44 bg-white/10" /><Skeleton className="mt-3 h-9 w-72 bg-white/10" /><Skeleton className="mt-3 h-4 max-w-2xl bg-white/10" /></div><div className="grid gap-4 lg:grid-cols-2">{Array.from({ length: 4 }, (_, index) => <div key={index} className="rounded-card border border-white/10 p-5"><div className="flex gap-3"><Skeleton className="size-10 bg-white/10" /><div className="flex-1"><Skeleton className="h-4 w-1/2 bg-white/10" /><Skeleton className="mt-3 h-3 w-4/5 bg-white/10" /></div></div><Skeleton className="mt-5 h-24 w-full bg-white/10" /></div>)}</div></div></div>;
  }

  if (variant === 'legal') {
    return <div role="status" aria-label="Carregando documento"><span className="sr-only">Carregando documento legal…</span><div className="space-y-5" aria-hidden="true"><Skeleton className="h-8 w-2/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /><div className="space-y-3 pt-5">{Array.from({ length: 7 }, (_, index) => <Skeleton key={index} className="h-4 w-full" />)}</div></div></div>;
  }

  if (variant === 'root') {
    return <div className="flex min-h-dvh items-center justify-center bg-canvas" role="status"><div className="text-center"><span className="mx-auto block size-8 animate-spin rounded-full border-2 border-line border-t-accent motion-reduce:animate-none" aria-hidden="true" /><p className="mt-4 text-sm text-muted">Preparando seu espaço…</p></div></div>;
  }

  return <div className="mx-auto w-full max-w-7xl space-y-7 py-6" role="status" aria-label="Carregando página">
    <span className="sr-only">Carregando conteúdo…</span>
    <div aria-hidden="true"><Skeleton className="h-3 w-36" /><Skeleton className="mt-3 h-9 w-72" /><Skeleton className="mt-3 h-4 max-w-xl" /><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="rounded-card border border-line bg-surface p-5"><div className="flex gap-3"><Skeleton className="size-11" /><div className="flex-1"><Skeleton className="h-4 w-2/3" /><Skeleton className="mt-2 h-3 w-1/3" /></div></div><Skeleton className="mt-5 h-4 w-full" /><Skeleton className="mt-2 h-4 w-4/5" /><div className="mt-6 flex gap-2"><Skeleton className="h-8 flex-1" /><Skeleton className="size-8" /></div></div>)}</div></div>
  </div>;
}
