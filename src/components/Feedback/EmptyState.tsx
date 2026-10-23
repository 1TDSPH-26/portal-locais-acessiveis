import type { ReactNode } from 'react'

interface EmptyStateProps {
  title?: string
  message?: string
  actionLabel?: string
  onAction?: () => void
  children?: ReactNode
}

export default function EmptyState({
  title = 'Nenhum resultado encontrado',
  message = 'Não encontramos resultados para esta busca.',
  actionLabel,
  onAction,
  children,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-borda-funcional bg-fundo-suave px-4 py-8 text-center sm:px-8"
    >
      {/* Ícone decorativo: o significado já está no título. */}
      <svg
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-14 w-14 text-primaria-600"
      >
        <circle cx="11" cy="11" r="6.4" />
        <path d="m15.8 15.8 4.2 4.2" />
        <path d="m8.8 8.8 4.4 4.4" />
        <path d="m13.2 8.8-4.4 4.4" />
      </svg>

      <h2 className="font-display text-h3 font-bold text-texto">
        {title}
      </h2>

      <p className="max-w-xl font-corpo text-corpo-16 text-secundaria">
        {message}
      </p>

      {children}

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-primaria-600 px-5 font-corpo text-botao font-semibold text-white hover:bg-primaria-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaria-600 sm:w-auto"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
