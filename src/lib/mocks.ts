// =============================================================================
// 🟢 MOCK DATA LAYER — para análise visual do front-end.
// -----------------------------------------------------------------------------
// COMO REMOVER:
//   1) Em src/lib/api.ts mude:  export const USE_MOCKS = true   ->  false
//   2) (Opcional) delete este arquivo.
// =============================================================================

import type {
  AssuntoResponse,
  BlocoQuestoesResponse,
  DashboardResumo,
  MateriaPerformance,
  MateriaResponse,
  Periodo,
  RedacaoResponse,
  SessaoEstudoResponse,
  SimuladoSemanalResponse,
} from "./types";

// ---------- 8 matérias (antes eram 7) ----------
export const MOCK_MATERIAS: MateriaResponse[] = [
  { id: "m1", nome: "Matemática" },
  { id: "m2", nome: "Português" },
  { id: "m3", nome: "Física" },
  { id: "m4", nome: "Química" },
  { id: "m5", nome: "História" },
  { id: "m6", nome: "Geografia" },
  { id: "m7", nome: "Inglês" },
  { id: "m8", nome: "Redação" },
];

export const MOCK_ASSUNTOS: AssuntoResponse[] = [
  { id: "a1", nome: "Funções", materia_id: "m1" },
  { id: "a2", nome: "Geometria Analítica", materia_id: "m1" },
  { id: "a3", nome: "Trigonometria", materia_id: "m1" },
  { id: "a4", nome: "Sintaxe", materia_id: "m2" },
  { id: "a5", nome: "Interpretação", materia_id: "m2" },
  { id: "a6", nome: "Cinemática", materia_id: "m3" },
  { id: "a7", nome: "Eletrodinâmica", materia_id: "m3" },
  { id: "a8", nome: "Estequiometria", materia_id: "m4" },
  { id: "a9", nome: "Orgânica", materia_id: "m4" },
  { id: "a10", nome: "Brasil Império", materia_id: "m5" },
  { id: "a11", nome: "Era Vargas", materia_id: "m5" },
  { id: "a12", nome: "Geopolítica", materia_id: "m6" },
  { id: "a13", nome: "Reading", materia_id: "m7" },
  { id: "a14", nome: "Dissertativa", materia_id: "m8" },
];

const IPR_POR_MATERIA: Record<string, { ipr: number; q: number; a: number; h: number }> = {
  m1: { ipr: 88, q: 240, a: 211, h: 14.5 },
  m2: { ipr: 76, q: 180, a: 137, h: 9.8 },
  m3: { ipr: 82, q: 165, a: 135, h: 11.2 },
  m4: { ipr: 68, q: 142, a: 97, h: 8.4 },
  m5: { ipr: 91, q: 110, a: 100, h: 6.5 },
  m6: { ipr: 73, q: 95, a: 69, h: 5.2 },
  m7: { ipr: 85, q: 70, a: 60, h: 4.0 },
  m8: { ipr: 64, q: 40, a: 26, h: 7.5 },
};

export function mockMateriasPerformance(_periodo: Periodo): MateriaPerformance[] {
  return MOCK_MATERIAS.map((m) => {
    const v = IPR_POR_MATERIA[m.id];
    return {
      materia: m,
      ipr: v.ipr,
      total_questoes: v.q,
      total_acertos: v.a,
      horas_estudo: v.h,
    };
  });
}

export function mockDashboard(periodo: Periodo, materiaId?: string): DashboardResumo {
  if (materiaId && IPR_POR_MATERIA[materiaId]) {
    const v = IPR_POR_MATERIA[materiaId];
    return {
      horas_liquidas: v.h,
      total_questoes: v.q,
      percentual_medio: Math.round((v.a / v.q) * 100),
      ipr_geral: v.ipr,
      tendencia: v.ipr >= 80 ? "ASCENDENTE" : v.ipr >= 70 ? "ESTÁVEL" : "DECLÍNIO",
      status_missao: v.ipr >= 70 ? "MISSÃO CUMPRIDA" : "MISSÃO EM RISCO",
      assuntos_criticos: v.ipr < 70 ? ["a8", "a14"] : [],
      status_horas: "DENTRO",
      status_questoes: "ACIMA",
      recomendacao: ["Manter o ritmo de questões diárias.", "Reforçar revisões espaçadas."],
    };
  }
  const fator = periodo === "semana" ? 1 : periodo === "mes" ? 4 : periodo === "ano" ? 48 : 60;
  return {
    horas_liquidas: 18.7 * (fator / 1),
    total_questoes: 312 * fator,
    percentual_medio: 78,
    ipr_geral: 79,
    tendencia: "ASCENDENTE",
    status_missao: "MISSÃO CUMPRIDA",
    assuntos_criticos: ["a8", "a14"],
    status_horas: "DENTRO",
    status_questoes: "ACIMA",
    recomendacao: [
      "Foco em Química Orgânica nesta semana.",
      "Aumentar volume de redação para 2 por semana.",
      "Revisar Era Vargas até quinta.",
    ],
  };
}

