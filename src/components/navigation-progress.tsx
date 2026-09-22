'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locationKey = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    const finishedTimer = window.setTimeout(() => {
      setActive(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, 0);
    return () => window.clearTimeout(finishedTimer);
  }, [locationKey]);

  useEffect(() => {
    function begin() {
      setActive(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setActive(false), 8000);
    }

    function finish() {
      setActive(false);
    }

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.href === window.location.href || destination.hash) return;
      begin();
    }

    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', begin);
    window.addEventListener('pageshow', finish);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', begin);
      window.removeEventListener('pageshow', finish);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return <div data-navigation-progress className={`pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden transition-opacity duration-150 ${active ? 'opacity-100' : 'opacity-0'}`} role="progressbar" aria-label="Carregando nova página" aria-hidden={!active}>
    <span className="block h-full w-2/3 animate-[navigation-progress_1.15s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-accent to-transparent motion-reduce:animate-pulse" />
  </div>;
}
