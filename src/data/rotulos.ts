import type {
  Categoria,
  RecursoAcessibilidade,
} from '../types/local'

export const CATEGORIAS: Categoria[] = [
  'restaurante',
  'saude',
  'educacao',
  'lazer',
  'servico_publico',
]

export const CATEGORIA_ROTULOS: Record<Categoria, string> = {
  restaurante: 'Restaurante',
  saude: 'Saúde',
  educacao: 'Educação',
  lazer: 'Lazer',
  servico_publico: 'Serviço público',
}

export const RECURSOS: RecursoAcessibilidade[] = [
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
]

export const RECURSO_ROTULOS: Record<
  RecursoAcessibilidade,
  string
> = {
  rampa_acesso: 'Rampa de acesso',
  banheiro_adaptado: 'Banheiro adaptado',
  piso_tatil: 'Piso tátil',
  sinalizacao_visual: 'Sinalização visual',
  vagas_estacionamento: 'Vagas de estacionamento',
  braile: 'Material em braile',
  libras: 'Atendimento em Libras',
  elevador: 'Elevador',
  balcao_acessivel: 'Balcão acessível',
  assentos_prioritarios: 'Assentos prioritários',
  espaco_tranquilo: 'Espaço tranquilo',
  cao_guia: 'Permite cão-guia',
}
