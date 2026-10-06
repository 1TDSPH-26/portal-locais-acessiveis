import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import EmptyState from '../../components/Feedback/EmptyState'
import ErrorMessage from '../../components/Feedback/ErrorMessage'
import LoadingState from '../../components/Feedback/LoadingState'
import { listaLocais } from '../../data/locais'
import type { Local } from '../../types/local'

const classeLinkDetalhes = [
 'mt-4 inline-flex min-h-12 items-center rounded-md border border-primaria-600',
 'px-4 py-2 font-corpo text-botao font-semibold text-primaria-600',
 'hover:bg-fundo-suave focus-visible:outline-2 focus-visible:outline-offset-4',
 'focus-visible:outline-primaria-600',
].join(' ')


export default function Locais() {
  const [locais, setLocais] = useState<Local[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

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

  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <h1 className="mb-6 font-display text-3xl font-bold text-texto">
        Locais acessíveis
      </h1>

      <section className="grid gap-6 md:grid-cols-2">
        {locais.map((local) => (
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
            <Link to={`/locais/${local.id}`} className={classeLinkDetalhes} >
                Ver detalhes
              <span className="sr-only"> de {local.nome}</span>
            </Link>

          </article>
        ))}
      </section>
    </main>
  )
}