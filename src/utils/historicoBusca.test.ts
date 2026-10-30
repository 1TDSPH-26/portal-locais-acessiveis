import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  CHAVE_HISTORICO,
  filtrarHistorico,
  limparHistorico,
  obterHistorico,
  removerTermo,
  salvarTermo,
} from './historicoBusca'

function lerArmazenado() {
  return JSON.parse(localStorage.getItem(CHAVE_HISTORICO) ?? 'null')
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('salvarTermo', () => {
  it('grava o termo na chave historico-buscas', () => {
    salvarTermo('Café')

    expect(lerArmazenado()).toEqual(['Café'])
  })

  it('aplica trim antes de salvar', () => {
    salvarTermo('  Parque  ')

    expect(obterHistorico()).toEqual(['Parque'])
  })

  it('ignora termos vazios ou com menos de 2 caracteres', () => {
    salvarTermo('')
    salvarTermo('   ')
    salvarTermo('a')
    salvarTermo(' b ')

    expect(obterHistorico()).toEqual([])
    expect(localStorage.getItem(CHAVE_HISTORICO)).toBeNull()
  })

  it('coloca o termo mais recente no topo', () => {
    salvarTermo('Café')
    salvarTermo('Parque')

    expect(obterHistorico()).toEqual(['Parque', 'Café'])
  })

  it('move um termo repetido para o topo sem duplicar, ignorando maiúsculas', () => {
    salvarTermo('Café')
    salvarTermo('Parque')
    salvarTermo('  CAFÉ ')

    expect(obterHistorico()).toEqual(['CAFÉ', 'Parque'])
  })

  it('mantém apenas os últimos 5 termos', () => {
    ;['um', 'dois', 'três', 'quatro', 'cinco', 'seis'].forEach(salvarTermo)

    expect(obterHistorico()).toEqual([
      'seis',
      'cinco',
      'quatro',
      'três',
      'dois',
    ])
  })

  it('retorna o histórico atualizado mesmo quando o localStorage falha', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Cota excedida', 'QuotaExceededError')
    })

    expect(() => salvarTermo('Museu')).not.toThrow()
    expect(salvarTermo('Museu')).toEqual(['Museu'])
  })
})

describe('obterHistorico', () => {
  it('retorna lista vazia quando não há histórico', () => {
    expect(obterHistorico()).toEqual([])
  })

  it('retorna lista vazia quando o conteúdo salvo é inválido', () => {
    localStorage.setItem(CHAVE_HISTORICO, '{quebrado')
    expect(obterHistorico()).toEqual([])

    localStorage.setItem(CHAVE_HISTORICO, JSON.stringify({ termo: 'x' }))
    expect(obterHistorico()).toEqual([])
  })

  it('descarta itens que não são texto', () => {
    localStorage.setItem(
      CHAVE_HISTORICO,
      JSON.stringify(['Café', 42, null, 'Parque']),
    )

    expect(obterHistorico()).toEqual(['Café', 'Parque'])
  })

  it('retorna lista vazia quando o localStorage está bloqueado', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Acesso negado', 'SecurityError')
    })

    expect(obterHistorico()).toEqual([])
  })
})

describe('removerTermo', () => {
  it('remove o termo pela posição', () => {
    salvarTermo('Café')
    salvarTermo('Parque')
    salvarTermo('Museu')

    expect(removerTermo(1)).toEqual(['Museu', 'Café'])
    expect(lerArmazenado()).toEqual(['Museu', 'Café'])
  })

  it('ignora posições inexistentes', () => {
    salvarTermo('Café')

    expect(removerTermo(-1)).toEqual(['Café'])
    expect(removerTermo(5)).toEqual(['Café'])
  })
})

describe('limparHistorico', () => {
  it('remove a chave do localStorage', () => {
    salvarTermo('Café')
    limparHistorico()

    expect(localStorage.getItem(CHAVE_HISTORICO)).toBeNull()
    expect(obterHistorico()).toEqual([])
  })

  it('não lança erro quando o localStorage falha', () => {
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new DOMException('Acesso negado', 'SecurityError')
    })

    expect(() => limparHistorico()).not.toThrow()
  })
})

describe('filtrarHistorico', () => {
  const historico = ['Café Horizonte', 'Parque', 'cafeteria']

  it('retorna todos os termos quando o valor está vazio', () => {
    expect(filtrarHistorico(historico, '  ')).toEqual(historico)
  })

  it('retorna apenas os termos que começam com o prefixo', () => {
    expect(filtrarHistorico(historico, 'CAF')).toEqual([
      'Café Horizonte',
      'cafeteria',
    ])
    expect(filtrarHistorico(historico, 'rque')).toEqual([])
  })
})
