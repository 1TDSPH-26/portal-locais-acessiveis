import { describe, expect, it } from 'vitest'
import { listaLocais } from '../data/locais'
import { filtrarLocais, type FiltrosLocais } from './filtrarLocais'

const filtrosVazios: FiltrosLocais = {
  busca: '',
  categoria: '',
  recursos: [],
}

describe('filtrarLocais', () => {
  it('retorna todos os locais quando nenhum filtro está ativo', () => {
    const resultado = filtrarLocais(listaLocais, filtrosVazios)

    expect(resultado).toHaveLength(listaLocais.length)
  })

  it('filtra locais pela busca por nome', () => {
    const filtros: FiltrosLocais = {
      ...filtrosVazios,
      busca: 'Café Horizonte',
    }

    const resultado = filtrarLocais(listaLocais, filtros)

    expect(resultado.map((local) => local.nome)).toEqual(['Café Horizonte'])
  })

  it('filtra locais pelo endereço', () => {
    const filtros: FiltrosLocais = {
      ...filtrosVazios,
      busca: 'Paulista',
    }

    const resultado = filtrarLocais(listaLocais, filtros)

    expect(resultado).toHaveLength(1)
  })

  it('filtra locais pelo CEP', () => {
    const filtros: FiltrosLocais = {
      ...filtrosVazios,
      busca: listaLocais[0].cep,
    }

    const resultado = filtrarLocais(listaLocais, filtros)

    expect(resultado).toHaveLength(1)
  })

  it('filtra locais pela categoria', () => {
    const filtros: FiltrosLocais = {
      ...filtrosVazios,
      categoria: 'restaurante',
    }

    const resultado = filtrarLocais(listaLocais, filtros)

    expect(resultado).toHaveLength(2)
  })

  it('filtra locais por um recurso de acessibilidade', () => {
    const filtros: FiltrosLocais = {
      ...filtrosVazios,
      recursos: ['rampa_acesso'],
    }

    const resultado = filtrarLocais(listaLocais, filtros)

    expect(resultado.length).toBeGreaterThan(0)
    expect(
      resultado.every((local) =>
        local.recursosAcessibilidade.includes('rampa_acesso'),
      ),
    ).toBe(true)
  })

  it('combina busca, categoria e recurso usando todos os filtros', () => {
    const filtros: FiltrosLocais = {
      ...filtrosVazios,
      busca: 'Café Horizonte',
      categoria: 'restaurante',
      recursos: ['rampa_acesso'],
    }

    const resultado = filtrarLocais(listaLocais, filtros)

    expect(resultado).toHaveLength(1)
    expect(resultado[0].nome).toBe('Café Horizonte')
  })

  it('exige que o local tenha todos os recursos selecionados', () => {
    const filtros: FiltrosLocais = {
      ...filtrosVazios,
      recursos: ['rampa_acesso', 'banheiro_adaptado'],
    }

    const resultado = filtrarLocais(listaLocais, filtros)

    expect(resultado.length).toBeGreaterThan(0)
    expect(
      resultado.every(
        (local) =>
          local.recursosAcessibilidade.includes('rampa_acesso') &&
          local.recursosAcessibilidade.includes('banheiro_adaptado'),
      ),
    ).toBe(true)
  })

  it('retorna nenhum resultado quando os filtros não combinam', () => {
    const filtros: FiltrosLocais = {
      ...filtrosVazios,
      categoria: 'restaurante',
      recursos: ['elevador'],
    }

    const resultado = filtrarLocais(listaLocais, filtros)

    expect(resultado).toHaveLength(0)
  })

  it('ignora espaços extras na busca', () => {
    const filtros: FiltrosLocais = {
      ...filtrosVazios,
      busca: '  Café Horizonte  ',
    }

    const resultado = filtrarLocais(listaLocais, filtros)

    expect(resultado).toHaveLength(1)
  })
})
