
import type {
  Categoria,
  Local,
  RecursoAcessibilidade,
} from '../types/local'

export type FiltrosLocais = {
  busca: string
  categoria: Categoria | ''
  recursos: RecursoAcessibilidade[]
  somenteFavoritos: boolean
}

export const FILTROS_VAZIOS: FiltrosLocais = {
  busca: '',
  categoria: '',
  recursos: [],
  somenteFavoritos: false,
}

export function contarFiltrosAtivos(
  filtros: FiltrosLocais,
): number {
  let total = 0

  if (filtros.busca.trim() !== '') {
    total += 1
  }

  if (filtros.categoria !== '') {
    total += 1
  }

  total += filtros.recursos.length

  if (filtros.somenteFavoritos) {
    total += 1
  }

  return total
}

export function filtrarLocais(
  locais: Local[],
  filtros: FiltrosLocais,
  idsFavoritos: string[] = [],
): Local[] {
  const busca = filtros.busca.trim().toLowerCase()

  return locais.filter((local) => {
    const correspondeBusca =
      busca === '' ||
      local.nome.toLowerCase().includes(busca) ||
      local.endereco.toLowerCase().includes(busca) ||
      local.cep.toLowerCase().includes(busca)

    const correspondeCategoria =
      filtros.categoria === '' ||
      local.categoria === filtros.categoria

    const correspondeRecursos =
      filtros.recursos.length === 0 ||
      filtros.recursos.every((recurso) =>
        local.recursosAcessibilidade.includes(recurso),
      )

    const correspondeFavoritos =
      !filtros.somenteFavoritos ||
      idsFavoritos.includes(String(local.id))

    return (
      correspondeBusca &&
      correspondeCategoria &&
      correspondeRecursos &&
      correspondeFavoritos
    )
  })
}
