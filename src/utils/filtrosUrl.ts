import type {
  Categoria,
  RecursoAcessibilidade,
} from '../types/local'

import {
  CATEGORIAS,
  RECURSOS,
} from '../data/rotulos'

import {
  FILTROS_VAZIOS,
  type FiltrosLocais,
} from './filtrarLocais'

import type { OrdenacaoLocais } from '../types/ordenarLocais'

const ORDENACOES_VALIDAS: OrdenacaoLocais[] = ['original', 'nome-asc', 'nome-desc']

export function filtrosParaUrl(
  filtros: FiltrosLocais,
  ordem: OrdenacaoLocais = 'original'
): URLSearchParams {
  const params = new URLSearchParams()

  if (filtros.busca.trim() !== '') {
    params.set('busca', filtros.busca)
  }

  if (filtros.categoria !== '') {
    params.set('categoria', filtros.categoria)
  }

  if (filtros.recursos.length > 0) {
    params.set(
      'recursos',
      filtros.recursos.join(','),
    )
  }
  
  if (ordem !== 'original') {
    params.set('ordem', ordem)
  }

  return params
}

export function lerFiltrosDaUrl(
  searchParams: URLSearchParams,
): FiltrosLocais {
  const busca = searchParams.get('busca') ?? ''

  const categoriaParam = searchParams.get('categoria') ?? ''

  const categoria: Categoria | '' =
    CATEGORIAS.includes(categoriaParam as Categoria)
      ? (categoriaParam as Categoria)
      : ''

  const recursosParam = searchParams.get('recursos') ?? ''

  const recursos: RecursoAcessibilidade[] = [
    ...new Set(
      recursosParam
        .split(',')
        .filter(
          (recurso): recurso is RecursoAcessibilidade =>
            RECURSOS.includes(recurso as RecursoAcessibilidade),
        ),
    ),
  ]

  return {
    ...FILTROS_VAZIOS,
    busca,
    categoria,
    recursos,
  }
}

export function lerOrdemDaUrl(
  searchParams: URLSearchParams,
): OrdenacaoLocais {
  const ordemParam = searchParams.get('ordem')
  if (
    ordemParam &&
    ORDENACOES_VALIDAS.includes(ordemParam as OrdenacaoLocais)
  ) {
    return ordemParam as OrdenacaoLocais
  }
  return 'original'
}