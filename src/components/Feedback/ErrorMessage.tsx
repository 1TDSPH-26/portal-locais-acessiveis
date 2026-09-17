interface ErrorMessageProps {
  message?: string
}

export default function ErrorMessage({
  message = 'Ocorreu um erro. Tente novamente.',
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="border-2 border-erro bg-fundo p-4"
    >
      <p className="font-display text-h3 font-bold text-erro">
        Erro
      </p>

      <p className="font-corpo text-corpo-16 text-texto">
        {message}
      </p>
    </div>
  )
}