import { listaLocais } from '../data/locais'
import type { Local } from '../types/local'
import {
  FalhaServicoError,
  executarConsulta,
  falhaSimulada,
  modoReservaSimulado,
} from './falha-servico'

// Enquanto a API não está disponível, os dados vêm do arquivo local,
// mas o acesso já passa pela camada de serviço. Assim, a troca por
// fetch(import.meta.env.VITE_API_URL) não exige mudanças nas páginas.

const ATRASO_SIMULADO_MS = 300
const ATRASO_TEMPO_ESGOTADO_MS = 60_000
const TEMPO_LIMITE_SIMULACAO_MS = 1500

export type OrigemDados = 'principal' | 'reserva'
export type ResultadoLocais = {
  locais: Local[]
  origem: OrigemDados
}

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

  if (falha === 'resposta_invalida') {
    throw new FalhaServicoError('resposta_invalida')
  }

  return obter()
}

function obterBaseReserva(): Local[] | null {
  return modoReservaSimulado() ? [...listaLocais] : null
}

function tempoLimite(recurso: string) {
  return falhaSimulada(recurso) === 'tempo_esgotado'
    ? TEMPO_LIMITE_SIMULACAO_MS
    : undefined
}

export function listarLocais(): Promise<ResultadoLocais> {
  return executarConsulta(async () => {
    try {
      // A simulação derruba a fonte principal para exercitar o fallback.
      if (modoReservaSimulado()) {
        throw new FalhaServicoError('indisponivel')
      }

      const dados = await consultarFonte('locais', () => listaLocais)

      if (!Array.isArray(dados)) {
        throw new FalhaServicoError('resposta_invalida')
      }

      return { locais: [...dados], origem: 'principal' as const }
    } catch (erro) {
      const reserva = obterBaseReserva()

      if (!reserva) {
        throw erro
      }

      return { locais: reserva, origem: 'reserva' as const }
    }
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
