import type { Json, Tables } from '@/types/database.generated';

export const communicationChannels = ['email', 'legal', 'changelog', 'knowledge', 'in_app', 'status', 'blog'] as const;
export type CommunicationChannel = (typeof communicationChannels)[number];
export type CampaignStatus = Tables<'communication_campaigns'>['status'];

export type ChannelDraft = {
  title: string;
  fields: Record<string, string | boolean>;
};

export type CampaignDraftInput = {
  internalName: string;
  title: string;
  summary: string;
  channels: CommunicationChannel[];
  tags: string[];
  audience: { accountStatus: string; plan: string; locale: string; operator: 'and' | 'or' };
  scheduledFor: string | null;
  timezone: string;
  items: Record<CommunicationChannel, ChannelDraft>;
};

export type CampaignOverview = Tables<'communication_campaigns'> & {
  communication_items: Array<Pick<Tables<'communication_items'>, 'id' | 'channel' | 'title' | 'slug' | 'public_path' | 'status' | 'payload' | 'published_at' | 'last_error'>>;
};

export type CommunicationComponent = Tables<'communication_components'>;
export type CommunicationMediaAsset = Tables<'communication_media_assets'>;
export type CommunicationCatalog = Tables<'communication_catalogs'>;

export const channelPublicBasePaths: Record<CommunicationChannel, string> = {
  email: '/newsletters',
  legal: '/legal',
  changelog: '/updates',
  knowledge: '/ajuda',
  in_app: '/comunicados',
  status: '/status',
  blog: '/blog',
};

export function slugifyPublication(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 120) || 'publicacao';
}

export function publicationPath(channel: CommunicationChannel, slug: string) {
  return `${channelPublicBasePaths[channel]}/${slug}`;
}

export type ChannelField = {
  key: string;
  label: string;
  kind?: 'text' | 'textarea' | 'select' | 'date' | 'datetime' | 'url' | 'checkbox';
  placeholder?: string;
  options?: string[];
  required?: boolean;
  maxLength?: number;
  wide?: boolean;
};

export type ChannelDefinition = {
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  fields: ChannelField[];
};

