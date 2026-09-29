import type { ReactNode } from 'react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'

type MainLayoutProps = {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column',}}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:outline-2 focus:outline-offset-2">
        Pular para o conteúdo principal
      </a>

      <Header />

      <main id="main-content" tabIndex={-1} style={{ flex: 1 }}>
        {children}
      </main>

      <Footer />
    </div>
  )
}