import type { EncyclopediaEntryType } from '@/features/writing/types';

export type WorldbuildingAnswer = string | string[] | boolean;
export type WorldbuildingQuestion = {
  id: string;
  label: string;
  kind: 'text' | 'textarea' | 'list' | 'check' | 'select' | 'multiselect';
  hint?: string;
  options?: string[];
};
export type WorldbuildingSection = { id: string; title: string; description: string; questions: WorldbuildingQuestion[] };
export type EntryTemplate = { id: string; type: EncyclopediaEntryType; label: string; description: string; sections: WorldbuildingSection[] };

const q = (id: string, label: string, kind: WorldbuildingQuestion['kind'], hint?: string, options?: string[]): WorldbuildingQuestion => ({ id, label, kind, hint, options });

export const entryTemplates: EntryTemplate[] = [
  { id: 'character-core', type: 'character', label: 'Personagem', description: 'Psicologia, arco, corpo e relações de fricção.', sections: [
    { id: 'identity', title: 'Corpo e identidade', description: 'O corpo também conta a história do mundo.', questions: [
      q('morphology', 'Morfologia e aparência física', 'textarea'), q('adaptation', 'Como o corpo se adaptou ao ambiente?', 'textarea'), q('status_markers', 'Quais marcas físicas revelam status, origem ou ofício?', 'list'), q('voice', 'Como fala, pensa e escolhe palavras?', 'textarea'),
    ] },
    { id: 'psychology', title: 'Motor dramático', description: 'Ferida, mentira, necessidade e desejo formam a tensão interna.', questions: [
      q('ghost_wound', 'Fantasma ou ferida ancorada no mundo', 'textarea'), q('lie', 'Mentira em que acredita', 'textarea'), q('need', 'Do que realmente precisa', 'textarea'), q('want', 'O que quer ou qual objetivo persegue', 'textarea'), q('archetype', 'Arquétipo ou Eneagrama', 'text'), q('arc', 'Arco predominante', 'select', undefined, ['Transformação', 'Queda', 'Redenção', 'Estabilidade', 'Desilusão', 'A descobrir']),
    ] },
    { id: 'relationships', title: 'Relações de fricção', description: 'Foils e vínculos tornam contradições observáveis.', questions: [
      q('foils', 'Personagens-espelho ou foils', 'list'), q('frictions', 'Relações que produzem conflito', 'list'), q('loyalties', 'Lealdades, dívidas e dependências', 'list'), q('secret', 'Guarda um segredo capaz de mudar a trama?', 'check'),
    ] },
  ] },
  { id: 'settlement', type: 'location', label: 'Local ou assentamento', description: 'Geografia causal, recursos, urbanismo e ameaças.', sections: [
    { id: 'geography', title: 'Leis geográficas', description: 'O terreno precisa explicar água, clima, circulação e ocupação.', questions: [
      q('hydrology', 'Convergência hidrológica: de onde vem e para onde vai a água?', 'textarea'), q('rain_shadow', 'Sombra de chuva e efeito do relevo no clima', 'textarea'), q('tectonics', 'Dinâmica tectônica, relevo e riscos naturais', 'textarea'), q('biomes', 'Biomas e transições ecológicas', 'list'),
    ] },
    { id: 'settlement', title: 'Assentamento', description: 'A cidade existe por uma razão e paga um preço por existir ali.', questions: [
      q('etymology', 'Nomenclatura e etimologia', 'text'), q('founding_imperative', 'Imperativo de fundação', 'textarea'), q('economy', 'Base econômica e recursos', 'list'), q('imports', 'Vulnerabilidades e importações essenciais', 'list'), q('architecture', 'Arquitetura, planejamento urbano e expressão de classe', 'textarea'), q('threats', 'Ameaças endêmicas', 'list'), q('sensations', 'Impressões sensoriais ao chegar', 'list'), q('access', 'Rotas de entrada, saída e isolamento', 'textarea'),
    ] },
  ] },
  { id: 'culture', type: 'organization', label: 'Cultura ou organização', description: 'Agenda, hierarquia, valores, logística e alianças.', sections: [
    { id: 'agenda', title: 'Agenda e poder', description: 'Separe o discurso público do objetivo real.', questions: [
      q('public_agenda', 'Agenda pública', 'textarea'), q('secret_goal', 'Objetivo secreto', 'textarea'), q('hierarchy', 'Hierarquia e cadeia de comando', 'textarea'), q('scope', 'Alcance', 'select', undefined, ['Local', 'Regional', 'Continental', 'Global', 'Clandestino']),
    ] },
    { id: 'culture', title: 'Cultura e logística', description: 'Valores só sobrevivem quando recursos e práticas os sustentam.', questions: [
      q('values', 'Valores, tabus e ritos', 'list'), q('assets', 'Ativos e recursos logísticos', 'list'), q('methods', 'Métodos de atuação', 'list'), q('rivalries', 'Rivalidades', 'list'), q('alliances', 'Alianças', 'list'), q('public', 'É conhecida publicamente?', 'check'),
    ] },
  ] },
  { id: 'dynasty', type: 'organization', label: 'Dinastia ou família', description: 'Sucessão, casamentos, heranças e traços transmitidos.', sections: [
    { id: 'lineage', title: 'Linhagem e sucessão', description: 'O parentesco funciona como estrutura política.', questions: [
      q('family_tree', 'Árvore familiar e ramos da linhagem', 'textarea'), q('succession', 'Regra de sucessão', 'textarea'), q('strategic_marriages', 'Casamentos estratégicos', 'list'), q('traits', 'Traços genéticos ou mágicos herdáveis', 'list'), q('disputed_inheritance', 'Heranças disputadas', 'list'),
    ] },
    { id: 'power', title: 'Poder dinástico', description: 'Registre o que a família mostra, esconde e controla.', questions: [
      q('public_agenda', 'Agenda pública', 'textarea'), q('secret_goal', 'Objetivo secreto', 'textarea'), q('assets', 'Terras, títulos, monopólios e aliados', 'list'), q('rivalries', 'Rivais históricos', 'list'),
    ] },
  ] },
  { id: 'artifact', type: 'object', label: 'Artefato', description: 'Origem, custo, mecanismo, rastreabilidade e disputa.', sections: [
    { id: 'artifact', title: 'Checklist do artefato', description: 'O objeto precisa de uma história material e consequências observáveis.', questions: [
      q('genesis', 'Gênese ou processo de fabricação', 'textarea'), q('cost', 'Custo real e consequências do uso', 'textarea'), q('mechanic', 'Mecânica operacional exata', 'textarea'), q('traceability', 'Como pode ser rastreado, identificado ou protegido?', 'textarea'), q('seekers', 'Organizações e pessoas que o procuram', 'list'), q('owners', 'Portadores anteriores', 'list'), q('unique', 'É único no mundo?', 'check'),
    ] },
  ] },
  { id: 'magic-system', type: 'concept', label: 'Sistema mágico ou tecnologia', description: 'Compreensão, limitações e impacto social segundo as três leis.', sections: [
    { id: 'sanderson', title: 'Três leis de Sanderson', description: 'Defina o que o leitor entende, o que limita e como o sistema se aprofunda.', questions: [
      q('comprehension', 'Lei 1: o que o leitor compreende e o que permanece misterioso?', 'textarea'), q('hardness', 'Grau do sistema', 'select', undefined, ['Suave', 'Híbrido', 'Rígido']), q('limitations', 'Lei 2: limitações, custos e fraquezas', 'list'), q('expansion', 'Lei 3: como aprofundar o que já existe em vez de adicionar poderes?', 'textarea'), q('social_implications', 'Implicações sociais, econômicas, políticas e militares', 'textarea'), q('exceptions', 'Exceções conhecidas e por que não anulam as regras', 'list'),
    ] },
  ] },
  { id: 'world-concept', type: 'concept', label: 'Conceito, fé ou lei', description: 'Ideias que grupos interpretam de formas diferentes.', sections: [
    { id: 'concept', title: 'Manifestação e disputa', description: 'Registre a regra e também quem acredita nela.', questions: [
      q('definition', 'Definição operacional', 'textarea'), q('origin', 'Origem, formulador ou descoberta', 'textarea'), q('domains', 'Onde se aplica', 'list'), q('exceptions', 'Exceções e controvérsias', 'list'), q('believers', 'Grupos que aceitam esta ideia', 'list'), q('dissenters', 'Grupos que a rejeitam', 'list'),
    ] },
  ] },
  { id: 'historical-event', type: 'event', label: 'Evento histórico', description: 'Camadas de memória, causas, versões e consequências.', sections: [
    { id: 'event', title: 'Cronologia estratificada', description: 'Separe o acontecimento da memória construída sobre ele.', questions: [
      q('event_kind', 'Natureza do evento', 'select', undefined, ['Desastre natural ou epidemia', 'Guerra ou tratado', 'Ascensão ou queda de reino', 'Transição dinástica', 'Ruptura metafísica', 'Outro']), q('period', 'Data, período e duração', 'text'), q('causes', 'Causas e pressões anteriores', 'list'), q('participants', 'Participantes e testemunhas', 'list'), q('consequences', 'Consequências imediatas e de longo prazo', 'list'), q('mythic_layer', 'Camada mítica', 'textarea'), q('documented_layer', 'Camada documentada', 'textarea'), q('recent_layer', 'Memória recente', 'textarea'), q('emic_version', 'Versão êmica: como os envolvidos explicam?', 'textarea'), q('etic_version', 'Versão ética/externa: o que os registros permitem afirmar?', 'textarea'),
    ] },
  ] },
  { id: 'war-treaty', type: 'event', label: 'Guerra ou tratado', description: 'Causa declarada, causa real, vencedor e revanchismo.', sections: [
    { id: 'war', title: 'Anatomia do conflito', description: 'Documente a justificativa política e o custo histórico.', questions: [
      q('declared_casus_belli', 'Casus belli declarado', 'textarea'), q('real_casus_belli', 'Casus belli real ou fabricado', 'textarea'), q('factions', 'Facções envolvidas', 'list'), q('winner', 'Vencedor formal e vencedor real', 'textarea'), q('reparations', 'Reparações, concessões e novas fronteiras', 'list'), q('revanchism', 'Movimentos revanchistas gerados', 'list'), q('mythic_layer', 'Como virou mito?', 'textarea'), q('documented_layer', 'O que os documentos registram?', 'textarea'),
    ] },
  ] },
];

