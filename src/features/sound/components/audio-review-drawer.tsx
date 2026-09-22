'use client';

import { BookOpenText, Pause, Play, Plus, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui';
import { useSound } from '@/features/sound/sound-provider';
import type { SoundTrack } from '@/features/sound/types';
import { cn } from '@/lib/cn';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database.generated';

type Marker = Database['public']['Tables']['audio_editorial_markers']['Row'];
type MarkerType = 'note' | 'cut' | 'pause' | 'pronunciation' | 'prosody';

function clock(ms: number) { const seconds = Math.floor(ms / 1000); return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`; }

export function AudioReviewDrawer({ track, onClose }: { track: SoundTrack | null; onClose: () => void }) {
  const sound = useSound();
  const supabase = useMemo(() => createClient(), []);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [note, setNote] = useState('');
  const [type, setType] = useState<MarkerType>('note');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!track) return;
    let active = true;
    void supabase.from('audio_editorial_markers').select('*').eq('track_id', track.id).order('time_ms').then(({ data }) => { if (active) setMarkers(data ?? []); });
    return () => { active = false; };
  }, [supabase, track]);

  async function toggle() {
    if (!track) return;
    if (sound.currentTrack?.id === track.id) await sound.togglePlayback(); else await sound.playTrack(track);
  }

  async function addMarker() {
    if (!track || !note.trim()) return;
    setStatus('Salvando…');
    const { data: claims } = await supabase.auth.getClaims();
    const userId = claims?.claims?.sub;
    if (!userId) { setStatus('Sessão expirada.'); return; }
    const { data, error } = await supabase.from('audio_editorial_markers').insert({ user_id: userId, track_id: track.id, time_ms: Math.round(sound.currentTime * 1000), marker_type: type, note: note.trim() }).select('*').single();
    if (error || !data) { setStatus('Não foi possível salvar.'); return; }
    setMarkers((current) => [...current, data].sort((a, b) => a.time_ms - b.time_ms));
    setNote(''); setStatus('Marcador salvo.');
  }

  return <Drawer open={Boolean(track)} onOpenChange={(open) => !open && onClose()} swipeDirection="right"><DrawerContent className="bg-surface data-[swipe-axis=x]:[--drawer-content-width:min(48rem,calc(100vw-1rem))]"><DrawerHeader className="border-b border-line text-left"><div className="flex items-start gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-accent-subtle text-accent"><BookOpenText className="size-4" /></span><div className="min-w-0 flex-1"><DrawerTitle className="truncate font-serif text-2xl text-ink">Prova de {track?.title}</DrawerTitle><DrawerDescription>Escuta editorial, texto sincronizado e decisões por tempo.</DrawerDescription></div><DrawerClose render={<button type="button" className="rounded-full p-2 text-muted hover:bg-editor" aria-label="Fechar prova" />}><X className="size-4" /></DrawerClose></div></DrawerHeader><div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">{track && <><section className="rounded-2xl bg-editor p-5"><div className="flex h-24 items-center gap-0.5 overflow-hidden">{track.waveformPeaks.length ? track.waveformPeaks.slice(0, 180).map((peak, index) => <button key={index} type="button" onClick={() => sound.seek(index / Math.min(180, track.waveformPeaks.length) * track.durationSeconds)} className="min-w-0 flex-1 rounded-full bg-accent/70 hover:bg-accent" style={{ height: `${Math.max(5, Math.min(100, Math.abs(peak) / 327.67))}%` }} aria-label={`Ir para ${Math.round(index / Math.min(180, track.waveformPeaks.length) * track.durationSeconds)} segundos`} />) : <p className="m-auto text-sm text-muted">A forma de onda ainda não foi anexada.</p>}</div><div className="mt-4 flex items-center gap-3"><button type="button" onClick={() => void toggle()} className="flex size-10 items-center justify-center rounded-full bg-accent text-on-accent">{sound.currentTrack?.id === track.id && sound.playing ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}</button><span className="text-xs text-muted">{clock(sound.currentTrack?.id === track.id ? sound.currentTime * 1000 : 0)} · {track.samplingRateHz / 1000} kHz · {track.formatEncoding.toUpperCase()}</span></div></section><section className="mt-4 rounded-2xl border border-line p-5"><h3 className="font-serif text-xl text-ink">Texto ouvido</h3>{track.transcript.length ? <p className="mt-4 font-serif text-lg leading-loose text-ink">{track.transcript.map((word, index) => <button key={`${word.startTimeMs}-${index}`} type="button" onClick={() => { sound.seek(word.startTimeMs / 1000); void sound.playTrack(track); }} className={cn('mr-1 rounded px-1 py-0.5 hover:bg-accent-subtle', sound.currentTrack?.id === track.id && sound.currentTime * 1000 >= word.startTimeMs && sound.currentTime * 1000 < word.endTimeMs && 'bg-accent text-on-accent')}>{word.word}</button>)}</p> : <p className="mt-2 text-sm text-muted">Esta prova ainda não recebeu transcrição.</p>}</section><section className="mt-4 rounded-2xl border border-line p-5"><div className="flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-accent">Caderno de escuta</p><h3 className="mt-1 font-serif text-xl text-ink">Marcar em {clock(sound.currentTime * 1000)}</h3></div><span className="text-xs text-muted" role="status">{status}</span></div><div className="mt-4 grid gap-3 sm:grid-cols-[10rem_1fr]"><select value={type} onChange={(event) => setType(event.target.value as MarkerType)} className="rounded-xl border border-line bg-editor px-3 text-sm text-ink"><option value="note">Nota</option><option value="cut">Corte</option><option value="pause">Pausa</option><option value="pronunciation">Pronúncia</option><option value="prosody">Prosódia</option></select><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="O que precisa mudar nesta passagem?" className="rounded-xl border border-line bg-editor p-3 text-sm text-ink outline-none focus:border-accent" /></div><button type="button" onClick={() => void addMarker()} className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-on-accent"><Plus className="size-3.5" />Guardar decisão</button>{markers.length > 0 && <div className="mt-5 space-y-2 border-t border-line pt-4">{markers.map((marker) => <button key={marker.id} type="button" onClick={() => sound.seek(marker.time_ms / 1000)} className="flex w-full items-start gap-3 rounded-xl bg-editor p-3 text-left"><span className="text-[10px] font-bold uppercase text-accent">{marker.marker_type}</span><span className="min-w-0 flex-1 text-sm text-ink">{marker.note}</span><span className="text-xs tabular-nums text-muted">{clock(marker.time_ms)}</span></button>)}</div>}</section></>}</div></DrawerContent></Drawer>;
}
