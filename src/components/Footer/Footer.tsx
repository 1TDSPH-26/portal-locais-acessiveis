import { Link } from 'react-router'

export default function Footer() {
  return (
    <footer id="rodape" className="w-full bg-texto text-fundo" role="contentinfo">
      <div className="max-w-[1440px] min-h-[86px] mx-auto px-4 md:px-16 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Identificação da iniciativa */}
        <p className="font-corpo text-corpo-14 text-fundo text-center md:text-left m-0">
          Lugares Acessíveis · Squad 1-A · Turma 1TDSPH-26 · FIAP
        </p>

        {/* Links institucionais / acessibilidade */}
        <nav aria-label="Navegação do rodapé">
          <ul className="flex flex-wrap items-center justify-center gap-6 list-none m-0 p-0 text-corpo-14 text-fundo">
            <li>
              <Link to="/sobre" className="hover:underline transition-all">
                Acessibilidade
              </Link>
            </li>
            <li aria-hidden="true" className="text-secundaria select-none">·</li>
            <li>
              <Link to="/sobre" className="hover:underline transition-all">
                Privacidade
              </Link>
            </li>
            <li aria-hidden="true" className="text-secundaria select-none">·</li>
            <li>
              <Link to="/sobre" className="hover:underline transition-all">
                Contato
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
