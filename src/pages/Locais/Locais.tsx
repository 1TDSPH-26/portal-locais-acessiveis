import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import EmptyState from '../../components/Feedback/EmptyState';
import ErrorMessage from '../../components/Feedback/ErrorMessage';
import LoadingState from '../../components/Feedback/LoadingState';
import { listarLocais } from '../../services/locaisService';
import type {
  Categoria,
  RecursoAcessibilidade,
  Local,
} from '../../types/local';
import { useConsulta } from '../../hooks/useConsulta';
import { filtrarLocais } from '../../utils/filtrarLocais';
import {
  ordenarLocais,
  type OrdenacaoLocais,
} from '../../types/ordenarLocais';

const classeLinkDetalhes = [
  'mt-4 inline-flex min-h-12 items-center rounded-md border border-primaria-600',
  'px-4 py-2 font-corpo text-botao font-semibold text-primaria-600',
  'hover:bg-fundo-suave focus-visible:outline-2 focus-visible:outline-offset-4',
  'focus-visible:outline-primaria-600',
].join(' ');

const categorias: Categoria[] = [
  'restaurante',
  'saude',
  'educacao',
  'lazer',
  'servico_publico',
];

const recursos: RecursoAcessibilidade[] = [
  'rampa_acesso',
  'banheiro_adaptado',
  'piso_tatil',
  'sinalizacao_visual',
  'vagas_estacionamento',
  'braile',
  'libras',
  'elevador',
  'balcao_acessivel',
  'assentos_prioritarios',
  'espaco_tranquilo',
  'cao_guia',
];

