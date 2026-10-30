import { describe, expect, it } from 'vitest'
import type { Local } from './local'
import { ordenarLocais } from './ordenarLocais'

function criarLocal(id: number, nome: string): Local {
  return {
    id,
    nome,
    endereco: `Rua Teste, ${id}`,
    cep: '01001-000',
    categoria: 'lazer',
    recursosAcessibilidade: ['rampa_acesso'],
  }
}

// Mistura acentos e maiúsculas/minúsculas de propósito.
const locaisTeste: Local[] = [
  criarLocal(1, 'Zoológico Municipal'),
  criarLocal(2, 'éden Café'),
  criarLocal(3, 'Ábaco Escola'),
  criarLocal(4, 'biblioteca Leitura Livre'),
  criarLocal(5, 'Centro Cultural'),
]

const nomes = (locais: Local[]) => locais.map((local) => local.nome)

const compararPtBr = (a: string, b: string) =>
  a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })

describe('ordenarLocais', () => {
  it('ordena por nome de A a Z', () => {
    const resultado = ordenarLocais(locaisTeste, 'nome-asc')

    expect(nomes(resultado)).toEqual(
      [...nomes(locaisTeste)].sort(compararPtBr),
    )
  })

  it('ordena por nome de Z a A', () => {
    const resultado = ordenarLocais(locaisTeste, 'nome-desc')

    expect(nomes(resultado)).toEqual(
      [...nomes(locaisTeste)].sort((a, b) => compararPtBr(b, a)),
    )
  })

  it('mantém a ordem recebida na opção original', () => {
    const resultado = ordenarLocais(locaisTeste, 'original')

    expect(resultado).toEqual(locaisTeste)
  })

  it.each(['original', 'nome-asc', 'nome-desc'] as const)(
    'não altera o array original na ordenação %s',
    (ordenacao) => {
      const copiaAntes = structuredClone(locaisTeste)

      const resultado = ordenarLocais(locaisTeste, ordenacao)

      expect(locaisTeste).toEqual(copiaAntes)
      expect(resultado).not.toBe(locaisTeste)
    },
  )
})
