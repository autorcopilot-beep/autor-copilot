'use client';

import { BookPlus, FolderPlus } from 'lucide-react';
import { useState } from 'react';

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Input, Label, Textarea } from '@/components/ui';
import { createCatalog, createWork } from '@/features/library/actions';

const toneOptions = [
  ['sage', 'Sálvia'], ['ink', 'Tinta'], ['clay', 'Argila'],
  ['ochre', 'Ocre'], ['plum', 'Ameixa'], ['ocean', 'Oceano'],
] as const;

export function NewWorkDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><BookPlus className="size-4" />Nova obra</Button></DialogTrigger>
      <DialogContent className="max-w-xl border-line bg-surface text-ink">
        <DialogHeader><DialogTitle className="font-serif text-2xl">Começar uma nova obra</DialogTitle><DialogDescription className="text-muted">Defina a identidade editorial. Você poderá desenvolver o manuscrito em seguida.</DialogDescription></DialogHeader>
        <form action={createWork} className="mt-5 space-y-4">
          <div className="space-y-2"><Label htmlFor="work-title">Título</Label><Input id="work-title" name="title" required maxLength={200} placeholder="O nome da sua próxima história" autoFocus /></div>
          <div className="space-y-2"><Label htmlFor="work-subtitle">Subtítulo <span className="font-normal text-muted">(opcional)</span></Label><Input id="work-subtitle" name="subtitle" maxLength={200} placeholder="Uma linha que amplia o título" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="work-genre">Gênero</Label><Input id="work-genre" name="genre" maxLength={80} placeholder="Romance, fantasia…" /></div>
            <div className="space-y-2"><Label htmlFor="work-status">Estágio</Label><select id="work-status" name="status" className="min-h-11 w-full rounded-control border border-line-strong bg-surface px-3 text-sm outline-none focus:border-accent"><option value="planning">Planejamento</option><option value="drafting">Em escrita</option><option value="revising">Em revisão</option><option value="complete">Concluída</option></select></div>
          </div>
          <div className="space-y-2"><Label htmlFor="work-synopsis">Sinopse <span className="font-normal text-muted">(opcional)</span></Label><Textarea id="work-synopsis" name="synopsis" maxLength={5000} rows={4} placeholder="Registre a promessa central da obra." /></div>
          <fieldset><legend className="mb-2 text-sm font-medium">Tom da capa</legend><div className="flex flex-wrap gap-2">{toneOptions.map(([value, label], index) => <label key={value} className="cursor-pointer"><input type="radio" name="coverTone" value={value} defaultChecked={index === 0} className="peer sr-only" /><span className={`inline-flex min-h-9 items-center rounded-full border border-line px-3 text-xs peer-checked:border-accent peer-checked:bg-accent-subtle peer-checked:text-accent-active library-tone-${value}`}>{label}</span></label>)}</div></fieldset>
          <DialogFooter><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button><Button type="submit">Criar e abrir editor</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function NewCatalogDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="secondary"><FolderPlus className="size-4" />Novo catálogo</Button></DialogTrigger>
      <DialogContent className="max-w-lg border-line bg-surface text-ink">
        <DialogHeader><DialogTitle className="font-serif text-2xl">Criar catálogo</DialogTitle><DialogDescription className="text-muted">Agrupe obras por série, universo, editora ou qualquer lógica sua.</DialogDescription></DialogHeader>
        <form action={createCatalog} className="mt-5 space-y-4">
          <div className="space-y-2"><Label htmlFor="catalog-name">Nome</Label><Input id="catalog-name" name="name" required maxLength={80} placeholder="Ex.: Série Marés do Norte" autoFocus /></div>
          <div className="space-y-2"><Label htmlFor="catalog-description">Descrição</Label><Textarea id="catalog-description" name="description" maxLength={500} rows={3} placeholder="O que reúne estas obras?" /></div>
          <div className="space-y-2"><Label htmlFor="catalog-color">Cor editorial</Label><select id="catalog-color" name="color" className="min-h-11 w-full rounded-control border border-line-strong bg-surface px-3 text-sm"><option value="sage">Sálvia</option><option value="ink">Tinta</option><option value="clay">Argila</option><option value="ochre">Ocre</option><option value="plum">Ameixa</option><option value="ocean">Oceano</option></select></div>
          <DialogFooter><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button><Button type="submit">Criar catálogo</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

