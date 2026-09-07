import { Route, Routes } from 'react-router-dom'
import Cadastro from '../pages/Cadastro/Cadastro'
import Home from '../pages/Home/Home'
import Locais from '../pages/Locais/Locais'
import Sobre from '../pages/Sobre/Sobre'
import NotFound from '../pages/NotFound/NotFound'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/locais" element={<Locais />} />
      <Route path="/cadastrar" element={<Cadastro />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/*" element={<NotFound/>}/>
    </Routes>
  )
}
