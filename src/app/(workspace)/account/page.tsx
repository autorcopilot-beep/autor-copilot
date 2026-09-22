import { CalendarDays, CheckCircle2, CircleDollarSign, Clock3, MailCheck, PenLine, ShieldCheck, UserRound } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { createClient } from '@/lib/supabase/server';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(value));
}

export default async function AccountOverviewPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect('/login?next=/account');

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, full_name, nickname, pen_name, writing_focus, experience_level, created_at, updated_at')
    .eq('id', userId)
    .single();
  if (!profile) redirect('/onboarding');

  const email = typeof claimsData.claims.email === 'string' ? claimsData.claims.email : 'E-mail indisponível';
  const emailVerified = claimsData.claims.email_verified === true;
  const publicName = profile.pen_name || profile.nickname || profile.display_name;
  const initials = publicName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  const { data: profileExtras } = await supabase.from('profiles').select('username, avatar_path').eq('id', userId).maybeSingle();
  const username = profileExtras?.username || `usuario_${userId.replaceAll('-', '').slice(0, 10)}`;
  const { data: avatarData } = profileExtras?.avatar_path
    ? await supabase.storage.from('profile-avatars').createSignedUrl(profileExtras.avatar_path, 60 * 60)
    : { data: null };
  const cards = [
    { label: 'E-mail', value: email, note: emailVerified ? 'Endereço confirmado' : 'Confirmação pendente', icon: MailCheck },
    { label: 'Plano atual', value: 'Plano inicial', note: 'Gerenciamento em breve', icon: CircleDollarSign },
    { label: 'Conta criada em', value: formatDate(profile.created_at), note: 'Membro do Autor Copilot', icon: CalendarDays },
    { label: 'Última atualização', value: formatDate(profile.updated_at), note: 'Dados do perfil', icon: Clock3 },
  ];

  return (
    <div className="space-y-6">
      <section className="border-b border-line pb-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar className="size-16 ring-1 ring-line">{avatarData?.signedUrl && <AvatarImage src={avatarData.signedUrl} alt="" />}<AvatarFallback className="text-xl">{initials}</AvatarFallback></Avatar>
          <div className="min-w-0 flex-1"><p className="text-sm text-muted">Perfil do autor</p><h2 className="mt-1 truncate font-serif text-2xl font-semibold text-ink">{publicName}</h2><p className="mt-1 truncate text-sm text-muted">@{username} · {profile.full_name || profile.display_name}</p></div>
          <Link href="/account/profile" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control border border-accent bg-accent px-4 text-sm font-medium text-on-accent hover:bg-accent-hover"><UserRound className="size-4" />Editar perfil</Link>
        </div>
      </section>

      <section className="grid border-b border-line sm:grid-cols-2" aria-label="Resumo da conta">
        {cards.map(({ label, value, note, icon: Icon }, index) => <article key={label} className={`border-b border-line py-5 last:border-b-0 sm:px-5 ${index % 2 === 0 ? 'sm:border-r sm:pl-0' : 'sm:pr-0'} ${index >= 2 ? 'sm:border-b-0' : ''}`}><Icon className="size-5 text-accent" /><p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted">{label}</p><p className="mt-1 break-words font-medium text-ink">{value}</p><p className="mt-1 text-xs text-muted">{note}</p></article>)}
      </section>

      <section className="border-b border-line pb-6" aria-labelledby="account-readiness-title">
        <h2 id="account-readiness-title" className="font-serif text-xl font-semibold text-ink">Estado da conta</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-control bg-success-subtle p-4"><CheckCircle2 className="mt-0.5 size-4 text-success" /><div><p className="text-sm font-medium text-ink">Identidade</p><p className="mt-1 text-xs text-muted">Perfil criado e ativo.</p></div></div>
          <div className="flex items-start gap-3 rounded-control bg-success-subtle p-4"><PenLine className="mt-0.5 size-4 text-success" /><div><p className="text-sm font-medium text-ink">Onboarding</p><p className="mt-1 text-xs text-muted">Preferências iniciais concluídas.</p></div></div>
          <div className="flex items-start gap-3 rounded-control bg-success-subtle p-4"><ShieldCheck className="mt-0.5 size-4 text-success" /><div><p className="text-sm font-medium text-ink">Proteção</p><p className="mt-1 text-xs text-muted">Acesso protegido pelo Supabase.</p></div></div>
        </div>
      </section>
    </div>
  );
}
