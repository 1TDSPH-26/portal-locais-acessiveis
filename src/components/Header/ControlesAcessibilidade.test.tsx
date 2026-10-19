import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContrastButton from '../AcessibilityControls/ContrastButton'
import FontDecreaseButton from '../AcessibilityControls/FontDecreaseButton'
import FontIncreaseButton from '../AcessibilityControls/FontIncreaseButton'

describe('ContrastButton', () => {
  it('começa desativado, com rótulo e aria-pressed corretos', () => {
    render(<ContrastButton />)

    const botao = screen.getByRole('button', { name: 'Ativar alto contraste' })

    expect(botao).toHaveAttribute('aria-pressed', 'false')
    expect(document.documentElement).not.toHaveClass('high-contrast')
  })

  it('ativa o alto contraste ao clicar', async () => {
    const user = userEvent.setup()
    render(<ContrastButton />)

    await user.click(screen.getByRole('button', { name: 'Ativar alto contraste' }))

    const botao = screen.getByRole('button', { name: 'Desativar alto contraste' })
    expect(botao).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement).toHaveClass('high-contrast')
  })

  it('desativa o alto contraste no segundo clique', async () => {
    const user = userEvent.setup()
    render(<ContrastButton />)

    await user.click(screen.getByRole('button', { name: 'Ativar alto contraste' }))
    await user.click(screen.getByRole('button', { name: 'Desativar alto contraste' }))

    const botao = screen.getByRole('button', { name: 'Ativar alto contraste' })
    expect(botao).toHaveAttribute('aria-pressed', 'false')
    expect(document.documentElement).not.toHaveClass('high-contrast')
  })

  it('funciona pelo teclado: Tab foca, Enter ativa e Space desativa', async () => {
    const user = userEvent.setup()
    render(<ContrastButton />)

    await user.tab()
    expect(screen.getByRole('button')).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(document.documentElement).toHaveClass('high-contrast')
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')

    await user.keyboard(' ')
    expect(document.documentElement).not.toHaveClass('high-contrast')
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })
})

describe('FontDecreaseButton', () => {
  const html = document.documentElement

  it('tem rótulo acessível e começa desabilitado no tamanho mínimo', () => {
    render(<FontDecreaseButton />)

    const botao = screen.getByRole('button', { name: 'Reduzir tamanho do texto' })

    expect(botao).toBeDisabled()
    expect(html).toHaveAttribute('data-font-size', '1')
  })

  it('reduz de 3 para 2 e de 2 para 1 até desabilitar no mínimo', async () => {
    const user = userEvent.setup()
    html.setAttribute('data-font-size', '3')
    render(<FontDecreaseButton />)

    const botao = screen.getByRole('button', { name: 'Reduzir tamanho do texto' })
    expect(botao).toBeEnabled()

    await user.click(botao)
    expect(html).toHaveAttribute('data-font-size', '2')
    expect(botao).toBeEnabled()

    await user.click(botao)
    expect(html).toHaveAttribute('data-font-size', '1')
    expect(botao).toBeDisabled()
  })

  it('não reduz abaixo do mínimo', async () => {
    const user = userEvent.setup()
    render(<FontDecreaseButton />)

    await user.click(screen.getByRole('button', { name: 'Reduzir tamanho do texto' }))

    expect(html).toHaveAttribute('data-font-size', '1')
  })

  it('funciona pelo teclado: Tab foca, Enter e Space reduzem', async () => {
    const user = userEvent.setup()
    html.setAttribute('data-font-size', '3')
    render(<FontDecreaseButton />)

    await user.tab()
    expect(screen.getByRole('button', { name: 'Reduzir tamanho do texto' })).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(html).toHaveAttribute('data-font-size', '2')

    await user.keyboard(' ')
    expect(html).toHaveAttribute('data-font-size', '1')
  })
})

describe('FontIncreaseButton', () => {
  const html = document.documentElement

  it('tem rótulo acessível e começa habilitado no tamanho mínimo', () => {
    render(<FontIncreaseButton />)

    const botao = screen.getByRole('button', { name: 'Aumentar tamanho do texto' })

    expect(botao).toBeEnabled()
    expect(html).toHaveAttribute('data-font-size', '1')
  })

  it('aumenta de 1 para 2 e de 2 para 3 até desabilitar no máximo', async () => {
    const user = userEvent.setup()
    render(<FontIncreaseButton />)

    const botao = screen.getByRole('button', { name: 'Aumentar tamanho do texto' })

    await user.click(botao)
    expect(html).toHaveAttribute('data-font-size', '2')
    expect(botao).toBeEnabled()

    await user.click(botao)
    expect(html).toHaveAttribute('data-font-size', '3')
    expect(botao).toBeDisabled()
  })

  it('começa desabilitado quando o tamanho já está no máximo', () => {
    html.setAttribute('data-font-size', '3')
    render(<FontIncreaseButton />)

    expect(screen.getByRole('button', { name: 'Aumentar tamanho do texto' })).toBeDisabled()
  })

  it('funciona pelo teclado: Tab foca, Enter e Space aumentam', async () => {
    const user = userEvent.setup()
    render(<FontIncreaseButton />)

    await user.tab()
    expect(screen.getByRole('button', { name: 'Aumentar tamanho do texto' })).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(html).toHaveAttribute('data-font-size', '2')

    await user.keyboard(' ')
    expect(html).toHaveAttribute('data-font-size', '3')
  })
})

describe('FontIncreaseButton + FontDecreaseButton juntos', () => {
  it('um botão atualiza o estado do outro nos limites', async () => {
    const user = userEvent.setup()
    render(
      <>
        <FontDecreaseButton />
        <FontIncreaseButton />
      </>,
    )

    const diminuir = screen.getByRole('button', { name: 'Reduzir tamanho do texto' })
    const aumentar = screen.getByRole('button', { name: 'Aumentar tamanho do texto' })

    expect(diminuir).toBeDisabled()
    expect(aumentar).toBeEnabled()

    await user.click(aumentar)
    await waitFor(() => expect(diminuir).toBeEnabled())

    await user.click(aumentar)
    expect(aumentar).toBeDisabled()
    expect(diminuir).toBeEnabled()

    await user.click(diminuir)
    await waitFor(() => expect(aumentar).toBeEnabled())
  })
})