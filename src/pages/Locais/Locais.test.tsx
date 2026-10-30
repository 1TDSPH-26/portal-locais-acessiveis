import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useConsulta } from '../../hooks/useConsulta'
import type { Local } from '../../types/local'
import { CHAVE_HISTORICO } from '../../utils/historicoBusca'
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
  {
    id: 3,
    nome: 'Padaria Bom Dia',
    endereco: 'Rua do Pão, 30',
    cep: '01003-000',
    categoria: 'restaurante',
    recursosAcessibilidade: ['rampa_acesso'],
  },
]

function salvarHistorico(termos: string[]) {
  localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(termos))
}

function lerHistorico() {
  return JSON.parse(localStorage.getItem(CHAVE_HISTORICO) ?? '[]')
}

function renderizarLocais() {
  render(
    <MemoryRouter initialEntries={['/locais']}>
      <Locais />
    </MemoryRouter>,
  )

  return {
    usuario: userEvent.setup(),
    campo: screen.getByRole('combobox', { name: 'Buscar' }),
  }
}

function renderizarLocaisEstatico(estado: EstadoConsultaLocais) {
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

function nomesExibidos() {
  return within(
    screen.getByRole('region', { name: 'Locais encontrados' }),
  )
    // Atualizado de level: 2 para level: 3 por causa do componente <LocalCard />
    .getAllByRole('heading', { level: 3 })
    .map((titulo) => titulo.textContent)
}

function opcoes() {
  return within(
    screen.getByRole('listbox', { name: 'Buscas recentes' }),
  )
    .getAllByRole('option')
    .map((opcao) => opcao.textContent)
}

describe('Locais — histórico de buscas', () => {
  beforeEach(() => {
    vi.mocked(useConsulta).mockReturnValue({
      estado: { status: 'sucesso', dados: locaisTeste },
      retentando: false,
      tentarNovamente: vi.fn(),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exibe todas as buscas recentes ao focar o campo vazio', async () => {
    salvarHistorico(['Parque', 'Padaria', 'Biblioteca'])
    const { usuario, campo } = renderizarLocais()

    expect(campo).toHaveAttribute('aria-expanded', 'false')
    expect(campo).toHaveAttribute('aria-autocomplete', 'list')

    await usuario.click(campo)

    expect(campo).toHaveAttribute('aria-expanded', 'true')
    expect(opcoes()).toEqual(['Parque', 'Padaria', 'Biblioteca'])
    expect(
      screen.getByText(/3 buscas recentes disponíveis/),
    ).toBeInTheDocument()
  })

  it('não abre a lista quando não há histórico', async () => {
    const { usuario, campo } = renderizarLocais()

    await usuario.click(campo)

    expect(campo).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('filtra as sugestões pelo prefixo digitado', async () => {
    salvarHistorico(['Parque', 'Padaria', 'Biblioteca'])
    const { usuario, campo } = renderizarLocais()

    await usuario.type(campo, 'pa')
    expect(opcoes()).toEqual(['Parque', 'Padaria'])

    await usuario.type(campo, 'd')
    expect(opcoes()).toEqual(['Padaria'])

    await usuario.type(campo, 'x')
    expect(campo).toHaveAttribute('aria-expanded', 'false')
  })

  it('seleciona uma sugestão pelo clique e atualiza os resultados', async () => {
    salvarHistorico(['Biblioteca', 'Parque'])
    const { usuario, campo } = renderizarLocais()

    await usuario.click(campo)
    await usuario.click(screen.getByRole('option', { name: 'Parque' }))

    expect(campo).toHaveValue('Parque')
    expect(nomesExibidos()).toEqual(['Parque Municipal'])
    expect(campo).toHaveFocus()
    expect(campo).toHaveAttribute('aria-expanded', 'false')
    expect(lerHistorico()).toEqual(['Parque', 'Biblioteca'])
  })

  it('navega pelas sugestões com as setas e seleciona com Enter', async () => {
    salvarHistorico(['Parque', 'Padaria', 'Biblioteca'])
    const { usuario, campo } = renderizarLocais()

    await usuario.click(campo)
    await usuario.keyboard('{ArrowDown}')

    const primeira = screen.getByRole('option', { name: 'Parque' })
    expect(primeira).toHaveAttribute('aria-selected', 'true')
    expect(campo).toHaveAttribute('aria-activedescendant', primeira.id)

    await usuario.keyboard('{ArrowDown}{ArrowDown}')
    expect(
      screen.getByRole('option', { name: 'Biblioteca' }),
    ).toHaveAttribute('aria-selected', 'true')

    // Volta ao início ao passar do último item.
    await usuario.keyboard('{ArrowDown}')
    expect(primeira).toHaveAttribute('aria-selected', 'true')

    await usuario.keyboard('{ArrowUp}')
    expect(
      screen.getByRole('option', { name: 'Biblioteca' }),
    ).toHaveAttribute('aria-selected', 'true')

    await usuario.keyboard('{Enter}')

    expect(campo).toHaveValue('Biblioteca')
    expect(campo).toHaveFocus()
    expect(campo).toHaveAttribute('aria-expanded', 'false')
    expect(nomesExibidos()).toEqual(['Biblioteca Central'])
    expect(lerHistorico()).toEqual(['Biblioteca', 'Parque', 'Padaria'])
  })

  it('fecha a lista com Escape sem perder o foco nem o texto', async () => {
    salvarHistorico(['Parque', 'Padaria'])
    const { usuario, campo } = renderizarLocais()

    await usuario.type(campo, 'pa')
    expect(campo).toHaveAttribute('aria-expanded', 'true')

    await usuario.keyboard('{Escape}')

    expect(campo).toHaveAttribute('aria-expanded', 'false')
    expect(campo).toHaveFocus()
    expect(campo).toHaveValue('pa')

    // As setas reabrem a lista.
    await usuario.keyboard('{ArrowDown}')
    expect(campo).toHaveAttribute('aria-expanded', 'true')
  })

  it('salva o termo no localStorage ao pressionar Enter', async () => {
    const { usuario, campo } = renderizarLocais()

    await usuario.type(campo, '  Padaria  {Enter}')

    expect(lerHistorico()).toEqual(['Padaria'])
  })

  it('salva o termo ao sair do campo e ignora termos curtos', async () => {
    const { usuario, campo } = renderizarLocais()

    await usuario.type(campo, 'p')
    await usuario.tab()
    expect(localStorage.getItem(CHAVE_HISTORICO)).toBeNull()

    await usuario.type(campo, 'arque')
    await usuario.tab()
    expect(lerHistorico()).toEqual(['parque'])
  })

  it('continua buscando quando o localStorage falha', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Acesso negado', 'SecurityError')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Cota excedida', 'QuotaExceededError')
    })

    const { usuario, campo } = renderizarLocais()

    await usuario.type(campo, 'Parque{Enter}')

    expect(campo).toHaveValue('Parque')
    expect(nomesExibidos()).toEqual(['Parque Municipal'])
  })
})

describe('Estados da página de locais', () => {
  beforeEach(() => {
    vi.mocked(useConsulta).mockReset()
  })

  it('mostra o estado de carregamento', () => {
    const html = renderizarLocaisEstatico({
      status: 'carregando',
    })

    expect(html).toContain('Locais acessíveis')
    expect(html).toContain('Carregando locais...')
  })

  it('mostra o erro e a opção de tentar novamente', () => {
    const html = renderizarLocaisEstatico({
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
    const html = renderizarLocaisEstatico({
      status: 'sucesso',
      dados: [],
    })

    expect(html).toContain(
      'Nenhum local cadastrado no momento.',
    )
    expect(html).toContain('Nenhum local disponível')
  })

  it('exibe os locais recebidos e seus links de detalhes', () => {
    const html = renderizarLocaisEstatico({
      status: 'sucesso',
      dados: locaisTeste,
    })

    for (const local of locaisTeste) {
      expect(html).toContain(local.nome)
      expect(html).toContain(`/locais/${local.id}`)
    }

    expect(html).toContain('Biblioteca Central')
    expect(html).toContain('Parque Municipal')
    expect(html).toContain('Padaria Bom Dia')
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
    // Atualizado de level: 2 para level: 3 por causa do componente <LocalCard />
    .getAllByRole('heading', { level: 3 })
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

    // Atualizado de 'searchbox' para 'combobox' devido ao autocompletar
    const busca = screen.getByRole('combobox', { name: 'Buscar' })

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