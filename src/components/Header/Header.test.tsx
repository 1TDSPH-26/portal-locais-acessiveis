import { StrictMode } from 'react'
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { listaLocais } from '../../data/locais'
import Favoritos from '../../pages/Favoritos/Favoritos'
import { CHAVE_FAVORITOS, EVENTO_FAVORITOS } from '../../utils/favoritos'
import LocalCard from '../LocalCard/LocalCard'
import Header from './Header'

afterEach(() => vi.restoreAllMocks())

function renderizarPortal(caminho = '/') {
  return render(
    <StrictMode>
      <MemoryRouter initialEntries={[caminho]}>
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <LocalCard local={listaLocais[0]} />
              <LocalCard local={listaLocais[1]} />
            </>
          } />
          <Route path="/favoritos" element={<Favoritos />} />
        </Routes>
      </MemoryRouter>
    </StrictMode>,
  )
}

function linkFavoritos(menu = 'Navegação principal') {
  return within(
    screen.getByRole('navigation', { name: menu })
  ).getByRole('link', { name: /^Favoritos,/ })
}

function anuncioFavoritos() {
  return within(screen.getByRole('banner')).getByRole('status')
}

// Simula a recepção do evento; a propagação real entre abas exige navegador.
function receberAlteracaoExterna(ids: number[] | null) {
  act(() => {
    if (ids === null) localStorage.clear()
    else localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(ids))

    window.dispatchEvent(new StorageEvent('storage', {
      key: ids === null ? null : CHAVE_FAVORITOS,
      storageArea: localStorage,
    }))
  })
}

