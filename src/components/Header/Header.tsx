import { NavLink } from 'react-router'
import { useEffect, useState } from 'react'
import './Header.css'

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
    <header>
      <h1>Portal de Locais Acessíveis</h1>

      <button
        type="button"
        className="menu-mobile-button"
        onClick={() => setMenuAberto((aberto) => !aberto)}
        aria-expanded={menuAberto}
        aria-controls="menu-mobile"
        aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
      >
        ☰
      </button>

      <nav aria-label="Navegação principal">
        <ul
          id="menu-mobile"
          className={menuAberto ? 'menu-aberto' : ''}
        >
          {navItems.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={() => setMenuAberto(false)}
                style={({ isActive }) => ({
                  display: 'inline-block',
                  padding: '0.5rem 0.75rem',
                  textDecoration: isActive ? 'underline' : 'none',
                  fontWeight: isActive ? 700 : 400,
                  borderBottom: isActive
                    ? '3px solid currentColor'
                    : '3px solid transparent',
                })}
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

