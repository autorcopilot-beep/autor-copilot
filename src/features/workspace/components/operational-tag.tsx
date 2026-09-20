import { LockKeyhole } from 'lucide-react';

import type { OperationalTag } from '@/features/workspace/navigation';
import { cn } from '@/lib/cn';

export function OperationalTagBadge({ tag, compact = false }: { tag: OperationalTag; compact?: boolean }) {
  if (compact) {
    return (
      <span className="group/tag relative inline-flex size-5 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-warning-subtle hover:text-warning" aria-label={tag}>
        <LockKeyhole className="size-3" aria-hidden="true" />
        <span role="tooltip" className="pointer-events-none absolute right-0 top-[calc(100%+0.35rem)] z-[70] whitespace-nowrap rounded-control bg-ink px-2 py-1 text-[10px] font-medium normal-case tracking-normal text-surface opacity-0 shadow-floating transition-opacity group-hover/tag:opacity-100 group-focus-within/tag:opacity-100">
          {tag}
        </span>
      </span>
    );
  }

  return (
    <span className={cn('inline-flex shrink-0 items-center rounded-full border border-warning/25 bg-warning-subtle px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.06em] text-warning')}>
      {tag}
    </span>
  );
}
