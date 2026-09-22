import { z } from 'zod';

import { passwordSchema } from './password';

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, 'Informe seu nome completo.')
      .max(120, 'Use no máximo 120 caracteres.')
      .refine((value) => value.split(/\s+/).length >= 2, 'Informe nome e sobrenome.'),
    age: z.coerce
      .number({ message: 'Informe sua idade.' })
      .int('Informe uma idade válida.')
      .min(13, 'É preciso ter pelo menos 13 anos.')
      .max(120, 'Informe uma idade válida.'),
    nickname: z
      .string()
      .trim()
      .min(2, 'Informe como você prefere ser chamado.')
      .max(40, 'Use no máximo 40 caracteres.'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Informe um e-mail válido.')
      .max(254, 'O e-mail é muito longo.'),
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, { message: 'Aceite os Termos de Uso para continuar.' }),
    acceptPrivacy: z.literal(true, { message: 'Aceite a Política de Privacidade para continuar.' }),
    acceptCommunications: z.boolean(),
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
