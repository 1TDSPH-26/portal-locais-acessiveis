import { useCallback } from 'react'
import { Link, useParams } from 'react-router'
import ErrorMessage from '../../components/Feedback/ErrorMessage'
import LoadingState from '../../components/Feedback/LoadingState'
import { useConsulta } from '../../hooks/useConsulta'
import { buscarLocalPorId } from '../../services/locais-consulta'
import type { Categoria, RecursoAcessibilidade } from '../../types/local'

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
          className="flex min-w-0 max-w-full items-baseline gap-2"
        >
          <span aria-hidden="true" className="shrink-0">
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
  const { id = '' } = useParams()
  const consultarLocal = useCallback(() => buscarLocalPorId(id), [id])
  const { estado, tentarNovamente } = useConsulta(consultarLocal)

  if (estado.status === 'carregando') {
    return (
      <section aria-label="Detalhes do local" className="mx-auto w-full max-w-3xl p-6">
        <BreadcrumbDetalhe paginaAtual="Detalhes do local" />
        <LoadingState message="Carregando detalhes do local..." />
      </section>
    )
  }

  if (estado.status === 'erro') {
    return (
      <section
        aria-labelledby="detalhe-erro"
        className="mx-auto w-full max-w-3xl p-6"
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
        />
      </section>
    )
  }

  const local = estado.dados

  if (!local) {
    return (
      <section
        aria-labelledby="detalhe-nao-encontrado"
        className="mx-auto w-full max-w-3xl p-6"
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
      className="mx-auto w-full max-w-3xl p-6"
    >
      <BreadcrumbDetalhe paginaAtual={local.nome} />

      <h1
        id="detalhe-titulo"
        className="mt-4 font-display text-h1 font-bold text-texto"
      >
        {local.nome}
      </h1>

      <dl className="mt-6 grid gap-4 rounded-lg border border-borda-decorativa p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <dt className="font-corpo text-legenda text-secundaria">Endereço</dt>
          <dd className="mt-1 font-corpo text-corpo-16 text-texto">
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
        <ul className="mt-4 list-disc pl-6 font-corpo text-corpo-16 text-texto">
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
