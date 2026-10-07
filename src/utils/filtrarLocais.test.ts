import { describe, it, expect } from 'vitest'
import { filtrarLocais } from './filtrarLocais'
import type { Local } from '../types/local'

const locaisTeste: Local[] = [
  {
    id: 1,
    nome: 'Restaurante A',
    endereco: 'Rua 1',
    cep: '00000-001',
    categoria: 'restaurante',
    recursosAcessibilidade: ['rampa_acesso', 'braile'],
  },
  {
    id: 2,
    nome: 'Clínica B',
    endereco: 'Rua 2',
    cep: '00000-002',
    categoria: 'saude',
    recursosAcessibilidade: ['rampa_acesso', 'libras', 'elevador'],
  },
  {
    id: 3,
    nome: 'Parque C',
    endereco: 'Rua 3',
    cep: '00000-003',
    categoria: 'lazer',
    recursosAcessibilidade: ['piso_tatil'],
  },
]

describe('filtrarLocais', () => {
  it('retorna todos os locais quando nenhum filtro está ativo', () => {
    const resultado = filtrarLocais(locaisTeste, '', [])
    expect(resultado).toHaveLength(3)
  })

  it('filtra pela categoria selecionada', () => {
    const resultado = filtrarLocais(locaisTeste, 'saude', [])
    expect(resultado.map((local) => local.id)).toEqual([2])
  })

  it('filtra por um recurso de acessibilidade', () => {
    const resultado = filtrarLocais(locaisTeste, '', ['rampa_acesso'])
    expect(resultado.map((local) => local.id)).toEqual([1, 2])
  })

  it('exige que o local tenha todos os recursos marcados', () => {
    const resultado = filtrarLocais(locaisTeste, '', ['rampa_acesso', 'libras'])
    expect(resultado.map((local) => local.id)).toEqual([2])
  })

  it('combina categoria e recursos', () => {
    const resultado = filtrarLocais(locaisTeste, 'restaurante', ['braile'])
    expect(resultado.map((local) => local.id)).toEqual([1])
  })

  it('retorna lista vazia quando nenhum local atende aos filtros', () => {
    const resultado = filtrarLocais(locaisTeste, 'educacao', [])
    expect(resultado).toEqual([])
  })
})