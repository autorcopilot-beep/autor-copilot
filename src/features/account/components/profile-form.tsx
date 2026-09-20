'use client';

import { Check, LoaderCircle, Pencil, X } from 'lucide-react';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button, Checkbox, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { updateIdentityProfile, updateRegionProfile, updateWritingProfile } from '@/features/account/actions/update-profile';
import { AvatarEditor } from '@/features/account/components/avatar-editor';
import { genreOptions, type AccountProfileState } from '@/features/account/schemas/profile';
import { experienceOptions, writingFocusOptions } from '@/features/onboarding/schemas/profile';

export type ProfileValues = {
  fullName: string;
  nickname: string;
  username: string;
  penName: string;
  age: number | null;
  bio: string;
  writingFocus: string;
  experienceLevel: string;
  genres: string[];
  locale: string;
  countryCode: string;
  timezone: string;
};

type SavedSection = 'identity' | 'writing' | 'region';
const initialState: AccountProfileState = { status: 'idle' };
const localeLabels: Record<string, string> = { 'pt-BR': 'Português (Brasil)', 'en-US': 'English (US)', 'es-ES': 'Español' };
const countryLabels: Record<string, string> = { BR: 'Brasil', PT: 'Portugal', US: 'Estados Unidos' };
const timezoneLabels: Record<string, string> = {
  'America/Sao_Paulo': 'São Paulo (GMT−3)',
  'America/Manaus': 'Manaus (GMT−4)',
  'America/Recife': 'Recife (GMT−3)',
  'Europe/Lisbon': 'Lisboa',
  'America/New_York': 'Nova York',
};

function labelFor(options: ReadonlyArray<{ value: string; label: string }>, value: string) {
  return options.find((option) => option.value === value)?.label ?? 'Não informado';
}

function FieldError({ error, id }: { error?: string; id: string }) {
  return error ? <p id={id} className="mt-1.5 text-sm text-danger">{error}</p> : null;
}

function FormError({ state }: { state: AccountProfileState }) {
  return state.message ? <div className="mb-5 rounded-control border border-danger bg-danger-subtle px-4 py-3 text-sm text-ink" role="alert">{state.message}</div> : null;
}

function DisplayField({ label, value, wide = false }: { label: string; value?: string | number | null; wide?: boolean }) {
  const visibleValue = value === '' || value === null || value === undefined ? 'Não informado' : value;
  return <div className={wide ? 'sm:col-span-2' : ''}><dt className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">{label}</dt><dd className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-ink">{visibleValue}</dd></div>;
}

function EditButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <Button type="button" variant="ghost" size="icon" className="-mr-2 -mt-2" onClick={onClick} aria-label={`Editar ${label}`} title={`Editar ${label}`}><Pencil className="size-4" /></Button>;
}

function FormActions({ onDiscard }: { onDiscard: () => void }) {
  const { pending } = useFormStatus();
  return (
    <div className="mt-6 flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
      <Button type="button" variant="ghost" onClick={onDiscard} disabled={pending}><X className="size-4" />Descartar alterações</Button>
      <Button type="submit" disabled={pending}>{pending ? <><LoaderCircle className="size-4 animate-spin" />Salvando…</> : <><Check className="size-4" />Salvar alterações</>}</Button>
    </div>
  );
}

function SectionHeader({ id, title, description, editing, onEdit }: { id: string; title: string; description: string; editing: boolean; onEdit: () => void }) {
  return <div className="flex items-start gap-4"><div className="min-w-0 flex-1"><h2 id={id} className="font-serif text-xl font-semibold text-ink">{title}</h2><p className="mt-1 text-sm leading-relaxed text-muted">{description}</p></div>{!editing && <EditButton label={title.toLowerCase()} onClick={onEdit} />}</div>;
}

