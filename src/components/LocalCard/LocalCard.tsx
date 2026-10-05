import { useState } from 'react'
import { Link } from 'react-router'

const FAVORITOS_STORAGE_KEY = 'locais-favoritos'

function lerFavoritos(): number[] {
  try {
    const dados = localStorage.getItem(FAVORITOS_STORAGE_KEY)
    const favoritos: unknown = dados ? JSON.parse(dados) : []
    return Array.isArray(favoritos)
      ? favoritos.filter((id): id is number => Number.isInteger(id))
      : []
  } catch {
    return []
  }
}

interface RecursoAcessibilidade {
  texto: string
}

type LocalCardProps =
  | { id: number }
  | {
      id: number
      nome: string
      localizacao: string
      recursos: RecursoAcessibilidade[]
      dataVerificacao: string
      detalhesUrl: string
    }

export default function LocalCard(props: LocalCardProps) {
  const { id } = props
  const [favoritado, setFavoritado] = useState(() => lerFavoritos().includes(id))

  function alternarFavorito() {
    const favoritos = lerFavoritos()
    const novosFavoritos = favoritos.includes(id)
      ? favoritos.filter((favoritoId) => favoritoId !== id)
      : [...favoritos, id]

    try {
      localStorage.setItem(FAVORITOS_STORAGE_KEY, JSON.stringify(novosFavoritos))
      setFavoritado(novosFavoritos.includes(id))
    } catch {
      return
    }
  }

  const botaoFavorito = (
    <button
      type="button"
      onClick={alternarFavorito}
      aria-label={favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      aria-pressed={favoritado}
      className="text-botao font-corpo text-primaria-600 border border-primaria-600 rounded-md px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-primaria-600 focus:ring-offset-2 hover:bg-fundo-suave"
    >
      {favoritado ? 'Favoritado' : 'Favoritar'}
    </button>
  )

  if (!('localizacao' in props)) {
    return botaoFavorito
  }

  const { nome, localizacao, recursos, dataVerificacao, detalhesUrl } = props

  return (
    <div className="border border-borda-decorativa rounded-lg p-4 bg-fundo flex flex-col gap-3">
      <div>
        <h3 className="text-h3 font-display text-texto">{nome}</h3>
        <p className="text-corpo-14 text-secundaria">{localizacao}</p>
      </div>

      {botaoFavorito}

      <ul className="flex flex-col gap-1">
        {recursos.map((recurso, index) => (
          <li key={index} className="text-corpo-14 text-texto">
            {recurso.texto}
          </li>
        ))}
      </ul>

      <Link
        to={detalhesUrl}
        className="text-botao font-corpo text-primaria-600 border border-primaria-600 rounded-md px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-primaria-600 focus:ring-offset-2 hover:bg-fundo-suave"
      >
        Ver detalhes
      </Link>

      <p className="text-legenda text-secundaria">
        Verificado em {dataVerificacao}
      </p>
    </div>
  )
}
