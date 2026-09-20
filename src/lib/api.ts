import {
  MOCK_ASSUNTOS,
  MOCK_BLOCOS,
  MOCK_MATERIAS,
  MOCK_REDACOES,
  MOCK_SESSOES,
  MOCK_SIMULADOS,
  mockDashboard,
  mockMateriasPerformance,
  mockRelatorio,
  mockWeek,
  mockProfile,
  mockNow,
  mockCoverage,
  mockReviews,
  MOCK_METODOS,
  MOCK_ORIENTACOES,
} from "./mocks";
import type {
    AssuntoResponse,
    BlocoQuestoesCreate,
    BlocoQuestoesResponse,
    DashboardResumo,
    MateriaPerformance,
    MateriaResponse,
    Periodo,
    RedacaoRequest,
    RedacaoResponse,
    SessaoEstudoCreate,
    SessaoEstudoResponse,
    SimuladoSemanalCreate,
    SimuladoSemanalResponse,
} from "./types";

interface MateriaCreateInput {
    nome: string;
    peso?: number;
    ordem?: number;
    cor?: string;
}

interface AssuntoCreateInput {
    materia_id: string;
    nome: string;
    ordem?: number;
}

export const USE_MOCKS = true;

const API_BASE = import.meta.env.VITE_API_URL || "/api";

// Latência simulada para que loading states apareçam.
function mockResponse<T>(data: T, ms = 200): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(data), ms));
}

function handleMockRequest<T>(path: string, options?: RequestInit): Promise<T> {
    const method = options?.method?.toUpperCase() || "GET";
    const url = new URL(path, "http://localhost");
    const pathname = url.pathname;
    const searchParams = url.searchParams;

    if (pathname.includes("/relatorio/mensal")) {
        const mes = Number(searchParams.get("mes")) || 9;
        const ano = Number(searchParams.get("ano")) || 2026;
        return mockResponse(mockRelatorio(mes, ano) as unknown as T);
    }

    if (pathname.includes("/performance/dashboard")) {
        const pParam = searchParams.get("periodo");
        const periodo: Periodo = (pParam === "semana" || pParam === "mes" || pParam === "ano" || pParam === "total") ? pParam : "mes";
        const materiaId = searchParams.get("materia_id") || undefined;
        return mockResponse(mockDashboard(periodo, materiaId) as unknown as T);
    }

    if (pathname.includes("/estudos/materias-performance")) {
        const pParam = searchParams.get("periodo");
        const periodo: Periodo = (pParam === "semana" || pParam === "mes" || pParam === "ano" || pParam === "total") ? pParam : "mes";
        return mockResponse(mockMateriasPerformance(periodo) as unknown as T);
    }

    if (pathname.includes("/estudos/series")) {
        return mockResponse({ blocos: MOCK_BLOCOS, simulados: MOCK_SIMULADOS } as unknown as T);
    }

    if (pathname.includes("/metas/semana/questoes") || pathname.includes("/metas/semana/ajuste")) {
        return mockResponse({ success: true, mensagem: "Meta atualizada com sucesso." } as unknown as T);
    }

    if (pathname.includes("/metas/semana")) {
        return mockResponse(mockWeek() as unknown as T);
    }

    if (pathname.includes("/metas/configuracao")) {
        if (method === "PUT" || method === "POST") {
            return mockResponse({ mensagem: "Configurações de estudo salvas com sucesso." } as unknown as T);
        }
        return mockResponse(mockProfile() as unknown as T);
    }

    if (pathname.includes("/metas/metodos")) {
        return mockResponse(MOCK_METODOS as unknown as T);
    }

    if (pathname.includes("/metas/orientacoes")) {
        return mockResponse(MOCK_ORIENTACOES as unknown as T);
    }

    if (pathname.includes("/estudos/agora")) {
        return mockResponse(mockNow() as unknown as T);
    }

    if (pathname.includes("/estudos/cobertura")) {
        const materiaId = searchParams.get("materia_id") || undefined;
        return mockResponse(mockCoverage(materiaId) as unknown as T);
    }

    if (pathname.includes("/estudos/revisoes")) {
        const materiaId = searchParams.get("materia_id") || undefined;
        return mockResponse(mockReviews(materiaId) as unknown as T);
    }

    if (pathname.includes("/estudos/ciclo") || pathname.includes("/estudos/concluir")) {
        return mockResponse({ success: true, mensagem: "Ação concluída com sucesso." } as unknown as T);
    }

    if (pathname.includes("/estudos/acoes")) {
        return mockResponse({ id: `acao_${Date.now()}`, mensagem: "Ação registrada." } as unknown as T);
    }

    if (pathname.includes("/configuracoes/materias") || pathname.includes("/performance/materias")) {
        if (method === "POST" && options?.body) {
            try {
                const body = JSON.parse(String(options.body)) as MateriaCreateInput;
                const newMateria: MateriaResponse = {
                    id: `m_${Date.now()}`,
                    nome: body.nome,
                };
                MOCK_MATERIAS.push(newMateria);
                return mockResponse(newMateria as unknown as T);
            } catch {
                // ignore
            }
        }
        return mockResponse(MOCK_MATERIAS as unknown as T);
    }

    if (pathname.includes("/configuracoes/assuntos") || pathname.includes("/performance/assuntos")) {
        if (method === "POST" && options?.body) {
            try {
                const body = JSON.parse(String(options.body)) as AssuntoCreateInput;
                const newAssunto: AssuntoResponse = {
                    id: `a_${Date.now()}`,
                    materia_id: body.materia_id,
                    nome: body.nome,
                };
                MOCK_ASSUNTOS.push(newAssunto);
                return mockResponse(newAssunto as unknown as T);
            } catch {
                // ignore
            }
        }
        const materiaId = searchParams.get("materia_id");
        return mockResponse((materiaId ? MOCK_ASSUNTOS.filter(a => a.materia_id === materiaId) : MOCK_ASSUNTOS) as unknown as T);
    }

    if (pathname.includes("/performance/analytics")) {
        return mockResponse({ status: "ok", dados: [] } as unknown as T);
    }

    return mockResponse({ success: true } as unknown as T);
}

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
    if (USE_MOCKS) {
        return handleMockRequest<T>(path, options);
    }
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        throw new Error("API indisponível — resposta não é JSON. Verifique VITE_API_URL.");
    }
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(typeof err.detail === "string" ? err.detail : err.detail?.[0]?.msg || `Erro ${res.status}`);
    }
    return res.json();
}

