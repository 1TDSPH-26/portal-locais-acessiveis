import { listaLocais } from '../data/locais'
import type { Local } from '../types/local'
import {
  FalhaServicoError,
  executarConsulta,
  falhaSimulada,
} from './falha-servico'

// Enquanto a API não está disponível, os dados vêm do arquivo local,
// mas o acesso já passa pela camada de serviço. Assim, a troca por
// fetch(import.meta.env.VITE_API_URL) não exige mudanças nas páginas.

const ATRASO_SIMULADO_MS = 300
const ATRASO_TEMPO_ESGOTADO_MS = 60_000
const TEMPO_LIMITE_SIMULACAO_MS = 1500

function aguardar(ms: number) {
  return new Promise((resolver) => setTimeout(resolver, ms))
}

async function consultarFonte<T>(recurso: string, obter: () => T): Promise<T> {
  const falha = falhaSimulada(recurso)

  if (falha === 'tempo_esgotado') {
    await aguardar(ATRASO_TEMPO_ESGOTADO_MS)
  } else {
    await aguardar(ATRASO_SIMULADO_MS)
  }

  if (falha === 'indisponivel') {
    throw new TypeError('Failed to fetch')
  }

  return obter()
}

function tempoLimite(recurso: string) {
  return falhaSimulada(recurso) === 'tempo_esgotado'
    ? TEMPO_LIMITE_SIMULACAO_MS
    : undefined
}

export function listarLocais(): Promise<Local[]> {
  return executarConsulta(async () => {
    const dados = await consultarFonte('locais', () => listaLocais)

    if (!Array.isArray(dados)) {
      throw new FalhaServicoError('resposta_invalida')
    }

    return [...dados]
  }, tempoLimite('locais'))
}

/** Retorna o local encontrado ou null quando o id não existe. */
export function buscarLocalPorId(id: string): Promise<Local | null> {
  return executarConsulta(
    () =>
      consultarFonte(
        'detalhe',
        () => listaLocais.find((local) => String(local.id) === id) ?? null,
      ),
    tempoLimite('detalhe'),
  )
}
