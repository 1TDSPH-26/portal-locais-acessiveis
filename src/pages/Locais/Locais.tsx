import { listaLocais } from '../../data/locais';
import type { Categoria, RecursoAcessibilidade } from '../../types/local';
import EmptyState from '../../components/Feedback/EmptyState';
import { useEffect, useState } from 'react';
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

  function limparFiltros() {
    setCategoriaSelecionada('');
    setRecursosSelecionados([]);
  }

if (locais.length === 0) {
  return (
    <EmptyState
      title="Nenhum local encontrado"
      message="Não há locais cadastrados para exibir."
    />
  )
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

  if (loading) {
    return <LoadingState message="Carregando locais..." />;
  }

  if (error) {
    return (
      <ErrorMessage message="Não foi possível carregar os locais. Tente novamente." />
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <h1 className="mb-6 font-display text-3xl font-bold text-texto">
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

      {locaisFiltrados.length === 0 ? (
        <EmptyState
          title="Nenhum local encontrado"
          message="Não encontramos locais para os filtros selecionados."
        />
      ) : (
        <section className="grid gap-6 md:grid-cols-2">
          {locaisFiltrados.map((local) => (
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
            </article>
          ))}
        </section>
      )}
    </main>
  );
}