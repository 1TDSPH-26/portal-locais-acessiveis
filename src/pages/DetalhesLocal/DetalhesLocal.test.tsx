import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FalhaServicoError } from '../../services/falha-servico'
import { buscarLocalPorId } from '../../services/locais-consulta'
import type { Local } from '../../types/local'
import DetalhesLocal from './DetalhesLocal'

vi.mock('../../services/locais-consulta', () => ({
  buscarLocalPorId: vi.fn(),
}))

const mensagemIndisponivel =
  'O serviço de dados está indisponível no momento. Verifique sua conexão e tente novamente em instantes.'

const locaisTeste: Local[] = [
  {
    id: 1,
    nome: 'Biblioteca Central',
    endereco: 'Rua dos Livros, 10',
    cep: '01001-000',
    categoria: 'educacao',
    recursosAcessibilidade: ['rampa_acesso', 'piso_tatil', 'libras'],
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

function renderizarDetalhe(caminho = '/locais/1') {
  return render(
    <MemoryRouter initialEntries={[caminho]}>
      <Routes>
        <Route path="/locais/:id" element={<DetalhesLocal />} />
        <Route path="/locais" element={<h1>Listagem de locais</h1>} />
        <Route path="/" element={<h1>Página inicial</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

function verificarBreadcrumb(paginaAtual: string) {
  const breadcrumb = screen.getByRole('navigation', {
    name: 'Caminho de navegação',
  })
  const itens = within(breadcrumb).getAllByRole('listitem')

  expect(itens).toHaveLength(3)
  expect(within(breadcrumb).getAllByRole('link')).toHaveLength(2)

  expect(
    within(itens[0]).getByRole('link', { name: 'Início' }),
  ).toHaveAttribute('href', '/')
  expect(
    within(itens[1]).getByRole('link', { name: 'Locais' }),
  ).toHaveAttribute('href', '/locais')

  expect(breadcrumb.querySelectorAll('[aria-current="page"]')).toHaveLength(1)
  expect(itens[2]).toHaveAttribute('aria-current', 'page')
  expect(itens[2]).toHaveTextContent(paginaAtual)
  expect(within(itens[2]).queryByRole('link')).not.toBeInTheDocument()

  for (const item of [itens[1], itens[2]]) {
    const separador = item.querySelector('span[aria-hidden="true"]')
    expect(separador).toHaveTextContent('/')
  }
}

describe('Página de detalhes do local', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('carregamento', () => {
    it('exibe o LoadingState enquanto a consulta está pendente', () => {
      vi.mocked(buscarLocalPorId).mockReturnValue(new Promise(() => {}))

      renderizarDetalhe('/locais/1')

      const carregando = screen.getByRole('status')
      expect(carregando).toHaveAttribute('aria-busy', 'true')
      expect(carregando).toHaveAttribute('aria-live', 'polite')
      expect(carregando).toHaveTextContent('Carregando detalhes do local...')

      expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
      expect(buscarLocalPorId).toHaveBeenCalledWith('1')
      verificarBreadcrumb('Detalhes do local')
    })
  })

  describe('sucesso', () => {
    it('renderiza título, endereço, CEP, categoria e recursos do local', async () => {
      const local = locaisTeste[0]
      vi.mocked(buscarLocalPorId).mockResolvedValue(local)

      renderizarDetalhe(`/locais/${local.id}`)

      const titulo = await screen.findByRole('heading', {
        level: 1,
        name: 'Biblioteca Central',
      })
      expect(titulo).toHaveAttribute('id', 'detalhe-titulo')
      expect(screen.getByRole('article')).toHaveAttribute(
        'aria-labelledby',
        'detalhe-titulo',
      )

      const termos = screen.getAllByRole('term').map((t) => t.textContent)
      const definicoes = screen
        .getAllByRole('definition')
        .map((d) => d.textContent)
      expect(termos).toEqual(['Endereço', 'CEP', 'Categoria'])
      expect(definicoes).toEqual([
        'Rua dos Livros, 10',
        '01001-000',
        'Educação',
      ])

      expect(screen.queryByRole('status')).not.toBeInTheDocument()
      verificarBreadcrumb('Biblioteca Central')
    })

    it('lista os recursos de acessibilidade em uma região rotulada', async () => {
      vi.mocked(buscarLocalPorId).mockResolvedValue(locaisTeste[0])

      renderizarDetalhe('/locais/1')

      const tituloRecursos = await screen.findByRole('heading', {
        level: 2,
        name: 'Recursos de acessibilidade',
      })
      const regiao = screen.getByRole('region', {
        name: 'Recursos de acessibilidade',
      })
      expect(regiao).toHaveAttribute('aria-labelledby', tituloRecursos.id)

      const lista = within(regiao).getByRole('list')
      const recursos = within(lista)
        .getAllByRole('listitem')
        .map((item) => item.textContent)
      expect(recursos).toEqual([
        'Rampa de acesso',
        'Piso tátil',
        'Atendimento em Libras',
      ])
    })

    it('identifica cada local pelo nome no breadcrumb', async () => {
      for (const local of locaisTeste) {
        vi.mocked(buscarLocalPorId).mockResolvedValue(local)

        const { unmount } = renderizarDetalhe(`/locais/${local.id}`)

        await screen.findByRole('heading', { level: 1, name: local.nome })
        expect(buscarLocalPorId).toHaveBeenLastCalledWith(String(local.id))
        verificarBreadcrumb(local.nome)

        unmount()
      }
    })

    it('volta para a listagem pelo breadcrumb', async () => {
      const user = userEvent.setup()
      vi.mocked(buscarLocalPorId).mockResolvedValue(locaisTeste[0])

      renderizarDetalhe('/locais/1')
      await screen.findByRole('heading', { level: 1, name: 'Biblioteca Central' })

      await user.click(screen.getByRole('link', { name: 'Locais' }))

      expect(
        screen.getByRole('heading', { level: 1, name: 'Listagem de locais' }),
      ).toBeInTheDocument()
    })
  })

  describe('erro', () => {
    it('exibe a mensagem do serviço quando a consulta é rejeitada', async () => {
      vi.mocked(buscarLocalPorId).mockRejectedValue(
        new FalhaServicoError('tempo_esgotado'),
      )

      renderizarDetalhe('/locais/1')

      const alerta = await screen.findByRole('alert')
      expect(alerta).toHaveTextContent('Não foi possível carregar este local')
      expect(alerta).toHaveTextContent(
        'O serviço demorou mais do que o esperado para responder. Tente novamente em instantes.',
      )
      expect(
        screen.getByRole('heading', { level: 1, name: 'Detalhes do local' }),
      ).toBeInTheDocument()
      expect(screen.getByRole('region', { name: 'Detalhes do local' }))
        .toHaveAttribute('aria-labelledby', 'detalhe-erro')
      verificarBreadcrumb('Detalhes do local')
    })

    it('converte falhas de rede em mensagem amigável, sem detalhe técnico', async () => {
      vi.mocked(buscarLocalPorId).mockRejectedValue(
        new TypeError('Failed to fetch'),
      )

      renderizarDetalhe('/locais/1')

      const alerta = await screen.findByRole('alert')
      expect(alerta).toHaveTextContent(mensagemIndisponivel)
      expect(alerta).not.toHaveTextContent('Failed to fetch')
    })

    it('reexecuta a consulta ao clicar em "Tentar novamente"', async () => {
      const user = userEvent.setup()
      vi.mocked(buscarLocalPorId)
        .mockRejectedValueOnce(new FalhaServicoError('indisponivel'))
        .mockResolvedValueOnce(locaisTeste[1])

      renderizarDetalhe('/locais/2')

      await screen.findByRole('alert')
      expect(buscarLocalPorId).toHaveBeenCalledTimes(1)

      await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))

      expect(
        await screen.findByRole('heading', { level: 1, name: 'Parque Municipal' }),
      ).toBeInTheDocument()
      expect(buscarLocalPorId).toHaveBeenCalledTimes(2)
      expect(buscarLocalPorId).toHaveBeenLastCalledWith('2')
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('desabilita o botão enquanto a nova tentativa está em andamento', async () => {
      const user = userEvent.setup()
      vi.mocked(buscarLocalPorId)
        .mockRejectedValueOnce(new FalhaServicoError('indisponivel'))
        .mockReturnValueOnce(new Promise(() => {}))

      renderizarDetalhe('/locais/1')

      await user.click(
        await screen.findByRole('button', { name: 'Tentar novamente' }),
      )

      const botao = await screen.findByRole('button', {
        name: 'Tentando novamente...',
      })
      expect(botao).toBeDisabled()
      expect(botao).toHaveAttribute('aria-busy', 'true')
      await waitFor(() => expect(buscarLocalPorId).toHaveBeenCalledTimes(2))
    })
  })

  describe('local não encontrado', () => {
    it.each(['999', 'invalido'])(
      'exibe mensagem amigável para o id "%s"',
      async (id) => {
        vi.mocked(buscarLocalPorId).mockResolvedValue(null)

        renderizarDetalhe(`/locais/${id}`)

        const titulo = await screen.findByRole('heading', {
          level: 1,
          name: 'Local não encontrado',
        })
        expect(titulo).toHaveAttribute('id', 'detalhe-nao-encontrado')
        expect(
          screen.getByText(/Não encontramos nenhum local com o identificador/),
        ).toBeInTheDocument()
        expect(buscarLocalPorId).toHaveBeenCalledWith(id)
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
        verificarBreadcrumb('Local não encontrado')
      },
    )
  })
})
