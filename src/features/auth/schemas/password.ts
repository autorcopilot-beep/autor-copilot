import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Use pelo menos 8 caracteres.')
  .max(72, 'Use no máximo 72 caracteres.')
  .regex(/[A-Za-zÀ-ÿ]/, 'Inclua pelo menos uma letra.')
  .regex(/[0-9]/, 'Inclua pelo menos um número.');

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Informe um e-mail válido.')
    .max(254, 'O e-mail é muito longo.'),
});

export type ForgotPasswordState = {
  status: 'idle' | 'error' | 'success';
  message?: string;
  fieldErrors?: { email?: string[] };
  email?: string;
};

export const updatePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas precisam ser iguais.',
    path: ['confirmPassword'],
  });

export type UpdatePasswordField = 'password' | 'confirmPassword';

export type UpdatePasswordState = {
  status: 'idle' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<UpdatePasswordField, string[]>>;
};
