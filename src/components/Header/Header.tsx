import { useEffect, useRef, useState } from 'react'
import { NavLink, Link } from 'react-router'
import FontDecreaseButton from '../AcessibilityControls/FontDecreaseButton'
import FontIncreaseButton from '../AcessibilityControls/FontIncreaseButton'
import ContrastButton from '../AcessibilityControls/ContrastButton'
import { lerIdsFavoritos, observarFavoritos } from '../../utils/favoritos'
// Cada item daqui vira um link no menu
// O "end" é usado quando queremos q a rota seja exata (ex: "/")

type NavItem = {
  to: string
  label: string
  end?: boolean
}

const navItems: NavItem[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/locais', label: 'Locais' },
  { to: '/favoritos', label: 'Favoritos' },
  { to: '/cadastrar', label: 'Cadastro' },
  { to: '/sobre', label: 'Sobre' },
]

const classeBadgeFavoritos =
  'inline-flex min-w-6 shrink-0 items-center justify-center rounded-full bg-primaria-600 px-2 py-0.5 text-label font-bold text-fundo'

function descreverFavoritos(quantidade: number) {
  return `Favoritos, ${quantidade} ${quantidade === 1 ? 'local salvo' : 'locais salvos'}`
}

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false)
  const [quantidadeFavoritos, setQuantidadeFavoritos] = useState(
    () => lerIdsFavoritos().length,
  )
  const [anuncioFavoritos, setAnuncioFavoritos] = useState('')
  const ultimaQuantidade = useRef(quantidadeFavoritos)

  useEffect(() => {
    const atualizar = (anunciar = true) => {
      const quantidade = lerIdsFavoritos().length
      if (quantidade === ultimaQuantidade.current) return

      ultimaQuantidade.current = quantidade
      setQuantidadeFavoritos(quantidade)
      if (anunciar) setAnuncioFavoritos(descreverFavoritos(quantidade))
    }

    const cancelar = observarFavoritos(() => atualizar())
    atualizar(false)
    return cancelar
  }, [])
  
  const botaoMenuRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuAberto) return

    const fecharComEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuAberto(false)
        botaoMenuRef.current?.focus()
      }
    }

    document.addEventListener('keydown', fecharComEscape)

    return () => {
      document.removeEventListener('keydown', fecharComEscape)
    }
  }, [menuAberto])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuAberto(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <header className="w-full bg-fundo" role="banner">
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {anuncioFavoritos}
      </p>
      {/* Faixa de acesso rápido */}
      <div className="w-full bg-fundo border-b border-borda-decorativa">
        <div className="max-w-[1440px] h-16 mx-auto px-4 md:px-16 py-2 flex items-center justify-between">
          <a 
            href="#conteudo-principal" 
            className="inline-flex items-center px-4 py-2 bg-fundo-suave text-primaria-700 font-display font-semibold text-label rounded-lg hover:bg-primaria-600 hover:text-fundo transition-colors focus:ring-2 focus:ring-primaria-600"
          >
            Pular para o conteúdo principal
          </a>
          <div className="hidden sm:flex items-center gap-4 text-label text-secundaria">
          <a href="#menu-principal" className="hover:text-texto transition-colors">
             Menu [1]
          </a>

          <a href="#rodape" className="hover:text-texto transition-colors">
            Rodapé [2]
          </a>

          <div className="flex items-center gap-2" role="group" aria-label="Controles de acessibilidade">
               <FontDecreaseButton />
              <FontIncreaseButton />
            <ContrastButton />
          </div>
        </div>
      </div>
    </div>
      {/* Menu principal */}
      <div className="w-full bg-fundo border-b border-borda-decorativa">
        <div className="max-w-[1440px] min-h-[88px] mx-auto px-4 md:px-6 lg:px-16 py-5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo / Marca */}
          <Link to="/" className="text-primaria-600 font-display font-bold text-h2 hover:opacity-90 transition-opacity">
            Lugares Acessíveis
          </Link>

          {/* Navegação Desktop */}
          <nav id="menu-principal" aria-label="Navegação principal" className="hidden md:block">
            <ul className="flex flex-wrap items-center gap-3 lg:gap-8 list-none m-0 p-0">
              {navItems.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink 
                    to={to} 
                    end={end} 
                    aria-label={to === '/favoritos' ? descreverFavoritos(quantidadeFavoritos) : undefined}
                    className={({ isActive }) => `inline-flex items-center gap-2 font-corpo text-corpo-16 transition-colors pb-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primaria-600 ${
                      isActive ? 'text-primaria-600 font-bold border-b-2 border-primaria-600' : 'text-secundaria hover:text-texto font-medium'
                    }`}
                  >
                    {label}
                    {to === '/favoritos' && (
                      <span aria-hidden="true" className={classeBadgeFavoritos}>
                        {quantidadeFavoritos}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Botão Hambúrguer Mobile */}
          <button
            ref={botaoMenuRef}
            type="button"
            onClick={() => setMenuAberto(!menuAberto)}
            className="md:hidden p-2 rounded-lg border border-borda-decorativa text-texto hover:bg-fundo-suave focus:outline-none focus:ring-2 focus:ring-primaria-600 cursor-pointer"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
            aria-controls="menu-mobile"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {menuAberto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Retrátil Mobile */}
        {menuAberto && (
          <nav id="menu-mobile" aria-label="Navegação móvel" className="md:hidden px-4 pb-4 bg-fundo border-t border-borda-decorativa">
            <ul className="flex flex-col gap-3 list-none m-0 pt-3 p-0">
              {navItems.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink 
                    to={to} 
                    end={end} 
                    onClick={() => setMenuAberto(false)} 
                    aria-label={to === '/favoritos' ? descreverFavoritos(quantidadeFavoritos) : undefined}
                    className={({ isActive }) => `flex items-center gap-2 py-2 px-3 rounded-lg font-corpo text-corpo-16 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaria-600 ${
                      isActive ? 'bg-fundo-suave text-primaria-600 font-bold' : 'text-texto hover:bg-fundo-suave'
                    }`}
                  >
                    {label}
                    {to === '/favoritos' && (
                      <span aria-hidden="true" className={classeBadgeFavoritos}>
                        {quantidadeFavoritos}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}


