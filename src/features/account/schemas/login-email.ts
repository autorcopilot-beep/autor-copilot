import { z } from 'zod';

export const loginEmailSchema = z.object({
  email: z.email('Informe um endereço de e-mail válido.').trim().toLowerCase(),
});

export type LoginEmailState = {
  status: 'idle' | 'error';
  message?: string;
  fieldErrors?: { email?: string[] };
};
