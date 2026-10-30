import { formatarAtualizacao, formatarConferencia } from '../../utils/datasLocais'

type Props = {
  data?: string | null
  tipo: 'base' | 'conferencia'
}

export default function DataAtualizacao({ data, tipo }: Props) {
  const base = tipo === 'base'
  const valor = base ? formatarAtualizacao(data) : formatarConferencia(data)

  return (
    <p className="mt-2 max-w-full font-corpo text-corpo-14 leading-relaxed text-texto wrap-anywhere">
      {valor ? (
        <>
          {base ? 'Dados atualizados em: ' : 'Recursos conferidos em: '}
          <time dateTime={data!}>{valor}</time>
          {base && ' (horário de Brasília)'}
          {' — dados de demonstração.'}
        </>
      ) : (
        base ? 'Data de atualização não informada.' : 'Data de conferência não informada.'
      )}
    </p>
  )
}