function IdentitySection({ values }: { values: ProfileValues }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction] = useActionState(updateIdentityProfile, initialState);

  return (
    <section className="border-b border-line pb-7" aria-labelledby="account-identity-title">
      <SectionHeader id="account-identity-title" title="Identidade" description="Dados usados na conta e nos seus espaços de escrita." editing={editing} onEdit={() => setEditing(true)} />
      {!editing ? (
        <dl className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <DisplayField label="Nome completo" value={values.fullName} />
          <DisplayField label="Como quer ser chamado" value={values.nickname} />
          <DisplayField label="Nome de usuário" value={`@${values.username}`} />
          <DisplayField label="Nome literário" value={values.penName} />
          <DisplayField label="Idade" value={values.age} />
          <DisplayField label="Biografia curta" value={values.bio} wide />
        </dl>
      ) : (
        <form action={formAction} className="mt-6" noValidate>
          <FormError state={state} />
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><Label htmlFor="fullName">Nome completo</Label><Input id="fullName" name="fullName" defaultValue={values.fullName} className="mt-2" maxLength={120} aria-invalid={Boolean(state.fieldErrors?.fullName)} required /><FieldError id="fullName-error" error={state.fieldErrors?.fullName?.[0]} /></div>
            <div><Label htmlFor="nickname">Como quer ser chamado</Label><Input id="nickname" name="nickname" defaultValue={values.nickname} className="mt-2" maxLength={40} aria-invalid={Boolean(state.fieldErrors?.nickname)} required /><FieldError id="nickname-error" error={state.fieldErrors?.nickname?.[0]} /></div>
            <div><Label htmlFor="username">Nome de usuário</Label><div className="relative mt-2"><span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">@</span><Input id="username" name="username" defaultValue={values.username} className="pl-8" minLength={3} maxLength={24} autoCapitalize="none" autoCorrect="off" spellCheck={false} aria-invalid={Boolean(state.fieldErrors?.username)} required /></div><p className="mt-1.5 text-xs text-muted">Único, com letras minúsculas, números e underline.</p><FieldError id="username-error" error={state.fieldErrors?.username?.[0]} /></div>
            <div><Label htmlFor="penName">Nome literário</Label><Input id="penName" name="penName" defaultValue={values.penName} className="mt-2" maxLength={80} aria-invalid={Boolean(state.fieldErrors?.penName)} placeholder="Opcional" /><FieldError id="penName-error" error={state.fieldErrors?.penName?.[0]} /></div>
            <div><Label htmlFor="age">Idade</Label><Input id="age" name="age" type="number" min={13} max={120} defaultValue={values.age ?? undefined} className="mt-2" aria-invalid={Boolean(state.fieldErrors?.age)} required /><FieldError id="age-error" error={state.fieldErrors?.age?.[0]} /></div>
            <div className="sm:col-span-2"><Label htmlFor="bio">Biografia curta</Label><textarea id="bio" name="bio" defaultValue={values.bio} maxLength={500} rows={4} className="mt-2 w-full resize-y rounded-control border border-line-strong bg-surface px-3.5 py-3 text-sm text-ink shadow-sm outline-none transition-colors placeholder:text-muted hover:border-accent focus:border-focus focus:ring-1 focus:ring-focus" placeholder="Conte um pouco sobre sua escrita." /><div className="mt-1 flex justify-between gap-3 text-xs text-muted"><FieldError id="bio-error" error={state.fieldErrors?.bio?.[0]} /><span className="ml-auto">Máximo de 500 caracteres</span></div></div>
          </div>
          <FormActions onDiscard={() => setEditing(false)} />
        </form>
      )}
    </section>
  );
}

