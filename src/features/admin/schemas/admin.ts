import { z } from 'zod';

import { adminRoles } from '@/features/admin/rbac';

export const createAdminSchema = z.object({
  displayName: z.string().trim().min(2, 'Informe o nome do administrador.').max(120),
  email: z.string().trim().toLowerCase().email('Informe um e-mail válido.').max(254),
  role: z.enum(adminRoles).refine((role) => role !== 'master', {
    message: 'A função Master é reservada à conta raiz.',
  }),
});

export type CreateAdminState = {
  status: 'idle' | 'error' | 'success';
  message?: string;
  fieldErrors?: Partial<Record<'displayName' | 'email' | 'role', string[]>>;
};
