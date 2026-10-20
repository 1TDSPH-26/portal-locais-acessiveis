
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
  const triggerRef = useRef<HTMLElement | null>(null)
  
useEffect(() => {
  const dialog = dialogRef.current

  if (!dialog) return

  if (isOpen && !dialog.open) {
    const activeElement = document.activeElement

    triggerRef.current =
      activeElement instanceof HTMLElement ? activeElement : null

    dialog.showModal()
    cancelButtonRef.current?.focus()
  } else if (!isOpen && dialog.open) {
    dialog.close()

    if (triggerRef.current?.isConnected) {
      triggerRef.current.focus()
    }

    triggerRef.current = null
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


  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return

    const dialog = dialogRef.current

    if (!dialog) return

    const focusableElements = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter(
      (element) =>
        !element.hasAttribute("hidden") &&
        element.getAttribute("aria-hidden") !== "true" &&
        element.getClientRects().length > 0,
    )

    if (focusableElements.length === 0) {
      event.preventDefault()
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (
      !event.shiftKey &&
      document.activeElement === lastElement
    ) {
      event.preventDefault()
      firstElement.focus()
    }
  }


  return (
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
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
