#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Scaffold: página pública "/legal" (biblioteca de documentos legais)
 * Autor Copilot
 *
 * Como usar:
 *   1. Copie este arquivo para a raiz do repositório (autor-copilot/).
 *   2. Rode:  node scaffold-legal-pages.js
 *   3. Copie os 8 PDFs (fornecidos junto com este script) para: public/legal/pdfs/
 *   4. Rode `npm run dev` e acesse /legal
 *
 * Pressupostos (ajuste se não bater com seu projeto):
 *   - Next.js App Router, TypeScript, Tailwind CSS já configurados.
 *   - Se o projeto usar JavaScript puro, renomeie os arquivos gerados
 *     de .tsx/.ts para .jsx/.js e remova as anotações de tipo.
 *   - Não sobrescreve nada: se um arquivo já existir, ele é pulado
 *     e avisado no console (rode de novo depois de renomear/apagar
 *     o antigo se quiser forçar a substituição).
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

function writeFile(relPath, content) {
  const fullPath = path.join(ROOT, relPath);
  if (fs.existsSync(fullPath)) {
    console.log(`  [pulado] já existe: ${relPath}`);
    return;
  }
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, "utf8");
  console.log(`  [criado] ${relPath}`);
}

console.log("Gerando página pública /legal ...\n");

