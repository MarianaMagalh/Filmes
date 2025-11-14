import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login'
import Home from './pages/Home'
import AddFilme from './pages/AddFilme'
import AllFilmes from './pages/AllFilmes'
import SeeFilme from './pages/SeeFilme'

import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login />}/>

        <Route path='/Home' element={<Home />} />

        <Route path='/AllFilmes' element={<AllFilmes />} />

        <Route path='/AddFilmes' element={<AddFilme />} />

        <Route path='/SeeFilmes' element={<SeeFilme />} />
      </Routes>
      
    </>
  )
}

export default App
