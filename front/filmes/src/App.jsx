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

import ValidacaoFilmes from './pages/admin/ValidacaoFilmes'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rotas Públicas */}
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        
        {/* Rota Inteligente: Decide qual Home mostrar */}
        <Route path='/Home' element={<HomeManager />} />

        {/* Rotas Compartilhadas (Admin e User acessam, mas a UI muda um pouco dentro delas) */}
        <Route path='/AllFilmes' element={<AllFilmes />} />
        <Route path='/AddFilme' element={<AddFilme />} />
        <Route path='/SeeFilmes/:id' element={<SeeFilme />} /> 
        <Route path='/EditarFilme/:id' element={<EditarFilme />} />

        {/* Rotas Exclusivas de Admin */}
        <Route path='/admin/validacao' element={<ValidacaoFilmes />} />      </Routes>
    </AuthProvider>
  )
}

export default App;