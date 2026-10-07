import { useEffect, useMemo, useRef, useState } from 'react'
import EmptyState from '../../components/Feedback/EmptyState'
import ErrorMessage from '../../components/Feedback/ErrorMessage'
import LoadingState from '../../components/Feedback/LoadingState'
import LocalCard from '../../components/LocalCard/LocalCard'
import { listaLocais } from '../../data/locais'
import {
  CATEGORIA_LABELS,
  RECURSO_LABELS,
} from '../../data/rotulos'
import type {
  Categoria,
  Local,
  RecursoAcessibilidade,
} from '../../types/local'
import {
  filtrarLocais,
  type FiltrosLocais,
} from '../../utils/filtrarLocais'

const FILTROS_INICIAIS: FiltrosLocais = {
  busca: '',
  categoria: '',
  recurso: '',
}

const classeControle = [
  'min-h-12 w-full rounded-md border border-gray-300 bg-white px-4 py-2',
  'font-corpo text-corpo-16 text-texto',
  'focus:outline-none focus:ring-2 focus:ring-primaria-600 focus:ring-offset-2',
].join(' ')

const classeBotao = [
  'min-h-12 rounded-md border border-primaria-600 px-4 py-2',
  'font-corpo text-botao font-semibold text-primaria-600',
  'hover:bg-fundo-suave',
  'focus:outline-none focus:ring-2 focus:ring-primaria-600 focus:ring-offset-2',
].join(' ')