function dataPassada(diasAtras: number): string {
  const d = new Date();
  d.setDate(d.getDate() - diasAtras);
  return d.toISOString();
}

export const MOCK_SESSOES: SessaoEstudoResponse[] = Array.from({ length: 14 }, (_, i) => ({
  id: `s${i + 1}`,
  materia_id: MOCK_MATERIAS[i % MOCK_MATERIAS.length].id,
  assunto_id: MOCK_ASSUNTOS[i % MOCK_ASSUNTOS.length].id,
  tipo_sessao: i % 3 === 0 ? "TEORIA" : i % 3 === 1 ? "QUESTOES" : "REVISAO",
  minutos_liquidos: 30 + (i * 7) % 60,
  nivel_foco: 2 + (i % 4),
  nivel_energia: 2 + ((i + 1) % 4),
  criado_em: dataPassada(i),
}));

export const MOCK_BLOCOS: BlocoQuestoesResponse[] = Array.from({ length: 12 }, (_, i) => {
  const tq = 15 + (i % 10);
  const ta = Math.max(0, tq - (i % 6));
  return {
    id: `b${i + 1}`,
    materia_id: MOCK_MATERIAS[i % MOCK_MATERIAS.length].id,
    assunto_id: MOCK_ASSUNTOS[i % MOCK_ASSUNTOS.length].id,
    dificuldade: 2 + (i % 4),
    total_questoes: tq,
    total_acertos: ta,
    tempo_total_segundos: 60 * (15 + i * 2),
    nivel_confianca_medio: 3,
    percentual_acerto: Math.round((ta / tq) * 100),
    tempo_medio_por_questao: Math.round((60 * (15 + i * 2)) / tq),
    criado_em: dataPassada(i),
  };
});

export const MOCK_SIMULADOS: SimuladoSemanalResponse[] = Array.from({ length: 8 }, (_, i) => {
  const tq = 90;
  const ta = 55 + (i * 3) % 30;
  return {
    id: `sim${i + 1}`,
    numero_ciclo: 1 + Math.floor(i / 4),
    numero_semana: (i % 4) + 1,
    total_questoes: tq,
    total_acertos: ta,
    tempo_total_segundos: 60 * 240,
    nivel_ansiedade: 3,
    nivel_fadiga: 3,
    qualidade_sono: 4,
    percentual_acerto: Math.round((ta / tq) * 100),
    criado_em: dataPassada(i * 7),
  };
});

export const MOCK_REDACOES: RedacaoResponse[] = Array.from({ length: 6 }, (_, i) => {
  const c1 = 120 + (i * 13) % 80;
  const c2 = 140 + (i * 7) % 60;
  const c3 = 130 + (i * 11) % 70;
  const c4 = 150 + (i * 5) % 50;
  const c5 = 110 + (i * 17) % 90;
  const total = c1 + c2 + c3 + c4 + c5;
  return {
    id: `r${i + 1}`,
    tema: [
      "Desafios da educação digital no Brasil",
      "Saúde mental na juventude contemporânea",
      "Mobilidade urbana e sustentabilidade",
      "Combate à desinformação",
      "Acesso à cultura nas periferias",
      "Reforma agrária no século XXI",
    ][i],
    eixo_tematico: "Sociedade",
    data_escrita: dataPassada(i * 5),
    tempo_escrita_min: 60 + (i * 5) % 30,
    observacoes: null,
    repertorios: "ENEM 2023, BNCC",
    competencia1: c1,
    competencia2: c2,
    competencia3: c3,
    competencia4: c4,
    competencia5: c5,
    nota_total: total,
    status: total >= 800 ? "Excelente" : total >= 600 ? "Bom" : total >= 400 ? "Regular" : "Insuficiente",
    competencia_mais_fraca: [c1, c2, c3, c4, c5].indexOf(Math.min(c1, c2, c3, c4, c5)) + 1,
    diagnostico: "Argumentação consistente, mas faltou repertório sociocultural sólido.",
    recomendacao: "Estudar 3 repertórios novos por semana e praticar conclusão.",
    criado_em: dataPassada(i * 5),
  };
});

