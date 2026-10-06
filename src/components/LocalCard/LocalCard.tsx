import { Link } from 'react-router'
import type { Local, RecursoAcessibilidade } from '../../types/local'

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
  const localizacao = `${local.endereco} · CEP ${local.cep}`

  return (
    <article className="border border-borda-decorativa rounded-lg p-4 bg-fundo flex flex-col gap-3">
      <div>
        <h3 className="text-h3 font-display text-texto">{local.nome}</h3>
        <p className="text-corpo-14 text-secundaria">{localizacao}</p>
      </div>

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