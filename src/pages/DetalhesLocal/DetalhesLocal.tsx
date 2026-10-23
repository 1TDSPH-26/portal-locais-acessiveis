import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router'
import ErrorMessage from '../../components/Feedback/ErrorMessage'
import LoadingState from '../../components/Feedback/LoadingState'
import { useConsulta } from '../../hooks/useConsulta'
import { buscarLocalPorId } from '../../services/locais-consulta'
import type { Categoria, RecursoAcessibilidade } from '../../types/local'
import usePageTitle from '../../hooks/usePageTitle'

const nomesCategoria: Record<Categoria, string> = {
  restaurante: 'Restaurante',
  saude: 'Saúde',
  educacao: 'Educação',
  lazer: 'Lazer',
  servico_publico: 'Serviço público',
}

const nomesRecurso: Record<RecursoAcessibilidade, string> = {
  rampa_acesso: 'Rampa de acesso',
  banheiro_adaptado: 'Banheiro adaptado',
  piso_tatil: 'Piso tátil',
  sinalizacao_visual: 'Sinalização visual',
  vagas_estacionamento: 'Vagas de estacionamento',
  braile: 'Informações em braile',
  libras: 'Atendimento em Libras',
  elevador: 'Elevador',
  balcao_acessivel: 'Balcão acessível',
  assentos_prioritarios: 'Assentos prioritários',
  espaco_tranquilo: 'Espaço tranquilo',
  cao_guia: 'Entrada permitida com cão-guia',
}

const classeLinkBreadcrumb = [
  'inline-flex min-h-12 items-center font-corpo text-corpo-16 font-semibold',
  'text-primaria-700 underline underline-offset-4',
  'focus-visible:outline-2 focus-visible:outline-offset-4',
  'focus-visible:outline-primaria-600',
].join(' ')

function BreadcrumbDetalhe({ paginaAtual }: { paginaAtual: string }) {
  return (
    <nav aria-label="Caminho de navegação">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-corpo text-corpo-16 text-texto">
        <li>
          <Link to="/" className={classeLinkBreadcrumb}>
            Início
          </Link>
        </li>

        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="shrink-0">
            /
          </span>
          <Link to="/locais" className={classeLinkBreadcrumb}>
            Locais
          </Link>
        </li>

        <li
          aria-current="page"
          className="flex min-w-0 max-w-full w-full items-baseline gap-2 sm:w-auto"
        >
          <span aria-hidden="true" className="hidden shrink-0 sm:inline">
            /
          </span>
          <span className="min-w-0 wrap-anywhere">
            {paginaAtual}
          </span>
        </li>
      </ol>
    </nav>
  )
}

