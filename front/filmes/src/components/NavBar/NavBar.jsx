import React, { useState } from 'react'; // Importe o useState
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // 1. Importe o Contexto

// Imagens
import Logo from '../../assets/imgs/Logo.png';
import IconePerfil from '../../assets/imgs/iconPerfil.png'; // Renomeei para não confundir

// Componente do Menu Flutuante
import Perfil from '../PerfilUser/Perfil'; // Certifique-se que o caminho está certo!

import './navbar.css';
import '../../index.css';

export default function NavBar() {
    // Estado para abrir/fechar o menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // 2. Pega a informação se é Admin direto do contexto
    const { isAdmin } = useAuth(); 

    return (
        <header>
            <div className='allElements'>
                <figure className='imgLogoNav'>
                    <img src={Logo} alt="logo Amores & Morangos" />
                </figure>

                <h1 className='titleNav'>Amores & Morangos</h1>

                <nav>
                    <ul>
                        <li><Link to="/Home">Home</Link></li>
                        <li><Link to="/AllFilmes">Filmes</Link></li>
                        <li><Link to="/AddFilme">Adicionar Filmes</Link></li>
                        
                        {/* Renderização Condicional */}
                        {/* Esse link só aparece se isAdmin for verdadeiro */}
                        {isAdmin && (
                             <li>
                                <Link to="/validacao">
                                    Validar Filmes
                                </Link>
                             </li>
                        )}

                        {/* Botão de Perfil */}
                        <li style={{ position: 'relative' }}>
                            <button 
                                className='imgPerfil' 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                style={{ cursor: 'pointer', background: 'none', border: 'none' }}
                            >
                                <figure>
                                    <img src={IconePerfil} alt="Perfil" />
                                </figure>
                            </button>

                            {/* Menu Flutuante (aparece se isMenuOpen for true) */}
                            {isMenuOpen && (
                                <Perfil onClose={() => setIsMenuOpen(false)} />
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}