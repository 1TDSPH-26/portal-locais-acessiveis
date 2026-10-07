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

  const [paginaAtual, setPaginaAtual] = useState(1);

  const itensPorPagina = 4;

  const tituloRef = useRef<HTMLHeadingElement>(null);

  const locais = estado.status === 'sucesso' ? estado.dados : [];

  useEffect(() => {
    setPaginaAtual(1);
  }, [categoriaSelecionada, recursosSelecionados]);

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

  const totalPaginas = Math.ceil(
    locaisFiltrados.length / itensPorPagina
  );

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;

  const locaisPaginados = locaisFiltrados.slice(
    indiceInicial,
    indiceInicial + itensPorPagina
  );

  const mudarPagina = (novaPagina: number) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
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
              <option key={categoria} value={categoria}>
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
            {recursos.map((recurso) => (
              <label
                key={recurso}
                className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-gray-200 p-3 hover:bg-fundo-suave"
              >
                <input
                  type="checkbox"
                  checked={recursosSelecionados.includes(recurso)}
                  onChange={() => alternarRecurso(recurso)}
                  className="h-5 w-5"
                />

                <span className="font-corpo text-sm text-texto">
                  {recurso}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      {locaisFiltrados.length === 0 ? (
        <EmptyState
          title="Nenhum local encontrado"
          message="Não encontramos locais para os filtros selecionados."
        />
      ) : (
        <>
          <section
            aria-label="Lista de locais"
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

                <p className="mt-2 font-corpo text-sm text-texto">
                  Categoria: {local.categoria}
                </p>

                <p className="mt-2 font-corpo text-sm text-texto">
                  {local.endereco}
                </p>

                <Link
                  to={`/ locais / ${ local.id } `}
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
              className="mt-8 flex items-center justify-center gap-4"
            >
              <button
                type="button"
                onClick={() => mudarPagina(paginaAtual - 1)}
                disabled={paginaAtual === 1}
                className="min-h-12 rounded-md border border-gray-300 px-4 py-2 font-corpo text-sm font-semibold text-texto hover:bg-fundo-suave disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaria-600"
              >
                Anterior
              </button>

              <span
                aria-live="polite"
                className="font-corpo text-sm text-texto"
              >
                Página {paginaAtual} de {totalPaginas}
              </span>

              <button
                type="button"
                onClick={() => mudarPagina(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
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