export default function Locais() {
  const { estado, tentarNovamente } = useConsulta<Local[]>(
    listarLocais
  );

  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<Categoria | ''>('');

  const [recursosSelecionados, setRecursosSelecionados] =
    useState<RecursoAcessibilidade[]>([]);

  const [ordenacao, setOrdenacao] =
    useState<OrdenacaoLocais>('original');

  const [paginaAtual, setPaginaAtual] = useState(1);

  const itensPorPagina = 4;

  const tituloRef = useRef<HTMLHeadingElement>(null);

  const locais = estado.status === 'sucesso' ? estado.dados : [];

  useEffect(() => {
    setPaginaAtual(1);
  }, [categoriaSelecionada, recursosSelecionados, ordenacao]);

  function alternarRecurso(recurso: RecursoAcessibilidade) {
    if (recursosSelecionados.includes(recurso)) {
      setRecursosSelecionados(
        recursosSelecionados.filter((r) => r !== recurso)
      );
    } else {
      setRecursosSelecionados([
        ...recursosSelecionados,
        recurso,
      ]);
    }
  }

  function limparFiltros() {
    setCategoriaSelecionada('');
    setRecursosSelecionados([]);
  }

  const titulo = (
    <h1
      ref={tituloRef}
      tabIndex={-1}
      className="mb-6 font-display text-3xl font-bold text-texto focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
    >
      Locais acessíveis
    </h1>
  );

  if (estado.status === 'carregando') {
    return (
      <main className="mx-auto w-full max-w-6xl p-6">
        {titulo}

        <LoadingState message="Carregando locais..." />
      </main>
    );
  }

  if (estado.status === 'erro') {
    return (
      <main className="mx-auto w-full max-w-6xl p-6">
        {titulo}

        <ErrorMessage
          title="Não foi possível carregar os locais"
          message={estado.mensagem}
          onRetry={tentarNovamente}
        />
      </main>
    );
  }

  if (locais.length === 0) {
    return (
      <main className="mx-auto w-full max-w-6xl p-6">
        {titulo}

        <EmptyState
          title="Nenhum local encontrado"
          message="Não há locais cadastrados para exibir."
        />
      </main>
    );
  }

  const locaisFiltrados = filtrarLocais(
    locais,
    categoriaSelecionada,
    recursosSelecionados
  );

  const locaisOrdenados = ordenarLocais(
    locaisFiltrados,
    ordenacao
  );

  const totalPaginas = Math.ceil(
    locaisOrdenados.length / itensPorPagina
  );

  const indiceInicial =
    (paginaAtual - 1) * itensPorPagina;

  const locaisPaginados = locaisOrdenados.slice(
    indiceInicial,
    indiceInicial + itensPorPagina
  );

  const mudarPagina = (novaPagina: number) => {
    if (
      novaPagina >= 1 &&
      novaPagina <= totalPaginas
    ) {
      setPaginaAtual(novaPagina);
      tituloRef.current?.focus();
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      {titulo}

      <section
        aria-labelledby="titulo-filtros"
        className="mb-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2
            id="titulo-filtros"
            className="font-display text-xl font-bold text-texto"
          >
            Filtrar locais
          </h2>

          <button
            type="button"
            onClick={limparFiltros}
            className="min-h-12 rounded-md border border-gray-300 px-4 py-2 font-corpo text-sm font-semibold text-texto hover:bg-fundo-suave focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaria-600"
          >
            Limpar filtros
          </button>
        </div>

        <div className="mb-6">
          <label
            htmlFor="categoria"
            className="mb-2 block font-corpo text-sm font-semibold text-texto"
          >
            Categoria
          </label>

          <select
            id="categoria"
            value={categoriaSelecionada}
            onChange={(event) =>
              setCategoriaSelecionada(
                event.target.value as Categoria | ''
              )
            }
            className="min-h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-corpo text-texto focus:outline-2 focus:outline-offset-2 focus:outline-primaria-600 sm:max-w-md"
          >
            <option value="">Todas as categorias</option>

            {categorias.map((categoria) => (
              <option
                key={categoria}
                value={categoria}
              >
                {categoria}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className="mb-3 font-corpo text-sm font-semibold text-texto">
            Recursos de acessibilidade
          </legend>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recursos.map((recurso) => {
              const inputId = `recurso-${recurso}`;

              return (
                <label
                  key={recurso}
                  htmlFor={inputId}
                  className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-gray-200 p-3 hover:bg-fundo-suave"
                >
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={recursosSelecionados.includes(recurso)}
                    onChange={() => alternarRecurso(recurso)}
                    className="h-5 w-5"
                  />

                  <span className="font-corpo text-sm capitalize text-texto">
                    {recurso.replace('_', ' ')}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </section>

      <div className="mb-6 flex flex-col gap-2 sm:max-w-xs">
        <label
          htmlFor="ordenacao-locais"
          className="font-corpo font-semibold text-texto"
        >
          Ordenar por
        </label>

        <select
          id="ordenacao-locais"
          value={ordenacao}
          onChange={(event) =>
            setOrdenacao(
              event.target.value as OrdenacaoLocais
            )
          }
          aria-controls="resultados-locais"
          className="min-h-11 w-full rounded-lg border border-borda-funcional bg-white px-3 py-2 font-corpo text-texto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaria-600"
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

      {locaisOrdenados.length === 0 ? (
        <EmptyState
          title="Nenhum local encontrado"
          message="Não encontramos locais para os filtros selecionados."
        />
      ) : (
        <>
          <section
            id="resultados-locais"
            aria-label="Locais encontrados"
            className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2"
          >
            {locaisPaginados.map((local) => (
              <article
                key={local.id}
                className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <h2 className="font-display text-xl font-bold text-texto">
                  {local.nome}
                </h2>

                <p className="mt-2 font-corpo text-corpo-16 text-texto">
                  <strong>Endereço:</strong>{' '}
                  {local.endereco}
                </p>

                <p className="mt-2 font-corpo text-corpo-16 text-texto">
                  <strong>Categoria:</strong>{' '}
                  {local.categoria}
                </p>

                <div className="mt-4">
                  <h3 className="mb-2 font-display text-corpo-16 font-bold text-texto">
                    Recursos de acessibilidade
                  </h3>

                  <ul className="list-disc pl-5 font-corpo text-corpo-16 text-texto">
                    {local.recursosAcessibilidade.map(
                      (recurso) => (
                        <li
                          key={recurso}
                          className="capitalize"
                        >
                          {recurso.replace('_', ' ')}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <Link
                  to={`/locais/${local.id}`}
                  className={classeLinkDetalhes}
                >
                  Ver detalhes
                  <span className="sr-only">
                    {' '}
                    de {local.nome}
                  </span>
                </Link>
              </article>
            ))}
          </section>

          {totalPaginas > 1 && (
            <nav
              aria-label="Paginação dos locais"
              className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4"
            >
              <button
                type="button"
                onClick={() =>
                  mudarPagina(paginaAtual - 1)
                }
                disabled={paginaAtual === 1}
                className="min-h-12 rounded-md border border-gray-300 px-4 py-2 font-corpo text-sm font-semibold text-texto hover:bg-fundo-suave disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaria-600"
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
                    const pagina = index + 1;
                    const ehPaginaAtual =
                      pagina === paginaAtual;

                    return (
                      <button
                        key={pagina}
                        type="button"
                        onClick={() =>
                          mudarPagina(pagina)
                        }
                        aria-current={
                          ehPaginaAtual
                            ? 'page'
                            : undefined
                        }
                        aria-label={`Página ${pagina}`}
                        className={`min-w-[40px] rounded-md px-3 py-2 font-corpo text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${ehPaginaAtual
                            ? 'bg-blue-600 font-bold text-white'
                            : 'border border-gray-300 text-texto hover:bg-gray-100'
                          }`}
                      >
                        {pagina}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  mudarPagina(paginaAtual + 1)
                }
                disabled={
                  paginaAtual === totalPaginas
                }
                aria-label="Ir para a próxima página"
                className="min-h-12 rounded-md border border-gray-300 px-4 py-2 font-corpo text-sm font-semibold text-texto hover:bg-fundo-suave disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaria-600"
              >
                Próxima
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
}