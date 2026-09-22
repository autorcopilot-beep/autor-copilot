import { Disc3, Music2, Save, Trash2, Upload } from 'lucide-react';

import { PendingSubmitButton } from '@/components/ui';
import { deleteAudioTrack, updateAudioTrack } from '@/features/admin/actions/sound-library';
import { requireAdmin } from '@/features/admin/auth';
import { SoundUploadForm } from '@/features/admin/components/sound-upload-form';
import { createAdminClient } from '@/lib/supabase/admin';

const field = 'mt-1.5 min-h-10 w-full rounded-control border border-white/10 bg-black/25 px-3 text-sm text-white placeholder:text-white/20';

export default async function AdminSoundPage() {
  await requireAdmin('features.read');
  const supabase = createAdminClient();
  const { data: tracks, error } = await supabase.from('audio_tracks').select('*').order('updated_at', { ascending: false });
  return <div><p className="text-xs uppercase tracking-[.2em] text-emerald-300">Media & Sound</p><h1 className="mt-2 text-3xl font-semibold">Catálogo sonoro</h1><p className="mt-3 max-w-3xl text-sm text-white/50">Faça upload de faixas autorais, capas e provas de audiolivro. A publicação define o que usuários licenciados encontram no menu Som do ambiente de escrita.</p>
    <section className="mt-7 rounded-card border border-emerald-400/15 bg-emerald-400/[.04] p-5"><div className="flex items-start gap-3"><span className="flex size-10 items-center justify-center rounded-control bg-emerald-400/10 text-emerald-300"><Upload className="size-5" /></span><div><h2 className="font-medium">Publicar nova faixa</h2><p className="mt-1 text-sm text-white/45">Até 250 MB por áudio. Use apenas conteúdo com licença válida.</p></div></div>
      <SoundUploadForm />
    </section>
    {error ? <p className="mt-7 rounded-control border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">A migration do Media & Sound ainda não está disponível: {error.message}</p> : <section className="mt-7"><div className="flex items-end justify-between"><div><p className="text-xs uppercase tracking-[.16em] text-emerald-300">Biblioteca</p><h2 className="mt-1 text-xl font-semibold">{tracks?.length ?? 0} faixas</h2></div><Music2 className="size-5 text-white/35" /></div><div className="mt-4 space-y-3">{tracks?.map((track) => <div key={track.id} className="rounded-card border border-white/10 bg-white/[.035] p-4"><form action={updateAudioTrack} className="flex flex-col gap-3 lg:flex-row lg:items-center"><input type="hidden" name="id" value={track.id} /><Disc3 className="size-5 shrink-0 text-emerald-300" /><input name="title" defaultValue={track.title} required className={`${field} mt-0 flex-1`} /><input name="genre" defaultValue={track.genre} aria-label="Gênero" className={`${field} mt-0 lg:max-w-36`} /><input name="tags" defaultValue={track.tags.join(', ')} className={`${field} mt-0 lg:max-w-xs`} /><label className="flex items-center gap-2 text-xs text-white/60"><input type="checkbox" name="is_featured" defaultChecked={track.is_featured} />Destaque</label><label className="flex items-center gap-2 text-xs text-white/60"><input type="checkbox" name="is_published" defaultChecked={track.is_published} />Publicada</label><PendingSubmitButton pendingLabel="Salvando…" className="min-h-10 rounded-control bg-emerald-600 px-3 text-xs font-medium"><Save className="size-4" />Salvar</PendingSubmitButton></form><div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-white/35"><span>{track.genre} · {track.track_kind} · {track.sampling_rate_hz / 1000} kHz · {track.duration_seconds}s · {track.listen_count} reproduções</span><form action={deleteAudioTrack}><input type="hidden" name="id" value={track.id} /><PendingSubmitButton pendingLabel="Excluindo…" className="text-red-300 hover:text-red-200"><Trash2 className="size-3.5" />Excluir</PendingSubmitButton></form></div></div>)}</div></section>}
  </div>;
}
