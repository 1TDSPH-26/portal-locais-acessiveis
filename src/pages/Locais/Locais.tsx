import { useEffect, useId, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'

import ContagemResultados from '../../components/Feedback/ContagemResultados'

import { listaLocais } from '../../data/locais'
import {
  CATEGORIAS,
  CATEGORIA_ROTULOS,
  RECURSOS,
  RECURSO_ROTULOS,
} from '../../data/rotulos'

import type {
  Categoria,
  RecursoAcessibilidade,
} from '../../types/local'

import {
  FILTROS_VAZIOS,
  contarFiltrosAtivos,
  filtrarLocais,
  type FiltrosLocais,
} from '../../utils/filtrarLocais'

import {
  filtrosParaUrl,
  lerFiltrosDaUrl,
} from '../../utils/filtrosUrl'

import {
  ordenarLocais,
  type OrdenacaoLocais,
} from '../../types/ordenarLocais'

const ITENS_POR_PAGINA = 4

const foco =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700'

const campo = `h - 11 w - full rounded - md border border - slate - 300 bg - white px - 3 text - slate - 900 ${ foco } `

const classeLinkDetalhes = [
  'mt-4 inline-flex min-h-11 items-center rounded-md border-2 border-blue-700',
  'px-4 font-semibold text-blue-800',
  'hover:bg-blue-50',
  foco,
].join(' ')

export default function Locais() {
  const [searchParams, setSearchParams] =
    useSearchParams()

  const filtros = lerFiltrosDaUrl(searchParams)

  const [locais, setLocais] =
    useState<typeof listaLocais>([])

  const [loading, setLoading] =
    useState(true)

  const [erro, setErro] =
    useState(false)

  const [filtrosAbertos, setFiltrosAbertos] =
    useState(false)

  const [paginaAtual, setPaginaAtual] =
    useState(1)

  const [ordenacao, setOrdenacao] =
    useState<OrdenacaoLocais>('original')

  const buscaRef =
    useRef<HTMLInputElement>(null)

  const resultadoRef =
    useRef<HTMLParagraphElement>(null)

  const tituloRef =
    useRef<HTMLHeadingElement>(null)

  const buscaId = useId()
  const categoriaId = useId()
  const recursosId = useId()

  /*
   * Carrega os locais.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setLocais(listaLocais)
      } catch {
        setErro(true)
      } finally {
        setLoading(false)
      }
    }, 0)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  /*
   * Atualiza os filtros na URL
   * e retorna para a primeira página.
   */
  const atualizarFiltros = (
    novos: Partial<FiltrosLocais>,
  ) => {
    setSearchParams(
      filtrosParaUrl({
        ...filtros,
        ...novos,
      }),
      { replace: true },
    )

    setPaginaAtual(1)
  }

  /*
   * Alterna um recurso de acessibilidade.
   */
  const alternarRecurso = (
    recurso: RecursoAcessibilidade,
  ) => {
    const recursos =
      filtros.recursos.includes(recurso)
        ? filtros.recursos.filter(
            (item) => item !== recurso,
          )
        : [...filtros.recursos, recurso]

    atualizarFiltros({ recursos })
  }

  /*
   * Limpa todos os filtros.
   */
  const limparFiltros = () => {
    atualizarFiltros(FILTROS_VAZIOS)

    if (buscaRef.current?.offsetParent) {
      buscaRef.current.focus()
    } else {
      resultadoRef.current?.focus()
    }
  }

  /*
   * Altera a ordenação e retorna
   * para a primeira página.
   */
  const alterarOrdenacao = (
    novaOrdenacao: OrdenacaoLocais,
  ) => {
    setOrdenacao(novaOrdenacao)
    setPaginaAtual(1)
  }

  /*
   * Aplica os filtros.
   */
  const locaisFiltrados = filtrarLocais(
    locais,
    filtros,
  )

  /*
   * Aplica a ordenação depois dos filtros.
   */
  const locaisOrdenados = ordenarLocais(
    locaisFiltrados,
    ordenacao,
  )

  const totalFiltrosAtivos =
    contarFiltrosAtivos(filtros)

  /*
   * Calcula a quantidade de páginas.
   */
  const totalPaginas = Math.ceil(
    locaisOrdenados.length /
      ITENS_POR_PAGINA,
  )

  /*
   * Garante que a página atual
   * continue válida após alterações
   * nos filtros.
   */
  const paginaValida = Math.min(
    paginaAtual,
    Math.max(totalPaginas, 1),
  )

  const indiceInicial =
    (paginaValida - 1) *
    ITENS_POR_PAGINA

  /*
   * Locais exibidos na página atual.
   */
  const locaisPaginados =
    locaisOrdenados.slice(
      indiceInicial,
      indiceInicial +
        ITENS_POR_PAGINA,
    )

  /*
   * Troca de página.
   */
  const mudarPagina = (
    pagina: number,
  ) => {
    if (
      pagina >= 1 &&
      pagina <= totalPaginas
    ) {
      setPaginaAtual(pagina)
      tituloRef.current?.focus()
    }
  }

  /*
   * Remove um filtro específico.
   */
  const removerFiltro = (
    tipo:
      | 'busca'
      | 'categoria'
      | 'recurso',
    recurso?: RecursoAcessibilidade,
  ) => {
    if (tipo === 'busca') {
      atualizarFiltros({
        busca: '',
      })
    }

    if (tipo === 'categoria') {
      atualizarFiltros({
        categoria: '',
      })
    }

    if (
      tipo === 'recurso' &&
      recurso
    ) {
      atualizarFiltros({
        recursos:
          filtros.recursos.filter(
            (item) =>
              item !== recurso,
          ),
      })
    }

    window.setTimeout(() => {
      resultadoRef.current?.focus()
    }, 0)
  }

  /*
   * Estado de carregamento.
   */
  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <h1
          ref={tituloRef}
          tabIndex={-1}
          className="text-3xl font-bold tracking-tight focus:outline-none"
        >
          Locais acessíveis
        </h1>

        <ContagemResultados total={null} />

        <p
          role="status"
          className="mt-4"
        >
          Carregando locais...
        </p>
      </main>
    )
  }

  /*
   * Estado de erro.
   */
  if (erro) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <h1
          ref={tituloRef}
          tabIndex={-1}
          className="text-3xl font-bold tracking-tight focus:outline-none"
        >
          Locais acessíveis
        </h1>

        <ContagemResultados total={null} />

        <p
          role="alert"
          className="mt-4"
        >
          Não foi possível carregar os
          locais. Tente novamente.
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <h1
        ref={tituloRef}
        tabIndex={-1}
        className="text-3xl font-bold tracking-tight focus:outline-none"
      >
        Locais acessíveis
      </h1>

      <p className="mt-2 max-w-2xl text-slate-600">
        Combine os filtros para encontrar
        locais que atendam às suas
        necessidades.
      </p>

      <ContagemResultados
        total={locaisFiltrados.length}
      />

      <button
        type="button"
        className={`mt - 6 inline - flex min - h - 11 items - center rounded - md border - 2 border - blue - 700 px - 4 font - semibold text - blue - 800 lg:hidden ${ foco } `}
        aria-expanded={filtrosAbertos}
        aria-controls="painel-filtros"
        onClick={() =>
          setFiltrosAbertos(
            (aberto) => !aberto,
          )
        }
      >
        {filtrosAbertos
          ? 'Ocultar filtros'
          : `Mostrar filtros${
  totalFiltrosAtivos
    ? ` (${totalFiltrosAtivos})`
    : ''
} `}
      </button>

      <div className="mt-6 grid gap-8 lg:grid-cols-[18rem_1fr]">
        <section
          id="painel-filtros"
          className={`${
  filtrosAbertos
    ? 'block'
    : 'hidden'
} lg: block`}
          aria-label="Filtros de locais"
        >
          <form
            role="search"
            onSubmit={(event) =>
              event.preventDefault()
            }
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div>
              <label
                htmlFor={buscaId}
                className="mb-2 block font-semibold"
              >
                Buscar
              </label>

              <input
                ref={buscaRef}
                id={buscaId}
                type="search"
                value={filtros.busca}
                onChange={(event) =>
                  atualizarFiltros({
                    busca:
                      event.target.value,
                  })
                }
                placeholder="Nome, endereço ou CEP"
                className={campo}
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor={categoriaId}
                className="mb-2 block font-semibold"
              >
                Categoria
              </label>

              <select
                id={categoriaId}
                value={filtros.categoria}
                onChange={(event) =>
                  atualizarFiltros({
                    categoria:
                      event.target
                        .value as
                        | Categoria
                        | '',
                  })
                }
                className={campo}
              >
                <option value="">
                  Todas as categorias
                </option>

                {CATEGORIAS.map(
                  (categoria) => (
                    <option
                      key={categoria}
                      value={categoria}
                    >
                      {
                        CATEGORIA_ROTULOS[
                          categoria
                        ]
                      }
                    </option>
                  ),
                )}
              </select>
            </div>

            <fieldset className="mt-5">
              <legend
                id={recursosId}
                className="font-semibold"
              >
                Recursos de acessibilidade
              </legend>

              <div className="mt-3 space-y-2">
                {RECURSOS.map(
                  (recurso) => (
                    <label
                      key={recurso}
                      className="flex min-h-11 cursor-pointer items-center gap-3 rounded px-2 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={filtros.recursos.includes(
                          recurso,
                        )}
                        onChange={() =>
                          alternarRecurso(
                            recurso,
                          )
                        }
                        className="h-4 w-4"
                      />

                      <span className="text-sm">
                        {
                          RECURSO_ROTULOS[
                            recurso
                          ]
                        }
                      </span>
                    </label>
                  ),
                )}
              </div>
            </fieldset>

            <button
              type="button"
              onClick={limparFiltros}
              disabled={
                totalFiltrosAtivos === 0
              }
              className={`mt - 5 min - h - 11 w - full rounded - md border - 2 border - blue - 700 px - 4 font - semibold text - blue - 800 hover: bg - blue - 50 disabled: cursor - not - allowed disabled: border - slate - 300 disabled: text - slate - 400 ${ foco } `}
            >
              Limpar filtros
            </button>
          </form>
        </section>

        <section aria-label="Resultados dos locais">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p
              ref={resultadoRef}
              tabIndex={-1}
              role="status"
              aria-live="polite"
              className="font-semibold focus:outline-none"
            >
              {locaisFiltrados.length ===
              0
                ? 'Nenhum local encontrado com esses filtros.'
                : `${ locaisFiltrados.length } ${
  locaisFiltrados.length ===
    1
    ? 'local encontrado'
    : 'locais encontrados'
}.`}
            </p>

            {totalFiltrosAtivos > 0 && (
              <ul
                aria-label="Filtros aplicados"
                className="mt-3 flex flex-wrap gap-2"
              >
                {filtros.busca.trim() && (
                  <li>
                    <button
                      type="button"
                      onClick={() =>
                        removerFiltro(
                          'busca',
                        )
                      }
                      className={`rounded - full bg - blue - 50 px - 3 py - 1.5 text - sm font - semibold text - blue - 800 ${ foco } `}
                    >
                      Busca:{' '}
                      {filtros.busca}{' '}
                      <span aria-hidden="true">
                        ×
                      </span>

                      <span className="sr-only">
                        {' '}
                        remover filtro
                      </span>
                    </button>
                  </li>
                )}

                {filtros.categoria && (
                  <li>
                    <button
                      type="button"
                      onClick={() =>
                        removerFiltro(
                          'categoria',
                        )
                      }
                      className={`rounded - full bg - blue - 50 px - 3 py - 1.5 text - sm font - semibold text - blue - 800 ${ foco } `}
                    >
                      {
                        CATEGORIA_ROTULOS[
                          filtros.categoria
                        ]
                      }{' '}
                      <span aria-hidden="true">
                        ×
                      </span>

                      <span className="sr-only">
                        {' '}
                        remover filtro
                      </span>
                    </button>
                  </li>
                )}

                {filtros.recursos.map(
                  (recurso) => (
                    <li key={recurso}>
                      <button
                        type="button"
                        onClick={() =>
                          removerFiltro(
                            'recurso',
                            recurso,
                          )
                        }
                        className={`rounded - full bg - blue - 50 px - 3 py - 1.5 text - sm font - semibold text - blue - 800 ${ foco } `}
                      >
                        {
                          RECURSO_ROTULOS[
                            recurso
                          ]
                        }{' '}
                        <span aria-hidden="true">
                          ×
                        </span>

                        <span className="sr-only">
                          {' '}
                          remover filtro
                        </span>
                      </button>
                    </li>
                  ),
                )}

                {totalFiltrosAtivos > 1 && (
                  <li>
                    <button
                      type="button"
                      onClick={
                        limparFiltros
                      }
                      className={`rounded - full px - 3 py - 1.5 text - sm font - semibold text - blue - 800 underline ${ foco } `}
                    >
                      Limpar todos
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>

          {locaisFiltrados.length ===
          0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
              <h2 className="text-xl font-bold">
                Nenhum resultado
              </h2>

              <p className="mt-2 text-slate-600">
                Tente remover algum filtro
                ou fazer uma busca
                diferente.
              </p>

              <button
                type="button"
                onClick={
                  limparFiltros
                }
                className={`mt - 5 min - h - 11 rounded - md bg - blue - 700 px - 5 font - semibold text - white hover: bg - blue - 800 ${ foco } `}
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <>
              <div className="mt-6 flex flex-col gap-2 sm:max-w-xs">
                <label
                  htmlFor="ordenacao-locais"
                  className="font-semibold"
                >
                  Ordenar por
                </label>

                <select
                  id="ordenacao-locais"
                  value={ordenacao}
                  onChange={(event) =>
                    alterarOrdenacao(
                      event.target
                        .value as OrdenacaoLocais,
                    )
                  }
                  aria-controls="resultados-locais"
                  className={campo}
                >
                  <option value="original">
                    Ordem original
                  </option>

                  <option value="nome-asc">
                    Nome: A–Z
                  </option>

                  <option value="nome-desc">
                    Nome: Z–A
                  </option>
                </select>
              </div>

              <section
                id="resultados-locais"
                aria-label="Locais encontrados"
                className="mt-6 grid gap-5 md:grid-cols-2"
              >
                {locaisPaginados.map(
                  (local) => (
                    <article
                      key={local.id}
                      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <h2 className="text-xl font-bold">
                        {local.nome}
                      </h2>

                      <p className="mt-3 text-sm text-slate-700">
                        <strong>
                          Endereço:
                        </strong>{' '}
                        {local.endereco}
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        <strong>
                          CEP:
                        </strong>{' '}
                        {local.cep}
                      </p>

                      <p className="mt-2 text-sm text-slate-700">
                        <strong>
                          Categoria:
                        </strong>{' '}
                        {
                          CATEGORIA_ROTULOS[
                            local.categoria
                          ]
                        }
                      </p>

                      <div className="mt-4">
                        <h3 className="font-semibold">
                          Recursos de
                          acessibilidade
                        </h3>

                        <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
                          {local.recursosAcessibilidade.map(
                            (
                              recurso,
                            ) => (
                              <li
                                key={
                                  recurso
                                }
                              >
                                {
                                  RECURSO_ROTULOS[
                                    recurso
                                  ]
                                }
                              </li>
                            ),
                          )}
                        </ul>
                      </div>

                      <Link
                        to={`/ locais / ${ local.id } `}
                        className={
                          classeLinkDetalhes
                        }
                      >
                        Ver detalhes

                        <span className="sr-only">
                          {' '}
                          de{' '}
                          {local.nome}
                        </span>
                      </Link>
                    </article>
                  ),
                )}
              </section>
            </>
          )}

          {totalPaginas > 1 && (
            <nav
              aria-label="Paginação dos locais"
              className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4"
            >
              <button
                type="button"
                onClick={() =>
                  mudarPagina(
                    paginaValida - 1,
                  )
                }
                disabled={
                  paginaValida === 1
                }
                aria-label="Ir para a página anterior"
                className={`min - h - 11 rounded - md border border - slate - 300 px - 4 font - semibold disabled: cursor - not - allowed disabled: opacity - 50 ${ foco } `}
              >
                Anterior
              </button>

              <div
                aria-label="Páginas"
                className="flex flex-wrap items-center justify-center gap-2"
              >
                {Array.from(
                  {
                    length: totalPaginas,
                  },
                  (_, index) => {
                    const pagina =
                      index + 1

                    return (
                      <button
                        key={pagina}
                        type="button"
                        onClick={() =>
                          mudarPagina(
                            pagina,
                          )
                        }
                        aria-current={
                          pagina ===
                          paginaValida
                            ? 'page'
                            : undefined
                        }
                        aria-label={`Página ${ pagina } `}
                        className={`min - h - 11 min - w - 11 rounded - md px - 3 font - semibold ${
  pagina ===
    paginaValida
    ? 'bg-blue-700 text-white'
    : 'border border-slate-300 hover:bg-slate-100'
} ${ foco } `}
                      >
                        {pagina}
                      </button>
                    )
                  },
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  mudarPagina(
                    paginaValida + 1,
                  )
                }
                disabled={
                  paginaValida ===
                  totalPaginas
                }
                aria-label="Ir para a próxima página"
                className={`min - h - 11 rounded - md border border - slate - 300 px - 4 font - semibold disabled: cursor - not - allowed disabled: opacity - 50 ${ foco } `}
              >
                Próxima
              </button>
            </nav>
          )}
        </section>
      </div>
    </main>
  )
}