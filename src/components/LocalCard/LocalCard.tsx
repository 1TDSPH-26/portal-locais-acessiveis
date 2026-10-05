import { Link } from 'react-router'

interface RecursoAcessibilidade {
  texto: string
}

interface LocalCardProps {
  nome: string
  localizacao: string
  recursos: RecursoAcessibilidade[]
  dataVerificacao: string
  detalhesUrl: string
}

export default function LocalCard({
  nome,
  localizacao,
  recursos,
  dataVerificacao,
  detalhesUrl,
}: LocalCardProps) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-lg border border-borda-decorativa bg-fundo p-4 sm:p-5">
      <div className="min-w-0">
        <h3 className="break-words font-display text-h3 text-texto">
          {nome}
        </h3>

        <p className="break-words text-corpo-14 text-secundaria">
          {localizacao}
        </p>
      </div>

      <ul className="flex min-w-0 flex-col gap-1">
        {recursos.map((recurso, index) => (
          <li
            key={index}
            className="break-words text-corpo-14 text-texto"
          >
            {recurso.texto}
          </li>
        ))}
      </ul>

      <Link
        to={detalhesUrl}
        className="w-full rounded-md border border-primaria-600 px-4 py-2 text-center font-corpo text-botao text-primaria-600 hover:bg-fundo-suave focus:outline-none focus:ring-2 focus:ring-primaria-600 focus:ring-offset-2 sm:w-auto sm:self-start"
      >
        Ver detalhes
      </Link>

      <p className="break-words text-legenda text-secundaria">
        Verificado em {dataVerificacao}
      </p>
    </div>
  )
}