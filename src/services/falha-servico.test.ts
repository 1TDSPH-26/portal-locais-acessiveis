import { afterEach, describe, expect, it } from 'vitest'
import {
  FalhaServicoError,
  falhaSimulada,
  obterMensagemUsuario,
} from './falha-servico'

function definirBusca(busca: string) {
  window.history.pushState({}, '', `/locais${busca}`)
}

describe('obterMensagemUsuario', () => {
  it.each([
    [
      'indisponivel',
      'O serviço de dados está temporariamente fora do ar. Estamos trabalhando para restabelecê-lo.',
    ],
    [
      'tempo_esgotado',
      'O serviço demorou mais do que o esperado para responder. Verifique sua conexão e tente novamente.',
    ],
    [
      'resposta_invalida',
      'Recebemos dados corrompidos ou incompletos do servidor. Tente novamente em instantes.',
    ],
  ] as const)('retorna a mensagem específica para %s', (tipo, mensagem) => {
    expect(obterMensagemUsuario(new FalhaServicoError(tipo))).toBe(mensagem)
  })

  it('não expõe detalhes técnicos de erros desconhecidos', () => {
    const mensagem = obterMensagemUsuario(new TypeError('Failed to fetch'))

    expect(mensagem).not.toMatch(/failed to fetch|500/i)
  })
})

describe('falhaSimulada', () => {
  afterEach(() => definirBusca(''))

  it.each([
    ['?simularFalha=tempo', 'locais', 'tempo_esgotado'],
    ['?simularFalha=locais', 'locais', 'indisponivel'],
    ['?simularFalha=invalida', 'locais', 'resposta_invalida'],
    ['?simularFalha=locais', 'detalhe', null],
    ['', 'locais', null],
  ] as const)('%s (recurso %s) -> %s', (busca, recurso, esperado) => {
    definirBusca(busca)

    expect(falhaSimulada(recurso)).toBe(esperado)
  })
})