export default function Locais() {
  const [locais, setLocais] = useState<Local[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [filtros, setFiltros] = useState<FiltrosLocais>(FILTROS_INICIAIS)

  const itensPorPagina = 4
  const tituloRef = useRef<HTMLHeadingElement>(null)

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

  const locaisFiltrados = useMemo(
    () => filtrarLocais(locais, filtros),
    [locais, filtros],
  )

  useEffect(() => {
    setPaginaAtual(1)
  }, [filtros.busca, filtros.categoria, filtros.recurso])

  const totalPaginas = Math.ceil(
    locaisFiltrados.length / itensPorPagina,
  )

  const indiceInicial = (paginaAtual - 1) * itensPorPagina

  const locaisPaginados = locaisFiltrados.slice(
    indiceInicial,
    indiceInicial + itensPorPagina,
  )

  const possuiFiltrosAtivos =
    filtros.busca !== '' ||
    filtros.categoria !== '' ||
    filtros.recurso !== ''

  const atualizarBusca = (
    evento: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFiltros((estadoAtual) => ({
      ...estadoAtual,
      busca: evento.target.value,
    }))
  }

  const atualizarCategoria = (
    evento: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setFiltros((estadoAtual) => ({
      ...estadoAtual,
      categoria: evento.target.value as Categoria | '',
    }))
  }

  const atualizarRecurso = (
    evento: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setFiltros((estadoAtual) => ({
      ...estadoAtual,
      recurso: evento.target.value as RecursoAcessibilidade | '',
    }))
  }

  const limparFiltros = () => {
    setFiltros(FILTROS_INICIAIS)
  }

  const removerBusca = () => {
    setFiltros((estadoAtual) => ({
      ...estadoAtual,
      busca: '',
    }))
  }

  const removerCategoria = () => {
    setFiltros((estadoAtual) => ({
      ...estadoAtual,
      categoria: '',
    }))
  }

  const removerRecurso = () => {
    setFiltros((estadoAtual) => ({
      ...estadoAtual,
      recurso: '',
    }))
  }

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

      <section
        aria-labelledby="filtros-titulo"
        className="mb-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-5">
          <h2
            id="filtros-titulo"
            className="font-display text-xl font-bold text-texto"
          >
            Filtrar locais
          </h2>

          <p className="mt-1 font-corpo text-corpo-14 text-secundaria">
            Combine os filtros para encontrar locais que atendam aos
            critérios desejados.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="busca-local"
              className="mb-2 block font-corpo text-corpo-16 font-semibold text-texto"
            >
              Buscar local
            </label>

            <input
              id="busca-local"
              type="search"
              value={filtros.busca}
              onChange={atualizarBusca}
              placeholder="Nome, endereço ou CEP"
              className={classeControle}
            />
          </div>

          <div>
            <label
              htmlFor="categoria-local"
              className="mb-2 block font-corpo text-corpo-16 font-semibold text-texto"
            >
              Categoria
            </label>

            <select
              id="categoria-local"
              value={filtros.categoria}
              onChange={atualizarCategoria}
              className={classeControle}
            >
              <option value="">Todas as categorias</option>

              {Object.entries(CATEGORIA_LABELS).map(
                ([valor, label]) => (
                  <option key={valor} value={valor}>
                    {label}
                  </option>
                ),
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="recurso-local"
              className="mb-2 block font-corpo text-corpo-16 font-semibold text-texto"
            >
              Recurso de acessibilidade
            </label>

            <select
              id="recurso-local"
              value={filtros.recurso}
              onChange={atualizarRecurso}
              className={classeControle}
            >
              <option value="">Todos os recursos</option>

              {Object.entries(RECURSO_LABELS).map(
                ([valor, label]) => (
                  <option key={valor} value={valor}>
                    {label}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>

        {possuiFiltrosAtivos && (
          <div className="mt-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="font-corpo text-corpo-14 font-semibold text-texto">
                Filtros ativos:
              </span>

              {filtros.busca !== '' && (
                <button
                  type="button"
                  onClick={removerBusca}
                  aria-label={`Remover filtro de busca: ${filtros.busca}`}
                  className="min-h-10 rounded-full border border-primaria-600 bg-fundo-suave px-3 py-2 font-corpo text-corpo-14 text-primaria-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primaria-600 focus:ring-offset-2"
                >
                  Busca: {filtros.busca} ×
                </button>
              )}

              {filtros.categoria !== '' && (
                <button
                  type="button"
                  onClick={removerCategoria}
                  aria-label={`Remover filtro de categoria: ${CATEGORIA_LABELS[filtros.categoria]}`}
                  className="min-h-10 rounded-full border border-primaria-600 bg-fundo-suave px-3 py-2 font-corpo text-corpo-14 text-primaria-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primaria-600 focus:ring-offset-2"
                >
                  Categoria: {CATEGORIA_LABELS[filtros.categoria]} ×
                </button>
              )}

              {filtros.recurso !== '' && (
                <button
                  type="button"
                  onClick={removerRecurso}
                  aria-label={`Remover filtro de recurso: ${RECURSO_LABELS[filtros.recurso]}`}
                  className="min-h-10 rounded-full border border-primaria-600 bg-fundo-suave px-3 py-2 font-corpo text-corpo-14 text-primaria-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primaria-600 focus:ring-offset-2"
                >
                  Recurso: {RECURSO_LABELS[filtros.recurso]} ×
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={limparFiltros}
              className={classeBotao}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>

      <div
        className="mb-5"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="font-corpo text-corpo-16 text-texto">
          <strong>{locaisFiltrados.length}</strong>{' '}
          {locaisFiltrados.length === 1
            ? 'local encontrado'
            : 'locais encontrados'}
        </p>
      </div>

      {locaisFiltrados.length === 0 ? (
        <EmptyState
          title="Nenhum local encontrado"
          message="Não encontramos locais que correspondam aos filtros selecionados. Tente remover ou alterar algum filtro."
        />
      ) : (
        <>
          <section
            aria-label="Lista de locais acessíveis"
            className="grid gap-6 md:grid-cols-2"
          >
            {locaisPaginados.map((local) => (
              <LocalCard
                key={local.id}
                local={local}
                detalhesUrl={`/locais/${local.id}`}
              />
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

              <div
                className="flex gap-1"
                role="group"
                aria-label="Páginas"
              >
                {Array.from(
                  { length: totalPaginas },
                  (_, index) => {
                    const pagina = index + 1
                    const ehPaginaAtual =
                      pagina === paginaAtual

                    return (
                      <button
                        key={pagina}
                        type="button"
                        onClick={() => mudarPagina(pagina)}
                        aria-current={
                          ehPaginaAtual ? 'page' : undefined
                        }
                        aria-label={`Página ${pagina}`}
                        className={`min-w-[40px] rounded-md px-3 py-2 font-corpo text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                          ehPaginaAtual
                            ? 'bg-blue-600 font-bold text-white'
                            : 'border border-gray-300 text-texto hover:bg-gray-100'
                        }`}
                      >
                        {pagina}
                      </button>
                    )
                  },
                )}
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
        </>
      )}
    </main>
  )
}