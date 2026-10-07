import type {
  Categoria,
  Local,
  RecursoAcessibilidade,
} from '../types/local'

export type FiltrosLocais = {
  busca: string
  categoria: Categoria | ''
  recurso: RecursoAcessibilidade | ''
}

export function filtrarLocais(
  locais: Local[],
  filtros: FiltrosLocais,
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

    const correspondeRecurso =
      filtros.recurso === '' ||
      local.recursosAcessibilidade.includes(filtros.recurso)

    return (
      correspondeBusca &&
      correspondeCategoria &&
      correspondeRecurso
    )
  })
}
