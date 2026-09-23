'use client';

import { ArrowLeft, ArrowRight, ExternalLink, Sparkles, X } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/cn';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database.generated';

type Guide = Database['public']['Tables']['product_guides']['Row'];
type GuideStep = Database['public']['Tables']['product_guide_steps']['Row'];
type Progress = Database['public']['Tables']['user_guide_progress']['Row'];
type TargetRect = Pick<DOMRect, 'bottom' | 'height' | 'left' | 'right' | 'top' | 'width'>;

type ActiveGuide = Guide & { steps: GuideStep[]; savedStep: number };

function routeMatches(pattern: string, pathname: string) {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replaceAll('*', '.*');
  return new RegExp(`^${escaped}$`).test(pathname);
}

function stableBucket(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  return hash % 100;
}

function intersects(required: string[], actual: string[]) {
  return required.length === 0 || required.some((value) => actual.includes(value));
}

function guideSettings(guide: Guide) {
  const settings = guide.settings;
  return settings && typeof settings === 'object' && !Array.isArray(settings) ? settings as Record<string, unknown> : {};
}

function templateDocument(step: GuideStep) {
  const values: Record<string, string> = { eyebrow: 'Guia do produto', title: step.title, message: step.message, action: step.action_label || 'Continuar' };
  const html = step.template_html.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key: string) => values[key] ?? '');
  const css = step.template_css.replace(/<\/style/gi, '<\\/style');
  const js = step.template_js.replace(/<\/script/gi, '<\\/script');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>html,body{margin:0;padding:0;background:transparent}${css}</style></head><body>${html}<script>try{${js}}catch(error){console.error(error)}<\/script></body></html>`;
}

function cardPosition(rect: TargetRect | null, placement: string) {
  if (!rect || placement === 'center') return { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };
  const width = Math.min(360, window.innerWidth - 32);
  const gap = 14;
  const left = Math.max(16, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 16));
  if (placement === 'top') return { left, top: Math.max(16, rect.top - gap), transform: 'translateY(-100%)' };
  if (placement === 'left') return { left: Math.max(16, rect.left - gap), top: Math.max(16, Math.min(rect.top, window.innerHeight - 260)), transform: 'translateX(-100%)' };
  if (placement === 'right') return { left: Math.min(window.innerWidth - width - 16, rect.right + gap), top: Math.max(16, Math.min(rect.top, window.innerHeight - 260)) };
  return { left, top: Math.min(window.innerHeight - 240, rect.bottom + gap) };
}

export function ProductGuidance() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [userId, setUserId] = useState('');
  const [active, setActive] = useState<ActiveGuide | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<TargetRect | null>(null);
  const [hotspotOpen, setHotspotOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const resetTimer = window.setTimeout(() => { setActive(null); setHotspotOpen(false); }, 0);
    if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) return;

    async function load() {
      const { data: claims } = await supabase.auth.getClaims();
      const id = claims?.claims?.sub;
      if (!id || cancelled) return;
      setUserId(id);
      const [{ data: guides }, { data: profile }, { data: access }, { data: progress }, { data: preferenceRow }] = await Promise.all([
        supabase.from('product_guides').select('*').order('priority'),
        supabase.from('profiles').select('created_at').eq('id', id).maybeSingle(),
        supabase.from('user_access_profiles').select('groups,tags').eq('user_id', id).maybeSingle(),
        supabase.from('user_guide_progress').select('*').eq('user_id', id),
        supabase.from('user_preferences').select('guidance').eq('user_id', id).maybeSingle(),
      ]);
      if (cancelled || !guides?.length) return;
      const guidance = preferenceRow?.guidance && typeof preferenceRow.guidance === 'object' && !Array.isArray(preferenceRow.guidance) ? preferenceRow.guidance as Record<string, unknown> : {};
      if (guidance.enabled === false) return;
      const progressByGuide = new Map((progress ?? []).map((item: Progress) => [item.guide_id, item]));
      const accountAge = profile?.created_at ? (Date.now() - new Date(profile.created_at).getTime()) / 86_400_000 : 0;
      const eligible = guides.find((guide) => {
        const saved = progressByGuide.get(guide.id);
        const settings = guideSettings(guide);
        const maxAge = typeof settings.maxAgeDays === 'number' ? settings.maxAgeDays : 30;
        return routeMatches(guide.route_pattern, pathname)
          && !(guide.experience_type === 'hotspot' && guidance.hotspots === false)
          && (!guide.new_users_only || accountAge <= maxAge)
          && stableBucket(`${id}:${guide.guide_key}:${guide.version}`) < guide.rollout_percentage
          && intersects(guide.allowed_groups, access?.groups ?? [])
          && intersects(guide.allowed_tags, access?.tags ?? [])
          && !(saved?.guide_version === guide.version && ['completed', 'dismissed'].includes(saved.status));
      });
      if (!eligible) return;
      const { data: steps } = await supabase.from('product_guide_steps').select('*').eq('guide_id', eligible.id).order('position');
      if (cancelled || !steps?.length) return;
      const saved = progressByGuide.get(eligible.id);
      const initialStep = saved?.guide_version === eligible.version ? Math.min(saved.current_step, steps.length - 1) : 0;
      setStepIndex(initialStep);
      setActive({ ...eligible, steps, savedStep: initialStep });
      await supabase.from('user_guide_progress').upsert({ user_id: id, guide_id: eligible.id, guide_version: eligible.version, status: 'started', current_step: initialStep, started_at: new Date().toISOString(), completed_at: null, dismissed_at: null });
    }
    void load();
    return () => { cancelled = true; window.clearTimeout(resetTimer); };
  }, [pathname, supabase]);

  const step = active?.steps[stepIndex] ?? null;

  useEffect(() => {
    if (!step) return;
    let attempts = 0;
    let frame = 0;
    const locate = () => {
      const target = step.selector ? document.querySelector(step.selector) : null;
      const next = target?.getBoundingClientRect();
      if (next && next.width > 0 && next.height > 0) {
        setRect({ bottom: next.bottom, height: next.height, left: next.left, right: next.right, top: next.top, width: next.width });
        if (active?.experience_type !== 'hotspot') target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setRect(null);
        if (attempts === 0 && step.selector.startsWith('[data-tour="writing-nav-')) {
          (document.querySelector('[data-tour="writing-navigation"]') as HTMLElement | null)?.click();
        }
        if (attempts < 12) { attempts += 1; window.setTimeout(locate, 180); }
      }
    };
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(locate); };
    locate();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true); };
  }, [active?.experience_type, step]);

  const saveProgress = useCallback(async (status: 'started' | 'completed' | 'dismissed', currentStep: number) => {
    if (!active || !userId) return;
    const now = new Date().toISOString();
    await supabase.from('user_guide_progress').upsert({
      user_id: userId, guide_id: active.id, guide_version: active.version, status, current_step: currentStep,
      completed_at: status === 'completed' ? now : null,
      dismissed_at: status === 'dismissed' ? now : null,
      updated_at: now,
    });
  }, [active, supabase, userId]);

  const close = useCallback((status: 'completed' | 'dismissed') => {
    void saveProgress(status, stepIndex);
    setActive(null);
  }, [saveProgress, stepIndex]);

  if (!active || !step) return null;

  const isHotspot = active.experience_type === 'hotspot';
  const showCard = !isHotspot || hotspotOpen;
  const position = typeof window === 'undefined' ? {} : cardPosition(rect, step.placement);
  const goNext = () => {
    if (step.action_href) router.push(step.action_href);
    if (stepIndex >= active.steps.length - 1) { close('completed'); return; }
    const next = stepIndex + 1;
    setStepIndex(next);
    void saveProgress('started', next);
  };

  return <div className="pointer-events-none fixed inset-0 z-[90]" aria-live="polite">
    {!isHotspot && rect && <div aria-hidden="true" className="fixed rounded-xl ring-2 ring-accent ring-offset-4 ring-offset-transparent transition-all duration-300" style={{ left: rect.left - 5, top: rect.top - 5, width: rect.width + 10, height: rect.height + 10, boxShadow: '0 0 0 9999px rgb(22 35 30 / 0.42)' }} />}
    {isHotspot && rect && <button type="button" onClick={() => setHotspotOpen((value) => !value)} className="pointer-events-auto fixed flex size-7 items-center justify-center rounded-full border-2 border-white bg-accent text-on-accent shadow-floating" style={{ left: Math.min(window.innerWidth - 36, rect.right - 8), top: Math.max(8, rect.top - 8) }} aria-label={`Ver dica: ${step.title}`}><span className="absolute inset-0 animate-ping rounded-full bg-accent/40" /><Sparkles className="relative size-3.5" /></button>}
    {showCard && <section role="dialog" aria-label={active.name} className={cn('pointer-events-auto fixed w-[min(22.5rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface shadow-floating', step.animation === 'pulse' && 'animate-pulse')} style={position}>
      {step.media_url && <div className="relative aspect-[16/7] overflow-hidden bg-surface-muted"><Image src={step.media_url} alt="" fill unoptimized className="object-cover" /></div>}
      <div className="p-5">
        <div className="flex items-start gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-accent"><Sparkles className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">{active.experience_type.replaceAll('_', ' ')}</p><h2 className="mt-1 font-serif text-lg font-semibold text-ink">{step.title}</h2></div>{active.dismissible && <button type="button" onClick={() => close('dismissed')} className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-surface-muted hover:text-ink" aria-label="Fechar e não mostrar novamente"><X className="size-4" /></button>}</div>
        {step.template_html ? <iframe title={step.title} sandbox="allow-scripts" srcDoc={templateDocument(step)} className="mt-4 h-64 w-full rounded-xl border-0 bg-transparent" /> : <p className="mt-3 text-sm leading-6 text-muted">{step.message}</p>}
        <div className="mt-5 flex items-center gap-2">
          {active.steps.length > 1 && <span className="mr-auto text-xs text-muted">{stepIndex + 1} de {active.steps.length}</span>}
          {stepIndex > 0 && <button type="button" onClick={() => setStepIndex((value) => value - 1)} className="inline-flex min-h-10 items-center gap-1.5 rounded-control px-3 text-sm text-muted hover:bg-surface-muted"><ArrowLeft className="size-4" />Voltar</button>}
          <button type="button" onClick={goNext} className="inline-flex min-h-10 items-center gap-1.5 rounded-control bg-accent px-4 text-sm font-medium text-on-accent hover:bg-accent-hover">{step.action_label || (stepIndex === active.steps.length - 1 ? 'Entendi' : 'Continuar')}{step.action_href ? <ExternalLink className="size-3.5" /> : <ArrowRight className="size-4" />}</button>
        </div>
      </div>
    </section>}
  </div>;
}
