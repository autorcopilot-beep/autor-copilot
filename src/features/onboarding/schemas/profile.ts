import { z } from 'zod';

export const writingFocusOptions = [
  { value: 'fiction', label: 'Romance ou ficção', note: 'Cenas, personagens e continuidade.' },
  { value: 'nonfiction', label: 'Não ficção', note: 'Pesquisa, estrutura e argumentos.' },
  { value: 'poetry', label: 'Poesia', note: 'Coleções, temas e versões.' },
  { value: 'screenplay', label: 'Roteiro', note: 'Sequências, cenas e elenco.' },
  { value: 'other', label: 'Outro formato', note: 'Um espaço flexível para seu processo.' },
] as const;

export const experienceOptions = [
  { value: 'starting', label: 'Começando agora' },
  { value: 'returning', label: 'Já escrevo há algum tempo' },
  { value: 'published', label: 'Já publiquei uma obra' },
] as const;

export const onboardingSchema = z.object({
  penName: z
    .string()
    .trim()
    .max(80, 'Use no máximo 80 caracteres.')
    .refine((value) => value.length === 0 || value.length >= 2, 'Use pelo menos 2 caracteres.'),
  writingFocus: z.enum(['fiction', 'nonfiction', 'poetry', 'screenplay', 'other'], {
    message: 'Escolha o formato que mais se aproxima da sua escrita.',
  }),
  experienceLevel: z.enum(['starting', 'returning', 'published'], {
    message: 'Conte em que momento da escrita você está.',
  }),
});

export type OnboardingField = 'penName' | 'writingFocus' | 'experienceLevel';

export type OnboardingState = {
  status: 'idle' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<OnboardingField, string[]>>;
};
