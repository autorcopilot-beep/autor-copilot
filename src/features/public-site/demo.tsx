'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AtlasEncyclopedia, AtlasGraph, initialEntries } from './atlas-preview';
import { BookOpenText, Check, Link2, Volume2 } from 'lucide-react';

export function ProductDemo() {
  return <Suspense fallback={<div className="ac-demo p-12 text-center">Abrindo o estúdio…</div>}><StudioPreview /></Suspense>;
}
function StudioPreview() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') ?? '';
  const [selection, setSelection] = useState<{ view: string; index: number } | null>(null);
  const tab = selection?.view === view ? selection.index : Math.max(0, ['manuscrito', 'enciclopedia', 'universo', 'ambiente'].indexOf(view));
  const setTab = (index: number) => setSelection({ view, index });
  const [name, setName] = useState('Aurora');
  const [inspector, setInspector] = useState(true);
  const [saved, setSaved] = useState(false);
  const [entries, setEntries] = useState(initialEntries);
  const [chapter, setChapter] = useState(0);
  const chapters = ['A casa do farol', 'Cartas do norte', 'O outro lado'];
  const tabs = ['Manuscrito', 'Enciclopédia', 'Universo', 'Ambiente'];
  return <div className="ac-demo" aria-label="Demonstração interativa com dados de exemplo"><div className="ac-demo-top"><span><BookOpenText size={16} /> O atlas das marés</span><span className="ac-demo-label">EXEMPLO INTERATIVO</span><span><Check size={14} /> {saved ? 'Exemplo atualizado' : 'Explore à vontade'}</span></div>
    <div className="ac-demo-tabs" role="tablist" aria-label="Explorar demonstração">{tabs.map((label, index) => <button key={label} role="tab" id={`demo-tab-${index}`} aria-controls="demo-panel" aria-selected={tab === index} tabIndex={tab === index ? 0 : -1} onClick={() => setTab(index)} onKeyDown={(event) => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? 3 : (index + (event.key === 'ArrowRight' ? 1 : 3)) % 4; setTab(next); document.getElementById(`demo-tab-${next}`)?.focus(); } }}>{label}</button>)}</div>
    <div id="demo-panel" role="tabpanel" aria-labelledby={`demo-tab-${tab}`} className="ac-demo-body">
      {tab === 0 && <><aside className="ac-demo-tree"><span className="ac-eyebrow">Manuscrito</span>{chapters.map((title, index) => <button key={title} className={chapter === index ? "is-selected" : ""} onClick={() => setChapter(index)}>0{index + 1} · {title}</button>)}<small>Uma história em construção.</small></aside><article className="ac-demo-paper"><span className="ac-eyebrow">Capítulo um</span><h2>{chapters[chapter]}</h2><p>O mar devolvia tudo, menos as respostas.</p><p>Naquela manhã, <button className="ac-mention" onClick={() => setInspector(!inspector)} aria-expanded={inspector}>{name || 'Aurora'} <Link2 size={12} /></button> encontrou uma carta entre as pedras. Reconheceu a caligrafia antes mesmo de abrir o envelope.</p><p>Havia histórias que não terminavam. Apenas esperavam a maré certa.</p><span className="ac-demo-hint">Clique no nome para explorar a ficha →</span></article>{inspector && <aside className="ac-demo-inspector"><span className="ac-eyebrow">Ficha conectada</span><div className="ac-avatar-letter">{(name || 'A')[0]}</div><h3>{name || 'Aurora'}</h3><p>Cartógrafa · Costa do norte</p><label htmlFor="demo-name">Renomear personagem</label><input id="demo-name" value={name} maxLength={32} onChange={(event) => { setName(event.target.value); setSaved(true); }} /><small>O nome no trecho acompanha sua mudança. Esta demonstração não altera nenhuma obra.</small></aside>}</>}
      {tab === 1 && <AtlasEncyclopedia entries={entries.map((entry) => entry.id === 1 ? { ...entry, name: name || "Aurora" } : entry)} onCreate={(entry) => setEntries([...entries, entry])} />}
      {tab === 2 && <AtlasGraph entries={entries.map((entry) => entry.id === 1 ? { ...entry, name: name || "Aurora" } : entry)} />}
      {tab === 3 && <div className="ac-demo-universe"><Volume2 size={34} /><h2>Encontre o seu ritmo.</h2><p>Prévia dos controles de mixagem. O áudio está disponível dentro do workspace.</p><div className="ac-demo-mix">{['Chuva na janela', 'Mar ao longe', 'Lareira'].map((label, index) => <label key={label}>{label}<input type="range" min="0" max="100" defaultValue={70 - index * 20} aria-label={`Volume de ${label}`} /></label>)}</div></div>}
    </div><div className="ac-demo-bottom"><span>Uma amostra do seu futuro espaço.</span><span>Texto e personagens ilustrativos</span></div></div>;
}