// ---------------------------------------------------------------------------
// 1. Conteúdo dos documentos legais (edite aqui: datas, textos, relações)
// ---------------------------------------------------------------------------
const documents = [
  {
    slug: "termos-de-uso",
    title: "Termos de Uso",
    shortDescription: "Regras de uso da Plataforma, planos, contas e responsabilidades.",
    updatedAt: "2026-09-20",
    department: "Jurídico & Produto",
    relatedFeatures: ["Toda a Plataforma", "Cadastro e conta", "Planos e cobrança"],
    pdfHref: "/legal/pdfs/termos-de-uso.pdf",
    sections: [
      { heading: "1. Aceitação", paragraphs: ["Ao criar uma conta ou usar o Autor Copilot (\"Plataforma\"), o usuário concorda com estes Termos de Uso e com a Política de Privacidade, a Política de Direitos Autorais e Propriedade Intelectual e a Política de Uso de Inteligência Artificial, que a eles se integram por referência. Caso não concorde, o usuário não deve utilizar a Plataforma."] },
      { heading: "2. Descrição do serviço", paragraphs: ["O Autor Copilot é uma plataforma para planejar, escrever, revisar e compreender histórias longas, incluindo editor de manuscrito, base de conhecimento narrativa (personagens, lugares, eventos, regras), referências estruturais e recursos opcionais de inteligência artificial. Recursos podem variar por plano contratado e podem ser adicionados, alterados ou descontinuados mediante aviso prévio razoável."] },
      { heading: "3. Cadastro e conta", paragraphs: ["O usuário deve fornecer informações verdadeiras no cadastro, manter a confidencialidade de suas credenciais e comunicar imediatamente qualquer uso não autorizado de sua conta. Contas administradas por menores de idade dependem de representação legal, conforme a legislação aplicável."] },
      { heading: "4. Propriedade da obra do usuário", paragraphs: ["O usuário conserva integralmente os direitos autorais e de propriedade intelectual sobre os textos, universos, personagens e demais conteúdos que criar ou enviar (\"Conteúdo do Usuário\"). A Plataforma não reivindica autoria, coautoria nem qualquer direito editorial sobre o Conteúdo do Usuário."] },
      { heading: "5. Licença concedida à Plataforma", paragraphs: ["O usuário concede à empresa uma licença limitada, não exclusiva e revogável para hospedar, armazenar, processar, exibir, sincronizar entre dispositivos e gerar cópias/exportações do Conteúdo do Usuário, estritamente para operar as funcionalidades solicitadas."] },
      { heading: "6. Planos, preços e pagamento", paragraphs: ["Os planos, preços e limites vigentes são exibidos na Plataforma no momento da contratação. Alterações de preço são comunicadas com antecedência e não se aplicam retroativamente a períodos já pagos."] },
      { heading: "7. Colaboração e compartilhamento", paragraphs: ["Projetos podem ser compartilhados com coautores, editores e leitores beta, cada qual com papel e permissões próprios. Leitor beta pode comentar, mas não altera o manuscrito nem o cânone da obra."] },
      { heading: "8. Uso aceitável", paragraphs: ["É vedado: violar direitos de terceiros; enviar conteúdo ilícito; tentar acessar dados de outras contas; realizar engenharia reversa da Plataforma; revender ou sublicenciar o acesso; automatizar abusivamente chamadas ao serviço."] },
      { heading: "9. Disponibilidade e isenções", paragraphs: ["A Plataforma é fornecida \"como está\" e \"conforme disponibilidade\". A empresa não garante ausência total de falhas, mas se compromete com salvamento local, versões recuperáveis e comunicação clara em caso de incidente."] },
      { heading: "10. Limitação de responsabilidade", paragraphs: ["Na máxima extensão permitida pela lei brasileira, a responsabilidade total da empresa fica limitada ao valor pago pelo usuário nos doze meses anteriores ao evento, ressalvados dolo, culpa grave ou disposição legal em contrário."] },
      { heading: "11. Suspensão e encerramento", paragraphs: ["Em caso de inadimplência, a obra não é apagada imediatamente: aplica-se período de recuperação e comunicação prévia, conforme a Política de Cancelamento, Reembolso e Retenção de Dados."] },
      { heading: "12. Exportação e portabilidade", paragraphs: ["O usuário pode exportar seus textos, fichas, vínculos e metadados em formato documentado a qualquer momento, inclusive após o cancelamento, dentro do prazo de retenção informado."] },
      { heading: "13. Alterações destes Termos", paragraphs: ["Alterações materiais serão comunicadas com antecedência razoável por e-mail ou aviso na Plataforma."] },
      { heading: "14. Lei aplicável e foro", paragraphs: ["Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro do domicílio do usuário consumidor, sem prejuízo de mecanismos de solução amigável de conflitos."] },
    ],
  },
  {
    slug: "privacidade",
    title: "Política de Privacidade",
    shortDescription: "Como coletamos, usamos e protegemos dados pessoais, conforme a LGPD.",
    updatedAt: "2026-09-20",
    department: "Jurídico & Segurança",
    relatedFeatures: ["Cadastro e conta", "Cobrança", "Assistente de IA", "Colaboração"],
    pdfHref: "/legal/pdfs/privacidade.pdf",
    sections: [
      { heading: "1. Controlador de dados", paragraphs: ["Esta Política descreve como a empresa responsável pelo Autor Copilot, na qualidade de controladora de dados pessoais, trata as informações de usuários, colaboradores convidados e visitantes, em conformidade com a LGPD (Lei nº 13.709/2018)."] },
      { heading: "2. Dados coletados", paragraphs: ["Coletamos dados de cadastro (nome, e-mail, senha criptografada, nome literário), dados de cobrança, dados de uso e telemetria (sem captura do conteúdo criativo por padrão), o conteúdo das obras inseridas na Plataforma e dados de colaboração (convites, papéis e permissões)."] },
      { heading: "3. Bases legais", paragraphs: ["Tratamos dados com base na execução de contrato, no cumprimento de obrigação legal, no legítimo interesse (segurança, prevenção a fraude, melhoria do produto) e, quando exigido, no consentimento específico do titular — por exemplo, para envio de conteúdo a provedores de IA externos."] },
      { heading: "4. Finalidades", paragraphs: ["Os dados são usados para viabilizar cadastro e autenticação, operar as funcionalidades de escrita e colaboração, processar pagamentos, prestar suporte, cumprir obrigações legais e, mediante consentimento, aprimorar recursos de IA."] },
      { heading: "5. Compartilhamento com terceiros", paragraphs: ["Compartilhamos dados estritamente necessários com operadores contratados para pagamento, hospedagem, provedores de IA (apenas quando acionados pelo usuário) e suporte. Não vendemos dados pessoais a terceiros."] },
      { heading: "6. Transferência internacional", paragraphs: ["Alguns operadores podem processar dados fora do Brasil. Adotamos salvaguardas compatíveis com a LGPD e informamos, quando possível, o país de destino relevante para recursos de IA."] },
      { heading: "7. Retenção e eliminação", paragraphs: ["Dados de conta e conteúdo de obras são mantidos enquanto a conta estiver ativa e pelo prazo adicional descrito na Política de Cancelamento, findo o qual são eliminados ou anonimizados, ressalvadas obrigações legais de guarda."] },
      { heading: "8. Direitos do titular", paragraphs: ["O titular pode solicitar, a qualquer momento: confirmação do tratamento e acesso aos dados; correção; anonimização, bloqueio ou eliminação; portabilidade; eliminação de dados tratados com consentimento; informação sobre compartilhamento; e revogação do consentimento."] },
      { heading: "9. Segurança da informação", paragraphs: ["Adotamos criptografia em trânsito e em repouso, backups automáticos, isolamento entre contas, controle de acesso por papel e registro de falhas sem gravação do texto do manuscrito em logs de erro."] },
      { heading: "10. Crianças e adolescentes", paragraphs: ["A Plataforma não é direcionada a menores de idade sem representação legal. Cadastros identificados nessas condições sem a devida representação podem ser suspensos até regularização."] },
      { heading: "11. Encarregado e contato", paragraphs: ["Solicitações relativas a dados pessoais podem ser dirigidas ao Encarregado de Proteção de Dados (DPO) pelo canal de contato desta página."] },
    ],
  },
  {
    slug: "direitos-autorais",
    title: "Direitos Autorais e Propriedade Intelectual",
    shortDescription: "Titularidade da obra do autor, licença técnica e retenção após cancelamento.",
    updatedAt: "2026-09-20",
    department: "Jurídico & Produto",
    relatedFeatures: ["Editor de manuscrito", "Exportação", "Colaboração"],
    pdfHref: "/legal/pdfs/direitos-autorais.pdf",
    sections: [
      { heading: "1. Princípio geral", paragraphs: ["A obra pertence ao autor. A Plataforma recebe apenas a licença técnica estritamente necessária para armazenar, processar, sincronizar e exportar o conteúdo, sem que isso implique cessão, coautoria ou qualquer direito editorial."] },
      { heading: "2. Titularidade e registro", paragraphs: ["A Plataforma não substitui o registro formal de obras perante os órgãos competentes, ainda que mantenha histórico de versões e datas de edição que podem servir como evidência complementar."] },
      { heading: "3. Propriedade intelectual da Plataforma", paragraphs: ["Marca, código-fonte, design de interface e algoritmos de análise narrativa são de titularidade da empresa ou de seus licenciantes, não se estendendo ao usuário qualquer direito sobre eles além da licença de uso do software."] },
      { heading: "4. Projetos com múltiplos colaboradores", paragraphs: ["Em projetos compartilhados, cada colaborador mantém os direitos sobre sua própria contribuição identificável, sem prejuízo de acordos privados entre as partes sobre titularidade conjunta, os quais não são arbitrados pela Plataforma."] },
      { heading: "5. Uso de materiais de terceiros", paragraphs: ["O usuário é responsável por garantir que qualquer material de terceiros inserido na Plataforma respeite direitos autorais aplicáveis. A Plataforma não realiza curadoria prévia desse conteúdo."] },
      { heading: "6. Notificação de violação", paragraphs: ["Titulares de direitos que identificarem uso indevido de suas obras podem notificar formalmente pelo canal de contato, para análise e eventual remoção, nos termos do Marco Civil da Internet."] },
      { heading: "7. Retenção após encerramento", paragraphs: ["Após o cancelamento, cópias de segurança do conteúdo do usuário são mantidas pelo prazo descrito na Política de Cancelamento, exclusivamente para possibilitar recuperação e exportação."] },
      { heading: "8. Exportação", paragraphs: ["O usuário pode exportar integralmente sua obra, fichas e metadados em formatos legíveis e documentados, a qualquer momento e sem custo adicional."] },
    ],
  },
  {
    slug: "uso-de-ia",
    title: "Política de Uso de Inteligência Artificial",
    shortDescription: "Como e quando a IA é usada, transparência de escopo e aprovação humana.",
    updatedAt: "2026-09-20",
    department: "Produto & IA",
    relatedFeatures: ["Assistente opcional", "Busca conversacional", "Análise narrativa"],
    pdfHref: "/legal/pdfs/uso-de-ia.pdf",
    sections: [
      { heading: "1. Caráter opcional", paragraphs: ["Os recursos de inteligência artificial do Autor Copilot são opcionais. O uso do editor, das fichas e da organização narrativa não exige ativação de nenhum recurso de IA."] },
      { heading: "2. Como a IA é usada", paragraphs: ["Recursos de IA podem incluir busca conversacional, resumos com referência às fontes, comparação de versões, checklists de continuidade e sugestões de estilo sob comando explícito. Nenhuma sugestão de IA altera o cânone automaticamente."] },
      { heading: "3. Transparência de escopo", paragraphs: ["Antes de cada ação que envolva envio de conteúdo a um provedor de IA, informamos qual conteúdo será enviado e, quando aplicável, o custo estimado em créditos."] },
      { heading: "4. Aprovação humana", paragraphs: ["Aceitar uma sugestão de texto ou de ficha gerada por IA exige ação explícita do usuário e gera uma versão recuperável, permitindo reverter a alteração a qualquer momento."] },
      { heading: "5. Provedores de terceiros", paragraphs: ["A Plataforma pode utilizar provedores externos de IA. Cada provedor possui suas próprias regras de retenção, uso de dados e localização de processamento. Ao usar chave própria (BYOK), o usuário assume diretamente os termos desse provedor."] },
      { heading: "6. Custos e limites", paragraphs: ["O uso de IA não é ilimitado. Cada plano define franquias, limites de requisições e painel de consumo. Excedentes exigem confirmação explícita (opt-in) do usuário."] },
      { heading: "7. Limitações conhecidas", paragraphs: ["A IA pode produzir informações incorretas ou desatualizadas. Quando não houver base suficiente no projeto, o sistema informa que a informação não foi definida, em vez de inventar dados."] },
      { heading: "8. Conteúdo proibido", paragraphs: ["É vedado usar os recursos de IA para gerar conteúdo ilegal, discurso de ódio, material que sexualize menores, ou para tentar extrair dados de outros usuários."] },
    ],
  },
  {
    slug: "dpa",
    title: "Contrato de Tratamento de Dados (DPA)",
    shortDescription: "Obrigações de operador/controlador para clientes institucionais (editoras, cursos).",
    updatedAt: "2026-09-20",
    department: "Jurídico",
    relatedFeatures: ["Plano Educação/Editoras", "Plano Estúdio"],
    pdfHref: "/legal/pdfs/dpa.pdf",
    sections: [
      { heading: "1. Definições", paragraphs: ["O cliente institucional (editora, curso, instituição de ensino) é o \"Controlador\" dos dados pessoais de seus usuários finais; a empresa responsável pelo Autor Copilot é a \"Operadora\", que trata dados sob instrução do Controlador."] },
      { heading: "2. Objeto e vigência", paragraphs: ["Este DPA regula o tratamento de dados pessoais no contexto do serviço contratado, vigorando enquanto durar o contrato principal e pelo prazo adicional de retenção previsto na Política de Cancelamento."] },
      { heading: "3. Obrigações da Operadora", paragraphs: ["Tratar dados estritamente conforme instruções do Controlador; garantir sigilo; adotar medidas de segurança compatíveis com o risco; auxiliar em respostas a titulares; notificar incidentes em prazo razoável; eliminar ou devolver dados ao fim da prestação de serviço."] },
      { heading: "4. Obrigações do Controlador", paragraphs: ["Garantir base legal adequada para o tratamento dos dados de seus usuários finais e fornecer instruções lícitas à Operadora."] },
      { heading: "5. Suboperadores", paragraphs: ["A Operadora pode utilizar suboperadores (hospedagem, pagamento, provedores de IA), impondo a eles obrigações equivalentes às deste DPA. Lista disponível mediante solicitação."] },
      { heading: "6. Devolução e eliminação ao término", paragraphs: ["Ao término do contrato, a Operadora devolve ou elimina os dados tratados em nome do Controlador, ressalvada retenção exigida por obrigação legal."] },
    ],
  },
  {
    slug: "cookies",
    title: "Política de Cookies",
    shortDescription: "Cookies essenciais, de preferências e de desempenho usados na Plataforma.",
    updatedAt: "2026-09-20",
    department: "Jurídico & Segurança",
    relatedFeatures: ["Toda a Plataforma"],
    pdfHref: "/legal/pdfs/cookies.pdf",
    sections: [
      { heading: "1. O que são cookies", paragraphs: ["Cookies são pequenos arquivos armazenados no navegador para viabilizar funcionalidades, lembrar preferências e coletar métricas agregadas de uso."] },
      { heading: "2. Cookies essenciais", paragraphs: ["Necessários para autenticação, sessão e segurança da conta. Não podem ser desativados sem comprometer o funcionamento básico da Plataforma."] },
      { heading: "3. Cookies de preferências", paragraphs: ["Armazenam escolhas como tema claro/escuro, idioma e configurações de exibição do editor."] },
      { heading: "4. Cookies de desempenho e analytics", paragraphs: ["Coletam métricas agregadas de uso para orientar melhorias, sem capturar o conteúdo criativo das obras."] },
      { heading: "5. Gerenciamento de preferências", paragraphs: ["O usuário pode gerenciar cookies não essenciais nas configurações de privacidade da Plataforma ou no navegador."] },
    ],
  },
  {
    slug: "cancelamento-reembolso",
    title: "Cancelamento, Reembolso e Retenção de Dados",
    shortDescription: "Como funciona cancelar, pedir reembolso e por quanto tempo os dados ficam guardados.",
    updatedAt: "2026-09-20",
    department: "Produto & Negócio",
    relatedFeatures: ["Cobrança", "Planos"],
    pdfHref: "/legal/pdfs/cancelamento-reembolso.pdf",
    sections: [
      { heading: "1. Cancelamento pelo usuário", paragraphs: ["O usuário pode cancelar sua assinatura a qualquer momento pelas configurações da conta. O cancelamento interrompe cobranças futuras e não afeta o acesso já pago no ciclo vigente."] },
      { heading: "2. Reembolso", paragraphs: ["Solicitações de reembolso seguem as regras do plano contratado e a legislação de defesa do consumidor, incluindo o direito de arrependimento quando aplicável."] },
      { heading: "3. Retenção de dados após cancelamento", paragraphs: ["Os dados e o conteúdo do usuário permanecem disponíveis para consulta e exportação por um período determinado após o cancelamento. Após esse prazo, podem ser eliminados definitivamente, ressalvadas obrigações legais de guarda."] },
      { heading: "4. Suspensão por inadimplência", paragraphs: ["Em caso de falha de pagamento, a conta não é apagada imediatamente. Aplica-se período de tolerância e comunicação prévia antes de qualquer suspensão."] },
      { heading: "5. Exportação de dados", paragraphs: ["A exportação de textos, fichas, vínculos e metadados é gratuita e pode ser feita a qualquer momento, inclusive durante o período de retenção pós-cancelamento."] },
    ],
  },
  {
    slug: "uso-aceitavel",
    title: "Uso Aceitável e Código de Conduta",
    shortDescription: "Regras de conduta para coautores, editores e leitores beta em projetos compartilhados.",
    updatedAt: "2026-09-20",
    department: "Produto & Confiança",
    relatedFeatures: ["Colaboração", "Leitor beta"],
    pdfHref: "/legal/pdfs/uso-aceitavel.pdf",
    sections: [
      { heading: "1. Papéis e permissões", paragraphs: ["Um projeto pode ter os papéis de autor (titular), coautor, editor e leitor beta, cada um com permissões definidas pelo titular. Convites têm prazo de expiração e podem ser revogados a qualquer momento."] },
      { heading: "2. Condutas esperadas", paragraphs: ["Espera-se que colaboradores tratem o conteúdo compartilhado como confidencial, não copiem ou redistribuam trechos sem permissão, usem comentários de forma construtiva e respeitem as permissões do seu papel."] },
      { heading: "3. Limites do leitor beta", paragraphs: ["O leitor beta pode visualizar o conteúdo liberado e comentar, mas não pode alterar o manuscrito, as fichas ou qualquer elemento do cânone da obra."] },
      { heading: "4. Confidencialidade", paragraphs: ["Informações sobre enredo e elementos não publicados constituem segredo do autor. Colaboradores concordam em não divulgar esse conteúdo fora do escopo autorizado."] },
      { heading: "5. Revogação de acesso", paragraphs: ["O titular pode revogar o acesso de qualquer colaborador a qualquer momento, preservando-se o histórico de revisão já produzido."] },
    ],
  },
];

