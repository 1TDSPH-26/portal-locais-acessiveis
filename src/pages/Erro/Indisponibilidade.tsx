
import { Link } from 'react-router'

export default function Indisponibilidade() {
  function tentarRecarregar() {
    window.location.reload()
  }

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
      {/* Ícone acessível */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width="80"
        height="80"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="mb-6 text-erro"
      >
        <circle cx="32" cy="32" r="27" />
        <path d="M32 18v17" />
        <circle cx="32" cy="44" r="1" fill="currentColor" />
      </svg>

      <p className="mb-2 font-corpo text-corpo-16 text-secundaria">
        Erro 500
      </p>

      <h1 className="mb-4 max-w-2xl font-display text-h3 font-bold text-texto">
        Serviço temporariamente indisponível
      </h1>

      <p className="mb-8 max-w-xl font-corpo text-corpo-16 text-texto">
        O portal está passando por uma instabilidade ou manutenção
        temporária. Pedimos desculpas pelo transtorno. Tente novamente
        em alguns instantes.
      </p>

      <div className="flex w-full max-w-md flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={tentarRecarregar}
          className="min-h-11 flex-1 rounded-md border-2 border-primaria-600
            bg-primaria-600 px-4 py-3 font-corpo font-bold text-white
            hover:bg-primaria-700
            focus-visible:outline-2 focus-visible:outline-offset-4
            focus-visible:outline-primaria-700"
        >
          Tentar recarregar a página
        </button>

       
      <Link
        to="/"
        className="flex min-h-11 flex-1 items-center justify-center
        rounded-md border-2 border-funcional px-4 py-3
        font-corpo font-bold text-texto
        hover:bg-fundo-suave
        focus-visible:outline-2 focus-visible:outline-offset-4
        focus-visible:outline-primaria-700">
  Voltar para a página inicial
</Link>

      </div>
    </main>
  )
}