export function mockRelatorio(mes = 9, ano = 2026): Record<string, unknown> {
  return {
    periodo: {
      mes,
      ano,
      dias_estudados: 22,
      dias_no_mes: 30,
      semanas_cobertas: 4,
      taxa_consistencia: 88,
    },
    horas: {
      total_horas: 74.8,
      horas_liquidas: 68.5,
      media_horas_dia: 3.1,
      meta_horas: 70,
      comparativo_mes_anterior: 8.2,
    },
    questoes: {
      total_questoes: 940,
      total_acertos: 742,
      percentual_acerto: 78.9,
      comparativo_mes_anterior: 4.5,
    },
    ipr: {
      ipr_geral: 81,
      tendencia: "ASCENDENTE",
      delta_mes_anterior: 3.2,
    },
    sessoes: {
      total_sessoes: 48,
      media_minutos_sessao: 52,
      media_foco: 3.8,
      media_energia: 3.6,
      por_tipo: [
        { tipo: "QUESTOES", minutos: 2100, percentual: 51, total_sessoes: 25, media_foco: 4.0 },
        { tipo: "TEORIA", minutos: 1200, percentual: 29, total_sessoes: 14, media_foco: 3.7 },
        { tipo: "REVISAO", minutos: 810, percentual: 20, total_sessoes: 9, media_foco: 3.6 },
      ],
      por_materia: MOCK_MATERIAS.map((m, i) => ({
        materia: m.nome,
        tempo: 300 + i * 120,
        pct: 12.5,
        total_sessoes: 6,
        media_foco: 3.8,
      })),
    },
    blocos: {
      total_blocos: 38,
      por_materia: MOCK_MATERIAS.map(m => ({
        materia: m.nome,
        ipr: 78,
        questoes: 110,
        acertos: 85,
        percentual_acerto: 77,
      })),
      por_assunto: MOCK_ASSUNTOS.slice(0, 8).map(a => ({
        assunto: a.nome,
        total_questoes: 45,
        total_acertos: 36,
        percentual_acerto: 80,
      })),
      por_dificuldade: [
        { dificuldade: "1", total_questoes: 200, total_acertos: 180, percentual_acerto: 90, ipr_medio: 92 },
        { dificuldade: "2", total_questoes: 450, total_acertos: 360, percentual_acerto: 80, ipr_medio: 82 },
        { dificuldade: "3", total_questoes: 290, total_acertos: 202, percentual_acerto: 70, ipr_medio: 72 },
      ],
    },
    simulados: {
      total_simulados: 4,
      media_acertos: 68,
      media_percentual: 75.5,
      lista: MOCK_SIMULADOS.slice(0, 4).map((s, i) => ({
        label: `Simulado #${i + 1}`,
        numero_semana: i + 1,
        total_questoes: s.total_questoes,
        total_acertos: s.total_acertos,
        percentual_acerto: s.percentual_acerto,
        ipr_medio: 78 + i * 2,
      })),
    },
    provas: {
      lista: [],
    },
    redacoes: {
      total_redacoes: 4,
      media_nota: 760,
      redacoes: MOCK_REDACOES.slice(0, 4),
      evolucao_nota: MOCK_REDACOES.slice(0, 4).map(r => ({ data: r.data_escrita, nota_total: r.nota_total })),
      media_competencia1: 155,
      media_competencia2: 160,
      media_competencia3: 150,
      media_competencia4: 165,
      media_competencia5: 130,
    },
    erros: {
      total_erros_registrados: 198,
      tendencia_erro: "ESTÁVEL",
      tipos_mais_comuns: [
        { tipo_erro: "Falta de atenção / Leitura apressada", total_ocorrencias: 68 },
        { tipo_erro: "Lacuna teórica", total_ocorrencias: 54 },
        { tipo_erro: "Erro de cálculo aritmético", total_ocorrencias: 42 },
        { tipo_erro: "Interpretação de enunciado", total_ocorrencias: 34 },
      ],
    },
    conclusoes: {
      pontos_fortes: [
        "Consistência diária de estudo acima de 85%",
        "Alto índice de acertos em Matemática e Física",
        "Evolução gradual na nota geral de redações",
      ],
      pontos_atencao: [
        "Competência 5 em Redação (proposta de intervenção)",
        "Química Orgânica necessita de mais blocos práticos",
        "Volume de erros por desatenção no fim dos blocos",
      ],
      recomendacoes: [
        "Priorizar 1 bloco diário de Química Orgânica",
        "Escrever proposta de intervenção detalhada nas próximas redações",
        "Pausar 5 minutos a cada 45 minutos para reduzir fadiga",
      ],
    },
  };
}

