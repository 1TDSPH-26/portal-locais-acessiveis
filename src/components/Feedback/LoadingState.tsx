interface LoadingStateProps {
  message?: string
}

// Para testar basta fazer o import deste componente no App.tsx e chamano no retorno da função

export default function LoadingState({
  message = 'Carregando...',
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex flex-col items-center justify-center gap-3 p-6 text-center"
    >
      <span
        aria-hidden="true"
        className="size-8 animate-spin rounded-full border-4 border-borda-decorativa border-t-primaria-600"
      />
      <p className="font-corpo text-corpo-16 text-texto">
        {message}
      </p>
    </div>
  )
}