// ---------------------------------------------------------------------------
// 2. lib/legal/documents.ts — módulo de dados (fonte única de verdade)
// ---------------------------------------------------------------------------
writeFile(
  "lib/legal/documents.ts",
  `// Gerado por scaffold-legal-pages.js — edite livremente depois.
// No futuro, este arquivo pode ser substituído por uma leitura ao banco
// (tabela legal_documents) alimentada pelo Centro de Controle no admin.

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalDocument = {
  slug: string;
  title: string;
  shortDescription: string;
  updatedAt: string; // ISO date (YYYY-MM-DD)
  department: string; // "autor" / departamento responsável pela publicação
  relatedFeatures: string[]; // produtos/features que usam este documento
  pdfHref: string; // caminho para o PDF em /public
  sections: LegalSection[];
};

export const legalDocuments: LegalDocument[] = ${JSON.stringify(documents, null, 2)};

export function getLegalDocument(slug: string): LegalDocument | undefined {
  return legalDocuments.find((doc) => doc.slug === slug);
}

export function formatUpdatedAt(iso: string): string {
  const date = new Date(iso + "T00:00:00");
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export function slugifyHeading(heading: string): string {
  return heading
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
`
);

// ---------------------------------------------------------------------------
// 3. components/legal/*
// ---------------------------------------------------------------------------
writeFile(
  "components/legal/LegalSidebar.tsx",
  `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { legalDocuments } from "@/lib/legal/documents";

export function LegalSidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentos legais" className="space-y-1">
      <Link
        href="/legal"
        className={\`block rounded-md px-3 py-2 text-sm font-medium transition-colors \${
          pathname === "/legal"
            ? "bg-neutral-900 text-white"
            : "text-neutral-600 hover:bg-neutral-100"
        }\`}
      >
        Visão geral
      </Link>
      {legalDocuments.map((doc) => {
        const href = \`/legal/\${doc.slug}\`;
        const active = pathname === href;
        return (
          <Link
            key={doc.slug}
            href={href}
            className={\`block rounded-md px-3 py-2 text-sm transition-colors \${
              active
                ? "bg-neutral-900 text-white font-medium"
                : "text-neutral-600 hover:bg-neutral-100"
            }\`}
          >
            {doc.title}
          </Link>
        );
      })}
    </nav>
  );
}
`
);

