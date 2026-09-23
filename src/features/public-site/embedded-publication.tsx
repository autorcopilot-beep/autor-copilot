'use client';
import { ConsentGate, openCookiePreferences } from './cookie-preferences';
export function EmbeddedPublication({ title, srcDoc }: { title: string; srcDoc: string }) {
  return <ConsentGate category="marketing" fallback={<section className="mx-auto max-w-xl px-6 py-20 text-center"><h1 className="font-serif text-3xl">{title}</h1><p className="my-6 text-sm leading-7 text-muted">Esta publicação contém HTML interativo e pode carregar mídia externa. Autorize a categoria Marketing e mídia externa para abrir o conteúdo.</p><button className="ac-button" onClick={openCookiePreferences}>Escolher preferências</button></section>}><iframe title={title} sandbox="allow-scripts" srcDoc={srcDoc} className="min-h-[75dvh] w-full flex-1 border-0 bg-white" /></ConsentGate>;
}
