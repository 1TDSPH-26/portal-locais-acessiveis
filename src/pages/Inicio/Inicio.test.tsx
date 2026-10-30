import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'
import { listaLocais } from '../../data/locais'
import Inicio from './Inicio'

// Observa o destino escolhido sem testar novamente as páginas de destino.
function Destino() {
  const { pathname } = useLocation()
  return <p>Destino: {pathname}</p>
}

function renderizarInicio() {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="*" element={<Destino />} />
      </Routes>
    </MemoryRouter>,
  )
  return userEvent.setup()
}

function verificarDestaques() {
  expect(screen.getByRole('heading', { name: 'Locais em destaque' }))
    .toBeInTheDocument()
  const cards = screen.getAllByRole('article')
  expect(cards).toHaveLength(3)

  for (const [indice, local] of listaLocais.slice(0, 3).entries()) {
    const card = within(cards[indice])
    expect(card.getByRole('heading', { name: local.nome })).toBeInTheDocument()
    expect(card.getByRole('link', { name: 'Ver detalhes' }))
      .toHaveAttribute('href', `/locais/${local.id}`)
  }
}

describe('Página inicial', () => {
  it('exibe os destaques com seus destinos e navega para o local escolhido', async () => {
    const user = renderizarInicio()
    verificarDestaques()

    const segundoCard = within(screen.getAllByRole('article')[1])
    await user.click(segundoCard.getByRole('link', { name: 'Ver detalhes' }))

    expect(screen.getByText(`Destino: /locais/${listaLocais[1].id}`))
      .toBeInTheDocument()
  })

  it('busca por nome ao pressionar Enter e navega para um local fora dos destaques', async () => {
    const user = renderizarInicio()
    const local = listaLocais[5]
    const campo = screen.getByRole('searchbox', { name: 'Buscar local ou endereço' })

    await user.type(campo, `  ${local.nome.toUpperCase()}  `)
    verificarDestaques()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('heading', { name: 'Resultados da busca' }))
      .toBeInTheDocument()
    const card = within(screen.getByRole('article'))
    expect(card.getByRole('heading', { name: local.nome })).toBeInTheDocument()
    const link = card.getByRole('link', { name: 'Ver detalhes' })
    expect(link).toHaveAttribute('href', `/locais/${local.id}`)

    await user.click(link)
    expect(screen.getByText(`Destino: /locais/${local.id}`)).toBeInTheDocument()
  })

  it('busca por endereço ao acionar Buscar', async () => {
    const user = renderizarInicio()
    const local = listaLocais[5]

    await user.type(
      screen.getByRole('searchbox', { name: 'Buscar local ou endereço' }),
      local.endereco,
    )
    await user.click(screen.getByRole('button', { name: 'Buscar' }))

    const card = within(screen.getByRole('article'))
    expect(card.getByRole('heading', { name: local.nome })).toBeInTheDocument()
    expect(card.getByRole('link', { name: 'Ver detalhes' }))
      .toHaveAttribute('href', `/locais/${local.id}`)
  })

  it.each(['Voltar aos destaques', 'Limpar campo de busca'])(
    'restaura os destaques e limpa o campo com "%s"',
    async (acao) => {
      const user = renderizarInicio()
      const campo = screen.getByRole('searchbox', { name: 'Buscar local ou endereço' })

      await user.type(campo, listaLocais[5].nome)
      await user.click(screen.getByRole('button', { name: 'Buscar' }))
      expect(screen.getAllByRole('article')).toHaveLength(1)

      await user.click(screen.getByRole('button', { name: acao }))

      expect(campo).toHaveValue('')
      verificarDestaques()
      expect(screen.queryByRole('heading', { name: 'Resultados da busca' }))
        .not.toBeInTheDocument()
    },
  )

  it('informa a ausência de resultados e recupera os destaques ao limpar a busca', async () => {
    const user = renderizarInicio()
    const campo = screen.getByRole('searchbox', { name: 'Buscar local ou endereço' })

    await user.type(campo, 'termo-inexistente-issue-86')
    await user.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(screen.getByRole('heading', { name: 'Nenhum local encontrado' }))
      .toBeInTheDocument()
    expect(screen.queryAllByRole('article')).toHaveLength(0)

    await user.click(screen.getByRole('button', { name: 'Limpar busca' }))

    expect(campo).toHaveValue('')
    verificarDestaques()
    expect(screen.queryByRole('heading', { name: 'Nenhum local encontrado' }))
      .not.toBeInTheDocument()
  })

  it('preserva os destinos dos atalhos de catálogo, cadastro e informações', () => {
    renderizarInicio()

    expect(screen.getByRole('link', { name: 'Ver todos os locais' }))
      .toHaveAttribute('href', '/locais')
    expect(screen.getByRole('link', { name: 'Cadastrar local' }))
      .toHaveAttribute('href', '/cadastrar')
    expect(screen.getByRole('link', { name: 'Sobre o projeto' }))
      .toHaveAttribute('href', '/sobre')
  })
})
