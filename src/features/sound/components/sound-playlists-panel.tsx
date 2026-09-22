'use client';

import { ListMusic, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import { officialSoundPresets } from '@/features/sound/presets';
import { useSound } from '@/features/sound/sound-provider';
import type { SoundPreset, SoundTrack } from '@/features/sound/types';
import { cn } from '@/lib/cn';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database.generated';

type Playlist = Database['public']['Tables']['audio_playlists']['Row'];
type PlaylistItem = Database['public']['Tables']['audio_playlist_items']['Row'];

const coverByKey: Record<string, string> = { escrita: '/images/kit_marca/01_ilustracoes/escrita.svg', fantasia: '/images/kit_marca/01_ilustracoes/fantasia.svg', misterio: '/images/kit_marca/01_ilustracoes/misterio.svg', romance: '/images/kit_marca/01_ilustracoes/romance.svg', aventura: '/images/kit_marca/01_ilustracoes/aventura.svg', ficcao: '/images/kit_marca/01_ilustracoes/ficcao.svg' };

export function SoundPlaylistsPanel({ tracks }: { tracks: SoundTrack[] }) {
  const sound = useSound();
  const supabase = useMemo(() => createClient(), []);
  const [userId, setUserId] = useState('');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [items, setItems] = useState<PlaylistItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const active = playlists.find((playlist) => playlist.id === activeId) ?? playlists[0];
  const activeItems = active ? items.filter((item) => item.playlist_id === active.id).sort((a, b) => a.position - b.position) : [];

  useEffect(() => {
    let alive = true;
    void supabase.auth.getClaims().then(async ({ data }) => {
      const id = data?.claims?.sub;
      if (!id || !alive) return;
      setUserId(id);
      const [playlistResult, itemResult] = await Promise.all([supabase.from('audio_playlists').select('*').order('updated_at', { ascending: false }), supabase.from('audio_playlist_items').select('*').order('position')]);
      if (!alive) return;
      setPlaylists(playlistResult.data ?? []); setItems(itemResult.data ?? []); setActiveId(playlistResult.data?.[0]?.id ?? '');
    });
    return () => { alive = false; };
  }, [supabase]);

  async function createPlaylist() {
    if (!userId || !title.trim()) return;
    const { data, error } = await supabase.from('audio_playlists').insert({ owner_id: userId, title: title.trim(), description: 'Playlist pessoal da obra', genre: 'pessoal', cover_key: 'escrita' }).select('*').single();
    if (error || !data) { setStatus('Não foi possível criar.'); return; }
    setPlaylists((current) => [data, ...current]); setActiveId(data.id); setTitle(''); setStatus('Playlist criada.');
  }

  async function addPreset(preset: SoundPreset) {
    if (!active) { setStatus('Crie uma playlist primeiro.'); return; }
    const position = activeItems.length;
    const { data, error } = await supabase.from('audio_playlist_items').insert({ playlist_id: active.id, preset_id: preset.id, position }).select('*').single();
    if (!error && data) { setItems((current) => [...current, data]); setStatus(`“${preset.title}” adicionada.`); }
    else setStatus(error?.code === '23505' ? 'Essa sessão já está na playlist.' : 'Não foi possível adicionar.');
  }

  async function addTrack(track: SoundTrack) {
    if (!active) { setStatus('Crie uma playlist primeiro.'); return; }
    const { data, error } = await supabase.from('audio_playlist_items').insert({ playlist_id: active.id, track_id: track.id, position: activeItems.length }).select('*').single();
    if (!error && data) { setItems((current) => [...current, data]); setStatus(`“${track.title}” adicionada.`); }
    else setStatus(error?.code === '23505' ? 'Essa faixa já está na playlist.' : 'Não foi possível adicionar.');
  }

  async function removeItem(id: string) { const { error } = await supabase.from('audio_playlist_items').delete().eq('id', id); if (!error) setItems((current) => current.filter((item) => item.id !== id)); }
  async function deletePlaylist(id: string) { const { error } = await supabase.from('audio_playlists').delete().eq('id', id); if (!error) { setPlaylists((current) => current.filter((playlist) => playlist.id !== id)); setItems((current) => current.filter((item) => item.playlist_id !== id)); setActiveId(''); } }
  async function playPreset(preset: SoundPreset) { for (const channel of sound.channels) { const volume = preset.channels[channel.id]; sound.updateChannel(channel.id, { active: typeof volume === 'number', ...(typeof volume === 'number' ? { volumePercent: volume } : {}) }); } await sound.startMixer(); }

  return <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-accent">Coleções pessoais</p><h3 className="mt-1 font-serif text-3xl font-semibold text-ink">Playlists da obra</h3><div className="mt-5 flex gap-2"><input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={100} placeholder="Ex.: Noites escrevendo o capítulo 4" className="min-h-11 min-w-0 flex-1 rounded-full border border-line bg-editor px-4 text-sm text-ink outline-none focus:border-accent" /><button type="button" onClick={() => void createPlaylist()} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-xs font-semibold text-on-accent"><Plus className="size-3.5" />Criar playlist</button></div><p className="mt-2 min-h-4 text-xs text-muted" role="status">{status}</p><div className="mt-4 grid gap-5 lg:grid-cols-[15rem_1fr]"><aside className="space-y-2">{playlists.length ? playlists.map((playlist) => <button key={playlist.id} type="button" onClick={() => setActiveId(playlist.id)} className={cn('flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left', active?.id === playlist.id ? 'border-accent bg-accent-subtle' : 'border-line bg-editor')}><span className="relative size-11 shrink-0 overflow-hidden rounded-xl"><Image src={coverByKey[playlist.cover_key] ?? coverByKey.escrita} alt="" fill sizes="44px" className="object-cover" /></span><span className="min-w-0 flex-1"><strong className="block truncate text-xs text-ink">{playlist.title}</strong><span className="text-[10px] text-muted">{items.filter((item) => item.playlist_id === playlist.id).length} itens</span></span></button>) : <div className="rounded-2xl border border-dashed border-line p-4 text-xs leading-relaxed text-muted">Crie uma playlist para combinar sessões nativas e faixas do catálogo.</div>}</aside><div className="min-w-0"><section className="rounded-2xl border border-line bg-editor p-4"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-wider text-accent">Em sequência</p><h4 className="mt-1 font-serif text-xl text-ink">{active?.title ?? 'Selecione uma playlist'}</h4></div>{active && !active.is_official && <button type="button" onClick={() => void deletePlaylist(active.id)} className="p-2 text-muted hover:text-danger" aria-label="Excluir playlist"><Trash2 className="size-4" /></button>}</div>{activeItems.length ? <div className="mt-4 space-y-2">{activeItems.map((item, index) => { const preset = officialSoundPresets.find((candidate) => candidate.id === item.preset_id); const track = tracks.find((candidate) => candidate.id === item.track_id); const label = preset?.title ?? track?.title ?? 'Item indisponível'; return <div key={item.id} className="flex items-center gap-3 rounded-xl bg-surface p-2.5"><span className="w-5 text-center font-serif text-sm text-muted">{index + 1}</span><button type="button" onClick={() => preset ? void playPreset(preset) : track ? void sound.playTrack(track) : undefined} className="min-w-0 flex-1 truncate text-left text-sm text-ink">{label}</button><button type="button" onClick={() => void removeItem(item.id)} className="p-1.5 text-muted hover:text-danger" aria-label={`Remover ${label}`}><Trash2 className="size-3.5" /></button></div>; })}</div> : <p className="mt-4 text-sm text-muted">Adicione sessões ou faixas abaixo para montar o percurso desta obra.</p>}</section><section className="mt-4"><div className="flex items-center gap-2"><ListMusic className="size-4 text-accent" /><h4 className="font-serif text-lg text-ink">Adicionar sessões oficiais</h4></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{officialSoundPresets.map((preset) => <button key={preset.id} type="button" onClick={() => void addPreset(preset)} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-2 text-left hover:border-accent/40"><span className="relative size-10 shrink-0 overflow-hidden rounded-lg"><Image src={preset.coverUrl} alt="" fill sizes="40px" className="object-cover" /></span><span className="min-w-0 flex-1"><strong className="block truncate text-xs text-ink">{preset.title}</strong><span className="text-[10px] text-muted">{preset.genre} · {preset.bpm} BPM</span></span><Plus className="size-3.5 text-accent" /></button>)}</div>{tracks.length > 0 && <><h4 className="mt-5 font-serif text-lg text-ink">Adicionar do catálogo</h4><div className="mt-3 grid gap-2 sm:grid-cols-2">{tracks.map((track) => <button key={track.id} type="button" onClick={() => void addTrack(track)} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3 text-left hover:border-accent/40"><span className="min-w-0 flex-1"><strong className="block truncate text-xs text-ink">{track.title}</strong><span className="text-[10px] text-muted">{track.genre} · {track.authorName}</span></span><Plus className="size-3.5 text-accent" /></button>)}</div></>}</section></div></div></div>;
}
