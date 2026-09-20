'use server';

import { revalidatePath } from 'next/cache';

import { writeAdminAudit } from '@/features/admin/audit';
import { requireAdmin } from '@/features/admin/auth';
import { createAdminSchema, type CreateAdminState } from '@/features/admin/schemas/admin';
import { getSiteUrl } from '@/config/env';
import { createAdminClient } from '@/lib/supabase/admin';

export async function createAdministrativeUser(
  _previousState: CreateAdminState,
  formData: FormData,
): Promise<CreateAdminState> {
  const actor = await requireAdmin('admins.manage');
  const parsed = createAdminSchema.safeParse({
    displayName: formData.get('displayName'),
    email: formData.get('email'),
    role: formData.get('role'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Revise os campos destacados.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const adminClient = createAdminClient();
  const { data: invitation, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
    parsed.data.email,
    {
      data: { display_name: parsed.data.displayName },
      redirectTo: `${getSiteUrl()}/auth/callback?next=/admin`,
    },
  );

  if (inviteError || !invitation.user) {
    return {
      status: 'error',
      message: inviteError?.message.includes('already')
        ? 'Já existe uma conta com este e-mail.'
        : 'Não foi possível enviar o convite administrativo.',
    };
  }

  const userId = invitation.user.id;
  const account = {
    user_id: userId,
    display_name: parsed.data.displayName,
    email: parsed.data.email,
    role: parsed.data.role,
    is_master: false,
    status: 'active' as const,
    created_by: actor.userId,
  };
  const { error: accountError } = await adminClient.from('admin_accounts').insert(account);

  if (accountError) {
    await adminClient.auth.admin.deleteUser(userId);
    return { status: 'error', message: 'O convite foi cancelado porque o perfil administrativo não pôde ser criado.' };
  }

  try {
    await writeAdminAudit({
      actor,
      action: 'admin.account.invited',
      targetType: 'admin_account',
      targetId: userId,
      newData: {
        display_name: account.display_name,
        email: account.email,
        role: account.role,
        status: account.status,
      },
    });
  } catch {
    await adminClient.auth.admin.deleteUser(userId);
    return { status: 'error', message: 'O convite foi cancelado porque a auditoria obrigatória não pôde ser registrada.' };
  }

  revalidatePath('/admin/admins');
  return { status: 'success', message: `Convite enviado para ${parsed.data.email}.` };
}
