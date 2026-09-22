'use server';

import { randomUUID } from 'node:crypto';

import { revalidatePath } from 'next/cache';

import { writeAdminAudit } from '@/features/admin/audit';
import { requireAdmin } from '@/features/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Json, TablesInsert } from '@/types/database.generated';

const audioMime = new Set(['audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/ogg', 'audio/wav', 'audio/flac']);
const imageMime = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
function safeFileName(name: string) { return name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(-120) || 'arquivo'; }
function list(value: FormDataEntryValue | null) { return String(value ?? '').split(',').map((item) => item.trim()).filter(Boolean).slice(0, 20); }

export async function createAudioTrack(formData: FormData) {
  const actor = await requireAdmin('features.manage');
  const id = String(formData.get('upload_id') ?? '');
  const audioPath = String(formData.get('audio_path') ?? '');
  const coverPath = String(formData.get('cover_path') ?? '');
  if (!id || !audioPath.startsWith(`${id}/`) || (coverPath && !coverPath.startsWith(`${id}/`))) throw new Error('Sessão de upload inválida.');
  let transcript: Json = [];
  const transcriptInput = String(formData.get('transcript') ?? '').trim();
  if (transcriptInput) {
    try { transcript = JSON.parse(transcriptInput) as Json; if (!Array.isArray(transcript)) throw new Error(); }
    catch { throw new Error('A transcrição deve ser um array JSON válido.'); }
  }
  let waveformPeaks: number[] = [];
  const waveformInput = String(formData.get('waveform_peaks') ?? '').trim();
  if (waveformInput) {
    try {
      const parsed = JSON.parse(waveformInput) as unknown;
      if (!Array.isArray(parsed) || parsed.length > 4000 || !parsed.every((peak) => typeof peak === 'number' && Number.isFinite(peak) && Math.abs(peak) <= 32767)) throw new Error();
      waveformPeaks = parsed.map((peak) => Math.round(peak as number));
    } catch { throw new Error('A forma de onda deve ser um array JSON de amplitudes entre -32767 e 32767.'); }
  }
  const supabase = createAdminClient();
  const { data: uploadedAudio } = await supabase.storage.from('sound-library').list(id, { search: audioPath.slice(id.length + 1), limit: 1 });
  if (!uploadedAudio?.some((item) => `${id}/${item.name}` === audioPath)) throw new Error('O arquivo de áudio não foi concluído.');
  const record: TablesInsert<'audio_tracks'> = {
    id, title: String(formData.get('title') ?? '').trim(), subtitle: String(formData.get('subtitle') ?? '').trim(),
    author_name: String(formData.get('author_name') ?? '').trim() || 'Autor Copilot Sound Lab',
    track_kind: String(formData.get('track_kind') ?? 'ambient') as 'ambient' | 'longform' | 'audiobook' | 'mixer_layer',
    description: String(formData.get('description') ?? '').trim(), audio_path: audioPath, cover_path: coverPath,
    duration_seconds: Math.max(0, Number(formData.get('duration_seconds') ?? 0)), sampling_rate_hz: Number(formData.get('sampling_rate_hz') ?? 48000),
    format_encoding: String(formData.get('format_encoding') ?? 'mp3'), spatial_mode: String(formData.get('spatial_mode') ?? 'stereo'),
    mental_rhythm_bpm: Math.min(180, Math.max(20, Number(formData.get('mental_rhythm_bpm') ?? 50))), tags: list(formData.get('tags')),
    transcript, waveform_peaks: waveformPeaks, license_name: String(formData.get('license_name') ?? '').trim() || 'Todos os direitos reservados',
    license_url: String(formData.get('license_url') ?? '').trim(), is_published: formData.get('is_published') === 'on',
    is_featured: formData.get('is_featured') === 'on', created_by: actor.userId,
  };
  const { error } = await supabase.from('audio_tracks').insert(record);
  if (error) { await Promise.all([supabase.storage.from('sound-library').remove([audioPath]), coverPath ? supabase.storage.from('sound-covers').remove([coverPath]) : Promise.resolve()]); throw new Error(error.message); }
  await writeAdminAudit({ actor, action: 'sound.track.created', targetType: 'audio_track', targetId: id, newData: record as unknown as Json });
  revalidatePath('/admin/sound'); revalidatePath('/sound');
}

export async function prepareAudioTrackUpload(input: { audioName: string; audioType: string; audioSize: number; coverName?: string; coverType?: string; coverSize?: number }) {
  await requireAdmin('features.manage');
  if (!audioMime.has(input.audioType) || input.audioSize <= 0 || input.audioSize > 262144000) throw new Error('O áudio deve ser MP3, AAC, OGG, WAV ou FLAC e ter até 250 MB.');
  if (input.coverSize && (!input.coverType || !imageMime.has(input.coverType) || input.coverSize > 10485760)) throw new Error('A capa deve ser JPG, PNG, WebP ou AVIF e ter até 10 MB.');
  const id = randomUUID();
  const audioPath = `${id}/${safeFileName(input.audioName)}`;
  const coverPath = input.coverSize && input.coverName ? `${id}/${safeFileName(input.coverName)}` : '';
  const supabase = createAdminClient();
  const [audio, cover] = await Promise.all([
    supabase.storage.from('sound-library').createSignedUploadUrl(audioPath),
    coverPath ? supabase.storage.from('sound-covers').createSignedUploadUrl(coverPath) : Promise.resolve({ data: null, error: null }),
  ]);
  if (audio.error || !audio.data) throw new Error(audio.error?.message ?? 'Não foi possível preparar o áudio.');
  if (cover.error || (coverPath && !cover.data)) throw new Error(cover.error?.message ?? 'Não foi possível preparar a capa.');
  return {
    id, audioPath, audioToken: audio.data.token, coverPath,
    coverToken: cover.data?.token ?? '',
  };
}

export async function updateAudioTrack(formData: FormData) {
  const actor = await requireAdmin('features.manage');
  const id = String(formData.get('id') ?? '');
  const supabase = createAdminClient();
  const { data: previous } = await supabase.from('audio_tracks').select('*').eq('id', id).maybeSingle();
  if (!previous) throw new Error('Faixa não encontrada.');
  const changes = { title: String(formData.get('title') ?? '').trim(), tags: list(formData.get('tags')), is_published: formData.get('is_published') === 'on', is_featured: formData.get('is_featured') === 'on' };
  const { error } = await supabase.from('audio_tracks').update(changes).eq('id', id);
  if (error) throw new Error(error.message);
  await writeAdminAudit({ actor, action: 'sound.track.updated', targetType: 'audio_track', targetId: id, oldData: previous as unknown as Json, newData: changes as unknown as Json });
  revalidatePath('/admin/sound'); revalidatePath('/sound');
}

export async function deleteAudioTrack(formData: FormData) {
  const actor = await requireAdmin('features.manage');
  const id = String(formData.get('id') ?? '');
  const supabase = createAdminClient();
  const { data: previous } = await supabase.from('audio_tracks').select('*').eq('id', id).maybeSingle();
  if (!previous) return;
  const { error } = await supabase.from('audio_tracks').delete().eq('id', id);
  if (error) throw new Error(error.message);
  await Promise.all([previous.audio_path ? supabase.storage.from('sound-library').remove([previous.audio_path]) : Promise.resolve(), previous.cover_path ? supabase.storage.from('sound-covers').remove([previous.cover_path]) : Promise.resolve()]);
  await writeAdminAudit({ actor, action: 'sound.track.deleted', targetType: 'audio_track', targetId: id, oldData: previous as unknown as Json });
  revalidatePath('/admin/sound'); revalidatePath('/sound');
}
