import { useId, useState } from 'react'
import { Link } from 'react-router'
import LocalCard from '../../components/LocalCard/LocalCard'
import { listaLocais } from '../../data/locais'

export default function Inicio() {
  const [termoBusca, setTermoBusca] = useState('')
  const [buscaAtiva, setBuscaAtiva] = useState('')
  const searchInputId = useId()

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault()
    setBuscaAtiva(termoBusca.trim())
  }

  const handleLimparBusca = () => {
    setTermoBusca('')
    setBuscaAtiva('')
  }

  const locaisDestaque = listaLocais.slice(0, 3)

  const locaisFiltrados = buscaAtiva
    ? listaLocais.filter((local) => {
        const termo = buscaAtiva.toLowerCase()
        const matchNome = local.nome.toLowerCase().includes(termo)
        const matchEndereco = local.endereco.toLowerCase().includes(termo)
        return matchNome || matchEndereco
      })
    : locaisDestaque

  return (
    <div className="w-full bg-fundo text-texto font-corpo">
      <section className="w-full bg-fundo-escuro text-fundo">
        <div className="max-w-[1440px] min-h-[492px] mx-auto px-4 md:px-16 py-12 md:py-[88px] flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-h1 md:text-display font-bold leading-tight text-fundo">
              Saber antes <br className="hidden sm:inline" />
              de sair de casa.
            </h1>
            <p className="text-corpo-16 md:text-corpo-18 text-fundo-suave max-w-2xl">
              Entrada, circulação, banheiro e atendimento — verificados, não presumidos.
            </p>
          </div>

          <form onSubmit={handleBuscar} className="w-full max-w-xl flex flex-col gap-2">
            <label
              htmlFor={searchInputId}
              className="text-label text-fundo-suave font-medium"
            >
              Buscar local ou endereço
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-secundaria"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
                <input
                  id={searchInputId}
                  type="search"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  placeholder="Ex.: biblioteca, parque, restaurante..."
                  className="w-full h-12 pl-10 pr-4 rounded-lg bg-fundo text-texto text-corpo-16 border border-borda-funcional focus:outline-none focus:ring-2 focus:ring-primaria-600"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto h-12 px-6 bg-fundo text-fundo-escuro font-display font-bold text-botao rounded-lg hover:bg-fundo-suave transition-colors cursor-pointer shrink-0"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto py-10 px-4 md:px-16 lg:py-14">
        <header className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-h2 font-bold text-texto">
            {buscaAtiva ? 'Resultados da busca' : 'Locais em destaque'}
          </h2>
          {buscaAtiva && (
            <button
              type="button"
              onClick={handleLimparBusca}
              className="text-label text-primaria-600 hover:underline cursor-pointer"
            >
              Voltar aos destaques
            </button>
          )}
        </header>

        {locaisFiltrados.length === 0 ? (
          <div className="max-w-md mx-auto p-6 bg-fundo-suave rounded-xl border border-borda-decorativa text-center flex flex-col items-center gap-4">
            <h3 className="font-display text-h3 font-bold text-texto">
              Nenhum local encontrado
            </h3>
            <p className="text-corpo-14 text-secundaria">
              Não encontramos locais com esse termo. Tente buscar pelo bairro ou pelo nome do local.
            </p>
            <button
              type="button"
              onClick={handleLimparBusca}
              className="mt-2 px-6 py-2.5 border-2 border-primaria-600 text-primaria-600 font-display font-semibold text-botao rounded-lg hover:bg-primaria-600 hover:text-fundo transition-colors cursor-pointer"
            >
              Limpar busca
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locaisFiltrados.map((local) => (
              <LocalCard key={local.id} local={local} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-fundo-suave border-t border-borda-decorativa py-12 px-4 md:px-16 lg:py-16">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-8">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
            <h2 className="font-display text-h2 font-bold text-texto">
              Como você pode participar
            </h2>
            <p className="text-corpo-16 text-secundaria">
              Conheça os fluxos do portal para consultar ou registrar novos espaços acessíveis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-fundo p-6 rounded-xl border border-borda-decorativa flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-h3 font-bold text-texto">
                  Explorar catálogo
                </h3>
                <p className="text-corpo-14 text-secundaria">
                  Acesse a lista completa de locais mapeados e filtre por recursos específicos de acessibilidade.
                </p>
              </div>
              <Link
                to="/locais"
                className="inline-flex justify-center items-center py-2.5 px-4 bg-primaria-600 text-fundo font-display font-semibold text-botao rounded-lg hover:bg-primaria-700 transition-colors"
              >
                Ver todos os locais
              </Link>
            </div>

            <div className="bg-fundo p-6 rounded-xl border border-borda-decorativa flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-h3 font-bold text-texto">
                  Indicar um espaço
                </h3>
                <p className="text-corpo-14 text-secundaria">
                  Conhece um estabelecimento ou espaço público acessível? Envie os dados para nossa equipe verificar.
                </p>
              </div>
              <Link
                to="/cadastrar"
                className="inline-flex justify-center items-center py-2.5 px-4 border-2 border-primaria-600 text-primaria-600 font-display font-semibold text-botao rounded-lg hover:bg-primaria-600 hover:text-fundo transition-colors"
              >
                Cadastrar local
              </Link>
            </div>

            <div className="bg-fundo p-6 rounded-xl border border-borda-decorativa flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-h3 font-bold text-texto">
                  Critérios do projeto
                </h3>
                <p className="text-corpo-14 text-secundaria">
                  Entenda como as verificações são feitas e quem são os responsáveis pela iniciativa.
                </p>
              </div>
              <Link
                to="/sobre"
                className="inline-flex justify-center items-center py-2.5 px-4 border-2 border-borda-funcional text-texto font-display font-semibold text-botao rounded-lg hover:bg-borda-decorativa transition-colors"
              >
                Sobre o projeto
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}