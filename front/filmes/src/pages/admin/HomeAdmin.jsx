import React from 'react'
import { Link } from 'react-router-dom'

import NavBar from '../../components/NavBar/NavBar'
import GiraGira from '../../components/GiraGira/GiraGira'

import '../../styles/homeAdmin.css'
import '../../index.css'
import Footer from '../../components/Footer/Footer'

export default function HomeAdmin() {
    return (
        <main className='mainPadrao'>
            <GiraGira />
            
            <div className='formatacao'>
                <div className='containerInfoHome'>
                    <NavBar />
                </div>
                
                
                <div className="adminContainer">
                    {/* Coluna 1: Adicionar Filmes */}
                    <Link to="/AddFilme" className="adminCard cardLaranja">
                        <h3>ADICIONAR FILMES</h3>
                        <p>Cadastre novos filmes no sistema</p>
                    </Link>

                    {/* Coluna 2: Validar Filmes (Onde ele aprova) */}
                    <Link to="/validacao" className="adminCard cardRosa">
                        <h3>VALIDAR NOVOS FILMES</h3>
                        <p>Aprove ou rejeite sugestões</p>
                    </Link>

                    {/* Coluna 3: Listar/Deletar Filmes */}
                    <Link to="/AllFilmes" className="adminCard cardAmarelo">
                        <h3>DELETAR FILMES</h3>
                        <p>Visualize e gerencie o catálogo</p>
                    </Link>
                </div>

                <Footer />
            </div>
        </main>
    );
}