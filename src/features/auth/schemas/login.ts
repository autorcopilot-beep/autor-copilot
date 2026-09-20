import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Informe um e-mail válido.')
    .max(254, 'O e-mail é muito longo.'),
  password: z
    .string()
    .min(1, 'Informe sua senha.')
    .max(72, 'A senha é muito longa.'),
  next: z.string().optional(),
});

export type LoginField = 'email' | 'password';

export type LoginState = {
  status: 'idle' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<LoginField, string[]>>;
  email?: string;
};
