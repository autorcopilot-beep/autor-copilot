'use client';

import { useActionState, useMemo, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Check, ChevronLeft, ChevronRight, LoaderCircle } from 'lucide-react';

import { Button, Input, Label, StepFlow } from '@/components/ui';
import { register } from '@/features/auth/actions/register';
import type { RegisterField, RegisterState } from '@/features/auth/schemas/register';

const initialState: RegisterState = { status: 'idle' };

type FormValues = {
  fullName: string; age: string; nickname: string; email: string;
  password: string; confirmPassword: string; acceptTerms: boolean;
  acceptPrivacy: boolean; acceptCommunications: boolean;
};

const initialValues: FormValues = {
  fullName: '', age: '', nickname: '', email: '', password: '', confirmPassword: '',
  acceptTerms: false, acceptPrivacy: false, acceptCommunications: false,
};

const stepContent = [
  ['Vamos começar por você', 'Essas informações ajudam a personalizar seu espaço.'],
  ['Qual é o seu e-mail?', 'Enviaremos um link seguro para confirmar sua conta.'],
  ['Crie uma senha segura', 'Acompanhe as regras enquanto digita.'],
  ['Escolhas e privacidade', 'Revise como podemos usar seus dados e falar com você.'],
  ['Tudo pronto para começar', 'Confira os dados antes de criar sua conta.'],
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="wide" className="min-w-44" disabled={pending}>
      {pending ? <><LoaderCircle className="size-4 animate-spin" aria-hidden="true" />Criando conta…</> : <><Check className="size-4" aria-hidden="true" />Criar minha conta</>}
    </Button>
  );
}

function FieldMessage({ message, id }: { message?: string; id: string }) {
  return message ? <p id={id} className="mt-1 text-xs text-danger">{message}</p> : null;
}

