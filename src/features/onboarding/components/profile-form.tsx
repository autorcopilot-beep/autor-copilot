'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Check, LoaderCircle } from 'lucide-react';

import { Button, Input, Label } from '@/components/ui';
import { completeProfile } from '@/features/onboarding/actions/complete-profile';
import {
  experienceOptions,
  writingFocusOptions,
  type OnboardingState,
} from '@/features/onboarding/schemas/profile';

const initialState: OnboardingState = { status: 'idle' };

type ProfileFormProps = {
  defaultPenName?: string;
  defaultWritingFocus?: string;
  defaultExperienceLevel?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="wide" className="w-full sm:w-auto" disabled={pending}>
      {pending ? <><LoaderCircle className="size-4 animate-spin" aria-hidden="true" />Preparando seu espaço…</> : <><Check className="size-4" aria-hidden="true" />Concluir preparação</>}
    </Button>
  );
}

export function ProfileForm({ defaultPenName, defaultWritingFocus, defaultExperienceLevel }: ProfileFormProps) {
  const [state, formAction] = useActionState(completeProfile, initialState);

  return (
    <form action={formAction} className="mt-9 space-y-9" noValidate>
      {state.message && <div className="rounded-control border border-danger bg-danger-subtle px-4 py-3 text-sm text-ink" role="alert">{state.message}</div>}

      <fieldset>
        <legend className="text-sm font-medium text-ink">O que você quer escrever primeiro?</legend>
        <p className="mt-1 text-sm text-muted">Isso adapta os próximos convites, sem limitar sua conta.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {writingFocusOptions.map((option) => (
            <label key={option.value} className="cursor-pointer">
              <input type="radio" name="writingFocus" value={option.value} defaultChecked={defaultWritingFocus === option.value} className="peer sr-only" />
              <span className="block min-h-[5.5rem] rounded-card border border-line-strong bg-surface p-4 transition-colors duration-150 peer-checked:border-accent peer-checked:bg-accent-subtle peer-focus-visible:ring-2 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-2">
                <span className="font-medium text-ink">{option.label}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">{option.note}</span>
              </span>
            </label>
          ))}
        </div>
        {state.fieldErrors?.writingFocus?.[0] && <p className="mt-2 text-sm text-danger">{state.fieldErrors.writingFocus[0]}</p>}
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-ink">Em que momento você está?</legend>
        <div className="mt-4 grid gap-2">
          {experienceOptions.map((option) => (
            <label key={option.value} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-control border border-line px-3.5 py-2.5 text-sm text-ink transition-colors hover:bg-surface-muted has-[:checked]:border-accent has-[:checked]:bg-accent-subtle">
              <input type="radio" name="experienceLevel" value={option.value} defaultChecked={defaultExperienceLevel === option.value} className="size-4 accent-accent" />
              {option.label}
            </label>
          ))}
        </div>
        {state.fieldErrors?.experienceLevel?.[0] && <p className="mt-2 text-sm text-danger">{state.fieldErrors.experienceLevel[0]}</p>}
      </fieldset>

      <div>
        <Label htmlFor="penName">Nome de autora ou autor <span className="font-normal text-muted">(opcional)</span></Label>
        <Input id="penName" name="penName" className="mt-2" defaultValue={defaultPenName} maxLength={80} autoComplete="nickname" aria-invalid={Boolean(state.fieldErrors?.penName)} aria-describedby={state.fieldErrors?.penName ? 'penName-error' : 'penName-hint'} />
        {state.fieldErrors?.penName?.[0] ? <p id="penName-error" className="mt-1.5 text-sm text-danger">{state.fieldErrors.penName[0]}</p> : <p id="penName-hint" className="mt-1.5 text-sm text-muted">Você poderá mudar isso depois.</p>}
      </div>

      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-xs leading-relaxed text-muted">Guardamos apenas estas preferências de apresentação. Elas não alteram seus direitos sobre a obra.</p>
        <SubmitButton />
      </div>
    </form>
  );
}
