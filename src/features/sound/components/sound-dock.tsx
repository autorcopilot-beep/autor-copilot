'use client';

import { Headphones, Pause, Play, SlidersHorizontal, Volume2, X } from 'lucide-react';
import Link from 'next/link';

import { useSound } from '@/features/sound/sound-provider';

function time(value: number) {
  if (!Number.isFinite(value)) return '0:00';
  const minutes = Math.floor(value / 60);
  return `${minutes}:${Math.floor(value % 60).toString().padStart(2, '0')}`;
}

export function SoundDock({ enabled }: { enabled: boolean }) {
  const sound = useSound();
  if (!enabled || (!sound.currentTrack && !sound.mixerActive)) return null;
  const activeLayers = sound.channels.filter((channel) => channel.active).length;
  return <aside className="fixed bottom-4 left-1/2 z-40 w-[min(29rem,calc(100vw-1.5rem))] -translate-x-1/2 overflow-hidden rounded-[1.4rem] border border-line-strong bg-surface/95 shadow-floating backdrop-blur-xl" aria-label="Som da obra">
    {sound.currentTrack && <input aria-label="Posição da faixa" type="range" min={0} max={sound.duration || 1} value={sound.currentTime} onChange={(event) => sound.seek(Number(event.target.value))} className="block h-1 w-full cursor-pointer accent-accent" />}
    <div className="flex min-h-16 items-center gap-3 px-3 sm:px-4">
      <Link href="/write/editor?sound=open" className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent" title="Abrir Som da obra"><Headphones className="size-4" /><span className="absolute -right-0.5 -top-0.5 size-2 rounded-full border-2 border-surface bg-success" /></Link>
      <div className="min-w-0 flex-1"><p className="text-[9px] font-bold uppercase tracking-[.16em] text-accent">Som da obra</p><p className="truncate text-sm font-semibold text-ink">{sound.currentTrack?.title ?? 'Atmosfera personalizada'}</p><p className="truncate text-[10px] text-muted">{sound.currentTrack ? `${time(sound.currentTime)} · ${time(sound.duration)}` : `${activeLayers} ${activeLayers === 1 ? 'camada em curso' : 'camadas em curso'}`}</p></div>
      {sound.currentTrack && <button type="button" onClick={() => sound.seek(sound.currentTime - 15)} className="hidden text-xs font-semibold text-muted hover:text-ink sm:block">−15s</button>}
      {sound.currentTrack && <button type="button" onClick={() => void sound.togglePlayback()} className="flex size-10 items-center justify-center rounded-full bg-accent text-on-accent" aria-label={sound.playing ? 'Pausar' : 'Reproduzir'}>{sound.playing ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}</button>}
      {sound.currentTrack && <button type="button" onClick={() => sound.seek(sound.currentTime + 15)} className="hidden text-xs font-semibold text-muted hover:text-ink sm:block">+15s</button>}
      {sound.currentTrack && <select aria-label="Velocidade de reprodução" value={sound.playbackRate} onChange={(event) => sound.setPlaybackRate(Number(event.target.value))} className="hidden rounded-full border border-line bg-surface-muted px-2 py-1 text-xs font-semibold text-ink sm:block"><option value={0.8}>0,8×</option><option value={1}>1×</option><option value={1.2}>1,2×</option><option value={1.5}>1,5×</option><option value={2}>2×</option></select>}
      <label className="hidden items-center gap-2 text-muted md:flex"><Volume2 className="size-4" /><input aria-label="Volume mestre" type="range" min={0} max={100} value={sound.volume} onChange={(event) => sound.setVolume(Number(event.target.value))} className="w-20 accent-accent" /></label>
      <Link href="/write/editor?sound=open" aria-label="Abrir mixer" className="flex size-9 items-center justify-center rounded-full text-muted hover:bg-surface-muted hover:text-ink"><SlidersHorizontal className="size-4" /></Link>
      <button type="button" onClick={sound.stopAll} aria-label="Fechar reprodutor" className="flex size-9 items-center justify-center rounded-full text-muted hover:bg-surface-muted hover:text-ink"><X className="size-4" /></button>
    </div>
  </aside>;
}
