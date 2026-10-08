import type { Local } from './local'

export type OrdenacaoLocais = 'original' | 'nome-asc' | 'nome-desc'

const comparador = new Intl.Collator('pt-BR', { sensitivity: 'base' })

// Recebe os resultados da busca/filtros, antes de aplicar a paginação.
// A cópia preserva os dados recebidos e permite voltar à ordem original.
export function ordenarLocais(
  locais: readonly Local[],
  ordenacao: OrdenacaoLocais,
): Local[] {
  const resultado = [...locais]
  if (ordenacao === 'original') return resultado

  const direcao = ordenacao === 'nome-asc' ? 1 : -1
  return resultado.sort((a, b) => direcao * comparador.compare(a.nome, b.nome))
}
