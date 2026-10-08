import type { ReactNode } from 'react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'

type MainLayoutProps = {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-fundo text-texto">
      <Header />

      <main id="conteudo-principal" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>

      <Footer />
    </div>
  )
}