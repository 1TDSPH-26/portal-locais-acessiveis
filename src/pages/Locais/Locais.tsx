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
}  