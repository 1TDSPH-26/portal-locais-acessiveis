import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { useSearchParams } from 'react-router'

import ContagemResultados from '../../components/Feedback/ContagemResultados'
import DataAtualizacao from '../../components/Feedback/DataAtualizacao'
import EmptyState from '../../components/Feedback/EmptyState'
import ErrorMessage from '../../components/Feedback/ErrorMessage'
import LocalCard from '../../components/LocalCard/LocalCard'
import AvisoDadosReserva from '../../components/Feedback/AvisoDadosReserva'
import LoadingState from '../../components/Feedback/LoadingState'
import { useConsulta } from '../../hooks/useConsulta'
import { useGeolocation } from '../../hooks/useGeolocation'
import { calcularDistanciaKm } from '../../utils/geolocalizacao'
import { listarLocais } from '../../services/locais-consulta'

import {
  CATEGORIAS,
  CATEGORIA_ROTULOS,
  RECURSOS,
  RECURSO_ROTULOS,
} from '../../data/rotulos'

import type {
  Categoria,
  Local,
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
  lerOrdemDaUrl,
} from '../../utils/filtrosUrl'

import {
  filtrarHistorico,
  obterHistorico,
  salvarTermo,
  limparHistoricoBuscas,
} from '../../utils/historicoBusca'

import {
  ordenarLocais,
  type OrdenacaoLocais,
} from '../../types/ordenarLocais'
import usePageTitle from '../../hooks/usePageTitle'
import BotaoVoltarAoTopo from '../../components/Navegacao/BotaoVoltarAoTopo'
import {
  botaoPaginacao,
  filtroAplicado,
  focoVisivelPrimario,
} from '../../utils/estilosCompartilhados'

const ITENS_POR_PAGINA = 4
const FAVORITOS_STORAGE_KEY = 'locais-favoritos'

function lerFavoritos(): number[] {
  try {
    const dados = localStorage.getItem(FAVORITOS_STORAGE_KEY)
    const favoritos: unknown = dados ? JSON.parse(dados) : []
    return Array.isArray(favoritos)
      ? favoritos.filter((id): id is number => Number.isInteger(id))
      : []
  } catch {
    return []
  }
}

const campo = `h-11 w-full rounded-md border border-borda-funcional bg-fundo px-3 text-texto ${focoVisivelPrimario}`

