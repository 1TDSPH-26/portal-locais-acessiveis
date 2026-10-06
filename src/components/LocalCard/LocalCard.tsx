import { useState } from 'react'
import { Link } from 'react-router'
import type { Local, RecursoAcessibilidade } from '../../types/local'


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

const RECURSO_LABELS: Record<RecursoAcessibilidade, string> = {
  rampa_acesso: 'Rampa de acesso',
  banheiro_adaptado: 'Banheiro adaptado',
  piso_tatil: 'Piso tátil',
  sinalizacao_visual: 'Sinalização visual',
  vagas_estacionamento: 'Vagas de estacionamento',
  braile: 'Material em braile',
  libras: 'Atendimento em Libras',
  elevador: 'Elevador',
  balcao_acessivel: 'Balcão acessível',
  assentos_prioritarios: 'Assentos prioritários',
  espaco_tranquilo: 'Espaço tranquilo',
  cao_guia: 'Permite cão-guia',
}

interface LocalCardProps {
  local: Local
  detalhesUrl?: string
}

export default function LocalCard({ local, detalhesUrl }: LocalCardProps) {
  const [favoritado, setFavoritado] = useState(() => lerFavoritos().includes(local.id))

  function alternarFavorito() {
    const favoritos = lerFavoritos()
    const novosFavoritos = favoritos.includes(local.id)
      ? favoritos.filter((favoritoId) => favoritoId !== local.id)
      : [...favoritos, local.id]

    try {
      localStorage.setItem(FAVORITOS_STORAGE_KEY, JSON.stringify(novosFavoritos))
      setFavoritado(novosFavoritos.includes(local.id))
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
  
  const localizacao = `${local.endereco} · CEP ${local.cep}`

  return (
    <article className="border border-borda-decorativa rounded-lg p-4 bg-fundo flex flex-col gap-3">
      <div>
        <h3 className="text-h3 font-display text-texto">{local.nome}</h3>
        <p className="text-corpo-14 text-secundaria">{localizacao}</p>
      </div>

      {botaoFavorito}

      <ul className="flex flex-col gap-1">
        {local.recursosAcessibilidade.map((codigo) => (
          <li key={codigo} className="text-corpo-14 text-texto">
            {RECURSO_LABELS[codigo]}
          </li>
        ))}
      </ul>

      <Link
        to={detalhesUrl ?? '/locais'}
        className="text-botao font-corpo text-primaria-600 border border-primaria-600 rounded-md px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-primaria-600 focus:ring-offset-2 hover:bg-fundo-suave"
      >
        Ver detalhes
      </Link>
    </article>
  )
}
