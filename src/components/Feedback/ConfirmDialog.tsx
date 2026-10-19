
import { useEffect, useRef } from 'react'

export type ConfirmDialogVariant = 'neutral' | 'danger'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmDialogVariant
}

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'neutral',
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) return

    if (isOpen && !dialog.open) {
      dialog.showModal()
      cancelButtonRef.current?.focus()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  function handleCancel(event: React.SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault()
    onCancel()
  }

  function handleBackdropClick(
    event: React.MouseEvent<HTMLDialogElement>,
  ) {
    if (event.target === dialogRef.current) {
      onCancel()
    }
  }

  function handleConfirm() {
    onConfirm()
  }

  const confirmButtonClass =
    variant === 'danger'
      ? 'bg-erro hover:opacity-90 focus-visible:outline-erro'
      : 'bg-primaria-600 hover:bg-primaria-700 focus-visible:outline-primaria-600'

  return (
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl border border-borda-decorativa bg-fundo p-0 text-texto shadow-2xl backdrop:bg-black/60"
    >
      <div className="flex flex-col gap-5 p-6 sm:p-8">
        <div className="flex flex-col gap-2">
          <h2
            id="confirm-dialog-title"
            className="font-display text-h2 font-bold text-texto"
          >
            {title}
          </h2>

          <p
            id="confirm-dialog-description"
            className="font-corpo text-corpo-16 leading-relaxed text-secundaria"
          >
            {description}
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="min-h-12 rounded-md border-2 border-borda-funcional px-5 py-3 font-corpo text-botao font-semibold text-texto hover:bg-fundo-suave focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaria-600"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className={`min-h-12 rounded-md px-5 py-3 font-corpo text-botao font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 ${confirmButtonClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}