export default function DetalhesLocal() {
  usePageTitle('Detalhes do Local')
  const { id = '' } = useParams()
  const consultarLocal = useCallback(() => buscarLocalPorId(id), [id])
  const { estado, retentando, tentarNovamente } = useConsulta(consultarLocal)
  const [mensagemCopia, setMensagemCopia] = useState<string | null>(null)

  const handleCompartilhar = async (nomeLocal: string, enderecoLocal: string) => {
    const urlAtual = window.location.href
    const titulo = `Local acessível: ${nomeLocal}`
    const texto = `Confira os detalhes de acessibilidade de ${nomeLocal} (${enderecoLocal}):`

    if (navigator.share) {
      try {
        await navigator.share({
          title: titulo,
          text: texto,
          url: urlAtual,
        })
      } catch (error) {
        // Se o usuário cancelar o compartilhamento nativo, não tratamos como erro crítico
        if ((error as Error).name !== 'AbortError') {
          console.error('Erro ao compartilhar:', error)
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(urlAtual)
        setMensagemCopia('Link copiado para a área de transferência!')
        setTimeout(() => setMensagemCopia(null), 3000)
      } catch (error) {
        console.error('Erro ao copiar URL:', error)
      }
    }
  }

  if (estado.status === 'carregando') {
    return (
      <section aria-label="Detalhes do local" className="mx-auto w-full max-w-3xl px-4 py-6 sm:p-6">
        <BreadcrumbDetalhe paginaAtual="Detalhes do local" />
        <LoadingState message="Carregando detalhes do local..." />
      </section>
    )
  }

  if (estado.status === 'erro') {
    return (
      <section
        aria-labelledby="detalhe-erro"
        className="mx-auto w-full max-w-3xl px-4 py-6 sm:p-6"
      >
        <BreadcrumbDetalhe paginaAtual="Detalhes do local" />
        <h1
          id="detalhe-erro"
          className="mt-4 mb-4 font-display text-h1 font-bold text-texto"
        >
          Detalhes do local
        </h1>
        <ErrorMessage
          title="Não foi possível carregar este local"
          message={estado.mensagem}
          onRetry={tentarNovamente}
          retrying={retentando}
        />
      </section>
    )
  }

  const local = estado.dados

  if (!local) {
    return (
      <section
        aria-labelledby="detalhe-nao-encontrado"
        className="mx-auto w-full max-w-3xl px-4 py-6 sm:p-6"
      >
        <BreadcrumbDetalhe paginaAtual="Local não encontrado" />
        <h1
          id="detalhe-nao-encontrado"
          className="mt-4 font-display text-h1 font-bold text-texto"
        >
          Local não encontrado
        </h1>
        <p className="mt-3 font-corpo text-corpo-16 text-texto">
          Não encontramos nenhum local com o identificador informado. Volte para
          a listagem e escolha um dos locais disponíveis.
        </p>
      </section>
    )
  }

  return (
    <article
      aria-labelledby="detalhe-titulo"
      className="mx-auto w-full max-w-3xl px-4 py-6 sm:p-6"
    >
      <BreadcrumbDetalhe paginaAtual={local.nome} />

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1
          id="detalhe-titulo"
          className="font-display text-h1 font-bold text-texto wrap-anywhere"
        >
          {local.nome}
        </h1>

        <button
          type="button"
          onClick={() => handleCompartilhar(local.nome, local.endereco)}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg bg-primaria-600 px-4 py-2 font-corpo text-corpo-16 font-semibold text-white transition-colors hover:bg-primaria-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primaria-600"
          aria-label={`Compartilhar informações de ${local.nome}`}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Compartilhar local
        </button>
      </div>

      {mensagemCopia && (
        <div
          role="status"
          aria-live="polite"
          className="mt-3 rounded-md bg-emerald-50 p-3 font-corpo text-corpo-14 text-emerald-800 border border-emerald-200"
        >
          {mensagemCopia}
        </div>
      )}

      <dl className="mt-6 grid gap-4 rounded-lg border border-borda-decorativa p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <dt className="font-corpo text-legenda text-secundaria">Endereço</dt>
          <dd className="mt-1 font-corpo text-corpo-16 text-texto wrap-anywhere">
            {local.endereco}
          </dd>
        </div>
        <div>
          <dt className="font-corpo text-legenda text-secundaria">CEP</dt>
          <dd className="mt-1 font-corpo text-corpo-16 text-texto">
            {local.cep}
          </dd>
        </div>
        <div>
          <dt className="font-corpo text-legenda text-secundaria">Categoria</dt>
          <dd className="mt-1 font-corpo text-corpo-16 text-texto">
            {nomesCategoria[local.categoria]}
          </dd>
        </div>
      </dl>

      <section aria-labelledby="detalhe-recursos" className="mt-8">
        <h2
          id="detalhe-recursos"
          className="font-display text-h2 font-bold text-texto"
        >
          Recursos de acessibilidade
        </h2>
        <ul className="mt-4 list-disc pl-6 font-corpo text-corpo-16 text-texto wrap-anywhere">
          {local.recursosAcessibilidade.map((recurso) => (
            <li key={recurso}>{nomesRecurso[recurso]}</li>
          ))}
        </ul>
      </section>

      <p className="mt-8 font-corpo text-corpo-14 text-secundaria">
        Dados de demonstração. As informações não substituem uma avaliação
        técnica de acessibilidade.
      </p>
    </article>
  )
}