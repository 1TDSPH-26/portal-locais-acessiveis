import { useState } from 'react'
import { NavLink, Link } from 'react-router'

type NavItem = {
  to: string
  label: string
  end?: boolean
}

const navItems: NavItem[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/locais', label: 'Locais' },
  { to: '/cadastrar', label: 'Cadastro' },
  { to: '/sobre', label: 'Sobre' },
]

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <header className="w-full bg-fundo" role="banner">
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
          </div>
        </div>
      </div>

      {/* Menu principal */}
      <div className="w-full bg-fundo border-b border-borda-decorativa">
        <div className="max-w-[1440px] h-[88px] mx-auto px-4 md:px-16 py-5 flex items-center justify-between">
          {/* Logo / Marca */}
          <Link
            to="/"
            className="text-primaria-600 font-display font-bold text-h2 hover:opacity-90 transition-opacity"
          >
            Lugares Acessíveis
          </Link>

          {/* Navegação Desktop */}
          <nav id="menu-principal" aria-label="Navegação principal" className="hidden md:block">
            <ul className="flex items-center gap-8 list-none m-0 p-0">
              {navItems.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `font-corpo text-corpo-16 transition-colors pb-1 ${
                        isActive
                          ? 'text-primaria-600 font-bold border-b-2 border-primaria-600'
                          : 'text-secundaria hover:text-texto font-medium'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Botão Hambúrguer Mobile */}
          <button
            type="button"
            onClick={() => setMenuAberto(!menuAberto)}
            className="md:hidden p-2 rounded-lg border border-borda-decorativa text-texto hover:bg-fundo-suave focus:outline-none focus:ring-2 focus:ring-primaria-600 cursor-pointer"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <nav aria-label="Navegação móvel" className="md:hidden px-4 pb-4 bg-fundo border-t border-borda-decorativa">
            <ul className="flex flex-col gap-3 list-none m-0 pt-3 p-0">
              {navItems.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    onClick={() => setMenuAberto(false)}
                    className={({ isActive }) =>
                      `block py-2 px-3 rounded-lg font-corpo text-corpo-16 ${
                        isActive
                          ? 'bg-fundo-suave text-primaria-600 font-bold'
                          : 'text-texto hover:bg-fundo-suave'
                      }`
                    }
                  >
                    {label}
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