// ======== CONFIGURAÇÕES ========

export async function fetchMaterias(): Promise<MateriaResponse[]> {
    if (USE_MOCKS) return mockResponse(MOCK_MATERIAS);
    return request("/configuracoes/materias");
}

export async function fetchAssuntos(materiaId?: string): Promise<AssuntoResponse[]> {
    if (USE_MOCKS) {
      return mockResponse(materiaId ? MOCK_ASSUNTOS.filter(a => a.materia_id === materiaId) : MOCK_ASSUNTOS);
    }
    if (materiaId) {
        return request(`/configuracoes/materias/${materiaId}/assuntos`);
    }
    return request("/configuracoes/assuntos");
}

export async function fetchAssuntosPorMateria(materiaId: string): Promise<AssuntoResponse[]> {
    if (USE_MOCKS) return mockResponse(MOCK_ASSUNTOS.filter(a => a.materia_id === materiaId));
    return request(`/configuracoes/materias/${materiaId}/assuntos`);
}

// ======== PERFORMANCE ========

export async function fetchDashboard(periodo: Periodo, materiaId?: string): Promise<DashboardResumo> {
    if (USE_MOCKS) return mockResponse(mockDashboard(periodo, materiaId));
    const params = new URLSearchParams({ periodo });
    if (materiaId) params.set("materia_id", materiaId);
    return request(`/api/v1/performance/dashboard?${params}`);
}

export async function fetchMateriasPerformance(periodo: Periodo): Promise<MateriaPerformance[]> {
    if (USE_MOCKS) return mockResponse(mockMateriasPerformance(periodo));
    return request(`/api/v1/estudos/materias-performance?periodo=${periodo}`);
}

export async function fetchAnalytics(periodo: Periodo, materiaId?: string): Promise<Record<string, unknown>> {
    const params = new URLSearchParams({ periodo });
    if (materiaId) params.set("materia_id", materiaId);
    return request(`/api/v1/performance/analytics?${params}`);
}

