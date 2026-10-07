import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import EmptyState from '../../components/Feedback/EmptyState'
import ErrorMessage from '../../components/Feedback/ErrorMessage'
import LoadingState from '../../components/Feedback/LoadingState'
import { listarLocais } from '../../services/locaisService'
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


  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 4 

  const tituloRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const carregarLocais = async () => {
      try {
        const dados = await listarLocais()
        setLocais(dados)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    void carregarLocais()
  }, [])

  const totalPaginas = Math.ceil(locais.length / itensPorPagina)
  const indiceInicial = (paginaAtual - 1) * itensPorPagina
  const locaisPaginados = locais.slice(indiceInicial, indiceInicial + itensPorPagina)

  const mudarPagina = (novaPagina: number) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina)
      if (tituloRef.current) {
        tituloRef.current.focus()
      }
    }
  }

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
      <h1
        ref={tituloRef}
        tabIndex={-1}
        className="mb-6 font-display text-3xl font-bold text-texto focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      >
        Locais acessíveis
      </h1>
      
      <section className="grid gap-6 md:grid-cols-2">
        {locaisPaginados.map((local) => (
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

      {totalPaginas > 1 && (
        <nav
          aria-label="Navegação por páginas de locais"
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => mudarPagina(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            aria-label="Ir para a página anterior"
            className="rounded-md border border-gray-300 px-4 py-2 font-corpo text-sm font-medium text-texto transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            Anterior
          </button>

          <div className="flex gap-1" role="group" aria-label="Páginas">
            {Array.from({ length: totalPaginas }, (_, index) => {
              const pagina = index + 1
              const ehPaginaAtual = pagina === paginaAtual

              return (
                <button
                  key={pagina}
                  type="button"
                  onClick={() => mudarPagina(pagina)}
                  aria-current={ehPaginaAtual ? 'page' : undefined}
                  aria-label={`Página ${pagina}`}
                  className={`min-w-[40px] rounded-md px-3 py-2 font-corpo text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                    ehPaginaAtual
                      ? 'bg-blue-600 text-white font-bold'
                      : 'border border-gray-300 text-texto hover:bg-gray-100'
                  }`}
                >
                  {pagina}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => mudarPagina(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            aria-label="Ir para a próxima página"
            className="rounded-md border border-gray-300 px-4 py-2 font-corpo text-sm font-medium text-texto transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            Próxima
          </button>
        </nav>
      )}
    </main>
  )
}
