'use client';

import { BookOpenText, Check, Clock3, Disc3, Heart, Music2, Pause, Play, Plus, Radio, Search, Settings2, SlidersHorizontal, Volume2, Waves, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui';
import { useSound } from '@/features/sound/sound-provider';
import type { AudioTrackKind, SoundTrack } from '@/features/sound/types';
import { cn } from '@/lib/cn';
import { createClient } from '@/lib/supabase/client';
import type { Database, Json } from '@/types/database.generated';

const kindLabels: Record<AudioTrackKind, string> = { ambient: 'Ambiência', longform: 'Longa duração', audiobook: 'Audiolivro', mixer_layer: 'Camada de mixer' };
const kinds: Array<AudioTrackKind | 'all'> = ['all', 'ambient', 'longform', 'audiobook'];
function duration(seconds: number) { const hours = Math.floor(seconds / 3600); const minutes = Math.floor((seconds % 3600) / 60); return hours ? `${hours}h ${minutes}min` : `${minutes}:${String(seconds % 60).padStart(2, '0')}`; }

export function SoundHub({ tracks, userId, initialSettings }: { tracks: SoundTrack[]; userId: string; initialSettings: Database['public']['Tables']['audio_user_settings']['Row'] | null }) {
  const sound = useSound();
  const supabase = useMemo(() => createClient(), []);
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<AudioTrackKind | 'all'>('all');
  const [reviewTrack, setReviewTrack] = useState<SoundTrack | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [markerNote, setMarkerNote] = useState('');
  const [markerType, setMarkerType] = useState<'note' | 'cut' | 'pause' | 'pronunciation' | 'prosody'>('note');
  const [markerStatus, setMarkerStatus] = useState('');
  const [markers, setMarkers] = useState<Database['public']['Tables']['audio_editorial_markers']['Row'][]>([]);
  const hydrated = useRef(false);
  useEffect(() => {
    if (!initialSettings || hydrated.current) return;
    hydrated.current = true;
    sound.setVolume(initialSettings.master_volume);
    sound.setPlaybackRate(initialSettings.playback_rate);
    sound.setAutoPauseOnTypingStop(initialSettings.auto_pause_on_typing_stop);
    sound.setTypingInactivityThresholdMs(initialSettings.typing_inactivity_threshold_ms);
    if (Array.isArray(initialSettings.mixer_channels)) {
      for (const stored of initialSettings.mixer_channels) {
        if (!stored || typeof stored !== 'object' || Array.isArray(stored) || typeof stored.id !== 'string') continue;
        const channel = sound.channels.find((item) => item.id === stored.id);
        if (!channel) continue;
        sound.updateChannel(channel.id, {
          active: typeof stored.active === 'boolean' ? stored.active : channel.active,
          volumePercent: typeof stored.volumePercent === 'number' ? stored.volumePercent : channel.volumePercent,
          syncWithTypingWpm: typeof stored.syncWithTypingWpm === 'boolean' ? stored.syncWithTypingWpm : channel.syncWithTypingWpm,
        });
      }
    }
  }, [initialSettings, sound]);

  useEffect(() => {
    if (!reviewTrack) return;
    let active = true;
    void supabase.from('audio_editorial_markers').select('*').eq('track_id', reviewTrack.id).order('time_ms').then(({ data }) => {
      if (active) setMarkers(data ?? []);
    });
    return () => { active = false; };
  }, [reviewTrack, supabase]);

  async function handleTrack(track: SoundTrack) {
    if (sound.currentTrack?.id === track.id) await sound.togglePlayback();
    else await sound.playTrack(track);
  }
  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR');
    return tracks.filter((track) => (kind === 'all' || track.kind === kind) && (!normalized || [track.title, track.subtitle, track.authorName, ...track.tags].some((value) => value.toLocaleLowerCase('pt-BR').includes(normalized))));
  }, [kind, query, tracks]);

  async function saveSettings() {
    setSaving(true); setSaved(false);
    const { error } = await supabase.from('audio_user_settings').upsert({
      user_id: userId, master_volume: sound.volume, playback_rate: sound.playbackRate,
      mixer_channels: sound.channels as unknown as Json, spatial_mode: initialSettings?.spatial_mode ?? 'stereo',
      auto_pause_on_typing_stop: sound.autoPauseOnTypingStop,
      typing_inactivity_threshold_ms: sound.typingInactivityThresholdMs,
      crossfade_duration_ms: initialSettings?.crossfade_duration_ms ?? 1200,
    }, { onConflict: 'user_id' });
    setSaving(false); setSaved(!error);
  }

  async function addMarker() {
    if (!reviewTrack || !markerNote.trim()) return;
    setMarkerStatus('Salvando…');
    const { data, error } = await supabase.from('audio_editorial_markers').insert({ user_id: userId, track_id: reviewTrack.id, time_ms: Math.round(sound.currentTime * 1000), note: markerNote.trim(), marker_type: markerType }).select('*').single();
    setMarkerStatus(error ? 'Não foi possível salvar.' : 'Marcador salvo.');
    if (!error && data) { setMarkerNote(''); setMarkers((current) => [...current, data].sort((left, right) => left.time_ms - right.time_ms)); }
  }

  return <div className="w-full pb-24">
    <header className="creative-page-hero overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="text-[11px] font-bold uppercase tracking-[.2em] text-accent">Autor Copilot Sound Lab</p><h1 className="mt-2 font-serif text-4xl font-semibold text-ink sm:text-5xl">Media & Sound</h1><p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">Paisagens sonoras para foco e um espaço de prova para a voz da sua obra. O áudio continua tocando enquanto você navega pelo workspace.</p><div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-ink">Web Audio protegido</span><span className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-ink">48 kHz</span><span className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-ink">Mixer local</span></div></div><div className="flex size-28 items-center justify-center rounded-full border border-accent/20 bg-accent-subtle text-accent"><Waves className="size-12" /></div></div>
    </header>

    <section className="mt-5 grid gap-3 sm:grid-cols-3"><div className="creative-stat"><Music2 className="size-4 text-accent" /><p className="mt-2 text-2xl font-semibold text-ink">{tracks.length}</p><p className="text-xs text-muted">faixas publicadas</p></div><div className="creative-stat"><Clock3 className="size-4 text-accent" /><p className="mt-2 text-2xl font-semibold text-ink">{duration(tracks.reduce((sum, track) => sum + track.durationSeconds, 0))}</p><p className="text-xs text-muted">de áudio disponível</p></div><div className="creative-stat"><Radio className="size-4 text-accent" /><p className="mt-2 text-2xl font-semibold text-ink">{sound.mixerActive ? 'Ativo' : 'Pronto'}</p><p className="text-xs text-muted">motor de paisagens</p></div></section>

    <section className="mt-7" aria-labelledby="library-title"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-accent">Descoberta</p><h2 id="library-title" className="mt-1 font-serif text-3xl font-semibold text-ink">Biblioteca sonora</h2></div><label className="relative block w-full sm:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar faixa, autor ou atmosfera" className="min-h-11 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-sm text-ink outline-none focus:border-accent" /></label></div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">{kinds.map((value) => <button key={value} type="button" onClick={() => setKind(value)} className={cn('shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold', kind === value ? 'bg-accent text-on-accent' : 'border border-line bg-surface text-muted')}>{value === 'all' ? 'Todas' : kindLabels[value]}</button>)}</div>
      {visible.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{visible.map((track) => <article key={track.id} className="group overflow-hidden rounded-2xl border border-line bg-surface"><button type="button" onClick={() => void handleTrack(track)} className="relative flex min-h-44 w-full items-end overflow-hidden bg-[linear-gradient(135deg,#173d31,#497966)] p-5 text-left text-white">{track.coverUrl && <Image src={track.coverUrl} alt="" fill unoptimized sizes="(min-width: 1280px) 30vw, (min-width: 640px) 50vw, 100vw" className="object-cover opacity-75" />}<span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" /><span className="relative flex w-full items-end justify-between gap-3"><span><span className="text-[10px] font-bold uppercase tracking-[.18em] text-white/70">{kindLabels[track.kind]}</span><span className="mt-1 block font-serif text-2xl font-semibold">{track.title}</span><span className="mt-1 block text-xs text-white/70">{track.subtitle || track.authorName}</span></span><span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-accent shadow-lg">{sound.currentTrack?.id === track.id && sound.playing ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}</span></span></button><div className="p-4"><div className="flex flex-wrap gap-1.5">{track.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-surface-muted px-2 py-1 text-[10px] text-muted">{tag}</span>)}</div><div className="mt-4 flex items-center justify-between text-[11px] text-muted"><span>{track.samplingRateHz / 1000} kHz · {track.mentalRhythmBpm} BPM</span><span>{duration(track.durationSeconds)}</span></div>{track.kind === 'audiobook' && <button type="button" onClick={() => setReviewTrack(track)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-line py-2 text-xs font-semibold text-accent hover:border-accent"><BookOpenText className="size-4" />Abrir prova de áudio</button>}</div></article>)}</div> : <div className="mt-5 flex min-h-60 items-center rounded-2xl border border-dashed border-line bg-surface p-8"><div><Disc3 className="size-8 text-accent" /><h3 className="mt-4 font-serif text-2xl font-semibold text-ink">O catálogo aguarda a primeira faixa</h3><p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">O Sound Lab publica arquivos pelo Admin. Enquanto isso, o mixer abaixo já produz paisagens acústicas localmente no navegador.</p></div></div>}
    </section>

    <section id="mixer" className="mt-9 scroll-mt-24 rounded-2xl border border-line bg-surface p-5 sm:p-7" aria-labelledby="mixer-title"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-accent">Paisagem personalizada</p><h2 id="mixer-title" className="mt-1 font-serif text-3xl font-semibold text-ink">Mixer de foco</h2><p className="mt-2 max-w-2xl text-sm text-muted">Combine camadas geradas no dispositivo. Nenhum áudio do manuscrito é enviado a terceiros.</p></div><button type="button" onClick={() => void sound.toggleMixer()} className={cn('inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold', sound.mixerActive ? 'border border-line bg-editor text-ink' : 'bg-accent text-on-accent')}><SlidersHorizontal className="size-4" />{sound.mixerActive ? 'Pausar paisagem' : 'Iniciar paisagem'}</button></div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">{sound.channels.map((channel) => <article key={channel.id} className="rounded-2xl border border-line bg-editor p-5"><div className="flex items-start justify-between gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-accent-subtle text-accent">{channel.id === 'rain_glass' ? <Waves className="size-5" /> : channel.id === 'pink_noise' ? <Radio className="size-5" /> : <Settings2 className="size-5" />}</span><label className="relative inline-flex cursor-pointer items-center"><input type="checkbox" className="peer sr-only" checked={channel.active} onChange={(event) => sound.updateChannel(channel.id, { active: event.target.checked })} /><span className="h-6 w-11 rounded-full bg-line peer-checked:bg-accent" /><span className="absolute left-1 size-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" /></label></div><h3 className="mt-4 font-semibold text-ink">{channel.label}</h3><label className="mt-5 block text-xs text-muted"><span className="flex justify-between"><span>Intensidade</span><strong className="text-ink">{channel.volumePercent}%</strong></span><input type="range" min={0} max={100} value={channel.volumePercent} onChange={(event) => sound.updateChannel(channel.id, { volumePercent: Number(event.target.value) })} className="mt-3 w-full accent-accent" /></label><label className="mt-4 flex items-center gap-2 text-xs text-muted"><input type="checkbox" checked={channel.syncWithTypingWpm} onChange={(event) => sound.updateChannel(channel.id, { syncWithTypingWpm: event.target.checked })} className="accent-accent" />Sincronizar com digitação</label></article>)}</div>
      <div className="mt-6 grid gap-4 border-t border-line pt-5 lg:grid-cols-[1fr_auto_auto]"><label className="flex items-center gap-3 text-sm text-muted"><Volume2 className="size-4 text-accent" /><span>Volume mestre</span><input type="range" min={0} max={100} value={sound.volume} onChange={(event) => sound.setVolume(Number(event.target.value))} className="min-w-28 flex-1 accent-accent" /><strong className="text-ink">{sound.volume}%</strong></label><div className="flex flex-wrap items-center gap-3"><span className="rounded-full bg-accent-subtle px-3 py-1.5 text-xs font-semibold text-accent">{sound.typingWpm} PPM · {sound.typingIdle ? 'em pausa' : 'escrevendo'}</span><label className="flex items-center gap-2 text-xs text-muted"><input type="checkbox" checked={sound.autoPauseOnTypingStop} onChange={(event) => sound.setAutoPauseOnTypingStop(event.target.checked)} className="accent-accent" />Pausar sem digitação</label>{sound.autoPauseOnTypingStop && <select aria-label="Tempo para pausa automática" value={sound.typingInactivityThresholdMs} onChange={(event) => sound.setTypingInactivityThresholdMs(Number(event.target.value))} className="rounded-full border border-line bg-editor px-3 py-1.5 text-xs text-ink"><option value={1000}>1 s</option><option value={2000}>2 s</option><option value={5000}>5 s</option><option value={10000}>10 s</option></select>}</div><button type="button" onClick={() => void saveSettings()} disabled={saving} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-line px-4 text-xs font-semibold text-accent hover:border-accent disabled:opacity-60">{saved ? <Check className="size-4" /> : <Heart className="size-4" />}{saving ? 'Salvando…' : saved ? 'Preferências salvas' : 'Salvar preferências'}</button></div>
    </section>

    <Drawer open={Boolean(reviewTrack)} onOpenChange={(open) => !open && setReviewTrack(null)} swipeDirection="right"><DrawerContent className="bg-surface data-[swipe-axis=x]:[--drawer-content-width:min(54rem,calc(100vw-1rem))]"><DrawerHeader className="border-b border-line text-left"><div className="flex items-start justify-between gap-4"><div><DrawerTitle className="font-serif text-2xl text-ink">Prova de {reviewTrack?.title}</DrawerTitle><DrawerDescription className="mt-1">Transcrição, forma de onda fornecida e marcadores editoriais.</DrawerDescription></div><DrawerClose render={<button type="button" className="rounded-full p-2 text-muted hover:bg-editor" aria-label="Fechar prova" />}><X className="size-5" /></DrawerClose></div></DrawerHeader><div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">{reviewTrack && <><section className="rounded-2xl border border-line bg-editor p-5"><div className="flex h-28 items-center gap-0.5 overflow-hidden" aria-label="Forma de onda">{reviewTrack.waveformPeaks.length ? reviewTrack.waveformPeaks.slice(0, 160).map((peak, index) => <span key={index} className="min-w-0 flex-1 rounded-full bg-accent" style={{ height: `${Math.max(4, Math.min(100, Math.abs(peak) / 327.67))}%` }} />) : <p className="m-auto text-sm text-muted">Forma de onda ainda não processada para esta faixa.</p>}</div><div className="mt-4 flex items-center gap-3"><button type="button" onClick={() => void handleTrack(reviewTrack)} className="flex size-10 items-center justify-center rounded-full bg-accent text-on-accent">{sound.currentTrack?.id === reviewTrack.id && sound.playing ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}</button><span className="text-xs text-muted">{duration(reviewTrack.durationSeconds)} · {reviewTrack.samplingRateHz / 1000} kHz · {reviewTrack.formatEncoding.toUpperCase()}</span></div></section><section className="mt-5 rounded-2xl border border-line bg-surface p-5"><h3 className="font-serif text-xl font-semibold text-ink">Transcrição sincronizada</h3>{reviewTrack.transcript.length ? <p className="mt-4 font-serif text-lg leading-loose text-ink">{reviewTrack.transcript.map((word, index) => <button key={`${word.startTimeMs}-${index}`} type="button" onClick={() => { sound.seek(word.startTimeMs / 1000); void sound.playTrack(reviewTrack); }} className={cn('mr-1 rounded px-1 py-0.5 hover:bg-accent-subtle', sound.currentTrack?.id === reviewTrack.id && sound.currentTime * 1000 >= word.startTimeMs && sound.currentTime * 1000 < word.endTimeMs && 'bg-accent text-on-accent')}>{word.word}</button>)}</p> : <p className="mt-3 text-sm text-muted">Nenhuma transcrição foi anexada a esta faixa.</p>}</section><section className="mt-5 rounded-2xl border border-line bg-surface p-5"><h3 className="font-serif text-xl font-semibold text-ink">Marcador editorial</h3><p className="mt-1 text-xs text-muted">Será salvo em {Math.floor(sound.currentTime / 60)}:{String(Math.floor(sound.currentTime % 60)).padStart(2, '0')}.</p><div className="mt-3 grid gap-3 sm:grid-cols-[11rem_1fr]"><select value={markerType} onChange={(event) => setMarkerType(event.target.value as typeof markerType)} className="rounded-xl border border-line bg-editor px-3 text-sm text-ink"><option value="note">Nota</option><option value="cut">Corte</option><option value="pause">Pausa</option><option value="pronunciation">Pronúncia</option><option value="prosody">Prosódia</option></select><textarea value={markerNote} onChange={(event) => setMarkerNote(event.target.value)} rows={3} placeholder="Ex.: pausa longa; revisar pronúncia do nome." className="w-full rounded-xl border border-line bg-editor p-3 text-sm text-ink outline-none focus:border-accent" /></div><div className="mt-3 flex items-center justify-between"><span className="text-xs text-muted" role="status">{markerStatus}</span><button type="button" onClick={() => void addMarker()} className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-on-accent"><Plus className="size-4" />Adicionar marcador</button></div>{markers.length > 0 && <div className="mt-5 space-y-2 border-t border-line pt-4">{markers.map((marker) => <button key={marker.id} type="button" onClick={() => sound.seek(marker.time_ms / 1000)} className="flex w-full items-start gap-3 rounded-xl bg-editor p-3 text-left"><span className="rounded-full bg-accent-subtle px-2 py-1 text-[10px] font-bold uppercase text-accent">{marker.marker_type}</span><span className="min-w-0 flex-1 text-sm text-ink">{marker.note}</span><span className="text-xs text-muted">{Math.floor(marker.time_ms / 60000)}:{String(Math.floor(marker.time_ms / 1000) % 60).padStart(2, '0')}</span></button>)}</div>}</section></>}</div></DrawerContent></Drawer>
  </div>;
}
