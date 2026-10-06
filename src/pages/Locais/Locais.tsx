import { listaLocais } from '../../data/locais';
import LocalCard from '../../components/LocalCard/LocalCard';
import type { Categoria, RecursoAcessibilidade } from '../../types/local';
import EmptyState from '../../components/Feedback/EmptyState';
import { useEffect, useRef, useState } from 'react';
import ErrorMessage from '../../components/Feedback/ErrorMessage';
import LoadingState from '../../components/Feedback/LoadingState';
import type { Local } from '../../types/local';

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
  const [locais, setLocais] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<Categoria | ''>('');

  const [recursosSelecionados, setRecursosSelecionados] =
    useState<RecursoAcessibilidade[]>([]);


  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 4 

  const tituloRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setLocais(listaLocais);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, []);

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
    );
  }

  if (locais.length === 0) {
    return (
      <EmptyState
        title="Nenhum local encontrado"
        message="Não há locais cadastrados para exibir."
      />
    )
  }
  
  function limparFiltros() {
    setCategoriaSelecionada('');
    setRecursosSelecionados([]);
  }


  const locaisFiltrados = locais.filter((local) => {
    const passaCategoria =
      categoriaSelecionada === '' ||
      local.categoria === categoriaSelecionada;

    const passaRecursos = recursosSelecionados.every((recurso) =>
      local.recursosAcessibilidade.includes(recurso)
    );

    return passaCategoria && passaRecursos;
  });

  
  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <h1
        ref={tituloRef}
        tabIndex={-1}
        className="mb-6 font-display text-3xl font-bold text-texto focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      >
        Locais acessíveis
      </h1>
      
      <section className="mb-6">
        <div>
          <label htmlFor="filtro-categoria">Categoria</label>

          <select
            id="filtro-categoria"
            value={categoriaSelecionada}
            onChange={(e) =>
              setCategoriaSelecionada(
                e.target.value as Categoria | ''
              )
            }
          >
            <option value="">Todas</option>

            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend>Recursos de acessibilidade</legend>

          {recursos.map((recurso) => {
            const inputId = `recurso-${recurso}`;

            return (
              <div key={recurso}>
                <input
                  type="checkbox"
                  id={inputId}
                  checked={recursosSelecionados.includes(recurso)}
                  onChange={() => alternarRecurso(recurso)}
                />

                <label htmlFor={inputId}>
                  {recurso}
                </label>
              </div>
            );
          })}
        </fieldset>

        <button type="button" onClick={limparFiltros}>
          Limpar filtros
        </button>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {locaisPaginados.map((local) => (
          <LocalCard key={local.id} local={local} />
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
