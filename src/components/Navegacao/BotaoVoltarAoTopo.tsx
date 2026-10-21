import { useEffect, useRef, useState } from 'react'

const LIMITE_ROLAGEM_PX = 300
const TEMPO_MAXIMO_ROLAGEM_MS = 2000

const foco =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700'

function prefereMovimentoReduzido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/*
 * Leva o foco do teclado para o topo da página:
 * primeiro o título principal (h1) e,
 * se não houver, o container #conteudo-principal.
 */
function moverFocoParaOTopo() {
  const alvo =
    document.querySelector<HTMLElement>('h1[tabindex="-1"]') ??
    document.getElementById('conteudo-principal')

  alvo?.focus({ preventScroll: true })
}

export default function BotaoVoltarAoTopo() {
  const [visivel, setVisivel] = useState(false)

  const botaoRef = useRef<HTMLButtonElement>(null)
  const quadroRef = useRef<number | null>(null)

  useEffect(() => {
    const atualizar = () => {
      setVisivel(window.scrollY > LIMITE_ROLAGEM_PX)

      /*
       * Quando o rodapé entra na tela, o botão sobe o mesmo
       * tanto para nunca ficar por cima dele.
       */
      const botao = botaoRef.current
      const rodape = document.getElementById('rodape')

      if (botao && rodape) {
        const sobreposicao = Math.max(
          0,
          window.innerHeight - rodape.getBoundingClientRect().top,
        )

        botao.style.setProperty(
          '--sobreposicao',
          `${Math.round(sobreposicao)}px`,
        )
      }
    }

    atualizar()

    window.addEventListener('scroll', atualizar, { passive: true })
    window.addEventListener('resize', atualizar)

    return () => {
      window.removeEventListener('scroll', atualizar)
      window.removeEventListener('resize', atualizar)

      if (quadroRef.current !== null) {
        window.cancelAnimationFrame(quadroRef.current)
      }
    }
  }, [])

  const voltarAoTopo = () => {
    if (quadroRef.current !== null) {
      window.cancelAnimationFrame(quadroRef.current)
    }

    window.scrollTo({
      top: 0,
      behavior: prefereMovimentoReduzido() ? 'auto' : 'smooth',
    })

    /*
     * Espera a rolagem terminar (ou o tempo máximo)
     * para só então mover o foco.
     */
    const inicio = window.performance.now()

    const aguardarFimDaRolagem = () => {
      const terminou = window.scrollY <= 0
      const estourouTempo =
        window.performance.now() - inicio > TEMPO_MAXIMO_ROLAGEM_MS

      if (terminou || estourouTempo) {
        quadroRef.current = null
        moverFocoParaOTopo()
        return
      }

      quadroRef.current = window.requestAnimationFrame(aguardarFimDaRolagem)
    }

    quadroRef.current = window.requestAnimationFrame(aguardarFimDaRolagem)
  }

  return (
    <button
      ref={botaoRef}
      type="button"
      aria-label="Voltar ao topo da página"
      onClick={voltarAoTopo}
      className={[
        'fixed right-4 z-40 flex h-12 w-12 items-center justify-center',
        'bottom-[calc(1rem_+_var(--sobreposicao,0px))] sm:right-6',
        'rounded-full border-2 border-white bg-blue-700 text-white shadow-lg',
        'hover:bg-blue-800',
        'transition-[opacity,transform,visibility] duration-200',
        'motion-reduce:transition-none',
        foco,
        visivel
          ? 'visible translate-y-0 opacity-100'
          : 'invisible translate-y-2 opacity-0',
      ].join(' ')}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}
