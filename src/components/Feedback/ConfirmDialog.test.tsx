
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi, beforeAll  } from 'vitest'
import ConfirmDialog from './ConfirmDialog'

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '')
  }

  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open')
  }
})

describe('ConfirmDialog', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('não renderiza o diálogo quando está fechado', () => {
    render(
      <ConfirmDialog
        isOpen={false}
        title="Excluir favorito"
        description="Deseja excluir este favorito?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(
      screen.queryByRole('dialog'),
    ).not.toBeInTheDocument()
  })

  it('exibe o título, a descrição e os botões ao abrir', () => {
    vi.spyOn(
      HTMLDialogElement.prototype,
      'showModal',
    ).mockImplementation(function (this: HTMLDialogElement) {
      this.setAttribute('open', '')
    })

    render(
      <ConfirmDialog
        isOpen
        title="Excluir favorito"
        description="Esta ação não pode ser desfeita."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('dialog'),
    ).toHaveAttribute('aria-modal', 'true')

    expect(
      screen.getByRole('heading', { name: 'Excluir favorito' }),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Esta ação não pode ser desfeita.'),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Confirmar' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Cancelar' }),
    ).toHaveFocus()
  })

  it('chama onConfirm ao confirmar a ação', () => {
    const onConfirm = vi.fn()

    vi.spyOn(
      HTMLDialogElement.prototype,
      'showModal',
    ).mockImplementation(function (this: HTMLDialogElement) {
      this.setAttribute('open', '')
    })

    render(
      <ConfirmDialog
        isOpen
        title="Confirmar ação"
        description="Deseja continuar?"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar' }),
    )

    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('chama onCancel ao cancelar a ação', () => {
    const onCancel = vi.fn()

    vi.spyOn(
      HTMLDialogElement.prototype,
      'showModal',
    ).mockImplementation(function (this: HTMLDialogElement) {
      this.setAttribute('open', '')
    })

    render(
      <ConfirmDialog
        isOpen
        title="Confirmar ação"
        description="Deseja continuar?"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Cancelar' }),
    )

    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('permite personalizar os textos e a variante destrutiva', () => {
    vi.spyOn(
      HTMLDialogElement.prototype,
      'showModal',
    ).mockImplementation(function (this: HTMLDialogElement) {
      this.setAttribute('open', '')
    })

    render(
      <ConfirmDialog
        isOpen
        title="Limpar histórico"
        description="Todo o histórico será removido."
        confirmLabel="Limpar tudo"
        cancelLabel="Voltar"
        variant="danger"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Limpar tudo' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Voltar' }),
    ).toBeInTheDocument()
  })
})

