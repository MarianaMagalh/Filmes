import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx' // Importe o Provedor
import './App.css'

import Cadastro from './pages/Cadastro.jsx'
import Login from './pages/Login'

import HomeManager from './components/HomeManager/HomeManager.jsx'

import AddFilme from './pages/user/AddFilme'
import AllFilmes from './pages/user/AllFilmes'
import SeeFilme from './pages/user/SeeFilme'
import EditarFilme from './pages/user/EditarFilme.jsx'

import HomeAdmin from './pages/admin/HomeAdmin.jsx'
import ValidacaoFilmes from './pages/admin/ValidacaoFilmes'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rotas Públicas */}
        <Route path='/' element={<Login />} />
        <Route path='/cadastro' element={<Cadastro />} />

        {/* Rota Inteligente: Decide qual Home mostrar */}
        <Route path='/home' element={<HomeManager />} />

        <Route path='/homeAdmin' element={<HomeAdmin />} />

        {/* Rotas Compartilhadas (Admin e User acessam, mas a UI muda um pouco dentro delas) */}
        <Route path='/allfilmes' element={<AllFilmes />} />
        <Route path='/addfilme' element={<AddFilme />} />
        <Route path='/seefilmes/:id' element={<SeeFilme />} />
        <Route path='/editarFilme/:id' element={<EditarFilme />} />

        {/* Rotas Exclusivas de Admin */}
        <Route path='/validacao' element={<ValidacaoFilmes />} />
      </Routes>
    </AuthProvider>
  )
}

export default App;