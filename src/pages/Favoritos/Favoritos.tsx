import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import EmptyState from '../../components/Feedback/EmptyState'
import LocalCard from '../../components/LocalCard/LocalCard'
import { listaLocais } from '../../data/locais'
import usePageTitle from '../../hooks/usePageTitle'

const CHAVE_FAVORITOS = 'locais-favoritos'

function lerIdsFavoritos(): number[] {
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

export default function Favoritos() {
  usePageTitle('Meus favoritos')
  const [idsFavoritos, setIdsFavoritos] = useState<number[]>(lerIdsFavoritos)
  const tituloRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    tituloRef.current?.focus()
  }, [])

  useEffect(() => {
    const atualizarFavoritos = () => setIdsFavoritos(lerIdsFavoritos())
    window.addEventListener('storage', atualizarFavoritos)
    return () => window.removeEventListener('storage', atualizarFavoritos)
  }, [])

  const locaisFavoritos = listaLocais.filter((local) => idsFavoritos.includes(local.id))

  useEffect(() => {
    if (locaisFavoritos.length === 0) {
      tituloRef.current?.focus()
    }
  }, [locaisFavoritos.length])

  function removerFavorito(id: number) {
    const novosIds = idsFavoritos.filter((favoritoId) => favoritoId !== id)
    try {
      localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(novosIds))
      setIdsFavoritos(novosIds)
    } catch {
      return
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6" aria-labelledby="titulo-favoritos">
      <h1
        id="titulo-favoritos"
        ref={tituloRef}
        tabIndex={-1}
        className="text-3xl font-bold tracking-tight focus:outline-none"
      >
        Meus favoritos
      </h1>
      <p role="status" aria-live="polite" aria-atomic="true" className="mt-2 max-w-2xl text-slate-600">
        {locaisFavoritos.length === 0
          ? 'Você não tem locais favoritos salvos.'
          : `${locaisFavoritos.length} ${locaisFavoritos.length === 1 ? 'local favorito salvo' : 'locais favoritos salvos'}.`}
      </p>

      {locaisFavoritos.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Você ainda não tem locais favoritos"
            message="Explore os locais disponíveis e favorite aqueles que deseja encontrar novamente."
          />
          <Link
            to="/locais"
            className="mt-5 inline-flex min-h-11 items-center rounded-md bg-blue-700 px-5 font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Explorar locais
          </Link>
        </div>
      ) : (
        <section aria-label="Locais favoritos" className="mt-6 grid gap-5 md:grid-cols-2">
          {locaisFavoritos.map((local) => (
            <LocalCard
              key={local.id}
              local={local}
              detalhesUrl={`/locais/${local.id}`}
              onRemoveFavorite={() => removerFavorito(local.id)}
            />
          ))}
        </section>
      )}
    </section>
  )
}
