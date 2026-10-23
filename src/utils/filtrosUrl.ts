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

export function filtrosParaUrl(
  filtros: FiltrosLocais,
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

  if (filtros.somenteFavoritos) {
    params.set('somenteFavoritos', 'true')
  }

  return params
}

export function lerFiltrosDaUrl(
  searchParams: URLSearchParams,
): FiltrosLocais {
  const busca = searchParams.get('busca') ?? ''

  const categoriaParam =
    searchParams.get('categoria') ?? ''

  const categoria: Categoria | '' =
    CATEGORIAS.includes(
      categoriaParam as Categoria,
    )
      ? (categoriaParam as Categoria)
      : ''

  const recursosParam =
    searchParams.get('recursos') ?? ''

  const recursos: RecursoAcessibilidade[] = [
    ...new Set(
      recursosParam
        .split(',')
        .filter(
          (recurso): recurso is RecursoAcessibilidade =>
            RECURSOS.includes(
              recurso as RecursoAcessibilidade,
            ),
        ),
    ),
  ]

  return {
    ...FILTROS_VAZIOS,
    busca,
    categoria,
    recursos,
    somenteFavoritos:
      searchParams.get('somenteFavoritos') === 'true',
  }
}