function WritingSection({ values }: { values: ProfileValues }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction] = useActionState(updateWritingProfile, initialState);
  const genres = values.genres.map((value) => labelFor(genreOptions, value)).join(', ');

  return (
    <section className="border-b border-line pb-7" aria-labelledby="account-writing-title">
      <SectionHeader id="account-writing-title" title="Perfil de escrita" description="Contexto editorial usado para personalizar sua experiência." editing={editing} onEdit={() => setEditing(true)} />
      {!editing ? (
        <dl className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <DisplayField label="Formato principal" value={labelFor(writingFocusOptions, values.writingFocus)} />
          <DisplayField label="Experiência" value={labelFor(experienceOptions, values.experienceLevel)} />
          <DisplayField label="Gêneros de interesse" value={genres} wide />
        </dl>
      ) : (
        <form action={formAction} className="mt-6" noValidate>
          <FormError state={state} />
          <div className="grid gap-5 sm:grid-cols-2">
            <div><Label htmlFor="writingFocus">Formato principal</Label><Select name="writingFocus" defaultValue={values.writingFocus}><SelectTrigger id="writingFocus" className="mt-2"><SelectValue placeholder="Escolha um formato" /></SelectTrigger><SelectContent>{writingFocusOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></div>
            <div><Label htmlFor="experienceLevel">Experiência</Label><Select name="experienceLevel" defaultValue={values.experienceLevel}><SelectTrigger id="experienceLevel" className="mt-2"><SelectValue placeholder="Escolha sua experiência" /></SelectTrigger><SelectContent>{experienceOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></div>
            <fieldset className="sm:col-span-2"><legend className="text-sm font-medium text-ink">Gêneros de interesse</legend><div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{genreOptions.map((genre) => <label key={genre.value} htmlFor={`genre-${genre.value}`} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-control border border-line px-3 text-sm text-ink transition-colors hover:border-accent hover:bg-surface-muted"><Checkbox id={`genre-${genre.value}`} name="genres" value={genre.value} defaultChecked={values.genres.includes(genre.value)} />{genre.label}</label>)}</div><FieldError id="genres-error" error={state.fieldErrors?.genres?.[0]} /></fieldset>
          </div>
          <FormActions onDiscard={() => setEditing(false)} />
        </form>
      )}
    </section>
  );
}

function RegionSection({ values }: { values: ProfileValues }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction] = useActionState(updateRegionProfile, initialState);

  return (
    <section className="border-b border-line pb-7" aria-labelledby="account-region-title">
      <SectionHeader id="account-region-title" title="Idioma e região" description="Ajustes usados em datas, horários e textos do sistema." editing={editing} onEdit={() => setEditing(true)} />
      {!editing ? (
        <dl className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-3">
          <DisplayField label="Idioma" value={localeLabels[values.locale]} />
          <DisplayField label="País" value={countryLabels[values.countryCode]} />
          <DisplayField label="Fuso horário" value={timezoneLabels[values.timezone]} />
        </dl>
      ) : (
        <form action={formAction} className="mt-6" noValidate>
          <FormError state={state} />
          <div className="grid gap-5 md:grid-cols-3">
            <div><Label htmlFor="locale">Idioma</Label><Select name="locale" defaultValue={values.locale}><SelectTrigger id="locale" className="mt-2"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pt-BR">Português (Brasil)</SelectItem><SelectItem value="en-US">English (US)</SelectItem><SelectItem value="es-ES">Español</SelectItem></SelectContent></Select></div>
            <div><Label htmlFor="countryCode">País</Label><Select name="countryCode" defaultValue={values.countryCode || 'unset'}><SelectTrigger id="countryCode" className="mt-2"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="unset">Não informado</SelectItem><SelectItem value="BR">Brasil</SelectItem><SelectItem value="PT">Portugal</SelectItem><SelectItem value="US">Estados Unidos</SelectItem></SelectContent></Select></div>
            <div><Label htmlFor="timezone">Fuso horário</Label><Select name="timezone" defaultValue={values.timezone}><SelectTrigger id="timezone" className="mt-2"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="America/Sao_Paulo">São Paulo (GMT−3)</SelectItem><SelectItem value="America/Manaus">Manaus (GMT−4)</SelectItem><SelectItem value="America/Recife">Recife (GMT−3)</SelectItem><SelectItem value="Europe/Lisbon">Lisboa</SelectItem><SelectItem value="America/New_York">Nova York</SelectItem></SelectContent></Select></div>
          </div>
          <FormActions onDiscard={() => setEditing(false)} />
        </form>
      )}
    </section>
  );
}

export function ProfileForm({ values, saved, avatarUrl }: { values: ProfileValues; saved?: SavedSection; avatarUrl?: string }) {
  const name = values.penName || values.nickname || values.fullName;
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  const savedLabels: Record<SavedSection, string> = { identity: 'Identidade atualizada.', writing: 'Perfil de escrita atualizado.', region: 'Idioma e região atualizados.' };

  return (
    <div className="space-y-5">
      {saved && <div className="flex items-center gap-3 rounded-control border border-success bg-success-subtle px-4 py-3 text-sm text-ink" role="status"><Check className="size-4 shrink-0 text-success" />{savedLabels[saved]}</div>}
      <section className="border-b border-line pb-7" aria-label="Foto do perfil"><AvatarEditor initialUrl={avatarUrl} initials={initials || 'AC'} /></section>
      <IdentitySection values={values} />
      <WritingSection values={values} />
      <RegionSection values={values} />
    </div>
  );
}
