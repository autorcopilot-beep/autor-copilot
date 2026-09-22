import { AtSign, BarChart3, Focus, Headphones, ShieldCheck, Type } from 'lucide-react';

export type ExtensionId =
  | 'lab.context-mentions'
  | 'lab.immersive-focus'
  | 'lab.typewriter-mode'
  | 'lab.manuscript-metrics'
  | 'lab.reference-guardian'
  | 'lab.media-sound';

export type ExtensionCategory = 'editor' | 'narrative' | 'connectors' | 'styling';
export type ExtensionPriceModel = 'free' | 'one_time' | 'subscription' | 'pro_included';
export type ExtensionProductKind = 'extension' | 'plugin' | 'connector';

export type ExtensionManifest = {
  id: ExtensionId;
  name: string;
  version: string;
  author: string;
  productKind: ExtensionProductKind;
  category: ExtensionCategory;
  description: string;
  tags: string[];
  mediaUrl: string;
  mediaType: 'none' | 'gif' | 'mp4';
  priceModel: ExtensionPriceModel;
  priceCents: number;
  currency: string;
  performanceBudgetMs: number;
  runsLocallyOnly: boolean;
  featureFlag: string;
  features: string[];
  permissions: string[];
  icon: typeof AtSign;
};

export const extensionCatalog: ExtensionManifest[] = [
  { id: 'lab.context-mentions', name: 'Contexto por @', version: '1.1.0', author: 'Autor Copilot Lab', productKind: 'extension', category: 'editor', description: 'Vincule personagens, lugares e conceitos da Enciclopédia diretamente ao manuscrito.', tags: ['Enciclopédia', 'Contexto', 'PT-BR'], mediaUrl: '', mediaType: 'none', priceModel: 'free', priceCents: 0, currency: 'BRL', performanceBudgetMs: 2, runsLocallyOnly: true, featureFlag: 'extensions.context_mentions', features: ['Insere entidades com @ sem sair do texto', 'Abre o contexto completo da entidade citada', 'Exibe contagens, metadados e vínculos quebrados'], permissions: ['Ler a Enciclopédia da obra', 'Analisar referências no manuscrito'], icon: AtSign },
  { id: 'lab.immersive-focus', name: 'Foco Imersivo', version: '1.0.0', author: 'Autor Copilot Lab', productKind: 'extension', category: 'styling', description: 'Oculte painéis e controles e mantenha somente o texto durante a sessão.', tags: ['Foco', 'Editor'], mediaUrl: '', mediaType: 'none', priceModel: 'free', priceCents: 0, currency: 'BRL', performanceBudgetMs: 1, runsLocallyOnly: true, featureFlag: 'extensions.immersive_focus', features: ['Oculta navegação, manuscrito e inspetor', 'Centraliza a página ativa', 'Restaura o espaço de trabalho em um clique'], permissions: ['Alterar a apresentação do editor'], icon: Focus },
  { id: 'lab.typewriter-mode', name: 'Modo Máquina de Escrever', version: '1.0.0', author: 'Autor Copilot Lab', productKind: 'extension', category: 'editor', description: 'Mantenha a linha atual centralizada para reduzir o movimento dos olhos.', tags: ['Foco', 'Acessibilidade'], mediaUrl: '', mediaType: 'none', priceModel: 'free', priceCents: 0, currency: 'BRL', performanceBudgetMs: 2, runsLocallyOnly: true, featureFlag: 'extensions.typewriter_mode', features: ['Mantém a linha ativa no centro', 'Acompanha o cursor durante a digitação', 'Pode ser alternado por atalho'], permissions: ['Observar a posição do cursor'], icon: Type },
  { id: 'lab.manuscript-metrics', name: 'Métricas do Manuscrito', version: '1.0.0', author: 'Autor Copilot Lab', productKind: 'extension', category: 'narrative', description: 'Acompanhe palavras, caracteres, metas e referências em tempo real.', tags: ['Métricas', 'Produtividade'], mediaUrl: '', mediaType: 'none', priceModel: 'free', priceCents: 0, currency: 'BRL', performanceBudgetMs: 3, runsLocallyOnly: true, featureFlag: 'extensions.manuscript_metrics', features: ['Conta palavras e caracteres', 'Compara o capítulo com a meta', 'Resume entidades citadas'], permissions: ['Analisar o texto aberto', 'Ler a meta do capítulo'], icon: BarChart3 },
  { id: 'lab.reference-guardian', name: 'Guardião de Referências', version: '1.0.0', author: 'Autor Copilot Lab', productKind: 'extension', category: 'narrative', description: 'Encontre vínculos órfãos e confira a distribuição das entidades citadas.', tags: ['Continuidade', 'Revisão'], mediaUrl: '', mediaType: 'none', priceModel: 'free', priceCents: 0, currency: 'BRL', performanceBudgetMs: 4, runsLocallyOnly: true, featureFlag: 'extensions.reference_guardian', features: ['Sinaliza entidades removidas ou renomeadas', 'Agrupa citações por tipo', 'Ajuda a reconciliar o cânone da obra'], permissions: ['Ler referências do manuscrito', 'Comparar referências com a Enciclopédia'], icon: ShieldCheck },
  { id: 'lab.media-sound', name: 'Autor Copilot Media & Sound', version: '1.1.0', author: 'Autor Copilot Sound Lab', productKind: 'extension', category: 'narrative', description: 'Atmosferas oficiais, acervo sonoro e mixer integrado diretamente ao ambiente de escrita.', tags: ['Áudio', 'Foco', 'Paisagens sonoras', 'Audiolivro'], mediaUrl: '', mediaType: 'none', priceModel: 'free', priceCents: 0, currency: 'BRL', performanceBudgetMs: 5, runsLocallyOnly: false, featureFlag: 'extensions.media_sound', features: ['Seis sessões sonoras oficiais', 'Nove camadas nativas geradas no navegador', 'Mixer integrado à obra em curso', 'Acervo editorial de faixas e audiolivros'], permissions: ['Reproduzir áudio no navegador', 'Salvar preferências sonoras', 'Ler arquivos do catálogo oficial'], icon: Headphones },
];

export const extensionRuntimeStorageKey = 'autor-copilot:extension-runtime';

export type ExtensionRuntimeState = Record<ExtensionId, boolean>;

export const defaultExtensionRuntime: ExtensionRuntimeState = {
  'lab.context-mentions': false,
  'lab.immersive-focus': false,
  'lab.typewriter-mode': false,
  'lab.manuscript-metrics': false,
  'lab.reference-guardian': false,
  'lab.media-sound': false,
};

export function parseExtensionRuntime(value: string | null): ExtensionRuntimeState {
  if (!value) return defaultExtensionRuntime;
  try {
    const parsed = JSON.parse(value) as Partial<ExtensionRuntimeState>;
    return Object.fromEntries(Object.keys(defaultExtensionRuntime).map((id) => [id, parsed[id as ExtensionId] === true])) as ExtensionRuntimeState;
  } catch {
    return defaultExtensionRuntime;
  }
}

export const extensionCategoryLabels: Record<ExtensionCategory, string> = {
  editor: 'Extensões do editor',
  narrative: 'Processo e narrativa',
  connectors: 'Conectores e nuvem',
  styling: 'Aparência e foco',
};