export function mockWeek() {
  return {
    base_questoes: 175,
    origem_questoes: "automatica" as const,
    inicio: "15/09",
    fim: "21/09",
    fuso: "Horário de Brasília",
    parcial: false,
    meta_minutos: 840,
    meta_questoes: 175,
    meta_redacoes: 1,
    percentual: 100,
    realizado: {
      minutos: 560,
      questoes: 125,
      acertos: 101,
      redacoes: 1,
    },
    status: {
      horas: "DENTRO DA META",
      questoes: "RITMO BOM",
      redacoes: "META ATINGIDA",
    },
    status_missao: "MISSÃO EM ANDAMENTO",
    esperado_minutos: 600,
    capacidade_restante_minutos: 280,
    percentual_pratica: 50,
    dias: [
      { dia: 0, nome: "Segunda", inicio: "15:00", fim: "21:22", pausas: 60, minutos: 120, data: "2026-09-15", meta_minutos: 120, realizado_minutos: 135, janela_minutos: 382, capacidade_minutos: 322 },
      { dia: 1, nome: "Terça", inicio: "15:00", fim: "21:00", pausas: 50, minutos: 120, data: "2026-09-16", meta_minutos: 120, realizado_minutos: 120, janela_minutos: 360, capacidade_minutos: 310 },
      { dia: 2, nome: "Quarta", inicio: "15:00", fim: "21:00", pausas: 50, minutos: 120, data: "2026-09-17", meta_minutos: 120, realizado_minutos: 110, janela_minutos: 360, capacidade_minutos: 310 },
      { dia: 3, nome: "Quinta", inicio: "13:50", fim: "20:52", pausas: 70, minutos: 120, data: "2026-09-18", meta_minutos: 120, realizado_minutos: 125, janela_minutos: 422, capacidade_minutos: 352 },
      { dia: 4, nome: "Sexta", inicio: "13:00", fim: "20:52", pausas: 70, minutos: 120, data: "2026-09-19", meta_minutos: 120, realizado_minutos: 70, janela_minutos: 472, capacidade_minutos: 402 },
      { dia: 5, nome: "Sábado", inicio: "08:00", fim: "18:30", pausas: 120, minutos: 180, data: "2026-09-20", meta_minutos: 180, realizado_minutos: 0, janela_minutos: 630, capacidade_minutos: 510 },
      { dia: 6, nome: "Domingo", inicio: null, fim: null, pausas: 0, minutos: 60, data: "2026-09-21", meta_minutos: 60, realizado_minutos: 0, janela_minutos: 0, capacidade_minutos: 0 },
    ],
    calibracao: {
      minutos_por_questao: 3.5,
      blocos: 8,
      questoes: 120,
      origem: "Amostra histórica dos últimos 28 dias",
    },
    materias: MOCK_MATERIAS.map((m, i) => ({
      materia_id: m.id,
      nome: m.nome,
      peso: 1,
      meta_minutos: 105,
      realizado_minutos: 70 + i * 10,
    })),
  };
}

export function mockProfile() {
  return {
    dias: [
      { dia: 0, inicio: "15:00", fim: "21:22", pausas: 60, minutos: 120 },
      { dia: 1, inicio: "15:00", fim: "21:00", pausas: 50, minutos: 120 },
      { dia: 2, inicio: "15:00", fim: "21:00", pausas: 50, minutos: 120 },
      { dia: 3, inicio: "13:50", fim: "20:52", pausas: 70, minutos: 120 },
      { dia: 4, inicio: "13:00", fim: "20:52", pausas: 70, minutos: 120 },
      { dia: 5, inicio: "08:00", fim: "18:30", pausas: 120, minutos: 180 },
      { dia: 6, inicio: null, fim: null, pausas: 0, minutos: 60 },
    ],
    percentual_pratica: 50,
    minutos_por_questao: 3.5,
    redacoes: 1,
    meta_questoes: 175,
  };
}

