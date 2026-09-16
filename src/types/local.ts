export type Categoria =
  | 'restaurante'
  | 'saude'
  | 'educacao'
  | 'lazer'
  | 'servico_publico'

export type RecursoAcessibilidade =
  | 'rampa_acesso'
  | 'banheiro_adaptado'
  | 'piso_tatil'
  | 'sinalizacao_visual'
  | 'vagas_estacionamento'
  | 'braile'
  | 'libras'
  | 'elevador'
  | 'balcao_acessivel'
  | 'assentos_prioritarios'
  | 'espaco_tranquilo'
  | 'cao_guia'

export type Local = {
  id: number
  nome: string
  endereco: string
  cep: string
  categoria: Categoria
  recursosAcessibilidade: RecursoAcessibilidade[]
}