writeFile(
  "components/legal/TableOfContents.tsx",
  `import { LegalSection, slugifyHeading } from "@/lib/legal/documents";

export function TableOfContents({ sections }: { sections: LegalSection[] }) {
  if (sections.length < 3) return null; // só vale a pena para documentos longos

  return (
    <aside className="mb-8 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Nesta página
      </p>
      <ol className="space-y-1 text-sm">
        {sections.map((section) => (
          <li key={section.heading}>
            <a
              href={\`#\${slugifyHeading(section.heading)}\`}
              className="text-neutral-700 hover:text-neutral-950 hover:underline"
            >
              {section.heading}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
`
);

writeFile(
  "components/legal/AuthorCard.tsx",
  `export function AuthorCard({
  department,
  updatedAtLabel,
}: {
  department: string;
  updatedAtLabel: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 text-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
        {department
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()}
      </div>
      <div>
        <p className="font-medium text-neutral-900">Publicado por {department}</p>
        <p className="text-neutral-500">Última atualização: {updatedAtLabel}</p>
      </div>
    </div>
  );
}
`
);

writeFile(
  "components/legal/RelatedFeatures.tsx",
  `export function RelatedFeatures({ features }: { features: string[] }) {
  if (!features?.length) return null;
  return (
    <div className="mt-10 rounded-lg border border-neutral-200 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Onde este documento se aplica
      </p>
      <div className="flex flex-wrap gap-2">
        {features.map((f) => (
          <span
            key={f}
            className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700"
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
`
);