export function mockNow() {
  return {
    ciclo: {
      id: "c1",
      nome: "Ciclo Alfa",
      iniciado_em: new Date().toISOString(),
      completo: false,
      metas: MOCK_MATERIAS.map((m, i) => ({
        materia_id: m.id,
        nome: m.nome,
        minutos: 180,
        segundos_consumidos: 3600 * (1 + (i % 3) * 0.5),
        proporcao: (1 + (i % 3) * 0.5) / 3,
        ultima_sessao: new Date().toISOString(),
        ordem: i + 1,
        ativa: true,
      })),
    },
    recomendacao: {
      materia_id: "m1",
      materia: "Matemática",
      assunto_id: "a1",
      assunto: "Funções",
      atividade: "QUESTOES" as const,
      tarefa: "Resolver bloco de 15 questões de Funções afim e quadrática",
      referencia: "Livro 1, Cap. 3, págs. 45-52",
      acao_id: null,
      explicacao: "Manter precisão acima de 80% na matéria de maior peso da EsPCEx.",
      duracao_sugerida_minutos: 50,
      aviso: "Faça em ambiente silencioso, cronometrando o tempo por questão.",
    },
    motivo: null,
  };
}

export function mockCoverage(materiaId?: string) {
  const filteredAssuntos = materiaId ? MOCK_ASSUNTOS.filter(a => a.materia_id === materiaId) : MOCK_ASSUNTOS;
  return filteredAssuntos.map((a, i) => ({
    id: a.id,
    materia_id: a.materia_id,
    nome: a.nome,
    ordem: i + 1,
    referencia: "Apostila EsPCEx - Módulo " + (i + 1),
    estado: i % 4 === 0 ? "PRÁTICA REGISTRADA" : i % 4 === 1 ? "TEORIA SEM PRÁTICA" : i % 4 === 2 ? "POUCA PRÁTICA" : "SEM REGISTRO",
    ultimo_contato: new Date(Date.now() - (i + 1) * 86400000 * 3).toISOString(),
    total_questoes: 25 + i * 10,
    questoes_recentes: 15 + i * 2,
    blocos_recentes: 2 + (i % 3),
    precisao: 75 + (i % 20),
    teoria_registrada: true,
    proximo_passo: "Resolver bloco de 10 questões",
    pendencias: i % 3 === 0 ? [
      {
        id: `acao_${a.id}`,
        assunto_id: a.id,
        descricao: `Revisar erros de ${a.nome} e refazer 3 questões`,
        causa: "Dificuldade na interpretação",
        prevista_em: new Date(Date.now() + 86400000).toISOString(),
        concluida_em: null,
        resultado: null,
      }
    ] : [],
  }));
}

export function mockReviews(materiaId?: string) {
  const filtered = materiaId ? MOCK_ASSUNTOS.filter(a => a.materia_id === materiaId) : MOCK_ASSUNTOS;
  return filtered.slice(0, 6).map((a, i) => {
    const mat = MOCK_MATERIAS.find(m => m.id === a.materia_id);
    return {
      id: `rev_${a.id}`,
      origem: i % 2 === 0 ? ("AUTOMATICA" as const) : ("PROGRAMADA" as const),
      materia_id: a.materia_id,
      materia: mat?.nome || "Matemática",
      assunto_id: a.id,
      assunto: a.nome,
      atividade: i % 3 === 0 ? ("QUESTOES" as const) : ("REVISAO" as const),
      tarefa: `Revisão espaçada de ${a.nome}: 10 questões comentadas`,
      motivo: i % 2 === 0 ? "Intervalo programado de 7 dias atingido" : "Ação agendada pelo plano",
      prevista_em: new Date(Date.now() - (i % 2 === 0 ? 0 : 86400000)).toISOString(),
      disponivel: i < 4,
      acao_id: i % 2 !== 0 ? `acao_${a.id}` : null,
      referencia: "Módulo " + (i + 1),
    };
  });
}

