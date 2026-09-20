'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Accessibility, RotateCcw, X } from 'lucide-react';
import {
  useEffect,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';

import { Button, buttonVariants } from '@/components/ui';
import { cn } from '@/lib/cn';

import {
  ACCESSIBILITY_STORAGE_KEY,
  applyAccessibilityPreferences,
  defaultAccessibilityPreferences,
  lineHeightOptions,
  parseAccessibilityPreferences,
  readAccessibilityPreferences,
  saveAccessibilityPreferences,
  textWidthOptions,
  themeOptions,
  type AccessibilityPreferences,
} from './preferences';

const themeLabels = {
  system: 'Sistema',
  light: 'Claro',
  dark: 'Escuro',
} as const;

const lineHeightLabels = {
  1.5: 'Compacta',
  1.65: 'Confortável',
  1.8: 'Ampla',
} as const;

const textWidthLabels = {
  60: 'Estreita',
  68: 'Padrão',
  75: 'Larga',
} as const;

export function AccessibilityMenu() {
  const [preferences, setPreferences] = useState(defaultAccessibilityPreferences);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = readAccessibilityPreferences();
      setPreferences(stored);
      applyAccessibilityPreferences(stored);
    });

    function syncAcrossTabs(event: StorageEvent) {
      if (event.key !== ACCESSIBILITY_STORAGE_KEY) return;

      try {
        const next = parseAccessibilityPreferences(
          event.newValue ? JSON.parse(event.newValue) : null,
        );
        setPreferences(next);
        applyAccessibilityPreferences(next);
      } catch {
        setPreferences(defaultAccessibilityPreferences);
        applyAccessibilityPreferences(defaultAccessibilityPreferences);
      }
    }

    window.addEventListener('storage', syncAcrossTabs);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('storage', syncAcrossTabs);
    };
  }, []);

  function updatePreferences(
    update: Partial<AccessibilityPreferences>,
  ) {
    const next = parseAccessibilityPreferences({ ...preferences, ...update });
    setPreferences(next);
    applyAccessibilityPreferences(next);
    saveAccessibilityPreferences(next);
  }

  function resetPreferences() {
    setPreferences(defaultAccessibilityPreferences);
    applyAccessibilityPreferences(defaultAccessibilityPreferences);
    saveAccessibilityPreferences(defaultAccessibilityPreferences);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger
        className={cn(
          buttonVariants({ variant: 'secondary' }),
          'fixed bottom-4 right-4 z-40 shadow-floating sm:bottom-6 sm:right-6',
        )}
      >
        <Accessibility aria-hidden="true" className="size-5" />
        <span>Acessibilidade</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="fixed inset-x-4 bottom-4 z-50 max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-card border border-line bg-surface p-5 shadow-floating focus:outline-none sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-1/2 sm:w-[min(32rem,calc(100vw-3rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-section-title text-ink">
                Preferências de acessibilidade
              </Dialog.Title>
              <Dialog.Description className="mt-2 max-w-md text-sm text-muted">
                Ajuste a leitura do manuscrito. As escolhas ficam salvas neste
                navegador.
              </Dialog.Description>
            </div>
            <Dialog.Close
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), '-mr-2 -mt-2')}
              aria-label="Fechar preferências"
            >
              <X aria-hidden="true" className="size-5" />
            </Dialog.Close>
          </div>

          <div className="mt-6 space-y-7">
            <PreferenceGroup legend="Tema">
              {themeOptions.map((theme) => (
                <Choice
                  key={theme}
                  name="theme"
                  value={theme}
                  checked={preferences.theme === theme}
                  onChange={() => updatePreferences({ theme })}
                >
                  {themeLabels[theme]}
                </Choice>
              ))}
            </PreferenceGroup>

            <div>
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="editor-font-size" className="text-sm font-medium text-ink">
                  Tamanho do texto
                </label>
                <output
                  htmlFor="editor-font-size"
                  className="min-w-12 text-right text-sm tabular-nums text-muted"
                  aria-live="polite"
                >
                  {preferences.fontSize} px
                </output>
              </div>
              <input
                id="editor-font-size"
                type="range"
                min="16"
                max="24"
                step="1"
                value={preferences.fontSize}
                onChange={(event) =>
                  updatePreferences({ fontSize: Number(event.target.value) })
                }
                className="mt-3 min-h-11 w-full cursor-pointer accent-accent"
              />
              <div aria-hidden="true" className="flex justify-between text-meta text-muted">
                <span>16 px</span>
                <span>24 px</span>
              </div>
            </div>

            <PreferenceGroup legend="Entrelinha">
              {lineHeightOptions.map((lineHeight) => (
                <Choice
                  key={lineHeight}
                  name="line-height"
                  value={lineHeight}
                  checked={preferences.lineHeight === lineHeight}
                  onChange={() => updatePreferences({ lineHeight })}
                >
                  {lineHeightLabels[lineHeight]}
                </Choice>
              ))}
            </PreferenceGroup>

            <PreferenceGroup legend="Largura do texto">
              {textWidthOptions.map((textWidth) => (
                <Choice
                  key={textWidth}
                  name="text-width"
                  value={textWidth}
                  checked={preferences.textWidth === textWidth}
                  onChange={() => updatePreferences({ textWidth })}
                >
                  {textWidthLabels[textWidth]}
                </Choice>
              ))}
            </PreferenceGroup>

            <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-control border border-line bg-surface-muted px-3.5 py-2.5 text-sm text-ink">
              <input
                type="checkbox"
                checked={preferences.reduceMotion}
                onChange={(event) =>
                  updatePreferences({ reduceMotion: event.target.checked })
                }
                className="size-5 shrink-0 accent-accent"
              />
              Reduzir movimentos e transições
            </label>
          </div>

          <div className="mt-7 border-t border-line pt-5">
            <Button variant="secondary" onClick={resetPreferences}>
              <RotateCcw aria-hidden="true" className="size-4" />
              Restaurar padrões
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function PreferenceGroup({
  legend,
  children,
}: {
  legend: string;
  children: ReactNode;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink">{legend}</legend>
      <div className="mt-3 grid grid-cols-3 gap-2">{children}</div>
    </fieldset>
  );
}

function Choice({
  children,
  ...props
}: ComponentProps<'input'> & { children: ReactNode }) {
  return (
    <label className="cursor-pointer">
      <input type="radio" className="peer sr-only" {...props} />
      <span className="flex min-h-11 items-center justify-center rounded-control border border-line-strong bg-surface px-2 text-center text-sm text-ink transition-colors peer-checked:border-accent peer-checked:bg-accent-subtle peer-checked:font-medium peer-focus-visible:ring-2 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-canvas">
        {children}
      </span>
    </label>
  );
}
