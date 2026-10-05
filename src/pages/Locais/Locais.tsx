import { useEffect, useState } from 'react'
import EmptyState from '../../components/Feedback/EmptyState'
import ErrorMessage from '../../components/Feedback/ErrorMessage'
import LoadingState from '../../components/Feedback/LoadingState'
import LocalCard from '../../components/LocalCard/LocalCard'
import { listaLocais } from '../../data/locais'
import type { Local } from '../../types/local'

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
          <LocalCard key={local.id} local={local} />
        ))}
      </section>
    </main>
  )
}