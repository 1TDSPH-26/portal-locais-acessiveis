// Tratamento centralizado de falhas da camada de serviço.
// Converte qualquer erro técnico (rede, timeout, resposta inválida)
// em uma falha conhecida, com mensagem compreensível para o usuário.

export type TipoFalha = 'indisponivel' | 'tempo_esgotado' | 'resposta_invalida'

const mensagensUsuario: Record<TipoFalha, string> = {
  indisponivel:
    'O serviço de dados está indisponível no momento. Verifique sua conexão e tente novamente em instantes.',
  tempo_esgotado:
    'O serviço demorou mais do que o esperado para responder. Tente novamente em instantes.',
  resposta_invalida:
    'Recebemos dados incompletos do serviço. Tente novamente em instantes.',
}

export class FalhaServicoError extends Error {
  readonly tipo: TipoFalha
  readonly mensagemUsuario: string

  constructor(tipo: TipoFalha, causa?: unknown) {
    super(`Falha na camada de serviço: ${tipo}`, { cause: causa })
    this.name = 'FalhaServicoError'
    this.tipo = tipo
    this.mensagemUsuario = mensagensUsuario[tipo]
  }
}

export const TEMPO_LIMITE_PADRAO_MS = 8000

function normalizarFalha(erro: unknown): FalhaServicoError {
  if (erro instanceof FalhaServicoError) {
    return erro
  }

  return new FalhaServicoError('indisponivel', erro)
}

/**
 * Executa uma consulta da camada de serviço com tempo limite e
 * normalização de erros. Quem chama recebe sempre um FalhaServicoError,
 * nunca uma mensagem técnica crua.
 */
export async function executarConsulta<T>(
  consulta: () => Promise<T>,
  tempoLimiteMs = TEMPO_LIMITE_PADRAO_MS,
): Promise<T> {
  let temporizador: ReturnType<typeof setTimeout> | undefined

  const limite = new Promise<never>((_, rejeitar) => {
    temporizador = setTimeout(() => {
      rejeitar(new FalhaServicoError('tempo_esgotado'))
    }, tempoLimiteMs)
  })

  try {
    return await Promise.race([consulta(), limite])
  } catch (erro) {
    const falha = normalizarFalha(erro)

    if (import.meta.env.DEV) {
      // Detalhe técnico fica apenas no console de desenvolvimento.
      console.error('[servico]', falha, falha.cause)
    }

    throw falha
  } finally {
    clearTimeout(temporizador)
  }
}

export function obterMensagemUsuario(erro: unknown): string {
  return normalizarFalha(erro).mensagemUsuario
}

/**
 * Permite ao QA simular falhas sem alterar código, pela URL:
 *   /locais?simularFalha=locais
 *   /locais/1?simularFalha=detalhe
 *   /locais?simularFalha=tempo
 */
export function falhaSimulada(recurso: string): TipoFalha | null {
  if (typeof window === 'undefined') {
    return null
  }

  const valor = new URLSearchParams(window.location.search).get('simularFalha')

  if (valor === 'tempo') {
    return 'tempo_esgotado'
  }

  if (valor === recurso || valor === 'todos') {
    return 'indisponivel'
  }

  return null
}