writeFile(
  "components/legal/DownloadPdfButton.tsx",
  `export function DownloadPdfButton({ href, title }: { href: string; title: string }) {
  return (
    <a
      href={href}
      download
      className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
      aria-label={\`Baixar PDF: \${title}\`}
    >
      Baixar PDF
    </a>
  );
}
`
);

writeFile(
  "components/legal/LegalContactSection.tsx",
  `export function LegalContactSection() {
  return (
    <section className="mt-16 border-t border-neutral-200 pt-8 text-sm text-neutral-600">
      <p className="font-medium text-neutral-900">Dúvidas?</p>
      <p className="mt-1">
        Questões sobre privacidade e proteção de dados:{" "}
        <a className="underline" href="mailto:privacidade@autorcopilot.com.br">
          privacidade@autorcopilot.com.br
        </a>
      </p>
      <p className="mt-1">
        Demais questões legais e contratuais:{" "}
        <a className="underline" href="mailto:juridico@autorcopilot.com.br">
          juridico@autorcopilot.com.br
        </a>
      </p>
    </section>
  );
}
`
);

// ---------------------------------------------------------------------------
// 4. app/legal/* — layout, índice e página de cada documento
// ---------------------------------------------------------------------------
writeFile(
  "app/legal/layout.tsx",
  `import { LegalSidebar } from "@/components/legal/LegalSidebar";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-neutral-900">Documentos Legais</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Termos, políticas e contratos que regem o uso do Autor Copilot.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
        <LegalSidebar />
        <main>{children}</main>
      </div>
    </div>
  );
}
`
);