export const methodologyOptions = [
  { id: 'top_down', label: 'De cima para baixo', description: 'Comece por cosmologia, história ampla e sistemas; depois aproxime a lente.' },
  { id: 'bottom_up', label: 'De baixo para cima', description: 'Comece por personagem, lugar e conflito concretos; expanda quando a trama exigir.' },
  { id: 'inside_out', label: 'De dentro para fora', description: 'Construa um núcleo narrativo e alterne detalhe local com implicações sistêmicas.' },
] as const;

export const miceOptions = [
  { id: 'milieu', label: 'Milieu', description: 'A entrada, exploração e saída de um ambiente organizam a história.' },
  { id: 'idea', label: 'Ideia', description: 'Uma pergunta, mistério ou descoberta move a construção do mundo.' },
  { id: 'character', label: 'Personagem', description: 'Transformação, identidade e relações orientam quais detalhes importam.' },
  { id: 'event', label: 'Evento', description: 'Uma ruptura da ordem exige restauração, mudança ou novo equilíbrio.' },
] as const;

export const genreModules: WorldbuildingSection[] = [
  { id: 'epic_science_fantasy', title: 'Fantasia épica ou científica', description: 'Sistemas vastos precisam produzir efeitos econômicos, geográficos, religiosos e biológicos.', questions: [
    q('systemic_magic', 'A magia/tecnologia altera economia, trabalho e guerra de forma sistêmica?', 'check'), q('geomorphology', 'Geomorfologia, escassez e colonização produzem fronteiras ou preconceitos?', 'textarea'), q('fractured_gods', 'Deuses, dogmas e lendas mudam por nação ou classe?', 'textarea'), q('adaptive_ecology', 'Fauna, flora e genética se adaptam ao sistema do mundo?', 'textarea'),
  ] },
  { id: 'hard_scifi_cyberpunk', title: 'Ficção científica hard ou cyberpunk', description: 'Logística e tecnologia devem pressionar a sociedade.', questions: [
    q('space_logistics', 'Escassez, transporte e logística espacial', 'textarea'), q('latency', 'Latência de comunicação no vácuo e fragmentação política', 'textarea'), q('tech_precipice', 'Precipício tecnológico: dados, implantes, vigilância e opressão', 'textarea'),
  ] },
  { id: 'romantasy', title: 'Romantasia', description: 'O mundo precisa tensionar e aproximar o par romântico.', questions: [
    q('institutional_friction', 'Instituição, tabu ou lei que proíbe ou dificulta a relação', 'textarea'), q('forced_proximity', 'Como a geografia força proximidade?', 'textarea'), q('scale_pacing', 'Como equilibrar escala épica e ritmo íntimo?', 'textarea'),
  ] },
  { id: 'mystery_historical', title: 'Mistério ou histórico', description: 'A investigação depende de evidência redundante e instituições concretas.', questions: [
    q('three_clue_rule', 'Regra das três pistas: registre ao menos três fontes independentes', 'list'), q('legal_structure', 'Estrutura legal, procedimentos e autoridades', 'textarea'), q('corruption', 'Corrupção, punições, testemunhas e limites da prova', 'textarea'),
  ] },
];

