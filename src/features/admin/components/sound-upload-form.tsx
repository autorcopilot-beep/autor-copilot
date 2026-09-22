'use client';

import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { createAudioTrack, prepareAudioTrackUpload } from '@/features/admin/actions/sound-library';
import { createClient } from '@/lib/supabase/client';

const field = 'mt-1.5 min-h-10 w-full rounded-control border border-white/10 bg-black/25 px-3 text-sm text-white placeholder:text-white/20';

export function SoundUploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [phase, setPhase] = useState<'idle' | 'preparing' | 'audio' | 'cover' | 'publishing'>('idle');
  const [error, setError] = useState('');
  const busy = phase !== 'idle';
  const phaseLabel = { idle: 'Enviar faixa', preparing: 'Preparando upload…', audio: 'Enviando áudio…', cover: 'Enviando capa…', publishing: 'Publicando…' }[phase];

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const audioFile = formData.get('audio');
    const coverValue = formData.get('cover');
    const coverFile = coverValue instanceof File && coverValue.size ? coverValue : null;
    if (!(audioFile instanceof File) || !audioFile.size) { setError('Selecione um arquivo de áudio.'); return; }
    setError('');
    try {
      setPhase('preparing');
      const upload = await prepareAudioTrackUpload({
        audioName: audioFile.name, audioType: audioFile.type, audioSize: audioFile.size,
        coverName: coverFile?.name, coverType: coverFile?.type, coverSize: coverFile?.size,
      });
      const supabase = createClient();
      setPhase('audio');
      const audioResult = await supabase.storage.from('sound-library').uploadToSignedUrl(upload.audioPath, upload.audioToken, audioFile, { contentType: audioFile.type });
      if (audioResult.error) throw audioResult.error;
      if (coverFile && upload.coverPath && upload.coverToken) {
        setPhase('cover');
        const coverResult = await supabase.storage.from('sound-covers').uploadToSignedUrl(upload.coverPath, upload.coverToken, coverFile, { contentType: coverFile.type });
        if (coverResult.error) throw coverResult.error;
      }
      setPhase('publishing');
      formData.delete('audio'); formData.delete('cover');
      formData.set('upload_id', upload.id); formData.set('audio_path', upload.audioPath); formData.set('cover_path', upload.coverPath);
      await createAudioTrack(formData);
      formRef.current?.reset();
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível publicar a faixa.');
    } finally { setPhase('idle'); }
  }

  return <form ref={formRef} onSubmit={submit} className="mt-5 grid gap-4">
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><label className="text-xs text-white/55">Título<input name="title" required maxLength={160} className={field} /></label><label className="text-xs text-white/55">Subtítulo<input name="subtitle" maxLength={200} className={field} /></label><label className="text-xs text-white/55">Autor / estúdio<input name="author_name" defaultValue="Autor Copilot Sound Lab" className={field} /></label><label className="text-xs text-white/55">Tipo<select name="track_kind" className={field}><option value="ambient">Ambiência</option><option value="longform">Longa duração</option><option value="audiobook">Audiolivro</option><option value="mixer_layer">Camada de mixer</option></select></label></div>
    <label className="text-xs text-white/55">Descrição<textarea name="description" rows={3} maxLength={5000} className={`${field} py-2`} /></label>
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><label className="text-xs text-white/55">Arquivo de áudio<input name="audio" type="file" required accept="audio/mpeg,audio/mp4,audio/aac,audio/ogg,audio/wav,audio/flac,.flac" className={`${field} py-2`} /></label><label className="text-xs text-white/55">Capa opcional<input name="cover" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className={`${field} py-2`} /></label><label className="text-xs text-white/55">Duração em segundos<input name="duration_seconds" type="number" min={0} max={86400} required className={field} /></label><label className="text-xs text-white/55">Tags<input name="tags" placeholder="chuva, foco, fantasia" className={field} /></label></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"><label className="text-xs text-white/55">Amostragem<select name="sampling_rate_hz" defaultValue="48000" className={field}><option value="44100">44,1 kHz</option><option value="48000">48 kHz</option><option value="96000">96 kHz</option></select></label><label className="text-xs text-white/55">Formato<select name="format_encoding" defaultValue="mp3" className={field}><option value="mp3">MP3</option><option value="aac">AAC</option><option value="opus">Opus</option><option value="flac_24bit">FLAC 24-bit</option><option value="wav">WAV</option></select></label><label className="text-xs text-white/55">Espacialização<select name="spatial_mode" className={field}><option value="stereo">Estéreo</option><option value="binaural_hrtf">Binaural HRTF</option><option value="surround_simulated">Surround simulado</option></select></label><label className="text-xs text-white/55">Ritmo mental BPM<input name="mental_rhythm_bpm" type="number" min={20} max={180} defaultValue={50} className={field} /></label><label className="text-xs text-white/55">Licença<input name="license_name" defaultValue="Todos os direitos reservados" className={field} /></label></div>
    <div className="grid gap-3 md:grid-cols-3"><label className="text-xs text-white/55">URL da licença<input name="license_url" type="url" placeholder="https://…" className={field} /></label><label className="text-xs text-white/55">Forma de onda JSON opcional<textarea name="waveform_peaks" rows={3} placeholder="[120, 830, -410, 1500]" className={`${field} py-2 font-mono text-[11px]`} /></label><label className="text-xs text-white/55">Transcrição JSON opcional<textarea name="transcript" rows={3} placeholder='[{"word":"A","startTimeMs":0,"endTimeMs":200,"confidenceScore":0.99}]' className={`${field} py-2 font-mono text-[11px]`} /></label></div>
    {error && <p role="alert" className="rounded-control border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-100">{error}</p>}
    <div className="flex flex-wrap items-center justify-end gap-4"><label className="flex items-center gap-2 text-xs text-white/65"><input type="checkbox" name="is_featured" />Destaque</label><label className="flex items-center gap-2 text-xs text-white/65"><input type="checkbox" name="is_published" />Publicar agora</label><button type="submit" disabled={busy} className="inline-flex min-h-10 items-center gap-2 rounded-control bg-emerald-600 px-4 text-sm font-medium hover:bg-emerald-500 disabled:cursor-wait disabled:opacity-65"><Upload className={busy ? 'size-4 animate-pulse' : 'size-4'} />{phaseLabel}</button></div>
  </form>;
}
