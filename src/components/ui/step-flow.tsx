'use client';

import { Component, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

type Direction = 'forward' | 'backward';

type StepContent = {
  step: number;
  totalSteps: number;
  title: string;
  description?: string;
  children: ReactNode;
};

type StepFlowProps = {
  currentStep: number;
  totalSteps: number;
  title: string;
  description?: string;
  direction?: Direction;
  children: ReactNode;
  className?: string;
};

export function StepFlow({
  currentStep,
  totalSteps,
  title,
  description,
  direction = 'forward',
  children,
  className,
}: StepFlowProps) {
  const content = { step: currentStep, totalSteps, title, description, children };

  return (
    <div className={cn('book-flow flex min-h-0 flex-1 flex-col', className)}>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Página {currentStep} de {totalSteps}: {title}
      </p>

      <div className="book-cover min-h-0 flex-1">
        <div className="book-object">
          <BookInsideCover currentStep={currentStep} totalSteps={totalSteps} />
          <div className="book-page book-page-right">
            <PageTurnTransition content={content} direction={direction} />
          </div>
        </div>
      </div>
    </div>
  );
}

function BookInsideCover({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <aside className="book-page book-page-left" aria-label="Meu Livro — Autor Copilot">
      <div className="book-title-page">
        <p className="book-edition">Primeira edição</p>
        <div>
          <p className="book-kicker">Meu Livro</p>
          <h2>Autor Copilot</h2>
          <span className="book-title-rule" aria-hidden="true" />
          <p className="book-subtitle">Toda grande história começa ao virar a primeira página.</p>
        </div>
        <ol className="book-page-index" aria-label="Páginas do começo">
          {Array.from({ length: totalSteps }, (_, index) => index + 1).map((page) => (
            <li key={page} className={page === currentStep ? 'is-current' : undefined}>
              <span>Página</span>
              <strong>{String(page).padStart(2, '0')}</strong>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}

type TransitionProps = {
  content: StepContent;
  direction: Direction;
};

type TransitionState = {
  active: StepContent;
  outgoing: StepContent | null;
  direction: Direction;
  transitionId: number;
};

class PageTurnTransition extends Component<TransitionProps, TransitionState> {
  state: TransitionState = {
    active: this.props.content,
    outgoing: null,
    direction: this.props.direction,
    transitionId: 0,
  };

  static getDerivedStateFromProps(props: TransitionProps, state: TransitionState): Partial<TransitionState> | null {
    if (props.content.step === state.active.step) return { active: props.content };

    return {
      active: props.content,
      outgoing: state.active,
      direction: props.direction,
      transitionId: state.transitionId + 1,
    };
  }

  finishTransition = (transitionId: number) => {
    if (transitionId === this.state.transitionId) this.setState({ outgoing: null });
  };

  render() {
    const { active, outgoing, direction, transitionId } = this.state;

    return (
      <div className="book-page-stack">
        {direction === 'backward' && outgoing ? (
          <StepPage content={outgoing} ariaHidden />
        ) : (
          <StepPage content={active} />
        )}

        {outgoing && (
          <TurningSheet
            content={direction === 'forward' ? outgoing : active}
            direction={direction}
            ariaHidden={direction === 'forward'}
            onAnimationEnd={() => this.finishTransition(transitionId)}
          />
        )}
      </div>
    );
  }
}

function TurningSheet({
  content,
  direction,
  ariaHidden,
  onAnimationEnd,
}: {
  content: StepContent;
  direction: Direction;
  ariaHidden: boolean;
  onAnimationEnd: () => void;
}) {
  return (
    <div className={`book-turn-sheet book-turn-${direction}`} onAnimationEnd={onAnimationEnd}>
      <div className="book-face book-face-front">
        <StepPage content={content} ariaHidden={ariaHidden} />
      </div>
      <div className="book-face book-face-back" aria-hidden="true">
        <div className="book-back-mark">
          <span>Meu Livro</span>
          <strong>Autor Copilot</strong>
        </div>
      </div>
    </div>
  );
}

function StepPage({ content, ariaHidden = false }: { content: StepContent; ariaHidden?: boolean }) {
  const progress = (content.step / content.totalSteps) * 100;

  return (
    <section className="book-step-page" aria-labelledby={`step-title-${content.step}`} aria-hidden={ariaHidden || undefined}>
      <div className="book-page-progress">
        <div
          className="book-progress-track"
          role="progressbar"
          aria-label="Progresso do livro"
          aria-valuenow={content.step}
          aria-valuemin={1}
          aria-valuemax={content.totalSteps}
          aria-valuetext={`Página ${content.step} de ${content.totalSteps}`}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
        <span aria-hidden="true">{content.step}/{content.totalSteps}</span>
      </div>

      <header className="book-chapter-heading">
        <p>Página {String(content.step).padStart(2, '0')}</p>
        <h2 id={`step-title-${content.step}`}>{content.title}</h2>
        {content.description && <span>{content.description}</span>}
      </header>

      <div className="book-page-content">{content.children}</div>
      <span className="book-page-number" aria-hidden="true">{content.step}</span>
    </section>
  );
}