export const loreArchitecture: WorldbuildingSection[] = [
  { id: 'meta', title: 'Meta', description: 'Visão, tom e pilares que orientam decisões.', questions: [q('vision', 'Visão da obra', 'textarea'), q('tone', 'Tom e promessa de leitura', 'textarea'), q('pillars', 'Pilares inegociáveis', 'list')] },
  { id: 'lexicon', title: 'Léxico', description: 'Dicionário e folha de estilo do universo.', questions: [q('dictionary', 'Termos, grafias e significados', 'list'), q('style_sheet', 'Regras de nomenclatura e estilo', 'textarea')] },
  { id: 'cosmology', title: 'Cosmologia prática', description: 'Metafísica ligada ao que personagens podem observar e fazer.', questions: [q('mechanics', 'Mecânicas cosmológicas', 'textarea'), q('evidence', 'Evidências, limites e interpretações concorrentes', 'list')] },
  { id: 'political_atlas', title: 'Atlas político', description: 'Fronteiras dinâmicas, disputas e circulação.', questions: [q('borders', 'Fronteiras atuais e contestadas', 'textarea'), q('powers', 'Poderes, rotas e zonas de influência', 'list')] },
  { id: 'groups', title: 'Indivíduos e grupos', description: 'Relações mudam o mundo no presente narrativo.', questions: [q('dynamics', 'Dinâmicas entre indivíduos, culturas e organizações', 'textarea')] },
  { id: 'timelines', title: 'Linhas do tempo', description: 'Camadas mítica, documentada e recente.', questions: [q('mythical', 'Tempo mítico', 'textarea'), q('documented', 'Tempo documentado', 'textarea'), q('recent', 'Tempo recente', 'textarea')] },
];

