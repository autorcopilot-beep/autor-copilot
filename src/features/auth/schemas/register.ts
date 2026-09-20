import { z } from 'zod';

import { passwordSchema } from './password';

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(2, 'Informe como você quer ser chamado.')
      .max(80, 'Use no máximo 80 caracteres.'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Informe um e-mail válido.')
      .max(254, 'O e-mail é muito longo.'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas precisam ser iguais.',
    path: ['confirmPassword'],
  });

export type RegisterField = keyof z.infer<typeof registerSchema>;

export type RegisterState = {
  status: 'idle' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<RegisterField, string[]>>;
};