writeFile(
  "app/legal/page.tsx",
  `import Link from "next/link";
import type { Metadata } from "next";
import { legalDocuments, formatUpdatedAt } from "@/lib/legal/documents";

export const metadata: Metadata = {
  title: "Documentos Legais | Autor Copilot",
  description: "Termos de uso, política de privacidade e demais documentos legais do Autor Copilot.",
};

export default function LegalIndexPage() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {legalDocuments.map((doc) => (
        <li key={doc.slug}>
          <Link
            href={\`/legal/\${doc.slug}\`}
            className="block h-full rounded-lg border border-neutral-200 p-4 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
          >
            <p className="font-medium text-neutral-900">{doc.title}</p>
            <p className="mt-1 text-sm text-neutral-600">{doc.shortDescription}</p>
            <p className="mt-3 text-xs text-neutral-400">
              Atualizado em {formatUpdatedAt(doc.updatedAt)}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
`
);

writeFile(
  "app/legal/[slug]/page.tsx",
  `import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  legalDocuments,
  getLegalDocument,
  formatUpdatedAt,
  slugifyHeading,
} from "@/lib/legal/documents";
import { TableOfContents } from "@/components/legal/TableOfContents";
import { AuthorCard } from "@/components/legal/AuthorCard";
import { RelatedFeatures } from "@/components/legal/RelatedFeatures";
import { DownloadPdfButton } from "@/components/legal/DownloadPdfButton";
import { LegalContactSection } from "@/components/legal/LegalContactSection";

// Deep link estático: /legal/[slug] funciona logado ou não logado,
// sem precisar consultar banco em tempo de requisição.
export function generateStaticParams() {
  return legalDocuments.map((doc) => ({ slug: doc.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const doc = getLegalDocument(params.slug);
  if (!doc) return {};
  return {
    title: \`\${doc.title} | Autor Copilot\`,
    description: doc.shortDescription,
  };
}

export default function LegalDocumentPage({ params }: { params: { slug: string } }) {
  const doc = getLegalDocument(params.slug);
  if (!doc) notFound();

  return (
    <article>
      <h2 className="text-xl font-semibold text-neutral-900">{doc.title}</h2>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <AuthorCard department={doc.department} updatedAtLabel={formatUpdatedAt(doc.updatedAt)} />
        <DownloadPdfButton href={doc.pdfHref} title={doc.title} />
      </div>

      <div className="mt-8">
        <TableOfContents sections={doc.sections} />

        <div className="space-y-8">
          {doc.sections.map((section) => (
            <section key={section.heading} id={slugifyHeading(section.heading)}>
              <h3 className="text-base font-semibold text-neutral-900">{section.heading}</h3>
              {section.paragraphs.map((paragraph, i) => (
                <p key={i} className="mt-2 text-sm leading-relaxed text-neutral-700">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>

      <RelatedFeatures features={doc.relatedFeatures} />
      <LegalContactSection />
    </article>
  );
}
`
);

// ---------------------------------------------------------------------------
// 5. Pasta pública para os PDFs (coloque os 8 PDFs fornecidos aqui)
// ---------------------------------------------------------------------------
const pdfDir = path.join(ROOT, "public", "legal", "pdfs");
fs.mkdirSync(pdfDir, { recursive: true });
const gitkeep = path.join(pdfDir, ".gitkeep");
if (!fs.existsSync(gitkeep)) fs.writeFileSync(gitkeep, "");
console.log(`  [criado] public/legal/pdfs/ (coloque os 8 PDFs aqui)`);

console.log("\nPronto! Próximos passos:");
console.log("  1. Copie os 8 PDFs fornecidos para public/legal/pdfs/");
console.log("     (nomes esperados: " + documents.map((d) => d.slug + ".pdf").join(", ") + ")");
console.log("  2. Confira app/legal/layout.tsx, page.tsx e [slug]/page.tsx");
console.log("  3. Ajuste imports '@/...' se seu tsconfig usar outro alias de path");
console.log("  4. npm run dev  →  acesse /legal");
