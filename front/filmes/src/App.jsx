import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'
import Home from './pages/Home'
import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login />}/>

        <Route path='/Home' element={<Home />} />
      </Routes>
      
    </>
  )
}

export default App
