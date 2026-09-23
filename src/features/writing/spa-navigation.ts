import type { WritingView } from '@/features/writing/types';

export const writingViewEvent = 'autor-copilot:writing-view';

const writingViews = new Set<WritingView>(['editor', 'chapters', 'scenes', 'notes', 'encyclopedia', 'relations']);

export function writingViewFromPathname(pathname: string): WritingView | null {
  const value = pathname.split('/').filter(Boolean)[1] as WritingView | undefined;
  return value && writingViews.has(value) ? value : null;
}

export function navigateWritingView(view: WritingView, href: string, mode: 'push' | 'replace' = 'push') {
  if (typeof window === 'undefined') return;
  window.history[mode === 'push' ? 'pushState' : 'replaceState']({ ...window.history.state, writingView: view }, '', href);
  window.dispatchEvent(new CustomEvent(writingViewEvent, { detail: { view } }));
}

export function writingHref(view: WritingView, workId: string, documentId?: string) {
  const params = new URLSearchParams({ work: workId });
  if (documentId) params.set('document', documentId);
  return `/write/${view}?${params.toString()}`;
}
