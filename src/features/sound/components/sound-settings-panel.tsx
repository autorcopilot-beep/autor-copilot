'use client';

import { Check, Save, SlidersHorizontal, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { useSound } from '@/features/sound/sound-provider';
import { createClient } from '@/lib/supabase/client';
import type { Database, Json } from '@/types/database.generated';

type MixRow = Database['public']['Tables']['audio_mix_presets']['Row'];

export function SoundSettingsPanel() {
  const sound = useSound();
  const { setVolume, setPlaybackRate, setAutoPauseOnTypingStop, setTypingInactivityThresholdMs, setPomodoroConfig } = sound;
  const supabase = useMemo(() => createClient(), []);
  const [userId, setUserId] = useState('');
  const [mixes, setMixes] = useState<MixRow[]>([]);
  const [mixName, setMixName] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    let active = true;
    void supabase.auth.getClaims().then(async ({ data }) => {
      const id = data?.claims?.sub;
      if (!id || !active) return;
      setUserId(id);
      const [settings, savedMixes] = await Promise.all([
        supabase.from('audio_user_settings').select('*').eq('user_id', id).maybeSingle(),
        supabase.from('audio_mix_presets').select('*').order('updated_at', { ascending: false }),
      ]);
      if (!active) return;
      setMixes(savedMixes.data ?? []);
      if (settings.data) {
        setVolume(settings.data.master_volume);
        setPlaybackRate(settings.data.playback_rate);
        setAutoPauseOnTypingStop(settings.data.auto_pause_on_typing_stop);
        setTypingInactivityThresholdMs(settings.data.typing_inactivity_threshold_ms);
        setPomodoroConfig({ focusMinutes: settings.data.pomodoro_focus_minutes, breakMinutes: settings.data.pomodoro_break_minutes, longBreakMinutes: settings.data.pomodoro_long_break_minutes, cycles: settings.data.pomodoro_cycles, autoStart: settings.data.pomodoro_auto_start, soundFollows: settings.data.sound_follows_pomodoro });
      }
    });
    return () => { active = false; };
  }, [setAutoPauseOnTypingStop, setPlaybackRate, setPomodoroConfig, setTypingInactivityThresholdMs, setVolume, supabase]);

  async function saveSettings() {
    if (!userId) return;
    setStatus('Salvando…');
    const { error } = await supabase.from('audio_user_settings').upsert({ user_id: userId, master_volume: sound.volume, playback_rate: sound.playbackRate, mixer_channels: sound.channels as unknown as Json, spatial_mode: 'stereo', auto_pause_on_typing_stop: sound.autoPauseOnTypingStop, typing_inactivity_threshold_ms: sound.typingInactivityThresholdMs, crossfade_duration_ms: 1200, pomodoro_focus_minutes: sound.pomodoroFocusMinutes, pomodoro_break_minutes: sound.pomodoroBreakMinutes, pomodoro_long_break_minutes: sound.pomodoroLongBreakMinutes, pomodoro_cycles: sound.pomodoroCycles, pomodoro_auto_start: sound.pomodoroAutoStart, sound_follows_pomodoro: sound.soundFollowsPomodoro }, { onConflict: 'user_id' });
    setStatus(error ? 'Não foi possível salvar.' : 'Preferências salvas.');
  }

  async function saveMix() {
    if (!userId || !mixName.trim()) return;
    const { data, error } = await supabase.from('audio_mix_presets').upsert({ user_id: userId, title: mixName.trim(), channels: sound.channels as unknown as Json }, { onConflict: 'user_id,title' }).select('*').single();
    if (!error && data) { setMixes((current) => [data, ...current.filter((mix) => mix.id !== data.id)]); setMixName(''); setStatus('Mixagem guardada.'); }
  }

  function applyMix(mix: MixRow) {
    if (!Array.isArray(mix.channels)) return;
    for (const raw of mix.channels) {
      if (!raw || typeof raw !== 'object' || Array.isArray(raw) || typeof raw.id !== 'string') continue;
      const current = sound.channels.find((channel) => channel.id === raw.id);
      if (!current) continue;
      sound.updateChannel(current.id, { active: typeof raw.active === 'boolean' ? raw.active : current.active, volumePercent: typeof raw.volumePercent === 'number' ? raw.volumePercent : current.volumePercent, syncWithTypingWpm: typeof raw.syncWithTypingWpm === 'boolean' ? raw.syncWithTypingWpm : current.syncWithTypingWpm });
    }
    void sound.startMixer(); setStatus(`Mixagem “${mix.title}” aplicada.`);
  }

  async function deleteMix(id: string) {
    const { error } = await supabase.from('audio_mix_presets').delete().eq('id', id);
    if (!error) setMixes((current) => current.filter((mix) => mix.id !== id));
  }

  return <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-accent">Comportamento do plugin</p><h3 className="mt-1 font-serif text-3xl font-semibold text-ink">Preferências e mixes</h3><div className="mt-6 grid gap-4 lg:grid-cols-2"><section className="rounded-2xl border border-line bg-editor p-5"><h4 className="font-serif text-xl text-ink">Durante a escrita</h4><div className="mt-4 space-y-4"><label className="flex items-center gap-3 text-sm text-muted">Volume geral<input type="range" min={0} max={100} value={sound.volume} onChange={(event) => sound.setVolume(Number(event.target.value))} className="min-w-24 flex-1 accent-accent" /><strong className="w-10 text-right text-ink">{sound.volume}%</strong></label><label className="flex items-center justify-between gap-4 text-sm text-muted">Velocidade de faixas<select value={sound.playbackRate} onChange={(event) => sound.setPlaybackRate(Number(event.target.value))} className="rounded-xl border border-line bg-surface px-3 py-2 text-ink"><option value={0.8}>0,8×</option><option value={1}>1×</option><option value={1.2}>1,2×</option><option value={1.5}>1,5×</option><option value={2}>2×</option></select></label><label className="flex items-start gap-2 text-xs leading-relaxed text-muted"><input type="checkbox" checked={sound.autoPauseOnTypingStop} onChange={(event) => sound.setAutoPauseOnTypingStop(event.target.checked)} className="mt-0.5 accent-accent" />Reduzir a atmosfera quando a digitação parar</label>{sound.autoPauseOnTypingStop && <label className="flex items-center justify-between gap-4 text-xs text-muted">Intervalo de silêncio<select value={sound.typingInactivityThresholdMs} onChange={(event) => sound.setTypingInactivityThresholdMs(Number(event.target.value))} className="rounded-xl border border-line bg-surface px-3 py-2 text-ink"><option value={1000}>1 segundo</option><option value={2000}>2 segundos</option><option value={5000}>5 segundos</option><option value={10000}>10 segundos</option></select></label>}</div><button type="button" onClick={() => void saveSettings()} className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-on-accent"><Save className="size-3.5" />Salvar no perfil</button><span className="ml-3 text-xs text-muted" role="status">{status}</span></section><section className="rounded-2xl border border-line bg-editor p-5"><div className="flex items-center gap-2"><SlidersHorizontal className="size-4 text-accent" /><h4 className="font-serif text-xl text-ink">Mixagens salvas</h4></div><div className="mt-4 flex gap-2"><input value={mixName} onChange={(event) => setMixName(event.target.value)} placeholder="Nome desta atmosfera" maxLength={80} className="min-h-10 min-w-0 flex-1 rounded-xl border border-line bg-surface px-3 text-sm text-ink outline-none focus:border-accent" /><button type="button" onClick={() => void saveMix()} className="rounded-xl border border-line px-3 text-xs font-semibold text-accent">Guardar atual</button></div>{mixes.length ? <div className="mt-4 space-y-2">{mixes.map((mix) => <div key={mix.id} className="flex items-center gap-2 rounded-xl bg-surface p-3"><button type="button" onClick={() => applyMix(mix)} className="min-w-0 flex-1 text-left"><strong className="block truncate text-sm text-ink">{mix.title}</strong><span className="text-[10px] text-muted">Configuração pessoal</span></button><Check className="size-3.5 text-accent" /><button type="button" onClick={() => void deleteMix(mix.id)} className="p-1.5 text-muted hover:text-danger" aria-label={`Excluir ${mix.title}`}><Trash2 className="size-3.5" /></button></div>)}</div> : <p className="mt-5 text-sm text-muted">Ajuste o mixer e guarde combinações que combinam com a sua obra.</p>}</section></div></div>;
}
