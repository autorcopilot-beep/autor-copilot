'use client';

import { BookOpenText, Check, ChevronRight, Disc3, Flame, Headphones, Library, Pause, Play, Radio, SlidersHorizontal, Sparkles, Volume2, Waves, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { officialSoundPresets } from '@/features/sound/presets';
import { useSound } from '@/features/sound/sound-provider';
import type { MixerChannelId, SoundPreset, SoundTrack } from '@/features/sound/types';
import { cn } from '@/lib/cn';
import { AudioReviewDrawer } from '@/features/sound/components/audio-review-drawer';

type Tab = 'sessions' | 'library' | 'mixer';

const channelDescriptions: Record<MixerChannelId, string> = {
  pink_noise: 'Equilíbrio amplo', brown_noise: 'Graves macios', rain_glass: 'Água no vidro', ocean_tide: 'Ondas lentas',
  fireplace: 'Crepitar contido', forest_night: 'Folhas e insetos', cafe_room: 'Sala distante', night_train: 'Trilhos amortecidos', typewriter_keys: 'Resposta às teclas',
};

function channelIcon(id: MixerChannelId) {
  if (id === 'rain_glass' || id === 'ocean_tide') return Waves;
  if (id === 'fireplace') return Flame;
  if (id === 'typewriter_keys') return Sparkles;
  return Radio;
}

export function SoundMegaMenu({ open, onClose, tracks }: { open: boolean; onClose: () => void; tracks: SoundTrack[] }) {
  const sound = useSound();
  const [tab, setTab] = useState<Tab>('sessions');
  const [activePreset, setActivePreset] = useState<string>('');
  const [reviewTrack, setReviewTrack] = useState<SoundTrack | null>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [onClose, open]);

  if (!open) return null;

  async function applyPreset(preset: SoundPreset) {
    for (const channel of sound.channels) {
      const volume = preset.channels[channel.id];
      sound.updateChannel(channel.id, { active: typeof volume === 'number', ...(typeof volume === 'number' ? { volumePercent: volume } : {}) });
    }
    setActivePreset(preset.id);
    await sound.startMixer();
  }

  async function handleTrack(track: SoundTrack) {
    if (sound.currentTrack?.id === track.id) await sound.togglePlayback(); else await sound.playTrack(track);
  }

  return <div className="fixed inset-0 z-[90]" role="presentation">
    <button type="button" className="absolute inset-0 bg-ink/15 backdrop-blur-[2px]" onClick={onClose} aria-label="Fechar Som" />
    <section className="absolute left-1/2 top-[4.75rem] flex max-h-[min(44rem,calc(100dvh-6rem))] w-[min(70rem,calc(100vw-1.5rem))] -translate-x-1/2 flex-col overflow-hidden rounded-[1.75rem] border border-line-strong bg-surface shadow-floating" aria-label="Som da obra">
      <header className="flex items-center gap-4 border-b border-line px-5 py-4 sm:px-7"><span className="flex size-10 items-center justify-center rounded-full bg-accent text-on-accent"><Headphones className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-accent">Som da obra</p><h2 className="truncate font-serif text-xl font-semibold text-ink">Uma atmosfera para este manuscrito</h2></div>{sound.mixerActive && <span className="hidden items-center gap-2 rounded-full bg-accent-subtle px-3 py-1.5 text-xs font-semibold text-accent sm:flex"><span className="size-1.5 animate-pulse rounded-full bg-accent" />{sound.typingIdle ? 'Respirando' : `${sound.typingWpm} PPM`}</span>}<button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-full text-muted hover:bg-surface-muted hover:text-ink" aria-label="Fechar"><X className="size-4" /></button></header>
      <div className="grid min-h-0 flex-1 md:grid-cols-[13rem_1fr]">
        <nav className="flex gap-1 overflow-x-auto border-b border-line bg-editor p-3 md:flex-col md:border-b-0 md:border-r" aria-label="Seções de som">{([['sessions', Sparkles, 'Sessões oficiais'], ['library', Library, 'Biblioteca'], ['mixer', SlidersHorizontal, 'Minha mixagem']] as const).map(([value, Icon, label]) => <button key={value} type="button" onClick={() => setTab(value)} className={cn('flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-left text-xs font-semibold', tab === value ? 'bg-surface text-accent shadow-sm' : 'text-muted hover:bg-surface/60 hover:text-ink')}><Icon className="size-4" />{label}<ChevronRight className="ml-auto hidden size-3 md:block" /></button>)}</nav>
        <div className="workspace-scrollbar min-h-0 overflow-y-auto p-5 sm:p-7">
          {tab === 'sessions' && <><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-accent">Templates do Sound Lab</p><h3 className="mt-1 font-serif text-3xl font-semibold text-ink">Comece por uma cena</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">Coleções geradas no próprio navegador. Escolha uma base e ajuste cada camada quando quiser.</p></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{officialSoundPresets.map((preset, index) => <button key={preset.id} type="button" onClick={() => void applyPreset(preset)} className={cn('group relative min-h-40 overflow-hidden rounded-2xl border p-5 text-left transition-transform hover:-translate-y-0.5', activePreset === preset.id ? 'border-accent bg-accent-subtle' : 'border-line bg-editor hover:border-accent/35')}><span className="absolute right-4 top-3 font-serif text-6xl text-accent/[.07]">0{index + 1}</span><span className="relative text-[10px] font-bold uppercase tracking-[.18em] text-accent">{preset.mood}</span><strong className="relative mt-5 block font-serif text-xl text-ink">{preset.title}</strong><span className="relative mt-2 block max-w-sm text-xs leading-relaxed text-muted">{preset.description}</span><span className="relative mt-4 flex items-center gap-2 text-[10px] font-semibold text-muted">{activePreset === preset.id && sound.mixerActive ? <Check className="size-3.5 text-accent" /> : <Play className="size-3.5 text-accent" />}{preset.durationLabel}</span></button>)}</div></>}
          {tab === 'library' && <><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-accent">Acervo da obra</p><h3 className="mt-1 font-serif text-3xl font-semibold text-ink">Faixas e audiolivros</h3></div>{tracks.length ? <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-editor">{tracks.map((track) => <div key={track.id} className="flex items-center gap-3 p-3 hover:bg-surface-muted"><button type="button" onClick={() => void handleTrack(track)} className="flex min-w-0 flex-1 items-center gap-4 text-left"><span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-accent-subtle text-accent">{track.coverUrl ? <Image src={track.coverUrl} alt="" fill unoptimized sizes="48px" className="object-cover" /> : <Disc3 className="size-5" />}</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm text-ink">{track.title}</strong><span className="mt-0.5 block truncate text-[11px] text-muted">{track.authorName} · {track.tags.slice(0, 2).join(' · ')}</span></span><span className="flex size-9 items-center justify-center rounded-full border border-line bg-surface text-accent">{sound.currentTrack?.id === track.id && sound.playing ? <Pause className="size-3.5 fill-current" /> : <Play className="ml-0.5 size-3.5 fill-current" />}</span></button>{track.kind === 'audiobook' && <button type="button" onClick={() => setReviewTrack(track)} className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-accent" aria-label={`Abrir prova de ${track.title}`}><BookOpenText className="size-4" /></button>}</div>)}</div> : <div className="mt-6 rounded-2xl border border-dashed border-line bg-editor p-7"><Disc3 className="size-6 text-accent" /><h4 className="mt-3 font-serif text-xl text-ink">O acervo publicado ainda está vazio</h4><p className="mt-2 text-sm text-muted">As sessões oficiais continuam disponíveis e não dependem de arquivos externos.</p></div>}</>}
          {tab === 'mixer' && <><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-accent">Mesa da obra</p><h3 className="mt-1 font-serif text-3xl font-semibold text-ink">Misture o seu lugar</h3></div><button type="button" onClick={() => void sound.toggleMixer()} className={cn('inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 text-xs font-semibold', sound.mixerActive ? 'border border-line bg-editor text-ink' : 'bg-accent text-on-accent')}>{sound.mixerActive ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}{sound.mixerActive ? 'Pausar atmosfera' : 'Ouvir mixagem'}</button></div><div className="mt-6 grid gap-2 sm:grid-cols-2">{sound.channels.map((channel) => { const Icon = channelIcon(channel.id); return <article key={channel.id} className={cn('rounded-2xl border p-4', channel.active ? 'border-accent/25 bg-accent-subtle' : 'border-line bg-editor')}><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-surface text-accent"><Icon className="size-4" /></span><span className="min-w-0 flex-1"><strong className="block text-sm text-ink">{channel.label}</strong><span className="text-[10px] text-muted">{channelDescriptions[channel.id]}</span></span><input aria-label={`Ativar ${channel.label}`} type="checkbox" checked={channel.active} onChange={(event) => sound.updateChannel(channel.id, { active: event.target.checked })} className="accent-accent" /></div><label className="mt-4 flex items-center gap-3"><Volume2 className="size-3.5 text-muted" /><input aria-label={`Volume de ${channel.label}`} type="range" min={0} max={100} value={channel.volumePercent} onChange={(event) => sound.updateChannel(channel.id, { volumePercent: Number(event.target.value) })} className="min-w-0 flex-1 accent-accent" /><span className="w-8 text-right text-[10px] tabular-nums text-muted">{channel.volumePercent}</span></label></article>; })}</div><div className="mt-5 flex flex-col gap-3 rounded-2xl border border-line bg-editor p-4 sm:flex-row sm:items-center"><label className="flex flex-1 items-center gap-3 text-xs text-muted"><Volume2 className="size-4 text-accent" />Volume geral<input type="range" min={0} max={100} value={sound.volume} onChange={(event) => sound.setVolume(Number(event.target.value))} className="min-w-24 flex-1 accent-accent" /><strong className="text-ink">{sound.volume}%</strong></label><label className="flex items-center gap-2 text-xs text-muted"><input type="checkbox" checked={sound.autoPauseOnTypingStop} onChange={(event) => sound.setAutoPauseOnTypingStop(event.target.checked)} className="accent-accent" />Respirar quando eu parar</label></div></>}
        </div>
      </div>
    </section>
    <AudioReviewDrawer track={reviewTrack} onClose={() => setReviewTrack(null)} />
  </div>;
}
