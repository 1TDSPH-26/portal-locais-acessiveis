import { listaLocais } from '../data/locais'
import type { Local } from '../types/local'

export type DadosCadastroLocal = Omit<Local, 'id'>

export async function cadastrarLocal(
  dados: DadosCadastroLocal,
): Promise<Local> {
  if (!dados.nome.trim()) {
    throw new Error('O nome do local é obrigatório.')
  }

  if (!dados.endereco.trim()) {
    throw new Error('O endereço do local é obrigatório.')
  }

  if (!dados.cep.trim()) {
    throw new Error('O CEP do local é obrigatório.')
  }

  if (!dados.categoria) {
    throw new Error('A categoria do local é obrigatória.')
  }

  const proximoId =
    listaLocais.length > 0
      ? Math.max(...listaLocais.map((local) => local.id)) + 1
      : 1

  const novoLocal: Local = {
    id: proximoId,
    ...dados,
  }

  listaLocais.push(novoLocal)

  return novoLocal
}