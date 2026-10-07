import type { Categoria, Local, RecursoAcessibilidade } from '../types/local'

export function filtrarLocais(
  locais: Local[],
  categoria: Categoria | '',
  recursos: RecursoAcessibilidade[],
): Local[] {
  return locais.filter((local) => {
    const passaCategoria = categoria === '' || local.categoria === categoria

    const passaRecursos = recursos.every((recurso) =>
      local.recursosAcessibilidade.includes(recurso),
    )

    return passaCategoria && passaRecursos
  })
}