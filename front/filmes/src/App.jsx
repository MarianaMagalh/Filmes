import React from 'react'
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx'; // Importe o Provedor
import './App.css'

import Cadastro from './pages/Cadastro.jsx';
import Login from './pages/Login'

import Home from './pages/user/Home'
import AddFilme from './pages/user/AddFilme'
import AllFilmes from './pages/user/AllFilmes'
import SeeFilme from './pages/user/SeeFilme'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/Cadastro' element={<Cadastro />} />
        
        <Route path='/Home' element={<Home />} />
        <Route path='/AllFilmes' element={<AllFilmes />} />
        <Route path='/AddFilme' element={<AddFilme />} />
        <Route path='/SeeFilmes/:id' element={<SeeFilme />} /> 
      </Routes>
    </AuthProvider>
  )
}

export default App;