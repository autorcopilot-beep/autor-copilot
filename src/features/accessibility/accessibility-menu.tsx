'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Accessibility, RotateCcw, X } from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type PointerEvent as ReactPointerEvent,
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

const POSITION_STORAGE_KEY = 'autor-copilot:accessibility-button';
const BUTTON_SIZE = 48;
const EDGE_GAP = 12;

type ButtonPosition = { x: number; y: number };

function clampPosition(position: ButtonPosition): ButtonPosition {
  return {
    x: Math.min(window.innerWidth - BUTTON_SIZE - EDGE_GAP, Math.max(EDGE_GAP, position.x)),
    y: Math.min(window.innerHeight - BUTTON_SIZE - EDGE_GAP, Math.max(EDGE_GAP, position.y)),
  };
}

export function AccessibilityMenu() {
  const [preferences, setPreferences] = useState(defaultAccessibilityPreferences);
  const [buttonPosition, setButtonPosition] = useState<ButtonPosition | null>(null);
  const drag = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = readAccessibilityPreferences();
      setPreferences(stored);
      applyAccessibilityPreferences(stored);

      try {
        const saved = window.localStorage.getItem(POSITION_STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) as ButtonPosition : null;
        setButtonPosition(clampPosition(parsed && Number.isFinite(parsed.x) && Number.isFinite(parsed.y)
          ? parsed
          : { x: window.innerWidth - BUTTON_SIZE - EDGE_GAP, y: window.innerHeight - BUTTON_SIZE - 24 }));
      } catch {
        setButtonPosition({ x: window.innerWidth - BUTTON_SIZE - EDGE_GAP, y: window.innerHeight - BUTTON_SIZE - 24 });
      }
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
    const keepButtonVisible = () => setButtonPosition((current) => current ? clampPosition(current) : current);
    window.addEventListener('resize', keepButtonVisible);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('storage', syncAcrossTabs);
      window.removeEventListener('resize', keepButtonVisible);
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

  function startDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!buttonPosition || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: buttonPosition.x,
      originY: buttonPosition.y,
      moved: false,
    };
  }

  function moveButton(event: ReactPointerEvent<HTMLButtonElement>) {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - active.startX;
    const deltaY = event.clientY - active.startY;
    if (Math.hypot(deltaX, deltaY) > 4) active.moved = true;
    setButtonPosition(clampPosition({ x: active.originX + deltaX, y: active.originY + deltaY }));
  }

  function finishDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const rightEdge = window.innerWidth - BUTTON_SIZE - EDGE_GAP;
    const released = clampPosition({
      x: active.originX + event.clientX - active.startX,
      y: active.originY + event.clientY - active.startY,
    });
    const snapped = clampPosition({
      x: released.x + BUTTON_SIZE / 2 < window.innerWidth / 2 ? EDGE_GAP : rightEdge,
      y: released.y,
    });
    suppressClick.current = active.moved;
    drag.current = null;
    setButtonPosition(snapped);
    try { window.localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(snapped)); } catch { /* posição válida nesta aba */ }
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
          'fixed z-40 size-12 cursor-grab touch-none rounded-full p-0 shadow-floating active:cursor-grabbing',
        )}
        style={buttonPosition ? { left: buttonPosition.x, top: buttonPosition.y } : { right: EDGE_GAP, bottom: 24 }}
        onPointerDown={startDrag}
        onPointerMove={moveButton}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onClick={(event) => {
          if (!suppressClick.current) return;
          event.preventDefault();
          suppressClick.current = false;
        }}
        aria-label="Mostrar ou ocultar preferências de acessibilidade"
        title="Acessibilidade — arraste para mover"
      >
        <Accessibility aria-hidden="true" className="size-5" />
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
