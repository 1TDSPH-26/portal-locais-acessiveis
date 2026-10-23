
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