// Sessões
export async function createSessao(data: SessaoEstudoCreate): Promise<SessaoEstudoResponse> {
    if (USE_MOCKS) return mockResponse({ ...data, id: `s_new_${Date.now()}`, criado_em: new Date().toISOString() } as SessaoEstudoResponse);
    return request("/api/v1/performance/sessoes", { method: "POST", body: JSON.stringify(data) });
}

export async function fetchSessoes(skip = 0, limit = 100): Promise<SessaoEstudoResponse[]> {
    if (USE_MOCKS) return mockResponse(MOCK_SESSOES.slice(skip, skip + limit));
    return request(`/api/v1/performance/sessoes?skip=${skip}&limit=${limit}`);
}

// Blocos
export async function createBloco(data: BlocoQuestoesCreate): Promise<BlocoQuestoesResponse> {
    if (USE_MOCKS) {
      const pct = Math.round((data.total_acertos / data.total_questoes) * 100);
      return mockResponse({
        ...data,
        id: `b_new_${Date.now()}`,
        percentual_acerto: pct,
        tempo_medio_por_questao: Math.round(data.tempo_total_segundos / data.total_questoes),
        criado_em: new Date().toISOString(),
      } as BlocoQuestoesResponse);
    }
    return request("/api/v1/performance/blocos", { method: "POST", body: JSON.stringify(data) });
}

export async function fetchBlocos(skip = 0, limit = 100): Promise<BlocoQuestoesResponse[]> {
    if (USE_MOCKS) return mockResponse(MOCK_BLOCOS.slice(skip, skip + limit));
    return request(`/api/v1/performance/blocos?skip=${skip}&limit=${limit}`);
}

// Simulados
export async function createSimulado(data: SimuladoSemanalCreate): Promise<SimuladoSemanalResponse> {
    if (USE_MOCKS) {
      const pct = Math.round((data.total_acertos / data.total_questoes) * 100);
      return mockResponse({
        ...data,
        id: `sim_new_${Date.now()}`,
        percentual_acerto: pct,
        criado_em: new Date().toISOString(),
      } as SimuladoSemanalResponse);
    }
    return request("/api/v1/performance/simulados", { method: "POST", body: JSON.stringify(data) });
}

export async function fetchSimulados(skip = 0, limit = 100): Promise<SimuladoSemanalResponse[]> {
    if (USE_MOCKS) return mockResponse(MOCK_SIMULADOS.slice(skip, skip + limit));
    return request(`/api/v1/performance/simulados?skip=${skip}&limit=${limit}`);
}

// Redações
export async function fetchRedacoes(): Promise<RedacaoResponse[]> {
    if (USE_MOCKS) return mockResponse(MOCK_REDACOES);
    return request("/api/v1/performance/redacoes");
}

export async function fetchRedacao(id: string): Promise<RedacaoResponse> {
    if (USE_MOCKS) {
      const found = MOCK_REDACOES.find(r => r.id === id) || MOCK_REDACOES[0];
      return mockResponse(found);
    }
    return request(`/api/v1/performance/redacoes/${id}`);
}

export async function createRedacao(data: RedacaoRequest): Promise<RedacaoResponse> {
    if (USE_MOCKS) {
      const total = data.competencia1 + data.competencia2 + data.competencia3 + data.competencia4 + data.competencia5;
      const notas = [data.competencia1, data.competencia2, data.competencia3, data.competencia4, data.competencia5];
      return mockResponse({
        id: `r_new_${Date.now()}`,
        tema: data.tema,
        eixo_tematico: data.eixo_tematico ?? null,
        data_escrita: new Date().toISOString(),
        tempo_escrita_min: data.tempo_escrita_min ?? null,
        observacoes: data.observacoes ?? null,
        repertorios: data.repertorios ?? null,
        competencia1: data.competencia1,
        competencia2: data.competencia2,
        competencia3: data.competencia3,
        competencia4: data.competencia4,
        competencia5: data.competencia5,
        nota_total: total,
        status: total >= 800 ? "Excelente" : total >= 600 ? "Bom" : total >= 400 ? "Regular" : "Insuficiente",
        competencia_mais_fraca: notas.indexOf(Math.min(...notas)) + 1,
        diagnostico: "Análise simulada (mock).",
        recomendacao: "Continue praticando.",
        criado_em: new Date().toISOString(),
      } as RedacaoResponse);
    }
    return request("/api/v1/performance/redacoes", { method: "POST", body: JSON.stringify(data) });
}
