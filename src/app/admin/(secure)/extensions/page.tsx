import { Film, KeyRound, PackageCheck, Save } from 'lucide-react';

import { PendingSubmitButton } from '@/components/ui';
import { updateExtensionControl, updateExtensionEntitlement } from '@/features/admin/actions/product-controls';
import { requireAdmin } from '@/features/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';

const fieldClass = 'mt-1.5 min-h-10 w-full rounded-control border border-white/10 bg-black/25 px-3 text-white';

export default async function AdminExtensionsPage() {
  await requireAdmin('features.read');
  const supabase = createAdminClient();
  const [{ data: extensions, error }, { data: entitlements, error: entitlementError }] = await Promise.all([
    supabase.from('extension_catalog').select('*').order('name'),
    supabase.from('user_extension_entitlements').select('*').order('updated_at', { ascending: false }).limit(12),
  ]);

  return <div>
    <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Produto e monetização</p>
    <h1 className="mt-2 text-3xl font-semibold">Marketplace do Lab</h1>
    <p className="mt-3 max-w-3xl text-sm text-white/50">Organize extensões, plugins e conectores; controle publicação, preço, mídia demonstrativa, grupos elegíveis e licenças.</p>

    {!error && <section className="mt-7 rounded-card border border-emerald-400/15 bg-emerald-400/[0.04] p-5">
      <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-emerald-400/10 text-emerald-300"><KeyRound className="size-5" /></span><div><h2 className="font-medium">Conceder ou revogar licença</h2><p className="mt-1 text-sm text-white/45">Compras e assinaturas devem chegar pela integração de cobrança. Use este formulário para concessões administrativas, planos e promoções.</p></div></div>
      <form action={updateExtensionEntitlement} className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_1.2fr_.8fr_.8fr_1fr_auto] xl:items-end">
        <label className="text-xs text-white/55">UUID do usuário<input name="user_id" required placeholder="00000000-0000-0000-0000-000000000000" className={`${fieldClass} placeholder:text-white/20`} /></label>
        <label className="text-xs text-white/55">Item<select name="extension_id" required className={fieldClass}>{(extensions ?? []).map((extension) => <option key={extension.id} value={extension.id}>{extension.name}</option>)}</select></label>
        <label className="text-xs text-white/55">Status<select name="status" defaultValue="active" className={fieldClass}><option value="active">Ativa</option><option value="pending">Pendente</option><option value="expired">Expirada</option><option value="revoked">Revogada</option></select></label>
        <label className="text-xs text-white/55">Origem<select name="source" defaultValue="admin" className={fieldClass}><option value="admin">Admin</option><option value="purchase">Compra</option><option value="subscription">Assinatura</option><option value="plan">Plano</option><option value="promotion">Promoção</option></select></label>
        <label className="text-xs text-white/55">Validade opcional<input name="ends_at" type="datetime-local" className={fieldClass} /></label>
        <PendingSubmitButton pendingLabel="Salvando licença…" className="min-h-10 rounded-control bg-emerald-600 px-4 text-sm font-medium hover:bg-emerald-500"><KeyRound className="size-4" />Salvar licença</PendingSubmitButton>
      </form>
      {entitlementError ? <p className="mt-4 text-xs text-amber-200">Aplique as migrations para habilitar a gestão de licenças.</p> : Boolean(entitlements?.length) && <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[42rem] text-left text-xs"><thead className="text-white/35"><tr><th className="pb-2 font-medium">Usuário</th><th className="pb-2 font-medium">Item</th><th className="pb-2 font-medium">Origem</th><th className="pb-2 font-medium">Status</th><th className="pb-2 font-medium">Validade</th></tr></thead><tbody>{entitlements?.map((item) => <tr key={`${item.user_id}:${item.extension_id}`} className="border-t border-white/5"><td className="py-2 font-mono text-[10px] text-white/55">{item.user_id}</td><td className="py-2 text-white/70">{item.extension_id}</td><td className="py-2 text-white/50">{item.source}</td><td className="py-2 text-white/70">{item.status}</td><td className="py-2 text-white/50">{item.ends_at ? new Date(item.ends_at).toLocaleDateString('pt-BR') : 'Sem expiração'}</td></tr>)}</tbody></table></div>}
    </section>}

    {error ? <div className="mt-7 rounded-control border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">As tabelas administrativas ainda não existem no Supabase conectado. Autentique a CLI e execute <code className="rounded bg-black/20 px-1.5 py-0.5">npx supabase db push</code>. {error.message}</div> : <div className="mt-7 space-y-4">{(extensions ?? []).map((extension) => <form key={extension.id} action={updateExtensionControl} className="rounded-card border border-white/10 bg-white/[0.035] p-5">
      <input type="hidden" name="id" value={extension.id} />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-emerald-400/10 text-emerald-300"><PackageCheck className="size-5" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h2 className="font-medium">{extension.name}</h2><code className="text-[10px] text-white/35">{extension.id}</code></div>
          <p className="mt-1 text-sm text-white/45">{extension.description}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <label className="text-xs text-white/55">Seção<select name="product_kind" defaultValue={extension.product_kind} className={fieldClass}><option value="extension">Extensão</option><option value="plugin">Plugin</option><option value="connector">Conector</option></select></label>
            <label className="text-xs text-white/55">Modelo de preço<select name="price_model" defaultValue={extension.price_model} className={fieldClass}><option value="free">Gratuito</option><option value="pro_included">Incluso no Pro</option><option value="one_time">Compra única</option><option value="subscription">Assinatura</option></select></label>
            <label className="text-xs text-white/55">Preço em centavos<input name="price_cents" type="number" min="0" defaultValue={extension.price_cents} className={fieldClass} /></label>
            <label className="text-xs text-white/55">Grupos permitidos<input name="allowed_groups" defaultValue={extension.allowed_groups.join(', ')} className={fieldClass} /></label>
            <label className="text-xs text-white/55">Tags<input name="tags" defaultValue={extension.tags.join(', ')} className={fieldClass} /></label>
          </div>
          <div className="mt-4 grid gap-3 rounded-control border border-white/5 bg-black/10 p-3 sm:grid-cols-[12rem_1fr]">
            <label className="text-xs text-white/55"><span className="flex items-center gap-1.5"><Film className="size-3.5" />Mídia no Drawer</span><select name="media_type" defaultValue={extension.media_type} className={fieldClass}><option value="none">Sem mídia</option><option value="gif">GIF animado</option><option value="mp4">Vídeo MP4</option></select></label>
            <label className="text-xs text-white/55">URL pública ou caminho em /public<input name="media_url" type="text" defaultValue={extension.media_url} placeholder="https://…/demo.mp4 ou /extensions/demo.gif" className={`${fieldClass} placeholder:text-white/20`} /></label>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3"><label className="flex items-center gap-2 text-xs text-white/65"><input type="checkbox" name="is_published" defaultChecked={extension.is_published} />Publicada</label><label className="flex items-center gap-2 text-xs text-white/65"><input type="checkbox" name="is_featured" defaultChecked={extension.is_featured} />Destaque</label><PendingSubmitButton pendingLabel="Salvando…" className="min-h-10 rounded-control bg-emerald-600 px-3 text-sm font-medium hover:bg-emerald-500"><Save className="size-4" />Salvar</PendingSubmitButton></div>
      </div>
    </form>)}</div>}
  </div>;
}
