'use client';

import { Flag } from 'lucide-react';
import { useState } from 'react';

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Input, Label } from '@/components/ui';
import { createWritingGoal } from '@/features/overview/actions';

export function NewGoalDialog({ workId }: { workId: string }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('word_count');
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Flag className="size-4" />Nova meta</Button></DialogTrigger>
      <DialogContent className="max-w-lg border-line bg-surface text-ink">
        <DialogHeader><DialogTitle className="font-serif text-2xl">Definir uma meta</DialogTitle><DialogDescription className="text-muted">Transforme a intenção em um marco editorial mensurável.</DialogDescription></DialogHeader>
        <form action={createWritingGoal} className="mt-5 space-y-4">
          <input type="hidden" name="workId" value={workId} />
          <div className="space-y-2"><Label htmlFor="goal-title">Nome da meta</Label><Input id="goal-title" name="title" required maxLength={120} placeholder="Ex.: Finalizar o primeiro rascunho" autoFocus /></div>
          <div className="space-y-2"><Label htmlFor="goal-type">O que acompanhar</Label><select id="goal-type" name="type" value={type} onChange={(event) => setType(event.target.value)} className="min-h-11 w-full rounded-control border border-line-strong bg-surface px-3 text-sm"><option value="word_count">Total de palavras</option><option value="chapter_count">Quantidade de capítulos</option><option value="deadline">Prazo editorial</option></select></div>
          {type !== 'deadline' && <div className="space-y-2"><Label htmlFor="goal-target">Alvo</Label><Input id="goal-target" name="target" type="number" min={1} max={10000000} required placeholder={type === 'word_count' ? '50000' : '20'} /></div>}
          <div className="space-y-2"><Label htmlFor="goal-date">Data desejada <span className="font-normal text-muted">(opcional)</span></Label><Input id="goal-date" name="dueDate" type="date" /></div>
          <DialogFooter><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button><Button type="submit">Criar meta</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

