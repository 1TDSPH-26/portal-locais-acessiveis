import type {
  Categoria,
  RecursoAcessibilidade,
} from '../types/local'
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
    params.set('recursos', filtros.recursos.join(','))
  }

  return params
}

export function lerFiltrosDaUrl(
  searchParams: URLSearchParams,
): FiltrosLocais {
  const busca = searchParams.get('busca') ?? ''

  const categoriaParam =
    searchParams.get('categoria') ?? ''

  const categoria =
    categoriaParam === ''
      ? ''
      : categoriaParam as Categoria

  const recursosParam =
    searchParams.get('recursos') ?? ''

  const recursos = recursosParam
    .split(',')
    .filter(Boolean) as RecursoAcessibilidade[]

  return {
    ...FILTROS_VAZIOS,
    busca,
    categoria,
    recursos,
  }
}
