import { useEffect, useState } from 'react'

const MENSAGEM =
  'Você está visualizando dados de reserva. O serviço principal está temporariamente indisponível, mas os locais salvos ficam acessíveis.'

interface AvisoDadosReservaProps {
  
  onDispensar?: () => void
}

export default function AvisoDadosReserva({
  onDispensar,
}: AvisoDadosReservaProps) {
  const [visivel, setVisivel] = useState(true)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    setMensagem(MENSAGEM)
  }, [])

  const dispensar = () => {
    setVisivel(false)
    onDispensar?.()
  }

  if (!visivel) {
    return null
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="mb-6 flex items-start gap-3 rounded-lg border-2 border-aviso bg-fundo p-4"
    >
      <span
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-h3 font-bold text-aviso"
      >
        ⚠
      </span>

      <p className="flex-1 font-corpo text-corpo-16 text-texto">
        {mensagem}
      </p>

      <button
        type="button"
        onClick={dispensar}
        aria-label="Fechar aviso de dados de reserva"
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-h3 font-bold text-texto hover:bg-fundo-suave focus:outline-none focus-visible:ring-2 focus-visible:ring-primaria-600 focus-visible:ring-offset-2"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  )
}