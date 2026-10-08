import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router'
import ErrorMessage from './ErrorMessage'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  temErro: boolean
}

// Captura erros inesperados de renderização dentro das páginas.
// O cabeçalho, o rodapé e a navegação ficam fora deste limite,
// por isso continuam funcionando mesmo quando uma página falha.
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { temErro: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { temErro: true }
  }

  componentDidCatch(erro: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', erro, info.componentStack)
    }
  }

  tentarNovamente = () => {
    this.setState({ temErro: false })
  }

  render() {
    if (!this.state.temErro) {
      return this.props.children
    }

    return (
      <section
        aria-labelledby="erro-inesperado-titulo"
        className="mx-auto w-full max-w-3xl p-6"
      >
        <h1
          id="erro-inesperado-titulo"
          className="mb-4 font-display text-h1 font-bold text-texto"
        >
          Algo deu errado nesta página
        </h1>

        <ErrorMessage
          title="Conteúdo indisponível"
          message="Não foi possível exibir este conteúdo agora. Você pode tentar novamente ou continuar navegando pelo menu."
          onRetry={this.tentarNovamente}
          focusOnMount
        />

        <Link
          to="/"
          onClick={this.tentarNovamente}
          className="mt-6 inline-flex min-h-12 items-center font-corpo text-corpo-16 font-semibold text-primaria-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primaria-600"
        >
          Voltar para a página inicial
        </Link>
      </section>
    )
  }
}
