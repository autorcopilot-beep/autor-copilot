'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import type { MixerChannel, MixerChannelId, SoundTrack } from '@/features/sound/types';

const defaultChannels: MixerChannel[] = [
  { id: 'pink_noise', label: 'Ruído rosa', volumePercent: 35, syncWithTypingWpm: false, active: false },
  { id: 'brown_noise', label: 'Ruído profundo', volumePercent: 28, syncWithTypingWpm: false, active: false },
  { id: 'rain_glass', label: 'Chuva na janela', volumePercent: 60, syncWithTypingWpm: true, active: false },
  { id: 'ocean_tide', label: 'Maré lenta', volumePercent: 48, syncWithTypingWpm: false, active: false },
  { id: 'fireplace', label: 'Lareira baixa', volumePercent: 32, syncWithTypingWpm: true, active: false },
  { id: 'forest_night', label: 'Floresta noturna', volumePercent: 38, syncWithTypingWpm: false, active: false },
  { id: 'cafe_room', label: 'Café distante', volumePercent: 34, syncWithTypingWpm: true, active: false },
  { id: 'night_train', label: 'Trem noturno', volumePercent: 40, syncWithTypingWpm: false, active: false },
  { id: 'typewriter_keys', label: 'Teclas mecânicas', volumePercent: 20, syncWithTypingWpm: true, active: false },
];

type SoundContextValue = {
  currentTrack: SoundTrack | null;
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  channels: MixerChannel[];
  mixerActive: boolean;
  typingWpm: number;
  autoPauseOnTypingStop: boolean;
  typingInactivityThresholdMs: number;
  typingIdle: boolean;
  pomodoroPhase: 'focus' | 'break' | 'long_break';
  pomodoroRemainingSeconds: number;
  pomodoroRunning: boolean;
  pomodoroCompletedCycles: number;
  pomodoroFocusMinutes: number;
  pomodoroBreakMinutes: number;
  pomodoroLongBreakMinutes: number;
  pomodoroCycles: number;
  pomodoroAutoStart: boolean;
  soundFollowsPomodoro: boolean;
  playTrack: (track: SoundTrack) => Promise<void>;
  togglePlayback: () => Promise<void>;
  seek: (seconds: number) => void;
  setVolume: (value: number) => void;
  setPlaybackRate: (value: number) => void;
  setAutoPauseOnTypingStop: (value: boolean) => void;
  setTypingInactivityThresholdMs: (value: number) => void;
  setPomodoroConfig: (changes: Partial<{ focusMinutes: number; breakMinutes: number; longBreakMinutes: number; cycles: number; autoStart: boolean; soundFollows: boolean }>) => void;
  togglePomodoro: () => void;
  resetPomodoro: () => void;
  updateChannel: (id: MixerChannelId, changes: Partial<MixerChannel>) => void;
  toggleMixer: () => Promise<void>;
  startMixer: () => Promise<void>;
  stopAll: () => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);
const storageKey = 'autor-copilot:media-sound';

