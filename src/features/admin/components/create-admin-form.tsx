'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { LoaderCircle, Send } from 'lucide-react';

import { Button, Input, Label } from '@/components/ui';
import { createAdministrativeUser } from '@/features/admin/actions/create-admin';
import { adminRoleLabels, adminRoles } from '@/features/admin/rbac';
import type { CreateAdminState } from '@/features/admin/schemas/admin';

const initialState: CreateAdminState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="wide" disabled={pending}>
      {pending ? <><LoaderCircle className="size-4 animate-spin" aria-hidden="true" />Criando convite…</> : <><Send className="size-4" aria-hidden="true" />Enviar convite</>}
    </Button>
  );
}

export function CreateAdminForm() {
  const [state, formAction] = useActionState(createAdministrativeUser, initialState);
  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.message && (
        <div className={`rounded-control border px-4 py-3 text-sm ${state.status === 'success' ? 'border-success bg-success-subtle text-ink' : 'border-danger bg-danger-subtle text-ink'}`} role={state.status === 'success' ? 'status' : 'alert'}>
          {state.message}
        </div>
      )}
      <div>
        <Label htmlFor="displayName">Nome</Label>
        <Input id="displayName" name="displayName" className="mt-2" maxLength={120} aria-invalid={Boolean(state.fieldErrors?.displayName)} required />
        {state.fieldErrors?.displayName?.[0] && <p className="mt-1 text-xs text-danger">{state.fieldErrors.displayName[0]}</p>}
      </div>
      <div>
        <Label htmlFor="adminInviteEmail">E-mail corporativo</Label>
        <Input id="adminInviteEmail" name="email" type="email" className="mt-2" maxLength={254} aria-invalid={Boolean(state.fieldErrors?.email)} required />
        {state.fieldErrors?.email?.[0] && <p className="mt-1 text-xs text-danger">{state.fieldErrors.email[0]}</p>}
      </div>
      <div>
        <Label htmlFor="role">Papel administrativo</Label>
        <select id="role" name="role" defaultValue="" className="mt-2 min-h-11 w-full rounded-control border border-line-strong bg-surface px-3.5 text-sm text-ink focus-visible:border-focus focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus" required>
          <option value="" disabled>Selecione um papel</option>
          {adminRoles.filter((role) => role !== 'master').map((role) => <option key={role} value={role}>{adminRoleLabels[role]}</option>)}
        </select>
        {state.fieldErrors?.role?.[0] && <p className="mt-1 text-xs text-danger">{state.fieldErrors.role[0]}</p>}
      </div>
      <p className="rounded-control border border-line bg-surface-muted px-4 py-3 text-xs leading-relaxed text-muted">O administrador receberá um convite por e-mail. A função Master não pode ser atribuída pela interface.</p>
      <div className="flex justify-end"><SubmitButton /></div>
    </form>
  );
}
