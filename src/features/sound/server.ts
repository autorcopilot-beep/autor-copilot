import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';

import type { SoundTrack, SpatialAudioMode } from '@/features/sound/types';
import type { Database } from '@/types/database.generated';

export async function loadSoundLibrary(supabase: SupabaseClient<Database>): Promise<SoundTrack[]> {
  const { data, error } = await supabase.from('audio_tracks').select('*').eq('is_published', true).order('is_featured', { ascending: false }).order('updated_at', { ascending: false });
  if (error?.code === 'PGRST205') return [];
  if (error) throw error;
  return Promise.all((data ?? []).map(async (track) => {
    const [audio, cover] = await Promise.all([
      track.audio_path ? supabase.storage.from('sound-library').createSignedUrl(track.audio_path, 60 * 60 * 6) : Promise.resolve({ data: null }),
      track.cover_path ? supabase.storage.from('sound-covers').createSignedUrl(track.cover_path, 60 * 60 * 6) : Promise.resolve({ data: null }),
    ]);
    return {
      id: track.id, title: track.title, subtitle: track.subtitle, authorName: track.author_name,
      kind: track.track_kind, description: track.description, audioUrl: audio.data?.signedUrl ?? '',
      coverUrl: cover.data?.signedUrl ?? '', durationSeconds: track.duration_seconds,
      samplingRateHz: track.sampling_rate_hz, formatEncoding: track.format_encoding,
      spatialMode: track.spatial_mode as SpatialAudioMode, mentalRhythmBpm: track.mental_rhythm_bpm,
      tags: track.tags, listenCount: track.listen_count, isFeatured: track.is_featured,
      waveformPeaks: track.waveform_peaks,
      transcript: Array.isArray(track.transcript) ? track.transcript.flatMap((item) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
        const word = typeof item.word === 'string' ? item.word : '';
        const startTimeMs = typeof item.startTimeMs === 'number' ? item.startTimeMs : 0;
        const endTimeMs = typeof item.endTimeMs === 'number' ? item.endTimeMs : startTimeMs;
        const confidenceScore = typeof item.confidenceScore === 'number' ? item.confidenceScore : 0;
        return word ? [{ word, startTimeMs, endTimeMs, confidenceScore }] : [];
      }) : [],
    } satisfies SoundTrack;
  }));
}
