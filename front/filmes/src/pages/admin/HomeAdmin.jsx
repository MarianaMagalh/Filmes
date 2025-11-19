import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar'; // Seu NavBar
import '../../styles/homeAdmin.css'; // Você precisará criar esse CSS para as 3 colunas

export default function HomeAdmin() {
    return (
        <main className='mainPadrao'>
            <div className='formatacao'>
                <NavBar />
                
                <h2 className='titlePage'>Painel Administrativo</h2>

                <div className="admin-dashboard-container">
                    {/* Coluna 1: Adicionar Filmes */}
                    <Link to="/AddFilme" className="admin-card card-laranja">
                        <h3>ADICIONAR FILMES</h3>
                        <p>Cadastre novos filmes no sistema</p>
                    </Link>

                    {/* Coluna 2: Validar Filmes (Onde ele aprova) */}
                    <Link to="/admin/validacao" className="admin-card card-rosa">
                        <h3>VALIDAR NOVOS FILMES</h3>
                        <p>Aprove ou rejeite sugestões</p>
                    </Link>

                    {/* Coluna 3: Listar/Deletar Filmes */}
                    <Link to="/AllFilmes" className="admin-card card-amarelo">
                        <h3>DELETAR FILMES</h3>
                        <p>Visualize e gerencie o catálogo</p>
                    </Link>
                </div>
            </div>
        </main>
    );
}