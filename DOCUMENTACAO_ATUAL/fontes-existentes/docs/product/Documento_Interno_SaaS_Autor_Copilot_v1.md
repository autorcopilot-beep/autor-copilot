# AUTOR COPILOT — Documento interno de produto e negócio

**Versão:** 1.0  
**Data:** 19 de setembro de 2026    
**Uso:** planejamento interno, produto, design, engenharia e operação

## 1. Resumo executivo

O Autor Copilot é uma plataforma SaaS para **planejar, escrever, revisar e compreender histórias longas**. Seu núcleo é um manuscrito conectado a uma base de conhecimento narrativa: personagens, identidades, relações, locais, eventos, regras, arcos e segredos. Uma referência `@Personagem` no texto aponta para uma entidade estável, mesmo quando seu nome muda. O sistema distingue aquilo que aconteceu no universo, aquilo que o leitor já descobriu e aquilo que cada personagem sabe.

**Promessa:** ajudar o autor a manter o controle criativo e a continuidade de uma obra complexa sem interromper a escrita. O editor deve funcionar como instrumento de escrita antes de funcionar como painel de análise. IA é um recurso opcional, com evidências e aprovação humana; nenhuma sugestão altera o cânone automaticamente.

**Cliente inicial proposto:** autores independentes de romances, fantasia, ficção científica e séries com múltiplos personagens; grupo piloto secundário de roteiristas e criadores de narrativas seriadas. Português brasileiro é o idioma inicial da experiência; arquitetura de internacionalização desde o começo.

