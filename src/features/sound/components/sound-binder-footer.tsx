'use client';

import { Headphones, Pause, Play, SlidersHorizontal, Waves } from 'lucide-react';
import { useSound } from '@/features/sound/sound-provider';

export function SoundBinderFooter() {
  const sound = useSound();
  const activeLayers = sound.channels.filter((channel) => channel.active).length;
  const openSound = () => window.dispatchEvent(new CustomEvent('autor-copilot:open-sound'));

  return <div className="border-t border-line bg-editor/80 p-2.5">
    <div className="rounded-2xl border border-line bg-surface p-3 shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent">{sound.mixerActive ? <Waves className="size-4" /> : <Headphones className="size-4" />}{sound.mixerActive && <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full border-2 border-surface bg-accent" />}</span>
        <button type="button" onClick={openSound} className="min-w-0 flex-1 text-left"><span className="block text-[10px] font-bold uppercase tracking-[.15em] text-accent">Som da obra</span><span className="mt-0.5 block truncate text-[11px] text-muted">{sound.currentTrack?.title ?? (sound.mixerActive ? `${activeLayers} ${activeLayers === 1 ? 'camada ativa' : 'camadas ativas'}` : 'Escolher uma atmosfera')}</span></button>
        {(sound.currentTrack || sound.mixerActive) && <button type="button" onClick={() => void (sound.mixerActive ? sound.toggleMixer() : sound.togglePlayback())} className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent" aria-label={sound.playing || sound.mixerActive ? 'Pausar som' : 'Continuar som'}>{sound.playing || sound.mixerActive ? <Pause className="size-3.5 fill-current" /> : <Play className="ml-0.5 size-3.5 fill-current" />}</button>}
      </div>
      <button type="button" onClick={openSound} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-editor px-2 py-1.5 text-[10px] font-semibold text-muted hover:text-accent"><SlidersHorizontal className="size-3" />Abrir coleção e mixer</button>
    </div>
  </div>;
}
