
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useConsulta } from '../../hooks/useConsulta'
import type { Local } from '../../types/local'
import Locais from './Locais'

vi.mock('../../hooks/useConsulta', () => ({
  useConsulta: vi.fn(),
}))

type EstadoConsultaLocais =
  ReturnType<typeof useConsulta<Local[]>>['estado']

const locaisTeste: Local[] = [
  {
    id: 1,
    nome: 'Biblioteca Central',
    endereco: 'Rua dos Livros, 10',
    cep: '01001-000',
    categoria: 'educacao',
    recursosAcessibilidade: ['rampa_acesso'],
  },
  {
    id: 2,
    nome: 'Parque Municipal',
    endereco: 'Avenida das Árvores, 20',
    cep: '01002-000',
    categoria: 'lazer',
    recursosAcessibilidade: ['piso_tatil'],
  },
]

function renderizarLocais(
  estado: EstadoConsultaLocais,
) {
  vi.mocked(useConsulta).mockReturnValue({
    estado,
    retentando: false,
    tentarNovamente: vi.fn(),
  })

  return renderToStaticMarkup(
    <MemoryRouter initialEntries={['/locais']}>
      <Locais />
    </MemoryRouter>,
  )
}

describe('Estados da página de locais', () => {
  beforeEach(() => {
    vi.mocked(useConsulta).mockReset()
  })

  it('mostra o estado de carregamento', () => {
    const html = renderizarLocais({
      status: 'carregando',
    })

    expect(html).toContain('Locais acessíveis')
    expect(html).toContain('Carregando locais...')
  })

  it('mostra o erro e a opção de tentar novamente', () => {
    const html = renderizarLocais({
      status: 'erro',
      mensagem: 'Serviço indisponível para este teste.',
    })

    expect(html).toContain(
      'Não foi possível carregar os locais',
    )
    expect(html).toContain(
      'Serviço indisponível para este teste.',
    )
    expect(html).toContain('Tentar novamente')
  })

  it('informa quando não existem locais cadastrados', () => {
    const html = renderizarLocais({
      status: 'sucesso',
      dados: [],
    })

    expect(html).toContain(
      'Nenhum local cadastrado no momento.',
    )
    expect(html).toContain('Nenhum local disponível')
  })

  it('exibe os locais recebidos e seus links de detalhes', () => {
    const html = renderizarLocais({
      status: 'sucesso',
      dados: locaisTeste,
    })

    for (const local of locaisTeste) {
      expect(html).toContain(local.nome)
      expect(html).toContain(`/locais/${local.id}`)
    }

    expect(html).toContain('Biblioteca Central')
    expect(html).toContain('Parque Municipal')
  })
})

// Oito locais fora de ordem alfabética, com acentos e categorias variadas.
const locaisOrdenacao: Local[] = [
  ['Zoológico Municipal', 'lazer'],
  ['Biblioteca Central', 'educacao'],
  ['Ótica Visão Clara', 'servico_publico'],
  ['Academia Movimento', 'lazer'],
  ['Hospital Esperança', 'saude'],
  ['Escola Aprender', 'educacao'],
  ['Restaurante Bom Sabor', 'restaurante'],
  ['Café Encontro', 'restaurante'],
].map(([nome, categoria], indice) => ({
  id: indice + 1,
  nome,
  endereco: `Rua Teste, ${indice + 1}`,
  cep: '01001-000',
  categoria: categoria as Local['categoria'],
  recursosAcessibilidade: ['rampa_acesso'],
}))

function montarLocais(dados: Local[] = locaisOrdenacao) {
  vi.mocked(useConsulta).mockReturnValue({
    estado: { status: 'sucesso', dados },
    retentando: false,
    tentarNovamente: vi.fn(),
  })

  return render(
    <MemoryRouter initialEntries={['/locais']}>
      <Locais />
    </MemoryRouter>,
  )
}

// Títulos dos cards na ordem em que aparecem no DOM.
function titulosDosCards() {
  const resultados = screen.getByRole('region', {
    name: 'Locais encontrados',
  })

  return within(resultados)
    .getAllByRole('heading', { level: 2 })
    .map((titulo) => titulo.textContent)
}

// A contagem acessível é a região viva com aria-atomic.
function contagemResultados() {
  const regiao = screen
    .getAllByRole('status')
    .find((elemento) => elemento.getAttribute('aria-atomic') === 'true')

  if (!regiao) throw new Error('Contagem de resultados não encontrada')
  return regiao
}

describe('Ordenação e contagem na página de locais', () => {
  beforeEach(() => {
    vi.mocked(useConsulta).mockReset()
  })

  it('reorganiza os cards no DOM ao trocar a ordenação', async () => {
    const usuario = userEvent.setup()
    montarLocais()

    const seletor = screen.getByRole('combobox', { name: 'Ordenar por' })
    expect(seletor).toHaveValue('original')
    expect(titulosDosCards()).toEqual([
      'Zoológico Municipal',
      'Biblioteca Central',
      'Ótica Visão Clara',
      'Academia Movimento',
    ])

    await usuario.selectOptions(seletor, 'nome-asc')
    expect(titulosDosCards()).toEqual([
      'Academia Movimento',
      'Biblioteca Central',
      'Café Encontro',
      'Escola Aprender',
    ])

    await usuario.selectOptions(seletor, 'nome-desc')
    expect(titulosDosCards()).toEqual([
      'Zoológico Municipal',
      'Restaurante Bom Sabor',
      'Ótica Visão Clara',
      'Hospital Esperança',
    ])

    await usuario.selectOptions(seletor, 'original')
    expect(titulosDosCards()).toEqual([
      'Zoológico Municipal',
      'Biblioteca Central',
      'Ótica Visão Clara',
      'Academia Movimento',
    ])
  })

  it('atualiza a contagem conforme os filtros ativos', async () => {
    const usuario = userEvent.setup()
    montarLocais()

    const busca = screen.getByRole('searchbox', { name: 'Buscar' })

    expect(contagemResultados()).toHaveTextContent('8 locais encontrados.')

    await usuario.type(busca, 'Zoológico')
    expect(contagemResultados()).toHaveTextContent('1 local encontrado.')

    await usuario.clear(busca)
    await usuario.type(busca, 'inexistente')
    expect(contagemResultados()).toHaveTextContent(
      'Nenhum local encontrado.',
    )
  })

  it('anuncia a contagem em uma região viva acessível', () => {
    montarLocais()

    const regiao = contagemResultados()

    expect(regiao).toHaveAttribute('role', 'status')
    expect(regiao).toHaveAttribute('aria-live', 'polite')
    expect(regiao).toHaveAttribute('aria-atomic', 'true')
  })
})
