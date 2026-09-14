export type Categoria = 'restaurante' | 'saude' | 'educacao' | 'lazer' | 'servico_publico';

export type RecursosAcessibilidade = {
  rampaAcesso: boolean;
  banheiroAdaptado: boolean;
  pisoTatil: boolean;
  sinalizacaoVisual: boolean;
  vagasEstacionamento: boolean;
  braile: boolean;
};

export type Local = {
  id: number;
  nome: string;
  endereco: string;
  cep: string;
  categoria: Categoria;
  recursosAcessibilidade: RecursosAcessibilidade;
};