**Tese de produto:** a ligação entre cena, entidade, evento e conhecimento cria uma experiência mais útil do que manter textos e planilhas separados. Essa tese precisa ser comprovada com autores reais. Há concorrência direta em escrita conectada e IA; a [Novelcrafter, por exemplo, oferece Codex, recursos de IA e colaboração em planos diferentes](https://www.novelcrafter.com/pricing). A diferenciação aqui é uma hipótese de execução: excelente experiência em português, cronologia e conhecimento por personagem, análise verificável e confiança no controle do autor.

## 2. Princípios e limites

1. **A obra pertence ao autor.** A plataforma recebe licença técnica limitada para armazenar, processar e exportar conteúdo conforme a função solicitada; não reivindica autoria nem direitos editoriais sobre o manuscrito.
2. **Escrever primeiro.** Abrir o projeto e começar a escrever deve ser possível sem completar fichas.
3. **O vínculo é estrutural.** Menções, presença, ponto de vista e conhecimento são dados distintos. Contar nomes no texto não equivale a medir participação.
4. **Cânone explícito.** Confirmado, hipótese, descartado, lacuna e contradição intencional têm estados separados e histórico de decisão.
5. **Toda análise aponta para evidências.** Cada alerta abre a cena, ficha ou evento pertinente e mostra o grau de confiança.
6. **Portabilidade real.** Exportação legível e estruturada é parte do produto, inclusive após cancelamento.
7. **Privacidade previsível.** IA e integrações mostram qual conteúdo será enviado e para quem; projeto privado é o padrão.
8. **Complexidade progressiva.** Campos avançados aparecem quando o autor precisa deles; acessibilidade e uso por teclado são requisitos transversais.

**Fora da primeira proposta:** marketplace aberto de terceiros, publicação de livros, rede social de leitores, venda de direitos, treinamento de modelos próprios com obras de usuários, geração automática de romances completos e colaboração simultânea em larga escala.

## 3. Segmentos, situações de uso e proposta comercial

| Segmento | Problema central | Valor principal | Momento provável de compra |
| --- | --- | --- | --- |
| Autor iniciante | Ideias e capítulos dispersos | Estrutura simples, orientação opcional, exportação | Ao iniciar um romance |
| Autor de séries | Continuidade entre volumes | Universo compartilhado, segredos, cronologia e relações | Ao planejar o segundo volume |
| Roteirista / equipe pequena | Múltiplas versões e decisões | Permissões, revisão, rastreio de mudanças | Ao trabalhar com editor/coautor |
| Editor / consultor narrativo | Revisão sem contexto completo | Comentários, relatórios com fontes e acesso restrito | Ao revisar uma obra externa |
| Criador de RPG / narrativa interativa | Lore e ramificações | Grafo, regras e acontecimentos vinculados | Expansão futura, após validar autores |

**Mensagem curta proposta:** “Escreva sua história. Mantenha seu universo conectado.”  
**Prova de valor na demonstração:** renomear uma identidade, abrir todas as cenas relacionadas e localizar uma revelação que aparece cedo demais; o sistema apresenta os trechos envolvidos, sem editar o livro sozinho.

## 4. Estrutura do produto

Hierarquia principal: **Conta → Espaço de trabalho → Universo/projeto → Obra → Parte → Capítulo → Cena**. Um universo pode conter vários livros, contos e entradas independentes. Um projeto simples pode conter apenas uma obra; o usuário não precisa entender a hierarquia completa para começar.

**Entidades centrais:** usuário, espaço, projeto, obra, parte, capítulo, cena, revisão, referência, personagem, identidade/alias, relação, lugar, organização, objeto, conceito, regra, evento, arco, segredo, fato conhecido, pesquisa, comentário, tarefa e arquivo. Cada entidade tem identificador estável, proprietário, datas de criação/edição e registros de mudança relevantes. As relações devem ter origem, destino, tipo e período narrativo, evitando que uma relação atual reescreva o passado.

**Três eixos de tempo independentes:** (a) ordem cronológica do universo; (b) ordem das cenas na obra; (c) ordem em que o leitor recebe uma informação. Datas exatas, intervalos, marcos relativos e eventos sem data devem coexistir. O sistema só alerta quando existem dados suficientes para justificar um conflito.

**Camadas de verdade:** fato canônico; hipótese do autor; versão descartada; crença do personagem; informação entregue ao leitor; contradição intencional. Uma identidade secreta pode ser visível ao autor e oculta numa visão compartilhada de leitura.

## 5. Módulos e ferramentas

### 5.1 Biblioteca e painel inicial

Projetos recentes, botão de continuar da última cena, estado das obras, tarefas abertas, metas opcionais e atividade recente. Assistente de criação oferece “começar em branco”, “importar manuscrito” e modelos leves por formato; nunca cria fichas obrigatórias. Busca global com filtros por projeto e tipo de entidade.

### 5.2 Editor de manuscrito

Autosave com estado visível; modo foco; temas e tipografia; navegação por cenas; títulos, estilos de parágrafo, itálico, negrito e separadores; atalhos; notas fora do texto publicável; contagens por seleção/cena/capítulo/obra; busca e substituição com confirmação; comentários ancorados; trechos descartados; versões e restauração; marcadores de revisão; visualização do manuscrito compilado. Exportações iniciais: Markdown, TXT e DOCX; PDF quando houver motor de composição validado. Importação gradual: Markdown/TXT primeiro, DOCX depois, com prévia dos capítulos identificados; Correção ortografica, Use de dicionarios ou alfbeto ficticio do universo.

**Requisito decisivo:** salvar conteúdo localmente durante perda de conexão, mostrar o que ainda falta sincronizar e oferecer resolução compreensível se dois dispositivos alterarem a mesma cena. Uma falha de sincronização nunca pode ser apresentada como “salvo”.

### 5.3 Referências inteligentes

Autocompletar `@` para personagens/entidades, atalhos para eventos, lugares e conceitos. O texto guarda a grafia escolhida e o ID da ficha. Apelidos e identidades alternativas apontam para o mesmo personagem; renomear a ficha oferece escolha entre preservar a grafia histórica e atualizar ocorrências selecionadas. O autor marca presença, menção e ponto de vista separadamente. Menções indiretas sugeridas por IA ficam pendentes de confirmação.

Caso o autor use pronomes de tratamente "Ele/Ela" o sistema pode reconhcer automaticamente e atirbuir ao personagem, ou o usuario pode selecinar o trecho a atribuir citação. Ou o `@` permite mascara texto para pronome.

### 5.4 Fichas e enciclopédia

Personagens: identidade, visual, personalidade, trajetória, objetivos, relações, capacidades/limites, conhecimentos, segredos e estados ao longo da narrativa. Lugares: descrição, acessos, habitantes, distâncias e mudanças no tempo. Organizações e culturas: integrantes, objetivos, hierarquia e eventos. Regras do mundo: enunciado, alcance, exceções e cenas que a demonstram. Objetos: posse, propriedades e passagem entre personagens. Campos personalizados e modelos compartilháveis sem perder os campos de vínculo essenciais.

### 5.5 Planejamento, relações e cronologia

Quadro de cenas; arcos; questões abertas e respostas planejadas; intensidade dramática definida pelo autor; mapa e lista de relações; três visões de cronologia; dependências entre eventos; datas relativas; intervalos de incerteza. Um alerta de continuidade deve incluir: alegação, dados usados, cenas relacionadas, confiança, ação “marcar como intencional” e opção “corrigir dados”.

### 5.6 Análise narrativa

Participação de personagens por cena/capítulo/obra; lacunas entre aparições; distribuição de pontos de vista; tamanho de cenas; arcos sem progressão registrada; relações pouco sustentadas no texto; segredos revelados cedo demais; inconsistências de nomes, estados, deslocamentos e regras. Separar **métrica objetiva** (por exemplo, 12 cenas marcadas com personagem presente) de **avaliação interpretativa** (por exemplo, possível reconciliação abrupta). Apresentar amostra, filtros e possibilidade de contestar um resultado.

### 5.7 Assistente opcional

Busca conversacional no projeto; resumo com referências; comparação de versões; perguntas sobre o conhecimento de um personagem em determinada cena; extração sugerida de fichas; checklist de continuidade; perguntas de aprofundamento; sugestões de estilo sob comando explícito. Cada ação informa o escopo lido e o eventual custo de créditos. “Aceitar” uma sugestão de texto ou ficha requer ação do autor e gera versão recuperável. Quando não houver base, responder que a informação não foi definida.

### 5.8 Revisão, colaboração e entrega

Passes de revisão por objetivo; tarefas ligadas a trechos; comentários e resolução; compartilhamento por obra, capítulo ou seleção; papéis autor, coautor, editor e leitor beta; histórico de mudanças; exportação parcial e total. Leitor beta pode comentar, nunca alterar o manuscrito ou o cânone. Convites expiram e acessos podem ser revogados. Exportação total inclui textos, fichas, vínculos e metadados em formato documentado, além de arquivos enviados conforme limites aplicáveis.

## 6. Extensões e plugins

“Plugin” deve significar uma **extensão instalável com permissões e versão próprias**, diferente de recurso nativo ou conexão com um serviço externo. No lançamento, os módulos abaixo podem ser recursos internos ativáveis. Abrir uma plataforma para terceiros exige revisão de segurança, contratos e suporte adicionais.

| Extensão proposta | Entrega | Fase | Permissões esperadas |
| --- | --- | --- | --- |
| Inspetor de continuidade | Checagens de datas, estados e conhecimento | Beta | Ler cenas/fichas do projeto |
| Mapa de relações | Grafo filtrável por volume e período | Beta | Ler personagens e relações |
| Planejador de arcos | Quadros e progressão por personagem/conflito | V1 | Ler/escrever planejamento |
| Controle de segredos | Quem sabe o quê e desde quando | V1 | Ler cenas e fatos; editar somente após aprovação |
| Oficina de estilo | Repetições, ritmo e sugestões opcionais | V1 | Ler trechos selecionados |
| Pesquisa e fontes | Links, arquivos e notas fora do cânone | V1 | Ler/escrever referências |
| Gerador de dossiês | Pacotes de fichas, sinopses e PDF | V1 | Ler itens selecionados; exportar |
| Templates de gênero | Campos sugeridos para fantasia, romance, suspense | V1 | Criar modelos no projeto |
| Narrativa ramificada | Escolhas, rotas e finais alternativos | Futuro | Ler/escrever estrutura de rotas |
| Ferramentas de roteiro | Formatação e estrutura audiovisual | Futuro | Ler/escrever obras específicas |
| API e marketplace | Extensões externas auditadas | Futuro | Escopos granulares, consentimento e logs |

**Modelo futuro para terceiros:** manifesto com nome, versão, escopos, responsável e política de privacidade; instalação por projeto; ambiente isolado; proibição de leitura ampla por padrão; aprovação antes de exportar dados a um serviço externo; revisão de segurança; revogação de token; logs para o autor; remoção sem perda do manuscrito. Monetização de plugins de terceiros só após verificar demanda e capacidade de suporte.

## 7. Conexões externas

| Conexão | Benefício | Modelo de acesso | Prioridade |
| --- | --- | --- | --- |
| Arquivo local DOCX/Markdown/TXT | Entrada e saída sem dependência de fornecedor | Upload/download explícito | Alta |
| Google Drive / Dropbox / OneDrive | Backup/exportação de cópia | OAuth com escopo mínimo e escolha da pasta | Média |
| Provedores de IA | Assistência opcional; escolha de provedor quando viável | Chave da plataforma com créditos ou chave própria, protegida | Média |
| Dicionário e revisão linguística | Ortografia e estilo em português | Serviço contratado ou processamento local | Média |
| Zotero / pesquisa | Organizar fontes usadas na obra | Importação de metadados ou link | Baixa |
| Obsidian / Notion | Entrada e saída de notas | Import/export antes de sincronização bidirecional | Baixa |
| Google Docs | Troca com editores externos | Exportação DOCX inicial; integração depois | Baixa |
| Calendário | Lembretes de meta de escrita | Opt-in, sem ler agenda geral | Baixa |
| Pagamentos | Assinaturas, recibos, cobrança e portal | Provedor especializado | Alta para lançamento pago |

**Regra:** não prometer sincronização bidirecional até definir origem da verdade, conflitos, limites de API e preço operacional. Conexões não devem obter acesso ao universo inteiro quando apenas um capítulo foi selecionado.

## 8. Planos e preços propostos

Valores abaixo são **hipóteses em reais para pesquisa e testes**, não tarifas de fornecedores nem preço final. A referência de categoria é a [página de planos da Novelcrafter](https://www.novelcrafter.com/pricing), que anuncia US$ 4, US$ 8, US$ 14 e US$ 20 por mês nos níveis exibidos em setembro de 2026; câmbio, impostos, escopo e localização impedem equivalência direta. Testar disposição de pagamento no Brasil antes de fixar preço.

| Plano | Preço mensal proposto | Público e limites sugeridos | IA |
| --- | ---: | --- | --- |
| Gratuito | R$ 0 | 1 projeto ativo, 1 obra, funções essenciais de escrita, fichas e exportação; limite de armazenamento justo a definir em teste | Sem créditos recorrentes, demonstração limitada |
| Essencial | R$ 24,90 | Projetos/obras sem limite artificial de quantidade sujeito a política de uso justo; histórico, referências e cronologia | Compra avulsa de créditos ou chave própria após validação |
| Criador | R$ 49,90 | Análises avançadas, segredos, versões detalhadas, modelos e importação ampliada | Franquia mensal pequena com teto de gasto; excedente opt-in |
| Estúdio | R$ 89,90 + assentos | Convites, permissões, comentários e gestão de equipe | Franquia por espaço e orçamento configurável |
| Educação/editoras | Sob proposta | Gestão institucional, contratos, suporte e controles adicionais | Orçamento e política de dados negociados |

**Anualidade experimental:** 10 meses cobrados por 12 de acesso; comunicar o valor anual total e condições de cancelamento. **Assentos extras:** preço a testar, sugerido R$ 19,90/mês por colaborador com edição; leitores beta sem custo até um limite razoável. Não cobrar para exportar obra ou recuperar dados após cancelar. Aplicar período de avaliação do plano Criador sem cartão caso o funil demonstre necessidade.

**Regra da IA:** não prometer “ilimitada”. Preço e franquia dependem de custo por chamada, tamanho do contexto, recuperação de trechos, armazenamento/indexação e margem. Manter limites de requisições e painel de consumo. Chave própria pode reduzir custo variável da plataforma, mas exige UX e segurança adequadas. Créditos não substituem acesso às funções básicas de escrita.

### 8.1 Economia unitária ilustrativa, sem orçamento fechado

Para simular um assinante de R$ 49,90/mês: receita bruta R$ 49,90; reservar **premissas**, não taxas confirmadas, de R$ 3,50 para pagamento/tributos transacionais, R$ 4,00 para hospedagem/armazenamento/backup, R$ 5,00 para IA média e R$ 2,00 para suporte e serviços por usuário. Contribuição ilustrativa antes de impostos sobre resultado, salários, aquisição de clientes e custos fixos: **R$ 35,40**. Alterar cada premissa com cotações reais e distribuição de uso. A pessoa que usa IA intensamente não deve tornar deficitária toda a base.

**Modelo de planilha a montar na validação:** MRR; usuários ativos; conversão gratuito→pago; ticket médio; receita líquida; custo de processamento; custo de IA por usuário e percentis; armazenamento; suporte; margem de contribuição; cancelamentos; recuperação de assinatura; CAC; tempo de retorno. Não estabelecer metas de crescimento ou CAC antes de ter canal de aquisição medido.

## 9. Licenças, direitos e condições comerciais

### 9.1 Licença do produto e propriedade intelectual

O usuário conserva os direitos sobre seus textos, universos, personagens e arquivos. Termos de uso devem conceder à empresa apenas as permissões necessárias para hospedar, exibir, sincronizar, processar por solicitação e gerar cópias/exportações. Explicar tratamento de projetos compartilhados, conteúdos enviados por coautores, remoção, retenção de backups e exportação após encerramento.

**Proposta comercial:** licença de acesso ao software por assinatura, pessoal ou por assento; proibição de revenda da conta e abuso de automação; política de uso justo para armazenamento e chamadas; reajuste e mudanças de planos comunicados previamente. Contratos institucionais podem exigir termos específicos de titularidade e confidencialidade. Revisão jurídica local antes de publicar termos.

### 9.2 Licenças de código, fontes, imagens e IA

Manter inventário de dependências com licença, versão, aviso de atribuição e política de atualização. Frameworks, ícones, fontes, bibliotecas de exportação e modelos têm regras distintas. Como candidato de editor, o [Lexical documenta arquitetura extensível e API sob licença MIT](https://lexical.dev/docs/api/); a licença e as dependências específicas devem ser verificadas no momento da adoção. Não presumir que uma biblioteca gratuita autoriza todos os recursos comerciais, nem combinar componentes sob copyleft forte sem avaliação. Contratar licenças de fontes/imagens de marketing quando necessárias. Conferir termos de cada provedor de IA para retenção, uso de dados, conteúdo proibido, localização e subcontratados.

### 9.3 Privacidade e conformidade

O produto tratará dados pessoais de conta, cobrança, colaboradores, logs e possivelmente informações pessoais inseridas em obras. Planejar bases legais, avisos transparentes, solicitação de acesso/correção/exclusão, retenção, segurança e gestão de operadores conforme a [LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm). Produzir política de privacidade, termos de uso, contrato de tratamento para clientes institucionais quando aplicável e registro de suboperadores. Avaliar transferência internacional, incidentes e dados sensíveis com orientação jurídica antes de operar comercialmente. Não apresentar este documento como parecer jurídico.

## 10. Segurança, confiabilidade e operação

**Conta:** login por e-mail e senha ou provedor confiável; verificação de e-mail; recuperação segura; MFA opcional inicialmente e exigível para administradores. **Autorização:** verificação no servidor em todo projeto e recurso; convites de curta duração; papéis e permissões explícitos. **Dados:** criptografia em trânsito e em repouso; backups automáticos; ensaio periódico de restauração; isolamento entre contas; limites de upload; varredura de arquivos; retenção definida. **Observabilidade:** registro de falhas sem gravar o texto do manuscrito em logs; métricas de sincronização e alertas de perda de dados; status operacional. **IA:** retenção mínima, escopo escolhido, proteção contra instruções maliciosas dentro do conteúdo, custos limitados e trilha de ações.

Políticas sugeridas como objetivos a validar: salvamento local após cada alteração; indicação de sincronização em segundos em conexão normal; versões recuperáveis por pelo menos 30 dias no plano pago; procedimento documentado de restauração. Esses são **objetivos de produto**, não garantias publicáveis antes de testes e infraestrutura.

**Suporte:** base de ajuda; canal por e-mail; triagem prioritária para perda de dados e cobrança; exportação de diagnóstico sem texto do livro; processo de incidentes; rota de encerramento de conta. Nunca apagar obra imediatamente por falha de pagamento sem período de recuperação e comunicação.

## 11. Arquitetura conceitual e ferramentas candidatas

**Cliente web responsivo:** editor acessível, cache local e sincronização; eventual aplicativo desktop só após medir demanda de escrita offline. **Serviço de aplicação:** autenticação/autorização, projetos, entidades, versões, exportações, faturamento, permissões e auditoria. **Armazenamento:** banco relacional para entidades e vínculos; objetos para imagens/anexos e backups; índice de busca para texto e referências. **Processos em fila:** importação/exportação, indexação, análise de continuidade e chamadas de IA. **Camada de IA:** seleção de trechos autorizados, recuperação contextual, orçamento, citações e revisão de resposta. **Telemetria:** eventos de produto sem capturar conteúdo criativo por padrão.

**Opções de implementação para comparar**, sem decisão fechada: Next.js/React para interface e aplicação, Lexical ou Tiptap para o editor, PostgreSQL para dados, armazenamento compatível com objetos, fila de tarefas e provedor de pagamentos com assinatura no Brasil. A escolha deve partir de protótipos que testem referências estruturais no editor, importação/exportação fiel e edição offline. Evitar adotar um banco de grafos antes de demonstrar que consultas relacionais não atendem aos casos de uso.

**Padrões de dados:** IDs estáveis; referências como nós tipados no documento; revisões imutáveis/snapshots; eventos de domínio para mudanças de cânone; migrações versionadas; exportação JSON documentada além de formatos legíveis. Manter a separação entre conteúdo publicado, notas privadas e material enviado à IA. Definir modelo de conflito e integridade antes de construir edição colaborativa em tempo real.

## 12. Experiência e direção visual

Interface limpa, fundo claro como padrão, opção escura, fonte de interface legível, poucos ícones e densidade ajustável. Navegação lateral com estrutura da obra; texto no centro; painel contextual recolhível à direita. Uma pessoa deve conseguir usar o editor apenas pelo teclado e com leitor de tela. Layout de fichas em seções recolhíveis, campos opcionais e foco na busca. Não cobrir o manuscrito com alertas enquanto o autor escreve; análises aparecem ao pedir revisão ou no painel apropriado.

Telas principais: entrada e biblioteca; criação/importação; área de escrita; ficha de personagem; relações; linha do tempo; planejamento por cartões; análise e evidências; revisão; exportação; configurações de privacidade, IA, membros e cobrança. Versão para celular prioriza consultar fichas, anotar e editar texto leve; escrita longa é otimizada inicialmente para desktop e tablet com teclado.

## 13. Caminhos de usuário que precisam funcionar

1. **Primeiros 10 minutos:** criar projeto → abrir cena vazia → escrever → criar personagem pelo `@` → ver texto salvo → exportar.
2. **Identidade secreta:** cadastrar personagem e alias → citar alias em cenas anteriores → manter vínculo privado → configurar ponto da revelação → conferir visão do leitor.
3. **Revisão de continuidade:** abrir capítulo → executar checagem → ver alerta com trechos e regra → confirmar, corrigir ou marcar mistério intencional.
4. **Importar obra existente:** subir DOCX → revisar divisão sugerida em capítulos/cenas → identificar personagens sem aplicar vínculo automaticamente → aprovar importação e comparar total de palavras.
5. **Colaboração:** convidar editor para uma obra → comentar trecho → responder e resolver → revogar acesso mantendo trilha de revisão.
6. **Falha de rede:** escrever sem conexão → visualizar estado local → reconectar → sincronizar sem perder texto → resolver divergência se houver.
7. **Saída do serviço:** cancelar → conservar leitura/exportação por período informado → baixar pacote completo utilizável.

## 14. Roadmap e critérios de passagem

| Etapa | Entrega | Critério para avançar |
| --- | --- | --- |
| Descoberta (2–4 semanas, hipótese) | 15–25 entrevistas, protótipo navegável, teste de importação e referências | Autores reconhecem problema e completam fluxo principal sem orientação extensa |
| Protótipo técnico | Editor, referências estruturais, autosave, exportação e prova offline | Sem perda de texto em testes de interrupção e conflitos controlados |
| MVP privado | Projetos, obras, cenas, fichas, `@`, busca, cronologia básica, versões e exportação | Grupo piloto escreve em projetos reais por semanas e consegue voltar regularmente |
| Beta pago | Planos, cobrança, suporte, análise objetiva e proteção operacional | Custos por usuário medidos; suporte e restauração exercitados; conversão observada |
| V1 | Conhecimento/segredos, análises com fonte, IA opcional, revisão e colaboração limitada | Benefício medido sem elevar erros de continuidade ou perda de confiança |
| Expansão | Mais idiomas, importações, integrações, API e plugins externos | Demanda demonstrada, documentação e segurança para ecossistema |

**Critérios de qualidade antes de cobrar:** restauração de backup comprovada; exportação completa; privacidade e termos publicados; fluxo de cancelamento funcional; preço e limites transparentes; canal de suporte; incidentes de sincronização monitorados.

## 15. Validação de mercado e aquisição

Entrevistar escritores que já usam ferramentas diferentes, autores que abandonaram apps de escrita e editores independentes. Observar tarefas concretas: achar quando um personagem descobriu um segredo, reorganizar um volume, exportar um capítulo e recuperar versão. Evitar perguntar apenas “você usaria?”. Testar página com proposta, protótipo interativo e intenção de pagamento antes de construir recursos caros.

**Canais a experimentar:** conteúdo educativo sobre continuidade narrativa; demonstrações em vídeo; comunidades de escritores com participação útil e sem spam; parcerias com cursos e leitores críticos; programa de indicação após confirmar retenção. Medir ativação pelo primeiro projeto com texto e ao menos uma ficha vinculada; valor percebido por retorno à escrita e uso de vínculos; retenção por autores que continuam produzindo, não somente contas cadastradas.

**Indicadores:** tempo até primeira cena; projetos com texto importado/escrito; taxa de primeiro `@`; cenas escritas por semana; retorno em 4/8 semanas; busca de referência; alertas aceitos/rejeitados; falhas de sync; conversão; churn; gasto mediano e P95 de IA; margem por plano. Obter consentimento para estudos com conteúdo de obras e usar dados agregados sempre que possível.

## 16. Riscos e respostas propostas

| Risco | Consequência | Resposta inicial |
| --- | --- | --- |
| Construir funcionalidades demais | MVP lento, editor mediano | Priorizar escrita, vínculo e continuidade verificável |
| Perder texto/sincronizar errado | Ruptura de confiança | Offline testado, versões, recuperação e sinal de estado inequívoco |
| IA inventar fatos | Cânone contaminado | Citações, incerteza explícita, aprovação e histórico |
| Custo de IA superar receita | Margem negativa | Franquias, orçamento, cache seguro, preços por uso medidos |
| Privacidade de manuscritos | Dano ao autor e à marca | Consentimento por ação, escopos mínimos, controle de terceiros |
| Importação/exportação imperfeita | Dependência indesejada | Prévia, comparação e pacote aberto versionado |
| Concorrência estabelecida | Aquisição cara | Validar nicho, experiência em português e uso recorrente |
| Plugins inseguros | Acesso excessivo a obras | Extensões internas primeiro; revisão e isolamento antes de abrir API |

## 17. Decisões pendentes e responsáveis sugeridos

| Decisão | Opções a testar | Responsável |
| --- | --- | --- |
| Nome e marca | Autor Copilot como codinome; testar nome definitivo e marca | Produto/Marca |
| Público do primeiro lançamento | Autor solo de fantasia/séries ou público amplo | Produto |
| Gratuito contínuo ou teste temporário | Freemium limitado versus 14–21 dias | Negócio |
| Teto de armazenamento e versões | Medir custo real e necessidades de manuscritos | Engenharia/Negócio |
| Editor base | Prova com documentos extensos e referências ancoradas | Engenharia |
| IA por franquia, avulso ou BYOK | Comparar custos, UX e demanda | Produto/Finanças |
| Motor de exportação PDF | Qualidade editorial exigida e custo | Produto/Engenharia |
| Papéis e colaboração em tempo real | Começar com revisão assíncrona | Produto/Engenharia |
| Provedor de pagamentos | Cobrança em BRL, recorrência, tributos e suporte | Finanças/Jurídico |
| Termos, políticas e retenção | Revisão jurídica e operacional | Jurídico/Operação |

## 18. Exemplo aplicado: A Cadeia da Existência

No universo da obra, Vida, Tempo e Morte são entidades ligadas ao equilíbrio. O autor cadastra uma lei sobre marcos irrevogáveis e registra quais escolhas humanas permanecem abertas. “Tempo” tem uma identidade humana alternativa; as cenas podem citar essa identidade sem revelar ao leitor a conexão antes do ponto planejado. A protagonista tem um estado de conhecimento diferente do leitor e de Tempo. A linha do tempo separa o momento de um acontecimento do capítulo em que ele é revelado.

Ao revisar a história, o autor pergunta: **“Em quais cenas ela descobre quem ele é, e quais cenas anteriores contradizem essa descoberta?”** O aplicativo lista eventos, cenas e trechos pertinentes; sinaliza apenas possíveis conflitos e permite marcar uma pista deliberada como contradição intencional. Esse é o caso de uso de demonstração mais valioso para testar o núcleo do produto.


---

### Fontes consultadas e natureza das afirmações

- [Novelcrafter — planos e recursos](https://www.novelcrafter.com/pricing): referência atual de categoria e preço anunciado; não é validação da demanda nem de preço brasileiro.
- [Lexical — documentação e licença da API](https://lexical.dev/docs/api/): candidato técnico; adoção depende de prova e revisão da versão usada.
- [LGPD — texto legal no Planalto](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm): base normativa geral; aplicação concreta exige revisão especializada.
- [Stripe — visão de assinaturas](https://docs.stripe.com/billing/subscriptions/overview): exemplo de provedor/fluxo de cobrança, sem decisão de contratação.

**Leitura do documento:** todas as funcionalidades futuras, cronogramas, preços e números econômicos são propostas internas sujeitas a teste. O material inicial do conceito, fornecido pelo criador, orientou os módulos narrativos e o exemplo de obra.
