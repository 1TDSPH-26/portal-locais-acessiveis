import type { ReactNode } from 'react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'

type MainLayoutProps = {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />

      <main style={{ flex: 1 }}>
        {children}
      </main>

      <Footer />
    </div>
  )
}