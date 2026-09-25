import { Route, Routes } from 'react-router'
import Cadastro from '../pages/Cadastro/Cadastro'
import Inicio from '../pages/Inicio/Inicio'
import Locais from '../pages/Locais/Locais'
import Sobre from '../pages/Sobre/Sobre'
import NotFound from '../pages/NotFound/NotFound'
import Acessibilidade from '../pages/Acessibilidade/Acessibilidade'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/locais" element={<Locais />} />
      <Route path="/cadastrar" element={<Cadastro />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/acessibilidade" element={<Acessibilidade />} />
      <Route path="/*" element={<NotFound/>}/>
    </Routes>
  )
}