export default function Locais() {
  usePageTitle('Locais acessíveis')

  const [searchParams, setSearchParams] = useSearchParams()
  const filtros = lerFiltrosDaUrl(searchParams)
  const ordemInicial = lerOrdemDaUrl(searchParams)

  const { estado, retentando, tentarNovamente } = useConsulta(listarLocais)

  const resultado = estado.status === 'sucesso' ? estado.dados : null

  // Garantimos compatibilidade: se for array (como no mock de testes), usamos direto.
  // Se for o novo formato de objeto da branch, acessamos .locais
  const locais: Local[] = Array.isArray(resultado)
    ? resultado
    : (resultado?.locais ?? [])

  const emModoReserva = !Array.isArray(resultado) && resultado?.origem === 'reserva'

  const [somenteFavoritos, setSomenteFavoritos] = useState(false)
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [ordenacao, setOrdenacao] = useState<OrdenacaoLocais>(ordemInicial)

  const buscaRef = useRef<HTMLInputElement>(null)
  const limparHistoricoRef = useRef<HTMLButtonElement>(null)
  const ignorarBuscaAteEditarRef = useRef(false)
  const resultadoRef = useRef<HTMLParagraphElement>(null)
  const tituloRef = useRef<HTMLHeadingElement>(null)
  const listaFiltrosRef = useRef<HTMLUListElement>(null)

  const buscaId = useId()
  const sugestoesId = useId()
  const categoriaId = useId()
  const recursosId = useId()

  const [historico, setHistorico] = useState(obterHistorico)
  const [sugestoesAbertas, setSugestoesAbertas] = useState(false)
  const [sugestaoAtiva, setSugestaoAtiva] = useState(-1)

  const houveRetentativa = useRef(false)

  const { coordenadas, solicitarLocalizacao } = useGeolocation()

  /*
   * Solicita a localização uma única vez
   * ao entrar na listagem.
   */
  useEffect(() => {
    solicitarLocalizacao()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /*
   * Calcula a distância entre o usuário
   * e o local, quando ambos têm coordenadas.
   */
  const calcularDistanciaLocal = (local: Local): number | null => {
    if (!coordenadas || !local.coordenadas) {
      return null
    }

    return calcularDistanciaKm(
      coordenadas.latitude,
      coordenadas.longitude,
      local.coordenadas.latitude,
      local.coordenadas.longitude,
    )
  }
  /*
   * Devolve o foco para a contagem de
   * resultados quando uma nova tentativa
   * carrega os locais com sucesso.
   */
  const reexecutarConsulta = () => {
    houveRetentativa.current = true
    tentarNovamente()
  }

  useEffect(() => {
    if (estado.status === 'sucesso' && houveRetentativa.current) {
      houveRetentativa.current = false
      resultadoRef.current?.focus()
    }
  }, [estado])

  /*
   * Atualiza os filtros na URL
   * e retorna para a primeira página.
   */
  const atualizarFiltros = (novos: Partial<FiltrosLocais>) => {
    const filtrosAtualizados: FiltrosLocais = {
      ...filtros,
      ...novos,
    }

    const parametrosAtualizados = new URLSearchParams(searchParams)

    // Remove apenas os parâmetros controlados pelos filtros.
    parametrosAtualizados.delete('busca')
    parametrosAtualizados.delete('categoria')
    parametrosAtualizados.delete('recursos')

    // Adiciona novamente apenas os filtros ativos.
    filtrosParaUrl(filtrosAtualizados).forEach((valor, chave) => {
      parametrosAtualizados.set(chave, valor)
    })

    setSearchParams(parametrosAtualizados, {
      replace: true,
    })

    setPaginaAtual(1)
  }

  /*
   * Sugestões do histórico para o
   * valor atual do campo de busca.
   */
  const sugestoes = filtrarHistorico(
    historico,
    filtros.busca,
  )

  const listaSugestoesVisivel =
  sugestoesAbertas && sugestoes.length > 0

  const fecharSugestoes = () => {
    setSugestoesAbertas(false)
    setSugestaoAtiva(-1)
  }

  const executarLimpezaHistorico = () => {
  limparHistoricoBuscas()
  setHistorico([])
  ignorarBuscaAteEditarRef.current = true
  fecharSugestoes()
  buscaRef.current?.focus()
}

  /*
   * Grava o termo pesquisado sem
   * depender do localStorage para buscar.
   */
  const registrarBusca = (termo: string) => {
    setHistorico(salvarTermo(termo))
  }

  /*
   * Preenche o campo com a sugestão,
   * atualiza os resultados e mantém
   * o foco na busca.
   */
  const selecionarSugestao = (termo: string) => {
    atualizarFiltros({ busca: termo })
    registrarBusca(termo)
    fecharSugestoes()
    buscaRef.current?.focus()
  }

  const navegarSugestoes = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (sugestoes.length === 0) {
        return
      }

      event.preventDefault()
      setSugestoesAbertas(true)

      const passo = event.key === 'ArrowDown' ? 1 : -1

      setSugestaoAtiva((atual) => {
        if (!listaSugestoesVisivel || atual === -1) {
          return passo === 1 ? 0 : sugestoes.length - 1
        }

        return (atual + passo + sugestoes.length) % sugestoes.length
      })

      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()

      if (listaSugestoesVisivel && sugestaoAtiva >= 0) {
        selecionarSugestao(sugestoes[sugestaoAtiva])
      } else {
        registrarBusca(filtros.busca)
        fecharSugestoes()
      }

      return
    }

    if (event.key === 'Escape' && listaSugestoesVisivel) {
      // Impede que o campo search apague o texto digitado.
      event.preventDefault()
      fecharSugestoes()
    }
  }

  /*
   * Alterna um recurso de acessibilidade.
   */
  const alternarRecurso = (recurso: RecursoAcessibilidade) => {
    const recursos = filtros.recursos.includes(recurso)
      ? filtros.recursos.filter((item) => item !== recurso)
      : [...filtros.recursos, recurso]

    atualizarFiltros({ recursos })
  }

  /*
   * Limpa todos os filtros.
   * Com focarBusca, abre o painel no mobile
   * para levar o foco à busca.
   */
  const limparFiltros = (
    { focarBusca = false }: { focarBusca?: boolean } = {},
  ) => {
    atualizarFiltros(FILTROS_VAZIOS)
    setSomenteFavoritos(false)

    if (buscaRef.current?.offsetParent) {
      buscaRef.current.focus()
    } else if (focarBusca) {
      setFiltrosAbertos(true)

      window.setTimeout(() => {
        buscaRef.current?.focus()
      }, 0)
    } else {
      resultadoRef.current?.focus()
    }
  }

  /*
   * Altera a ordenação, atualiza a URL e retorna para a primeira página.
   */
  const alterarOrdenacao = (novaOrdenacao: OrdenacaoLocais) => {
    setOrdenacao(novaOrdenacao)
    setPaginaAtual(1)
    
    const parametrosAtualizados = new URLSearchParams(searchParams)
    
    if (novaOrdenacao === 'original') {
      parametrosAtualizados.delete('ordem')
    } else {
      parametrosAtualizados.set('ordem', novaOrdenacao)
    }

    setSearchParams(parametrosAtualizados, { replace: true })
  }

  /*
   * Aplica os filtros e a ordenação.
   */
  const favoritosSalvos = lerFavoritos()
  const locaisFiltrados = filtrarLocais(
    locais,
    filtros,
  ).filter((local) =>
    !somenteFavoritos || favoritosSalvos.includes(local.id),
  )

  /*
   * Aplica a ordenação depois dos filtros.
   */
  const locaisOrdenados = ordenarLocais(
    locaisFiltrados,
    ordenacao,
  )

  const totalFiltrosAtivos =
    contarFiltrosAtivos(filtros) + Number(somenteFavoritos)

  /*
   * Calcula a quantidade de páginas.
   */
  const totalPaginas = Math.ceil(locaisOrdenados.length / ITENS_POR_PAGINA)

  /*
   * Garante que a página atual continue válida.
   */
  const paginaValida = Math.min(paginaAtual, Math.max(totalPaginas, 1))

  const indiceInicial = (paginaValida - 1) * ITENS_POR_PAGINA

  /*
   * Locais exibidos na página atual.
   */
  const locaisPaginados = locaisOrdenados.slice(
    indiceInicial,
    indiceInicial + ITENS_POR_PAGINA,
  )

  /*
   * Troca de página.
   */
  const mudarPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaAtual(pagina)
      tituloRef.current?.focus({ preventScroll: true })
    }
  }

  const removerFiltro = (
    tipo: 'busca' | 'categoria' | 'recurso' | 'favoritos',
    recurso?: RecursoAcessibilidade,
  ) => {
    if (tipo === 'busca') {
      atualizarFiltros({ busca: '' })
    }

    if (tipo === 'categoria') {
      atualizarFiltros({ categoria: '' })
    }

    if (tipo === 'recurso' && recurso) {
      atualizarFiltros({
        recursos: filtros.recursos.filter((item) => item !== recurso),
      })
    }

    if (tipo === 'favoritos') {
      setSomenteFavoritos(false)
    }

    window.setTimeout(() => {
      const botoesRestantes =
        listaFiltrosRef.current?.querySelectorAll('button')

      if (botoesRestantes && botoesRestantes.length > 0) {
        botoesRestantes[0].focus()
      } else {
        resultadoRef.current?.focus()
      }
    }, 0)
  }

  if (estado.status === 'carregando') {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <h1
          ref={tituloRef}
          tabIndex={-1}
          className="text-3xl font-bold tracking-tight focus:outline-none"
        >
          Locais acessíveis
        </h1>

        <LoadingState message="Carregando locais..." />
      </main>
    )
  }

  /*
   * Estado de erro, com opção para tentar novamente.
   */
  if (estado.status === 'erro') {
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
        <ErrorMessage
          title="Não foi possível carregar os locais"
          message={estado.mensagem}
          onRetry={reexecutarConsulta}
          retrying={retentando}
          focusOnMount
        />
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6">
      <h1
        ref={tituloRef}
        tabIndex={-1}
        className="text-3xl font-bold tracking-tight focus:outline-none"
      >
        Locais acessíveis
      </h1>

      {emModoReserva && (
        <AvisoDadosReserva
          onDispensar={() => tituloRef.current?.focus()}
        />
      )}

      <p className="mt-2 max-w-2xl text-secundaria">
        Combine os filtros para encontrar
        locais que atendam às suas
        necessidades.
      </p>

      <ContagemResultados total={locaisFiltrados.length} />
      <DataAtualizacao
        tipo="base"
        data={!Array.isArray(resultado) ? resultado?.ultimaAtualizacao : undefined}
      />

      <button
        type="button"
        className={`mt-6 inline-flex min-h-11 items-center rounded-md border-2 border-primaria-600 px-4 font-semibold text-primaria-700 lg:hidden ${focoVisivelPrimario}`}
        aria-expanded={filtrosAbertos}
        aria-controls="painel-filtros"
        onClick={() => setFiltrosAbertos((aberto) => !aberto)}
      >
        {filtrosAbertos
          ? 'Ocultar filtros'
          : `Mostrar filtros${totalFiltrosAtivos ? ` (${totalFiltrosAtivos})` : ''}`}
      </button>

      <div className="mt-6 grid gap-8 lg:grid-cols-[18rem_1fr]">
        <section
          id="painel-filtros"
          className={`${filtrosAbertos ? 'block' : 'hidden'} lg:block`}
          aria-label="Filtros de locais"
        >
          <form
            role="search"
            onSubmit={(event) => event.preventDefault()}
            className="rounded-lg border border-borda-decorativa bg-fundo p-5 shadow-sm"
          >
            <div className="relative">
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
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={listaSugestoesVisivel}
                aria-controls={sugestoesId}
                aria-activedescendant={
                  listaSugestoesVisivel &&
                    sugestaoAtiva >= 0
                    ? `${sugestoesId}-${sugestaoAtiva}`
                    : undefined
                }
                autoComplete="off"
                value={filtros.busca}
                onChange={(event) => {
                  ignorarBuscaAteEditarRef.current = false

                  atualizarFiltros({
                    busca: event.target.value,
                  })

                  setSugestoesAbertas(true)
                  setSugestaoAtiva(-1)
                }}

                onFocus={() => setSugestoesAbertas(true)}
                onClick={() => setSugestoesAbertas(true)}
                onBlur={(event) => {
  if (event.relatedTarget === limparHistoricoRef.current) {
    return
  }

  if (!ignorarBuscaAteEditarRef.current) {
    registrarBusca(filtros.busca)
  }

  fecharSugestoes()
}}
                onKeyDown={navegarSugestoes}
                placeholder="Nome, endereço ou CEP"
                className={campo}
              />

              <div
                hidden={!listaSugestoesVisivel}
                className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-md border border-slate-300 bg-white py-1 shadow-lg"
              >
                <ul
                  id={sugestoesId}
                  role="listbox"
                  aria-label="Buscas recentes"
                >
                {sugestoes.map((termo, indice) => (
                  <li
                    key={termo}
                    id={`${sugestoesId}-${indice}`}
                    role="option"
                    aria-selected={indice === sugestaoAtiva}
                    // Evita o blur do campo antes do clique.
                    onMouseDown={(event) =>
                      event.preventDefault()
                    }
                    onClick={() => selecionarSugestao(termo)}
                    className={`flex min-h-11 cursor-pointer items-center px-3 text-slate-900 ${indice === sugestaoAtiva
                      ? 'bg-blue-50 font-semibold text-blue-800'
                      : 'hover:bg-slate-50'
                      }`}
                  >
                    {termo}
                  </li>
                ))}
              </ul>

               {historico.length > 0 && (
      <button
        ref={limparHistoricoRef}
        type="button"
        aria-label="Limpar todo o histórico de termos buscados"
        onMouseDown={(event) => event.preventDefault()}
        onClick={executarLimpezaHistorico}
        onBlur={fecharSugestoes}
        onKeyDown={(event) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    buscaRef.current?.focus()
    fecharSugestoes()
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    buscaRef.current?.focus()
    setSugestaoAtiva(sugestoes.length - 1)
  }
}}
        className={`block min-h-11 w-full border-t border-slate-200 px-3 text-left font-semibold text-primaria-700 hover:bg-slate-50 ${focoVisivelPrimeiro}`}
      >
        Limpar histórico de buscas
      </button>
    )}
  </div>
              <p
                aria-live="polite"
                className="sr-only"
              >
                {listaSugestoesVisivel
                  ? `${sugestoes.length} ${sugestoes.length === 1
                    ? 'busca recente disponível'
                    : 'buscas recentes disponíveis'
                  }. Use as setas para navegar.`
                  : ''}
              </p>
            </div>

            <div className="mt-5">
              <label htmlFor={categoriaId} className="mb-2 block font-semibold">
                Categoria
              </label>
              <select
                id={categoriaId}
                value={filtros.categoria}
                onChange={(event) =>
                  atualizarFiltros({
                    categoria: event.target.value as Categoria | '',
                  })
                }
                className={campo}
              >
                <option value="">Todas as categorias</option>

                {CATEGORIAS.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {CATEGORIA_ROTULOS[categoria]}
                  </option>
                ))}
              </select>
            </div>

            <fieldset className="mt-5">
              <legend id={recursosId} className="font-semibold">
                Recursos de acessibilidade
              </legend>
              <div className="mt-3 space-y-2">
                {RECURSOS.map((recurso) => (
                  <label
                    key={recurso}
                    className="flex min-h-11 cursor-pointer items-center gap-3 rounded px-2 hover:bg-fundo-suave"
                  >
                    <input
                      type="checkbox"
                      checked={filtros.recursos.includes(recurso)}
                      onChange={() => alternarRecurso(recurso)}
                      className="h-4 w-4"
                    />

                    <span className="text-sm">
                      {RECURSO_ROTULOS[recurso]}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="mt-5 flex min-h-11 cursor-pointer items-center gap-3 rounded px-2 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={somenteFavoritos}
                onChange={(event) => {
                  setSomenteFavoritos(event.target.checked)
                  setPaginaAtual(1)
                }}
                className="h-4 w-4"
              />
              <span className="text-sm">Somente favoritos</span>
            </label>

            <button
              type="button"
              onClick={() => limparFiltros()}
              disabled={totalFiltrosAtivos === 0}
              className={`mt-5 min-h-11 w-full rounded-md border-2 border-primaria-600 px-4 font-semibold text-primaria-700 hover:bg-fundo-suave disabled:cursor-not-allowed disabled:border-borda-decorativa disabled:text-secundaria ${focoVisivelPrimario}`}
            >
              Limpar filtros
            </button>
          </form>
        </section>

        <section aria-label="Resultados dos locais">
          <div className="rounded-lg border border-borda-decorativa bg-fundo p-4 shadow-sm">
            <p
              ref={resultadoRef}
              tabIndex={-1}
              role="status"
              aria-live="polite"
              className="font-semibold focus:outline-none"
            >
              {locais.length === 0
                ? 'Nenhum local cadastrado no momento.'
                : locaisFiltrados.length === 0
                  ? 'Nenhum local encontrado com esses filtros.'
                  : `${locaisFiltrados.length} ${locaisFiltrados.length === 1
                    ? 'local encontrado'
                    : 'locais encontrados'
                  }.`}
            </p>

            {totalFiltrosAtivos > 0 && (
              <ul
                ref={listaFiltrosRef}
                aria-label="Filtros aplicados"
                className="mt-3 flex flex-wrap gap-2"
              >
                {filtros.busca.trim() && (
                  <li>
                    <button
                      type="button"
                      onClick={() => removerFiltro('busca')}
                      className={`${filtroAplicado} ${focoVisivelPrimario}`}
                    >
                      Busca: {filtros.busca.trim()}{' '}
                      <span aria-hidden="true">×</span>
                      <span className="sr-only"> remover filtro</span>
                    </button>
                  </li>
                )}

                {filtros.categoria && (
                  <li>
                    <button
                      type="button"
                      onClick={() => removerFiltro('categoria')}
                      className={`${filtroAplicado} ${focoVisivelPrimario}`}
                    >
                      {CATEGORIA_ROTULOS[filtros.categoria]}{' '}
                      <span aria-hidden="true">×</span>
                      <span className="sr-only"> remover filtro</span>
                    </button>
                  </li>
                )}

                {filtros.recursos.map((recurso) => (
                  <li key={recurso}>
                    <button
                      type="button"
                      onClick={() => removerFiltro('recurso', recurso)}
                      className={`${filtroAplicado} ${focoVisivelPrimario}`}
                    >
                      {RECURSO_ROTULOS[recurso]}{' '}
                      <span aria-hidden="true">×</span>
                      <span className="sr-only"> remover filtro</span>
                    </button>
                  </li>
                ))}

                {somenteFavoritos && (
                  <li>
                    <button
                      type="button"
                      onClick={() => removerFiltro('favoritos')}
                      className={`rounded-full bg-fundo-suave px-3 py-1.5 text-sm font-semibold text-primaria-700 ${foco}`}
                    >
                      Somente favoritos{' '}
                      <span aria-hidden="true">×</span>
                      <span className="sr-only"> remover filtro</span>
                    </button>
                  </li>
                )}

                {totalFiltrosAtivos > 1 && (
                  <li>
                    <button
                      type="button"
                      onClick={() => limparFiltros()}
                      className={`rounded-full px-3 py-1.5 text-sm font-semibold text-primaria-700 underline ${focoVisivelPrimario}`}
                    >
                      Limpar todos
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>

          {locais.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
              <h2 className="text-xl font-bold">
                Nenhum local disponível
              </h2>

              <p className="mt-2 text-slate-600">
                Ainda não há locais cadastrados para exibir.
                Tente novamente mais tarde.
              </p>
            </div>
          ) : locaisFiltrados.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="Nenhum local encontrado com esses filtros"
                message="Tente desmarcar alguns recursos de acessibilidade, selecionar outra categoria ou buscar por termos mais genéricos."
                actionLabel="Limpar todos os filtros"
                onAction={() => limparFiltros({ focarBusca: true })}
              >
                {totalFiltrosAtivos > 0 && (
                  <div className="w-full max-w-xl text-left">
                    <p className="font-semibold text-texto">
                      Filtros que estão restringindo a busca:
                    </p>

                    <ul className="mt-2 list-disc space-y-1 pl-5 text-texto">
                      {filtros.busca.trim() && (
                        <li>
                          Busca por “{filtros.busca.trim()}”
                        </li>
                      )}

                      {filtros.categoria && (
                        <li>
                          Categoria:{' '}
                          {CATEGORIA_ROTULOS[filtros.categoria]}
                        </li>
                      )}

                      {filtros.recursos.map((recurso) => (
                        <li key={recurso}>
                          Recurso: {RECURSO_ROTULOS[recurso]}
                        </li>
                      ))}

                      {somenteFavoritos && (
                        <li>Somente favoritos</li>
                      )}
                    </ul>
                  </div>
                )}
              </EmptyState>
            </div>
          ) : (
            <>
              <div className="mt-6 flex flex-col gap-2 sm:max-w-xs">
                <label htmlFor="ordenacao-locais" className="font-semibold">
                  Ordenar por
                </label>
                <select
                  id="ordenacao-locais"
                  value={ordenacao}
                  onChange={(event) =>
                    alterarOrdenacao(
                      event.target.value as OrdenacaoLocais,
                    )
                  }
                  aria-controls="resultados-locais"
                  className={campo}
                >
                  <option value="original">Ordem original</option>
                  <option value="nome-asc">Nome: A–Z</option>
                  <option value="nome-desc">Nome: Z–A</option>
                </select>
              </div>

              <section
                id="resultados-locais"
                aria-label="Locais encontrados"
                className="mt-6 grid gap-5 md:grid-cols-2"
              >
                {locaisPaginados.map((local) => (
                  <LocalCard key={local.id} local={local} distanciaEmKm={calcularDistanciaLocal(local)} />
                ))}
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
                onClick={() => mudarPagina(paginaValida - 1)}
                disabled={paginaValida === 1}
                aria-label="Ir para a página anterior"
                className={`${botaoPaginacao} ${focoVisivelPrimario}`}
              >
                Anterior
              </button>

              <div
                aria-label="Páginas"
                className="flex flex-wrap items-center justify-center gap-2"
              >
                {Array.from(
                  { length: totalPaginas },
                  (_, index) => {
                    const pagina = index + 1

                    return (
                      <button
                        key={pagina}
                        type="button"
                        onClick={() => mudarPagina(pagina)}
                        aria-current={
                          pagina === paginaValida ? 'page' : undefined
                        }
                        aria-label={`Página ${pagina}`}
                        className={`min-h-11 min-w-11 rounded-md px-3 font-semibold ${
                        pagina === paginaValida
                        ? 'bg-primaria-600 text-texto-inverso'
                        : 'border border-borda-funcional hover:bg-fundo-suave'
                        } ${focoVisivelPrimario}`}
                      >
                        {pagina}
                      </button>
                    )
                  },
                )}
              </div>

              <button
                type="button"
                onClick={() => mudarPagina(paginaValida + 1)}
                disabled={paginaValida === totalPaginas}
                aria-label="Ir para a próxima página"
                className={`${botaoPaginacao} ${focoVisivelPrimario}`}
              >
                Próxima
              </button>
            </nav>
          )}
        </section>
      </div>
      <BotaoVoltarAoTopo />
    </main>
  )
}