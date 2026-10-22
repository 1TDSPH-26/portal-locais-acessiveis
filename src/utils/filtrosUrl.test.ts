
import { describe, expect, it } from 'vitest'

import {
  filtrosParaUrl,
  lerFiltrosDaUrl,
} from './filtrosUrl'

import { FILTROS_VAZIOS } from './filtrarLocais'

describe('filtrosParaUrl', () => {
  it('não adiciona parâmetros quando os filtros estão vazios', () => {
    const params = filtrosParaUrl(FILTROS_VAZIOS)

    expect(params.toString()).toBe('')
  })

  it('converte os filtros ativos em parâmetros', () => {
    const params = filtrosParaUrl({
      busca: 'Hospital Central',
      categoria: 'saude',
      recursos: ['elevador', 'rampa_acesso'],
    })

    expect(params.get('busca')).toBe('Hospital Central')
    expect(params.get('categoria')).toBe('saude')
    expect(params.get('recursos')).toBe(
      'elevador,rampa_acesso',
    )
  })

  it('omite a busca quando ela contém apenas espaços', () => {
    const params = filtrosParaUrl({
      ...FILTROS_VAZIOS,
      busca: '   ',
    })

    expect(params.has('busca')).toBe(false)
  })
})

describe('lerFiltrosDaUrl', () => {
  it('recupera os filtros de uma URL parametrizada', () => {
    const params = new URLSearchParams(
      'busca=Hospital&categoria=saude&recursos=elevador,rampa_acesso',
    )

    expect(lerFiltrosDaUrl(params)).toEqual({
      busca: 'Hospital',
      categoria: 'saude',
      recursos: ['elevador', 'rampa_acesso'],
    })
  })

  it('retorna filtros vazios quando não há parâmetros', () => {
    expect(
      lerFiltrosDaUrl(new URLSearchParams()),
    ).toEqual(FILTROS_VAZIOS)
  })

  it('ignora categoria e recursos inválidos', () => {
    const params = new URLSearchParams(
      'categoria=inventada&recursos=desconhecido,elevador',
    )

    expect(lerFiltrosDaUrl(params)).toEqual({
      ...FILTROS_VAZIOS,
      recursos: ['elevador'],
    })
  })

  it('não duplica recursos repetidos', () => {
    const params = new URLSearchParams(
      'recursos=elevador,elevador',
    )

    expect(lerFiltrosDaUrl(params).recursos).toEqual([
      'elevador',
    ])
  })
})