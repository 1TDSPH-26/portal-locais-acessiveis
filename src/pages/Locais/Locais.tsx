import { useState } from 'react';
import { listaLocais } from '../../data/locais';
import type { Categoria, RecursoAcessibilidade } from '../../types/local';
import EmptyState from '../../components/Feedback/EmptyState';

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
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria | ''>('');

  const [recursosSelecionados, setRecursosSelecionados] = useState<RecursoAcessibilidade[]>([]);

  function alternarRecurso(recurso: RecursoAcessibilidade) {
    if (recursosSelecionados.includes(recurso)) {
      setRecursosSelecionados(recursosSelecionados.filter((r) => r !== recurso));
    } else {
      setRecursosSelecionados([...recursosSelecionados, recurso]);
    }
  }

  function limparFiltros() {
    setCategoriaSelecionada('');
    setRecursosSelecionados([]);
  }
  
const locaisFiltrados = listaLocais.filter((local) => {
    const passaCategoria =
      categoriaSelecionada === '' || local.categoria === categoriaSelecionada;

    const passaRecursos = recursosSelecionados.every((recurso) =>
      local.recursosAcessibilidade.includes(recurso)
    );

    return passaCategoria && passaRecursos;
  });

  return (
      <div>
        <h1>Listagem de locais</h1>
  
        <div>
          <label htmlFor="filtro-categoria">Categoria</label>
          <select
            id="filtro-categoria"
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value as Categoria | '')}
          >
            <option value="">Todas</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
  
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
                  <label htmlFor={inputId}>{recurso}</label>
                </div>
              );
            })}
          </fieldset>
  
          <button type="button" onClick={limparFiltros}>
            Limpar filtros
          </button>
        </div>
  
        {locaisFiltrados.length === 0 ? (
          <EmptyState
            title="Nenhum local encontrado"
            message="Não encontramos locais para os filtros selecionados."
          />
        ) : (
          <ul>
            {locaisFiltrados.map((local) => (
              <li key={local.id}>
                <h3>{local.nome}</h3>
                <p>{local.endereco} - {local.cep}</p>
                <p>{local.categoria}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }