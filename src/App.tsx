import MainLayout from './layouts/MainLayout/MainLayout'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <>
      <div className="text-3xl font-bold text-blue-600 p-4">
        Seja bem-vindo
      </div>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </>
  )
}