export const channelDefinitions: Record<CommunicationChannel, ChannelDefinition> = {
  email: {
    label: 'E-mail', shortLabel: 'E-mail', color: '#3d6e8c', description: 'Campanhas segmentadas, transacionais ou editoriais.',
    fields: [
      { key: 'subject', label: 'Assunto', required: true, maxLength: 120, wide: true },
      { key: 'preheader', label: 'Pré-header', maxLength: 160, wide: true },
      { key: 'sender', label: 'Remetente', kind: 'select', options: ['news@autorcopilot.com', 'produto@autorcopilot.com', 'legal@autorcopilot.com'] },
      { key: 'template', label: 'Template', kind: 'select', options: ['Carta editorial', 'Newsletter', 'Alerta crítico', 'Convite'] },
      { key: 'body', label: 'Corpo da mensagem', kind: 'textarea', required: true, wide: true },
      { key: 'attachments', label: 'Anexos', placeholder: 'URLs separadas por vírgula', wide: true },
    ],
  },
  legal: {
    label: 'Documento legal', shortLabel: 'Legal', color: '#b8863b', description: 'Versões jurídicas, vigência e consentimento obrigatório.',
    fields: [
      { key: 'document_type', label: 'Tipo', kind: 'select', options: ['Termos de Serviço', 'Política de Privacidade', 'SLA', 'DPA'] },
      { key: 'version', label: 'Versão semântica', placeholder: '2.4.0', required: true },
      { key: 'effective_date', label: 'Data de vigência', kind: 'date', required: true },
      { key: 'tldr', label: 'Resumo das mudanças', kind: 'textarea', required: true, wide: true },
      { key: 'body', label: 'Documento em Markdown', kind: 'textarea', required: true, wide: true },
      { key: 'forced_accept', label: 'Exigir novo aceite', kind: 'checkbox', wide: true },
    ],
  },
  changelog: {
    label: 'Changelog', shortLabel: 'Changelog', color: '#356b55', description: 'Atualizações do produto com impacto e mídia.',
    fields: [
      { key: 'product_version', label: 'Versão do produto', placeholder: '2.0.0', required: true },
      { key: 'category', label: 'Categoria', kind: 'select', options: ['Feature', 'Bugfix', 'Deprecation', 'Security'] },
      { key: 'impact', label: 'Impacto', kind: 'select', options: ['Minor', 'Major'] },
      { key: 'release_stage', label: 'Estágio', kind: 'select', options: ['Disponível', 'Beta', 'Acesso gradual', 'Em breve'] },
      { key: 'release_date', label: 'Data da versão', kind: 'date' },
      { key: 'headline', label: 'Mensagem principal', placeholder: 'O que mudou para quem usa o produto?', wide: true },
      { key: 'cover_url', label: 'Imagem ou GIF de capa', kind: 'url', placeholder: 'https://…' },
      { key: 'body', label: 'Notas da versão', kind: 'textarea', required: true, wide: true },
      { key: 'highlights', label: 'Destaques', kind: 'textarea', placeholder: 'Um destaque por linha', wide: true },
      { key: 'improvements', label: 'Melhorias', kind: 'textarea', placeholder: 'Uma melhoria por linha', wide: true },
      { key: 'fixes', label: 'Correções', kind: 'textarea', placeholder: 'Uma correção por linha', wide: true },
      { key: 'breaking_changes', label: 'Mudanças incompatíveis', kind: 'textarea', wide: true },
      { key: 'migration_notes', label: 'Orientações de migração', kind: 'textarea', wide: true },
      { key: 'known_issues', label: 'Limitações conhecidas', kind: 'textarea', wide: true },
      { key: 'availability', label: 'Disponibilidade', placeholder: 'Planos, grupos ou regiões' },
      { key: 'docs_url', label: 'Documentação', kind: 'url', placeholder: 'https://…' },
      { key: 'related_links', label: 'Links relacionados', placeholder: 'URLs separadas por vírgula', wide: true },
    ],
  },
  knowledge: {
    label: 'Base de conhecimento', shortLabel: 'Ajuda', color: '#675b9a', description: 'Guias pesquisáveis com blocos didáticos e responsáveis.',
    fields: [
      { key: 'category_path', label: 'Categoria', placeholder: 'Editor > Referências > Menções' },
      { key: 'keywords', label: 'Palavras-chave', placeholder: 'editor, personagem, contexto' },
      { key: 'maintainers', label: 'Responsáveis', placeholder: 'Produto, Suporte' },
      { key: 'feedback_enabled', label: 'Ativar “Útil / Não útil”', kind: 'checkbox' },
      { key: 'body', label: 'Conteúdo didático', kind: 'textarea', required: true, wide: true },
      { key: 'interactive_embed', label: 'Simulação, vídeo ou motion', kind: 'url', placeholder: 'https://…', wide: true },
    ],
  },
  in_app: {
    label: 'Mensagem no aplicativo', shortLabel: 'In-app', color: '#8b5e3c', description: 'Banners, modais e avisos contextuais dentro do produto.',
    fields: [
      { key: 'placement', label: 'Posicionamento', kind: 'select', options: ['Banner superior', 'Modal central', 'Toast lateral'] },
      { key: 'visible_title', label: 'Título visível', required: true, maxLength: 50 },
      { key: 'message', label: 'Mensagem', kind: 'textarea', required: true, maxLength: 200, wide: true },
      { key: 'cta_label', label: 'Texto do botão', maxLength: 30 },
      { key: 'cta_url', label: 'Destino do botão', kind: 'url', placeholder: '/write/editor' },
      { key: 'starts_at', label: 'Início', kind: 'datetime' },
      { key: 'expires_at', label: 'Expiração', kind: 'datetime' },
      { key: 'dismissible', label: 'Usuário pode dispensar', kind: 'checkbox' },
    ],
  },
  status: {
    label: 'Status e incidentes', shortLabel: 'Status', color: '#b84b4b', description: 'Linha do tempo de incidentes e manutenção de serviços.',
    fields: [
      { key: 'severity', label: 'Estado', kind: 'select', options: ['Investigando', 'Identificado', 'Monitorando', 'Resolvido'] },
      { key: 'impact', label: 'Impacto', kind: 'select', options: ['Degradado', 'Indisponível', 'Manutenção'] },
      { key: 'affected_services', label: 'Serviços afetados', placeholder: 'API, Editor, Banco de dados', wide: true },
      { key: 'body', label: 'Atualização da linha do tempo', kind: 'textarea', required: true, wide: true },
    ],
  },
  blog: {
    label: 'Blog e editorial', shortLabel: 'Blog', color: '#4e725a', description: 'Conteúdo público com autoria, acessibilidade e SEO.',
    fields: [
      { key: 'subtitle', label: 'Subtítulo', required: true, wide: true },
      { key: 'author', label: 'Autor visível', required: true },
      { key: 'slug', label: 'Slug', placeholder: 'nova-jornada-de-escrita', required: true },
      { key: 'excerpt', label: 'Resumo da vitrine', kind: 'textarea', required: true, wide: true },
      { key: 'body', label: 'Corpo do artigo', kind: 'textarea', required: true, wide: true },
      { key: 'cover_url', label: 'Imagem de capa', kind: 'url', placeholder: 'https://…' },
      { key: 'cover_alt', label: 'Texto alternativo da capa', required: true },
      { key: 'meta_title', label: 'Meta title', maxLength: 65 },
      { key: 'meta_description', label: 'Meta description', kind: 'textarea', maxLength: 160 },
      { key: 'og_image', label: 'Imagem social', kind: 'url', placeholder: 'https://…' },
    ],
  },
};

export function payloadAsRecord(payload: Json): Record<string, string | boolean> {
  if (!payload || Array.isArray(payload) || typeof payload !== 'object') return {};
  return Object.fromEntries(Object.entries(payload).filter(([, value]) => typeof value === 'string' || typeof value === 'boolean')) as Record<string, string | boolean>;
}
