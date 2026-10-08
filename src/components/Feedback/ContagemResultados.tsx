type ContagemResultadosProps = {
  total: number | null
}

export default function ContagemResultados({
  total,
}: ContagemResultadosProps) {
  const mensagem =
    total === null
      ? ''
      : total === 0
        ? 'Nenhum local encontrado.'
        : total === 1
          ? '1 local encontrado.'
          : `${total} locais encontrados.`

  return (
    <p
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="mb-4 font-corpo text-corpo-16 text-texto"
    >
      {mensagem}
    </p>
  )
}