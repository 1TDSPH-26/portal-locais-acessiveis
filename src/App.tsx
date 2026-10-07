import { useLocation } from 'react-router'
import ErrorBoundary from './components/Feedback/ErrorBoundary'
import MainLayout from './layouts/MainLayout/MainLayout'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  const { pathname } = useLocation()

  return (
    <MainLayout>
      {/* key reinicia o limite de erro ao trocar de rota pelo menu */}
      <ErrorBoundary key={pathname}>
        <AppRoutes />
      </ErrorBoundary>
    </MainLayout>
  )
}
