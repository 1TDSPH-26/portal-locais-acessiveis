import { useEffect, useRef } from 'react'

interface ErrorMessageProps {
  title?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
  /** Move o foco para o aviso quando ele aparece (útil após uma ação do usuário). */
  focusOnMount?: boolean
retrying?: boolean
  retryingLabel?: string
}

export default function ErrorMessage({
  title = 'Erro',
  message = 'Ocorreu um erro. Tente novamente.',
  onRetry,
  retryLabel = 'Tentar novamente',
  focusOnMount = false,
  retrying = false,
  retryingLabel = 'Tentando novamente...',
}: ErrorMessageProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (focusOnMount) {
      containerRef.current?.focus()
    }
  }, [focusOnMount])

  return (
    <div
      ref={containerRef}
      role="alert"
      tabIndex={-1}
      className="flex flex-col gap-3 rounded-lg border-2 border-erro bg-fundo p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primaria-600 focus-visible:ring-offset-2"
    >
      <p className="font-display text-h3 font-bold text-erro">
        {title}
      </p>

      <p className="font-corpo text-corpo-16 text-texto">
        {message}
      </p>

      {onRetry && (
        <button
         type="button"
          onClick={onRetry}
          disabled={retrying}
          aria-busy={retrying || undefined}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 self-start rounded-md bg-primaria-600 px-4 py-2 font-corpo text-botao font-semibold text-white hover:bg-primaria-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primaria-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-primaria-700 sm:w-auto"
        >
          {retrying && (
            <span
              aria-hidden="true"
              className="size-4 shrink-0 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
          )}
          {retrying ? retryingLabel : retryLabel}
        </button>
      )}
    </div>
  )
}
