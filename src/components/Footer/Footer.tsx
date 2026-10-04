import { NavLink } from 'react-router'

export default function Footer() {
  return (
    <footer>
      <nav aria-label="Navegação do rodapé">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/locais">Locais</NavLink>
        <NavLink to="/cadastrar">Cadastro</NavLink>
        <NavLink to="/sobre">Sobre</NavLink>
      </nav>
    </footer>
  )
}
