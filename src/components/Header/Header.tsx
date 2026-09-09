import { NavLink } from 'react-router-dom'

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
  return (
    <header>
      <h1>Portal de Locais Acessíveis</h1>

      <nav aria-label="Navegação principal">
        <ul
          style={{
            display: 'flex',
            gap: '1rem',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            flexWrap: 'wrap',
          }}
        >
          {/* Itera sobre cada item do menu e cria um link para ele */}
          {navItems.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                // O NavLink ja sabe a rota q ta ativa, ent só estilizar oque estiver ativo
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