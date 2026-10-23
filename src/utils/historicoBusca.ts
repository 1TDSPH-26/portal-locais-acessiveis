export const CHAVE_HISTORICO = 'historico-buscas'
export const LIMITE_HISTORICO = 5
export const TAMANHO_MINIMO_TERMO = 2

/*
 * Todo acesso ao localStorage fica protegido:
 * modo privado, cota cheia ou armazenamento
 * bloqueado não podem impedir a busca.
 */
function gravar(termos: string[]) {
  try {
    localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(termos))
  } catch {
    // Sem persistência, a busca continua funcionando normalmente.
  }
}

export function obterHistorico(): string[] {
  try {
    const salvo = localStorage.getItem(CHAVE_HISTORICO)

    if (!salvo) {
      return []
    }

    const dados: unknown = JSON.parse(salvo)

    if (!Array.isArray(dados)) {
      return []
    }

    return dados
      .filter((termo): termo is string => typeof termo === 'string')
      .slice(0, LIMITE_HISTORICO)
  } catch {
    return []
  }
}

/*
 * Salva o termo no topo do histórico.
 * Um termo repetido (ignorando maiúsculas e
 * espaços nas pontas) volta ao topo sem duplicar.
 */
export function salvarTermo(term: string): string[] {
  const termo = term.trim()
  const historico = obterHistorico()

  if (termo.length < TAMANHO_MINIMO_TERMO) {
    return historico
  }

  const normalizado = termo.toLowerCase()

  const atualizado = [
    termo,
    ...historico.filter(
      (item) => item.trim().toLowerCase() !== normalizado,
    ),
  ].slice(0, LIMITE_HISTORICO)

  gravar(atualizado)

  return atualizado
}

export function removerTermo(index: number): string[] {
  const historico = obterHistorico()

  if (index < 0 || index >= historico.length) {
    return historico
  }

  const atualizado = historico.filter((_, posicao) => posicao !== index)

  gravar(atualizado)

  return atualizado
}

export function limparHistorico() {
  try {
    localStorage.removeItem(CHAVE_HISTORICO)
  } catch {
    // Sem acesso ao armazenamento, não há o que limpar.
  }
}

/*
 * Sugestões para o valor digitado: todos os
 * termos quando vazio, ou apenas os que
 * começam com o prefixo informado.
 */
export function filtrarHistorico(
  historico: string[],
  valor: string,
): string[] {
  const prefixo = valor.trim().toLowerCase()

  if (prefixo === '') {
    return historico
  }

  return historico.filter((termo) =>
    termo.toLowerCase().startsWith(prefixo),
  )
}
