'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Check, ChevronLeft, ChevronRight, LoaderCircle } from 'lucide-react';

import { Button, Input, Label, StepFlow } from '@/components/ui';
import { completeProfile } from '@/features/onboarding/actions/complete-profile';
import { experienceOptions, writingFocusOptions, type OnboardingState } from '@/features/onboarding/schemas/profile';

const initialState: OnboardingState = { status: 'idle' };

type ProfileFormProps = {
  defaultPenName?: string;
  defaultWritingFocus?: string;
  defaultExperienceLevel?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="wide" disabled={pending}>
      {pending ? <><LoaderCircle className="size-4 animate-spin" aria-hidden="true" />Preparando…</> : <><Check className="size-4" aria-hidden="true" />Concluir</>}
    </Button>
  );
}

export function ProfileForm({ defaultPenName = '', defaultWritingFocus = '', defaultExperienceLevel = '' }: ProfileFormProps) {
  const [state, formAction] = useActionState(completeProfile, initialState);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [writingFocus, setWritingFocus] = useState(defaultWritingFocus);
  const [experienceLevel, setExperienceLevel] = useState(defaultExperienceLevel);
  const [penName, setPenName] = useState(defaultPenName);
  const [error, setError] = useState<string>();

  function nextStep() {
    if (step === 1 && !writingFocus) {
      setError('Escolha o formato que mais se aproxima da sua escrita.');
      return;
    }
    if (step === 2 && !experienceLevel) {
      setError('Conte em que momento da escrita você está.');
      return;
    }
    setError(undefined);
    setDirection('forward');
    setStep((current) => Math.min(3, current + 1));
  }

  function previousStep() {
    setError(undefined);
    setDirection('backward');
    setStep((current) => Math.max(1, current - 1));
  }

  return (
    <form action={formAction} className="flex min-h-0 flex-1 flex-col" noValidate>
      {state.message && <div className="mb-3 rounded-control border border-danger bg-danger-subtle px-3 py-2 text-xs text-ink" role="alert">{state.message}</div>}
      <StepFlow
        currentStep={step}
        totalSteps={3}
        direction={direction}
        title={step === 1 ? 'O que você quer escrever?' : step === 2 ? 'Qual é a sua experiência?' : 'Como assina suas histórias?'}
        description={step === 1 ? 'Esta escolha adapta os próximos convites sem limitar sua conta.' : step === 2 ? 'Podemos ajustar a orientação ao seu momento.' : 'O nome literário é opcional e poderá ser alterado depois.'}
      >
        {step === 1 && (
          <fieldset className="grid gap-2 sm:grid-cols-2">
            <legend className="sr-only">Tipo de escrita</legend>
            {writingFocusOptions.map((option) => (
              <label key={option.value} className="cursor-pointer">
                <input type="radio" value={option.value} checked={writingFocus === option.value} onChange={() => { setWritingFocus(option.value); setError(undefined); }} className="peer sr-only" />
                <span className="block rounded-control border border-line-strong bg-surface px-3 py-2 transition-colors peer-checked:border-accent peer-checked:bg-accent-subtle peer-focus-visible:ring-2 peer-focus-visible:ring-focus">
                  <span className="text-sm font-medium text-ink">{option.label}</span>
                  <span className="block text-xs text-muted">{option.note}</span>
                </span>
              </label>
            ))}
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="grid gap-2">
            <legend className="sr-only">Experiência de escrita</legend>
            {experienceOptions.map((option) => (
              <label key={option.value} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-control border border-line-strong bg-surface px-3 py-2.5 text-sm text-ink has-[:checked]:border-accent has-[:checked]:bg-accent-subtle">
                <input type="radio" value={option.value} checked={experienceLevel === option.value} onChange={() => { setExperienceLevel(option.value); setError(undefined); }} className="size-4 accent-accent" />
                {option.label}
              </label>
            ))}
          </fieldset>
        )}

        {step === 3 && (
          <div>
            <Label htmlFor="penName">Nome literário <span className="font-normal text-muted">(opcional)</span></Label>
            <Input id="penName" value={penName} onChange={(event) => setPenName(event.target.value)} className="mt-1" maxLength={80} autoComplete="nickname" autoFocus aria-invalid={Boolean(state.fieldErrors?.penName?.[0])} />
            <div className="mt-4 rounded-control border border-line bg-surface-muted px-4 py-3 text-sm text-muted">
              <p><span className="font-medium text-ink">Formato:</span> {writingFocusOptions.find((option) => option.value === writingFocus)?.label}</p>
              <p className="mt-1"><span className="font-medium text-ink">Experiência:</span> {experienceOptions.find((option) => option.value === experienceLevel)?.label}</p>
            </div>
            <input type="hidden" name="writingFocus" value={writingFocus} />
            <input type="hidden" name="experienceLevel" value={experienceLevel} />
            <input type="hidden" name="penName" value={penName} />
          </div>
        )}

        {(error || (step === 3 && state.fieldErrors?.penName?.[0])) && <p className="mt-2 text-xs text-danger" role="alert">{error ?? state.fieldErrors?.penName?.[0]}</p>}

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          {step > 1 ? <Button type="button" variant="ghost" onClick={previousStep}><ChevronLeft className="size-4" aria-hidden="true" />Voltar</Button> : <span />}
          {step < 3 ? <Button type="button" onClick={nextStep}>Continuar<ChevronRight className="size-4" aria-hidden="true" /></Button> : <SubmitButton />}
        </div>
      </StepFlow>
    </form>
  );
}