describe('Contador de favoritos no Header', () => {
  it.each([
    [[], 'Favoritos, 0 locais salvos'],
    [[1], 'Favoritos, 1 local salvo'],
    [[1, 2], 'Favoritos, 2 locais salvos'],
    [[1, 1, 999], 'Favoritos, 3 locais salvos'],
  ] as const)('lê os IDs %j sem anúncio inicial', (ids, nome) => {
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(ids))
    renderizarPortal()

    expect(linkFavoritos()).toHaveAccessibleName(nome)
    expect(linkFavoritos()).toHaveAttribute('href', '/favoritos')
    expect(within(linkFavoritos()).getByText(String(ids.length)))
      .toHaveAttribute('aria-hidden', 'true')
    expect(anuncioFavoritos()).toBeEmptyDOMElement()
    expect(anuncioFavoritos()).toHaveAttribute('aria-live', 'polite')
    expect(anuncioFavoritos()).toHaveAttribute('aria-atomic', 'true')
  })

  it('atualiza Header e botão a cada adição e remoção, sem remontar a página', async () => {
    const user = userEvent.setup()
    renderizarPortal()
    const gravar = vi.spyOn(Storage.prototype, 'setItem')
    const [primeiro, segundo] = screen.getAllByRole('button', {
      name: 'Adicionar aos favoritos',
    })

    await user.click(primeiro)
    expect(linkFavoritos()).toHaveAccessibleName('Favoritos, 1 local salvo')
    expect(primeiro).toHaveAttribute('aria-pressed', 'true')
    expect(primeiro).toHaveAccessibleName('Remover dos favoritos')
    expect(anuncioFavoritos()).toHaveTextContent('Favoritos, 1 local salvo')

    await user.click(segundo)
    expect(linkFavoritos()).toHaveAccessibleName('Favoritos, 2 locais salvos')
    expect(anuncioFavoritos()).toHaveTextContent('Favoritos, 2 locais salvos')

    await user.click(primeiro)
    expect(linkFavoritos()).toHaveAccessibleName('Favoritos, 1 local salvo')
    expect(primeiro).toHaveAttribute('aria-pressed', 'false')
    expect(primeiro).toHaveAccessibleName('Adicionar aos favoritos')
    expect(localStorage.getItem(CHAVE_FAVORITOS)).toBe('[2]')
    expect(gravar).toHaveBeenCalledTimes(3)
  })

  it('mantém o valor e não anuncia sucesso quando a gravação falha', async () => {
    const user = userEvent.setup()
    renderizarPortal()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Armazenamento bloqueado')
    })

    const botao = screen.getAllByRole('button', { name: 'Adicionar aos favoritos' })[0]
    await user.click(botao)

    expect(botao).toHaveAttribute('aria-pressed', 'false')
    expect(linkFavoritos()).toHaveAccessibleName('Favoritos, 0 locais salvos')
    expect(anuncioFavoritos()).toBeEmptyDOMElement()
    expect(localStorage.getItem(CHAVE_FAVORITOS)).toBeNull()
  })

  it('sincroniza o Header e o estado acessível dos cards ao receber storage', () => {
    renderizarPortal()
    const botao = screen.getAllByRole('button', { name: 'Adicionar aos favoritos' })[0]

    receberAlteracaoExterna([1])
    expect(linkFavoritos()).toHaveAccessibleName('Favoritos, 1 local salvo')
    expect(botao).toHaveAttribute('aria-pressed', 'true')
    expect(botao).toHaveAccessibleName('Remover dos favoritos')

    receberAlteracaoExterna(null)
    expect(linkFavoritos()).toHaveAccessibleName('Favoritos, 0 locais salvos')
    expect(botao).toHaveAttribute('aria-pressed', 'false')
    expect(anuncioFavoritos()).toHaveTextContent('Favoritos, 0 locais salvos')
  })

  it('remove o último favorito uma única vez e preserva o foco no título', async () => {
    localStorage.setItem(CHAVE_FAVORITOS, '[1]')
    const user = userEvent.setup()
    renderizarPortal('/favoritos')
    const titulo = screen.getByRole('heading', { name: 'Meus favoritos' })
    expect(titulo).toHaveFocus()
    expect(screen.getAllByRole('status')).toHaveLength(1)
    const gravar = vi.spyOn(Storage.prototype, 'setItem')

    await user.click(screen.getByRole('button', { name: 'Remover dos favoritos' }))

    expect(gravar).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem(CHAVE_FAVORITOS)).toBe('[]')
    expect(linkFavoritos()).toHaveAccessibleName('Favoritos, 0 locais salvos')
    expect(screen.getByText('Você ainda não tem locais favoritos')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Explorar locais' })).toHaveAttribute('href', '/locais')
    expect(titulo).toHaveFocus()
    expect(screen.queryByRole('button', { name: 'Remover dos favoritos' })).not.toBeInTheDocument()
  })

  it('atualiza a listagem de favoritos ao receber uma alteração externa', () => {
    renderizarPortal('/favoritos')

    receberAlteracaoExterna([2])
    expect(screen.getByRole('heading', { name: listaLocais[1].nome })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remover dos favoritos' })).toHaveAttribute('aria-pressed', 'true')
    expect(linkFavoritos()).toHaveAccessibleName('Favoritos, 1 local salvo')

    receberAlteracaoExterna(null)
    expect(screen.getByText('Você ainda não tem locais favoritos')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Meus favoritos' })).toHaveFocus()
  })

  it('compartilha a quantidade com o menu móvel e preserva o anúncio ao fechar e navegar', async () => {
    const user = userEvent.setup()
    renderizarPortal()
    await user.click(screen.getAllByRole('button', { name: 'Adicionar aos favoritos' })[0])
    const anuncio = anuncioFavoritos()

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }))
    expect(linkFavoritos('Navegação móvel')).toHaveAccessibleName('Favoritos, 1 local salvo')
    expect(within(linkFavoritos('Navegação móvel')).getByText('1')).toBeInTheDocument()
    expect(linkFavoritos()).toHaveAccessibleName('Favoritos, 1 local salvo')
    expect(within(screen.getByRole('banner')).getAllByRole('status')).toHaveLength(1)

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('navigation', { name: 'Navegação móvel' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveFocus()
    expect(anuncioFavoritos()).toBe(anuncio)

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }))
    await user.click(linkFavoritos('Navegação móvel'))
    expect(screen.getByRole('heading', { name: 'Meus favoritos' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Navegação móvel' })).not.toBeInTheDocument()
    expect(linkFavoritos()).toHaveAttribute('aria-current', 'page')
    expect(anuncioFavoritos()).toBe(anuncio)
    expect(anuncio).toHaveTextContent('Favoritos, 1 local salvo')
  })

  it('não modifica o anúncio ao receber novamente a mesma quantidade', async () => {
    renderizarPortal()
    receberAlteracaoExterna([1])
    const observarMutacao = vi.fn()
    const observer = new MutationObserver(observarMutacao)
    observer.observe(anuncioFavoritos(), { childList: true, characterData: true, subtree: true })

    try {
      await act(async () => {
        window.dispatchEvent(new CustomEvent(EVENTO_FAVORITOS))
      })
      expect(observarMutacao).not.toHaveBeenCalled()
    } finally {
      observer.disconnect()
    }
  })

  it('limpa as assinaturas do StrictMode e recupera o valor na remontagem', async () => {
    const adicionar = vi.spyOn(window, 'addEventListener')
    const remover = vi.spyOn(window, 'removeEventListener')
    const user = userEvent.setup()
    const primeiraMontagem = renderizarPortal()
    await user.click(screen.getAllByRole('button', { name: 'Adicionar aos favoritos' })[0])
    primeiraMontagem.unmount()

    const registros = adicionar.mock.calls.filter(([tipo]) =>
      tipo === EVENTO_FAVORITOS || tipo === 'storage',
    )
    const cancelamentos = remover.mock.calls.filter(([tipo]) =>
      tipo === EVENTO_FAVORITOS || tipo === 'storage',
    )
    expect(registros.length).toBeGreaterThan(0)
    expect(cancelamentos).toHaveLength(registros.length)
    for (const [tipo, listener] of registros) {
      expect(remover).toHaveBeenCalledWith(tipo, listener)
    }

    renderizarPortal()
    expect(linkFavoritos()).toHaveAccessibleName('Favoritos, 1 local salvo')
    expect(anuncioFavoritos()).toBeEmptyDOMElement()
    expect(screen.getByRole('button', { name: 'Remover dos favoritos' })).toHaveAttribute('aria-pressed', 'true')
  })
})