export const povDistances = [
  { level: 1, label: 'Objetivo remoto', example: 'A cena é observada de fora, sem acesso ao pensamento.' },
  { level: 2, label: 'Foco dirigido', example: 'A narração acompanha o que o personagem nota.' },
  { level: 3, label: 'Subjetividade controlada', example: 'Percepção e julgamento já colorem a prosa.' },
  { level: 4, label: 'Voz íntima', example: 'Sintaxe e vocabulário pertencem ao personagem.' },
  { level: 5, label: 'Fluxo sensorial bruto', example: 'Pensamento, sensação e linguagem quase se confundem.' },
] as const;

export const foundationPresets = [
  { id: 'character-first', label: 'Personagem primeiro', description: 'Parte do conflito íntimo e expande o mundo quando a trama pedir.', methodology: 'bottom_up', miceFocus: 'character', genres: [] as string[], povMode: 'third_limited', assets: ['character-core', 'relationship-map', 'voice-sheet'], accent: 'Da pessoa para o mundo' },
  { id: 'epic-architecture', label: 'Universo épico', description: 'Organiza sistemas, história, geografia e poder antes de aproximar a lente.', methodology: 'top_down', miceFocus: 'milieu', genres: ['epic_science_fantasy'], povMode: 'multiple', assets: ['world-atlas', 'timeline-layers', 'magic-system'], accent: 'Do sistema para a cena' },
  { id: 'mystery-grid', label: 'Mistério investigativo', description: 'Estrutura pergunta, evidências redundantes, instituições e revelações.', methodology: 'inside_out', miceFocus: 'idea', genres: ['mystery_historical'], povMode: 'third_limited', assets: ['clue-board', 'event-timeline', 'evidence-checklist'], accent: 'Da pergunta para a verdade' },
  { id: 'romantic-tension', label: 'Romance e tensão', description: 'Constrói o mundo pelas forças que aproximam, separam e transformam o par.', methodology: 'bottom_up', miceFocus: 'character', genres: ['romantasy'], povMode: 'multiple', assets: ['relationship-map', 'emotional-arc', 'proximity-map'], accent: 'Do vínculo para o conflito' },
] as const;

export const foundationAssetLabels: Record<string, string> = {
  'character-core': 'Ficha central de personagem', 'relationship-map': 'Mapa de relações', 'voice-sheet': 'Folha de voz',
  'world-atlas': 'Atlas do universo', 'timeline-layers': 'Linha do tempo em camadas', 'magic-system': 'Checklist de sistema',
  'clue-board': 'Quadro de pistas', 'event-timeline': 'Cronologia de eventos', 'evidence-checklist': 'Regra das três pistas',
  'emotional-arc': 'Arco emocional', 'proximity-map': 'Mapa de proximidade forçada',
};

export function templatesForType(type: EncyclopediaEntryType) {
  return entryTemplates.filter((template) => template.type === type);
}

export function templateById(id: string, fallbackType: EncyclopediaEntryType = 'character') {
  return entryTemplates.find((template) => template.id === id) ?? templatesForType(fallbackType)[0];
}
