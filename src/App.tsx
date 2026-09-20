import MainLayout from './layouts/MainLayout/MainLayout'
import AppRoutes from './routes/AppRoutes'
import { TextPlusControl } from './components/AcessibilityControls/TextPlusControl';
import { TextMinusControl } from './components/AcessibilityControls/TextMinusControl';
import { ContrastControl } from './components/AcessibilityControls/ContratControl';
import "./components/AcessibilityControls/accessibility.css";
export default function App() {
  return (
    <>
      <div className="text-3xl font-bold text-blue-600 p-4">
        Seja bem-vindo
      </div>
      <div>
  <nav
    atkinson-hyperlegible="Acessibilidade"
    style={{
      display: "flex",
      gap: "10px",
    }}
  >
    <TextPlusControl />
    <TextMinusControl />
    <ContrastControl />
  </nav>
</div>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </>
  )
}