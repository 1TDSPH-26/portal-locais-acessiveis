export const CHAVE_FAVORITOS = 'locais-favoritos'
export const EVENTO_FAVORITOS = 'favoritos-atualizados'

export function lerIdsFavoritos(): number[] {
  try {
    const dados = localStorage.getItem(CHAVE_FAVORITOS)
    const ids: unknown = dados ? JSON.parse(dados) : []
    return Array.isArray(ids)
      ? ids.filter((id): id is number => Number.isInteger(id))
      : []
  } catch {
    return []
  }
}

/** Retorna false quando a alteração não pôde ser salva. */
export function alternarFavorito(id: number): boolean {
  const ids = lerIdsFavoritos()
  const novosIds = ids.includes(id)
    ? ids.filter((favoritoId) => favoritoId !== id)
    : [...ids, id]

  try {
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(novosIds))
  } catch {
    return false
  }

  window.dispatchEvent(new CustomEvent(EVENTO_FAVORITOS))
  return true
}

/** Observa esta aba e outras abas; o chamador deve cancelar na desmontagem. */
export function observarFavoritos(atualizar: () => void): () => void {
  const aoAlterar = () => atualizar()
  const aoAlterarStorage = (evento: StorageEvent) => {
    if (
      evento.storageArea === window.localStorage &&
      (evento.key === CHAVE_FAVORITOS || evento.key === null)
    ) {
      atualizar()
    }
  }

  window.addEventListener(EVENTO_FAVORITOS, aoAlterar)
  window.addEventListener('storage', aoAlterarStorage)

  return () => {
    window.removeEventListener(EVENTO_FAVORITOS, aoAlterar)
    window.removeEventListener('storage', aoAlterarStorage)
  }
}
