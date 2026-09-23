'use client';
import { useEffect, useRef, type CSSProperties } from 'react';

export function EditorialMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const height = innerHeight;
      const reduced = preference.matches || document.documentElement.dataset.reduceMotion === 'true';
      element.querySelectorAll<HTMLElement>('[data-parallax]').forEach((node) => {
        const rect = node.getBoundingClientRect();
        const strength = Number(node.dataset.parallax) || 0;
        const offset = reduced ? 0 : Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - height / 2) / height)) * strength * (innerWidth < 760 ? .3 : 1);
        node.style.setProperty('--parallax', `${offset}px`);
      });
      element.querySelectorAll<HTMLElement>('[data-scroll-text]').forEach((node) => {
        const rect = node.getBoundingClientRect();
        const progress = reduced ? 1 : Math.max(0, Math.min(1, (height * .88 - rect.top) / (height * .58)));
        const words = node.querySelectorAll<HTMLElement>('[data-word]');
        words.forEach((word, i) => word.style.setProperty('--word-progress', String(Math.max(0, Math.min(1, progress * (words.length + 3) - i)))));
      });
      element.querySelectorAll<HTMLElement>('[data-scroll-stage]').forEach((node) => {
        const rect = node.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - height)));
        node.style.setProperty('--stage-progress', String(reduced ? 0 : progress));
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target); } }), { threshold: .08 });
    element.querySelectorAll('[data-reveal]').forEach((node) => observer.observe(node));
    element.classList.add('motion-ready');
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', schedule);
    const settings = new MutationObserver(schedule);
    settings.observe(document.documentElement, { attributes: true, attributeFilter: ['data-reduce-motion'] });
    return () => { cancelAnimationFrame(frame); observer.disconnect(); settings.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); preference.removeEventListener('change', schedule); };
  }, []);
  return <div ref={root} className="ac-editorial-motion">{children}</div>;
}

export function ScrollText({ text, className = '' }: { text: string; className?: string }) {
  return <p className={`ac-scroll-text ${className}`} data-scroll-text aria-label={text}>{text.split(' ').map((word, i) => <span aria-hidden="true" data-word key={i} style={{ '--word-progress': 1 } as CSSProperties}>{word} </span>)}</p>;
}

export function SplitTitle({ lines }: { lines: string[] }) {
  return <h1 className="ac-split-title" aria-label={lines.join(' ')}>{lines.map((line, index) => <span className="ac-title-line" key={line} aria-hidden="true"><span style={{ '--line': index } as CSSProperties}>{line}</span></span>)}</h1>;
}
