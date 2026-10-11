import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useConsulta } from '../../hooks/useConsulta'
import type { Local } from '../../types/local'
import DetalhesLocal from './DetalhesLocal'

vi.mock('../../hooks/useConsulta', () => ({
  useConsulta: vi.fn(),
}))

type EstadoConsultaLocal =
  ReturnType<typeof useConsulta<Local | null>>['estado']

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

function renderizarDetalhe(
  estado: EstadoConsultaLocal,
  caminho = '/locais/1',
) {
  vi.mocked(useConsulta).mockReturnValue({
    estado,
    tentarNovamente: vi.fn(),
  })

  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[caminho]}>
      <Routes>
        <Route path="/locais/:id" element={<DetalhesLocal />} />
      </Routes>
    </MemoryRouter>,
  )
}

function verificarBreadcrumb(html: string, paginaAtual: string) {
  const navegacoes =
    html.match(
      /<nav\b[^>]*aria-label="Caminho de navegação"[^>]*>[\s\S]*?<\/nav>/g,
    ) ?? []

  expect(navegacoes).toHaveLength(1)

  const breadcrumb = navegacoes[0] ?? ''
  const conteudoLista =
    breadcrumb.match(/<ol\b[^>]*>([\s\S]*?)<\/ol>/)?.[1] ?? ''
  const itens =
    conteudoLista.match(/<li\b[^>]*>[\s\S]*?<\/li>/g) ?? []

  expect(itens).toHaveLength(3)
  expect(breadcrumb.match(/<a\b/g) ?? []).toHaveLength(2)

  expect(itens[0]).toMatch(
    /<a\b[^>]*href="\/"[^>]*>\s*Início\s*<\/a>/,
  )
  expect(itens[1]).toMatch(
    /<a\b[^>]*href="\/locais"[^>]*>\s*Locais\s*<\/a>/,
  )

  expect(
    breadcrumb.match(/\baria-current="page"/g) ?? [],
  ).toHaveLength(1)
  expect(itens[2]).toMatch(/^<li\b[^>]*aria-current="page"/)
  expect(itens[2]).toContain(paginaAtual)
  expect(itens[2]).not.toMatch(/<a\b/)

  const separadorDecorativo =
    /<span\b[^>]*aria-hidden="true"[^>]*>\s*\/\s*<\/span>/

  expect(itens[1]).toMatch(separadorDecorativo)
  expect(itens[2]).toMatch(separadorDecorativo)
}

describe('Breadcrumb da página de detalhes', () => {
  beforeEach(() => {
    vi.mocked(useConsulta).mockReset()
  })

  it('mantém o caminho de navegação durante o carregamento', () => {
    const html = renderizarDetalhe({ status: 'carregando' })

    verificarBreadcrumb(html, 'Detalhes do local')
  })

  it('mantém a identificação genérica quando a consulta falha', () => {
    const html = renderizarDetalhe({
      status: 'erro',
      mensagem: 'Serviço indisponível para este teste.',
    })

    verificarBreadcrumb(html, 'Detalhes do local')
  })

  it('identifica o estado de local não encontrado', () => {
    const html = renderizarDetalhe(
      { status: 'sucesso', dados: null },
      '/locais/999',
    )

    verificarBreadcrumb(html, 'Local não encontrado')
  })

  it('identifica cada local pelo nome recebido na consulta', () => {
    for (const local of locaisTeste) {
      const html = renderizarDetalhe(
        { status: 'sucesso', dados: local },
        `/locais/${local.id}`,
      )

      verificarBreadcrumb(html, local.nome)
    }
  })
})
