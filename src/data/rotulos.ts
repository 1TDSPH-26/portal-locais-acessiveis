import type { Categoria, RecursoAcessibilidade } from '../types/local'

export const CATEGORIA_LABELS: Record<Categoria, string> = {
  restaurante: 'Restaurante',
  saude: 'Saúde',
  educacao: 'Educação',
  lazer: 'Lazer',
  servico_publico: 'Serviço público',
}

export const RECURSO_LABELS: Record<RecursoAcessibilidade, string> = {
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