import { z } from 'zod';

const supabaseEnvSchema = z.object({
  url: z.url('NEXT_PUBLIC_SUPABASE_URL deve ser uma URL válida.'),
  publishableKey: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY é obrigatória.'),
});

export type SupabaseEnv = z.infer<typeof supabaseEnvSchema>;

let cachedEnv: SupabaseEnv | undefined;

export function getSupabaseEnv(): SupabaseEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const result = supabaseEnvSchema.safeParse({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });

  if (!result.success) {
    const fields = result.error.issues
      .map((issue) => issue.path.join('.'))
      .filter(Boolean)
      .join(', ');

    throw new Error(
      `Configuração do Supabase ausente ou inválida${fields ? `: ${fields}` : ''}. ` +
        'Copie .env.example para .env.local e preencha as credenciais públicas.',
    );
  }

  cachedEnv = result.data;
  return cachedEnv;
}