export const MOCK_METODOS = {
  TEORIA: {
    titulo: "Estudo Teórico Ativo",
    passos: [
      "Faça uma leitura inicial atenta de 20 a 30 minutos.",
      "Anote os conceitos centrais e fórmulas com suas próprias palavras.",
      "Identifique as condições de aplicação de cada teorema ou regra.",
      "Resolva de 2 a 3 exemplos resolvidos sem olhar a resposta antes de prosseguir.",
    ],
    fonte: {
      titulo: "Técnicas de Aprendizagem Ativa (Dunlosky et al., 2013)",
      url: "https://journals.sagepub.com/doi/10.1177/1529100612453266",
      limite: "Foco em retenção conceitual para base de exercícios.",
    },
  },
  QUESTOES: {
    titulo: "Prática Deliberada com Blocos de Questões",
    passos: [
      "Defina o tamanho do bloco (10 a 20 questões) e o tempo limite.",
      "Resolva as questões sem consultar o gabarito durante o bloco.",
      "Ao finalizar, confira o gabarito e marque imediatamente acertos e erros.",
      "Leia a resolução de todas as questões que você errou ou acertou com dúvida.",
    ],
    fonte: {
      titulo: "Testing Effect & Retrieval Practice (Roediger & Karpicke, 2006)",
      url: "https://www.psychologicalscience.org/publications/observer/obsonline/the-power-of-testing.html",
      limite: "O efeito testagem exige conferência ativa de gabarito.",
    },
  },
  REVISAO: {
    titulo: "Revisão Espaçada Ativa",
    passos: [
      "Antes de abrir o material, tente se lembrar dos tópicos principais por 2 minutos.",
      "Faça um mapa mental rápido ou lista de palavras-chave.",
      "Consulte o resumo para preencher as lacunas que você não lembrou.",
      "Resolva 5 questões de nível médio para fixar a retenção.",
    ],
    fonte: {
      titulo: "Spaced Repetition & Memory Consolidation (Cepeda et al., 2006)",
      url: "https://psycnet.apa.org/record/2006-20074-001",
      limite: "Intervalos progressivos aumentam a taxa de retenção de longo prazo.",
    },
  },
  ANALISE_ERROS: {
    titulo: "Diagnóstico e Caderno de Erros",
    passos: [
      "Classifique a causa do erro: desatenção, lacuna teórica ou interpretação.",
      "Reescreva o enunciado destacando as informações essenciais.",
      "Desenvolva a solução completa e anote a lição aprendida.",
      "Programe nova tentativa em 2 a 3 dias.",
    ],
    fonte: {
      titulo: "Error-Driven Learning (Metcalfe, 2017)",
      url: "https://www.annualreviews.org/doi/10.1146/annurev-psych-010416-044022",
      limite: "A reflexão profunda sobre erros potencializa correções duradouras.",
    },
  },
};

export const MOCK_ORIENTACOES = [
  {
    titulo: "Prioridade: Química Orgânica",
    motivo: "Seu percentual de acerto recente está abaixo de 70% neste assunto de peso.",
    passos: [
      "Resolva um bloco de 10 questões com foco em funções oxigenadas.",
      "Revise a nomenclatura de álcoois, cetonas e aldeídos.",
      "Classifique cada erro imediatamente após o bloco.",
    ],
    destino: "/estudar?materia=m4&assunto=a9&atividade=QUESTOES",
    fonte: {
      titulo: "Interleaved Practice (Rohrer, 2012)",
      url: "https://link.springer.com/article/10.1007/s10648-012-9201-3",
      limite: "Alternar assuntos fracos acelera a equalização do desempenho.",
    },
  },
  {
    titulo: "Manutenção: Física - Cinemática",
    motivo: "Último contato há mais de 7 dias. Momento ideal para revisão de retenção.",
    passos: [
      "Dedique 25 minutos para resolver 5 questões de MRUV e lançamentos.",
      "Foque nas deduções gráficas de velocidade e posição.",
    ],
    destino: "/estudar?materia=m3&assunto=a6&atividade=REVISAO",
    fonte: {
      titulo: "Spacing in Mathematical Problem Solving (Rohrer & Taylor, 2006)",
      url: "https://link.springer.com/article/10.1007/s10648-006-9017-2",
      limite: "Retomar conceitos antes do esquecimento total economiza tempo.",
    },
  },
];
