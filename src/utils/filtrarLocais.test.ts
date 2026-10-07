import { describe, expect, it } from 'vitest'
import { listaLocais } from '../data/locais'
import { filtrarLocais } from './filtrarLocais'

describe('filtrarLocais', () => {
  it('retorna todos os locais quando nenhum filtro está ativo', () => {
    const resultado = filtrarLocais(listaLocais, {
      busca: '',
      categoria: '',
      recurso: '',
    })

    expect(resultado).toHaveLength(listaLocais.length)
  })

  it('filtra locais pela busca por nome', () => {
    const resultado = filtrarLocais(listaLocais, {
      busca: 'Horizonte',
      categoria: '',
      recurso: '',
    })

    expect(resultado).toHaveLength(1)
    expect(resultado[0].nome).toContain('Horizonte')
  })

  it('filtra locais pelo endereço', () => {
    const resultado = filtrarLocais(listaLocais, {
      busca: 'Paulista',
      categoria: '',
      recurso: '',
    })

    expect(resultado).toHaveLength(1)
  })

  it('filtra locais pelo CEP', () => {
    const resultado = filtrarLocais(listaLocais, {
      busca: '01001-000',
      categoria: '',
      recurso: '',
    })

    expect(resultado).toHaveLength(1)
  })

  it('filtra locais pela categoria', () => {
    const resultado = filtrarLocais(listaLocais, {
      busca: '',
      categoria: 'saude',
      recurso: '',
    })

    expect(resultado).toHaveLength(2)
    expect(resultado.every((local) => local.categoria === 'saude')).toBe(true)
  })

  it('filtra locais pelo recurso de acessibilidade', () => {
    const resultado = filtrarLocais(listaLocais, {
      busca: '',
      categoria: '',
      recurso: 'rampa_acesso',
    })

    expect(resultado.length).toBeGreaterThan(0)
    expect(
      resultado.every((local) =>
        local.recursosAcessibilidade.includes('rampa_acesso'),
      ),
    ).toBe(true)
  })

  it('combina busca, categoria e recurso usando AND', () => {
    const resultado = filtrarLocais(listaLocais, {
      busca: 'Rua',
      categoria: 'saude',
      recurso: 'rampa_acesso',
    })

    expect(resultado).toHaveLength(1)
    expect(resultado[0].nome).toBe('Clínica Bem-Estar')
  })

  it('retorna vazio quando os filtros combinados não encontram resultados', () => {
    const resultado = filtrarLocais(listaLocais, {
      busca: 'Horizonte',
      categoria: 'saude',
      recurso: '',
    })

    expect(resultado).toHaveLength(0)
  })

  it('ignora espaços extras na busca', () => {
    const resultado = filtrarLocais(listaLocais, {
      busca: '  Horizonte  ',
      categoria: '',
      recurso: '',
    })

    expect(resultado).toHaveLength(1)
  })
})