type NoiseNode = { source: AudioBufferSourceNode; gain: GainNode };

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const noiseNodesRef = useRef<Partial<Record<MixerChannelId, NoiseNode>>>({});
  const typingEventsRef = useRef<number[]>([]);
  const [currentTrack, setCurrentTrack] = useState<SoundTrack | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(65);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [channels, setChannels] = useState<MixerChannel[]>(defaultChannels);
  const [mixerActive, setMixerActive] = useState(false);
  const [typingWpm, setTypingWpm] = useState(0);
  const [autoPauseOnTypingStop, setAutoPauseOnTypingStop] = useState(false);
  const [typingInactivityThresholdMs, setTypingInactivityThresholdMs] = useState(2000);
  const [typingIdle, setTypingIdle] = useState(true);
  const [pomodoroPhase, setPomodoroPhase] = useState<'focus' | 'break' | 'long_break'>('focus');
  const [pomodoroRemainingSeconds, setPomodoroRemainingSeconds] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroCompletedCycles, setPomodoroCompletedCycles] = useState(0);
  const [pomodoroFocusMinutes, setPomodoroFocusMinutes] = useState(25);
  const [pomodoroBreakMinutes, setPomodoroBreakMinutes] = useState(5);
  const [pomodoroLongBreakMinutes, setPomodoroLongBreakMinutes] = useState(15);
  const [pomodoroCycles, setPomodoroCycles] = useState(4);
  const [pomodoroAutoStart, setPomodoroAutoStart] = useState(false);
  const [soundFollowsPomodoro, setSoundFollowsPomodoro] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;
    const hydrate = window.setTimeout(() => {
      try {
        const parsed = JSON.parse(stored) as { volume?: number; playbackRate?: number; channels?: MixerChannel[]; autoPauseOnTypingStop?: boolean; typingInactivityThresholdMs?: number; pomodoroFocusMinutes?: number; pomodoroBreakMinutes?: number; pomodoroLongBreakMinutes?: number; pomodoroCycles?: number; pomodoroAutoStart?: boolean; soundFollowsPomodoro?: boolean };
        if (typeof parsed.volume === 'number') setVolumeState(Math.min(100, Math.max(0, parsed.volume)));
        if ([0.8, 1, 1.2, 1.5, 2].includes(parsed.playbackRate ?? 0)) setPlaybackRateState(parsed.playbackRate as number);
        if (Array.isArray(parsed.channels)) setChannels(defaultChannels.map((channel) => ({ ...channel, ...parsed.channels?.find((item) => item.id === channel.id) })));
        if (typeof parsed.autoPauseOnTypingStop === 'boolean') setAutoPauseOnTypingStop(parsed.autoPauseOnTypingStop);
        if (typeof parsed.typingInactivityThresholdMs === 'number') setTypingInactivityThresholdMs(Math.min(10_000, Math.max(500, parsed.typingInactivityThresholdMs)));
        if (typeof parsed.pomodoroFocusMinutes === 'number') { const value = Math.min(120, Math.max(5, parsed.pomodoroFocusMinutes)); setPomodoroFocusMinutes(value); setPomodoroRemainingSeconds(value * 60); }
        if (typeof parsed.pomodoroBreakMinutes === 'number') setPomodoroBreakMinutes(Math.min(30, Math.max(1, parsed.pomodoroBreakMinutes)));
        if (typeof parsed.pomodoroLongBreakMinutes === 'number') setPomodoroLongBreakMinutes(Math.min(60, Math.max(5, parsed.pomodoroLongBreakMinutes)));
        if (typeof parsed.pomodoroCycles === 'number') setPomodoroCycles(Math.min(12, Math.max(1, parsed.pomodoroCycles)));
        if (typeof parsed.pomodoroAutoStart === 'boolean') setPomodoroAutoStart(parsed.pomodoroAutoStart);
        if (typeof parsed.soundFollowsPomodoro === 'boolean') setSoundFollowsPomodoro(parsed.soundFollowsPomodoro);
      } catch { /* Preferences remain at safe defaults. */ }
    }, 0);
    return () => window.clearTimeout(hydrate);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ volume, playbackRate, channels, autoPauseOnTypingStop, typingInactivityThresholdMs, pomodoroFocusMinutes, pomodoroBreakMinutes, pomodoroLongBreakMinutes, pomodoroCycles, pomodoroAutoStart, soundFollowsPomodoro }));
  }, [autoPauseOnTypingStop, channels, playbackRate, pomodoroAutoStart, pomodoroBreakMinutes, pomodoroCycles, pomodoroFocusMinutes, pomodoroLongBreakMinutes, soundFollowsPomodoro, typingInactivityThresholdMs, volume]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = 0.65;
    audio.playbackRate = 1;
    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
    audio.addEventListener('durationchange', () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0));
    audio.addEventListener('play', () => setPlaying(true));
    audio.addEventListener('pause', () => setPlaying(false));
    audio.addEventListener('ended', () => setPlaying(false));
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ''; audioRef.current = null; };
  }, []);

  useEffect(() => {
    const pomodoroMuted = soundFollowsPomodoro && pomodoroPhase !== 'focus';
    if (audioRef.current) audioRef.current.volume = pomodoroMuted ? 0 : volume / 100;
    if (masterGainRef.current) masterGainRef.current.gain.value = pomodoroMuted ? 0 : volume / 100;
  }, [pomodoroPhase, soundFollowsPomodoro, volume]);
  useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = playbackRate; }, [playbackRate]);

  const ensureContext = useCallback(async () => {
    const AudioContextCtor = window.AudioContext;
    if (!contextRef.current) {
      const context = new AudioContextCtor({ latencyHint: 'interactive' });
      const compressor = context.createDynamicsCompressor();
      compressor.threshold.value = -3;
      compressor.ratio.value = 4;
      const master = context.createGain();
      master.gain.value = volume / 100;
      master.connect(compressor).connect(context.destination);
      contextRef.current = context;
      masterGainRef.current = master;
    }
    if (contextRef.current.state === 'suspended') await contextRef.current.resume();
    return contextRef.current;
  }, [volume]);

  const makeNoise = useCallback(async (id: MixerChannelId, level: number) => {
    const context = await ensureContext();
    const buffer = context.createBuffer(2, context.sampleRate * 4, context.sampleRate);
    for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
      const data = buffer.getChannelData(channel);
      let pink = 0;
      for (let index = 0; index < data.length; index += 1) {
        const white = Math.random() * 2 - 1;
        pink = pink * 0.985 + white * 0.015;
        if (id === 'rain_glass') data[index] = white * 0.22;
        else if (id === 'brown_noise' || id === 'night_train') data[index] = pink * 3.1;
        else if (id === 'ocean_tide') data[index] = pink * (0.75 + Math.sin(index / context.sampleRate * Math.PI * 0.22) * 0.65);
        else if (id === 'fireplace') data[index] = pink * 0.55 + (Math.random() > 0.998 ? white * 0.9 : 0);
        else if (id === 'forest_night') data[index] = pink * 0.4 + (Math.random() > 0.9995 ? Math.sin(index * 0.18) * 0.35 : 0);
        else if (id === 'cafe_room') data[index] = pink * 0.72 + white * 0.035;
        else data[index] = pink * 2.2;
      }
    }
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = context.createBiquadFilter();
    filter.type = id === 'rain_glass' || id === 'fireplace' || id === 'forest_night' ? 'bandpass' : 'lowpass';
    filter.frequency.value = id === 'rain_glass' ? 3400 : id === 'fireplace' ? 1800 : id === 'forest_night' ? 4200 : id === 'cafe_room' ? 1350 : id === 'ocean_tide' ? 620 : id === 'night_train' ? 380 : 900;
    filter.Q.value = id === 'rain_glass' ? 0.45 : id === 'fireplace' ? 0.7 : 0.55;
    const gain = context.createGain();
    gain.gain.value = level / 100;
    source.connect(filter).connect(gain).connect(masterGainRef.current!);
    source.start();
    noiseNodesRef.current[id] = { source, gain };
  }, [ensureContext]);

  const updateChannel = useCallback((id: MixerChannelId, changes: Partial<MixerChannel>) => {
    setChannels((current) => current.map((channel) => channel.id === id ? { ...channel, ...changes } : channel));
  }, []);

  useEffect(() => {
    const registerTyping = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) return;
      const now = Date.now();
      typingEventsRef.current = [...typingEventsRef.current.filter((time) => now - time <= 12_000), now];
    };
    const interval = window.setInterval(() => {
      const now = Date.now();
      typingEventsRef.current = typingEventsRef.current.filter((time) => now - time <= 12_000);
      setTypingWpm(Math.round(typingEventsRef.current.length));
      setTypingIdle(!typingEventsRef.current.length || now - typingEventsRef.current.at(-1)! >= typingInactivityThresholdMs);
    }, 1000);
    window.addEventListener('keydown', registerTyping);
    return () => { window.removeEventListener('keydown', registerTyping); window.clearInterval(interval); };
  }, [typingInactivityThresholdMs]);

  useEffect(() => {
    if (!pomodoroRunning) return;
    const timer = window.setInterval(() => {
      setPomodoroRemainingSeconds((remaining) => {
        if (remaining > 1) return remaining - 1;
        if (pomodoroPhase === 'focus') {
          const completed = pomodoroCompletedCycles + 1;
          setPomodoroCompletedCycles(completed);
          const longBreak = completed % pomodoroCycles === 0;
          setPomodoroPhase(longBreak ? 'long_break' : 'break');
          if (!pomodoroAutoStart) setPomodoroRunning(false);
          return (longBreak ? pomodoroLongBreakMinutes : pomodoroBreakMinutes) * 60;
        }
        setPomodoroPhase('focus');
        if (!pomodoroAutoStart) setPomodoroRunning(false);
        return pomodoroFocusMinutes * 60;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [pomodoroAutoStart, pomodoroBreakMinutes, pomodoroCompletedCycles, pomodoroCycles, pomodoroFocusMinutes, pomodoroLongBreakMinutes, pomodoroPhase, pomodoroRunning]);

  useEffect(() => {
    if (!mixerActive) return;
    channels.forEach((channel) => {
      const existing = noiseNodesRef.current[channel.id];
      if (channel.id === 'typewriter_keys') return;
      if (channel.active && !existing) void makeNoise(channel.id, channel.volumePercent);
      if (!channel.active && existing) { existing.source.stop(); delete noiseNodesRef.current[channel.id]; }
      if (channel.active && existing && contextRef.current) {
        const idleFactor = autoPauseOnTypingStop && typingIdle ? 0 : 1;
        const typingFactor = channel.syncWithTypingWpm ? Math.min(1.35, Math.max(0.55, 0.55 + typingWpm / 100)) : 1;
        existing.gain.gain.setTargetAtTime((channel.volumePercent / 100) * typingFactor * idleFactor, contextRef.current.currentTime, 0.08);
      }
    });
  }, [autoPauseOnTypingStop, channels, makeNoise, mixerActive, typingIdle, typingWpm]);

  useEffect(() => {
    if (!mixerActive) return;
    const typewriter = channels.find((channel) => channel.id === 'typewriter_keys');
    if (!typewriter?.active) return;
    const click = async (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const context = await ensureContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'square'; oscillator.frequency.value = 110 + Math.random() * 65;
      gain.gain.setValueAtTime((typewriter.volumePercent / 100) * 0.08, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.045);
      oscillator.connect(gain).connect(masterGainRef.current!); oscillator.start(); oscillator.stop(context.currentTime + 0.05);
    };
    window.addEventListener('keydown', click);
    return () => window.removeEventListener('keydown', click);
  }, [channels, ensureContext, mixerActive]);

  const playTrack = useCallback(async (track: SoundTrack) => {
    const audio = audioRef.current;
    if (!audio || !track.audioUrl) return;
    if (currentTrack?.id !== track.id) { audio.src = track.audioUrl; audio.currentTime = 0; setCurrentTrack(track); }
    await audio.play();
  }, [currentTrack?.id]);

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio?.src) return;
    if (audio.paused) await audio.play(); else audio.pause();
  }, []);
  const seek = useCallback((seconds: number) => { if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.duration || 0, Math.max(0, seconds)); }, []);
  const setVolume = useCallback((value: number) => setVolumeState(Math.min(100, Math.max(0, value))), []);
  const setPlaybackRate = useCallback((value: number) => setPlaybackRateState(value), []);
  const setPomodoroConfig = useCallback((changes: Partial<{ focusMinutes: number; breakMinutes: number; longBreakMinutes: number; cycles: number; autoStart: boolean; soundFollows: boolean }>) => {
    if (typeof changes.focusMinutes === 'number') { const value = Math.min(120, Math.max(5, changes.focusMinutes)); setPomodoroFocusMinutes(value); setPomodoroRemainingSeconds(value * 60); }
    if (typeof changes.breakMinutes === 'number') setPomodoroBreakMinutes(Math.min(30, Math.max(1, changes.breakMinutes)));
    if (typeof changes.longBreakMinutes === 'number') setPomodoroLongBreakMinutes(Math.min(60, Math.max(5, changes.longBreakMinutes)));
    if (typeof changes.cycles === 'number') setPomodoroCycles(Math.min(12, Math.max(1, changes.cycles)));
    if (typeof changes.autoStart === 'boolean') setPomodoroAutoStart(changes.autoStart);
    if (typeof changes.soundFollows === 'boolean') setSoundFollowsPomodoro(changes.soundFollows);
  }, []);
  const togglePomodoro = useCallback(() => setPomodoroRunning((running) => !running), []);
  const resetPomodoro = useCallback(() => { setPomodoroRunning(false); setPomodoroPhase('focus'); setPomodoroRemainingSeconds(pomodoroFocusMinutes * 60); setPomodoroCompletedCycles(0); }, [pomodoroFocusMinutes]);
  const toggleMixer = useCallback(async () => {
    if (mixerActive) {
      Object.values(noiseNodesRef.current).forEach((node) => node?.source.stop()); noiseNodesRef.current = {}; setMixerActive(false);
      if (contextRef.current?.state === 'running') await contextRef.current.suspend();
    } else { await ensureContext(); setMixerActive(true); }
  }, [ensureContext, mixerActive]);
  const startMixer = useCallback(async () => { await ensureContext(); setMixerActive(true); }, [ensureContext]);
  const stopAll = useCallback(() => {
    audioRef.current?.pause();
    Object.values(noiseNodesRef.current).forEach((node) => node?.source.stop()); noiseNodesRef.current = {}; setMixerActive(false);
  }, []);

  const value = useMemo<SoundContextValue>(() => ({ currentTrack, playing, currentTime, duration, volume, playbackRate, channels, mixerActive, typingWpm, autoPauseOnTypingStop, typingInactivityThresholdMs, typingIdle, pomodoroPhase, pomodoroRemainingSeconds, pomodoroRunning, pomodoroCompletedCycles, pomodoroFocusMinutes, pomodoroBreakMinutes, pomodoroLongBreakMinutes, pomodoroCycles, pomodoroAutoStart, soundFollowsPomodoro, playTrack, togglePlayback, seek, setVolume, setPlaybackRate, setAutoPauseOnTypingStop, setTypingInactivityThresholdMs, setPomodoroConfig, togglePomodoro, resetPomodoro, updateChannel, toggleMixer, startMixer, stopAll }), [autoPauseOnTypingStop, channels, currentTime, currentTrack, duration, mixerActive, playTrack, playbackRate, playing, pomodoroAutoStart, pomodoroBreakMinutes, pomodoroCompletedCycles, pomodoroCycles, pomodoroFocusMinutes, pomodoroLongBreakMinutes, pomodoroPhase, pomodoroRemainingSeconds, pomodoroRunning, resetPomodoro, seek, setPlaybackRate, setPomodoroConfig, setVolume, soundFollowsPomodoro, startMixer, stopAll, toggleMixer, togglePlayback, togglePomodoro, typingIdle, typingInactivityThresholdMs, typingWpm, updateChannel, volume]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSound deve ser usado dentro de SoundProvider.');
  return context;
}
