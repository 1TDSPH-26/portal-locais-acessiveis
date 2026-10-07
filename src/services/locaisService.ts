import { listaLocais } from '../data/locais'
import type { Local } from '../types/local'

export async function listarLocais(): Promise<Local[]> {
  return listaLocais
}