export function RegisterForm({ confirmationError = false }: { confirmationError?: boolean }) {
  const [state, formAction] = useActionState(register, initialState);
  const [values, setValues] = useState(initialValues);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [localErrors, setLocalErrors] = useState<Partial<Record<RegisterField, string>>>({});

  const passwordRules = useMemo(() => ({
    length: values.password.length >= 8,
    letter: /[A-Za-zÀ-ÿ]/.test(values.password),
    number: /\d/.test(values.password),
    match: values.password.length > 0 && values.password === values.confirmPassword,
  }), [values.password, values.confirmPassword]);

  function update<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setLocalErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validateCurrentStep() {
    const errors: Partial<Record<RegisterField, string>> = {};
    if (step === 1) {
      if (values.fullName.trim().split(/\s+/).length < 2) errors.fullName = 'Informe nome e sobrenome.';
      const age = Number(values.age);
      if (!Number.isInteger(age) || age < 13 || age > 120) errors.age = 'Informe uma idade entre 13 e 120 anos.';
      if (values.nickname.trim().length < 2) errors.nickname = 'Informe um apelido com pelo menos 2 caracteres.';
    }
    if (step === 2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Informe um e-mail válido.';
    if (step === 3) {
      if (!passwordRules.length || !passwordRules.letter || !passwordRules.number) errors.password = 'A senha ainda não atende a todas as regras.';
      if (!passwordRules.match) errors.confirmPassword = 'As senhas precisam ser iguais.';
    }
    if (step === 4) {
      if (!values.acceptTerms) errors.acceptTerms = 'Aceite os Termos de Uso para continuar.';
      if (!values.acceptPrivacy) errors.acceptPrivacy = 'Aceite a Política de Privacidade para continuar.';
    }
    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function nextStep() {
    if (!validateCurrentStep()) return;
    setDirection('forward');
    setStep((current) => Math.min(5, current + 1));
  }

  function previousStep() {
    setLocalErrors({});
    setDirection('backward');
    setStep((current) => Math.max(1, current - 1));
  }

  const serverError = (field: RegisterField) => state.fieldErrors?.[field]?.[0];
  const errorFor = (field: RegisterField) => localErrors[field] ?? serverError(field);

  return (
    <form action={formAction} className="flex min-h-0 flex-1 flex-col" noValidate>
      {(confirmationError || state.message) && (
        <div className="mb-3 rounded-control border border-danger bg-danger-subtle px-3 py-2 text-xs text-ink" role="alert">
          {confirmationError ? 'O link de confirmação expirou ou já foi utilizado. Revise os dados e tente novamente.' : state.message}
        </div>
      )}

      <StepFlow currentStep={step} totalSteps={5} direction={direction} title={stepContent[step - 1][0]} description={stepContent[step - 1][1]}>
        {step === 1 && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input id="fullName" value={values.fullName} onChange={(event) => update('fullName', event.target.value)} className="mt-1" autoComplete="name" maxLength={120} autoFocus aria-invalid={Boolean(errorFor('fullName'))} />
              <FieldMessage id="fullName-error" message={errorFor('fullName')} />
            </div>
            <div>
              <Label htmlFor="age">Idade</Label>
              <Input id="age" value={values.age} onChange={(event) => update('age', event.target.value)} className="mt-1" type="number" inputMode="numeric" min={13} max={120} aria-invalid={Boolean(errorFor('age'))} />
              <FieldMessage id="age-error" message={errorFor('age')} />
            </div>
            <div>
              <Label htmlFor="nickname">Apelido</Label>
              <Input id="nickname" value={values.nickname} onChange={(event) => update('nickname', event.target.value)} className="mt-1" autoComplete="nickname" maxLength={40} aria-invalid={Boolean(errorFor('nickname'))} />
              <FieldMessage id="nickname-error" message={errorFor('nickname')} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" value={values.email} onChange={(event) => update('email', event.target.value)} type="email" className="mt-1" autoComplete="email" inputMode="email" maxLength={254} autoFocus aria-invalid={Boolean(errorFor('email'))} />
            <FieldMessage id="email-error" message={errorFor('email')} />
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input id="password" value={values.password} onChange={(event) => update('password', event.target.value)} type="password" className="mt-1" autoComplete="new-password" maxLength={72} autoFocus aria-invalid={Boolean(errorFor('password'))} />
              <FieldMessage id="password-error" message={errorFor('password')} />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirme a senha</Label>
              <Input id="confirmPassword" value={values.confirmPassword} onChange={(event) => update('confirmPassword', event.target.value)} type="password" className="mt-1" autoComplete="new-password" maxLength={72} aria-invalid={Boolean(errorFor('confirmPassword'))} />
              <FieldMessage id="confirmPassword-error" message={errorFor('confirmPassword')} />
            </div>
            <ul className="grid gap-1 text-xs text-muted sm:col-span-2 sm:grid-cols-2" aria-label="Regras da senha">
              <PasswordRule met={passwordRules.length}>Pelo menos 8 caracteres</PasswordRule>
              <PasswordRule met={passwordRules.letter}>Uma letra</PasswordRule>
              <PasswordRule met={passwordRules.number}>Um número</PasswordRule>
              <PasswordRule met={passwordRules.match}>Senhas iguais</PasswordRule>
            </ul>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-2.5">
            <Consent checked={values.acceptTerms} onChange={(checked) => update('acceptTerms', checked)} required>Li e aceito os Termos de Uso.</Consent>
            <FieldMessage id="terms-error" message={errorFor('acceptTerms')} />
            <Consent checked={values.acceptPrivacy} onChange={(checked) => update('acceptPrivacy', checked)} required>Li e aceito a Política de Dados e Privacidade.</Consent>
            <FieldMessage id="privacy-error" message={errorFor('acceptPrivacy')} />
            <Consent checked={values.acceptCommunications} onChange={(checked) => update('acceptCommunications', checked)}>Quero receber novidades, dicas de escrita e comunicações do Autor Copilot.</Consent>
            <p className="text-xs leading-relaxed text-muted">O aceite de comunicações é opcional e pode ser alterado depois.</p>
          </div>
        )}

        {step === 5 && (
          <div className="rounded-card border border-line bg-surface-muted p-4 text-sm">
            <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              <Summary label="Nome" value={values.fullName} />
              <Summary label="Como chamar você" value={values.nickname} />
              <Summary label="Idade" value={`${values.age} anos`} />
              <Summary label="E-mail" value={values.email} />
              <Summary label="Comunicações" value={values.acceptCommunications ? 'Aceitas' : 'Não aceitas'} />
            </dl>
            <input type="hidden" name="fullName" value={values.fullName} />
            <input type="hidden" name="age" value={values.age} />
            <input type="hidden" name="nickname" value={values.nickname} />
            <input type="hidden" name="email" value={values.email} />
            <input type="hidden" name="password" value={values.password} />
            <input type="hidden" name="confirmPassword" value={values.confirmPassword} />
            {values.acceptTerms && <input type="hidden" name="acceptTerms" value="on" />}
            {values.acceptPrivacy && <input type="hidden" name="acceptPrivacy" value="on" />}
            {values.acceptCommunications && <input type="hidden" name="acceptCommunications" value="on" />}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          {step > 1 ? <Button type="button" variant="ghost" onClick={previousStep}><ChevronLeft className="size-4" aria-hidden="true" />Voltar</Button> : <span />}
          {step < 5 ? <Button type="button" onClick={nextStep}>Continuar<ChevronRight className="size-4" aria-hidden="true" /></Button> : <SubmitButton />}
        </div>
      </StepFlow>
    </form>
  );
}

function PasswordRule({ met, children }: { met: boolean; children: string }) {
  return <li className={met ? 'text-success' : undefined}><Check className="mr-1 inline size-3.5" aria-hidden="true" />{children}</li>;
}

function Consent({ checked, onChange, children, required = false }: { checked: boolean; onChange: (checked: boolean) => void; children: string; required?: boolean }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-control border border-line bg-surface px-3 py-2.5 text-sm leading-relaxed text-ink">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-0.5 size-4 shrink-0 accent-accent" />
      <span>{children}{required && <span className="text-danger" aria-label="obrigatório"> *</span>}</span>
    </label>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs text-muted">{label}</dt><dd className="font-medium text-ink">{value}</dd></div>;
}
