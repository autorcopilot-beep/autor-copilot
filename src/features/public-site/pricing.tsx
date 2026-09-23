'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
const plans = [
  { name: 'Gratuito', price: 0, subtitle: 'Para dar o primeiro passo.', items: ['Conheça o ambiente de escrita', 'Comece a organizar sua história', 'Consulte as ferramentas liberadas'] },
  { name: 'Essencial', price: 24.9, subtitle: 'Para criar uma rotina.', items: ['Proposta para autores individuais', 'Foco em escrita e organização', 'Limites a confirmar no lançamento'] },
  { name: 'Criador', price: 49.9, subtitle: 'Para histórias que se expandem.', items: ['Proposta para múltiplas obras', 'Universos e contexto narrativo', 'Extensões conforme o catálogo'] },
  { name: 'Estúdio', price: 89.9, subtitle: 'Para projetos maiores.', items: ['Proposta para estúdios', 'Assentos com cobrança separada', 'Condições a confirmar no lançamento'] },
];
export function Pricing() {
  const [annual, setAnnual] = useState(false);
  const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return <section className="ac-section ac-pricing"><div className="ac-section-heading"><span className="ac-eyebrow">Planos em preparação</span><h1>Para cada fase<br />da sua escrita.</h1><p>Valores de referência da proposta de lançamento. A contratação e os benefícios finais ainda dependem da publicação comercial; esta página não realiza cobranças.</p></div><div className="ac-price-toggle" role="group" aria-label="Simulação de período"><button aria-pressed={!annual} onClick={() => setAnnual(false)}>Mensal</button><button aria-pressed={annual} onClick={() => setAnnual(true)}>Anual · 12 meses pelo valor de 10</button></div><div className="ac-pricing-grid">{plans.map((plan) => <article key={plan.name}><span className="ac-eyebrow">{plan.name}</span><h2>{money(annual ? plan.price * 10 : plan.price)}<small>/{annual ? 'ano' : 'mês'}</small></h2><p>{plan.subtitle}</p>{annual && plan.price > 0 && <small>Equivalente a {money(plan.price * 10 / 12)}/mês.</small>}<ul>{plan.items.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul><Link className="ac-button-secondary" href="/register">Conhecer a plataforma <ArrowUpRight size={14} /></Link></article>)}</div><p className="ac-pricing-note">A conta e o marketplace apresentam as liberações efetivas de cada usuário.</p></section>;
}
