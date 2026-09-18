interface EmptyStateProps {
  title?: string
  message?: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({
  title = 'Nenhum resultado encontrado',
  message = 'Não encontramos resultados para esta busca.',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <section
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 rounded-lg bg-fundo-suave p-6 text-center"
    >
      <h2 className="font-display text-corpo-14 font-bold text-texto">
        {title}
      </h2>

      <p className="max-w-2xl font-corpo text-legenda text-secundaria">
        {message}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="rounded-md border-2 border-primaria-600 px-4 py-2 font-corpo text-legenda font-semibold text-primaria-600 hover:bg-fundo focus:outline-none focus:ring-2 focus:ring-primaria-600 focus:ring-offset-2"
        >
          {actionLabel}
        </button>
      )}
    </section>
  )
}