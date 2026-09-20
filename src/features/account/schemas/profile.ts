import { z } from 'zod';

export const genreOptions = [
  { value: 'romance', label: 'Romance' },
  { value: 'fantasy', label: 'Fantasia' },
  { value: 'science_fiction', label: 'Ficção científica' },
  { value: 'mystery', label: 'Mistério' },
  { value: 'thriller', label: 'Suspense' },
  { value: 'horror', label: 'Terror' },
  { value: 'poetry', label: 'Poesia' },
  { value: 'nonfiction', label: 'Não ficção' },
] as const;

export const identityProfileSchema = z.object({
  fullName: z.string().trim().min(3, 'Informe seu nome completo.').max(120, 'Use no máximo 120 caracteres.'),
  nickname: z.string().trim().min(2, 'Informe como prefere ser chamado.').max(40, 'Use no máximo 40 caracteres.'),
  username: z.string().trim().toLowerCase().transform((value) => value.replace(/^@/, '')).pipe(
    z.string().min(3, 'Use pelo menos 3 caracteres.').max(24, 'Use no máximo 24 caracteres.').regex(/^[a-z0-9_]+$/, 'Use apenas letras minúsculas, números e underline.'),
  ),
  penName: z.string().trim().max(80, 'Use no máximo 80 caracteres.').refine((value) => value.length === 0 || value.length >= 2, 'Use pelo menos 2 caracteres.'),
  age: z.coerce.number({ message: 'Informe sua idade.' }).int().min(13, 'É preciso ter pelo menos 13 anos.').max(120, 'Informe uma idade válida.'),
  bio: z.string().trim().max(500, 'Use no máximo 500 caracteres.'),
});

export const writingProfileSchema = z.object({
  writingFocus: z.enum(['fiction', 'nonfiction', 'poetry', 'screenplay', 'other']),
  experienceLevel: z.enum(['starting', 'returning', 'published']),
  genres: z.array(z.enum(genreOptions.map((genre) => genre.value) as [string, ...string[]])).max(8),
});

export const regionProfileSchema = z.object({
  locale: z.enum(['pt-BR', 'en-US', 'es-ES']),
  countryCode: z.enum(['BR', 'PT', 'US']).or(z.literal('')),
  timezone: z.enum(['America/Sao_Paulo', 'America/Manaus', 'America/Recife', 'Europe/Lisbon', 'America/New_York']),
});

export type AccountProfileField =
  | keyof z.infer<typeof identityProfileSchema>
  | keyof z.infer<typeof writingProfileSchema>
  | keyof z.infer<typeof regionProfileSchema>;

export type AccountProfileState = {
  status: 'idle' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<AccountProfileField, string[]>>;
};
