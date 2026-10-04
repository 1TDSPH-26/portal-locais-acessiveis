import { NavLink } from 'react-router'
import { useEffect, useState } from 'react'

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
  { to: '/cadastrar', label: 'Cadastro' },
  { to: '/sobre', label: 'Sobre' },
]

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false)

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
    <header className="relative flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-xl font-bold">
        Portal de Locais Acessíveis
      </h1>

      <button
        type="button"
        className="rounded p-2 focus-visible:outline-2 focus-visible:outline-offset-2 md:hidden"
        onClick={() => setMenuAberto((aberto) => !aberto)}
        aria-expanded={menuAberto}
        aria-controls="menu-mobile"
        aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
      >
        <span aria-hidden="true">
          {menuAberto ? '✕' : '☰'}
        </span>
      </button>

      <nav
        className="w-full md:w-auto"
        aria-label="Navegação principal"
      >
        <ul
          id="menu-mobile"
          className={`
            ${menuAberto ? 'flex' : 'hidden'}
            absolute left-0 top-full z-50 w-full flex-col gap-2
            bg-white p-4 shadow-md
            md:static md:flex md:w-auto md:flex-row
            md:items-center md:gap-2 md:bg-transparent
            md:p-0 md:shadow-none
          `}
        >
          {navItems.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={() => setMenuAberto(false)}
                className={({ isActive }) => `
                  inline-block rounded px-3 py-2
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  ${isActive
                    ? 'border-b-[3px] border-current font-bold'
                    : 'border-b-[3px] border-transparent'
                  }
                `}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}


