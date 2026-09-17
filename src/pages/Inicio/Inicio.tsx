import { useState, useId, type JSX } from 'react'
import { Link } from 'react-router'

interface RecursoAcessibilidade {
  descricao: string
  tipo: 'entrada' | 'elevador' | 'piso-tatil' | 'trilha' | 'estacionamento' | 'banheiro' | 'rampa' | 'libras'
}

interface LocalDestaque {
  id: string
  nome: string
  localizacao: string
  recursos: RecursoAcessibilidade[]
  verificacao: string
}

const LOCAIS_INICIAIS: LocalDestaque[] = [
  {
    id: 'biblioteca-municipal',
    nome: 'Biblioteca Municipal',
    localizacao: 'Centro · São Paulo, SP',
    recursos: [
      { descricao: 'Entrada sem degrau', tipo: 'entrada' },
      { descricao: 'Elevador até todos os andares', tipo: 'elevador' },
      { descricao: 'Piso tátil na circulação', tipo: 'piso-tatil' },
    ],
    verificacao: 'Verificado em agosto de 2026',
  },
  {
    id: 'parque-das-nascentes',
    nome: 'Parque das Nascentes',
    localizacao: 'Zona Sul · São Paulo, SP',
    recursos: [
      { descricao: 'Trilha com piso firme', tipo: 'trilha' },
      { descricao: 'Estacionamento reservado', tipo: 'estacionamento' },
      { descricao: 'Banheiro adaptado', tipo: 'banheiro' },
    ],
    verificacao: 'Verificado em agosto de 2026',
  },
  {
    id: 'centro-cultural-leste',
    nome: 'Centro Cultural Leste',
    localizacao: 'Zona Leste · São Paulo, SP',
    recursos: [
      { descricao: 'Rampa na entrada principal', tipo: 'rampa' },
      { descricao: 'Intérprete de Libras aos sábados', tipo: 'libras' },
      { descricao: 'Elevador para o auditório', tipo: 'elevador' },
    ],
    verificacao: 'Verificado em agosto de 2026',
  },
]

function IconeAcessibilidade({ tipo }: { tipo: RecursoAcessibilidade['tipo'] }): JSX.Element {
  switch (tipo) {
    case 'entrada':
    case 'rampa':
      return (
        <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="12" cy="4" r="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11l-3-2-3 2v6m6-3l-3-1" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16" />
        </svg>
      )
    case 'elevador':
      return (
        <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <rect x="4" y="3" width="16" height="18" rx="2" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v10m-3-7l3-3 3 3m-6 4l3 3 3-3" />
        </svg>
      )
    case 'piso-tatil':
      return (
        <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 12h16M4 16h16" />
          <circle cx="8" cy="8" r="1" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="16" cy="16" r="1" fill="currentColor" />
        </svg>
      )
    case 'trilha':
      return (
        <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L4 14h5v7h6v-7h5L12 3z" />
        </svg>
      )
    case 'estacionamento':
      return (
        <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 8h3a2.5 2.5 0 010 5h-3v4" />
        </svg>
      )
    case 'banheiro':
      return (
        <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="9" cy="5" r="1.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 8h2l1 6H7l1-6zm7-3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm-1 3h2l1.5 6h-5L14 8z" />
        </svg>
      )
    case 'libras':
      return (
        <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5a1.5 1.5 0 113 0m-3 0a1.5 1.5 0 10-3 0V14m3-2.5V8a1.5 1.5 0 113 0v4.5m0-4.5a1.5 1.5 0 113 0v6a4.5 4.5 0 01-9 0v-2" />
        </svg>
      )
    default:
      return (
        <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )
  }
}

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

  const locaisFiltrados = LOCAIS_INICIAIS.filter((local) => {
    if (!buscaAtiva) return true
    const termo = buscaAtiva.toLowerCase()
    const matchNome = local.nome.toLowerCase().includes(termo)
    const matchLocal = local.localizacao.toLowerCase().includes(termo)
    const matchRecursos = local.recursos.some((r) =>
      r.descricao.toLowerCase().includes(termo)
    )
    return matchNome || matchLocal || matchRecursos
  })

  return (
    <div className="w-full bg-fundo text-texto font-corpo">
      {/* Seção Hero: width 1440, min-height 492, padding 88px 64px, gap 24px, background #312E81 */}
      <section className="w-full bg-[#312E81] text-fundo">
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
                className="w-full sm:w-auto h-12 px-6 bg-fundo text-[#312E81] font-display font-bold text-botao rounded-lg hover:bg-fundo-suave transition-colors cursor-pointer shrink-0"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Seção de Conteúdo: Destaques ou Resultados da Busca (max-width 1440, padding lateral 64px) */}
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
          /* Estado vazio de busca conforme protótipo do Figma */
          <div className="max-w-md mx-auto p-6 bg-fundo-suave rounded-xl border border-borda-decorativa text-center flex flex-col items-center gap-4">
            <h3 className="font-display text-h3 font-bold text-texto">
              Nenhum local encontrado
            </h3>
            <p className="text-corpo-14 text-secundaria">
              Não encontramos locais com esse termo. Tente buscar pelo bairro, pelo tipo de local, ou por um recurso de acessibilidade como &quot;rampa&quot; ou &quot;piso tátil&quot;.
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
          /* Grid responsivo: 1 coluna no mobile, 2 no tablet e 3 no desktop */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locaisFiltrados.map((local) => (
              <article
                key={local.id}
                className="bg-fundo rounded-xl border border-borda-decorativa p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  <h3 className="font-display text-h3 font-bold text-texto">
                    {local.nome}
                  </h3>
                  <p className="text-corpo-14 text-secundaria mt-1">
                    {local.localizacao}
                  </p>

                  <ul
                    className="mt-4 flex flex-col gap-2.5 text-corpo-14 text-texto"
                    aria-label={`Recursos de acessibilidade de ${local.nome}`}
                  >
                    {local.recursos.map((recurso) => (
                      <li key={recurso.descricao} className="flex items-center gap-2">
                        <span aria-hidden="true" className="text-primaria-600 shrink-0">
                          <IconeAcessibilidade tipo={recurso.tipo} />
                        </span>
                        <span>{recurso.descricao}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-borda-decorativa flex flex-col gap-3">
                  <Link
                    to="/locais"
                    className="w-full text-center py-2.5 px-4 rounded-lg border-2 border-primaria-600 text-primaria-600 font-display font-semibold text-botao hover:bg-primaria-600 hover:text-fundo transition-colors"
                  >
                    Ver detalhes
                  </Link>
                  <p className="text-legenda text-secundaria text-center">
                    {local.verificacao}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Seção de orientações e chamadas para os fluxos principais (max-width 1440, padding lateral 64px) */}
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
