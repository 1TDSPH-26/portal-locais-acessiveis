import { useEffect, useState } from 'react'
import EmptyState from '../../components/Feedback/EmptyState'
import ErrorMessage from '../../components/Feedback/ErrorMessage'
import LoadingState from '../../components/Feedback/LoadingState'
import { listaLocais } from '../../data/locais'
import type { Local } from '../../types/local'
import { ordenarLocais, type OrdenacaoLocais } from '../../types/ordenarLocais'

export default function Locais() {
  const [locais, setLocais] = useState<Local[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [ordenacao, setOrdenacao] = useState<OrdenacaoLocais>('original')

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setLocais(listaLocais)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }, 0)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  if (loading) {
    return <LoadingState message="Carregando locais..." />
  }

  if (error) {
    return (
      <ErrorMessage message="Não foi possível carregar os locais. Tente novamente." />
    )
  }

  if (locais.length === 0) {
    return (
      <EmptyState
        title="Nenhum local encontrado"
        message="Não há locais cadastrados para exibir."
      />
    )
  }

  const locaisOrdenados = ordenarLocais(locais, ordenacao)

  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <h1 className="mb-6 font-display text-3xl font-bold text-texto">
        Locais acessíveis
      </h1>

      <div className="mb-6 flex flex-col gap-2 sm:max-w-xs">
        <label htmlFor="ordenacao-locais" className="font-corpo font-semibold text-texto">
          Ordenar por
        </label>
        <select
          id="ordenacao-locais"
          value={ordenacao}
          onChange={(event) => setOrdenacao(event.target.value as OrdenacaoLocais)}
          aria-controls="resultados-locais"
          className="min-h-11 w-full rounded-lg border border-borda-funcional bg-white px-3 py-2 font-corpo text-texto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaria-600"
        >
          <option value="original">Ordem original</option>
          <option value="nome-asc">Nome: A–Z</option>
          <option value="nome-desc">Nome: Z–A</option>
        </select>
      </div>

      <section id="resultados-locais" aria-label="Locais encontrados" className="grid gap-6 md:grid-cols-2">
        {locaisOrdenados.map((local) => (
          <article
            key={local.id}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h2 className="mb-2 font-display text-xl font-bold text-texto">
              {local.nome}
            </h2>

            <p className="font-corpo text-corpo-16 text-texto">
              <strong>Endereço:</strong> {local.endereco}
            </p>

            <p className="font-corpo text-corpo-16 text-texto">
              <strong>CEP:</strong> {local.cep}
            </p>

            <p className="mt-2 font-corpo text-corpo-16 text-texto">
              <strong>Categoria:</strong> {local.categoria}
            </p>

            <div className="mt-4">
              <h3 className="mb-2 font-display text-corpo-16 font-bold text-texto">
                Recursos de acessibilidade
              </h3>

              <ul className="list-disc pl-5 font-corpo text-corpo-16 text-texto">
                {local.recursosAcessibilidade.map((recurso) => (
                  <li key={recurso}>{recurso}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}