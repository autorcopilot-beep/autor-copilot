export type AudioTrackKind = 'ambient' | 'longform' | 'audiobook' | 'mixer_layer';
export type SpatialAudioMode = 'stereo' | 'binaural_hrtf' | 'surround_simulated';

export type SoundTrack = {
  id: string;
  title: string;
  subtitle: string;
  authorName: string;
  kind: AudioTrackKind;
  description: string;
  audioUrl: string;
  coverUrl: string;
  durationSeconds: number;
  samplingRateHz: number;
  formatEncoding: string;
  spatialMode: SpatialAudioMode;
  mentalRhythmBpm: number;
  tags: string[];
  listenCount: number;
  isFeatured: boolean;
  genre: string;
  mood: string;
  catalogSlug: string;
  energyLevel: number;
  waveformPeaks: number[];
  transcript: Array<{ word: string; startTimeMs: number; endTimeMs: number; confidenceScore: number }>;
};

export type MixerChannelId =
  | 'pink_noise'
  | 'brown_noise'
  | 'rain_glass'
  | 'ocean_tide'
  | 'fireplace'
  | 'forest_night'
  | 'cafe_room'
  | 'night_train'
  | 'typewriter_keys';
export type MixerChannel = { id: MixerChannelId; label: string; volumePercent: number; syncWithTypingWpm: boolean; active: boolean };

export type SoundPreset = {
  id: string;
  title: string;
  description: string;
  mood: string;
  durationLabel: string;
  genre: string;
  bpm: number;
  coverUrl: string;
  channels: Partial<Record<MixerChannelId, number>>;
};
